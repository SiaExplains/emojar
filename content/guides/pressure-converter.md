---
slug: bar-psi-kpa-hpa-pressure-conversion-walkthrough
tool: pressure-converter
title: 'Bar, psi, kPa and hPa: Pressure Conversions in Real Life'
description: 'Tire pressure in bar or psi, weather in hPa or inHg, dive tanks and blood pressure in mmHg. Real scenarios for converting pressure, and the gauge trap.'
tags: [Units, Cars, Conversion]
---

The pressure conversions people need most: **1 bar = 14.504 psi = 100 kPa**, **1 psi ≈ 6.895 kPa**, and **1 hPa = 1 mbar**. Standard atmospheric pressure is **101,325 Pa**, which is 1.01325 bar, 14.696 psi, or about 760 mmHg. A tire at 2.2 bar is at about **31.9 psi**.

Different fields settled on different units, so the same physical quantity shows up as bar on a European tire placard, psi on an American gauge and hPa on a weather map. Below are the situations where you'll actually meet them.

## Scenario 1: Setting tire pressure

Your car's door placard says **2.2 bar**, but the gas station pump reads in psi. 2.2 × 14.504 = **31.9 psi**, so set it to 32. Going the other way, 32 psi is **2.21 bar**.

Some placards and pumps use kPa instead: 35 psi is **241.3 kPa**, and 250 kPa is **2.5 bar** or **36.3 psi**. Since 1 bar is exactly 100 kPa, converting between those two is just moving a decimal point.

### The gauge pressure trap

Tire gauges show **gauge pressure**: how much the pressure inside exceeds the air around it. A tire at 32 psi gauge actually holds about 32 + 14.7 = 46.7 psi absolute. That doesn't matter when converting a tire spec between units (both numbers are gauge readings), but it does matter in physics problems and gas-law calculations, which need **absolute** pressure. Some technical specs mark the difference as "psig" and "psia".

## Scenario 2: Reading a weather forecast

Meteorologists use **hectopascals** (hPa), which are identical to **millibars** (mbar). US forecasts often use **inches of mercury** (inHg).

- Sea-level standard pressure: **1,013.25 hPa** = **29.92 inHg**
- A reading of 1,013 hPa = **29.91 inHg**

As a rough guide, pressure well above 1,013 hPa is linked with settled weather and pressure well below it with storms. Your barometer at home may display any of these units.

## Scenario 3: Scuba tanks and compressors

Dive cylinders are filled to around 200 bar in metric countries and around 3,000 psi in the US. They are close but not identical:

- 200 bar = **2,900.8 psi**
- 3,000 psi = **206.8 bar**

Air compressors and pressure washers are also rated in bar or psi. 100 psi is **6.89 bar**, and 1 MPa, a unit that appears on hydraulic equipment, is **145.04 psi**.

## Scenario 4: Blood pressure readings

Blood pressure is measured in **millimeters of mercury** (mmHg), a unit that dates back to mercury manometers. Some research papers use kPa instead. 120 mmHg is about **16.0 kPa**. This is a straight unit conversion; it says nothing about what a healthy reading is, which is a question for a doctor.

## Why doesn't 1 atm show as exactly 760 mmHg?

Convert 1 atm to mmHg in the tool and you'll see **759.9998917**. The atmosphere is defined as exactly 101,325 Pa, while the conventional millimeter of mercury is defined from mercury's density and standard gravity, which comes to 133.322387415 Pa. The two definitions are a hair apart. For any practical purpose, 1 atm = 760 mmHg.

## How to use the Pressure Converter

The [Pressure Converter](/online-tool/unit-converters/pressure-converter) handles ten units:

1. Enter the pressure in **Value**.
2. Choose **From** and **To**: pascal, hectopascal, kilopascal, megapascal, bar, millibar, atmosphere, psi, mmHg or inHg. Swap them with ⇄.
3. Read the result, or the table below it, which converts your value into every unit at once, useful when a manual mixes units.

Results show up to 10 significant digits.

## Quick reference

| Unit           | In pascals |
| -------------- | ---------- |
| 1 hPa = 1 mbar | 100        |
| 1 kPa          | 1,000      |
| 1 psi          | ≈ 6,894.76 |
| 1 bar          | 100,000    |
| 1 atm          | 101,325    |
| 1 MPa          | 1,000,000  |

Pressure often comes with temperature. For converting tire or weather temperatures, use the [Temperature Converter](/online-tool/unit-converters/temperature-converter).

## FAQ

### Is bar the same as atmosphere?

Close, but no. 1 bar is 100,000 Pa and 1 atm is 101,325 Pa, so 1 bar is about 0.987 atm.

### Why does my tire pressure change between morning and afternoon?

Gas pressure rises with temperature. A tire checked cold in the morning will read higher after driving or sitting in the sun. Manufacturers' figures are usually for cold tires.

### What is a pascal, exactly?

One newton of force spread over one square meter. It's a tiny pressure, which is why kPa, hPa and MPa are more common in practice.

Convert tire, weather and equipment pressures with the [Pressure Converter](/online-tool/unit-converters/pressure-converter).
