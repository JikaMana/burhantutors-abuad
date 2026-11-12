// @ts-nocheck
const GENERIC_RULES = `No past-question PDF has been loaded for this course yet. Write questions from the standard first-year (100-level) university syllabus for the course and topics named. Keep them at the difficulty of Nigerian university CBT exams, especially ABUAD 100-level papers. Do not claim they are past questions.`;

export const COURSES = {
  "MTH 101": {
    label: "MTH 101",
    name: "Mathematics",
    grounded: true,
    topics: [
      "Complex numbers",
      "Sequences and series",
      "Quadratic equations",
      "Sets",
      "Matrices",
      "Number systems",
    ],
    source: `ABUAD MTH 101 practice drawn from the supplied assignment (PDFs/final_pq.pdf).

Use these patterns and difficulty, and write fresh numbers unless you are explicitly returning a known item:
- Complex numbers: z1 = 7 + 3i, z2 = 4 - 2i, sums, products, real and imaginary parts.
- Sequences: a six-term GP with first term 192 and ratio 1.5; arithmetic series with a stated difference.
- Quadratics: x^2 - 4x - 6 = 0 has roots 2 ± sqrt(10); roots of x^2 - x + 1 = 0 satisfy x^3 = -1.
- Sets: symmetric difference, unions and intersections.
- Matrices: simplify 3(A + B) - 2A to A + 3B.
- Number systems: five consecutive integers summing to 100 start at 18; the even numbers from 100 to 998 sum to 247050.

Do not claim a newly invented question is a verbatim past question.`,
  },
  "MTH 103": {
    label: "MTH 103",
    name: "Mathematics",
    grounded: false,
    topics: [
      "Functions and graphs",
      "Limits and continuity",
      "Differentiation",
      "Integration",
      "Trigonometry",
      "Coordinate geometry",
    ],
    source: GENERIC_RULES,
  },
  "PHY 101": {
    label: "PHY 101",
    name: "Physics",
    grounded: false,
    topics: [
      "Units and dimensions",
      "Kinematics",
      "Newton's laws",
      "Work, energy and power",
      "Momentum and collisions",
      "Circular motion and gravitation",
    ],
    source: GENERIC_RULES,
  },
  "PHY 103": {
    label: "PHY 103",
    name: "Physics",
    grounded: false,
    topics: [
      "Electric charge and fields",
      "Electric potential",
      "Capacitors",
      "Current and resistance",
      "Magnetism",
      "Waves and optics",
    ],
    source: GENERIC_RULES,
  },
  STAT: {
    label: "STAT",
    name: "Statistics",
    grounded: false,
    topics: [
      "Descriptive statistics",
      "Probability",
      "Random variables",
      "Binomial and Poisson",
      "Normal distribution",
      "Correlation and regression",
    ],
    source: GENERIC_RULES,
  },
  "CHM 101": {
    label: "CHM 101",
    name: "Chemistry",
    grounded: false,
    topics: [
      "Atomic structure",
      "Periodic table",
      "Chemical bonding",
      "Mole concept and stoichiometry",
      "Gases",
      "Acids, bases and pH",
    ],
    source: GENERIC_RULES,
  },
  "BIO 101": {
    label: "BIO 101",
    name: "Biology",
    grounded: false,
    topics: [
      "Cell biology",
      "Genetics",
      "Classification of organisms",
      "Ecology",
      "Nutrition and digestion",
      "Reproduction and evolution",
    ],
    source: GENERIC_RULES,
  },
};

export const FREE_DAILY = 10;
export const FREE_COURSES_DAILY = 3;
export const CHUNK_MAX = 3;
export const PAID_TEST_MAX = 60;
