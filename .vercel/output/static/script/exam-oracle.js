(function () {
  "use strict";

  var ENDPOINT = "/.netlify/functions/generate-questions";
  var HISTORY_CACHE_TTL = 2 * 60 * 1000;
  var CHUNK = 3; // questions per request (must match server CHUNK_MAX)
  var CONCURRENCY = 2; // parallel requests; keeps us under Gemini's free-tier rate limits
  var MAX_PAID = 60;

  var app = {
    courses: [],
    freeDaily: 10,
    freeCoursesDaily: 3,
    subjectsUsed: 0,
    paid: false,
    sitewidePremium: false,
    promoUntil: "2026-11-20",
    promoActive: false,
    authMode: "firebase",
    localMode: false,
    welcomeTestAvailable: false,
    used: {},
    user: null,
    history: [],
    historyCacheUid: null,
    purchaseAfterAuth: false,
    pendingTest: null,
  };
  var session = null; // the running test

  var $ = function (id) {
    return document.getElementById(id);
  };
  var el = {
    course: $("course-select"),
    topics: $("topic-options"),
    count: $("question-count"),
    notice: $("oracle-notice"),
    builder: $("builder"),
    test: $("test-panel"),
    results: $("results-panel"),
    start: $("start-test"),
    welcome: $("welcome-dialog"),
  };
  var welcomeIndex = 0;
  var welcomeCopy = [
    "Choose a course, then pick the topics you want to practise.",
    "Each question is marked PQ or Oracle Question. Review the explanation after your choice.",
    "Your report shows strong areas and what to work on next.",
  ];

  /* ---------- utilities ---------- */
  function icons() {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
  function promoSentence() {
    var until = app.promoUntil || "2026-11-20";
    var end = new Date(until + "T23:59:59+01:00");
    if (Number.isNaN(end.getTime()) || end.getTime() < Date.now()) return "";
    var days = Math.max(1, Math.ceil((end.getTime() - Date.now()) / 86400000));
    var pretty = end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
    return (
      "Full access is free for " +
      days +
      (days === 1 ? " day" : " days") +
      ", through " +
      pretty +
      "."
    );
  }
  function localUser() {
    var id = store("oracle_local_uid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      store("oracle_local_uid", id);
    }
    return {
      uid: id,
      email: "",
      displayName: "This device",
      getIdToken: function () {
        return Promise.resolve("local:" + id);
      },
    };
  }
  function seenPrompts() {
    var list = store("oracle_seen_v1");
    return Array.isArray(list) ? list : [];
  }
  function rememberSeen(questions) {
    var list = seenPrompts();
    (questions || []).forEach(function (q) {
      var sig = String(q.prompt || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 140);
      if (sig && list.indexOf(sig) === -1) list.push(sig);
    });
    store("oracle_seen_v1", list.slice(-80));
  }
  function originLabel(q) {
    return q && (q.origin === "pq" || q.source === "PQ") ? "PQ" : "Oracle Question";
  }
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }
  function store(key, value) {
    try {
      if (value === undefined)
        return JSON.parse(localStorage.getItem(key) || "null");
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      return null;
    }
  }
  function historyCacheKey() {
    return app.user ? "oracle_history_v1_" + app.user.uid : "";
  }
  function readHistoryCache() {
    if (!app.user) return null;
    try {
      var cached = JSON.parse(
        sessionStorage.getItem(historyCacheKey()) || "null",
      );
      if (cached && Array.isArray(cached.tests)) return cached;
      return readDurableHistory();
    } catch (error) {
      var durable = readDurableHistory();
      return durable;
    }
  }
  function readDurableHistory() {
    if (!app.localMode) return null;
    try {
      var cached = JSON.parse(localStorage.getItem(historyCacheKey()) || "null");
      return cached && Array.isArray(cached.tests) ? cached : null;
    } catch (error) {
      return null;
    }
  }
  function writeHistoryCache(data) {
    if (!app.user) return;
    try {
      sessionStorage.setItem(
        historyCacheKey(),
        JSON.stringify({
          savedAt: Date.now(),
          tests: data.tests || [],
          premiumUntil: data.premiumUntil || null,
          usage: data.usage || {},
        }),
      );
      if (app.localMode) {
        localStorage.setItem(
          historyCacheKey(),
          JSON.stringify({
            savedAt: Date.now(),
            tests: data.tests || [],
            premiumUntil: data.premiumUntil || null,
            usage: data.usage || {},
          }),
        );
      }
    } catch (error) {
      // Session storage is optional; Firestore remains the source of truth.
    }
  }
  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }
  function notify(message, opts) {
    opts = opts || {};
    el.notice.hidden = false;
    el.notice.className =
      "oracle-notice" + (opts.tone ? " is-" + opts.tone : "");
    el.notice.innerHTML =
      "<span>" +
      esc(message) +
      "</span>" +
      (opts.register
        ? ' <a href="/exam-oracle.html#upgrade">Upgrade to paid access <span aria-hidden="true">→</span></a>'
        : "");
    if (!opts.quiet)
      el.notice.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function clearNotice() {
    el.notice.hidden = true;
  }
  function currentCourse() {
    return app.courses.find(function (c) {
      return c.id === el.course.value;
    });
  }
  function remaining(courseId) {
    if (app.paid) return Infinity;
    return Math.max(0, app.freeDaily - (app.used[courseId] || 0));
  }
  function maxForCourse(courseId) {
    return app.paid ? MAX_PAID : Math.min(app.freeDaily, remaining(courseId));
  }
  function chosenTopics() {
    return Array.prototype.map.call(
      el.topics.querySelectorAll("input:checked"),
      function (i) {
        return i.value;
      },
    );
  }

  /* ---------- server ---------- */
  async function headers(extra) {
    var h = { "Content-Type": "application/json" };
    if (app.user) h.Authorization = "Bearer " + (await app.user.getIdToken());
    return Object.assign(h, extra || {});
  }
  async function loadConfig() {
    var res = await fetch(ENDPOINT, { headers: await headers() });
    if (!res.ok) throw new Error("config " + res.status);
    var data = await res.json();
    app.courses = data.courses;
    app.freeDaily = data.freeDaily;
    app.freeCoursesDaily = data.freeCoursesDaily || 3;
    app.subjectsUsed = data.subjectsUsed || 0;
    app.paid = !!data.paid;
    app.sitewidePremium = !!data.sitewidePremium || !!data.promoActive;
    app.promoUntil = data.promoUntil || app.promoUntil;
    app.promoActive = !!data.promoActive;
    app.authMode = data.authMode || app.authMode;
    app.welcomeTestAvailable = false;
    app.used = data.used || {};
  }

  /* ---------- builder UI ---------- */
  function renderCourses() {
    var previous = el.course.value;
    el.course.innerHTML = app.courses
      .map(function (c) {
        return (
          '<option value="' +
          esc(c.id) +
          '">' +
          esc(c.label) +
          " · " +
          esc(c.name) +
          "</option>"
        );
      })
      .join("");
    if (previous) el.course.value = previous;
  }
  function renderTopics() {
    var c = currentCourse();
    if (!c) return;
    el.topics.innerHTML = c.topics
      .map(function (t) {
        return (
          '<label class="oracle-topic-choice"><input type="checkbox" value="' +
          esc(t) +
          '" checked><span>' +
          esc(t) +
          "</span></label>"
        );
      })
      .join("");
    $("course-note").hidden = c.grounded;
    refreshSummary();
  }
  function refreshSummary() {
    var c = currentCourse();
    if (!c) return;
    var max = maxForCourse(c.id);
    var left = remaining(c.id);
    el.count.max = String(Math.max(1, max));
    var n = Number(el.count.value);
    if (n > max && max > 0) el.count.value = String(max);
    var topics = chosenTopics().length;
    $("sum-course").textContent = c.label + " · " + c.name;
    $("sum-topics").textContent = topics + " of " + c.topics.length;
    $("sum-count").textContent =
      Math.min(Number(el.count.value) || 0, Math.max(max, 0)) || "0";
    var meter = $("quota-meter");
    var note = $("question-limit-note");
    var courseLimitReached = false;
    if (app.paid) {
      meter.hidden = true;
      $("plan-badge").textContent = app.sitewidePremium
        ? "Free through 20 Nov"
        : "Full access";
      note.textContent = app.sitewidePremium
        ? promoSentence() + " Up to " + MAX_PAID + " questions per test."
        : "Up to " + MAX_PAID + " questions per test, any day.";
    } else {
      meter.hidden = false;
      $("plan-badge").textContent = "Free plan";
      var used = app.freeDaily - left;
      $("quota-text").textContent =
        left +
        " of " +
        app.freeDaily +
        " free " +
        c.label +
        " questions left today";
      meter
        .querySelector("i")
        .style.setProperty(
          "--score",
          Math.round((used / app.freeDaily) * 100) + "%",
        );
      courseLimitReached =
        !(app.used[c.id] > 0) && app.subjectsUsed >= app.freeCoursesDaily;
      note.textContent = courseLimitReached
        ? "You've used all " +
          app.freeCoursesDaily +
          " free courses today. Upgrade or come back tomorrow."
        : "Free plan: " +
          app.freeDaily +
          " questions per course, up to " +
          app.freeCoursesDaily +
          " courses per day (" +
          app.subjectsUsed +
          " used). Resets at midnight Lagos time.";
    }
    el.start.disabled = max < 1 || courseLimitReached;
  }

  /* ---------- question loading ---------- */
  function topicsForBatch(topics, i) {
    // Rotate focus so every selected topic is covered evenly across the test.
    var out = [topics[i % topics.length]];
    if (topics.length > 1) out.push(topics[(i + 1) % topics.length]);
    return out;
  }

  async function fetchBatch(s, size, batchNo) {
    var attempt = 0;
    while (attempt < 4) {
      if (s.cancelled) throw new Error("cancelled");
      attempt++;
      var res, body;
      try {
        res = await fetch(ENDPOINT, {
          method: "POST",
          headers: await headers(),
          body: JSON.stringify({
            course: s.course,
            topics: topicsForBatch(s.topics, batchNo),
            count: size,
            batch: batchNo,
            avoid: seenPrompts()
              .concat(
                s.questions.slice(-12).map(function (q) {
                  return q.prompt.slice(0, 140);
                }),
              )
              .slice(-24),
          }),
        });
        body = await res.json().catch(function () {
          return {};
        });
      } catch (e) {
        res = null;
        body = {};
      }
      if (res && res.ok && body.questions && body.questions.length) {
        rememberSeen(body.questions);
        if (!app.paid && typeof body.used === "number") {
          app.used[s.course] = body.used;
          app.subjectsUsed = body.subjectsUsed || app.subjectsUsed;
        }
        return body.questions;
      }
      if (res && body.code === "subject_limit") {
        app.subjectsUsed = body.subjectsUsed || app.freeCoursesDaily;
        var courseErr = new Error(body.error);
        courseErr.fatal = true;
        courseErr.courseLimit = true;
        throw courseErr;
      }
      if (res && body.code === "quota") {
        app.used[s.course] = app.freeDaily;
        var err = new Error(body.error);
        err.fatal = true;
        err.quota = true;
        throw err;
      }
      if (
        res &&
        (res.status === 403 || (res.status === 503 && body.code === "config"))
      ) {
        var fatal = new Error(
          res.status === 503 && body.code === "config"
            ? "Exam Oracle isn't configured yet."
            : "Oracle couldn't reach its question engine (code " +
                (body.providerStatus || res.status) +
                "). Please try again shortly.",
        );
        fatal.fatal = true;
        throw fatal;
      }
      var transient =
        !res ||
        [429, 502, 503, 504].indexOf(res.status) !== -1 ||
        body.code === "capacity" ||
        body.code === "timeout" ||
        body.code === "provider";
      if (attempt < 4 && transient) {
        var retryDelay = Math.min(8000, 1200 * Math.pow(2, attempt - 1));
        await sleep(retryDelay + Math.floor(Math.random() * 500));
      } else if (!transient) {
        var requestErr = new Error(
          body.error || "The request could not be completed.",
        );
        requestErr.fatal = true;
        throw requestErr;
      }
    }
    throw new Error("Oracle is busy. Please try again in a moment.");
  }

  function queueTestActivity(test, payload) {
    test.activityQueue = (test.activityQueue || Promise.resolve())
      .catch(function () {})
      .then(async function () {
        var res = await fetch("/.netlify/functions/test-history", {
          method: "POST",
          headers: await headers(),
          body: JSON.stringify(
            Object.assign(
              {
                id: test.id,
                course: test.courseLabel,
                topics: test.topics,
                total: test.total,
              },
              payload,
            ),
          ),
        });
        var body = await res.json().catch(function () {
          return {};
        });
        if (!res.ok) throw new Error(body.error || "Activity sync failed.");
      });
    return test.activityQueue;
  }

  async function runLoader(s) {
    var requests = 0;
    var maxRequests = Math.ceil(s.total / CHUNK) + 6;
    var worker = async function () {
      while (!s.cancelled && !s.failed) {
        var need = s.total - s.questions.length - s.inflight;
        if (need <= 0 || requests >= maxRequests) return;
        var size = Math.min(CHUNK, need);
        var batchNo = requests++;
        s.inflight += size;
        try {
          var qs = await fetchBatch(s, size, batchNo);
          qs.forEach(function (q) {
            s.questions.push(q);
          });
          onQuestionsArrived();
        } catch (e) {
          if (e.message !== "cancelled") s.failed = e;
        } finally {
          s.inflight -= size;
        }
      }
    };
    var workers = [];
    var workerCount = app.paid ? CONCURRENCY : 1;
    for (var i = 0; i < workerCount; i++) {
      // small stagger so the two first requests don't hit the API in the same instant
      workers.push(
        (function (delay) {
          return sleep(delay).then(worker);
        })(i * 700),
      );
    }
    await Promise.all(workers);
    s.done = true;
    if (s.cancelled) return;
    if (s.questions.length < s.total) s.total = s.questions.length;
    onQuestionsArrived();
  }

  function onQuestionsArrived() {
    if (!session) return;
    updateProgress();
    if (session.waiting) {
      if (session.index < session.questions.length) {
        session.waiting = false;
        renderQuestion();
      } else if (session.done) {
        session.waiting = false;
        finishOrFail();
      }
    }
    refreshSummary();
  }

  /* ---------- test flow ---------- */
  async function startTest() {
    if (!app.user) {
      app.pendingTest = false;
      openAccount();
      accountStatus(
        "Create an account or sign in before starting a test.",
        "bad",
      );
      return;
    }
    var c = currentCourse();
    if (!c) return;
    var topics = chosenTopics();
    if (!topics.length)
      return notify("Choose at least one topic to build your test.", {
        tone: "warn",
      });

    var requested = Number(el.count.value);
    if (!Number.isInteger(requested) || requested < 1)
      return notify("Enter a question count of at least 1.", { tone: "warn" });

    var left = remaining(c.id);
    if (
      !app.paid &&
      !(app.used[c.id] > 0) &&
      app.subjectsUsed >= app.freeCoursesDaily
    ) {
      return notify(
        "You've used all " +
          app.freeCoursesDaily +
          " free courses today. Upgrade or come back tomorrow.",
        { register: true },
      );
    }
    if (left < 1) {
      return notify(
        "You've used your " +
          app.freeDaily +
          " free " +
          c.label +
          " questions for today. Upgrade or come back tomorrow.",
        {
          register: true,
        },
      );
    }
    if (!app.paid && requested > left) requested = left;
    if (requested > MAX_PAID) requested = MAX_PAID;

    session = {
      id: Date.now(),
      course: c.id,
      courseLabel: c.label,
      topics: topics,
      total: requested,
      questions: [],
      answers: [],
      index: 0,
      inflight: 0,
      done: false,
      failed: null,
      cancelled: false,
      waiting: true,
      solutionsViewed: 0,
      paid: app.paid,
    };
    clearNotice();
    el.builder.hidden = true;
    el.results.hidden = true;
    el.test.hidden = false;
    showLoading(true);
    updateProgress();
    el.test.scrollIntoView({ behavior: "smooth", block: "start" });
    queueTestActivity(session, { action: "start" }).catch(function (error) {
      console.warn("Could not save test start", error?.message);
    });
    runLoader(session);
  }

  function showLoading(on) {
    $("question-loading").hidden = !on;
    $("question-content").hidden = on;
    $("next-question").disabled = true;
    if (on) {
      var s = session;
      $("load-text").textContent =
        s.questions.length === 0
          ? "Writing your first questions…"
          : "Preparing your next question…";
    }
  }
  function updateProgress() {
    var s = session;
    if (!s) return;
    var pos = Math.min(s.index + 1, s.total || 1);
    $("question-progress").textContent = "QUESTION " + pos + " / " + s.total;
    var done = s.answers.length;
    $("test-progress-bar").style.setProperty(
      "--score",
      Math.round((done / Math.max(s.total, 1)) * 100) + "%",
    );
    $("test-progress").setAttribute("aria-valuenow", String(done));
    $("test-progress").setAttribute("aria-valuemax", String(s.total));
    var loaded = s.questions.length;
    var status = $("load-status");
    if (!s.done && loaded < s.total) {
      status.hidden = false;
      status.textContent = "Loaded " + loaded + " of " + s.total;
    } else {
      status.hidden = true;
    }
  }

  function renderQuestion() {
    var s = session;
    var q = s.questions[s.index];
    showLoading(false);
    updateProgress();
    $("question-topic").innerHTML =
      '<span class="oracle-origin-badge' +
      (originLabel(q) === "PQ" ? " is-pq" : "") +
      '">' +
      esc(originLabel(q)) +
      "</span>" +
      esc(q.topic);
    $("question-prompt").textContent = q.prompt;
    $("answer-options").innerHTML = q.options
      .map(function (o, i) {
        return (
          '<button type="button" class="oracle-answer-option" data-answer="' +
          i +
          '"><span class="oracle-option-key">' +
          String.fromCharCode(65 + i) +
          "</span><span>" +
          esc(o) +
          "</span></button>"
        );
      })
      .join("");
    $("answer-feedback").hidden = true;
    $("show-step").hidden = true;
    $("step-solution").hidden = true;
    $("step-solution").innerHTML = "";
    $("next-question").disabled = true;
    $("next-label").textContent =
      s.index + 1 >= s.total ? "See my report" : "Next question";
    Array.prototype.forEach.call(
      document.querySelectorAll(".oracle-answer-option"),
      function (b) {
        b.addEventListener("click", function () {
          answerQuestion(Number(b.dataset.answer));
        });
      },
    );
    $("question-prompt").focus({ preventScroll: true });
  }

  function answerQuestion(selected) {
    var s = session;
    var q = s.questions[s.index];
    if (s.answers.length > s.index) return; // already answered
    var correct = selected === q.answer;
    s.answers.push({ question: q, selected: selected, correct: correct });
    queueTestActivity(s, {
      action: "answer",
      index: s.index,
      answer: {
        topic: q.topic,
        prompt: q.prompt,
        options: q.options,
        selected: selected,
        correctAnswer: q.answer,
        correct: correct,
      },
    }).catch(function (error) {
      console.warn("Could not save answer activity", error?.message);
    });
    Array.prototype.forEach.call(
      document.querySelectorAll(".oracle-answer-option"),
      function (b) {
        b.disabled = true;
        var v = Number(b.dataset.answer);
        if (v === q.answer) b.classList.add("is-correct");
        if (v === selected && !correct) b.classList.add("is-wrong");
      },
    );
    var fb = $("answer-feedback");
    fb.hidden = false;
    fb.className =
      "oracle-answer-feedback " + (correct ? "is-correct" : "is-wrong");
    fb.textContent = correct
      ? "Correct. Nice work."
      : "Not quite. The correct answer is " +
        String.fromCharCode(65 + q.answer) +
        ": " +
        q.options[q.answer];
    $("show-step").hidden = false;
    $("next-question").disabled = false;
    updateProgress();
    icons();
  }

  function showSolution() {
    var q = session.questions[session.index];
    var box = $("step-solution");
    box.innerHTML =
      '<p class="font-semibold text-ink mb-3">Step-by-step</p><ol>' +
      q.steps
        .map(function (st) {
          return "<li>" + esc(st) + "</li>";
        })
        .join("") +
      "</ol>";
    box.hidden = false;
    $("show-step").hidden = true;
    session.solutionsViewed++;
    queueTestActivity(session, {
      action: "solution",
      index: session.index,
      topic: q.topic,
    }).catch(function (error) {
      console.warn("Could not save solution activity", error?.message);
    });
    if (!session.paid && session.solutionsViewed === 2)
      setTimeout(showRegister, 250);
  }
  function showRegister() {
    $("register-prompt").hidden = false;
    icons();
  }

  function goNext() {
    var s = session;
    if (!s || s.answers.length <= s.index) return;
    s.index++;
    if (s.index >= s.total) return finishTest();
    if (s.index < s.questions.length) return renderQuestion();
    if (s.done) return finishOrFail();
    s.waiting = true;
    showLoading(true);
  }
  function finishOrFail() {
    if (session.answers.length) finishTest();
    else {
      endSession();
      notify(
        (session.failed && session.failed.message) ||
          "Oracle couldn't create questions right now. Please try again.",
        {
          tone: "warn",
          register: !!(session.failed && session.failed.courseLimit),
        },
      );
    }
  }

  function endSession() {
    if (session) {
      session.cancelled = true;
      if (!session.completed) {
        queueTestActivity(session, { action: "abandon" }).catch(
          function (error) {
            console.warn("Could not save test abandonment", error?.message);
          },
        );
      }
    }
    el.test.hidden = true;
    el.results.hidden = true;
    el.builder.hidden = false;
    refreshSummary();
    el.builder.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function finishTest() {
    var s = session;
    s.cancelled = true;
    s.completed = true;
    el.test.hidden = true;
    el.builder.hidden = true;
    el.results.hidden = false;
    var answers = s.answers;
    var correct = answers.filter(function (a) {
      return a.correct;
    }).length;
    var score = Math.round((correct / answers.length) * 100);
    var topics = {};
    answers.forEach(function (a) {
      var t = (topics[a.question.topic] = topics[a.question.topic] || {
        correct: 0,
        total: 0,
      });
      t.total++;
      if (a.correct) t.correct++;
    });
    var weak = [];
    var topicReport = Object.keys(topics)
      .map(function (name) {
        var p = Math.round((topics[name].correct / topics[name].total) * 100);
        if (p < 70) weak.push(name);
        return (
          '<div class="oracle-result-topic"><span>' +
          esc(name) +
          '</span><strong class="' +
          (p >= 70 ? "topic-strong" : "topic-weak") +
          '">' +
          (p >= 70 ? "Strong" : "Needs work") +
          " · " +
          p +
          "% (" +
          topics[name].correct +
          "/" +
          topics[name].total +
          ')</strong><i style="--score:' +
          p +
          '%"></i></div>'
        );
      })
      .join("");
    var missed = answers
      .filter(function (a) {
        return !a.correct;
      })
      .map(function (a, i) {
        return (
          '<article class="oracle-missed-item"><p class="eyebrow text-clay">' +
          esc(a.question.topic) +
          " · Review " +
          (i + 1) +
          "</p><h4>" +
          esc(a.question.prompt) +
          '</h4><p class="oracle-correct-answer">Correct answer: ' +
          esc(a.question.options[a.question.answer]) +
          "</p><ol>" +
          a.question.steps
            .map(function (st) {
              return "<li>" + esc(st) + "</li>";
            })
            .join("") +
          "</ol></article>"
        );
      })
      .join("");

    el.results.innerHTML =
      '<div class="oracle-results-top"><div><p class="eyebrow text-clay">Test complete · ' +
      esc(s.courseLabel) +
      '</p><h2 class="font-display text-3xl font-bold text-ink mt-2">Your learning report</h2></div><div class="oracle-score">' +
      score +
      "<span>%</span></div></div>" +
      '<p class="text-ink/60 mt-3">' +
      correct +
      " of " +
      answers.length +
      ' answers correct</p><div class="oracle-results-grid"><section><h3 class="font-display font-bold text-ink">Topic strengths</h3><div class="oracle-result-topics">' +
      topicReport +
      '</div></section><section><h3 class="font-display font-bold text-ink">Your next move</h3><p class="text-sm text-ink/60 leading-relaxed mt-3">' +
      (weak.length
        ? "Focus on " +
          esc(weak.join(", ")) +
          ". Practise those topics again, then mix everything back in."
        : "Good foundation across every topic. Keep practising to make it stick.") +
      "</p>" +
      (!s.paid
        ? '<a href="#upgrade" class="btn btn-ghost-light mt-4">Explore Oracle plans</a>'
        : "") +
      "</section></div>" +
      (missed
        ? '<section class="oracle-missed"><h3 class="font-display font-bold text-ink">Step-by-step solutions for missed questions</h3><div class="oracle-missed-list">' +
          missed +
          "</div></section>"
        : '<p class="oracle-all-correct">All correct. Nothing to review this time.</p>') +
      '<p id="history-save-status" class="text-sm text-ink/60 mt-4" role="status">Saving your result to your account…</p><button id="retry-history-save" class="btn btn-ghost-light mt-2" type="button" hidden>Retry saving</button>' +
      '<div class="flex flex-wrap gap-3 mt-7">' +
      (weak.length
        ? '<button id="retry-weak" class="btn btn-clay px-6 py-3.5" type="button">Practise weak topics</button>'
        : "") +
      '<button id="again-test" class="btn btn-ink px-6 py-3.5" type="button"><i data-lucide="rotate-ccw" class="w-4 h-4"></i>Build another test</button></div>';

    $("retry-history-save").addEventListener("click", function () {
      saveTestHistory(s, correct);
    });
    saveTestHistory(s, correct);
    $("again-test").addEventListener("click", endSession);
    var rw = $("retry-weak");
    if (rw)
      rw.addEventListener("click", function () {
        endSession();
        Array.prototype.forEach.call(
          el.topics.querySelectorAll("input"),
          function (i) {
            i.checked = weak.indexOf(i.value) !== -1;
          },
        );
        refreshSummary();
      });
    el.results.scrollIntoView({ behavior: "smooth", block: "start" });
    refreshSummary();
    icons();
  }

  /* ---------- account and payment ---------- */
  function accountStatus(message, tone) {
    var status = $("account-status");
    status.textContent = message;
    status.className = "or-code-status" + (tone ? " is-" + tone : "");
  }
  function openAccount() {
    var dialog = $("account-dialog");
    if (app.user) {
      $("account-auth-view").hidden = true;
      $("account-profile-view").hidden = false;
      loadTestHistory();
    } else {
      $("account-auth-view").hidden = false;
      $("account-profile-view").hidden = true;
    }
    if (!dialog.open) dialog.showModal();
    icons();
  }
  function renderTestHistory() {
    var target = $("recent-tests");
    if (!app.history.length) {
      target.innerHTML =
        '<p class="oracle-recent-empty">Complete a test and your score will appear here.</p>';
      $("progress-account-note").textContent = !app.user
        ? "Sign in to sync your history across devices."
        : app.localMode
          ? "Your tests are saved on this device."
          : "Your test history is saved to your account.";
      renderLearningMap();
      return;
    }
    target.innerHTML = app.history
      .slice(0, 6)
      .map(function (test) {
        var dateValue = test.completedAt || test.date;
        var timestamp =
          dateValue && (dateValue._seconds || dateValue.seconds || dateValue);
        var dateNumber = Number(timestamp);
        var date = timestamp
          ? new Date(dateNumber < 1e12 ? dateNumber * 1000 : dateNumber)
          : null;
        return (
          '<article class="oracle-recent-item"><strong>' +
          esc(test.course) +
          "</strong><span>" +
          (date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString()
            : "Just completed") +
          " · " +
          Number(test.correct || 0) +
          "/" +
          Number(test.total || 0) +
          " correct</span><b>" +
          Number(test.score || 0) +
          "%</b></article>"
        );
      })
      .join("");
    $("progress-account-note").textContent = app.user
      ? "Synced to " + (app.user.email || "your account") + "."
      : "Saved on this device. Sign in to sync across devices.";
    renderLearningMap();
  }
  function renderLearningMap() {
    var container = $("learning-map-topics");
    var summary = $("learning-map-summary");
    var totals = {};
    app.history.forEach(function (test) {
      (test.topicResults || []).forEach(function (result) {
        var item =
          totals[result.name] ||
          (totals[result.name] = { correct: 0, total: 0 });
        item.correct += Number(result.correct) || 0;
        item.total += Number(result.total) || 0;
      });
    });
    var ranked = Object.keys(totals)
      .filter(function (name) {
        return totals[name].total > 0;
      })
      .map(function (name) {
        return {
          name: name,
          correct: totals[name].correct,
          total: totals[name].total,
          score: Math.round((totals[name].correct / totals[name].total) * 100),
        };
      })
      .sort(function (a, b) {
        return a.score - b.score || b.total - a.total;
      });
    if (!ranked.length) {
      summary.textContent = app.user
        ? "Complete a test to see your personal strengths and focus areas."
        : "Sign in to sync your learning map, or take a test to start one on this device.";
      container.innerHTML =
        '<p class="oracle-map-empty">Your topic progress will appear after your first completed test.</p>';
      return;
    }
    var needsWork = ranked.filter(function (item) {
      return item.score < 70;
    });
    summary.textContent = needsWork.length
      ? "Your next focus: " +
        needsWork
          .slice(0, 2)
          .map(function (item) {
            return item.name;
          })
          .join(" and ") +
        "."
      : "Strong work. Your recent results are at least 70% across every tracked topic.";
    container.innerHTML = ranked
      .slice(0, 4)
      .map(function (item) {
        var focus = item.score < 70;
        return (
          '<div class="oracle-map-row' +
          (focus ? " is-focus" : "") +
          '"><span>' +
          esc(item.name) +
          " · " +
          item.correct +
          "/" +
          item.total +
          "</span><strong>" +
          (focus ? "Focus" : "Strong") +
          " · " +
          item.score +
          '%</strong><i style="--score:' +
          item.score +
          '%"></i></div>'
        );
      })
      .join("");
  }
  async function loadTestHistory(forceRefresh) {
    if (!app.user) {
      app.history = [];
      app.historyCacheUid = null;
      renderTestHistory();
      return;
    }
    if (app.historyCacheUid && app.historyCacheUid !== app.user.uid) {
      try {
        sessionStorage.removeItem("oracle_history_v1_" + app.historyCacheUid);
      } catch (error) {
        // Session storage is optional; do not retain the previous user's data in memory.
      }
      app.history = [];
      renderTestHistory();
    }
    app.historyCacheUid = app.user.uid;
    var cached = readHistoryCache();
    var cacheFresh = cached && Date.now() - cached.savedAt < HISTORY_CACHE_TTL;
    if (cached && !forceRefresh) {
      app.history = cached.tests;
      renderTestHistory();
      updateProfileHistory(cached);
      if (cacheFresh) return;
    }
    try {
      var res = await fetch("/.netlify/functions/test-history", {
        headers: await headers(),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || "History unavailable.");
      app.history = data.tests || [];
      writeHistoryCache(data);
      updateProfileHistory(data);
      renderTestHistory();
    } catch (error) {
      if (!cached) {
        $("recent-tests").innerHTML =
          '<p class="oracle-recent-empty">Could not load your saved tests. Refresh to try again.</p>';
      }
    }
  }
  function invalidateHistoryCache() {
    if (!app.user) return;
    try {
      sessionStorage.removeItem(historyCacheKey());
    } catch (error) {
      // Session storage is optional; the next request still refreshes from Firestore.
    }
  }
  function updateProfileHistory(data) {
    var until = data.premiumUntil ? new Date(data.premiumUntil) : null;
    $("profile-premium-expiry").textContent = until
      ? "Until " + until.toLocaleDateString()
      : "";
    var today = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 10);
    var usage = data.usage || {};
    var todayUsage = usage.paidQuestionsByDay || {};
    $("profile-usage").textContent =
      Number(usage.paidQuestionsTotal || 0) +
      " paid questions total · " +
      Number(todayUsage[today] || 0) +
      " today";
    var courseUsage = usage.paidQuestionsByCourse || {};
    $("profile-usage-courses").textContent = Object.keys(courseUsage).length
      ? "By course: " +
        Object.keys(courseUsage)
          .map(function (course) {
            return course + " " + Number(courseUsage[course] || 0);
          })
          .join(" · ")
      : "";
  }
  async function saveTestHistory(test, correct) {
    var topicResults = {};
    test.answers.forEach(function (answer) {
      var topic =
        topicResults[answer.question.topic] ||
        (topicResults[answer.question.topic] = { correct: 0, total: 0 });
      topic.total++;
      if (answer.correct) topic.correct++;
    });
    var entry = {
      id: test.id,
      course: test.courseLabel,
      topics: test.topics,
      total: test.answers.length,
      correct: correct,
      score: Math.round((correct / test.answers.length) * 100),
      topicResults: Object.keys(topicResults).map(function (name) {
        return {
          name: name,
          correct: topicResults[name].correct,
          total: topicResults[name].total,
        };
      }),
      date: Date.now(),
    };
    if (!app.user) throw new Error("Sign in to save test history.");
    try {
      if (test.activityQueue) {
        await test.activityQueue.catch(function (error) {
          console.warn("Some test activity did not sync", error?.message);
        });
      }
      var res = await fetch("/.netlify/functions/test-history", {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify({
          id: entry.id,
          course: entry.course,
          topics: entry.topics,
          total: entry.total,
          correct: entry.correct,
          topicResults: entry.topicResults,
          answers: test.answers.map(function (answer) {
            return {
              topic: answer.question.topic,
              prompt: answer.question.prompt,
              options: answer.question.options,
              selected: answer.selected,
              correctAnswer: answer.question.answer,
              correct: answer.correct,
            };
          }),
        }),
      });
      if (!res.ok) throw new Error("History save failed with " + res.status);
      app.history = [entry]
        .concat(
          app.history.filter(function (saved) {
            return String(saved.id || "") !== String(entry.id);
          }),
        )
        .slice(0, 20);
      var cached = readHistoryCache();
      writeHistoryCache({
        tests: app.history,
        premiumUntil: cached?.premiumUntil,
        usage: cached?.usage,
      });
      renderTestHistory();
      var saveStatus = $("history-save-status");
      if (saveStatus) {
        saveStatus.textContent = app.localMode
          ? "Saved on this device."
          : "Saved to your account.";
      }
      var retrySave = $("retry-history-save");
      if (retrySave) retrySave.hidden = true;
    } catch (error) {
      console.warn("Could not save test history", error?.message);
      $("progress-account-note").textContent =
        "This result could not sync to your account. Keep this page open and retry.";
      $("history-save-status").textContent = "This result is not synced yet.";
      $("retry-history-save").hidden = false;
    }
  }
  async function refreshAccount() {
    await loadConfig();
    $("account-trigger-label").textContent = app.user
      ? app.user.displayName || app.user.email || "Profile"
      : "Sign in";
    $("account-email").textContent = app.user
      ? app.user.email || "Signed in"
      : "";
    $("account-auth-view").hidden = !!app.user;
    $("account-profile-view").hidden = !app.user;
    var hideCommerce = app.paid && !app.sitewidePremium;
    $("profile-plan-label").textContent = app.sitewidePremium
      ? "Free through 20 Nov"
      : app.paid
        ? "Premium access"
        : "Free plan";
    $("buy-premium-label").textContent = app.paid
      ? "Premium access active"
      : "Get paid access · ₦1,500";
    $("profile-buy-premium").textContent = app.paid
      ? "Premium access active"
      : "Get paid access · ₦1,500";
    $("profile-buy-premium").disabled = app.paid;
    $("profile-buy-premium").hidden = app.paid;
    $("upgrade").hidden = hideCommerce;
    var paidPlanNav = $("paid-plan-nav");
    if (paidPlanNav) paidPlanNav.hidden = hideCommerce;
    $("footer-upgrade").hidden = hideCommerce;
    document.querySelectorAll(".oracle-nav-upgrade").forEach(function (link) {
      link.hidden = hideCommerce;
    });
    var buy = $("buy-premium");
    if (buy) buy.hidden = !!(app.sitewidePremium || app.paid);
    refreshSummary();
    await loadTestHistory();
    if (app.user && app.pendingTest !== null) {
      var freeTry = app.pendingTest;
      app.pendingTest = null;
      $("account-dialog").close();
      startTest(freeTry);
    }
  }
  async function signIn(createAccount) {
    if (app.localMode) {
      accountStatus(
        "Practice on this device is ready. Email sign-in is used when the live account service is connected.",
        "ok",
      );
      return;
    }
    var auth = window.firebase.auth();
    var email = $("account-email-input").value.trim();
    var password = $("account-password").value;
    if (!email || !password) {
      accountStatus("Enter your email and password.", "bad");
      return;
    }
    accountStatus(createAccount ? "Creating account…" : "Signing in…");
    try {
      if (createAccount)
        await auth.createUserWithEmailAndPassword(email, password);
      else await auth.signInWithEmailAndPassword(email, password);
      accountStatus(createAccount ? "Account created." : "Signed in.", "ok");
      $("account-dialog").close();
    } catch (error) {
      var messages = {
        "auth/email-already-in-use":
          "An account already uses this email. Sign in instead.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/weak-password": "Choose a password with at least 6 characters.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/operation-not-allowed":
          "Email sign-in is not enabled in Firebase yet.",
      };
      accountStatus(
        messages[error.code] || "Couldn't complete sign-in. Please try again.",
        "bad",
      );
    }
  }
  async function beginPayment() {
    if (!app.user) {
      app.purchaseAfterAuth = true;
      openAccount();
      accountStatus("Sign in or create an account to continue to Paystack.");
      return;
    }
    if (app.paid) return;
    accountStatus("Opening secure Paystack checkout…");
    try {
      sessionStorage.setItem(
        "oracle_checkout_return",
        JSON.stringify({
          hash: window.location.hash || "#setup",
          course: el.course.value,
          count: el.count.value,
          topics: chosenTopics(),
        }),
      );
      var res = await fetch("/.netlify/functions/paystack-initialize", {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify({}),
      });
      var data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Payment couldn't be started.");
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      sessionStorage.removeItem("oracle_checkout_return");
      accountStatus(error.message || "Payment couldn't be started.", "bad");
    }
  }
  function restoreCheckoutReturn() {
    var saved;
    try {
      saved = JSON.parse(
        sessionStorage.getItem("oracle_checkout_return") || "null",
      );
    } catch (error) {
      saved = null;
    }
    if (!saved) return;
    sessionStorage.removeItem("oracle_checkout_return");
    if (
      saved.course &&
      app.courses.some(function (course) {
        return course.id === saved.course;
      })
    ) {
      el.course.value = saved.course;
      renderTopics();
      Array.prototype.forEach.call(
        el.topics.querySelectorAll("input"),
        function (input) {
          input.checked = (saved.topics || []).indexOf(input.value) !== -1;
        },
      );
      if (saved.count) el.count.value = saved.count;
      refreshSummary();
    }
    if (saved.hash)
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.search + saved.hash,
      );
  }
  async function verifyPaymentReturn() {
    var params = new URLSearchParams(window.location.search);
    var reference = params.get("reference") || params.get("trxref");
    if (!reference || params.get("payment") !== "paystack") return;
    if (!app.user) {
      accountStatus("Sign in to verify and activate your payment.", "bad");
      return;
    }
    accountStatus("Verifying your Paystack payment…");
    try {
      var res = await fetch("/.netlify/functions/paystack-verify", {
        method: "POST",
        headers: await headers(),
        body: JSON.stringify({ reference: reference }),
      });
      var data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Payment verification failed.");
      var cached = readHistoryCache() || { tests: [], usage: {} };
      cached.premiumUntil = data.premiumUntil;
      writeHistoryCache(cached);
      window.history.replaceState(
        {},
        "",
        window.location.pathname + window.location.hash,
      );
      await refreshAccount();
      accountStatus(
        "Payment confirmed. Premium access is active until " +
          new Date(data.premiumUntil).toLocaleDateString() +
          ".",
        "ok",
      );
    } catch (error) {
      accountStatus(
        error.message || "Payment verification failed. Please retry.",
        "bad",
      );
    }
  }

  /* ---------- welcome dialog ---------- */
  function updateWelcome() {
    var line = promoSentence();
    welcomeCopy[2] = line
      ? line + " Your report then shows what to work on next."
      : "Your report shows strong areas and what to work on next.";
    $("welcome-title").textContent = welcomeCopy[welcomeIndex];
    $("welcome-step-count").textContent = "0" + (welcomeIndex + 1) + " / 03";
    Array.prototype.forEach.call(
      document.querySelectorAll(".oracle-welcome-dots i"),
      function (d, i) {
        d.classList.toggle("is-active", i === welcomeIndex);
      },
    );
    $("welcome-next").hidden = welcomeIndex === 2;
    $("welcome-try").hidden = welcomeIndex !== 2;
    $("welcome-try").disabled = false;
    $("welcome-try").textContent = "Start practising";
  }

  /* ---------- events ---------- */
  el.course.addEventListener("change", renderTopics);
  el.count.addEventListener("input", refreshSummary);
  el.topics.addEventListener("change", refreshSummary);
  $("topics-all").addEventListener("click", function () {
    Array.prototype.forEach.call(
      el.topics.querySelectorAll("input"),
      function (i) {
        i.checked = true;
      },
    );
    refreshSummary();
  });
  $("topics-none").addEventListener("click", function () {
    Array.prototype.forEach.call(
      el.topics.querySelectorAll("input"),
      function (i) {
        i.checked = false;
      },
    );
    refreshSummary();
  });
  el.start.addEventListener("click", function () {
    startTest();
  });
  $("next-question").addEventListener("click", goNext);
  $("show-step").addEventListener("click", showSolution);
  $("exit-test").addEventListener("click", endSession);
  $("account-open").addEventListener("click", openAccount);
  document.querySelectorAll(".oracle-nav-upgrade").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (!app.user) app.purchaseAfterAuth = true;
      openAccount();
      if (app.user) accountStatus("Choose paid access from your profile.");
    });
  });
  $("account-close").addEventListener("click", function () {
    $("account-dialog").close();
  });
  $("account-dialog").addEventListener("click", function (event) {
    if (event.target === $("account-dialog")) $("account-dialog").close();
  });
  $("sign-in").addEventListener("click", function () {
    signIn(false);
  });
  $("create-account").addEventListener("click", function () {
    signIn(true);
  });
  $("google-sign-in").addEventListener("click", async function () {
    if (app.localMode) {
      accountStatus(
        "Practice on this device is ready. Google sign-in is used when the live account service is connected.",
        "ok",
      );
      return;
    }
    try {
      var provider = new window.firebase.auth.GoogleAuthProvider();
      await window.firebase.auth().signInWithPopup(provider);
      accountStatus("Signed in.", "ok");
      $("account-dialog").close();
    } catch (error) {
      accountStatus(
        error.code === "auth/operation-not-allowed"
          ? "Google sign-in is not enabled in Firebase yet."
          : "Google sign-in could not be completed.",
        "bad",
      );
    }
  });
  $("sign-out").addEventListener("click", function () {
    if (app.localMode) {
      accountStatus(
        "This device stays signed in until the live account service is connected.",
        "ok",
      );
      return;
    }
    invalidateHistoryCache();
    window.firebase.auth().signOut();
  });
  $("buy-premium").addEventListener("click", function (event) {
    event.preventDefault();
    if (!app.user) app.purchaseAfterAuth = true;
    openAccount();
    if (app.user) accountStatus("Choose paid access from your profile.");
  });
  $("profile-buy-premium").addEventListener("click", beginPayment);
  $("skip-welcome").addEventListener("click", function () {
    el.welcome.close();
    store("oracle_welcome_seen", true);
  });
  $("welcome-next").addEventListener("click", function () {
    welcomeIndex++;
    updateWelcome();
  });
  $("welcome-try").addEventListener("click", function () {
    el.welcome.close();
    store("oracle_welcome_seen", true);
    var setup = document.getElementById("setup");
    if (setup) setup.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("close-register").addEventListener("click", function () {
    $("register-prompt").hidden = true;
  });
  $("register-prompt").addEventListener("click", function (e) {
    if (e.target.id === "register-prompt") e.currentTarget.hidden = true;
  });
  // CBT-style keyboard: A-D answer, Enter / right arrow next
  document.addEventListener("keydown", function (e) {
    if (!session || el.test.hidden || e.ctrlKey || e.metaKey || e.altKey)
      return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    var k = e.key.toLowerCase();
    if ("abcd".indexOf(k) !== -1 && k.length === 1) {
      var btn = document.querySelector(
        '.oracle-answer-option[data-answer="' + (k.charCodeAt(0) - 97) + '"]',
      );
      if (btn && !btn.disabled) answerQuestion(k.charCodeAt(0) - 97);
    } else if (
      (k === "enter" || k === "arrowright") &&
      !$("next-question").disabled &&
      tag !== "button"
    ) {
      goNext();
    }
  });

  function finishBootChrome() {
    if (app.sitewidePremium) {
      var upgradeLink = document.querySelector(".oracle-nav-upgrade");
      if (upgradeLink) {
        upgradeLink.href = "#setup";
        upgradeLink.removeAttribute("target");
        upgradeLink.removeAttribute("rel");
        upgradeLink.setAttribute(
          "aria-label",
          "Full access is free through 20 November 2026",
        );
      }
      var premiumLabel = $("nav-premium-label");
      if (premiumLabel) premiumLabel.textContent = "Free through 20 Nov";
    }
    var upgradeCopy = $("upgrade-copy");
    if (upgradeCopy) {
      var line = promoSentence();
      upgradeCopy.textContent = line
        ? line +
          " After that, the free plan is 10 questions per course across up to 3 courses a day. Paid access stays ₦1,500 for six months."
        : "Free access gives you 10 questions per course across up to 3 courses each day. Paid access unlocks up to 60 questions per test.";
    }
    renderCourses();
    renderTopics();
    restoreCheckoutReturn();
  }
  /* ---------- boot ---------- */
  (async function init() {
    el.start.disabled = true;
    try {
      var probe = await fetch(ENDPOINT).then(function (res) {
        if (!res.ok) throw new Error("config " + res.status);
        return res.json();
      });
      if (probe && probe.authMode === "local") {
        app.localMode = true;
        app.user = localUser();
        await refreshAccount();
        await verifyPaymentReturn();
        finishBootChrome();
      } else {
        await window.firebaseReady;
        var auth = window.firebase.auth();
        try {
          await auth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL);
        } catch (error) {
          console.warn(
            "Firebase auth persistence could not be set",
            error?.message,
          );
        }
        await new Promise(function (resolve) {
          var firstAuthState = true;
          auth.onAuthStateChanged(function (user) {
            app.user = user;
            Promise.resolve()
              .then(refreshAccount)
              .then(verifyPaymentReturn)
              .then(function () {
                if (user && app.purchaseAfterAuth) {
                  app.purchaseAfterAuth = false;
                  return beginPayment();
                }
              })
              .then(function () {
                if (firstAuthState) {
                  firstAuthState = false;
                  resolve();
                }
              })
              .catch(function () {
                accountStatus(
                  "Account access could not be loaded. Refresh and try again.",
                  "bad",
                );
                if (firstAuthState) {
                  firstAuthState = false;
                  resolve();
                }
              });
          });
        });
        finishBootChrome();
      }
    } catch (e) {
      notify(
        "Exam Oracle couldn't load its courses. Check your connection and refresh the page.",
        { tone: "warn", quiet: true },
      );
    }
    icons();
    if (
      (!store("oracle_welcome_seen") ||
        new URLSearchParams(window.location.search).get("tour") === "1") &&
      el.welcome &&
      el.welcome.showModal &&
      app.courses.length
    ) {
      updateWelcome();
      el.welcome.showModal();
      icons();
    }
  })();
})();
