// @ts-nocheck
/** Question assembly: past-question items, verified practice items, and de-duplication. */

export const PROMO_UNTIL = "2026-11-20";

export const PAST_QUESTIONS = {
  "MTH 101": [
    {
      id: "mth101-z-sum",
      topic: "Complex numbers",
      prompt:
        "If z1 = 7 + 3i and z2 = 4 - 2i, what is z1 + z2?",
      options: ["11 + i", "11 + 5i", "3 + 5i", "11 - i"],
      answer: 0,
      steps: [
        "Add the real parts: 7 + 4 = 11.",
        "Add the imaginary parts: 3 + (−2) = 1.",
        "So z1 + z2 = 11 + i.",
      ],
    },
    {
      id: "mth101-z-product",
      topic: "Complex numbers",
      prompt: "If z1 = 7 + 3i and z2 = 4 − 2i, what is z1 × z2?",
      options: ["34 − 2i", "22 − 2i", "34 + 2i", "28 − 6i"],
      answer: 0,
      steps: [
        "(7 + 3i)(4 − 2i) = 28 − 14i + 12i − 6i².",
        "i² = −1, so −6i² = 6.",
        "Real part 28 + 6 = 34. Imaginary part −14 + 12 = −2.",
        "The product is 34 − 2i.",
      ],
    },
    {
      id: "mth101-quad-roots",
      topic: "Quadratic equations",
      prompt: "The roots of x² − 4x − 6 = 0 are",
      options: ["2 ± √10", "4 ± √10", "−2 ± √10", "2 ± √6"],
      answer: 0,
      steps: [
        "Use the quadratic formula with a = 1, b = −4, c = −6.",
        "Discriminant = 16 + 24 = 40 = 4 × 10.",
        "x = [4 ± √40] / 2 = [4 ± 2√10] / 2 = 2 ± √10.",
      ],
    },
    {
      id: "mth101-cube-roots",
      topic: "Quadratic equations",
      prompt: "The roots of x² − x + 1 = 0 satisfy which equation?",
      options: ["x³ = −1", "x³ = 1", "x² = −1", "x³ = 0"],
      answer: 0,
      steps: [
        "x³ + 1 = (x + 1)(x² − x + 1).",
        "On the roots of x² − x + 1 = 0, the second factor is 0.",
        "Therefore x³ + 1 = 0, so x³ = −1.",
      ],
    },
    {
      id: "mth101-gp",
      topic: "Sequences and series",
      prompt:
        "A geometric series has first term 192 and common ratio 1.5. The sum of the first 6 terms is",
      options: ["3990", "2880", "1920", "4320"],
      answer: 0,
      steps: [
        "Sₙ = a(rⁿ − 1) / (r − 1).",
        "1.5⁶ = 11.390625, so rⁿ − 1 = 10.390625.",
        "Divide by 0.5 to get 20.78125, then multiply by 192.",
        "S₆ = 3990.",
      ],
    },
    {
      id: "mth101-consecutive",
      topic: "Number systems",
      prompt: "Five consecutive integers add up to 100. The smallest is",
      options: ["18", "16", "20", "15"],
      answer: 0,
      steps: [
        "Let the integers be n, n+1, n+2, n+3, n+4.",
        "Their sum is 5n + 10 = 100.",
        "5n = 90, so n = 18.",
        "Check: 18 + 19 + 20 + 21 + 22 = 100.",
      ],
    },
    {
      id: "mth101-evens",
      topic: "Number systems",
      prompt: "The sum of the even numbers between 99 and 999 is",
      options: ["247050", "249500", "245000", "198000"],
      answer: 0,
      steps: [
        "The evens run from 100 to 998.",
        "This is an AP with difference 2 and 450 terms.",
        "Sum = (450 / 2) × (100 + 998) = 225 × 1098.",
        "225 × 1098 = 247050.",
      ],
    },
    {
      id: "mth101-sets",
      topic: "Sets",
      prompt:
        "If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, the symmetric difference A Δ B is",
      options: ["{1, 2, 5, 6}", "{3, 4}", "{1, 2, 3, 4, 5, 6}", "{1, 2}"],
      answer: 0,
      steps: [
        "A Δ B contains elements in A or B, but not both.",
        "The overlap is {3, 4}.",
        "Removing the overlap leaves {1, 2, 5, 6}.",
      ],
    },
    {
      id: "mth101-matrix",
      topic: "Matrices",
      prompt: "The expression 3(A + B) − 2A simplifies to",
      options: ["A + 3B", "5A + 3B", "A + B", "3B − A"],
      answer: 0,
      steps: [
        "Expand: 3(A + B) − 2A = 3A + 3B − 2A.",
        "3A − 2A = A.",
        "The result is A + 3B.",
      ],
    },
  ],
};

const CURATED = {
  "MTH 103": {
    "Functions and graphs": [
      q(
        "Functions and graphs",
        "If f(x) = 2x − 5, what is f(4)?",
        "3",
        ["8", "13", "−3"],
        ["f(4) = 2(4) − 5.", "8 − 5 = 3."],
      ),
      q(
        "Functions and graphs",
        "The graph of y = (x − 2)² + 1 has its vertex at",
        "(2, 1)",
        ["(−2, 1)", "(2, −1)", "(1, 2)"],
        [
          "y = (x − h)² + k has vertex (h, k).",
          "Here h = 2 and k = 1.",
        ],
      ),
    ],
    "Limits and continuity": [
      q(
        "Limits and continuity",
        "lim (x → 2) of (x² − 4) / (x − 2) equals",
        "4",
        ["0", "2", "undefined"],
        [
          "x² − 4 = (x − 2)(x + 2).",
          "For x ≠ 2 the expression is x + 2.",
          "The limit is 2 + 2 = 4.",
        ],
      ),
    ],
    Differentiation: [
      q(
        "Differentiation",
        "If y = 3x² − 4x + 1, then dy/dx equals",
        "6x − 4",
        ["3x − 4", "6x − 4x", "6x + 1"],
        ["Differentiate term by term.", "d/dx (3x²) = 6x and d/dx (−4x) = −4."],
      ),
    ],
    Integration: [
      q(
        "Integration",
        "∫ 2x dx equals",
        "x² + C",
        ["2x² + C", "x + C", "2 + C"],
        ["The antiderivative of xⁿ is xⁿ⁺¹ / (n + 1).", "∫ 2x dx = 2 × x² / 2 + C = x² + C."],
      ),
    ],
    Trigonometry: [
      q(
        "Trigonometry",
        "sin 30° equals",
        "1/2",
        ["√3/2", "1", "√2/2"],
        ["This is a standard angle.", "sin 30° = 1/2."],
      ),
    ],
    "Coordinate geometry": [
      q(
        "Coordinate geometry",
        "The midpoint of (2, 4) and (8, 10) is",
        "(5, 7)",
        ["(6, 14)", "(3, 3)", "(10, 14)"],
        [
          "Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2).",
          "((2 + 8) / 2, (4 + 10) / 2) = (5, 7).",
        ],
      ),
    ],
  },
  "PHY 101": {
    "Units and dimensions": [
      q(
        "Units and dimensions",
        "The SI unit of force is",
        "newton",
        ["joule", "watt", "pascal"],
        ["Force is mass × acceleration.", "The SI unit is the newton, N = kg m/s²."],
      ),
    ],
    Kinematics: [
      q(
        "Kinematics",
        "A car starts from rest and accelerates at 2 m/s² for 5 s. Its speed is",
        "10 m/s",
        ["2.5 m/s", "7 m/s", "25 m/s"],
        ["v = u + at.", "v = 0 + 2 × 5 = 10 m/s."],
      ),
    ],
    "Newton's laws": [
      q(
        "Newton's laws",
        "A 4 kg body is acted on by a resultant force of 20 N. Its acceleration is",
        "5 m/s²",
        ["80 m/s²", "0.2 m/s²", "16 m/s²"],
        ["F = ma, so a = F / m.", "a = 20 / 4 = 5 m/s²."],
      ),
    ],
    "Work, energy and power": [
      q(
        "Work, energy and power",
        "A force of 10 N moves a body 3 m in the direction of the force. The work done is",
        "30 J",
        ["3.3 J", "13 J", "300 J"],
        ["W = Fs when force and displacement are parallel.", "W = 10 × 3 = 30 J."],
      ),
    ],
    "Momentum and collisions": [
      q(
        "Momentum and collisions",
        "A 2 kg body moves at 4 m/s. Its momentum is",
        "8 kg m/s",
        ["2 kg m/s", "6 kg m/s", "16 kg m/s"],
        ["p = mv.", "p = 2 × 4 = 8 kg m/s."],
      ),
    ],
    "Circular motion and gravitation": [
      q(
        "Circular motion and gravitation",
        "Weight is best described as",
        "the gravitational force on a body",
        ["the mass of a body", "the density of a body", "the volume of a body"],
        [
          "Mass is the amount of matter.",
          "Weight is the pull of gravity, W = mg.",
        ],
      ),
    ],
  },
  "PHY 103": {
    "Electric charge and fields": [
      q(
        "Electric charge and fields",
        "Like charges",
        "repel",
        ["attract", "have no effect", "always cancel"],
        ["Coulomb’s law: similar charges repel.", "Opposite charges attract."],
      ),
    ],
    "Electric potential": [
      q(
        "Electric potential",
        "Electric potential is measured in",
        "volts",
        ["amperes", "ohms", "teslas"],
        ["Potential difference is energy per unit charge.", "The SI unit is the volt."],
      ),
    ],
    Capacitors: [
      q(
        "Capacitors",
        "Capacitance is the ratio",
        "charge / potential difference",
        ["current / voltage", "voltage × charge", "resistance / current"],
        ["C = Q / V.", "A larger capacitance stores more charge at the same voltage."],
      ),
    ],
    "Current and resistance": [
      q(
        "Current and resistance",
        "A 12 V supply drives 2 A through a resistor. The resistance is",
        "6 Ω",
        ["24 Ω", "10 Ω", "0.17 Ω"],
        ["Ohm’s law: V = IR, so R = V / I.", "R = 12 / 2 = 6 Ω."],
      ),
    ],
    Magnetism: [
      q(
        "Magnetism",
        "The SI unit of magnetic flux density is the",
        "tesla",
        ["weber", "henry", "farad"],
        ["Magnetic flux is measured in webers.", "Flux density is measured in teslas."],
      ),
    ],
    "Waves and optics": [
      q(
        "Waves and optics",
        "A wave has frequency 50 Hz and wavelength 2 m. Its speed is",
        "100 m/s",
        ["25 m/s", "52 m/s", "48 m/s"],
        ["v = fλ.", "v = 50 × 2 = 100 m/s."],
      ),
    ],
  },
  STAT: {
    "Descriptive statistics": [
      q(
        "Descriptive statistics",
        "The mean of 4, 6, 8 and 10 is",
        "7",
        ["6", "8", "28"],
        ["Add the values: 4 + 6 + 8 + 10 = 28.", "Divide by 4: 28 / 4 = 7."],
      ),
    ],
    Probability: [
      q(
        "Probability",
        "A fair die is rolled once. The probability of a number greater than 4 is",
        "1/3",
        ["1/6", "1/2", "2/3"],
        ["The favourable outcomes are 5 and 6.", "Probability = 2 / 6 = 1/3."],
      ),
    ],
    "Random variables": [
      q(
        "Random variables",
        "A random variable assigns",
        "a number to each outcome of an experiment",
        [
          "a probability of 1 to every outcome",
          "only the mean of a sample",
          "a unit to a physical quantity",
        ],
        [
          "A random variable is a numerical function on the sample space.",
          "Probabilities are then attached to those numbers.",
        ],
      ),
    ],
    "Binomial and Poisson": [
      q(
        "Binomial and Poisson",
        "A binomial experiment requires",
        "a fixed number of independent trials with two outcomes",
        [
          "a continuous time interval and rare events only",
          "normally distributed data",
          "a sample larger than 30",
        ],
        [
          "Each trial is success or failure.",
          "The number of trials is fixed and the trials are independent.",
        ],
      ),
    ],
    "Normal distribution": [
      q(
        "Normal distribution",
        "In a normal distribution, the mean, median and mode are",
        "equal",
        ["in the ratio 1 : 2 : 3", "always different", "undefined"],
        ["A normal curve is symmetric about its centre.", "Mean, median and mode coincide."],
      ),
    ],
    "Correlation and regression": [
      q(
        "Correlation and regression",
        "A correlation coefficient of −0.9 indicates",
        "a strong negative linear relationship",
        [
          "no relationship",
          "a strong positive linear relationship",
          "a perfect positive relationship",
        ],
        [
          "r is close to −1, so the linear association is strong.",
          "The sign is negative, so the variables move in opposite directions.",
        ],
      ),
    ],
  },
  "CHM 101": {
    "Atomic structure": [
      q(
        "Atomic structure",
        "The number of protons in the nucleus of an atom is its",
        "atomic number",
        ["mass number", "neutron number", "valency"],
        ["Atomic number Z counts protons.", "Mass number A counts protons and neutrons."],
      ),
    ],
    "Periodic table": [
      q(
        "Periodic table",
        "Elements in the same group of the periodic table have the same",
        "number of valence electrons",
        ["mass number", "number of neutrons", "number of electron shells"],
        [
          "Group number tracks the valence shell for the main groups.",
          "That is why elements in a group react in similar ways.",
        ],
      ),
    ],
    "Chemical bonding": [
      q(
        "Chemical bonding",
        "Sodium chloride is held together mainly by",
        "ionic bonds",
        ["covalent bonds", "metallic bonds", "hydrogen bonds"],
        [
          "Sodium loses an electron and chlorine gains it.",
          "The resulting ions attract: Na⁺ and Cl⁻.",
        ],
      ),
    ],
    "Mole concept and stoichiometry": [
      q(
        "Mole concept and stoichiometry",
        "The number of moles in 44 g of CO₂ (molar mass 44 g/mol) is",
        "1 mol",
        ["0.5 mol", "2 mol", "44 mol"],
        ["n = mass / molar mass.", "n = 44 / 44 = 1 mol."],
      ),
    ],
    Gases: [
      q(
        "Gases",
        "At constant temperature, if the volume of a fixed mass of gas is halved, the pressure",
        "doubles",
        ["is halved", "stays the same", "is quartered"],
        ["Boyle’s law: P₁V₁ = P₂V₂.", "If V₂ = V₁ / 2, then P₂ = 2P₁."],
      ),
    ],
    "Acids, bases and pH": [
      q(
        "Acids, bases and pH",
        "A solution with pH 3 is",
        "acidic",
        ["neutral", "basic", "neither acidic nor basic"],
        ["pH below 7 is acidic.", "pH 7 is neutral and pH above 7 is basic."],
      ),
    ],
  },
  "BIO 101": {
    "Cell biology": [
      q(
        "Cell biology",
        "Which structure controls what enters and leaves a cell?",
        "cell membrane",
        ["cell wall only", "ribosome", "nucleus only"],
        [
          "The cell membrane is selectively permeable.",
          "It regulates the passage of substances.",
        ],
      ),
    ],
    Genetics: [
      q(
        "Genetics",
        "In a monohybrid cross of two heterozygotes (Aa × Aa), the expected genotype ratio is",
        "1 : 2 : 1",
        ["3 : 1", "1 : 1", "9 : 3 : 3 : 1"],
        [
          "The Punnett square gives AA, Aa, Aa and aa.",
          "That is 1 AA : 2 Aa : 1 aa. The phenotype ratio is 3 : 1 if A is dominant.",
        ],
      ),
    ],
    "Classification of organisms": [
      q(
        "Classification of organisms",
        "The correct order of biological classification, from largest to smallest, begins",
        "kingdom, phylum, class",
        ["species, genus, family", "class, kingdom, phylum", "genus, kingdom, order"],
        ["The usual sequence starts kingdom, phylum, class, order, family, genus, species."],
      ),
    ],
    Ecology: [
      q(
        "Ecology",
        "A group of the same species living in one area is a",
        "population",
        ["community", "ecosystem", "biosphere"],
        [
          "A population is one species in a place.",
          "A community includes the populations of different species living together.",
        ],
      ),
    ],
    "Nutrition and digestion": [
      q(
        "Nutrition and digestion",
        "Amylase begins the digestion of",
        "starch",
        ["protein", "fat", "cellulose"],
        ["Salivary and pancreatic amylase act on starch.", "Proteases act on protein and lipase on fat."],
      ),
    ],
    "Reproduction and evolution": [
      q(
        "Reproduction and evolution",
        "Natural selection means that",
        "individuals with favourable traits are more likely to survive and reproduce",
        [
          "every organism produces identical offspring",
          "acquired injuries are always inherited",
          "evolution happens only by chance, with no role for the environment",
        ],
        [
          "Variation exists in a population.",
          "Traits that help survival and reproduction become more common.",
        ],
      ),
    ],
  },
};

function q(topic, prompt, correct, wrong, steps) {
  return {
    topic,
    prompt,
    options: [correct, ...wrong],
    answer: 0,
    steps,
    origin: "oracle",
  };
}

function numericWrongs(correct, extras) {
  const wrong = [];
  const push = (value) => {
    const text = String(value);
    if (text === String(correct) || wrong.includes(text)) return;
    wrong.push(text);
  };
  for (const extra of extras) push(extra);
  let bump = 1;
  while (wrong.length < 3 && bump < 20) {
    push(Number(correct) + bump);
    push(Number(correct) - bump);
    bump++;
  }
  return wrong.slice(0, 3);
}

function withUnit(correct, unit, extras) {
  return numericWrongs(correct, extras).map((value) => `${value} ${unit}`);
}

const ALT = {
  "MTH 103|Limits and continuity": [
    q("Limits and continuity", "lim (x → 4) of 9 equals", "9", ["4", "0", "36"], ["The limit of a constant is the constant.", "The limit is 9."]),
    q("Limits and continuity", "A function is continuous at x = a when", "the limit at a equals the function value at a", ["the function is a polynomial only", "the limit is always zero", "a is negative"], ["Continuity needs the limit and the function value to agree.", "They must be equal at x = a."]),
  ],
  "MTH 103|Differentiation": [
    q("Differentiation", "The derivative of a constant is", "0", ["1", "the constant itself", "undefined"], ["A constant does not change.", "Its rate of change is 0."]),
    q("Differentiation", "d/dx (x³) equals", "3x²", ["x²", "3x", "x³ / 3"], ["Use the power rule.", "Bring down 3 and reduce the power to 2."]),
  ],
  "MTH 103|Integration": [
    q("Integration", "∫ 6 dx equals", "6x + C", ["6 + C", "x + C", "6x² + C"], ["The antiderivative of a constant k is kx.", "Do not forget + C."]),
    q("Integration", "∫ x² dx equals", "x³/3 + C", ["2x + C", "x³ + C", "x²/2 + C"], ["Increase the power by 1 and divide by the new power.", "∫ x² dx = x³/3 + C."]),
  ],
  "MTH 103|Coordinate geometry": [
    q("Coordinate geometry", "The distance between (0, 0) and (3, 4) is", "5", ["7", "12", "1"], ["Distance = sqrt((x2 − x1)² + (y2 − y1)²).", "sqrt(9 + 16) = sqrt(25) = 5."]),
    q("Coordinate geometry", "The gradient of the line through (1, 2) and (3, 8) is", "3", ["2", "6", "1/3"], ["Gradient = (y2 − y1) / (x2 − x1).", "(8 − 2) / (3 − 1) = 3."]),
  ],
  "PHY 101|Units and dimensions": [
    q("Units and dimensions", "The SI unit of force is the", "newton", ["joule", "watt", "pascal"], ["Force is measured in newtons.", "1 N = 1 kg m/s²."]),
  ],
  "PHY 101|Kinematics": [
    q("Kinematics", "A car starts from rest and accelerates at 2 m/s² for 5 s. Its speed is", "10 m/s", ["2 m/s", "7 m/s", "25 m/s"], ["v = u + at and u = 0.", "v = 2 × 5 = 10 m/s."]),
  ],
  "PHY 101|Newton's laws": [
    q("Newton's laws", "A 4 kg body is acted on by a resultant force of 20 N. Its acceleration is", "5 m/s²", ["80 m/s²", "16 m/s²", "4 m/s²"], ["a = F / m.", "a = 20 / 4 = 5 m/s²."]),
  ],
  "PHY 101|Work, energy and power": [
    q("Work, energy and power", "A force of 10 N moves a body 3 m in the direction of the force. The work done is", "30 J", ["13 J", "3.3 J", "7 J"], ["W = Fd.", "W = 10 × 3 = 30 J."]),
  ],
  "PHY 101|Momentum and collisions": [
    q("Momentum and collisions", "A 2 kg body moves at 4 m/s. Its momentum is", "8 kg m/s", ["6 kg m/s", "2 kg m/s", "16 kg m/s"], ["p = mv.", "p = 2 × 4 = 8 kg m/s."]),
  ],
  "PHY 101|Circular motion and gravitation": [
    q("Circular motion and gravitation", "Weight is best described as", "the gravitational force on a body", ["the mass of a body", "the volume of a body", "the speed of a body"], ["Weight is a force, mass is not.", "Near Earth, W = mg."]),
  ],
  "PHY 103|Electric charge and fields": [
    q("Electric charge and fields", "Like charges", "repel", ["attract", "cancel only in metals", "have no force"], ["Coulomb's law gives repulsion for the same sign.", "Unlike charges attract."]),
  ],
  "PHY 103|Electric potential": [
    q("Electric potential", "Electric potential is measured in", "volts", ["ohms", "farads", "tesla"], ["Potential difference is energy per unit charge.", "The unit is the volt."]),
  ],
  "PHY 103|Capacitors": [
    q("Capacitors", "Capacitance is the ratio", "charge / potential difference", ["potential difference / charge", "current / resistance", "force / charge"], ["C = Q / V.", "A larger capacitance stores more charge at the same voltage."]),
  ],
  "PHY 103|Current and resistance": [
    q("Current and resistance", "A 12 V supply drives 2 A through a resistor. The resistance is", "6 Ω", ["24 Ω", "10 Ω", "2 Ω"], ["R = V / I.", "R = 12 / 2 = 6 Ω."]),
  ],
  "PHY 103|Magnetism": [
    q("Magnetism", "The SI unit of magnetic flux density is the", "tesla", ["weber", "henry", "volt"], ["Flux density is measured in tesla.", "1 T = 1 N/(A m)."]),
  ],
  "PHY 103|Waves and optics": [
    q("Waves and optics", "The speed of a wave is frequency multiplied by", "wavelength", ["amplitude", "period only", "mass"], ["v = fλ.", "Wavelength is the length of one complete wave."]),
    q("Waves and optics", "A wave of frequency 4 Hz and wavelength 3 m has speed", "12 m/s", ["7 m/s", "1.3 m/s", "4 m/s"], ["v = fλ.", "v = 4 × 3 = 12 m/s."]),
  ],
  "STAT|Descriptive statistics": [
    q("Descriptive statistics", "The mean of 4, 6, 8 and 10 is", "7", ["6", "8", "28"], ["Add the values and divide by how many there are.", "(4 + 6 + 8 + 10) / 4 = 7."]),
    q("Descriptive statistics", "The median of 3, 9, 4, 7 and 5 is", "5", ["3", "9", "7"], ["Arrange the scores: 3, 4, 5, 7, 9.", "The middle value is 5."]),
  ],
  "STAT|Probability": [
    q("Probability", "A fair die is rolled once. The probability of a number greater than 4 is", "1/3", ["1/6", "1/2", "2/3"], ["The favourable outcomes are 5 and 6.", "2/6 = 1/3."]),
  ],
  "STAT|Random variables": [
    q("Random variables", "A random variable assigns", "a number to each outcome", ["a probability greater than 1", "only names, never numbers", "the sample size"], ["A random variable is a numerical outcome.", "Each outcome gets a number."]),
  ],
  "STAT|Binomial and Poisson": [
    q("Binomial and Poisson", "A binomial experiment requires", "a fixed number of independent trials with two outcomes", ["a changing number of trials", "more than two outcomes on every trial", "dependent trials only"], ["Each trial is success or failure.", "The number of trials is fixed and the trials are independent."]),
  ],
  "STAT|Normal distribution": [
    q("Normal distribution", "In a normal distribution, the mean, median and mode are", "equal", ["always different", "in the ratio 1 : 2 : 3", "undefined"], ["A normal curve is symmetric about the centre.", "The three averages coincide."]),
  ],
  "STAT|Correlation and regression": [
    q("Correlation and regression", "A correlation coefficient of −0.9 indicates", "a strong negative linear relationship", ["no relationship", "a strong positive relationship", "a weak positive relationship"], ["The sign shows the direction.", "A value close to −1 is a strong negative relationship."]),
  ],
  "CHM 101|Atomic structure": [
    q("Atomic structure", "The number of protons in the nucleus of an atom is its", "atomic number", ["mass number", "neutron number", "valency"], ["Atomic number counts protons.", "It identifies the element."]),
  ],
  "CHM 101|Periodic table": [
    q("Periodic table", "Elements in the same group of the periodic table have the same", "number of valence electrons", ["mass number", "number of neutrons", "number of shells only"], ["Group number tracks the valence electrons for the main groups.", "That is why they react in similar ways."]),
  ],
  "CHM 101|Mole concept and stoichiometry": [
    q("Mole concept and stoichiometry", "The number of moles in 44 g of CO₂ (molar mass 44 g/mol) is", "1 mol", ["44 mol", "2 mol", "0.5 mol"], ["n = mass / molar mass.", "44 / 44 = 1 mol."]),
  ],
  "CHM 101|Gases": [
    q("Gases", "At constant temperature, if the volume of a fixed mass of gas is halved, the pressure", "doubles", ["is halved", "stays the same", "becomes zero"], ["Boyle's law: pressure and volume are inversely proportional.", "Halving the volume doubles the pressure."]),
  ],
  "CHM 101|Acids, bases and pH": [
    q("Acids, bases and pH", "A solution with pH 3 is", "acidic", ["neutral", "basic", "neither acidic nor basic"], ["pH below 7 is acidic.", "pH 3 is acidic."]),
  ],
  "BIO 101|Cell biology": [
    q("Cell biology", "Which structure controls what enters and leaves a cell?", "the cell membrane", ["the nucleus only", "the cell wall only", "a ribosome"], ["The membrane is selectively permeable.", "It controls movement into and out of the cell."]),
  ],
  "BIO 101|Genetics": [
    q("Genetics", "In a monohybrid cross of two heterozygotes (Aa × Aa), the expected genotype ratio is", "1 : 2 : 1", ["3 : 1", "1 : 1", "9 : 3 : 3 : 1"], ["The Punnett square gives AA, Aa, Aa and aa.", "That is 1 : 2 : 1."]),
  ],
  "BIO 101|Ecology": [
    q("Ecology", "A group of the same species living in one area is a", "population", ["community", "ecosystem", "biosphere"], ["A population is one species.", "A community includes several species."]),
  ],
  "BIO 101|Reproduction and evolution": [
    q("Reproduction and evolution", "Natural selection means that", "individuals with favourable traits are more likely to survive and reproduce", ["every organism produces identical offspring", "acquired injuries are always inherited", "evolution happens only by chance, with no role for the environment"], ["Variation exists in a population.", "Helpful traits become more common."]),
  ],
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(value) {
  let h = 2166136261;
  const text = String(value);
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function normalisePrompt(prompt) {
  return String(prompt || "")
    .toLowerCase()
    .replace(/×/g, " times ")
    .replace(/[−–]/g, " minus ")
    .replace(/\+/g, " plus ")
    .replace(/∫/g, " integral ")
    .replace(/²/g, " squared ")
    .replace(/³/g, " cubed ")
    .replace(/√/g, " sqrt ")
    .replace(/\d+/g, "#")
    .replace(/[^a-z# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SIMILAR_STOP = new Set([
  "the", "and", "what", "with", "for", "from", "that", "this", "equals", "equal",
  "into", "over", "then", "its", "has", "have", "are", "was", "when", "which",
  "than", "their", "them", "your", "about", "how", "many", "does", "each", "per",
  "only", "after", "before", "there", "these", "those", "will", "would", "can",
]);

export function similarPrompt(a, b) {
  const left = normalisePrompt(a);
  const right = normalisePrompt(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const toSet = (text) =>
    new Set(
      text.split(" ").filter((word) => word.length > 2 && word !== "#" && !SIMILAR_STOP.has(word)),
    );
  const A = toSet(left);
  const B = toSet(right);
  if (A.size < 3 || B.size < 3) return false;
  let intersection = 0;
  for (const word of A) if (B.has(word)) intersection++;
  const union = A.size + B.size - intersection;
  return union > 0 && intersection / union >= 0.72;
}

export function isFresh(prompt, avoid) {
  return !(avoid || []).some((item) => similarPrompt(prompt, item));
}

function formatComplex(real, imag) {
  if (imag === 0) return String(real);
  const sign = imag < 0 ? " − " : " + ";
  const mag = Math.abs(imag);
  const imagText = mag === 1 ? "i" : mag + "i";
  if (real === 0) return (imag < 0 ? "−" : "") + imagText;
  return real + sign + imagText;
}

function intBetween(rand, min, max) {
  return min + Math.floor(rand() * (max - min + 1));
}

const MORE = {
  "PHY 101|Kinematics": [
    q("Kinematics", "A body starts from rest and accelerates at 3 m/s² for 4 s. The distance travelled is", "24 m", ["12 m", "7 m", "48 m"], ["s = ut + ½at² and u = 0.", "s = ½ × 3 × 16 = 24 m."]),
  ],
  "PHY 101|Newton's laws": [
    q("Newton's laws", "Newton's third law says that action and reaction forces are", "equal in size and opposite in direction", ["equal and in the same direction", "always unequal", "acting on the same body"], ["The forces are on two different bodies.", "They are equal and opposite."]),
  ],
  "PHY 101|Work, energy and power": [
    q("Work, energy and power", "Power is best described as", "the rate of doing work", ["the force times mass", "stored energy only", "distance divided by time"], ["P = W / t.", "A higher power does the same work in less time."]),
  ],
  "PHY 101|Momentum and collisions": [
    q("Momentum and collisions", "With no external force, the total momentum of a system", "stays constant", ["always increases", "always becomes zero", "equals the total mass"], ["This is conservation of momentum.", "Internal forces cancel in pairs."]),
  ],
  "PHY 101|Circular motion and gravitation": [
    q("Circular motion and gravitation", "Acceleration directed towards the centre of a circular path is called", "centripetal acceleration", ["tangential weight", "terminal velocity", "linear momentum"], ["The direction of the acceleration is inward.", "It is centripetal acceleration."]),
  ],
  "PHY 103|Electric charge and fields": [
    q("Electric charge and fields", "The SI unit of electric charge is the", "coulomb", ["ampere", "volt", "ohm"], ["Current is charge per second.", "Charge itself is measured in coulombs."]),
  ],
  "PHY 103|Electric potential": [
    q("Electric potential", "One volt is equal to one", "joule per coulomb", ["newton per coulomb", "ampere per ohm", "coulomb per second"], ["V = W / Q.", "1 V = 1 J/C."]),
  ],
  "PHY 103|Capacitors": [
    q("Capacitors", "Inserting a dielectric between capacitor plates usually", "increases the capacitance", ["reduces the charge to zero", "removes the potential difference permanently", "changes the plates into resistors"], ["A dielectric lets the capacitor store more charge at the same voltage.", "Capacitance increases."]),
  ],
  "PHY 103|Current and resistance": [
    q("Current and resistance", "A current of 3 A flows for 4 s. The charge transferred is", "12 C", ["7 C", "0.75 C", "1 C"], ["Q = It.", "Q = 3 × 4 = 12 C."]),
  ],
  "PHY 103|Magnetism": [
    q("Magnetism", "A magnetic field can exert a force on", "a moving charge", ["a stationary neutral atom only", "a mass at rest with no charge", "light in a vacuum only"], ["The magnetic force on a charge is qvB sin θ.", "A stationary charge feels no magnetic force."]),
  ],
  "PHY 103|Waves and optics": [
    q("Waves and optics", "The time taken for one complete wave to pass a point is the", "period", ["amplitude", "wavelength", "speed"], ["Period and frequency are reciprocals.", "T = 1/f."]),
  ],
  "STAT|Descriptive statistics": [
    q("Descriptive statistics", "The range of the scores 2, 9 and 5 is", "7", ["5", "9", "16"], ["Range = highest − lowest.", "9 − 2 = 7."]),
  ],
  "STAT|Probability": [
    q("Probability", "The probability of an impossible event is", "0", ["1", "1/2", "2"], ["Probability lies from 0 to 1.", "An impossible event has probability 0."]),
  ],
  "STAT|Random variables": [
    q("Random variables", "If a random variable is certain to be 6, its expected value is", "6", ["0", "1", "36"], ["A constant has expectation equal to that constant.", "E(6) = 6."]),
  ],
  "STAT|Binomial and Poisson": [
    q("Binomial and Poisson", "For 8 independent trials with success probability 1/2, the binomial variance is", "2", ["4", "8", "1"], ["Variance = np(1 − p).", "8 × 1/2 × 1/2 = 2."]),
  ],
  "STAT|Normal distribution": [
    q("Normal distribution", "About 95% of observations in a normal distribution lie within", "2 standard deviations of the mean", ["1 standard deviation of the mean", "4 standard deviations of the mean", "the interquartile range only"], ["The empirical rule gives about 95% within 2 standard deviations.", "About 68% lie within 1 standard deviation."]),
  ],
  "STAT|Correlation and regression": [
    q("Correlation and regression", "A correlation coefficient of 0 means", "no linear relationship", ["a perfect positive line", "a perfect negative line", "a causal relationship"], ["r = 0 means the linear association is absent.", "It does not by itself prove anything about a curve."]),
  ],
  "CHM 101|Atomic structure": [
    q("Atomic structure", "Isotopes of an element have the same", "atomic number", ["mass number", "number of neutrons", "number of nucleons"], ["Isotopes are the same element.", "They share a proton number and differ in neutrons."]),
  ],
  "CHM 101|Periodic table": [
    q("Periodic table", "The modern periodic table arranges the elements in order of", "atomic number", ["atomic mass only", "date of discovery", "density"], ["Moseley's work uses nuclear charge.", "The order is increasing atomic number."]),
  ],
  "CHM 101|Mole concept and stoichiometry": [
    q("Mole concept and stoichiometry", "One mole of any substance contains", "Avogadro's number of particles", ["18 grams only", "one atom only", "22.4 molecules only"], ["Avogadro's number is about 6.02 × 10²³.", "That quantity is one mole of particles."]),
  ],
  "CHM 101|Gases": [
    q("Gases", "In the ideal-gas calculations used at this level, 0°C is the same as", "273 K", ["0 K", "100 K", "373 K"], ["Kelvin = Celsius + 273.", "0°C = 273 K."]),
  ],
  "CHM 101|Acids, bases and pH": [
    q("Acids, bases and pH", "A neutral aqueous solution at room temperature has pH", "7", ["0", "1", "14"], ["pH 7 is neutral.", "Below 7 is acidic and above 7 is alkaline."]),
  ],
  "BIO 101|Cell biology": [
    q("Cell biology", "Ribosomes are the site of", "protein synthesis", ["photosynthesis", "lipid storage only", "cell division"], ["Ribosomes read mRNA.", "They assemble amino acids into proteins."]),
  ],
  "BIO 101|Genetics": [
    q("Genetics", "In DNA, adenine pairs with", "thymine", ["cytosine", "guanine", "uracil"], ["A pairs with T and G pairs with C.", "Uracil replaces thymine in RNA."]),
  ],
  "BIO 101|Ecology": [
    q("Ecology", "The role an organism plays in its habitat is its", "niche", ["population", "biome", "species"], ["A habitat is where it lives.", "A niche is how it lives there."]),
  ],
  "BIO 101|Reproduction and evolution": [
    q("Reproduction and evolution", "Meiosis produces daughter cells that are", "haploid", ["identical body cells", "always diploid clones", "unable to form gametes"], ["Meiosis halves the chromosome number.", "The daughter cells are haploid."]),
  ],
};

function generatedFor(course, topic, rand) {
  const alts = [...(ALT[`${course}|${topic}`] || []), ...(MORE[`${course}|${topic}`] || [])];
  if (alts.length && rand() < 0.75) return alts[Math.floor(rand() * alts.length)];

  if (course === "MTH 101" && topic === "Complex numbers") {
    const a = intBetween(rand, 2, 8);
    const b = intBetween(rand, 1, 6);
    const c = intBetween(rand, 1, 7);
    const d = intBetween(rand, -5, 5) || 2;
    const mode = Math.floor(rand() * 4);
    if (mode === 1) {
      const real = a - c;
      const imag = b - d;
      return q(
        topic,
        `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 − z2?`,
        formatComplex(real, imag),
        [formatComplex(a + c, b + d), formatComplex(real, b + d), formatComplex(a * c, b * d)],
        [
          `Subtract the real parts: ${a} − ${c} = ${real}.`,
          `Subtract the imaginary parts: ${b} − (${d}) = ${imag}.`,
          `So z1 − z2 = ${formatComplex(real, imag)}.`,
        ],
      );
    }
    if (mode === 2) {
      const real = a * c - b * d;
      const imag = a * d + b * c;
      return q(
        topic,
        `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 × z2?`,
        formatComplex(real, imag),
        [formatComplex(a * c, b * d), formatComplex(a + c, b + d), formatComplex(real, a * d - b * c)],
        [
          `(${a} + ${b}i)(${formatComplex(c, d)}) = ${a * c} + (${a}*${d})i + (${b}*${c})i + (${b}*${d})i².`,
          "Replace i² with −1 and collect real and imaginary parts.",
          `The product is ${formatComplex(real, imag)}.`,
        ],
      );
    }
    if (mode === 3) {
      return q(
        topic,
        `The real part of z = ${formatComplex(a, b)} is`,
        String(a),
        numericWrongs(a, [b, a + b, -b || b + 1]),
        ["A complex number a + bi has real part a.", `The real part is ${a}.`],
      );
    }
    const real = a + c;
    const imag = b + d;
    return q(
      topic,
      `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 + z2?`,
      formatComplex(real, imag),
      [
        formatComplex(a - c, b - d),
        formatComplex(real, b - d),
        formatComplex(a * c, b * d),
      ],
      [
        `Add the real parts: ${a} + ${c} = ${real}.`,
        `Add the imaginary parts: ${b} + (${d}) = ${imag}.`,
        `So z1 + z2 = ${formatComplex(real, imag)}.`,
      ],
    );
  }
  if (course === "MTH 101" && topic === "Quadratic equations") {
    const r1 = intBetween(rand, 1, 6);
    const r2 = intBetween(rand, -4, 5);
    const sum = r1 + r2;
    const product = r1 * r2;
    const mode = Math.floor(rand() * 3);
    if (mode === 1) {
      const b = intBetween(rand, 1, 6);
      const c = intBetween(rand, -5, 5) || 2;
      const discriminant = b * b - 4 * c;
      return q(
        topic,
        `The discriminant of x² + ${b}x ${c < 0 ? "− " + -c : "+ " + c} = 0 is`,
        String(discriminant),
        numericWrongs(discriminant, [b * b, b * b + 4 * c, 4 * c]),
        ["Discriminant = b² − 4ac.", `Here a = 1, so ${b}² − 4(${c}) = ${discriminant}.`],
      );
    }
    if (mode === 2) {
      return q(
        topic,
        `The sum of the roots of x² − ${Math.abs(sum) || 3}x + ${Math.abs(product) || 2} = 0 is`,
        String(Math.abs(sum) || 3),
        numericWrongs(Math.abs(sum) || 3, [Math.abs(product) || 2, -(Math.abs(sum) || 3), 0]),
        ["For x² − (sum)x + (product) = 0, the roots add to the coefficient of x.", `The sum of the roots is ${Math.abs(sum) || 3}.`],
      );
    }
    const b = -sum;
    const signB = b < 0 ? "− " + -b : "+ " + b;
    const signC = product < 0 ? "− " + -product : "+ " + product;
    const prompt = `One root of x² ${signB}x ${signC} = 0 is ${r1}. The other root is`;
    const wrong = numericWrongs(r2, [sum, product, -r2 || r2 + 1]);
    return q(topic, prompt, String(r2), wrong, [
      "For x² − (sum)x + (product) = 0, the roots add to the sum and multiply to the product.",
      `The known root is ${r1}, and the roots add to ${sum}.`,
      `The other root is ${sum} − ${r1} = ${r2}.`,
    ]);
  }
  if (course === "MTH 101" && topic === "Sequences and series") {
    const a = intBetween(rand, 3, 12);
    const d = intBetween(rand, 2, 5);
    const n = intBetween(rand, 6, 10);
    const mode = Math.floor(rand() * 3);
    if (mode === 1) {
      const term = a + (n - 1) * d;
      return q(
        topic,
        `The ${n}th term of an arithmetic progression with first term ${a} and common difference ${d} is`,
        String(term),
        numericWrongs(term, [a + n * d, n * d, a * n]),
        ["The nth term is a + (n − 1)d.", `${a} + ${n - 1} × ${d} = ${term}.`],
      );
    }
    if (mode === 2) {
      const ratio = intBetween(rand, 2, 3);
      const sum = (a * (ratio ** 3 - 1)) / (ratio - 1);
      return q(
        topic,
        `A geometric progression has first term ${a} and common ratio ${ratio}. The sum of its first 3 terms is`,
        String(sum),
        numericWrongs(sum, [a * ratio, a * 3, a * ratio ** 3]),
        ["Sₙ = a(rⁿ − 1) / (r − 1).", `S₃ = ${a}(${ratio}³ − 1) / ${ratio - 1} = ${sum}.`],
      );
    }
    const sum = (n / 2) * (2 * a + (n - 1) * d);
    return q(
      topic,
      `An arithmetic series has first term ${a} and common difference ${d}. The sum of the first ${n} terms is`,
      String(sum),
      numericWrongs(sum, [sum + d, a + (n - 1) * d, n * a]),
      [
        "Sₙ = n/2 × [2a + (n − 1)d].",
        `Sₙ = ${n}/2 × [2(${a}) + ${n - 1}(${d})] = ${sum}.`,
      ],
    );
  }
  if (course === "MTH 101" && topic === "Sets") {
    const universe = 30;
    const a = intBetween(rand, 8, 14);
    const b = intBetween(rand, 6, 12);
    const both = intBetween(rand, 2, 5);
    const union = a + b - both;
    const mode = Math.floor(rand() * 3);
    if (mode === 1) {
      const onlyA = a - both;
      return q(
        topic,
        `In a class of ${universe}, ${a} take algebra and ${b} take sets. If ${both} take both, how many take algebra only?`,
        String(onlyA),
        numericWrongs(onlyA, [a, union, b - both]),
        ["Algebra only = |A| − |A ∩ B|.", `${a} − ${both} = ${onlyA}.`],
      );
    }
    if (mode === 2) {
      const neither = universe - union;
      return q(
        topic,
        `If |A ∪ B| = ${union} in a class of ${universe}, how many students are outside both sets?`,
        String(neither),
        numericWrongs(neither, [universe - a, universe - b, union]),
        ["Students outside both sets = class size − |A ∪ B|.", `${universe} − ${union} = ${neither}.`],
      );
    }
    return q(
      topic,
      `In a class of ${universe}, ${a} students take algebra and ${b} take sets. If ${both} take both, how many take at least one of the two?`,
      String(union),
      numericWrongs(union, [a + b, a - both, universe - union]),
      [
        "|A ∪ B| = |A| + |B| − |A ∩ B|.",
        `${a} + ${b} − ${both} = ${union}.`,
      ],
    );
  }
  if (course === "MTH 101" && topic === "Matrices") {
    const x = intBetween(rand, 1, 5);
    const y = intBetween(rand, 1, 5);
    const mode = Math.floor(rand() * 3);
    if (mode === 1) {
      return q(
        topic,
        `If A = [${x}, ${y}] and B = [${y}, ${x}], what is A − B as a row?`,
        `[${x - y}, ${y - x}]`,
        [`[${x + y}, ${y + x}]`, `[${y - x}, ${x - y}]`, `[${x}, ${y}]`],
        [`A − B = [${x} − ${y}, ${y} − ${x}].`, `The row is [${x - y}, ${y - x}].`],
      );
    }
    if (mode === 2) {
      const det = x * x - y * y;
      return q(
        topic,
        `The determinant of the matrix [[${x}, ${y}], [${y}, ${x}]] is`,
        String(det),
        numericWrongs(det, [x * y, x * x + y * y, x + y]),
        ["For [[a, b], [c, d]], determinant = ad − bc.", `${x}×${x} − ${y}×${y} = ${det}.`],
      );
    }
    return q(
      topic,
      `If A = [${x}, ${y}] and B = [${y}, ${x}], what is 2A + B as a row?`,
      `[${2 * x + y}, ${2 * y + x}]`,
      [`[${2 * x + 2 * y}, ${2 * y + 2 * x}]`, `[${x + y}, ${y + x}]`, `[${2 * x}, ${2 * y}]`],
      [
        `2A = [${2 * x}, ${2 * y}].`,
        `2A + B = [${2 * x + y}, ${2 * y + x}].`,
      ],
    );
  }
  if (course === "MTH 101" && topic === "Number systems") {
    const n = intBetween(rand, 8, 20);
    const mode = Math.floor(rand() * 3);
    if (mode === 1) {
      const count = intBetween(rand, 8, 16);
      const sum = (count * (count + 1)) / 2;
      return q(
        topic,
        `The sum of the first ${count} positive integers is`,
        String(sum),
        numericWrongs(sum, [count * count, count * (count - 1), sum + count]),
        ["The sum 1 + 2 + … + n is n(n + 1)/2.", `${count} × ${count + 1} / 2 = ${sum}.`],
      );
    }
    if (mode === 2) {
      const last = n * 2;
      const count = n;
      return q(
        topic,
        `How many even positive integers are there from 2 to ${last}?`,
        String(count),
        numericWrongs(count, [last, count - 1, count + 1]),
        ["The evens are 2, 4, …, 2n.", `There are ${count} of them.`],
      );
    }
    const sum = 3 * n + 3;
    return q(
      topic,
      `Three consecutive integers add up to ${sum}. The middle integer is`,
      String(n + 1),
      numericWrongs(n + 1, [n, n + 2, n + 3]),
      [
        "Let the integers be m − 1, m and m + 1.",
        `Their sum is 3m = ${sum}, so m = ${n + 1}.`,
      ],
    );
  }
  if (course === "PHY 101" && topic === "Kinematics") {
    const u = intBetween(rand, 2, 12);
    const a = intBetween(rand, 1, 4);
    const t = intBetween(rand, 2, 6);
    const v = u + a * t;
    return q(
      topic,
      `A body moving at ${u} m/s accelerates at ${a} m/s² for ${t} s. Its final speed is`,
      `${v} m/s`,
      [`${u + a} m/s`, `${u * t} m/s`, `${a * t} m/s`],
      ["v = u + at.", `v = ${u} + ${a} × ${t} = ${v} m/s.`],
    );
  }
  if (course === "PHY 101" && topic === "Newton's laws") {
    const m = intBetween(rand, 2, 8);
    const a = intBetween(rand, 2, 6);
    return q(
      topic,
      `The resultant force on a ${m} kg body that accelerates at ${a} m/s² is`,
      `${m * a} N`,
      [`${m + a} N`, `${m} N`, `${a} N`],
      ["F = ma.", `F = ${m} × ${a} = ${m * a} N.`],
    );
  }
  if (course === "CHM 101" && topic === "Mole concept and stoichiometry") {
    const moles = intBetween(rand, 2, 5);
    const m = moles * 18;
    return q(
      topic,
      `How many moles are in ${m} g of water? (H₂O = 18 g/mol)`,
      `${moles} mol`,
      [`${moles * 18} mol`, `${moles + 1} mol`, "18 mol"],
      ["n = mass / molar mass.", `n = ${m} / 18 = ${moles} mol.`],
    );
  }
  if (course === "STAT" && topic === "Descriptive statistics") {
    const a = intBetween(rand, 2, 9);
    const b = a + intBetween(rand, 1, 4);
    const c = b + intBetween(rand, 1, 4);
    const mean = (a + b + c) / 3;
    if (!Number.isInteger(mean)) return null;
    return q(
      topic,
      `The mean of ${a}, ${b} and ${c} is`,
      String(mean),
      [String(b), String(a + b + c), String(mean + 1)],
      [`Add the scores: ${a + b + c}.`, `Divide by 3 to get ${mean}.`],
    );
  }
  if (course === "MTH 103" && topic === "Functions and graphs") {
    const slope = intBetween(rand, 2, 6);
    const intercept = intBetween(rand, -5, 8) || 3;
    const x = intBetween(rand, 1, 7);
    const value = slope * x + intercept;
    return q(
      topic,
      `If f(x) = ${slope}x ${intercept < 0 ? "− " + -intercept : "+ " + intercept}, what is f(${x})?`,
      String(value),
      numericWrongs(value, [slope * x, value + slope, intercept]),
      [`f(${x}) = ${slope}(${x}) ${intercept < 0 ? "− " + -intercept : "+ " + intercept}.`, `${slope * x} ${intercept < 0 ? "− " + -intercept : "+ " + intercept} = ${value}.`],
    );
  }
  if (course === "MTH 103" && topic === "Limits and continuity") {
    const a = intBetween(rand, 2, 9);
    const limit = 2 * a;
    return q(
      topic,
      `lim (x → ${a}) of (x² − ${a * a}) / (x − ${a}) equals`,
      String(limit),
      numericWrongs(limit, [a, a * a, 0]),
      [`x² − ${a * a} = (x − ${a})(x + ${a}).`, `For x ≠ ${a} the quotient is x + ${a}.`, `The limit is ${a} + ${a} = ${limit}.`],
    );
  }
  if (course === "MTH 103" && topic === "Differentiation") {
    const a = intBetween(rand, 2, 5);
    const b = intBetween(rand, 1, 7);
    const correct = `${2 * a}x + ${b}`;
    return q(
      topic,
      `If y = ${a}x² + ${b}x, then dy/dx equals`,
      correct,
      [`${a}x + ${b}`, `${2 * a}x`, `${a}x² + ${b}`],
      ["Differentiate term by term.", `d/dx (${a}x²) = ${2 * a}x and d/dx (${b}x) = ${b}.`],
    );
  }
  if (course === "MTH 103" && topic === "Integration") {
    const k = intBetween(rand, 1, 6) * 2;
    return q(
      topic,
      `∫ ${k}x dx equals`,
      `${k / 2}x² + C`,
      [`${k}x² + C`, `${k}x + C`, `${k / 2}x + C`],
      ["∫ x dx = x² / 2.", `∫ ${k}x dx = ${k} × x² / 2 + C = ${k / 2}x² + C.`],
    );
  }
  if (course === "MTH 103" && topic === "Trigonometry") {
    const rows = [
      ["sin 30°", "1/2", ["√3/2", "√2/2", "0"]],
      ["sin 60°", "√3/2", ["1/2", "√2/2", "1"]],
      ["cos 60°", "1/2", ["√3/2", "0", "1"]],
      ["cos 45°", "√2/2", ["1/2", "√3/2", "1"]],
      ["tan 45°", "1", ["0", "√3", "1/2"]],
    ];
    const row = rows[Math.floor(rand() * rows.length)];
    return q(topic, `${row[0]} equals`, row[1], row[2], ["Use the standard-angle values.", `${row[0]} = ${row[1]}.`]);
  }
  if (course === "MTH 103" && topic === "Coordinate geometry") {
    const x1 = intBetween(rand, 0, 8);
    const y1 = intBetween(rand, 0, 8);
    const x2 = x1 + intBetween(rand, 2, 8) * 2;
    const y2 = y1 + intBetween(rand, 2, 6) * 2;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return q(
      topic,
      `The midpoint of (${x1}, ${y1}) and (${x2}, ${y2}) is`,
      `(${mx}, ${my})`,
      [`(${x1 + x2}, ${y1 + y2})`, `(${mx}, ${y1})`, `(${x2}, ${my})`],
      ["Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2).", `((${x1} + ${x2}) / 2, (${y1} + ${y2}) / 2) = (${mx}, ${my}).`],
    );
  }
  if (course === "PHY 101" && topic === "Units and dimensions") {
    const n = intBetween(rand, 2, 15);
    const ms = n * 5;
    return q(
      topic,
      `A speed of ${n * 18} km/h is equal to`,
      `${ms} m/s`,
      withUnit(ms, "m/s", [n * 18, n, ms * 2]),
      ["1 km/h = 1000/3600 m/s = 5/18 m/s.", `${n * 18} × 5/18 = ${ms} m/s.`],
    );
  }
  if (course === "PHY 101" && topic === "Work, energy and power") {
    const force = intBetween(rand, 2, 12);
    const distance = intBetween(rand, 2, 9);
    const work = force * distance;
    return q(
      topic,
      `The work done by a ${force} N force through ${distance} m, in its own direction, is`,
      `${work} J`,
      withUnit(work, "J", [force + distance, force, distance]),
      ["W = Fd when force and displacement are in the same direction.", `W = ${force} × ${distance} = ${work} J.`],
    );
  }
  if (course === "PHY 101" && topic === "Momentum and collisions") {
    const mass = intBetween(rand, 2, 8);
    const speed = intBetween(rand, 2, 9);
    const momentum = mass * speed;
    return q(
      topic,
      `The momentum of a ${mass} kg body moving at ${speed} m/s is`,
      `${momentum} kg m/s`,
      withUnit(momentum, "kg m/s", [mass + speed, mass, speed]),
      ["p = mv.", `p = ${mass} × ${speed} = ${momentum} kg m/s.`],
    );
  }
  if (course === "PHY 101" && topic === "Circular motion and gravitation") {
    const mass = intBetween(rand, 2, 6);
    const speed = intBetween(rand, 2, 5);
    const force = mass * speed;
    return q(
      topic,
      `A ${mass} kg mass moves at ${speed} m/s in a circle of radius ${speed} m. The centripetal force is`,
      `${force} N`,
      withUnit(force, "N", [mass * speed * speed, mass + speed, speed]),
      ["F = mv² / r.", `F = ${mass} × ${speed}² / ${speed} = ${force} N.`],
    );
  }
  if (course === "PHY 103" && topic === "Electric charge and fields") {
    const q1 = intBetween(rand, 2, 6);
    const q2 = intBetween(rand, 2, 6);
    const product = q1 * q2;
    return q(
      topic,
      `Two charges are ${q1} μC and ${q2} μC. The product of the charges, used in Coulomb's law, is`,
      `${product} μC²`,
      withUnit(product, "μC²", [q1 + q2, q1, q2]),
      ["Coulomb's law uses the product of the two charges.", `${q1} × ${q2} = ${product}.`],
    );
  }
  if (course === "PHY 103" && topic === "Electric potential") {
    const work = intBetween(rand, 2, 8) * intBetween(rand, 2, 5);
    const charge = intBetween(rand, 2, 5);
    if (work % charge !== 0) return null;
    const volts = work / charge;
    return q(
      topic,
      `The potential difference when ${work} J is used to move ${charge} C of charge is`,
      `${volts} V`,
      withUnit(volts, "V", [work, charge, work * charge]),
      ["V = W / Q.", `V = ${work} / ${charge} = ${volts} V.`],
    );
  }
  if (course === "PHY 103" && topic === "Capacitors") {
    const voltage = intBetween(rand, 2, 8);
    const capacitance = intBetween(rand, 2, 6);
    const charge = capacitance * voltage;
    return q(
      topic,
      `A ${capacitance} μF capacitor charged to ${voltage} V stores charge`,
      `${charge} μC`,
      withUnit(charge, "μC", [capacitance + voltage, voltage, capacitance]),
      ["Q = CV.", `Q = ${capacitance} × ${voltage} = ${charge} μC.`],
    );
  }
  if (course === "PHY 103" && topic === "Current and resistance") {
    const current = intBetween(rand, 2, 6);
    const resistance = intBetween(rand, 2, 9);
    const voltage = current * resistance;
    return q(
      topic,
      `The p.d. across a ${resistance} Ω resistor carrying ${current} A is`,
      `${voltage} V`,
      withUnit(voltage, "V", [resistance + current, resistance, current]),
      ["V = IR.", `V = ${current} × ${resistance} = ${voltage} V.`],
    );
  }
  if (course === "PHY 103" && topic === "Magnetism") {
    const field = intBetween(rand, 1, 4);
    const current = intBetween(rand, 2, 6);
    const length = intBetween(rand, 2, 5);
    const force = field * current * length;
    return q(
      topic,
      `The force on a ${length} m conductor carrying ${current} A at right angles to a ${field} T field is`,
      `${force} N`,
      withUnit(force, "N", [field * current, current * length, field + current + length]),
      ["F = BIL when the wire is perpendicular to the field.", `F = ${field} × ${current} × ${length} = ${force} N.`],
    );
  }
  if (course === "PHY 103" && topic === "Waves and optics") {
    const frequency = intBetween(rand, 2, 8);
    const wavelength = intBetween(rand, 2, 7);
    const speed = frequency * wavelength;
    return q(
      topic,
      `A wave of frequency ${frequency} Hz and wavelength ${wavelength} m has speed`,
      `${speed} m/s`,
      withUnit(speed, "m/s", [frequency + wavelength, frequency, wavelength]),
      ["v = fλ.", `v = ${frequency} × ${wavelength} = ${speed} m/s.`],
    );
  }
  if (course === "STAT" && topic === "Probability") {
    const red = intBetween(rand, 2, 7);
    const blue = intBetween(rand, 2, 7);
    const total = red + blue;
    return q(
      topic,
      `A bag has ${red} red beads and ${blue} blue beads. The probability of picking a red bead is`,
      `${red}/${total}`,
      [`${blue}/${total}`, `${red}/${blue}`, `${total}/${red}`],
      ["Probability = favourable outcomes / total outcomes.", `${red} red beads out of ${total} gives ${red}/${total}.`],
    );
  }
  if (course === "STAT" && topic === "Random variables") {
    const a = intBetween(rand, 1, 6);
    const b = intBetween(rand, 2, 8);
    const expected = (a + b) / 2;
    if (!Number.isInteger(expected)) return null;
    return q(
      topic,
      `A variable is equally likely to be ${a} or ${b}. Its expected value is`,
      String(expected),
      numericWrongs(expected, [a + b, a, b]),
      ["E(X) = Σ xP(x).", `Each outcome has probability 1/2, so E(X) = (${a} + ${b}) / 2 = ${expected}.`],
    );
  }
  if (course === "STAT" && topic === "Binomial and Poisson") {
    const n = intBetween(rand, 4, 12) * 2;
    const mean = n / 2;
    return q(
      topic,
      `A binomial experiment has ${n} trials and success probability 1/2. The mean number of successes is`,
      String(mean),
      numericWrongs(mean, [n, n / 4, 1]),
      ["For a binomial distribution, mean = np.", `Mean = ${n} × 1/2 = ${mean}.`],
    );
  }
  if (course === "STAT" && topic === "Normal distribution") {
    const mean = intBetween(rand, 40, 70);
    const sd = intBetween(rand, 2, 8);
    const value = mean + sd;
    return q(
      topic,
      `A normal score has mean ${mean} and standard deviation ${sd}. The z-score of ${value} is`,
      "1",
      ["0", "2", String(sd)],
      ["z = (x − mean) / standard deviation.", `z = (${value} − ${mean}) / ${sd} = 1.`],
    );
  }
  if (course === "STAT" && topic === "Correlation and regression") {
    const slope = intBetween(rand, 2, 6);
    const intercept = intBetween(rand, 1, 9);
    return q(
      topic,
      `For the line y = ${slope}x + ${intercept}, y increases by how much when x increases by 1?`,
      String(slope),
      numericWrongs(slope, [intercept, slope + intercept, 1]),
      ["The slope is the change in y for a one-unit increase in x.", `The slope is ${slope}.`],
    );
  }
  if (course === "CHM 101" && topic === "Atomic structure") {
    const protons = intBetween(rand, 6, 20);
    const neutrons = intBetween(rand, 6, 22);
    const mass = protons + neutrons;
    return q(
      topic,
      `An atom has atomic number ${protons} and mass number ${mass}. It has`,
      `${neutrons} neutrons`,
      [`${protons} neutrons`, `${mass} neutrons`, `${protons + mass} neutrons`],
      ["Mass number = protons + neutrons.", `Neutrons = ${mass} − ${protons} = ${neutrons}.`],
    );
  }
  if (course === "CHM 101" && topic === "Periodic table") {
    const group = intBetween(rand, 1, 2);
    return q(
      topic,
      `An element in group ${group} of the periodic table has how many valence electrons?`,
      String(group),
      numericWrongs(group, [group + 8, 8, group + 1]),
      ["Groups 1 and 2 have that many valence electrons.", `Group ${group} has ${group} valence electron${group === 1 ? "" : "s"}.`],
    );
  }
  if (course === "CHM 101" && topic === "Chemical bonding") {
    const rows = [
      ["NaCl is best described as", "ionic", ["covalent", "metallic", "van der Waals"]],
      ["The bond in a chlorine molecule, Cl₂, is", "covalent", ["ionic", "metallic", "hydrogen"]],
      ["A bond formed by sharing a pair of electrons is", "covalent", ["ionic", "metallic", "hydrogen"]],
    ];
    const row = rows[Math.floor(rand() * rows.length)];
    return q(topic, row[0], row[1], row[2], ["Match the bond type to how the electrons are held.", `The answer is ${row[1]}.`]);
  }
  if (course === "CHM 101" && topic === "Gases") {
    const p1 = intBetween(rand, 2, 5);
    const v1 = intBetween(rand, 3, 8);
    const p2 = intBetween(rand, 2, 5);
    const product = p1 * v1;
    if (product % p2 !== 0) return null;
    const v2 = product / p2;
    return q(
      topic,
      `A gas at ${p1} atm occupies ${v1} L. At constant temperature, its volume at ${p2} atm is`,
      `${v2} L`,
      withUnit(v2, "L", [p1 * v1, v1, p2]),
      ["Boyle's law: P1V1 = P2V2.", `V2 = (${p1} × ${v1}) / ${p2} = ${v2} L.`],
    );
  }
  if (course === "CHM 101" && topic === "Acids, bases and pH") {
    const power = intBetween(rand, 1, 3);
    const zeros = "0." + "0".repeat(power - 1) + "1";
    return q(
      topic,
      `The pH of a ${zeros} M HCl solution is`,
      String(power),
      numericWrongs(power, [power + 1, 7, 14 - power]),
      ["HCl is a strong acid, so [H⁺] equals the concentration.", `pH = −log(${zeros}) = ${power}.`],
    );
  }
  if (course === "BIO 101" && topic === "Cell biology") {
    const eye = intBetween(rand, 5, 15);
    const objective = [4, 10, 40][Math.floor(rand() * 3)];
    const total = eye * objective;
    return q(
      topic,
      `A microscope has a ×${eye} eyepiece and a ×${objective} objective. The total magnification is`,
      `×${total}`,
      [`×${eye + objective}`, `×${eye}`, `×${objective}`],
      ["Total magnification = eyepiece × objective.", `${eye} × ${objective} = ${total}.`],
    );
  }
  if (course === "BIO 101" && topic === "Genetics") {
    const groups = intBetween(rand, 2, 6);
    const total = groups * 4;
    const dominant = groups * 3;
    return q(
      topic,
      `In a monohybrid cross of two heterozygotes, about how many of ${total} offspring show the dominant phenotype?`,
      String(dominant),
      numericWrongs(dominant, [total / 2, total, groups]),
      ["The expected phenotype ratio is 3 dominant : 1 recessive.", `${total} × 3/4 = ${dominant}.`],
    );
  }
  if (course === "BIO 101" && topic === "Classification of organisms") {
    const rows = [
      [
        "An organism with a cellulose cell wall, chloroplasts and no nervous system belongs to kingdom",
        "Plantae",
        ["Animalia", "Fungi", "Monera"],
      ],
      [
        "A unicellular organism with no true nucleus belongs to kingdom",
        "Monera",
        ["Plantae", "Animalia", "Fungi"],
      ],
      [
        "A multicellular organism that feeds on organic matter and has chitin in its cell wall belongs to kingdom",
        "Fungi",
        ["Plantae", "Animalia", "Monera"],
      ],
      [
        "An organism that is multicellular, moves and has no cell wall belongs to kingdom",
        "Animalia",
        ["Plantae", "Fungi", "Monera"],
      ],
    ];
    const row = rows[Math.floor(rand() * rows.length)];
    return q(topic, row[0], row[1], row[2], ["Use the kingdom features, not a single shared trait.", `The kingdom is ${row[1]}.`]);
  }
  if (course === "BIO 101" && topic === "Ecology") {
    const energy = intBetween(rand, 2, 9) * 1000;
    const next = energy / 10;
    return q(
      topic,
      `Producers fix ${energy} kJ. If 10% passes to the next trophic level, herbivores receive`,
      `${next} kJ`,
      withUnit(next, "kJ", [energy, energy / 100, next * 2]),
      ["About 10% of the energy passes to the next level.", `${energy} × 0.1 = ${next} kJ.`],
    );
  }
  if (course === "BIO 101" && topic === "Nutrition and digestion") {
    const rows = [
      ["Amylase begins the digestion of", "starch", ["protein", "fat", "cellulose"]],
      ["Protease digests", "protein", ["starch", "fat", "cellulose"]],
      ["Lipase digests", "fat", ["starch", "protein", "cellulose"]],
    ];
    const row = rows[Math.floor(rand() * rows.length)];
    return q(topic, row[0], row[1], row[2], ["Match the enzyme to its substrate.", `${row[0].split(" ")[0]} acts on ${row[1]}.`]);
  }
  if (course === "BIO 101" && topic === "Reproduction and evolution") {
    const parent = [46, 8, 12, 20][Math.floor(rand() * 4)];
    return q(
      topic,
      `Mitosis of a body cell with ${parent} chromosomes produces daughter cells with`,
      `${parent} chromosomes`,
      [`${parent / 2} chromosomes`, `${parent * 2} chromosomes`, "23 chromosomes"],
      ["Mitosis keeps the chromosome number the same.", `Each daughter cell has ${parent} chromosomes.`],
    );
  }
  return null;
}

function curatedPool(course, topics) {
  const bank = CURATED[course] || {};
  const chosen = topics.length ? topics : Object.keys(bank);
  return chosen.flatMap((topic) => bank[topic] || []);
}

function pqPool(course, topics) {
  return (PAST_QUESTIONS[course] || [])
    .filter((item) => !topics.length || topics.includes(item.topic))
    .map((item) => ({ ...item, origin: "pq" }));
}

function clone(item) {
  return {
    topic: item.topic,
    prompt: item.prompt,
    options: item.options.slice(),
    answer: item.answer,
    steps: item.steps.slice(),
    origin: item.origin === "pq" ? "pq" : "oracle",
    id: item.id,
  };
}

export function pickLocalQuestions({
  course,
  topics,
  count,
  avoid,
  batch = 0,
  salt = "",
}) {
  const blocked = [...(avoid || [])];
  const picked = [];
  const pqs = pqPool(course, topics).filter((item) => isFresh(item.prompt, blocked));
  const wantPq = pqs.length > 0 && (count >= 2 || batch % 2 === 0) ? 1 : 0;
  if (wantPq) {
    const item = pqs[batch % pqs.length];
    picked.push(clone(item));
    blocked.push(item.prompt);
  }

  const curated = curatedPool(course, topics).filter((item) =>
    isFresh(item.prompt, blocked),
  );
  let guard = 0;
  while (picked.length < count && guard < 40) {
    guard++;
    const seed = hashString(
      `${course}|${topics.join(",")}|${batch}|${salt}|${guard}|${picked.length}`,
    );
    const rand = mulberry32(seed);
    const topic = topics[guard % Math.max(topics.length, 1)] || topics[0];
    let made = topic ? generatedFor(course, topic, rand) : null;
    if (!made && curated.length) {
      made = curated.find((item) => isFresh(item.prompt, blocked));
    }
    if (!made || !isFresh(made.prompt, blocked)) continue;
    if (new Set(made.options).size !== 4) continue;
    picked.push(clone(made));
    blocked.push(made.prompt);
  }

  if (picked.length < count) {
    for (const item of curated) {
      if (picked.length >= count) break;
      if (!isFresh(item.prompt, blocked)) continue;
      picked.push(clone(item));
      blocked.push(item.prompt);
    }
  }
  return picked.slice(0, count);
}

export function labelQuestion(question) {
  const origin = question.origin === "pq" ? "pq" : "oracle";
  return {
    ...question,
    origin,
    source: origin === "pq" ? "PQ" : "Oracle Question",
  };
}
