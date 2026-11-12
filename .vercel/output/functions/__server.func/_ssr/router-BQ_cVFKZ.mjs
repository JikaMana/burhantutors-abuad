import { o as __toESM } from "../_runtime.mjs";
import { K as require_react, _ as createFileRoute, b as require_jsx_runtime, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BQ_cVFKZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-b0P60TT-.css";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Exam Oracle" },
			{
				name: "theme-color",
				content: "#081423"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var site_default = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1.0\" />\n    <meta\n      name=\"theme-color\"\n      content=\"#081423\" />\n    <meta\n      name=\"description\"\n      content=\"Prepare smarter with Exam Oracle, the ABUAD 100-level practice tool. Try topic-based questions, get instant feedback, and find your current offer.\" />\n    <meta\n      name=\"robots\"\n      content=\"index, follow\" />\n    <meta\n      property=\"og:type\"\n      content=\"website\" />\n    <meta\n      property=\"og:site_name\"\n      content=\"Burhan Tutors ABUAD\" />\n    <meta\n      property=\"og:title\"\n      content=\"Exam Oracle for ABUAD Students | Burhan Tutors\" />\n    <meta\n      property=\"og:description\"\n      content=\"Practice ABUAD 100-level courses with topic-based questions, instant feedback, and clear explanations.\" />\n    <meta\n      property=\"og:url\"\n      content=\"https://abuad.burhantutors.com/\" />\n    <meta\n      property=\"og:image\"\n      content=\"https://abuad.burhantutors.com/images/hero.jpeg\" />\n    <meta\n      name=\"twitter:card\"\n      content=\"summary_large_image\" />\n    <link\n      rel=\"canonical\"\n      href=\"https://abuad.burhantutors.com/\" />\n    <title>Exam Oracle for ABUAD Students | Burhan Tutors</title>\n    <link\n      rel=\"icon\"\n      type=\"image/png\"\n      href=\"/images/burhan-dark.png\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/style.css\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/tailwind.css\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/abuad.css\" />\n    <link\n      rel=\"preconnect\"\n      href=\"https://fonts.googleapis.com\" />\n    <link\n      rel=\"preconnect\"\n      href=\"https://fonts.gstatic.com\"\n      crossorigin />\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap\"\n      rel=\"stylesheet\" />\n    <script src=\"https://unpkg.com/lucide@1.28.0/dist/umd/lucide.min.js\"><\/script>\n  </head>\n  <body class=\"abuad-page\">\n    <a\n      class=\"abuad-skip\"\n      href=\"#main\"\n      >Skip to content</a\n    >\n    <header class=\"abuad-header\">\n      <div class=\"abuad-header-inner\">\n        <a\n          class=\"abuad-brand\"\n          href=\"/\"\n          aria-label=\"Burhan Tutors ABUAD page\">\n          <span>BURHAN <b>TUTORS</b><small>ABUAD 100 LEVEL</small></span>\n        </a>\n        <nav\n          class=\"abuad-nav\"\n          aria-label=\"Page navigation\">\n          <a href=\"#oracle\">Exam Oracle</a>\n          <a href=\"#fees\">Offer</a>\n          <a href=\"#courses\">Tutorials</a>\n        </nav>\n        <a\n          class=\"btn btn-clay abuad-header-cta\"\n          href=\"/exam-oracle.html\">\n          <i\n            data-lucide=\"arrow-up-right\"\n            aria-hidden=\"true\"></i\n          ><span>Explore Oracle</span>\n        </a>\n      </div>\n    </header>\n\n    <main id=\"main\">\n      <section class=\"abuad-hero abuad-oracle-hero\">\n        <div class=\"abuad-hero-copy\">\n          <p class=\"eyebrow\">\n            ABUAD 100 LEVEL <span aria-hidden=\"true\">/</span> EXAM PRACTICE\n          </p>\n          <h1>Exam <span>Oracle.</span></h1>\n          <p class=\"abuad-hero-lede\">\n            Walk into your next exam knowing where you stand. Practise by topic,\n            get instant feedback, and turn weak spots into a clear study plan.\n          </p>\n\n          <div class=\"abuad-hero-actions\">\n            <a\n              class=\"btn btn-clay px-6 py-3.5\"\n              href=\"/exam-oracle.html\"\n              ><i\n                data-lucide=\"arrow-up-right\"\n                aria-hidden=\"true\"></i\n              >Explore Exam Oracle</a\n            >\n            <a\n              class=\"btn btn-ghost-dark px-6 py-3.5\"\n              href=\"#oracle\"\n              >How it helps<i\n                data-lucide=\"arrow-down\"\n                aria-hidden=\"true\"></i\n            ></a>\n          </div>\n          <p class=\"abuad-hero-note\" id=\"home-free-offer\">\n            <i\n              data-lucide=\"circle-check\"\n              aria-hidden=\"true\"></i>\n            <span>Full access is free through 20 November 2026.</span>\n          </p>\n          <p class=\"abuad-hero-note\">\n            <i\n              data-lucide=\"circle-check\"\n              aria-hidden=\"true\"></i>\n            Topic-based practice <span>·</span> Instant feedback\n          </p>\n        </div>\n        <div\n          class=\"abuad-hero-visual\"\n          aria-label=\"Sample Exam Oracle learning report\">\n          <div class=\"abuad-hero-report\">\n            <div class=\"abuad-report-head\">\n              <span>YOUR STUDY SNAPSHOT</span>\n              <i\n                data-lucide=\"scan-search\"\n                aria-hidden=\"true\"></i>\n            </div>\n            <p class=\"abuad-hero-report-course\">\n              MTH 101 <span>·</span> SAMPLE REPORT\n            </p>\n            <div class=\"abuad-report-item\">\n              <span>Algebra</span><strong>Strong</strong\n              ><i style=\"--report-score: 86%\"></i>\n            </div>\n            <div class=\"abuad-report-item\">\n              <span>Quadratics</span\n              ><strong class=\"abuad-needs-work\">Review</strong\n              ><i style=\"--report-score: 48%\"></i>\n            </div>\n            <div class=\"abuad-report-item\">\n              <span>Fractions</span><strong>Strong</strong\n              ><i style=\"--report-score: 78%\"></i>\n            </div>\n            <div class=\"abuad-hero-report-foot\">\n              <span>Next up</span><strong>Review quadratics</strong>\n            </div>\n          </div>\n        </div>\n        <a\n          href=\"#oracle\"\n          class=\"abuad-side-note\"\n          aria-label=\"Scroll to learn about Exam Oracle\"\n          ><span>01</span\n          ><i\n            data-lucide=\"arrow-down-right\"\n            aria-hidden=\"true\"></i\n        ></a>\n      </section>\n\n      <section\n        id=\"oracle\"\n        class=\"abuad-oracle\">\n        <div class=\"abuad-oracle-mark\">\n          <i\n            data-lucide=\"scan-search\"\n            aria-hidden=\"true\"></i\n          ><span>BURHAN TUTORS / EXAM ORACLE</span>\n        </div>\n        <div class=\"abuad-oracle-content\">\n          <div class=\"abuad-oracle-copy\">\n            <p class=\"eyebrow\">A better way to prepare</p>\n            <h2>Practise with a purpose.</h2>\n            <p>\n              Exam Oracle turns practice into useful direction. Choose a course\n              and topics, answer CBT-style questions, then use your results and\n              explanations to decide what to work on next.\n            </p>\n            <div class=\"abuad-oracle-actions\">\n              <a\n                class=\"btn btn-clay px-6 py-3.5\"\n                href=\"/exam-oracle.html\"\n                ><i\n                  data-lucide=\"arrow-up-right\"\n                  aria-hidden=\"true\"></i\n                >See Exam Oracle</a\n              >\n              <a\n                class=\"abuad-text-link\"\n                href=\"#fees\"\n                >View the offer\n                <i\n                  data-lucide=\"arrow-down\"\n                  aria-hidden=\"true\"></i\n              ></a>\n            </div>\n          </div>\n          <div\n            class=\"abuad-oracle-report\"\n            aria-label=\"What you get from each practice session\">\n            <div class=\"abuad-report-head\">\n              <span>FROM PRACTICE TO PROGRESS</span\n              ><i\n                data-lucide=\"ellipsis\"\n                aria-hidden=\"true\"></i>\n            </div>\n            <div class=\"abuad-oracle-step\">\n              <b>01</b\n              ><span\n                ><strong>Choose your focus</strong\n                ><small>Course and topics that matter to you</small></span\n              >\n            </div>\n            <div class=\"abuad-oracle-step\">\n              <b>02</b\n              ><span\n                ><strong>Take a focused test</strong\n                ><small>Build familiarity with CBT-style practice</small></span\n              >\n            </div>\n            <div class=\"abuad-oracle-step\">\n              <b>03</b\n              ><span\n                ><strong>Know what to review</strong\n                ><small\n                  >See your score and step-by-step explanations</small\n                ></span\n              >\n            </div>\n          </div>\n        </div>\n        <p class=\"abuad-oracle-footnote\">\n          Oracle practice currently covers Mathematics, Physics, Chemistry and\n          Biology. Contact us for details on ABUAD course-specific question\n          coverage.\n        </p>\n      </section>\n\n      <section\n        id=\"fees\"\n        class=\"abuad-oracle-offer\">\n        <div>\n          <p class=\"eyebrow\">Current Exam Oracle offer</p>\n          <h2>Start practising for less.</h2>\n          <p>Get Exam Oracle access at the current offer price.</p>\n        </div>\n        <div class=\"abuad-oracle-offer-price\">\n          <a\n            class=\"btn btn-clay\"\n            href=\"/exam-oracle.html\">\n            Explore Exam Oracle<i\n              data-lucide=\"arrow-up-right\"\n              aria-hidden=\"true\"></i>\n          </a>\n        </div>\n      </section>\n\n      <section\n        id=\"courses\"\n        class=\"abuad-courses\">\n        <div class=\"abuad-section-top\">\n          <div>\n            <p class=\"eyebrow text-clay\">Also available</p>\n            <h2>One-to-one course support.</h2>\n          </div>\n          <p>\n            Alongside Exam Oracle, choose an individual course or combine\n            several for structured online tutorial support.\n          </p>\n        </div>\n        <div class=\"abuad-course-grid\">\n          <article class=\"abuad-course\">\n            <span class=\"abuad-course-index\">01</span>\n            <div>\n              <h3>MTH 101</h3>\n              <p>Mathematics</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n          <article class=\"abuad-course\">\n            <span class=\"abuad-course-index\">02</span>\n            <div>\n              <h3>MTH 103</h3>\n              <p>Mathematics</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n          <article class=\"abuad-course\">\n            <span class=\"abuad-course-index\">03</span>\n            <div>\n              <h3>PHY 101</h3>\n              <p>Physics</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n          <article class=\"abuad-course\">\n            <span class=\"abuad-course-index\">04</span>\n            <div>\n              <h3>PHY 103</h3>\n              <p>Physics</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n          <article class=\"abuad-course\">\n            <span class=\"abuad-course-index\">05</span>\n            <div>\n              <h3>STAT</h3>\n              <p>Statistics</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n          <article class=\"abuad-course\">\n            <span class=\"abuad-course-index\">06</span>\n            <div>\n              <h3>CHM 101</h3>\n              <p>Chemistry</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n          <article class=\"abuad-course abuad-course-last\">\n            <span class=\"abuad-course-index\">07</span>\n            <div>\n              <h3>BIO 101</h3>\n              <p>Biology</p>\n            </div>\n            <i\n              data-lucide=\"move-up-right\"\n              aria-hidden=\"true\"></i>\n          </article>\n        </div>\n        <div class=\"abuad-course-footer\">\n          <span>One course at a time, or a plan that covers more.</span\n          ><a\n            href=\"https://wa.me/2348165689362?text=Hello%20Burhan%20Tutors%2C%20I%E2%80%99m%20an%20ABUAD%20100-level%20student.%20I%E2%80%99m%20interested%20in%20these%20courses%3A%20\"\n            target=\"_blank\"\n            rel=\"noopener\"\n            >Tell us what you’re taking\n            <i\n              data-lucide=\"arrow-right\"\n              aria-hidden=\"true\"></i\n          ></a>\n        </div>\n      </section>\n\n      <section\n        id=\"course-fees\"\n        class=\"abuad-fees\">\n        <div class=\"abuad-fees-copy\">\n          <p class=\"eyebrow text-clay\">Tutorial pricing</p>\n          <h2>Need live course support?</h2>\n          <p>\n            Tutorial fees are separate from Exam Oracle access. Ask about class\n            schedules and available course bundles.\n          </p>\n        </div>\n        <div class=\"abuad-fee-detail\">\n          <span>ABUAD academic course</span\n          ><strong>₦5,000 <small>/ course, monthly</small></strong>\n          <!-- <p>Save 15% on 3–4 courses, or 20% on 5 or more courses.</p> -->\n          <div class=\"abuad-fee-actions\">\n            <a\n              class=\"btn btn-ink px-5 py-3\"\n              href=\"#course-fees\"\n              >See plans and details<i\n                data-lucide=\"arrow-up-right\"\n                aria-hidden=\"true\"></i></a\n            ><a\n              href=\"https://wa.me/2348165689362?text=Hello%20Burhan%20Tutors%2C%20please%20help%20me%20choose%20an%20ABUAD%20100-level%20tutorial%20plan.\"\n              target=\"_blank\"\n              rel=\"noopener\"\n              >Ask us on WhatsApp</a\n            >\n          </div>\n        </div>\n      </section>\n    </main>\n\n    <footer class=\"abuad-footer\">\n      <a\n        class=\"abuad-brand\"\n        href=\"/\"\n        aria-label=\"Burhan Tutors ABUAD page\"\n        ><img\n          src=\"/images/burhan-dark.png\"\n          alt=\"\"\n          width=\"38\"\n          height=\"38\" /><span\n          >BURHAN <b>TUTORS</b><small>ABUAD 100 LEVEL</small></span\n        ></a\n      >\n      <p>Focused learning for your first year.</p>\n      <div>\n        <a href=\"https://burhantutors.com/\">Burhan Tutors</a\n        ><a href=\"exam-oracle.html\">Exam Oracle</a\n        ><span>© <span id=\"year\">2026</span> Burhan Tutors</span>\n      </div>\n    </footer>\n    <script>\n      if (window.lucide) window.lucide.createIcons();\n      document.getElementById(\"year\").textContent = new Date().getFullYear();\n      (function () {\n        var end = new Date(\"2026-11-20T23:59:59+01:00\");\n        var offer = document.getElementById(\"home-free-offer\");\n        if (!offer) return;\n        var label = offer.querySelector(\"span\");\n        if (Date.now() > end.getTime()) {\n          offer.hidden = true;\n          return;\n        }\n        var days = Math.max(1, Math.ceil((end.getTime() - Date.now()) / 86400000));\n        var pretty = end.toLocaleDateString(\"en-GB\", {\n          day: \"numeric\",\n          month: \"long\",\n          year: \"numeric\",\n          timeZone: \"Africa/Lagos\",\n        });\n        if (label) {\n          label.textContent =\n            \"Full access is free for \" +\n            days +\n            (days === 1 ? \" day\" : \" days\") +\n            \", through \" +\n            pretty +\n            \".\";\n        }\n      })();\n    <\/script>\n  </body>\n</html>\n";
var $$splitComponentImporter = () => import("./routes-DI5A_Ahr.mjs");
function htmlResponse(body) {
	return new Response(body, { headers: {
		"content-type": "text/html; charset=utf-8",
		"cache-control": "no-cache"
	} });
}
var Route$4 = createFileRoute("/")({
	server: { handlers: { GET: async () => htmlResponse(site_default) } },
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var exam_oracle_default = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1.0\" />\n    <meta\n      name=\"theme-color\"\n      content=\"#081423\" />\n    <meta\n      name=\"description\"\n      content=\"Choose a course, test your understanding, and see exactly where to improve with Burhan Tutors Exam Oracle.\" />\n    <meta\n      property=\"og:type\"\n      content=\"website\" />\n    <meta\n      property=\"og:site_name\"\n      content=\"Burhan Tutors ABUAD\" />\n    <meta\n      property=\"og:title\"\n      content=\"Exam Oracle | Burhan Tutors ABUAD\" />\n    <meta\n      property=\"og:description\"\n      content=\"Practise course topics, get instant feedback, and find what to improve with Exam Oracle.\" />\n    <meta\n      property=\"og:url\"\n      content=\"https://abuad.burhantutors.com/exam-oracle.html\" />\n    <meta\n      property=\"og:image\"\n      content=\"https://abuad.burhantutors.com/images/hero.jpeg\" />\n    <meta\n      name=\"twitter:card\"\n      content=\"summary_large_image\" />\n    <link\n      rel=\"canonical\"\n      href=\"https://abuad.burhantutors.com/exam-oracle.html\" />\n    <title>Exam Oracle | Burhan Tutors</title>\n    <link\n      rel=\"icon\"\n      type=\"image/png\"\n      href=\"/images/burhan-dark.png\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/style.css\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/tailwind.css\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/oracle.css\" />\n    <link\n      rel=\"preconnect\"\n      href=\"https://fonts.googleapis.com\" />\n    <link\n      rel=\"preconnect\"\n      href=\"https://fonts.gstatic.com\"\n      crossorigin />\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap\"\n      rel=\"stylesheet\" />\n    <script\n      defer\n      src=\"https://unpkg.com/lucide@1.28.0/dist/umd/lucide.min.js\"><\/script>\n  </head>\n  <body class=\"theme-cream oracle-page\">\n    <a\n      class=\"or-skip\"\n      href=\"#setup\"\n      >Skip to practice room</a\n    >\n    <header class=\"nav-shell fixed top-0 left-0 w-full z-[65]\">\n      <div\n        class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between\">\n        <a\n          href=\"/\"\n          class=\"site-brand\"\n          aria-label=\"Burhan Tutors home\">\n          <span>BURHAN <b>TUTORS</b></span>\n        </a>\n        <nav\n          class=\"flex items-center gap-5 text-[13px] text-white/70\"\n          aria-label=\"Main navigation\">\n          <a\n            href=\"/\"\n            class=\"hover:text-white\"\n            >Academy</a\n          >\n          <!-- <a\n            href=\"#upgrade\"\n            id=\"paid-plan-nav\"\n            class=\"hover:text-white\"\n            >Paid plan</a\n          > -->\n          <!-- <a\n            href=\"/leaderboard.html\"\n            class=\"hover:text-white\"\n            >Leaderboard</a\n          > -->\n        </nav>\n        <a\n          class=\"btn btn-clay oracle-nav-upgrade\"\n          href=\"#upgrade\"\n          aria-label=\"Upgrade to paid access for 1,500 naira per semester\">\n          <span id=\"nav-premium-label\">Go Premium</span>\n        </a>\n        <button\n          id=\"account-open\"\n          class=\"oracle-account-trigger\"\n          type=\"button\"\n          aria-haspopup=\"dialog\">\n          <i\n            data-lucide=\"user-round\"\n            aria-hidden=\"true\"></i>\n          <span id=\"account-trigger-label\">Sign in</span>\n        </button>\n      </div>\n    </header>\n\n    <main class=\"\">\n      <section class=\"oracle-intro pt-[76px]\">\n        <div class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16\">\n          <div class=\"oracle-intro-copy\">\n            <p class=\"eyebrow text-clay mb-4\">Burhan Tutors · Exam Oracle</p>\n            <h1\n              class=\"font-display text-4xl sm:text-5xl md:text-[58px] font-extrabold leading-[1.02] text-white\">\n              Know what you know.<br /><span class=\"text-clay\"\n                >Find what to fix.</span\n              >\n            </h1>\n            <p class=\"mt-5 max-w-xl text-[16px] leading-relaxed text-white/65\">\n              Practise CBT-style questions for your ABUAD 100-level courses. Get\n              tested instantly, see your strengths, then work through every gap.\n            </p>\n            <div class=\"mt-7 flex flex-wrap gap-3\">\n              <a\n                class=\"btn btn-clay px-6 py-3.5\"\n                href=\"#setup\"\n                ><i\n                  data-lucide=\"play\"\n                  class=\"w-4 h-4\"></i\n                >Start a free test</a\n              >\n              <!-- <a\n                class=\"btn btn-ghost-dark px-6 py-3.5 oracle-intro-upgrade\"\n                href=\"#upgrade\"\n                >Upgrade · ₦1,500/semester</a\n              > -->\n              <!-- <a\n                class=\"btn btn-ghost-dark px-6 py-3.5\"\n                href=\"/leaderboard.html\"\n                ><i\n                  data-lucide=\"trophy\"\n                  class=\"w-4 h-4\"></i\n                >View leaderboard</a\n              > -->\n            </div>\n          </div>\n          <div\n            class=\"oracle-score-preview\"\n            aria-label=\"Your personal topic progress\">\n            <p class=\"eyebrow text-white/45\">Your learning map</p>\n            <p\n              id=\"learning-map-summary\"\n              class=\"oracle-map-summary\">\n              Your topic strengths will take shape as you complete tests.\n            </p>\n            <div\n              id=\"learning-map-topics\"\n              class=\"oracle-map-topics\">\n              <p class=\"oracle-map-empty\">\n                Take a test to build your personal map.\n              </p>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      <section\n        id=\"upgrade\"\n        class=\"oracle-upgrade\">\n        <div class=\"oracle-upgrade-inner\">\n          <div>\n            <p class=\"eyebrow\">Paid access · One semester</p>\n            <h2>More room to practise.</h2>\n            <p id=\"upgrade-copy\">\n              Full access is free through 20 November 2026. After that, the free\n              plan is 10 questions per course across up to 3 courses a day. Paid\n              access is ₦1,500 for six months.\n            </p>\n          </div>\n          <div class=\"oracle-upgrade-action\">\n            <strong>₦1,500 <small>/ semester</small></strong>\n            <p>\n              Sign in and pay securely with Paystack. Access is attached to your\n              account.\n            </p>\n            <a\n              class=\"btn btn-clay px-6 py-3.5\"\n              id=\"buy-premium\"\n              href=\"#setup\">\n              <i\n                data-lucide=\"credit-card\"\n                aria-hidden=\"true\"></i>\n              <span id=\"buy-premium-label\">Get paid access · ₦1,500</span>\n            </a>\n          </div>\n        </div>\n      </section>\n\n      <section\n        id=\"setup\"\n        class=\"oracle-workspace py-12 md:py-16\">\n        <div class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n          <div class=\"oracle-section-heading\">\n            <div>\n              <p class=\"eyebrow text-clay mb-2\">Practice room</p>\n              <h2 class=\"font-display text-3xl sm:text-4xl font-bold text-ink\">\n                Build your test\n              </h2>\n            </div>\n            <div class=\"oracle-plan-actions\">\n              <span\n                id=\"plan-badge\"\n                class=\"or-plan-badge\"\n                >Free plan</span\n              >\n            </div>\n          </div>\n\n          <div\n            id=\"oracle-notice\"\n            class=\"oracle-notice\"\n            role=\"status\"\n            aria-live=\"polite\"\n            hidden></div>\n\n          <div\n            class=\"or-layout\"\n            id=\"builder\">\n            <div class=\"or-form\">\n              <div class=\"or-step\">\n                <label\n                  for=\"course-select\"\n                  class=\"or-step-title\"\n                  ><b>1</b>Choose a course</label\n                >\n                <select\n                  id=\"course-select\"\n                  class=\"oracle-select\"\n                  aria-describedby=\"course-note\"></select>\n                <p\n                  id=\"course-note\"\n                  class=\"or-hint\"\n                  hidden>\n                  Questions for this course follow the standard 100-level\n                  syllabus. They'll match your past questions more closely once\n                  its PDF is added.\n                </p>\n              </div>\n\n              <fieldset class=\"or-step\">\n                <legend class=\"or-step-title\"><b>2</b>Choose topics</legend>\n                <div class=\"or-step-tools\">\n                  <button\n                    type=\"button\"\n                    id=\"topics-all\"\n                    class=\"oracle-text-button\">\n                    Select all\n                  </button>\n                  <button\n                    type=\"button\"\n                    id=\"topics-none\"\n                    class=\"oracle-text-button\">\n                    Clear\n                  </button>\n                </div>\n                <div\n                  id=\"topic-options\"\n                  class=\"oracle-topic-options\"></div>\n              </fieldset>\n\n              <div class=\"or-step\">\n                <label\n                  for=\"question-count\"\n                  class=\"or-step-title\"\n                  ><b>3</b>Number of questions</label\n                >\n                <input\n                  id=\"question-count\"\n                  class=\"oracle-select or-count\"\n                  type=\"number\"\n                  min=\"1\"\n                  max=\"10\"\n                  value=\"10\"\n                  inputmode=\"numeric\" />\n                <p\n                  id=\"question-limit-note\"\n                  class=\"or-hint\"></p>\n              </div>\n            </div>\n\n            <aside\n              class=\"or-summary\"\n              aria-label=\"Test summary\">\n              <p class=\"eyebrow text-white/45\">Your test</p>\n              <dl>\n                <div>\n                  <dt>Course</dt>\n                  <dd id=\"sum-course\">–</dd>\n                </div>\n                <div>\n                  <dt>Topics</dt>\n                  <dd id=\"sum-topics\">–</dd>\n                </div>\n                <div>\n                  <dt>Questions</dt>\n                  <dd id=\"sum-count\">–</dd>\n                </div>\n              </dl>\n              <div\n                id=\"quota-meter\"\n                class=\"or-meter\">\n                <p id=\"quota-text\"></p>\n                <i style=\"--score: 0%\"></i>\n              </div>\n              <button\n                id=\"start-test\"\n                class=\"btn btn-clay w-full py-4 mt-5\"\n                type=\"button\">\n                <i\n                  data-lucide=\"arrow-right\"\n                  class=\"w-4 h-4\"></i\n                >Start test\n              </button>\n              <p class=\"or-summary-note\">\n                Questions load in the background, so you can start after the\n                first few arrive.\n              </p>\n            </aside>\n          </div>\n\n          <section\n            id=\"test-panel\"\n            class=\"oracle-test-panel\"\n            aria-live=\"polite\"\n            hidden>\n            <div class=\"oracle-test-top\">\n              <span\n                id=\"question-progress\"\n                class=\"eyebrow text-clay\"></span>\n              <span\n                id=\"load-status\"\n                class=\"or-load-status\"\n                hidden></span>\n              <button\n                id=\"exit-test\"\n                type=\"button\"\n                class=\"oracle-text-button\">\n                End test\n              </button>\n            </div>\n            <div\n              id=\"test-progress\"\n              class=\"or-progress\"\n              role=\"progressbar\"\n              aria-label=\"Test progress\"\n              aria-valuemin=\"0\"\n              aria-valuenow=\"0\"\n              aria-valuemax=\"1\">\n              <i\n                id=\"test-progress-bar\"\n                style=\"--score: 0%\"></i>\n            </div>\n\n            <div\n              id=\"question-loading\"\n              class=\"or-loading\"\n              hidden>\n              <div\n                class=\"or-spinner\"\n                aria-hidden=\"true\"></div>\n              <p id=\"load-text\">Writing your first questions…</p>\n              <div\n                class=\"or-skeleton\"\n                aria-hidden=\"true\">\n                <i></i><i></i><i></i>\n              </div>\n            </div>\n\n            <div\n              id=\"question-content\"\n              class=\"oracle-question-body\"\n              hidden>\n              <p\n                id=\"question-topic\"\n                class=\"oracle-topic-tag\"></p>\n              <h3\n                id=\"question-prompt\"\n                tabindex=\"-1\"\n                class=\"font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug\"></h3>\n              <div\n                id=\"answer-options\"\n                class=\"oracle-answer-options\"\n                role=\"group\"\n                aria-label=\"Answer options\"></div>\n              <p class=\"or-hint or-kbd\">\n                Tip: press A, B, C or D to answer, then Enter for the next\n                question.\n              </p>\n              <div\n                id=\"answer-feedback\"\n                class=\"oracle-answer-feedback\"\n                aria-live=\"polite\"\n                hidden></div>\n              <button\n                id=\"show-step\"\n                class=\"btn btn-ghost-light mt-5\"\n                type=\"button\"\n                hidden>\n                <i\n                  data-lucide=\"lightbulb\"\n                  class=\"w-4 h-4\"></i\n                >Show step-by-step solution\n              </button>\n              <div\n                id=\"step-solution\"\n                class=\"oracle-step-solution\"\n                hidden></div>\n            </div>\n            <button\n              id=\"next-question\"\n              type=\"button\"\n              class=\"btn btn-ink px-6 py-3.5 mt-8\"\n              disabled>\n              <span id=\"next-label\">Next question</span\n              ><i\n                data-lucide=\"arrow-right\"\n                class=\"w-4 h-4\"></i>\n            </button>\n          </section>\n\n          <section\n            id=\"results-panel\"\n            class=\"oracle-results\"\n            aria-live=\"polite\"\n            hidden></section>\n        </div>\n      </section>\n\n      <section\n        id=\"progress\"\n        class=\"oracle-progress-section\">\n        <div class=\"oracle-progress-inner\">\n          <div class=\"oracle-progress-heading\">\n            <div>\n              <p class=\"eyebrow text-clay\">Your practice record</p>\n              <h2>Recent tests</h2>\n            </div>\n            <span id=\"progress-account-note\"\n              >Sign in to sync your history across devices.</span\n            >\n          </div>\n          <div\n            id=\"recent-tests\"\n            class=\"oracle-recent-tests\">\n            <p class=\"oracle-recent-empty\">\n              Your completed tests will appear here.\n            </p>\n          </div>\n        </div>\n      </section>\n    </main>\n\n    <footer class=\"theme-ink2 py-8\">\n      <div\n        class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-4 text-xs text-white/45\">\n        <span>Burhan Tutors · Exam Oracle</span>\n        <a\n          href=\"#upgrade\"\n          id=\"footer-upgrade\"\n          class=\"hover:text-white\"\n          >Upgrade to paid access</a\n        >\n        <a\n          href=\"/\"\n          class=\"hover:text-white\"\n          >Back to academy</a\n        >\n      </div>\n    </footer>\n\n    <dialog\n      id=\"welcome-dialog\"\n      class=\"oracle-welcome\">\n      <button\n        id=\"skip-welcome\"\n        class=\"oracle-skip\"\n        type=\"button\">\n        Skip\n      </button>\n      <div class=\"oracle-welcome-mark\">\n        <i\n          data-lucide=\"sparkles\"\n          class=\"w-5 h-5\"></i>\n      </div>\n      <p class=\"eyebrow text-clay\">\n        Exam Oracle · <span id=\"welcome-step-count\">01 / 03</span>\n      </p>\n      <h2\n        id=\"welcome-title\"\n        class=\"font-display text-3xl font-bold text-ink mt-4\"></h2>\n      <div\n        class=\"oracle-welcome-dots\"\n        aria-hidden=\"true\">\n        <i></i><i></i><i></i>\n      </div>\n      <button\n        id=\"welcome-next\"\n        class=\"btn btn-ink w-full py-3.5 mt-5\"\n        type=\"button\">\n        Next\n      </button>\n      <button\n        id=\"welcome-try\"\n        class=\"btn btn-clay w-full py-3.5 mt-3\"\n        type=\"button\"\n        hidden>\n        Start practising\n      </button>\n    </dialog>\n\n    <div\n      id=\"register-prompt\"\n      class=\"oracle-register\"\n      role=\"dialog\"\n      aria-modal=\"true\"\n      aria-labelledby=\"register-title\"\n      hidden>\n      <div class=\"oracle-register-panel\">\n        <button\n          id=\"close-register\"\n          class=\"oracle-register-close\"\n          type=\"button\"\n          aria-label=\"Close\">\n          <i\n            data-lucide=\"x\"\n            class=\"w-5 h-5\"></i>\n        </button>\n        <p class=\"eyebrow text-clay\">Keep your momentum</p>\n        <h2\n          id=\"register-title\"\n          class=\"font-display text-2xl font-bold text-ink mt-3\">\n          Understood it? Now master it.\n        </h2>\n        <p class=\"text-sm text-ink/65 mt-3 leading-relaxed\">\n          Register for our live classes and never miss this type of question\n          again.\n        </p>\n        <a\n          class=\"btn btn-clay w-full py-3.5 mt-6\"\n          href=\"/#fees\"\n          ><i\n            data-lucide=\"arrow-up-right\"\n            class=\"w-4 h-4\"></i\n          >See plans and register</a\n        >\n      </div>\n    </div>\n    <dialog\n      id=\"account-dialog\"\n      class=\"oracle-account-dialog\"\n      aria-labelledby=\"account-dialog-title\">\n      <button\n        id=\"account-close\"\n        class=\"oracle-register-close\"\n        type=\"button\"\n        aria-label=\"Close account dialog\">\n        <i\n          data-lucide=\"x\"\n          aria-hidden=\"true\"></i>\n      </button>\n      <div id=\"account-auth-view\">\n        <p class=\"eyebrow text-clay\">Your Exam Oracle account</p>\n        <h2\n          id=\"account-dialog-title\"\n          class=\"font-display text-2xl font-bold text-ink mt-2\">\n          Sign in or create an account\n        </h2>\n        <p class=\"oracle-account-copy\">\n          Sign in to take tests, sync your results, and manage your access.\n        </p>\n        <div class=\"oracle-account-fields\">\n          <label for=\"account-email-input\">Email address</label>\n          <input\n            id=\"account-email-input\"\n            class=\"oracle-select\"\n            type=\"email\"\n            autocomplete=\"email\"\n            placeholder=\"you@example.com\" />\n          <label for=\"account-password\">Password</label>\n          <input\n            id=\"account-password\"\n            class=\"oracle-select\"\n            type=\"password\"\n            autocomplete=\"current-password\"\n            placeholder=\"At least 6 characters\" />\n        </div>\n        <div class=\"or-account-actions\">\n          <button\n            id=\"sign-in\"\n            type=\"button\"\n            class=\"btn btn-ink px-5\">\n            Sign in\n          </button>\n          <button\n            id=\"create-account\"\n            type=\"button\"\n            class=\"btn btn-clay px-5\">\n            Create account\n          </button>\n          <button\n            id=\"google-sign-in\"\n            type=\"button\"\n            class=\"btn btn-ghost-light px-5\">\n            Continue with Google\n          </button>\n        </div>\n      </div>\n      <div\n        id=\"account-profile-view\"\n        hidden>\n        <p class=\"eyebrow text-clay\">Account profile</p>\n        <h2\n          id=\"account-dialog-profile-title\"\n          class=\"font-display text-2xl font-bold text-ink mt-2\">\n          Your profile\n        </h2>\n        <p\n          id=\"account-email\"\n          class=\"or-account-email\"></p>\n        <div class=\"oracle-profile-plan\">\n          <span id=\"profile-plan-label\">Free plan</span>\n          <span id=\"profile-premium-expiry\"></span>\n        </div>\n        <p\n          id=\"profile-usage\"\n          class=\"oracle-profile-usage\">\n          No paid practice recorded yet.\n        </p>\n        <p\n          id=\"profile-usage-courses\"\n          class=\"oracle-profile-usage-courses\"></p>\n        <button\n          id=\"profile-buy-premium\"\n          class=\"btn btn-clay w-full py-3 mt-4\"\n          type=\"button\">\n          Get paid access · ₦1,500\n        </button>\n        <button\n          id=\"sign-out\"\n          type=\"button\"\n          class=\"oracle-text-button mt-5\">\n          Sign out\n        </button>\n      </div>\n      <p\n        id=\"account-status\"\n        class=\"or-code-status\"\n        role=\"status\"\n        aria-live=\"polite\"></p>\n    </dialog>\n    <script\n      defer\n      src=\"https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js\"><\/script>\n    <script\n      defer\n      src=\"https://www.gstatic.com/firebasejs/10.13.0/firebase-auth-compat.js\"><\/script>\n    <script\n      defer\n      src=\"https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore-compat.js\"><\/script>\n    <script>\n      window.firebaseReady = new Promise(function (resolve) {\n        window.addEventListener(\"load\", function () {\n          var firebaseConfig = {\n            apiKey: \"AIzaSyDaIbNnFoxs43TSmfAleFK3oQPuQKog2DU\",\n            authDomain: \"burhan-tutors-website.firebaseapp.com\",\n            projectId: \"burhan-tutors-website\",\n            storageBucket: \"burhan-tutors-website.firebasestorage.app\",\n            messagingSenderId: \"359861270073\",\n            appId: \"1:359861270073:web:516d9da8eb4e8c46613fe8\",\n            measurementId: \"G-XNEE05CQ4E\",\n          };\n\n          if (window.firebase && !window.firebase.apps.length) {\n            window.firebase.initializeApp(firebaseConfig);\n          }\n          resolve(window.firebase);\n        });\n      });\n    <\/script>\n    <script\n      defer\n      src=\"script/exam-oracle.js\"><\/script>\n  </body>\n</html>\n";
var Route$3 = createFileRoute("/exam-oracle.html")({ server: { handlers: { GET: async () => new Response(exam_oracle_default, { headers: {
	"content-type": "text/html; charset=utf-8",
	"cache-control": "no-cache"
} }) } } });
var leaderboard_default = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1.0\" />\n    <meta\n      name=\"theme-color\"\n      content=\"#081423\" />\n    <meta\n      name=\"description\"\n      content=\"See the top Exam Oracle students ranked by improvement, average score and consistency.\" />\n    <meta\n      property=\"og:type\"\n      content=\"website\" />\n    <meta\n      property=\"og:site_name\"\n      content=\"Burhan Tutors ABUAD\" />\n    <meta\n      property=\"og:title\"\n      content=\"Leaderboard | Burhan Tutors ABUAD\" />\n    <meta\n      property=\"og:description\"\n      content=\"See the top Exam Oracle students ranked by improvement, average score and consistency.\" />\n    <meta\n      property=\"og:url\"\n      content=\"https://abuad.burhantutors.com/leaderboard.html\" />\n    <meta\n      property=\"og:image\"\n      content=\"https://abuad.burhantutors.com/images/hero.jpeg\" />\n    <meta\n      name=\"twitter:card\"\n      content=\"summary_large_image\" />\n    <link\n      rel=\"canonical\"\n      href=\"https://abuad.burhantutors.com/leaderboard.html\" />\n    <title>Oracle Leaderboard | Burhan Tutors</title>\n    <link\n      rel=\"icon\"\n      type=\"image/png\"\n      href=\"/images/burhan-dark.png\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/style.css\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/tailwind.css\" />\n    <link\n      rel=\"stylesheet\"\n      href=\"CSS/oracle.css\" />\n    <link\n      rel=\"preconnect\"\n      href=\"https://fonts.googleapis.com\" />\n    <link\n      rel=\"preconnect\"\n      href=\"https://fonts.gstatic.com\"\n      crossorigin />\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap\"\n      rel=\"stylesheet\" />\n    <script\n      defer\n      src=\"https://unpkg.com/lucide@1.28.0/dist/umd/lucide.min.js\"><\/script>\n  </head>\n  <body class=\"theme-ink oracle-page\">\n    <header class=\"nav-shell fixed top-0 left-0 w-full z-[65]\">\n      <div\n        class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between\">\n        <a\n          href=\"/\"\n          class=\"site-brand\"\n          aria-label=\"Burhan Tutors home\">\n          <span>BURHAN <b>TUTORS</b></span>\n        </a>\n        <nav\n          class=\"flex items-center gap-5 text-[13px] text-white/70\"\n          aria-label=\"Main navigation\">\n          <a\n            href=\"/\"\n            class=\"hover:text-white\"\n            >Academy</a\n          >\n          <a\n            href=\"/#fees\"\n            class=\"hover:text-white\"\n            >Pricing</a\n          >\n          <a\n            href=\"/exam-oracle.html\"\n            class=\"hover:text-white\"\n            >Exam Oracle</a\n          >\n          <a\n            href=\"/leaderboard.html\"\n            class=\"text-white\"\n            >Leaderboard</a\n          >\n        </nav>\n        <a\n          href=\"/exam-oracle.html\"\n          class=\"btn btn-clay oracle-nav-upgrade\"\n          >Practice Oracle</a\n        >\n      </div>\n    </header>\n\n    <main class=\"pt-[76px]\">\n      <section\n        id=\"leaderboard\"\n        class=\"theme-ink py-14 md:py-20 min-h-[70vh]\">\n        <div class=\"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\">\n          <div class=\"oracle-leaderboard-heading\">\n            <div>\n              <p class=\"eyebrow text-clay mb-3\">Consistency meets progress</p>\n              <h2\n                class=\"font-display text-3xl sm:text-4xl font-bold text-white\">\n                Oracle leaderboard\n              </h2>\n              <p class=\"text-white/55 text-sm mt-3 max-w-xl\">\n                Publicly viewable. Paid students can participate; rankings weigh\n                improvement on weak topics, average score, capped daily tests,\n                and consistency.\n              </p>\n            </div>\n            <span class=\"oracle-view-only\"\n              ><i\n                data-lucide=\"eye\"\n                class=\"w-4 h-4\"></i\n              >Illustrative preview</span\n            >\n          </div>\n          <div class=\"oracle-table-wrap mt-8\">\n            <table class=\"oracle-table\">\n              <thead>\n                <tr>\n                  <th>Rank</th>\n                  <th>Student</th>\n                  <th>Improvement</th>\n                  <th>Avg. score</th>\n                  <th>Tests</th>\n                  <th>Consistency</th>\n                </tr>\n              </thead>\n              <tbody>\n                <tr class=\"oracle-winner\">\n                  <td>01</td>\n                  <td>\n                    <strong>Amina Yusuf</strong\n                    ><span class=\"oracle-winner-tag\">Weekly winner</span>\n                  </td>\n                  <td>+24 pts</td>\n                  <td>91%</td>\n                  <td>8</td>\n                  <td>6 days</td>\n                </tr>\n                <tr>\n                  <td>02</td>\n                  <td>David Okafor</td>\n                  <td>+21 pts</td>\n                  <td>88%</td>\n                  <td>7</td>\n                  <td>5 days</td>\n                </tr>\n                <tr>\n                  <td>03</td>\n                  <td>Hauwa Bello</td>\n                  <td>+19 pts</td>\n                  <td>86%</td>\n                  <td>8</td>\n                  <td>6 days</td>\n                </tr>\n                <tr>\n                  <td>04</td>\n                  <td>Chinedu Obi</td>\n                  <td>+16 pts</td>\n                  <td>84%</td>\n                  <td>6</td>\n                  <td>5 days</td>\n                </tr>\n                <tr>\n                  <td>05</td>\n                  <td>Fatima Sani</td>\n                  <td>+15 pts</td>\n                  <td>82%</td>\n                  <td>7</td>\n                  <td>5 days</td>\n                </tr>\n                <tr>\n                  <td>06</td>\n                  <td>Samuel James</td>\n                  <td>+13 pts</td>\n                  <td>80%</td>\n                  <td>8</td>\n                  <td>6 days</td>\n                </tr>\n                <tr>\n                  <td>07</td>\n                  <td>Zainab Musa</td>\n                  <td>+11 pts</td>\n                  <td>79%</td>\n                  <td>6</td>\n                  <td>4 days</td>\n                </tr>\n                <tr>\n                  <td>08</td>\n                  <td>Emeka Nwosu</td>\n                  <td>+10 pts</td>\n                  <td>77%</td>\n                  <td>7</td>\n                  <td>5 days</td>\n                </tr>\n                <tr>\n                  <td>09</td>\n                  <td>Maryam Ali</td>\n                  <td>+8 pts</td>\n                  <td>75%</td>\n                  <td>5</td>\n                  <td>4 days</td>\n                </tr>\n                <tr>\n                  <td>10</td>\n                  <td>Peter Eze</td>\n                  <td>+7 pts</td>\n                  <td>73%</td>\n                  <td>6</td>\n                  <td>4 days</td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n          <div class=\"oracle-prize-line\">\n            <p>\n              <strong>Weekly:</strong> ~₦3,000 cash <span>·</span>\n              <strong>Monthly:</strong> next month free\n            </p>\n            <p class=\"text-white/45 text-xs mt-2\">\n              Winners are announced here and on the leaderboard. Winner codes\n              are sent by email; send yours on WhatsApp DM:\n              <a\n                href=\"https://wa.me/2348165689362\"\n                target=\"_blank\"\n                rel=\"noopener\"\n                >08165689362</a\n              >.\n            </p>\n          </div>\n        </div>\n      </section>\n    </main>\n\n    <footer class=\"theme-ink2 py-8\">\n      <div\n        class=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-4 text-xs text-white/45\">\n        <span>Burhan Tutors · Exam Oracle</span>\n        <a\n          href=\"/#fees\"\n          class=\"hover:text-white\"\n          >Plans and payment information</a\n        >\n        <a\n          href=\"/exam-oracle.html\"\n          class=\"hover:text-white\"\n          >Back to Exam Oracle</a\n        >\n      </div>\n    </footer>\n    <script\n      defer\n      src=\"script/leaderboard.js\"><\/script>\n  </body>\n</html>\n";
var Route$2 = createFileRoute("/leaderboard.html")({ server: { handlers: { GET: async () => new Response(leaderboard_default, { headers: {
	"content-type": "text/html; charset=utf-8",
	"cache-control": "no-cache"
} }) } } });
async function handle$1({ request, params }) {
	const { dispatchOracle } = await import("./dispatch-DdfXyzMS.mjs");
	return dispatchOracle(params.name, request);
}
var Route$1 = createFileRoute("/api/$name")({ server: { handlers: {
	GET: handle$1,
	POST: handle$1
} } });
async function handle({ request, params }) {
	const { dispatchOracle } = await import("./dispatch-DdfXyzMS.mjs");
	return dispatchOracle(params.name, request);
}
var Route = createFileRoute("/.netlify/functions/$name")({ server: { handlers: {
	GET: handle,
	POST: handle
} } });
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	ExamOracleDothtmlRoute: Route$3.update({
		id: "/exam-oracle.html",
		path: "/exam-oracle.html",
		getParentRoute: () => Route$5
	}),
	LeaderboardDothtmlRoute: Route$2.update({
		id: "/leaderboard.html",
		path: "/leaderboard.html",
		getParentRoute: () => Route$5
	}),
	ApiNameRoute: Route$1.update({
		id: "/api/$name",
		path: "/api/$name",
		getParentRoute: () => Route$5
	}),
	DotnetlifyFunctionsNameRoute: Route.update({
		id: "/.netlify/functions/$name",
		path: "/.netlify/functions/$name",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter };
