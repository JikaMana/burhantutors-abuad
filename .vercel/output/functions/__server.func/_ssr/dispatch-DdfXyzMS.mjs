import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/dispatch-DdfXyzMS.js
var PAST_QUESTIONS = { "MTH 101": [
	{
		id: "mth101-z-sum",
		topic: "Complex numbers",
		prompt: "If z1 = 7 + 3i and z2 = 4 - 2i, what is z1 + z2?",
		options: [
			"11 + i",
			"11 + 5i",
			"3 + 5i",
			"11 - i"
		],
		answer: 0,
		steps: [
			"Add the real parts: 7 + 4 = 11.",
			"Add the imaginary parts: 3 + (−2) = 1.",
			"So z1 + z2 = 11 + i."
		]
	},
	{
		id: "mth101-z-product",
		topic: "Complex numbers",
		prompt: "If z1 = 7 + 3i and z2 = 4 − 2i, what is z1 × z2?",
		options: [
			"34 − 2i",
			"22 − 2i",
			"34 + 2i",
			"28 − 6i"
		],
		answer: 0,
		steps: [
			"(7 + 3i)(4 − 2i) = 28 − 14i + 12i − 6i².",
			"i² = −1, so −6i² = 6.",
			"Real part 28 + 6 = 34. Imaginary part −14 + 12 = −2.",
			"The product is 34 − 2i."
		]
	},
	{
		id: "mth101-quad-roots",
		topic: "Quadratic equations",
		prompt: "The roots of x² − 4x − 6 = 0 are",
		options: [
			"2 ± √10",
			"4 ± √10",
			"−2 ± √10",
			"2 ± √6"
		],
		answer: 0,
		steps: [
			"Use the quadratic formula with a = 1, b = −4, c = −6.",
			"Discriminant = 16 + 24 = 40 = 4 × 10.",
			"x = [4 ± √40] / 2 = [4 ± 2√10] / 2 = 2 ± √10."
		]
	},
	{
		id: "mth101-cube-roots",
		topic: "Quadratic equations",
		prompt: "The roots of x² − x + 1 = 0 satisfy which equation?",
		options: [
			"x³ = −1",
			"x³ = 1",
			"x² = −1",
			"x³ = 0"
		],
		answer: 0,
		steps: [
			"x³ + 1 = (x + 1)(x² − x + 1).",
			"On the roots of x² − x + 1 = 0, the second factor is 0.",
			"Therefore x³ + 1 = 0, so x³ = −1."
		]
	},
	{
		id: "mth101-gp",
		topic: "Sequences and series",
		prompt: "A geometric series has first term 192 and common ratio 1.5. The sum of the first 6 terms is",
		options: [
			"3990",
			"2880",
			"1920",
			"4320"
		],
		answer: 0,
		steps: [
			"Sₙ = a(rⁿ − 1) / (r − 1).",
			"1.5⁶ = 11.390625, so rⁿ − 1 = 10.390625.",
			"Divide by 0.5 to get 20.78125, then multiply by 192.",
			"S₆ = 3990."
		]
	},
	{
		id: "mth101-consecutive",
		topic: "Number systems",
		prompt: "Five consecutive integers add up to 100. The smallest is",
		options: [
			"18",
			"16",
			"20",
			"15"
		],
		answer: 0,
		steps: [
			"Let the integers be n, n+1, n+2, n+3, n+4.",
			"Their sum is 5n + 10 = 100.",
			"5n = 90, so n = 18.",
			"Check: 18 + 19 + 20 + 21 + 22 = 100."
		]
	},
	{
		id: "mth101-evens",
		topic: "Number systems",
		prompt: "The sum of the even numbers between 99 and 999 is",
		options: [
			"247050",
			"249500",
			"245000",
			"198000"
		],
		answer: 0,
		steps: [
			"The evens run from 100 to 998.",
			"This is an AP with difference 2 and 450 terms.",
			"Sum = (450 / 2) × (100 + 998) = 225 × 1098.",
			"225 × 1098 = 247050."
		]
	},
	{
		id: "mth101-sets",
		topic: "Sets",
		prompt: "If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, the symmetric difference A Δ B is",
		options: [
			"{1, 2, 5, 6}",
			"{3, 4}",
			"{1, 2, 3, 4, 5, 6}",
			"{1, 2}"
		],
		answer: 0,
		steps: [
			"A Δ B contains elements in A or B, but not both.",
			"The overlap is {3, 4}.",
			"Removing the overlap leaves {1, 2, 5, 6}."
		]
	},
	{
		id: "mth101-matrix",
		topic: "Matrices",
		prompt: "The expression 3(A + B) − 2A simplifies to",
		options: [
			"A + 3B",
			"5A + 3B",
			"A + B",
			"3B − A"
		],
		answer: 0,
		steps: [
			"Expand: 3(A + B) − 2A = 3A + 3B − 2A.",
			"3A − 2A = A.",
			"The result is A + 3B."
		]
	}
] };
var CURATED = {
	"MTH 103": {
		"Functions and graphs": [q("Functions and graphs", "If f(x) = 2x − 5, what is f(4)?", "3", [
			"8",
			"13",
			"−3"
		], ["f(4) = 2(4) − 5.", "8 − 5 = 3."]), q("Functions and graphs", "The graph of y = (x − 2)² + 1 has its vertex at", "(2, 1)", [
			"(−2, 1)",
			"(2, −1)",
			"(1, 2)"
		], ["y = (x − h)² + k has vertex (h, k).", "Here h = 2 and k = 1."])],
		"Limits and continuity": [q("Limits and continuity", "lim (x → 2) of (x² − 4) / (x − 2) equals", "4", [
			"0",
			"2",
			"undefined"
		], [
			"x² − 4 = (x − 2)(x + 2).",
			"For x ≠ 2 the expression is x + 2.",
			"The limit is 2 + 2 = 4."
		])],
		Differentiation: [q("Differentiation", "If y = 3x² − 4x + 1, then dy/dx equals", "6x − 4", [
			"3x − 4",
			"6x − 4x",
			"6x + 1"
		], ["Differentiate term by term.", "d/dx (3x²) = 6x and d/dx (−4x) = −4."])],
		Integration: [q("Integration", "∫ 2x dx equals", "x² + C", [
			"2x² + C",
			"x + C",
			"2 + C"
		], ["The antiderivative of xⁿ is xⁿ⁺¹ / (n + 1).", "∫ 2x dx = 2 × x² / 2 + C = x² + C."])],
		Trigonometry: [q("Trigonometry", "sin 30° equals", "1/2", [
			"√3/2",
			"1",
			"√2/2"
		], ["This is a standard angle.", "sin 30° = 1/2."])],
		"Coordinate geometry": [q("Coordinate geometry", "The midpoint of (2, 4) and (8, 10) is", "(5, 7)", [
			"(6, 14)",
			"(3, 3)",
			"(10, 14)"
		], ["Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2).", "((2 + 8) / 2, (4 + 10) / 2) = (5, 7)."])]
	},
	"PHY 101": {
		"Units and dimensions": [q("Units and dimensions", "The SI unit of force is", "newton", [
			"joule",
			"watt",
			"pascal"
		], ["Force is mass × acceleration.", "The SI unit is the newton, N = kg m/s²."])],
		Kinematics: [q("Kinematics", "A car starts from rest and accelerates at 2 m/s² for 5 s. Its speed is", "10 m/s", [
			"2.5 m/s",
			"7 m/s",
			"25 m/s"
		], ["v = u + at.", "v = 0 + 2 × 5 = 10 m/s."])],
		"Newton's laws": [q("Newton's laws", "A 4 kg body is acted on by a resultant force of 20 N. Its acceleration is", "5 m/s²", [
			"80 m/s²",
			"0.2 m/s²",
			"16 m/s²"
		], ["F = ma, so a = F / m.", "a = 20 / 4 = 5 m/s²."])],
		"Work, energy and power": [q("Work, energy and power", "A force of 10 N moves a body 3 m in the direction of the force. The work done is", "30 J", [
			"3.3 J",
			"13 J",
			"300 J"
		], ["W = Fs when force and displacement are parallel.", "W = 10 × 3 = 30 J."])],
		"Momentum and collisions": [q("Momentum and collisions", "A 2 kg body moves at 4 m/s. Its momentum is", "8 kg m/s", [
			"2 kg m/s",
			"6 kg m/s",
			"16 kg m/s"
		], ["p = mv.", "p = 2 × 4 = 8 kg m/s."])],
		"Circular motion and gravitation": [q("Circular motion and gravitation", "Weight is best described as", "the gravitational force on a body", [
			"the mass of a body",
			"the density of a body",
			"the volume of a body"
		], ["Mass is the amount of matter.", "Weight is the pull of gravity, W = mg."])]
	},
	"PHY 103": {
		"Electric charge and fields": [q("Electric charge and fields", "Like charges", "repel", [
			"attract",
			"have no effect",
			"always cancel"
		], ["Coulomb’s law: similar charges repel.", "Opposite charges attract."])],
		"Electric potential": [q("Electric potential", "Electric potential is measured in", "volts", [
			"amperes",
			"ohms",
			"teslas"
		], ["Potential difference is energy per unit charge.", "The SI unit is the volt."])],
		Capacitors: [q("Capacitors", "Capacitance is the ratio", "charge / potential difference", [
			"current / voltage",
			"voltage × charge",
			"resistance / current"
		], ["C = Q / V.", "A larger capacitance stores more charge at the same voltage."])],
		"Current and resistance": [q("Current and resistance", "A 12 V supply drives 2 A through a resistor. The resistance is", "6 Ω", [
			"24 Ω",
			"10 Ω",
			"0.17 Ω"
		], ["Ohm’s law: V = IR, so R = V / I.", "R = 12 / 2 = 6 Ω."])],
		Magnetism: [q("Magnetism", "The SI unit of magnetic flux density is the", "tesla", [
			"weber",
			"henry",
			"farad"
		], ["Magnetic flux is measured in webers.", "Flux density is measured in teslas."])],
		"Waves and optics": [q("Waves and optics", "A wave has frequency 50 Hz and wavelength 2 m. Its speed is", "100 m/s", [
			"25 m/s",
			"52 m/s",
			"48 m/s"
		], ["v = fλ.", "v = 50 × 2 = 100 m/s."])]
	},
	STAT: {
		"Descriptive statistics": [q("Descriptive statistics", "The mean of 4, 6, 8 and 10 is", "7", [
			"6",
			"8",
			"28"
		], ["Add the values: 4 + 6 + 8 + 10 = 28.", "Divide by 4: 28 / 4 = 7."])],
		Probability: [q("Probability", "A fair die is rolled once. The probability of a number greater than 4 is", "1/3", [
			"1/6",
			"1/2",
			"2/3"
		], ["The favourable outcomes are 5 and 6.", "Probability = 2 / 6 = 1/3."])],
		"Random variables": [q("Random variables", "A random variable assigns", "a number to each outcome of an experiment", [
			"a probability of 1 to every outcome",
			"only the mean of a sample",
			"a unit to a physical quantity"
		], ["A random variable is a numerical function on the sample space.", "Probabilities are then attached to those numbers."])],
		"Binomial and Poisson": [q("Binomial and Poisson", "A binomial experiment requires", "a fixed number of independent trials with two outcomes", [
			"a continuous time interval and rare events only",
			"normally distributed data",
			"a sample larger than 30"
		], ["Each trial is success or failure.", "The number of trials is fixed and the trials are independent."])],
		"Normal distribution": [q("Normal distribution", "In a normal distribution, the mean, median and mode are", "equal", [
			"in the ratio 1 : 2 : 3",
			"always different",
			"undefined"
		], ["A normal curve is symmetric about its centre.", "Mean, median and mode coincide."])],
		"Correlation and regression": [q("Correlation and regression", "A correlation coefficient of −0.9 indicates", "a strong negative linear relationship", [
			"no relationship",
			"a strong positive linear relationship",
			"a perfect positive relationship"
		], ["r is close to −1, so the linear association is strong.", "The sign is negative, so the variables move in opposite directions."])]
	},
	"CHM 101": {
		"Atomic structure": [q("Atomic structure", "The number of protons in the nucleus of an atom is its", "atomic number", [
			"mass number",
			"neutron number",
			"valency"
		], ["Atomic number Z counts protons.", "Mass number A counts protons and neutrons."])],
		"Periodic table": [q("Periodic table", "Elements in the same group of the periodic table have the same", "number of valence electrons", [
			"mass number",
			"number of neutrons",
			"number of electron shells"
		], ["Group number tracks the valence shell for the main groups.", "That is why elements in a group react in similar ways."])],
		"Chemical bonding": [q("Chemical bonding", "Sodium chloride is held together mainly by", "ionic bonds", [
			"covalent bonds",
			"metallic bonds",
			"hydrogen bonds"
		], ["Sodium loses an electron and chlorine gains it.", "The resulting ions attract: Na⁺ and Cl⁻."])],
		"Mole concept and stoichiometry": [q("Mole concept and stoichiometry", "The number of moles in 44 g of CO₂ (molar mass 44 g/mol) is", "1 mol", [
			"0.5 mol",
			"2 mol",
			"44 mol"
		], ["n = mass / molar mass.", "n = 44 / 44 = 1 mol."])],
		Gases: [q("Gases", "At constant temperature, if the volume of a fixed mass of gas is halved, the pressure", "doubles", [
			"is halved",
			"stays the same",
			"is quartered"
		], ["Boyle’s law: P₁V₁ = P₂V₂.", "If V₂ = V₁ / 2, then P₂ = 2P₁."])],
		"Acids, bases and pH": [q("Acids, bases and pH", "A solution with pH 3 is", "acidic", [
			"neutral",
			"basic",
			"neither acidic nor basic"
		], ["pH below 7 is acidic.", "pH 7 is neutral and pH above 7 is basic."])]
	},
	"BIO 101": {
		"Cell biology": [q("Cell biology", "Which structure controls what enters and leaves a cell?", "cell membrane", [
			"cell wall only",
			"ribosome",
			"nucleus only"
		], ["The cell membrane is selectively permeable.", "It regulates the passage of substances."])],
		Genetics: [q("Genetics", "In a monohybrid cross of two heterozygotes (Aa × Aa), the expected genotype ratio is", "1 : 2 : 1", [
			"3 : 1",
			"1 : 1",
			"9 : 3 : 3 : 1"
		], ["The Punnett square gives AA, Aa, Aa and aa.", "That is 1 AA : 2 Aa : 1 aa. The phenotype ratio is 3 : 1 if A is dominant."])],
		"Classification of organisms": [q("Classification of organisms", "The correct order of biological classification, from largest to smallest, begins", "kingdom, phylum, class", [
			"species, genus, family",
			"class, kingdom, phylum",
			"genus, kingdom, order"
		], ["The usual sequence starts kingdom, phylum, class, order, family, genus, species."])],
		Ecology: [q("Ecology", "A group of the same species living in one area is a", "population", [
			"community",
			"ecosystem",
			"biosphere"
		], ["A population is one species in a place.", "A community includes the populations of different species living together."])],
		"Nutrition and digestion": [q("Nutrition and digestion", "Amylase begins the digestion of", "starch", [
			"protein",
			"fat",
			"cellulose"
		], ["Salivary and pancreatic amylase act on starch.", "Proteases act on protein and lipase on fat."])],
		"Reproduction and evolution": [q("Reproduction and evolution", "Natural selection means that", "individuals with favourable traits are more likely to survive and reproduce", [
			"every organism produces identical offspring",
			"acquired injuries are always inherited",
			"evolution happens only by chance, with no role for the environment"
		], ["Variation exists in a population.", "Traits that help survival and reproduction become more common."])]
	}
};
function q(topic, prompt, correct, wrong, steps) {
	return {
		topic,
		prompt,
		options: [correct, ...wrong],
		answer: 0,
		steps,
		origin: "oracle"
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
var ALT = {
	"MTH 103|Limits and continuity": [q("Limits and continuity", "lim (x → 4) of 9 equals", "9", [
		"4",
		"0",
		"36"
	], ["The limit of a constant is the constant.", "The limit is 9."]), q("Limits and continuity", "A function is continuous at x = a when", "the limit at a equals the function value at a", [
		"the function is a polynomial only",
		"the limit is always zero",
		"a is negative"
	], ["Continuity needs the limit and the function value to agree.", "They must be equal at x = a."])],
	"MTH 103|Differentiation": [q("Differentiation", "The derivative of a constant is", "0", [
		"1",
		"the constant itself",
		"undefined"
	], ["A constant does not change.", "Its rate of change is 0."]), q("Differentiation", "d/dx (x³) equals", "3x²", [
		"x²",
		"3x",
		"x³ / 3"
	], ["Use the power rule.", "Bring down 3 and reduce the power to 2."])],
	"MTH 103|Integration": [q("Integration", "∫ 6 dx equals", "6x + C", [
		"6 + C",
		"x + C",
		"6x² + C"
	], ["The antiderivative of a constant k is kx.", "Do not forget + C."]), q("Integration", "∫ x² dx equals", "x³/3 + C", [
		"2x + C",
		"x³ + C",
		"x²/2 + C"
	], ["Increase the power by 1 and divide by the new power.", "∫ x² dx = x³/3 + C."])],
	"MTH 103|Coordinate geometry": [q("Coordinate geometry", "The distance between (0, 0) and (3, 4) is", "5", [
		"7",
		"12",
		"1"
	], ["Distance = sqrt((x2 − x1)² + (y2 − y1)²).", "sqrt(9 + 16) = sqrt(25) = 5."]), q("Coordinate geometry", "The gradient of the line through (1, 2) and (3, 8) is", "3", [
		"2",
		"6",
		"1/3"
	], ["Gradient = (y2 − y1) / (x2 − x1).", "(8 − 2) / (3 − 1) = 3."])],
	"PHY 101|Units and dimensions": [q("Units and dimensions", "The SI unit of force is the", "newton", [
		"joule",
		"watt",
		"pascal"
	], ["Force is measured in newtons.", "1 N = 1 kg m/s²."])],
	"PHY 101|Kinematics": [q("Kinematics", "A car starts from rest and accelerates at 2 m/s² for 5 s. Its speed is", "10 m/s", [
		"2 m/s",
		"7 m/s",
		"25 m/s"
	], ["v = u + at and u = 0.", "v = 2 × 5 = 10 m/s."])],
	"PHY 101|Newton's laws": [q("Newton's laws", "A 4 kg body is acted on by a resultant force of 20 N. Its acceleration is", "5 m/s²", [
		"80 m/s²",
		"16 m/s²",
		"4 m/s²"
	], ["a = F / m.", "a = 20 / 4 = 5 m/s²."])],
	"PHY 101|Work, energy and power": [q("Work, energy and power", "A force of 10 N moves a body 3 m in the direction of the force. The work done is", "30 J", [
		"13 J",
		"3.3 J",
		"7 J"
	], ["W = Fd.", "W = 10 × 3 = 30 J."])],
	"PHY 101|Momentum and collisions": [q("Momentum and collisions", "A 2 kg body moves at 4 m/s. Its momentum is", "8 kg m/s", [
		"6 kg m/s",
		"2 kg m/s",
		"16 kg m/s"
	], ["p = mv.", "p = 2 × 4 = 8 kg m/s."])],
	"PHY 101|Circular motion and gravitation": [q("Circular motion and gravitation", "Weight is best described as", "the gravitational force on a body", [
		"the mass of a body",
		"the volume of a body",
		"the speed of a body"
	], ["Weight is a force, mass is not.", "Near Earth, W = mg."])],
	"PHY 103|Electric charge and fields": [q("Electric charge and fields", "Like charges", "repel", [
		"attract",
		"cancel only in metals",
		"have no force"
	], ["Coulomb's law gives repulsion for the same sign.", "Unlike charges attract."])],
	"PHY 103|Electric potential": [q("Electric potential", "Electric potential is measured in", "volts", [
		"ohms",
		"farads",
		"tesla"
	], ["Potential difference is energy per unit charge.", "The unit is the volt."])],
	"PHY 103|Capacitors": [q("Capacitors", "Capacitance is the ratio", "charge / potential difference", [
		"potential difference / charge",
		"current / resistance",
		"force / charge"
	], ["C = Q / V.", "A larger capacitance stores more charge at the same voltage."])],
	"PHY 103|Current and resistance": [q("Current and resistance", "A 12 V supply drives 2 A through a resistor. The resistance is", "6 Ω", [
		"24 Ω",
		"10 Ω",
		"2 Ω"
	], ["R = V / I.", "R = 12 / 2 = 6 Ω."])],
	"PHY 103|Magnetism": [q("Magnetism", "The SI unit of magnetic flux density is the", "tesla", [
		"weber",
		"henry",
		"volt"
	], ["Flux density is measured in tesla.", "1 T = 1 N/(A m)."])],
	"PHY 103|Waves and optics": [q("Waves and optics", "The speed of a wave is frequency multiplied by", "wavelength", [
		"amplitude",
		"period only",
		"mass"
	], ["v = fλ.", "Wavelength is the length of one complete wave."]), q("Waves and optics", "A wave of frequency 4 Hz and wavelength 3 m has speed", "12 m/s", [
		"7 m/s",
		"1.3 m/s",
		"4 m/s"
	], ["v = fλ.", "v = 4 × 3 = 12 m/s."])],
	"STAT|Descriptive statistics": [q("Descriptive statistics", "The mean of 4, 6, 8 and 10 is", "7", [
		"6",
		"8",
		"28"
	], ["Add the values and divide by how many there are.", "(4 + 6 + 8 + 10) / 4 = 7."]), q("Descriptive statistics", "The median of 3, 9, 4, 7 and 5 is", "5", [
		"3",
		"9",
		"7"
	], ["Arrange the scores: 3, 4, 5, 7, 9.", "The middle value is 5."])],
	"STAT|Probability": [q("Probability", "A fair die is rolled once. The probability of a number greater than 4 is", "1/3", [
		"1/6",
		"1/2",
		"2/3"
	], ["The favourable outcomes are 5 and 6.", "2/6 = 1/3."])],
	"STAT|Random variables": [q("Random variables", "A random variable assigns", "a number to each outcome", [
		"a probability greater than 1",
		"only names, never numbers",
		"the sample size"
	], ["A random variable is a numerical outcome.", "Each outcome gets a number."])],
	"STAT|Binomial and Poisson": [q("Binomial and Poisson", "A binomial experiment requires", "a fixed number of independent trials with two outcomes", [
		"a changing number of trials",
		"more than two outcomes on every trial",
		"dependent trials only"
	], ["Each trial is success or failure.", "The number of trials is fixed and the trials are independent."])],
	"STAT|Normal distribution": [q("Normal distribution", "In a normal distribution, the mean, median and mode are", "equal", [
		"always different",
		"in the ratio 1 : 2 : 3",
		"undefined"
	], ["A normal curve is symmetric about the centre.", "The three averages coincide."])],
	"STAT|Correlation and regression": [q("Correlation and regression", "A correlation coefficient of −0.9 indicates", "a strong negative linear relationship", [
		"no relationship",
		"a strong positive relationship",
		"a weak positive relationship"
	], ["The sign shows the direction.", "A value close to −1 is a strong negative relationship."])],
	"CHM 101|Atomic structure": [q("Atomic structure", "The number of protons in the nucleus of an atom is its", "atomic number", [
		"mass number",
		"neutron number",
		"valency"
	], ["Atomic number counts protons.", "It identifies the element."])],
	"CHM 101|Periodic table": [q("Periodic table", "Elements in the same group of the periodic table have the same", "number of valence electrons", [
		"mass number",
		"number of neutrons",
		"number of shells only"
	], ["Group number tracks the valence electrons for the main groups.", "That is why they react in similar ways."])],
	"CHM 101|Mole concept and stoichiometry": [q("Mole concept and stoichiometry", "The number of moles in 44 g of CO₂ (molar mass 44 g/mol) is", "1 mol", [
		"44 mol",
		"2 mol",
		"0.5 mol"
	], ["n = mass / molar mass.", "44 / 44 = 1 mol."])],
	"CHM 101|Gases": [q("Gases", "At constant temperature, if the volume of a fixed mass of gas is halved, the pressure", "doubles", [
		"is halved",
		"stays the same",
		"becomes zero"
	], ["Boyle's law: pressure and volume are inversely proportional.", "Halving the volume doubles the pressure."])],
	"CHM 101|Acids, bases and pH": [q("Acids, bases and pH", "A solution with pH 3 is", "acidic", [
		"neutral",
		"basic",
		"neither acidic nor basic"
	], ["pH below 7 is acidic.", "pH 3 is acidic."])],
	"BIO 101|Cell biology": [q("Cell biology", "Which structure controls what enters and leaves a cell?", "the cell membrane", [
		"the nucleus only",
		"the cell wall only",
		"a ribosome"
	], ["The membrane is selectively permeable.", "It controls movement into and out of the cell."])],
	"BIO 101|Genetics": [q("Genetics", "In a monohybrid cross of two heterozygotes (Aa × Aa), the expected genotype ratio is", "1 : 2 : 1", [
		"3 : 1",
		"1 : 1",
		"9 : 3 : 3 : 1"
	], ["The Punnett square gives AA, Aa, Aa and aa.", "That is 1 : 2 : 1."])],
	"BIO 101|Ecology": [q("Ecology", "A group of the same species living in one area is a", "population", [
		"community",
		"ecosystem",
		"biosphere"
	], ["A population is one species.", "A community includes several species."])],
	"BIO 101|Reproduction and evolution": [q("Reproduction and evolution", "Natural selection means that", "individuals with favourable traits are more likely to survive and reproduce", [
		"every organism produces identical offspring",
		"acquired injuries are always inherited",
		"evolution happens only by chance, with no role for the environment"
	], ["Variation exists in a population.", "Helpful traits become more common."])]
};
function mulberry32(seed) {
	let a = seed >>> 0;
	return function rand() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hashString(value) {
	let h = 2166136261;
	const text = String(value);
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function normalisePrompt(prompt) {
	return String(prompt || "").toLowerCase().replace(/×/g, " times ").replace(/[−–]/g, " minus ").replace(/\+/g, " plus ").replace(/∫/g, " integral ").replace(/²/g, " squared ").replace(/³/g, " cubed ").replace(/√/g, " sqrt ").replace(/\d+/g, "#").replace(/[^a-z# ]+/g, " ").replace(/\s+/g, " ").trim();
}
var SIMILAR_STOP = /* @__PURE__ */ new Set([
	"the",
	"and",
	"what",
	"with",
	"for",
	"from",
	"that",
	"this",
	"equals",
	"equal",
	"into",
	"over",
	"then",
	"its",
	"has",
	"have",
	"are",
	"was",
	"when",
	"which",
	"than",
	"their",
	"them",
	"your",
	"about",
	"how",
	"many",
	"does",
	"each",
	"per",
	"only",
	"after",
	"before",
	"there",
	"these",
	"those",
	"will",
	"would",
	"can"
]);
function similarPrompt(a, b) {
	const left = normalisePrompt(a);
	const right = normalisePrompt(b);
	if (!left || !right) return false;
	if (left === right) return true;
	const toSet = (text) => new Set(text.split(" ").filter((word) => word.length > 2 && word !== "#" && !SIMILAR_STOP.has(word)));
	const A = toSet(left);
	const B = toSet(right);
	if (A.size < 3 || B.size < 3) return false;
	let intersection = 0;
	for (const word of A) if (B.has(word)) intersection++;
	const union = A.size + B.size - intersection;
	return union > 0 && intersection / union >= .72;
}
function isFresh(prompt, avoid) {
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
var MORE = {
	"PHY 101|Kinematics": [q("Kinematics", "A body starts from rest and accelerates at 3 m/s² for 4 s. The distance travelled is", "24 m", [
		"12 m",
		"7 m",
		"48 m"
	], ["s = ut + ½at² and u = 0.", "s = ½ × 3 × 16 = 24 m."])],
	"PHY 101|Newton's laws": [q("Newton's laws", "Newton's third law says that action and reaction forces are", "equal in size and opposite in direction", [
		"equal and in the same direction",
		"always unequal",
		"acting on the same body"
	], ["The forces are on two different bodies.", "They are equal and opposite."])],
	"PHY 101|Work, energy and power": [q("Work, energy and power", "Power is best described as", "the rate of doing work", [
		"the force times mass",
		"stored energy only",
		"distance divided by time"
	], ["P = W / t.", "A higher power does the same work in less time."])],
	"PHY 101|Momentum and collisions": [q("Momentum and collisions", "With no external force, the total momentum of a system", "stays constant", [
		"always increases",
		"always becomes zero",
		"equals the total mass"
	], ["This is conservation of momentum.", "Internal forces cancel in pairs."])],
	"PHY 101|Circular motion and gravitation": [q("Circular motion and gravitation", "Acceleration directed towards the centre of a circular path is called", "centripetal acceleration", [
		"tangential weight",
		"terminal velocity",
		"linear momentum"
	], ["The direction of the acceleration is inward.", "It is centripetal acceleration."])],
	"PHY 103|Electric charge and fields": [q("Electric charge and fields", "The SI unit of electric charge is the", "coulomb", [
		"ampere",
		"volt",
		"ohm"
	], ["Current is charge per second.", "Charge itself is measured in coulombs."])],
	"PHY 103|Electric potential": [q("Electric potential", "One volt is equal to one", "joule per coulomb", [
		"newton per coulomb",
		"ampere per ohm",
		"coulomb per second"
	], ["V = W / Q.", "1 V = 1 J/C."])],
	"PHY 103|Capacitors": [q("Capacitors", "Inserting a dielectric between capacitor plates usually", "increases the capacitance", [
		"reduces the charge to zero",
		"removes the potential difference permanently",
		"changes the plates into resistors"
	], ["A dielectric lets the capacitor store more charge at the same voltage.", "Capacitance increases."])],
	"PHY 103|Current and resistance": [q("Current and resistance", "A current of 3 A flows for 4 s. The charge transferred is", "12 C", [
		"7 C",
		"0.75 C",
		"1 C"
	], ["Q = It.", "Q = 3 × 4 = 12 C."])],
	"PHY 103|Magnetism": [q("Magnetism", "A magnetic field can exert a force on", "a moving charge", [
		"a stationary neutral atom only",
		"a mass at rest with no charge",
		"light in a vacuum only"
	], ["The magnetic force on a charge is qvB sin θ.", "A stationary charge feels no magnetic force."])],
	"PHY 103|Waves and optics": [q("Waves and optics", "The time taken for one complete wave to pass a point is the", "period", [
		"amplitude",
		"wavelength",
		"speed"
	], ["Period and frequency are reciprocals.", "T = 1/f."])],
	"STAT|Descriptive statistics": [q("Descriptive statistics", "The range of the scores 2, 9 and 5 is", "7", [
		"5",
		"9",
		"16"
	], ["Range = highest − lowest.", "9 − 2 = 7."])],
	"STAT|Probability": [q("Probability", "The probability of an impossible event is", "0", [
		"1",
		"1/2",
		"2"
	], ["Probability lies from 0 to 1.", "An impossible event has probability 0."])],
	"STAT|Random variables": [q("Random variables", "If a random variable is certain to be 6, its expected value is", "6", [
		"0",
		"1",
		"36"
	], ["A constant has expectation equal to that constant.", "E(6) = 6."])],
	"STAT|Binomial and Poisson": [q("Binomial and Poisson", "For 8 independent trials with success probability 1/2, the binomial variance is", "2", [
		"4",
		"8",
		"1"
	], ["Variance = np(1 − p).", "8 × 1/2 × 1/2 = 2."])],
	"STAT|Normal distribution": [q("Normal distribution", "About 95% of observations in a normal distribution lie within", "2 standard deviations of the mean", [
		"1 standard deviation of the mean",
		"4 standard deviations of the mean",
		"the interquartile range only"
	], ["The empirical rule gives about 95% within 2 standard deviations.", "About 68% lie within 1 standard deviation."])],
	"STAT|Correlation and regression": [q("Correlation and regression", "A correlation coefficient of 0 means", "no linear relationship", [
		"a perfect positive line",
		"a perfect negative line",
		"a causal relationship"
	], ["r = 0 means the linear association is absent.", "It does not by itself prove anything about a curve."])],
	"CHM 101|Atomic structure": [q("Atomic structure", "Isotopes of an element have the same", "atomic number", [
		"mass number",
		"number of neutrons",
		"number of nucleons"
	], ["Isotopes are the same element.", "They share a proton number and differ in neutrons."])],
	"CHM 101|Periodic table": [q("Periodic table", "The modern periodic table arranges the elements in order of", "atomic number", [
		"atomic mass only",
		"date of discovery",
		"density"
	], ["Moseley's work uses nuclear charge.", "The order is increasing atomic number."])],
	"CHM 101|Mole concept and stoichiometry": [q("Mole concept and stoichiometry", "One mole of any substance contains", "Avogadro's number of particles", [
		"18 grams only",
		"one atom only",
		"22.4 molecules only"
	], ["Avogadro's number is about 6.02 × 10²³.", "That quantity is one mole of particles."])],
	"CHM 101|Gases": [q("Gases", "In the ideal-gas calculations used at this level, 0°C is the same as", "273 K", [
		"0 K",
		"100 K",
		"373 K"
	], ["Kelvin = Celsius + 273.", "0°C = 273 K."])],
	"CHM 101|Acids, bases and pH": [q("Acids, bases and pH", "A neutral aqueous solution at room temperature has pH", "7", [
		"0",
		"1",
		"14"
	], ["pH 7 is neutral.", "Below 7 is acidic and above 7 is alkaline."])],
	"BIO 101|Cell biology": [q("Cell biology", "Ribosomes are the site of", "protein synthesis", [
		"photosynthesis",
		"lipid storage only",
		"cell division"
	], ["Ribosomes read mRNA.", "They assemble amino acids into proteins."])],
	"BIO 101|Genetics": [q("Genetics", "In DNA, adenine pairs with", "thymine", [
		"cytosine",
		"guanine",
		"uracil"
	], ["A pairs with T and G pairs with C.", "Uracil replaces thymine in RNA."])],
	"BIO 101|Ecology": [q("Ecology", "The role an organism plays in its habitat is its", "niche", [
		"population",
		"biome",
		"species"
	], ["A habitat is where it lives.", "A niche is how it lives there."])],
	"BIO 101|Reproduction and evolution": [q("Reproduction and evolution", "Meiosis produces daughter cells that are", "haploid", [
		"identical body cells",
		"always diploid clones",
		"unable to form gametes"
	], ["Meiosis halves the chromosome number.", "The daughter cells are haploid."])]
};
function generatedFor(course, topic, rand) {
	const alts = [...ALT[`${course}|${topic}`] || [], ...MORE[`${course}|${topic}`] || []];
	if (alts.length && rand() < .75) return alts[Math.floor(rand() * alts.length)];
	if (course === "MTH 101" && topic === "Complex numbers") {
		const a = intBetween(rand, 2, 8);
		const b = intBetween(rand, 1, 6);
		const c = intBetween(rand, 1, 7);
		const d = intBetween(rand, -5, 5) || 2;
		const mode = Math.floor(rand() * 4);
		if (mode === 1) {
			const real = a - c;
			const imag = b - d;
			return q(topic, `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 − z2?`, formatComplex(real, imag), [
				formatComplex(a + c, b + d),
				formatComplex(real, b + d),
				formatComplex(a * c, b * d)
			], [
				`Subtract the real parts: ${a} − ${c} = ${real}.`,
				`Subtract the imaginary parts: ${b} − (${d}) = ${imag}.`,
				`So z1 − z2 = ${formatComplex(real, imag)}.`
			]);
		}
		if (mode === 2) {
			const real = a * c - b * d;
			const imag = a * d + b * c;
			return q(topic, `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 × z2?`, formatComplex(real, imag), [
				formatComplex(a * c, b * d),
				formatComplex(a + c, b + d),
				formatComplex(real, a * d - b * c)
			], [
				`(${a} + ${b}i)(${formatComplex(c, d)}) = ${a * c} + (${a}*${d})i + (${b}*${c})i + (${b}*${d})i².`,
				"Replace i² with −1 and collect real and imaginary parts.",
				`The product is ${formatComplex(real, imag)}.`
			]);
		}
		if (mode === 3) return q(topic, `The real part of z = ${formatComplex(a, b)} is`, String(a), numericWrongs(a, [
			b,
			a + b,
			-b || b + 1
		]), ["A complex number a + bi has real part a.", `The real part is ${a}.`]);
		const real = a + c;
		const imag = b + d;
		return q(topic, `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 + z2?`, formatComplex(real, imag), [
			formatComplex(a - c, b - d),
			formatComplex(real, b - d),
			formatComplex(a * c, b * d)
		], [
			`Add the real parts: ${a} + ${c} = ${real}.`,
			`Add the imaginary parts: ${b} + (${d}) = ${imag}.`,
			`So z1 + z2 = ${formatComplex(real, imag)}.`
		]);
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
			return q(topic, `The discriminant of x² + ${b}x ${c < 0 ? "− " + -c : "+ " + c} = 0 is`, String(discriminant), numericWrongs(discriminant, [
				b * b,
				b * b + 4 * c,
				4 * c
			]), ["Discriminant = b² − 4ac.", `Here a = 1, so ${b}² − 4(${c}) = ${discriminant}.`]);
		}
		if (mode === 2) return q(topic, `The sum of the roots of x² − ${Math.abs(sum) || 3}x + ${Math.abs(product) || 2} = 0 is`, String(Math.abs(sum) || 3), numericWrongs(Math.abs(sum) || 3, [
			Math.abs(product) || 2,
			-(Math.abs(sum) || 3),
			0
		]), ["For x² − (sum)x + (product) = 0, the roots add to the coefficient of x.", `The sum of the roots is ${Math.abs(sum) || 3}.`]);
		const b = -sum;
		const prompt = `One root of x² ${b < 0 ? "− " + -b : "+ " + b}x ${product < 0 ? "− " + -product : "+ " + product} = 0 is ${r1}. The other root is`;
		const wrong = numericWrongs(r2, [
			sum,
			product,
			-r2 || r2 + 1
		]);
		return q(topic, prompt, String(r2), wrong, [
			"For x² − (sum)x + (product) = 0, the roots add to the sum and multiply to the product.",
			`The known root is ${r1}, and the roots add to ${sum}.`,
			`The other root is ${sum} − ${r1} = ${r2}.`
		]);
	}
	if (course === "MTH 101" && topic === "Sequences and series") {
		const a = intBetween(rand, 3, 12);
		const d = intBetween(rand, 2, 5);
		const n = intBetween(rand, 6, 10);
		const mode = Math.floor(rand() * 3);
		if (mode === 1) {
			const term = a + (n - 1) * d;
			return q(topic, `The ${n}th term of an arithmetic progression with first term ${a} and common difference ${d} is`, String(term), numericWrongs(term, [
				a + n * d,
				n * d,
				a * n
			]), ["The nth term is a + (n − 1)d.", `${a} + ${n - 1} × ${d} = ${term}.`]);
		}
		if (mode === 2) {
			const ratio = intBetween(rand, 2, 3);
			const sum = a * (ratio ** 3 - 1) / (ratio - 1);
			return q(topic, `A geometric progression has first term ${a} and common ratio ${ratio}. The sum of its first 3 terms is`, String(sum), numericWrongs(sum, [
				a * ratio,
				a * 3,
				a * ratio ** 3
			]), ["Sₙ = a(rⁿ − 1) / (r − 1).", `S₃ = ${a}(${ratio}³ − 1) / ${ratio - 1} = ${sum}.`]);
		}
		const sum = n / 2 * (2 * a + (n - 1) * d);
		return q(topic, `An arithmetic series has first term ${a} and common difference ${d}. The sum of the first ${n} terms is`, String(sum), numericWrongs(sum, [
			sum + d,
			a + (n - 1) * d,
			n * a
		]), ["Sₙ = n/2 × [2a + (n − 1)d].", `Sₙ = ${n}/2 × [2(${a}) + ${n - 1}(${d})] = ${sum}.`]);
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
			return q(topic, `In a class of ${universe}, ${a} take algebra and ${b} take sets. If ${both} take both, how many take algebra only?`, String(onlyA), numericWrongs(onlyA, [
				a,
				union,
				b - both
			]), ["Algebra only = |A| − |A ∩ B|.", `${a} − ${both} = ${onlyA}.`]);
		}
		if (mode === 2) {
			const neither = universe - union;
			return q(topic, `If |A ∪ B| = ${union} in a class of ${universe}, how many students are outside both sets?`, String(neither), numericWrongs(neither, [
				universe - a,
				universe - b,
				union
			]), ["Students outside both sets = class size − |A ∪ B|.", `${universe} − ${union} = ${neither}.`]);
		}
		return q(topic, `In a class of ${universe}, ${a} students take algebra and ${b} take sets. If ${both} take both, how many take at least one of the two?`, String(union), numericWrongs(union, [
			a + b,
			a - both,
			universe - union
		]), ["|A ∪ B| = |A| + |B| − |A ∩ B|.", `${a} + ${b} − ${both} = ${union}.`]);
	}
	if (course === "MTH 101" && topic === "Matrices") {
		const x = intBetween(rand, 1, 5);
		const y = intBetween(rand, 1, 5);
		const mode = Math.floor(rand() * 3);
		if (mode === 1) return q(topic, `If A = [${x}, ${y}] and B = [${y}, ${x}], what is A − B as a row?`, `[${x - y}, ${y - x}]`, [
			`[${x + y}, ${y + x}]`,
			`[${y - x}, ${x - y}]`,
			`[${x}, ${y}]`
		], [`A − B = [${x} − ${y}, ${y} − ${x}].`, `The row is [${x - y}, ${y - x}].`]);
		if (mode === 2) {
			const det = x * x - y * y;
			return q(topic, `The determinant of the matrix [[${x}, ${y}], [${y}, ${x}]] is`, String(det), numericWrongs(det, [
				x * y,
				x * x + y * y,
				x + y
			]), ["For [[a, b], [c, d]], determinant = ad − bc.", `${x}×${x} − ${y}×${y} = ${det}.`]);
		}
		return q(topic, `If A = [${x}, ${y}] and B = [${y}, ${x}], what is 2A + B as a row?`, `[${2 * x + y}, ${2 * y + x}]`, [
			`[${2 * x + 2 * y}, ${2 * y + 2 * x}]`,
			`[${x + y}, ${y + x}]`,
			`[${2 * x}, ${2 * y}]`
		], [`2A = [${2 * x}, ${2 * y}].`, `2A + B = [${2 * x + y}, ${2 * y + x}].`]);
	}
	if (course === "MTH 101" && topic === "Number systems") {
		const n = intBetween(rand, 8, 20);
		const mode = Math.floor(rand() * 3);
		if (mode === 1) {
			const count = intBetween(rand, 8, 16);
			const sum = count * (count + 1) / 2;
			return q(topic, `The sum of the first ${count} positive integers is`, String(sum), numericWrongs(sum, [
				count * count,
				count * (count - 1),
				sum + count
			]), ["The sum 1 + 2 + … + n is n(n + 1)/2.", `${count} × ${count + 1} / 2 = ${sum}.`]);
		}
		if (mode === 2) {
			const last = n * 2;
			const count = n;
			return q(topic, `How many even positive integers are there from 2 to ${last}?`, String(count), numericWrongs(count, [
				last,
				count - 1,
				count + 1
			]), ["The evens are 2, 4, …, 2n.", `There are ${count} of them.`]);
		}
		const sum = 3 * n + 3;
		return q(topic, `Three consecutive integers add up to ${sum}. The middle integer is`, String(n + 1), numericWrongs(n + 1, [
			n,
			n + 2,
			n + 3
		]), ["Let the integers be m − 1, m and m + 1.", `Their sum is 3m = ${sum}, so m = ${n + 1}.`]);
	}
	if (course === "PHY 101" && topic === "Kinematics") {
		const u = intBetween(rand, 2, 12);
		const a = intBetween(rand, 1, 4);
		const t = intBetween(rand, 2, 6);
		const v = u + a * t;
		return q(topic, `A body moving at ${u} m/s accelerates at ${a} m/s² for ${t} s. Its final speed is`, `${v} m/s`, [
			`${u + a} m/s`,
			`${u * t} m/s`,
			`${a * t} m/s`
		], ["v = u + at.", `v = ${u} + ${a} × ${t} = ${v} m/s.`]);
	}
	if (course === "PHY 101" && topic === "Newton's laws") {
		const m = intBetween(rand, 2, 8);
		const a = intBetween(rand, 2, 6);
		return q(topic, `The resultant force on a ${m} kg body that accelerates at ${a} m/s² is`, `${m * a} N`, [
			`${m + a} N`,
			`${m} N`,
			`${a} N`
		], ["F = ma.", `F = ${m} × ${a} = ${m * a} N.`]);
	}
	if (course === "CHM 101" && topic === "Mole concept and stoichiometry") {
		const moles = intBetween(rand, 2, 5);
		const m = moles * 18;
		return q(topic, `How many moles are in ${m} g of water? (H₂O = 18 g/mol)`, `${moles} mol`, [
			`${moles * 18} mol`,
			`${moles + 1} mol`,
			"18 mol"
		], ["n = mass / molar mass.", `n = ${m} / 18 = ${moles} mol.`]);
	}
	if (course === "STAT" && topic === "Descriptive statistics") {
		const a = intBetween(rand, 2, 9);
		const b = a + intBetween(rand, 1, 4);
		const c = b + intBetween(rand, 1, 4);
		const mean = (a + b + c) / 3;
		if (!Number.isInteger(mean)) return null;
		return q(topic, `The mean of ${a}, ${b} and ${c} is`, String(mean), [
			String(b),
			String(a + b + c),
			String(mean + 1)
		], [`Add the scores: ${a + b + c}.`, `Divide by 3 to get ${mean}.`]);
	}
	if (course === "MTH 103" && topic === "Functions and graphs") {
		const slope = intBetween(rand, 2, 6);
		const intercept = intBetween(rand, -5, 8) || 3;
		const x = intBetween(rand, 1, 7);
		const value = slope * x + intercept;
		return q(topic, `If f(x) = ${slope}x ${intercept < 0 ? "− " + -intercept : "+ " + intercept}, what is f(${x})?`, String(value), numericWrongs(value, [
			slope * x,
			value + slope,
			intercept
		]), [`f(${x}) = ${slope}(${x}) ${intercept < 0 ? "− " + -intercept : "+ " + intercept}.`, `${slope * x} ${intercept < 0 ? "− " + -intercept : "+ " + intercept} = ${value}.`]);
	}
	if (course === "MTH 103" && topic === "Limits and continuity") {
		const a = intBetween(rand, 2, 9);
		const limit = 2 * a;
		return q(topic, `lim (x → ${a}) of (x² − ${a * a}) / (x − ${a}) equals`, String(limit), numericWrongs(limit, [
			a,
			a * a,
			0
		]), [
			`x² − ${a * a} = (x − ${a})(x + ${a}).`,
			`For x ≠ ${a} the quotient is x + ${a}.`,
			`The limit is ${a} + ${a} = ${limit}.`
		]);
	}
	if (course === "MTH 103" && topic === "Differentiation") {
		const a = intBetween(rand, 2, 5);
		const b = intBetween(rand, 1, 7);
		const correct = `${2 * a}x + ${b}`;
		return q(topic, `If y = ${a}x² + ${b}x, then dy/dx equals`, correct, [
			`${a}x + ${b}`,
			`${2 * a}x`,
			`${a}x² + ${b}`
		], ["Differentiate term by term.", `d/dx (${a}x²) = ${2 * a}x and d/dx (${b}x) = ${b}.`]);
	}
	if (course === "MTH 103" && topic === "Integration") {
		const k = intBetween(rand, 1, 6) * 2;
		return q(topic, `∫ ${k}x dx equals`, `${k / 2}x² + C`, [
			`${k}x² + C`,
			`${k}x + C`,
			`${k / 2}x + C`
		], ["∫ x dx = x² / 2.", `∫ ${k}x dx = ${k} × x² / 2 + C = ${k / 2}x² + C.`]);
	}
	if (course === "MTH 103" && topic === "Trigonometry") {
		const rows = [
			[
				"sin 30°",
				"1/2",
				[
					"√3/2",
					"√2/2",
					"0"
				]
			],
			[
				"sin 60°",
				"√3/2",
				[
					"1/2",
					"√2/2",
					"1"
				]
			],
			[
				"cos 60°",
				"1/2",
				[
					"√3/2",
					"0",
					"1"
				]
			],
			[
				"cos 45°",
				"√2/2",
				[
					"1/2",
					"√3/2",
					"1"
				]
			],
			[
				"tan 45°",
				"1",
				[
					"0",
					"√3",
					"1/2"
				]
			]
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
		return q(topic, `The midpoint of (${x1}, ${y1}) and (${x2}, ${y2}) is`, `(${mx}, ${my})`, [
			`(${x1 + x2}, ${y1 + y2})`,
			`(${mx}, ${y1})`,
			`(${x2}, ${my})`
		], ["Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2).", `((${x1} + ${x2}) / 2, (${y1} + ${y2}) / 2) = (${mx}, ${my}).`]);
	}
	if (course === "PHY 101" && topic === "Units and dimensions") {
		const n = intBetween(rand, 2, 15);
		const ms = n * 5;
		return q(topic, `A speed of ${n * 18} km/h is equal to`, `${ms} m/s`, withUnit(ms, "m/s", [
			n * 18,
			n,
			ms * 2
		]), ["1 km/h = 1000/3600 m/s = 5/18 m/s.", `${n * 18} × 5/18 = ${ms} m/s.`]);
	}
	if (course === "PHY 101" && topic === "Work, energy and power") {
		const force = intBetween(rand, 2, 12);
		const distance = intBetween(rand, 2, 9);
		const work = force * distance;
		return q(topic, `The work done by a ${force} N force through ${distance} m, in its own direction, is`, `${work} J`, withUnit(work, "J", [
			force + distance,
			force,
			distance
		]), ["W = Fd when force and displacement are in the same direction.", `W = ${force} × ${distance} = ${work} J.`]);
	}
	if (course === "PHY 101" && topic === "Momentum and collisions") {
		const mass = intBetween(rand, 2, 8);
		const speed = intBetween(rand, 2, 9);
		const momentum = mass * speed;
		return q(topic, `The momentum of a ${mass} kg body moving at ${speed} m/s is`, `${momentum} kg m/s`, withUnit(momentum, "kg m/s", [
			mass + speed,
			mass,
			speed
		]), ["p = mv.", `p = ${mass} × ${speed} = ${momentum} kg m/s.`]);
	}
	if (course === "PHY 101" && topic === "Circular motion and gravitation") {
		const mass = intBetween(rand, 2, 6);
		const speed = intBetween(rand, 2, 5);
		const force = mass * speed;
		return q(topic, `A ${mass} kg mass moves at ${speed} m/s in a circle of radius ${speed} m. The centripetal force is`, `${force} N`, withUnit(force, "N", [
			mass * speed * speed,
			mass + speed,
			speed
		]), ["F = mv² / r.", `F = ${mass} × ${speed}² / ${speed} = ${force} N.`]);
	}
	if (course === "PHY 103" && topic === "Electric charge and fields") {
		const q1 = intBetween(rand, 2, 6);
		const q2 = intBetween(rand, 2, 6);
		const product = q1 * q2;
		return q(topic, `Two charges are ${q1} μC and ${q2} μC. The product of the charges, used in Coulomb's law, is`, `${product} μC²`, withUnit(product, "μC²", [
			q1 + q2,
			q1,
			q2
		]), ["Coulomb's law uses the product of the two charges.", `${q1} × ${q2} = ${product}.`]);
	}
	if (course === "PHY 103" && topic === "Electric potential") {
		const work = intBetween(rand, 2, 8) * intBetween(rand, 2, 5);
		const charge = intBetween(rand, 2, 5);
		if (work % charge !== 0) return null;
		const volts = work / charge;
		return q(topic, `The potential difference when ${work} J is used to move ${charge} C of charge is`, `${volts} V`, withUnit(volts, "V", [
			work,
			charge,
			work * charge
		]), ["V = W / Q.", `V = ${work} / ${charge} = ${volts} V.`]);
	}
	if (course === "PHY 103" && topic === "Capacitors") {
		const voltage = intBetween(rand, 2, 8);
		const capacitance = intBetween(rand, 2, 6);
		const charge = capacitance * voltage;
		return q(topic, `A ${capacitance} μF capacitor charged to ${voltage} V stores charge`, `${charge} μC`, withUnit(charge, "μC", [
			capacitance + voltage,
			voltage,
			capacitance
		]), ["Q = CV.", `Q = ${capacitance} × ${voltage} = ${charge} μC.`]);
	}
	if (course === "PHY 103" && topic === "Current and resistance") {
		const current = intBetween(rand, 2, 6);
		const resistance = intBetween(rand, 2, 9);
		const voltage = current * resistance;
		return q(topic, `The p.d. across a ${resistance} Ω resistor carrying ${current} A is`, `${voltage} V`, withUnit(voltage, "V", [
			resistance + current,
			resistance,
			current
		]), ["V = IR.", `V = ${current} × ${resistance} = ${voltage} V.`]);
	}
	if (course === "PHY 103" && topic === "Magnetism") {
		const field = intBetween(rand, 1, 4);
		const current = intBetween(rand, 2, 6);
		const length = intBetween(rand, 2, 5);
		const force = field * current * length;
		return q(topic, `The force on a ${length} m conductor carrying ${current} A at right angles to a ${field} T field is`, `${force} N`, withUnit(force, "N", [
			field * current,
			current * length,
			field + current + length
		]), ["F = BIL when the wire is perpendicular to the field.", `F = ${field} × ${current} × ${length} = ${force} N.`]);
	}
	if (course === "PHY 103" && topic === "Waves and optics") {
		const frequency = intBetween(rand, 2, 8);
		const wavelength = intBetween(rand, 2, 7);
		const speed = frequency * wavelength;
		return q(topic, `A wave of frequency ${frequency} Hz and wavelength ${wavelength} m has speed`, `${speed} m/s`, withUnit(speed, "m/s", [
			frequency + wavelength,
			frequency,
			wavelength
		]), ["v = fλ.", `v = ${frequency} × ${wavelength} = ${speed} m/s.`]);
	}
	if (course === "STAT" && topic === "Probability") {
		const red = intBetween(rand, 2, 7);
		const blue = intBetween(rand, 2, 7);
		const total = red + blue;
		return q(topic, `A bag has ${red} red beads and ${blue} blue beads. The probability of picking a red bead is`, `${red}/${total}`, [
			`${blue}/${total}`,
			`${red}/${blue}`,
			`${total}/${red}`
		], ["Probability = favourable outcomes / total outcomes.", `${red} red beads out of ${total} gives ${red}/${total}.`]);
	}
	if (course === "STAT" && topic === "Random variables") {
		const a = intBetween(rand, 1, 6);
		const b = intBetween(rand, 2, 8);
		const expected = (a + b) / 2;
		if (!Number.isInteger(expected)) return null;
		return q(topic, `A variable is equally likely to be ${a} or ${b}. Its expected value is`, String(expected), numericWrongs(expected, [
			a + b,
			a,
			b
		]), ["E(X) = Σ xP(x).", `Each outcome has probability 1/2, so E(X) = (${a} + ${b}) / 2 = ${expected}.`]);
	}
	if (course === "STAT" && topic === "Binomial and Poisson") {
		const n = intBetween(rand, 4, 12) * 2;
		const mean = n / 2;
		return q(topic, `A binomial experiment has ${n} trials and success probability 1/2. The mean number of successes is`, String(mean), numericWrongs(mean, [
			n,
			n / 4,
			1
		]), ["For a binomial distribution, mean = np.", `Mean = ${n} × 1/2 = ${mean}.`]);
	}
	if (course === "STAT" && topic === "Normal distribution") {
		const mean = intBetween(rand, 40, 70);
		const sd = intBetween(rand, 2, 8);
		const value = mean + sd;
		return q(topic, `A normal score has mean ${mean} and standard deviation ${sd}. The z-score of ${value} is`, "1", [
			"0",
			"2",
			String(sd)
		], ["z = (x − mean) / standard deviation.", `z = (${value} − ${mean}) / ${sd} = 1.`]);
	}
	if (course === "STAT" && topic === "Correlation and regression") {
		const slope = intBetween(rand, 2, 6);
		const intercept = intBetween(rand, 1, 9);
		return q(topic, `For the line y = ${slope}x + ${intercept}, y increases by how much when x increases by 1?`, String(slope), numericWrongs(slope, [
			intercept,
			slope + intercept,
			1
		]), ["The slope is the change in y for a one-unit increase in x.", `The slope is ${slope}.`]);
	}
	if (course === "CHM 101" && topic === "Atomic structure") {
		const protons = intBetween(rand, 6, 20);
		const neutrons = intBetween(rand, 6, 22);
		const mass = protons + neutrons;
		return q(topic, `An atom has atomic number ${protons} and mass number ${mass}. It has`, `${neutrons} neutrons`, [
			`${protons} neutrons`,
			`${mass} neutrons`,
			`${protons + mass} neutrons`
		], ["Mass number = protons + neutrons.", `Neutrons = ${mass} − ${protons} = ${neutrons}.`]);
	}
	if (course === "CHM 101" && topic === "Periodic table") {
		const group = intBetween(rand, 1, 2);
		return q(topic, `An element in group ${group} of the periodic table has how many valence electrons?`, String(group), numericWrongs(group, [
			group + 8,
			8,
			group + 1
		]), ["Groups 1 and 2 have that many valence electrons.", `Group ${group} has ${group} valence electron${group === 1 ? "" : "s"}.`]);
	}
	if (course === "CHM 101" && topic === "Chemical bonding") {
		const rows = [
			[
				"NaCl is best described as",
				"ionic",
				[
					"covalent",
					"metallic",
					"van der Waals"
				]
			],
			[
				"The bond in a chlorine molecule, Cl₂, is",
				"covalent",
				[
					"ionic",
					"metallic",
					"hydrogen"
				]
			],
			[
				"A bond formed by sharing a pair of electrons is",
				"covalent",
				[
					"ionic",
					"metallic",
					"hydrogen"
				]
			]
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
		return q(topic, `A gas at ${p1} atm occupies ${v1} L. At constant temperature, its volume at ${p2} atm is`, `${v2} L`, withUnit(v2, "L", [
			p1 * v1,
			v1,
			p2
		]), ["Boyle's law: P1V1 = P2V2.", `V2 = (${p1} × ${v1}) / ${p2} = ${v2} L.`]);
	}
	if (course === "CHM 101" && topic === "Acids, bases and pH") {
		const power = intBetween(rand, 1, 3);
		const zeros = "0." + "0".repeat(power - 1) + "1";
		return q(topic, `The pH of a ${zeros} M HCl solution is`, String(power), numericWrongs(power, [
			power + 1,
			7,
			14 - power
		]), ["HCl is a strong acid, so [H⁺] equals the concentration.", `pH = −log(${zeros}) = ${power}.`]);
	}
	if (course === "BIO 101" && topic === "Cell biology") {
		const eye = intBetween(rand, 5, 15);
		const objective = [
			4,
			10,
			40
		][Math.floor(rand() * 3)];
		const total = eye * objective;
		return q(topic, `A microscope has a ×${eye} eyepiece and a ×${objective} objective. The total magnification is`, `×${total}`, [
			`×${eye + objective}`,
			`×${eye}`,
			`×${objective}`
		], ["Total magnification = eyepiece × objective.", `${eye} × ${objective} = ${total}.`]);
	}
	if (course === "BIO 101" && topic === "Genetics") {
		const groups = intBetween(rand, 2, 6);
		const total = groups * 4;
		const dominant = groups * 3;
		return q(topic, `In a monohybrid cross of two heterozygotes, about how many of ${total} offspring show the dominant phenotype?`, String(dominant), numericWrongs(dominant, [
			total / 2,
			total,
			groups
		]), ["The expected phenotype ratio is 3 dominant : 1 recessive.", `${total} × 3/4 = ${dominant}.`]);
	}
	if (course === "BIO 101" && topic === "Classification of organisms") {
		const rows = [
			[
				"An organism with a cellulose cell wall, chloroplasts and no nervous system belongs to kingdom",
				"Plantae",
				[
					"Animalia",
					"Fungi",
					"Monera"
				]
			],
			[
				"A unicellular organism with no true nucleus belongs to kingdom",
				"Monera",
				[
					"Plantae",
					"Animalia",
					"Fungi"
				]
			],
			[
				"A multicellular organism that feeds on organic matter and has chitin in its cell wall belongs to kingdom",
				"Fungi",
				[
					"Plantae",
					"Animalia",
					"Monera"
				]
			],
			[
				"An organism that is multicellular, moves and has no cell wall belongs to kingdom",
				"Animalia",
				[
					"Plantae",
					"Fungi",
					"Monera"
				]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], ["Use the kingdom features, not a single shared trait.", `The kingdom is ${row[1]}.`]);
	}
	if (course === "BIO 101" && topic === "Ecology") {
		const energy = intBetween(rand, 2, 9) * 1e3;
		const next = energy / 10;
		return q(topic, `Producers fix ${energy} kJ. If 10% passes to the next trophic level, herbivores receive`, `${next} kJ`, withUnit(next, "kJ", [
			energy,
			energy / 100,
			next * 2
		]), ["About 10% of the energy passes to the next level.", `${energy} × 0.1 = ${next} kJ.`]);
	}
	if (course === "BIO 101" && topic === "Nutrition and digestion") {
		const rows = [
			[
				"Amylase begins the digestion of",
				"starch",
				[
					"protein",
					"fat",
					"cellulose"
				]
			],
			[
				"Protease digests",
				"protein",
				[
					"starch",
					"fat",
					"cellulose"
				]
			],
			[
				"Lipase digests",
				"fat",
				[
					"starch",
					"protein",
					"cellulose"
				]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], ["Match the enzyme to its substrate.", `${row[0].split(" ")[0]} acts on ${row[1]}.`]);
	}
	if (course === "BIO 101" && topic === "Reproduction and evolution") {
		const parent = [
			46,
			8,
			12,
			20
		][Math.floor(rand() * 4)];
		return q(topic, `Mitosis of a body cell with ${parent} chromosomes produces daughter cells with`, `${parent} chromosomes`, [
			`${parent / 2} chromosomes`,
			`${parent * 2} chromosomes`,
			"23 chromosomes"
		], ["Mitosis keeps the chromosome number the same.", `Each daughter cell has ${parent} chromosomes.`]);
	}
	return null;
}
function curatedPool(course, topics) {
	const bank = CURATED[course] || {};
	return (topics.length ? topics : Object.keys(bank)).flatMap((topic) => bank[topic] || []);
}
function pqPool(course, topics) {
	return (PAST_QUESTIONS[course] || []).filter((item) => !topics.length || topics.includes(item.topic)).map((item) => ({
		...item,
		origin: "pq"
	}));
}
function clone(item) {
	return {
		topic: item.topic,
		prompt: item.prompt,
		options: item.options.slice(),
		answer: item.answer,
		steps: item.steps.slice(),
		origin: item.origin === "pq" ? "pq" : "oracle",
		id: item.id
	};
}
function pickLocalQuestions({ course, topics, count, avoid, batch = 0, salt = "" }) {
	const blocked = [...avoid || []];
	const picked = [];
	const pqs = pqPool(course, topics).filter((item) => isFresh(item.prompt, blocked));
	if (pqs.length > 0 && (count >= 2 || batch % 2 === 0) ? 1 : 0) {
		const item = pqs[batch % pqs.length];
		picked.push(clone(item));
		blocked.push(item.prompt);
	}
	const curated = curatedPool(course, topics).filter((item) => isFresh(item.prompt, blocked));
	let guard = 0;
	while (picked.length < count && guard < 40) {
		guard++;
		const rand = mulberry32(hashString(`${course}|${topics.join(",")}|${batch}|${salt}|${guard}|${picked.length}`));
		const topic = topics[guard % Math.max(topics.length, 1)] || topics[0];
		let made = topic ? generatedFor(course, topic, rand) : null;
		if (!made && curated.length) made = curated.find((item) => isFresh(item.prompt, blocked));
		if (!made || !isFresh(made.prompt, blocked)) continue;
		if (new Set(made.options).size !== 4) continue;
		picked.push(clone(made));
		blocked.push(made.prompt);
	}
	if (picked.length < count) for (const item of curated) {
		if (picked.length >= count) break;
		if (!isFresh(item.prompt, blocked)) continue;
		picked.push(clone(item));
		blocked.push(item.prompt);
	}
	return picked.slice(0, count);
}
function labelQuestion(question) {
	const origin = question.origin === "pq" ? "pq" : "oracle";
	return {
		...question,
		origin,
		source: origin === "pq" ? "PQ" : "Oracle Question"
	};
}
var memory = /* @__PURE__ */ new Map();
var payments = /* @__PURE__ */ new Map();
function firebaseConfigured() {
	return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}
function authMode() {
	return firebaseConfigured() ? "firebase" : "local";
}
function promoUntilDate() {
	return process.env.ORACLE_FREE_UNTIL || "2026-11-20";
}
function promoActive(now = Date.now()) {
	const end = (/* @__PURE__ */ new Date(`${promoUntilDate()}T23:59:59+01:00`)).getTime();
	return Number.isFinite(end) && now <= end;
}
function lagosDay(now = Date.now()) {
	return new Date(now + 36e5).toISOString().slice(0, 10);
}
function originAllowed(req) {
	const origin = req.headers.get("origin");
	if (!origin) return false;
	let originHost;
	try {
		originHost = new URL(origin).host;
	} catch {
		return false;
	}
	const hosts = [
		req.headers.get("host"),
		req.headers.get("x-forwarded-host"),
		new URL(req.url).host
	].filter(Boolean).map((host) => host.split(",")[0].trim());
	const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((host) => host.trim()).filter(Boolean);
	return hosts.includes(originHost) || extra.includes(originHost);
}
var json = (status, body) => new Response(JSON.stringify(body), {
	status,
	headers: {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store",
		"X-Content-Type-Options": "nosniff"
	}
});
function memoryUser(uid) {
	if (!memory.has(uid)) memory.set(uid, {
		email: null,
		premiumUntil: null,
		usage: {},
		daily: {},
		tests: [],
		seen: [],
		payments: {}
	});
	return memory.get(uid);
}
var firebasePromise;
async function firebaseServices() {
	if (!firebasePromise) firebasePromise = (async () => {
		const { cert, getApps, initializeApp } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.r);
		const { getAuth } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.n);
		const { getFirestore } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
		if (!getApps().length) {
			const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
			if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured.");
			const serviceAccount = JSON.parse(raw);
			initializeApp({ credential: cert({
				...serviceAccount,
				privateKey: serviceAccount.private_key?.replace(/\\n/g, "\n")
			}) });
		}
		return {
			auth: getAuth(),
			db: getFirestore()
		};
	})();
	return firebasePromise;
}
async function authenticatedUser(req, required = true) {
	const match = (req.headers.get("authorization") || "").match(/^Bearer\s+(.+)$/i);
	if (!firebaseConfigured()) {
		if (match && match[1].startsWith("local:")) {
			const id = match[1].slice(6);
			if (/^[a-zA-Z0-9_-]{8,80}$/.test(id)) return {
				uid: `local_${id}`,
				email: null,
				local: true
			};
		}
		if (!required) return null;
		return null;
	}
	if (!match) return required ? null : null;
	try {
		const { auth } = await firebaseServices();
		return await auth.verifyIdToken(match[1]);
	} catch (error) {
		if (!required) throw error;
		throw error;
	}
}
async function hasPremium(uid) {
	if (!uid) return false;
	if (promoActive()) return true;
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const until = memoryUser(uid).premiumUntil;
		return Boolean(until && new Date(until).getTime() > Date.now());
	}
	const { db } = await firebaseServices();
	const expiresAt = (await db.collection("oracleUsers").doc(uid).get()).get("premiumUntil");
	return Boolean(expiresAt && expiresAt.toMillis() > Date.now());
}
function paidAccessExpiry(start = /* @__PURE__ */ new Date()) {
	const expiry = new Date(start);
	const day = expiry.getUTCDate();
	expiry.setUTCDate(1);
	expiry.setUTCMonth(expiry.getUTCMonth() + 6);
	const lastDay = new Date(Date.UTC(expiry.getUTCFullYear(), expiry.getUTCMonth() + 1, 0)).getUTCDate();
	expiry.setUTCDate(Math.min(day, lastDay));
	return expiry;
}
function activeCourseIds(used) {
	return Object.keys(used || {}).filter((course) => used[course] > 0);
}
async function readDailyUsage(uid) {
	if (!uid) return {};
	const day = lagosDay();
	if (!firebaseConfigured() || String(uid).startsWith("local_")) return { ...memoryUser(uid).daily[day] || {} };
	const { db } = await firebaseServices();
	return (await db.collection("oracleUsers").doc(uid).collection("dailyUsage").doc(day).get()).get("courses") || {};
}
async function recordFreeUsage(uid, course, count, freeDaily, freeCourses) {
	const day = lagosDay();
	const apply = (used) => {
		const current = Number(used[course]) || 0;
		if (current + count > freeDaily) return {
			allowed: false,
			code: "quota",
			used: current
		};
		const active = activeCourseIds(used);
		if (!used[course] && active.length >= freeCourses) return {
			allowed: false,
			code: "subject_limit",
			subjectsUsed: active.length
		};
		const next = current + count;
		const courses = {
			...used,
			[course]: next
		};
		return {
			allowed: true,
			used: next,
			courses,
			subjectsUsed: activeCourseIds(courses).length
		};
	};
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const user = memoryUser(uid);
		const result = apply({ ...user.daily[day] || {} });
		if (result.allowed) user.daily[day] = result.courses;
		return result;
	}
	const { db, FieldValue } = await firebaseBundle();
	const dailyRef = db.collection("oracleUsers").doc(uid).collection("dailyUsage").doc(day);
	return db.runTransaction(async (transaction) => {
		const used = (await transaction.get(dailyRef)).get("courses") || {};
		const result = apply(used);
		if (!result.allowed) return result;
		transaction.set(dailyRef, {
			courses: result.courses,
			updatedAt: FieldValue.serverTimestamp()
		}, { merge: true });
		return result;
	});
}
async function firebaseBundle() {
	const services = await firebaseServices();
	const { FieldValue, Timestamp } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
	return {
		...services,
		FieldValue,
		Timestamp
	};
}
async function recordPaidUsage(user, course, questionCount) {
	if (!user || questionCount < 1 || promoActive()) return;
	if (!firebaseConfigured() || user.local) {
		const row = memoryUser(user.uid);
		const day = lagosDay();
		row.usage.paidQuestionsTotal = Number(row.usage.paidQuestionsTotal || 0) + questionCount;
		row.usage.paidQuestionsByDay = row.usage.paidQuestionsByDay || {};
		row.usage.paidQuestionsByDay[day] = Number(row.usage.paidQuestionsByDay[day] || 0) + questionCount;
		row.usage.paidQuestionsByCourse = row.usage.paidQuestionsByCourse || {};
		row.usage.paidQuestionsByCourse[course] = Number(row.usage.paidQuestionsByCourse[course] || 0) + questionCount;
		return;
	}
	const { db, FieldValue } = await firebaseBundle();
	const day = lagosDay();
	await db.collection("oracleUsers").doc(user.uid).set({
		email: user.email || null,
		usage: {
			paidQuestionsTotal: FieldValue.increment(questionCount),
			paidQuestionsByDay: { [day]: FieldValue.increment(questionCount) },
			paidQuestionsByCourse: { [course]: FieldValue.increment(questionCount) },
			lastPaidPracticeAt: FieldValue.serverTimestamp()
		},
		updatedAt: FieldValue.serverTimestamp()
	}, { merge: true });
}
async function readSeen(uid) {
	if (!uid) return [];
	if (!firebaseConfigured() || String(uid).startsWith("local_")) return memoryUser(uid).seen.slice();
	const { db } = await firebaseServices();
	const seen = (await db.collection("oracleUsers").doc(uid).get()).get("seenPrompts");
	return Array.isArray(seen) ? seen.filter((item) => typeof item === "string") : [];
}
async function writeSeen(uid, prompts) {
	const next = [];
	for (const prompt of prompts || []) {
		const text = String(prompt || "").replace(/\s+/g, " ").trim().slice(0, 140);
		if (text && !next.includes(text)) next.push(text);
	}
	if (!next.length || !uid) return;
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const user = memoryUser(uid);
		user.seen = [...user.seen, ...next].slice(-80);
		return;
	}
	try {
		const { db } = await firebaseServices();
		const ref = db.collection("oracleUsers").doc(uid);
		const snapshot = await ref.get();
		const merged = [...Array.isArray(snapshot.get("seenPrompts")) ? snapshot.get("seenPrompts") : [], ...next].slice(-80);
		await ref.set({ seenPrompts: merged }, { merge: true });
	} catch (error) {
		console.error("Could not store seen prompts", error?.message);
	}
}
async function readProfile(uid) {
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const user = memoryUser(uid);
		return {
			premiumUntil: user.premiumUntil,
			usage: user.usage,
			tests: user.tests.filter((test) => test.status === "completed").slice(0, 20)
		};
	}
	const { db } = await firebaseServices();
	const userSnapshot = await db.collection("oracleUsers").doc(uid).get();
	const premiumUntil = userSnapshot.get("premiumUntil");
	const snapshot = await db.collection("oracleUsers").doc(uid).collection("tests").orderBy("completedAt", "desc").limit(20).get();
	return {
		premiumUntil: premiumUntil?.toDate?.().toISOString() || null,
		usage: userSnapshot.get("usage") || {},
		tests: snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
	};
}
async function saveActivity(user, input) {
	if (!firebaseConfigured() || user.local) return saveActivityMemory(user, input);
	return saveActivityFirebase(user, input);
}
function saveActivityMemory(user, input) {
	const row = memoryUser(user.uid);
	const id = String(input.id);
	let test = row.tests.find((item) => String(item.id) === id);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (input.action === "start") {
		if (!test) {
			test = {
				id,
				course: input.course,
				topics: input.topics,
				total: input.total,
				status: "in_progress",
				startedAt: now,
				answers: {}
			};
			row.tests.unshift(test);
		}
		return {
			saved: true,
			id,
			status: 201
		};
	}
	if (!test) {
		test = {
			id,
			course: input.course,
			topics: input.topics,
			status: "in_progress",
			answers: {}
		};
		row.tests.unshift(test);
	}
	if (input.action === "answer") {
		test.answers = test.answers || {};
		test.answers[input.index] = input.answer;
		return {
			saved: true,
			id,
			status: 200
		};
	}
	if (input.action === "solution" || input.action === "abandon") {
		if (input.action === "abandon" && test.status === "in_progress") {
			test.status = "abandoned";
			test.abandonedAt = now;
		}
		return {
			saved: true,
			id,
			status: 200
		};
	}
	test.course = input.course;
	test.topics = input.topics;
	test.total = input.total;
	test.correct = input.correct;
	test.score = Math.round(input.correct / input.total * 100);
	test.topicResults = input.topicResults;
	test.answers = input.answers;
	test.status = "completed";
	test.completedAt = now;
	test.date = Date.now();
	return {
		saved: true,
		id,
		status: 201
	};
}
async function saveActivityFirebase(user, input) {
	const { FieldValue } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
	const { db } = await firebaseServices();
	const testId = String(input.id);
	const testRef = db.collection("oracleUsers").doc(user.uid).collection("tests").doc(testId);
	const accountRef = db.collection("oracleUsers").doc(user.uid);
	const activity = accountRef.collection("activity");
	const course = input.course;
	const topics = input.topics;
	const total = input.total;
	if (input.action === "start") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			if ((await transaction.get(testRef)).exists) return;
			transaction.set(testRef, {
				course,
				topics,
				total,
				status: "in_progress",
				startedAt: timestamp
			});
			transaction.set(activity.doc(`test_${testId}_started`), {
				type: "test_started",
				testId,
				course,
				total,
				occurredAt: timestamp
			});
			transaction.set(accountRef, {
				email: user.email || null,
				lastActivityAt: timestamp,
				updatedAt: timestamp
			}, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 201
		};
	}
	if (input.action === "answer") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			const existing = await transaction.get(testRef);
			if (!existing.exists || existing.get("status") !== "in_progress") return;
			transaction.set(testRef, { answers: { [input.index]: input.answer } }, { merge: true });
			transaction.set(activity.doc(`test_${testId}_answer_${input.index}`), {
				type: "question_answered",
				testId,
				course,
				index: input.index,
				...input.answer,
				occurredAt: timestamp
			});
			transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 200
		};
	}
	if (input.action === "solution") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			const existing = await transaction.get(testRef);
			if (!existing.exists || existing.get("status") !== "in_progress") return;
			transaction.set(activity.doc(`test_${testId}_solution_${input.index}`), {
				type: "solution_viewed",
				testId,
				course,
				index: input.index,
				topic: input.topic,
				occurredAt: timestamp
			});
			transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 200
		};
	}
	if (input.action === "abandon") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			const existing = await transaction.get(testRef);
			if (!existing.exists || existing.get("status") !== "in_progress") return;
			transaction.set(testRef, {
				status: "abandoned",
				abandonedAt: timestamp
			}, { merge: true });
			transaction.set(activity.doc(`test_${testId}_abandoned`), {
				type: "test_abandoned",
				testId,
				course,
				occurredAt: timestamp
			});
			transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 200
		};
	}
	const correct = input.correct;
	const score = Math.round(correct / total * 100);
	const saved = await db.runTransaction(async (transaction) => {
		const existing = await transaction.get(testRef);
		if (existing.exists && existing.get("status") === "completed") return false;
		const timestamp = FieldValue.serverTimestamp();
		transaction.set(testRef, {
			course,
			topics,
			total,
			correct,
			score,
			topicResults: input.topicResults,
			answers: input.answers,
			status: "completed",
			completedAt: timestamp
		}, { merge: true });
		transaction.set(accountRef, {
			email: user.email || null,
			lastActivityAt: timestamp,
			updatedAt: timestamp
		}, { merge: true });
		transaction.set(activity.doc(`test_${testId}_completed`), {
			type: "test_completed",
			testId,
			course,
			total,
			correct,
			score,
			completedAt: timestamp
		});
		return true;
	});
	return {
		saved: true,
		id: testRef.id,
		status: saved ? 201 : 200
	};
}
function siteOrigin(req) {
	const raw = process.env.SITE_URL;
	if (raw) try {
		const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
		return new URL(withProto).origin;
	} catch {}
	return new URL(req.url).origin;
}
var PRICE_KOBO = 15e4;
async function grantPremium({ uid, email, reference, amount, currency }) {
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const prior = payments.get(reference);
		if (prior && prior.uid !== uid) throw new Error("Payment reference already belongs to another account.");
		if (prior?.status === "success" && prior.premiumUntil) return new Date(prior.premiumUntil);
		const user = memoryUser(uid);
		const currentExpiry = user.premiumUntil ? new Date(user.premiumUntil) : null;
		const expiry = paidAccessExpiry(currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : /* @__PURE__ */ new Date());
		user.email = email || user.email;
		user.premiumUntil = expiry.toISOString();
		payments.set(reference, {
			uid,
			amount,
			currency,
			status: "success",
			premiumUntil: expiry.toISOString()
		});
		return expiry;
	}
	const { db, FieldValue, Timestamp } = await firebaseBundle();
	const userRef = db.collection("oracleUsers").doc(uid);
	const paymentRef = db.collection("oraclePayments").doc(reference);
	const activityRef = userRef.collection("activity").doc(`payment_${reference}_succeeded`);
	return db.runTransaction(async (transaction) => {
		const priorPayment = await transaction.get(paymentRef);
		if (priorPayment.exists && priorPayment.get("uid") !== uid) throw new Error("Payment reference already belongs to another account.");
		const existingExpiry = priorPayment.get("premiumUntil")?.toDate?.();
		if (priorPayment.get("status") === "success" && existingExpiry) return existingExpiry;
		const currentExpiry = (await transaction.get(userRef)).get("premiumUntil")?.toDate?.();
		const expiry = paidAccessExpiry(currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : /* @__PURE__ */ new Date());
		const timestamp = FieldValue.serverTimestamp();
		transaction.set(userRef, {
			email: email || null,
			premiumUntil: Timestamp.fromDate(expiry),
			lastPaymentReference: reference,
			lastActivityAt: timestamp,
			updatedAt: timestamp
		}, { merge: true });
		transaction.set(paymentRef, {
			uid,
			amount,
			currency,
			status: "success",
			plan: "oracle-semester",
			premiumUntil: Timestamp.fromDate(expiry),
			verifiedAt: timestamp
		}, { merge: true });
		transaction.set(activityRef, {
			type: "payment_succeeded",
			reference,
			amount,
			currency,
			plan: "oracle-semester",
			premiumUntil: Timestamp.fromDate(expiry),
			occurredAt: timestamp
		});
		return expiry;
	});
}
async function initializePayment(user, req) {
	if (!process.env.PAYSTACK_SECRET_KEY) return json(503, { error: "Payments are not configured yet." });
	if (!user.email) return json(400, { error: user.local ? "Paid checkout needs the email on your Exam Oracle account." : "Your account needs an email address." });
	let callbackUrl;
	try {
		callbackUrl = new URL("/exam-oracle.html", siteOrigin(req));
	} catch {
		return json(503, { error: "SITE_URL is not configured correctly." });
	}
	callbackUrl.searchParams.set("payment", "paystack");
	const response = await fetch("https://api.paystack.co/transaction/initialize", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: user.email,
			amount: PRICE_KOBO,
			currency: "NGN",
			callback_url: callbackUrl.toString(),
			metadata: {
				oracleUid: user.uid,
				plan: "oracle-semester"
			}
		})
	});
	const result = await response.json();
	if (!response.ok || !result.status || !result.data?.authorization_url) {
		console.error("Paystack initialization failed", result.message || response.status);
		return json(502, { error: "Could not start payment. Please try again." });
	}
	const reference = result.data.reference;
	if (!firebaseConfigured() || user.local) payments.set(reference, {
		uid: user.uid,
		amount: PRICE_KOBO,
		currency: "NGN",
		status: "pending"
	});
	else {
		const { db, FieldValue } = await firebaseBundle();
		const timestamp = FieldValue.serverTimestamp();
		const userRef = db.collection("oracleUsers").doc(user.uid);
		await db.runTransaction(async (transaction) => {
			transaction.set(db.collection("oraclePayments").doc(reference), {
				uid: user.uid,
				amount: PRICE_KOBO,
				currency: "NGN",
				status: "pending",
				plan: "oracle-semester",
				createdAt: timestamp
			});
			transaction.set(userRef.collection("activity").doc(`payment_${reference}_started`), {
				type: "payment_started",
				reference,
				amount: PRICE_KOBO,
				currency: "NGN",
				plan: "oracle-semester",
				occurredAt: timestamp
			});
			transaction.set(userRef, {
				email: user.email,
				lastActivityAt: timestamp,
				updatedAt: timestamp
			}, { merge: true });
		});
	}
	return json(200, { authorizationUrl: result.data.authorization_url });
}
async function verifyPayment(user, reference) {
	if (!process.env.PAYSTACK_SECRET_KEY) return json(503, { error: "Payments are not configured yet." });
	const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
	const result = await response.json();
	const payment = result.data;
	if (!response.ok || !result.status || payment?.status !== "success" || payment.amount !== PRICE_KOBO || payment.currency !== "NGN" || payment.metadata?.oracleUid !== user.uid || payment.metadata?.plan !== "oracle-semester") return json(402, { error: "This payment could not be verified for your account." });
	return json(200, {
		paid: true,
		premiumUntil: (await grantPremium({
			uid: user.uid,
			email: user.email,
			reference,
			amount: PRICE_KOBO,
			currency: "NGN"
		})).toISOString()
	});
}
async function handlePaystackWebhook(req) {
	const secret = process.env.PAYSTACK_SECRET_KEY;
	if (!secret) return new Response("Webhook is not configured.", { status: 503 });
	const rawBody = await req.text();
	const supplied = req.headers.get("x-paystack-signature") || "";
	const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
	const suppliedBuffer = Buffer.from(supplied, "utf8");
	const expectedBuffer = Buffer.from(expected, "utf8");
	if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) return new Response("Invalid signature.", { status: 401 });
	let event;
	try {
		event = JSON.parse(rawBody);
	} catch {
		return new Response("Invalid JSON.", { status: 400 });
	}
	if (event.event !== "charge.success") return new Response("OK", { status: 200 });
	const payment = event.data;
	if (payment?.status !== "success" || payment.amount !== PRICE_KOBO || payment.currency !== "NGN" || payment.metadata?.plan !== "oracle-semester" || typeof payment.metadata?.oracleUid !== "string" || typeof payment.reference !== "string") return new Response("Payment does not match an Oracle plan.", { status: 400 });
	try {
		await grantPremium({
			uid: payment.metadata.oracleUid,
			email: payment.customer?.email,
			reference: payment.reference,
			amount: payment.amount,
			currency: payment.currency
		});
		return new Response("OK", { status: 200 });
	} catch (error) {
		console.error("Paystack webhook processing failed", error?.message);
		return new Response("Could not process payment.", { status: 500 });
	}
}
var GENERIC_RULES = `No past-question PDF has been loaded for this course yet. Write questions from the standard first-year (100-level) university syllabus for the course and topics named. Keep them at the difficulty of Nigerian university CBT exams, especially ABUAD 100-level papers. Do not claim they are past questions.`;
var COURSES = {
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
			"Number systems"
		],
		source: `ABUAD MTH 101 practice drawn from the supplied assignment (PDFs/final_pq.pdf).

Use these patterns and difficulty, and write fresh numbers unless you are explicitly returning a known item:
- Complex numbers: z1 = 7 + 3i, z2 = 4 - 2i, sums, products, real and imaginary parts.
- Sequences: a six-term GP with first term 192 and ratio 1.5; arithmetic series with a stated difference.
- Quadratics: x^2 - 4x - 6 = 0 has roots 2 ± sqrt(10); roots of x^2 - x + 1 = 0 satisfy x^3 = -1.
- Sets: symmetric difference, unions and intersections.
- Matrices: simplify 3(A + B) - 2A to A + 3B.
- Number systems: five consecutive integers summing to 100 start at 18; the even numbers from 100 to 998 sum to 247050.

Do not claim a newly invented question is a verbatim past question.`
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
			"Coordinate geometry"
		],
		source: GENERIC_RULES
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
			"Circular motion and gravitation"
		],
		source: GENERIC_RULES
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
			"Waves and optics"
		],
		source: GENERIC_RULES
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
			"Correlation and regression"
		],
		source: GENERIC_RULES
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
			"Acids, bases and pH"
		],
		source: GENERIC_RULES
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
			"Reproduction and evolution"
		],
		source: GENERIC_RULES
	}
};
var RESPONSE_HINT = `Return JSON only, with this shape:
{"questions":[{"topic":"","prompt":"","options":["","","",""],"answer":0,"steps":["",""]}]}`;
function models() {
	return (process.env.DEEPSEEK_MODELS || process.env.DEEPSEEK_MODEL || "deepseek-flash").split(",").map((model) => model.trim()).filter(Boolean);
}
function buildPrompt({ course, cfg, topics, count, avoid, batch }) {
	const avoidBlock = avoid.length ? `\nDo NOT repeat or closely paraphrase these questions already asked:\n${avoid.map((item) => `- ${item}`).join("\n")}\n` : "";
	return `You write practice questions for ABUAD (Afe Babalola University) ${course} (${cfg.name}), in the style of Nigerian university computer-based tests (CBT).

Write exactly ${count} multiple-choice questions on these topics only: ${topics.join("; ")}.
Rules:
- Exactly 4 options. Exactly one is correct. "answer" is the zero-based index (0 to 3) of the correct option.
- Wrong options must be plausible (typical student mistakes), never silly.
- Match the difficulty of ABUAD 100-level CBT papers: short stems, one idea each, a mix of recall and short working.
- This is set #${batch + 1}. Use fresh numbers and situations. Do not reuse a stem with only a number changed if the method is identical to an avoided question.
- Solve every question yourself and verify the answer before returning it.
- Plain text only. No LaTeX, no markdown, no $ signs. Write maths as x^2, sqrt(x), a/b, 3 + 4i.
- "steps": 2 to 4 short strings showing the working.
- "topic" must be copied exactly from the topic list above.
${avoidBlock}
SOURCE MATERIAL:
${cfg.source}

${RESPONSE_HINT}`;
}
function parseModelJson(text) {
	const cleaned = String(text || "").replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
	const start = cleaned.indexOf("{");
	const end = cleaned.lastIndexOf("}");
	if (start === -1 || end <= start) throw new Error("No JSON object");
	return JSON.parse(cleaned.slice(start, end + 1));
}
async function requestModel(apiKey, model, prompt, extras) {
	return await fetch("https://api.deepseek.com/chat/completions", {
		method: "POST",
		signal: AbortSignal.timeout(14e3),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [{
				role: "system",
				content: "You are Exam Oracle, writing verified ABUAD CBT practice questions. Reply with one JSON object and nothing else."
			}, {
				role: "user",
				content: prompt
			}],
			response_format: { type: "json_object" },
			temperature: .7,
			max_tokens: 2500,
			...extras
		})
	});
}
async function callDeepSeek(apiKey, prompt) {
	let last = {
		status: 502,
		message: "DeepSeek did not respond"
	};
	for (const model of models()) for (const extras of [{
		thinking: { type: "disabled" },
		reasoning_effort: "none"
	}, {}]) try {
		const response = await requestModel(apiKey, model, prompt, extras);
		if (response.ok) {
			const text = (await response.json()).choices?.[0]?.message?.content || "";
			if (!text.trim()) {
				last = {
					status: 502,
					message: "Empty response"
				};
				continue;
			}
			return {
				parsed: parseModelJson(text),
				model
			};
		}
		const err = await response.json().catch(() => ({}));
		last = {
			status: response.status,
			message: err?.error?.message || err?.message || "unknown"
		};
		console.error("DeepSeek error", {
			model,
			status: response.status,
			message: String(last.message).slice(0, 400)
		});
		if (response.status === 400 && extras.thinking) continue;
		if (![
			404,
			429,
			500,
			503
		].includes(response.status)) break;
	} catch (error) {
		console.error("DeepSeek fetch failed", {
			model,
			name: error?.name,
			message: error?.message
		});
		last = {
			status: error?.name === "TimeoutError" || error?.name === "AbortError" ? 504 : 502,
			message: error?.message
		};
	}
	return { error: last };
}
function shuffleOptions(question) {
	const order = question.options.map((_, index) => index);
	for (let i = order.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	return {
		...question,
		options: order.map((index) => question.options[index]),
		answer: order.indexOf(question.answer)
	};
}
function acceptQuestions(parsed, topics, avoid, limit) {
	const seen = new Set((avoid || []).map((item) => String(item).toLowerCase()));
	const accepted = [];
	for (const question of Array.isArray(parsed?.questions) ? parsed.questions : []) {
		if (!question || typeof question.prompt !== "string" || !question.prompt.trim()) continue;
		if (!topics.includes(question.topic)) continue;
		if (!Array.isArray(question.options) || question.options.length !== 4) continue;
		if (!question.options.every((option) => typeof option === "string" && option.trim())) continue;
		if (new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) continue;
		if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) continue;
		if (!Array.isArray(question.steps) || question.steps.length < 1 || !question.steps.every((step) => typeof step === "string" && step.trim())) continue;
		if (!isFresh(question.prompt, avoid) || seen.has(question.prompt.trim().toLowerCase())) continue;
		if ((avoid || []).some((item) => similarPrompt(question.prompt, item))) continue;
		seen.add(question.prompt.trim().toLowerCase());
		accepted.push(labelQuestion({
			topic: question.topic,
			prompt: question.prompt.trim(),
			options: question.options.map((option) => option.trim()),
			answer: question.answer,
			steps: question.steps.map((step) => step.trim()),
			origin: "oracle"
		}));
		if (accepted.length >= limit) break;
	}
	return accepted;
}
function withSource(questions, course) {
	return questions.map((question) => ({
		...shuffleOptions(labelQuestion(question)),
		course
	}));
}
async function handleGenerate(req, user) {
	const paidByPromo = promoActive();
	let paid = paidByPromo;
	if (!paid && user && !user.local) try {
		paid = await hasPremium(user.uid);
	} catch (error) {
		console.error("Premium entitlement lookup failed", error?.message);
		return json(503, { error: "Account access could not be checked. Please try again." });
	}
	else if (!paid && user?.local) paid = await hasPremium(user.uid);
	if (req.method === "GET") {
		const used = user ? await readDailyUsage(user.uid) : {};
		return json(200, {
			paid: paid || paidByPromo,
			sitewidePremium: paidByPromo,
			promoUntil: promoUntilDate(),
			promoActive: paidByPromo,
			authMode: authMode(),
			freeDaily: 10,
			freeCoursesDaily: 3,
			subjectsUsed: activeCourseIds(used).length,
			maxPerTest: 60,
			welcomeTestAvailable: false,
			used,
			courses: Object.entries(COURSES).map(([id, course]) => ({
				id,
				label: course.label,
				name: course.name,
				topics: course.topics,
				grounded: course.grounded
			}))
		});
	}
	if (req.method !== "POST") return json(405, { error: "Use POST to request questions." });
	if (!user) return json(401, {
		code: "auth_required",
		error: "Sign in to your account before starting a test."
	});
	let input;
	try {
		input = await req.json();
	} catch {
		return json(400, { error: "Request body must be valid JSON." });
	}
	const cfg = COURSES[input.course];
	const topics = Array.isArray(input.topics) ? input.topics.filter((topic) => cfg?.topics.includes(topic)) : [];
	const count = Number(input.count);
	if (!cfg || !topics.length || !Number.isInteger(count) || count < 1 || count > 3) return json(400, { error: `Choose a course, at least one topic, and 1 to 3 questions per request.` });
	let dailyUsage = {};
	let used = 0;
	let allowed = count;
	if (!paid) {
		dailyUsage = await readDailyUsage(user.uid);
		used = dailyUsage[input.course] || 0;
		if (used >= 10) return json(429, {
			code: "quota",
			used,
			error: `You've used your 10 free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.`
		});
		if (!dailyUsage[input.course] && activeCourseIds(dailyUsage).length >= 3) return json(429, {
			code: "subject_limit",
			subjectsUsed: activeCourseIds(dailyUsage).length,
			error: `You've used all 3 free courses for today. Upgrade or come back tomorrow.`
		});
		allowed = Math.min(count, 10 - used);
	}
	const clientAvoid = Array.isArray(input.avoid) ? input.avoid.filter((item) => typeof item === "string").slice(0, 24).map((item) => item.slice(0, 140)) : [];
	const remembered = await readSeen(user.uid);
	const avoid = [...clientAvoid, ...remembered].slice(-40);
	const batch = Number.isInteger(input.batch) ? input.batch : 0;
	let questions = [];
	let fallback = false;
	const apiKey = process.env.DEEPSEEK_API_KEY;
	if (apiKey) try {
		const result = await callDeepSeek(apiKey, buildPrompt({
			course: input.course,
			cfg,
			topics,
			count: allowed,
			avoid,
			batch
		}));
		if (result.parsed) questions = acceptQuestions(result.parsed, topics, avoid, allowed);
		else {
			console.error("DeepSeek unavailable", result.error);
			fallback = true;
		}
	} catch (error) {
		console.error("Question generation failed", error?.message);
		fallback = true;
	}
	else fallback = true;
	if (questions.length < allowed) {
		fallback = questions.length === 0 || fallback;
		const local = pickLocalQuestions({
			course: input.course,
			topics,
			count: allowed - questions.length,
			avoid: [...avoid, ...questions.map((question) => question.prompt)],
			batch,
			salt: `${user.uid}:${Date.now()}`
		});
		questions = questions.concat(local);
	}
	if (!questions.length) return json(502, {
		code: "empty",
		error: "Oracle couldn't write a usable set. Please try again."
	});
	questions = withSource(questions.slice(0, allowed), input.course);
	await writeSeen(user.uid, questions.map((question) => question.prompt));
	if (!paid) {
		const usage = await recordFreeUsage(user.uid, input.course, questions.length, 10, 3);
		if (!usage.allowed) return json(429, {
			code: usage.code,
			used: usage.used,
			subjectsUsed: usage.subjectsUsed,
			error: usage.code === "quota" ? `You've used your 10 free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.` : `You've used all 3 free courses for today. Upgrade or come back tomorrow.`
		});
		used = usage.used;
		dailyUsage[input.course] = used;
	} else if (user && !paidByPromo) try {
		await recordPaidUsage(user, input.course, questions.length);
	} catch (error) {
		console.error("Paid usage record failed", error?.message);
	}
	return json(200, {
		questions,
		used,
		paid,
		fallback,
		subjectsUsed: paid ? void 0 : activeCourseIds(dailyUsage).length
	});
}
function cleanString(value, max) {
	return typeof value === "string" ? value.slice(0, max) : "";
}
function normaliseHistory(input) {
	return {
		course: cleanString(input.course, 40),
		topics: Array.isArray(input.topics) ? input.topics.filter((topic) => typeof topic === "string").slice(0, 20).map((topic) => topic.slice(0, 80)) : [],
		total: Number(input.total),
		correct: Number(input.correct),
		action: typeof input.action === "string" ? input.action : "complete",
		testId: typeof input.id === "number" && Number.isSafeInteger(input.id) ? String(input.id) : "",
		topicResults: Array.isArray(input.topicResults) ? input.topicResults.filter((topic) => topic && typeof topic.name === "string").slice(0, 20).map((topic) => ({
			name: topic.name.slice(0, 80),
			correct: Math.max(0, Math.min(Number(topic.correct) || 0, 60)),
			total: Math.max(0, Math.min(Number(topic.total) || 0, 60))
		})) : [],
		answers: Array.isArray(input.answers) ? input.answers.slice(0, 60).map((answer) => ({
			topic: cleanString(answer?.topic, 80),
			prompt: cleanString(answer?.prompt, 2e3),
			options: Array.isArray(answer?.options) ? answer.options.filter((option) => typeof option === "string").slice(0, 4).map((option) => option.slice(0, 500)) : [],
			selected: Math.max(0, Math.min(Number(answer?.selected) || 0, 3)),
			correctAnswer: Math.max(0, Math.min(Number(answer?.correctAnswer) || 0, 3)),
			correct: answer?.correct === true
		})) : [],
		raw: input
	};
}
async function history(req, user) {
	if (req.method === "GET") return json(200, await readProfile(user.uid));
	if (req.method !== "POST") return json(405, { error: "Use GET or POST." });
	let input;
	try {
		input = await req.json();
	} catch {
		return json(400, { error: "Request body must be valid JSON." });
	}
	const activity = normaliseHistory(input);
	if (!activity.course || !activity.testId) return json(400, { error: "Test activity is invalid." });
	if (activity.action === "start") {
		if (!Number.isInteger(activity.total) || activity.total < 1 || activity.total > 60) return json(400, { error: "Test setup is invalid." });
	} else if (activity.action === "answer") {
		const index = Number(input.index);
		const answer = input.answer && typeof input.answer === "object" ? input.answer : {};
		if (!Number.isInteger(index) || index < 0 || index >= 60) return json(400, { error: "Answer activity is invalid." });
		activity.index = index;
		activity.answer = {
			topic: cleanString(answer.topic, 80),
			prompt: cleanString(answer.prompt, 2e3),
			options: Array.isArray(answer.options) ? answer.options.filter((option) => typeof option === "string").slice(0, 4).map((option) => option.slice(0, 500)) : [],
			selected: Math.max(0, Math.min(Number(answer.selected) || 0, 3)),
			correctAnswer: Math.max(0, Math.min(Number(answer.correctAnswer) || 0, 3)),
			correct: answer.correct === true
		};
		if (!activity.answer.prompt || activity.answer.options.length !== 4) return json(400, { error: "Answer activity is invalid." });
	} else if (activity.action === "solution") {
		const index = Number(input.index);
		if (!Number.isInteger(index) || index < 0 || index >= 60) return json(400, { error: "Solution activity is invalid." });
		activity.index = index;
		activity.topic = cleanString(input.topic, 80);
	} else if (activity.action === "abandon") {} else if (activity.action === "complete") {
		if (!Number.isInteger(activity.total) || activity.total < 1 || activity.total > 60 || !Number.isInteger(activity.correct) || activity.correct < 0 || activity.correct > activity.total) return json(400, { error: "Test summary is invalid." });
	} else return json(400, { error: "Test activity is invalid." });
	const saved = await saveActivity(user, {
		id: activity.testId,
		course: activity.course,
		topics: activity.topics,
		total: activity.total,
		correct: activity.correct,
		action: activity.action,
		index: activity.index,
		answer: activity.answer,
		topic: activity.topic,
		topicResults: activity.topicResults,
		answers: activity.answers
	});
	return json(saved.status, {
		saved: true,
		id: saved.id
	});
}
async function dispatchOracle(name, req) {
	if (name === "paystack-webhook") {
		if (req.method !== "POST") return new Response("Method not allowed.", { status: 405 });
		return handlePaystackWebhook(req);
	}
	if (req.method !== "GET" && !originAllowed(req)) return json(403, { error: "Request origin is not allowed." });
	if (name === "generate-questions") {
		let user = null;
		if (req.headers.has("authorization")) try {
			user = await authenticatedUser(req, false);
		} catch {
			return json(401, {
				code: "auth_required",
				error: "Your sign-in has expired. Please sign in again."
			});
		}
		if (req.method !== "GET" && !originAllowed(req)) return json(403, { error: "Request origin is not allowed." });
		return handleGenerate(req, user);
	}
	let user;
	try {
		user = await authenticatedUser(req);
	} catch {
		return json(401, { error: "Please sign in again." });
	}
	if (!user) return json(401, { error: "Sign in to continue." });
	if (name === "test-history") return history(req, user);
	if (name === "paystack-initialize") {
		if (req.method !== "POST") return json(405, { error: "Use POST." });
		try {
			return await initializePayment(user, req);
		} catch (error) {
			console.error("Paystack initialization error", error?.message);
			return json(502, { error: "Could not reach Paystack. Please try again." });
		}
	}
	if (name === "paystack-verify") {
		if (req.method !== "POST") return json(405, { error: "Use POST." });
		let reference;
		try {
			reference = (await req.json()).reference;
		} catch {
			return json(400, { error: "Payment reference is missing." });
		}
		if (typeof reference !== "string" || !/^[\w-]{8,100}$/.test(reference)) return json(400, { error: "Payment reference is invalid." });
		try {
			return await verifyPayment(user, reference);
		} catch (error) {
			console.error("Paystack verification error", error?.message);
			return json(502, { error: "Could not verify payment right now." });
		}
	}
	return json(404, { error: "Unknown Exam Oracle endpoint." });
}
//#endregion
export { dispatchOracle };
