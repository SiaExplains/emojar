---
slug: mechanical-metric-electrical-horsepower-and-btu-explained
tool: power-converter
title: 'hp, PS, Electrical hp and BTU/h: Power Ratings Explained'
description: 'Why a 150 PS car is "only" 148 hp, what an electric motor''s hp means, and how many kilowatts a 12,000 BTU/h air conditioner really delivers.'
tags: [Units, Cars, Home, Explainer]
---

There isn't one horsepower, there are three. **Mechanical (imperial) hp is 745.7 W**, used for US and UK engine ratings. **Metric hp (PS, CV) is 735.5 W**, used in Europe and Japan. **Electrical hp is exactly 746 W**, used on electric motor nameplates. Air conditioners and heaters skip horsepower altogether and use **BTU per hour**, where 1 W is about 3.412 BTU/h and 12,000 BTU/h is roughly 3.5 kW.

All of them measure energy per unit of time; they just come from different industries. Here's where each comes from and what the numbers look like converted.

## Where did horsepower come from?

James Watt wanted a way to sell steam engines to mine owners who used horses for pumping. He settled on a horse doing 33,000 foot-pounds of work per minute, which works out to the 745.7 W mechanical horsepower still used today. When metric countries adopted the idea they redefined it in their own units, lifting 75 kilograms by one meter per second, and that gives the slightly smaller 735.5 W. The German abbreviation is PS (*Pferdestärke*), the French and Italian one is CV, and the Dutch one is pk.

The electrical horsepower came later: a clean 746 W for motor nameplates.

## How different are the three horsepowers?

The gap is small but it shows up in spec sheets:

| Unit                     | Symbol in the tool | Watts  | 100 kW equals |
| ------------------------ | ------------------ | ------ | ------------- |
| Mechanical (imperial) hp | hp                 | 745.7  | 134.1 hp      |
| Metric hp                | PS                 | 735.5  | 135.96 PS     |
| Electrical hp            | hp(E)              | 746    | 134.05 hp(E)  |

The metric horsepower is about 1.4% smaller than the mechanical one. So the same engine always shows a slightly bigger number in PS:

- A European hatchback rated at **150 PS** produces 110.3 kW, or **147.9 hp** in US terms.
- A US truck engine rated at **300 hp** is 223.7 kW, or **304.2 PS** on a European brochure.
- An electric car motor listed at **110 kW** works out to 147.5 hp or 149.6 PS. Same motor, three different numbers depending on the market.

Electrical and mechanical horsepower are close enough to treat as the same for most purposes. A 1.5 hp(E) pump motor is 1,119 W, which is 1.5006 mechanical hp. Keep in mind that a motor's nameplate rating is normally its mechanical output at the shaft. The electricity it draws from the wall is higher because no motor is 100% efficient.

## What does BTU per hour mean on an air conditioner?

A British thermal unit (BTU) is the energy needed to warm one pound of water by one degree Fahrenheit. An air conditioner's BTU/h rating tells you how much heat it can remove from a room every hour. That's a power, so it converts directly to watts.

The **ton of refrigeration** (TR) dates back to the days of ice. It is the cooling you'd get from melting one short ton of ice over 24 hours, which comes to 12,000 BTU/h.

| AC rating   | Cooling power | Tons of refrigeration |
| ----------- | ------------- | --------------------- |
| 5,000 BTU/h | 1.47 kW       | 0.42 TR               |
| 8,000 BTU/h | 2.34 kW       | 0.67 TR               |
| 12,000 BTU/h | 3.52 kW      | 1 TR                  |
| 18,000 BTU/h | 5.28 kW      | 1.5 TR                |
| 24,000 BTU/h | 7.03 kW      | 2 TR                  |
| 36,000 BTU/h | 10.55 kW     | 3 TR                  |

**A common mix-up:** a 12,000 BTU/h unit does *not* draw 3.5 kW of electricity. That figure is the heat it moves. Heat pumps and air conditioners move several times more heat than the electrical power they consume, so the plug-side wattage on the label is much lower. Use the electrical rating when you size a circuit or estimate a bill, and the BTU/h rating when you size the unit to a room.

Heaters work the other way. A **1,500 W** space heater turns all of its electricity into heat, about **5,118 BTU/h**.

## How to convert power units with the tool

1. Open the [Power Converter](/online-tool/unit-converters/power-converter). It starts on kilowatts to horsepower.
2. Type your number in **Value**.
3. Pick the unit you have in **From**. For a European car that's "Metric horsepower (PS, CV, pk)". For an air conditioner it's "BTU per hour".
4. Pick your target in **To**, or press the ⇄ button to swap the two.
5. Read the highlighted result. You can copy it, or check the table underneath, which lists the same value in all ten units, from watts and megawatts to foot-pounds per second and kilocalories per hour.

If you mostly convert small appliance ratings, the [Watts to Horsepower](/online-tool/unit-converters/power-converter/watts-to-horsepower) page opens with W and hp already selected. Results show up to 10 significant digits, and everything is calculated in your browser.

## When the conversion is not the whole story

- **Power is not energy.** A kilowatt is a rate. A kilowatt-hour is an amount. Running a 2 kW heater for three hours uses 6 kWh. For bills and battery sizes, switch to the [Energy Converter](/online-tool/unit-converters/energy-converter).
- **Engine power and torque are linked by rpm.** A peak hp figure only holds at one engine speed. The [Torque Converter](/online-tool/unit-converters/torque-converter) handles the other half of a spec sheet.

## FAQ

### Why does my European car have more PS than hp?

PS is the smaller unit (735.5 W against 745.7 W), so it takes more of them to describe the same power. Divide PS by about 1.014 to get mechanical hp.

### Is BHP different from hp?

Brake horsepower (bhp) is mechanical horsepower measured at the crankshaft, before losses in the gearbox and wheels. It uses the same 745.7 W unit. The word "brake" describes where it was measured, not a different size of unit.

### How many BTU/h is one kilowatt?

About 3,412 BTU/h. A 3.5 kW cooling rating is roughly 11,942 BTU/h, which is why it's sold as a "12,000 BTU" unit.

Convert any power rating with the free [Power Converter](/online-tool/unit-converters/power-converter).
