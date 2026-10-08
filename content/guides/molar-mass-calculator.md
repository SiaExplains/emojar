---
slug: how-to-calculate-molar-mass-from-a-formula
tool: molar-mass-calculator
title: How to Calculate Molar Mass, Step by Step (With Ca(OH)2)
description: Add up atomic weights by hand, check percent composition and turn grams into moles, using calcium hydroxide and a copper sulfate hydrate.
tags: [Chemistry, Molar Mass, Stoichiometry]
---

To calculate the molar mass of a compound, count how many atoms of each element its formula contains, multiply each count by that element's atomic weight, and add the results. The answer is in grams per mole (g/mol). For calcium hydroxide, Ca(OH)2, that is 40.078 + 2 × 15.999 + 2 × 1.008 = 74.092 g/mol.

The arithmetic is simple. The mistakes happen when reading the formula: brackets, hydrate dots and capital letters. This guide works through two examples by hand and shows what the [molar mass calculator](/online-tool/calculators/molar-mass-calculator) returns for each, so you can check your own homework or lab prep.

## What is a mole, exactly?

A mole is a counting unit, like a dozen, only far bigger. Since the 2019 revision of the SI, one mole is defined as exactly 6.02214076 × 10²³ particles. That number is the Avogadro constant.

The mole was chosen so that atomic masses carry over neatly. One carbon-12 atom has a mass of 12 daltons (u), and one mole of carbon-12 has a mass of very nearly 12 grams. So the molar mass of a substance in g/mol has the same number as its formula mass in daltons. That is why "molecular weight" and "molar mass" are often used for the same figure.

## Where do the atomic weights come from?

The calculator uses IUPAC standard atomic weights, the values maintained by its Commission on Isotopic Abundances and Atomic Weights. They are averages over each element's natural isotopes. A few elements, such as hydrogen and oxygen, vary slightly depending on where a sample comes from. For those, the usual single values (1.008 for H, 15.999 for O) are used, as in most textbooks.

Radioactive elements with no stable isotope have no standard weight. For them the calculator uses the mass number of the longest-lived isotope and adds a note below the result saying so.

## Worked example: calcium hydroxide, Ca(OH)2

Start by expanding the brackets. The subscript 2 after `(OH)` multiplies everything inside it, so the formula holds 1 calcium, 2 oxygen and 2 hydrogen atoms. Then multiply and add:

| Element | Count | Atomic mass | Mass contribution | Percentage |
| ------- | ----- | ----------- | ----------------- | ---------- |
| Ca      | 1     | 40.078      | 40.078 g/mol      | 54.09%     |
| O       | 2     | 15.999      | 31.998 g/mol      | 43.19%     |
| H       | 2     | 1.008       | 2.016 g/mol       | 2.72%      |

The total is **74.092 g/mol**. Type `Ca(OH)2` into **Chemical formula**, or click its example chip, and you get the same table. The header reads "Molar mass of Ca(OH)₂", with the subscript drawn in. **Copy value** puts `74.092` on your clipboard.

The percentage column is the percent composition by mass: each contribution divided by the total. Calcium is just over half the mass of calcium hydroxide, even though it is only one of five atoms.

### Turning grams into moles

Now say a recipe for a titration calls for 100 g of calcium hydroxide, and you want to know how many moles that is. Divide the mass by the molar mass: 100 ÷ 74.092 = 1.350 mol. Type `100` into **Grams → moles** and the tool shows:

> 100.00 g of Ca(OH)₂ = 1.350 mol (8.128e+23 formula units)

The last figure is moles times the Avogadro constant, written in scientific notation.

## How are hydrates written?

Hydrates trap a fixed number of water molecules in the crystal. Blue copper sulfate is CuSO4·5H2O: one copper sulfate unit plus five waters. The coefficient 5 multiplies the whole H2O part, so the formula holds 10 hydrogen atoms and 4 + 5 = 9 oxygen atoms.

The calculator gives **249.677 g/mol**, with oxygen at 57.67% of the mass. You can type the dot as `·` or use `*` if your keyboard has no middle dot. Unicode subscripts, such as a pasted H₂O, work too.

Nested brackets are fine. `K4[Fe(CN)6]` expands the inner group first, then the outer one. A trailing charge such as `SO4^2-` is accepted and ignored, with a note explaining that a few electrons weigh almost nothing.

## What do the error messages mean?

Symbols are case-sensitive, because the capital letters are what split a formula into elements. `Co` is cobalt, but `CO` is carbon plus oxygen. If you type `co2`, the tool stops with a message that symbols start with a capital letter and suggests `Co`.

Other messages point to a missing closing bracket, empty brackets, a count of 0, or a symbol that isn't an element.

A subtler check runs after the formula parses. The calculator tests whether the atoms could balance using their common oxidation states. Type `H2SO` and you still get a result, 50.075 g/mol. But an amber notice above it asks whether the formula is invalid or incomplete, because sulfuric acid needs four oxygens. Treat the notice as a hint to recheck your formula, not a hard error. Unusual compounds can trigger it too.

## Related tools

To look up a single element's weight, electron configuration or melting point, open the [interactive periodic table](/online-tool/reference-tools/periodic-table). For longer stoichiometry chains with exponents, the [scientific calculator](/online-tool/calculators/scientific-calculator) handles the rest of the arithmetic.

## FAQ

### Why does my textbook give a slightly different value?

Textbooks often round atomic weights, for example O = 16.00 and H = 1.01. With those, Ca(OH)2 comes to 74.10 g/mol. The difference is rounding, not a different formula.

### Does a number in front of the formula matter?

Yes. `2H2O` is read as two formula units, so the result doubles to 36.03 g/mol. The tool adds a note when a leading number multiplies the formula.

### Is anything I type sent anywhere?

No. The formula is parsed and calculated in your browser, and the atomic weights are built into the page.

Try your own formula in the [molar mass calculator](/online-tool/calculators/molar-mass-calculator).
