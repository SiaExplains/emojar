import type { ToolDefinition } from '../types';

export const CALCULATOR_TOOLS: ToolDefinition[] = [
  {
    slug: 'percentage-calculator',
    category: 'calculators',
    name: 'Percentage Calculator',
    icon: '％',
    shortDescription: 'Work out percentages of numbers.',
    description:
      'Calculate X% of a number, what percentage one number is of another, and the percentage change between two values — with results as you type.',
    title: 'Percentage Calculator – Calculate Percentages Online',
    metaDescription:
      'Free percentage calculator: find X% of Y, what percent X is of Y, and percentage change. Instant results with the formula explained.',
    keywords: [
      'percentage calculator',
      'percent calculator',
      'what is x percent of y',
      'percentage of a number',
    ],
    relatedTools: [
      'percentage-increase-calculator',
      'discount-calculator',
      'vat-calculator',
      'tip-calculator',
      'average-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'percentage' },
    popular: true,
    howTo: [
      'Choose the type of calculation.',
      'Enter the two numbers.',
      'Read the result — it updates as you type.',
    ],
    about: [
      'X% of Y = Y × X ÷ 100. For example, 20% of 150 is 150 × 20 ÷ 100 = 30.',
      'X as a percentage of Y = X ÷ Y × 100. Percentage change from X to Y = (Y − X) ÷ |X| × 100.',
    ],
    faqs: [
      {
        q: 'How do I calculate 15% of 80 in my head?',
        a: '10% of 80 is 8 and 5% is half of that (4), so 15% is 8 + 4 = 12.',
      },
    ],
  },
  {
    slug: 'percentage-increase-calculator',
    category: 'calculators',
    name: 'Percentage Increase Calculator',
    icon: '📈',
    shortDescription: 'Find the percentage increase or decrease.',
    description:
      'Find the percentage increase or decrease between an old and a new value, or increase or decrease a number by a given percentage.',
    title: 'Percentage Increase Calculator – Increase & Decrease %',
    metaDescription:
      'Calculate percentage increase or decrease between two numbers, or add/subtract a percentage. Instant and free.',
    keywords: [
      'percentage increase calculator',
      'percent change',
      'percentage decrease',
      'increase by percent',
    ],
    relatedTools: [
      'percentage-calculator',
      'discount-calculator',
      'compound-interest-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'percentage-increase' },
    howTo: [
      'Choose “between two values” or “increase/decrease by a %”.',
      'Enter the numbers.',
      'Read the change.',
    ],
    about: [
      'Percentage increase = (new − original) ÷ original × 100. A price that goes from 80 to 100 rose by 25%, but falling back from 100 to 80 is only a 20% decrease, because the base is different.',
    ],
    faqs: [
      {
        q: 'Why isn’t a 50% increase cancelled by a 50% decrease?',
        a: '100 + 50% = 150, but 150 − 50% = 75. The percentage applies to a different starting value each time.',
      },
    ],
  },
  {
    slug: 'age-calculator',
    category: 'calculators',
    name: 'Age Calculator',
    icon: '🎂',
    shortDescription: 'Calculate exact age in years, months and days.',
    description:
      'Calculate your exact age in years, months and days from your date of birth, plus total weeks and days lived and the countdown to your next birthday.',
    title: 'Age Calculator – Exact Age in Years, Months & Days',
    metaDescription:
      'Calculate exact age from date of birth in years, months and days. See total days lived and days until your next birthday. Free.',
    keywords: [
      'age calculator',
      'how old am i',
      'calculate age',
      'age from date of birth',
      'birthday calculator',
    ],
    relatedTools: [
      'date-calculator',
      'date-difference-calculator',
      'week-number-calculator',
      'countdown-generator',
    ],
    component: 'form-calculator',
    config: { calculator: 'age' },
    popular: true,
    howTo: [
      'Enter the date of birth.',
      'Optionally change the “age on” date (defaults to today).',
      'Read the exact age and extra stats.',
    ],
    about: [
      'Age is counted in whole calendar months, then remaining days, so someone born on 31 January is one month old on 28 (or 29) February. Leap-day birthdays are celebrated on 28 February in non-leap years.',
    ],
    faqs: [
      {
        q: 'Is my birth date stored?',
        a: 'No. The calculation runs in your browser; nothing is saved or sent.',
      },
    ],
  },
  {
    slug: 'date-calculator',
    category: 'calculators',
    name: 'Date Calculator',
    icon: '📅',
    shortDescription: 'Days between dates, or add/subtract time.',
    description:
      'Count the days between two dates, or add and subtract years, months, weeks and days from a date — all in one calculator.',
    title: 'Date Calculator – Days Between Dates & Add/Subtract Dates',
    metaDescription:
      'Free date calculator: count days between two dates or add and subtract years, months, weeks and days. Instant results.',
    keywords: [
      'date calculator',
      'days between dates',
      'add days to date',
      'date duration',
    ],
    relatedTools: [
      'date-difference-calculator',
      'date-add-subtract',
      'age-calculator',
      'working-days-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'date-calculator' },
    howTo: [
      'Choose “days between”, “add” or “subtract”.',
      'Enter the dates or amounts.',
      'Read the result.',
    ],
    about: [
      'Adding months keeps the same day of the month where possible; 31 January + 1 month gives the last day of February.',
    ],
    faqs: [
      {
        q: 'Does it include the end date?',
        a: 'The difference counts nights between the dates (like hotel stays). Use the Date Difference Calculator to include both days.',
      },
    ],
  },
  {
    slug: 'bmi-calculator',
    category: 'calculators',
    name: 'BMI Calculator',
    icon: '⚖️',
    shortDescription: 'Calculate Body Mass Index (metric or imperial).',
    description:
      'Calculate your Body Mass Index (BMI) in metric or imperial units and see the WHO weight category and healthy weight range for your height.',
    title: 'BMI Calculator – Body Mass Index (kg/cm or lb/ft)',
    metaDescription:
      'Calculate BMI online in metric or imperial units. See your WHO category and healthy weight range. Free and private.',
    keywords: [
      'bmi calculator',
      'body mass index',
      'calculate bmi',
      'healthy weight',
    ],
    relatedTools: [
      'clothing-size-converter',
      'bmr-calculator',
      'weight-converter',
      'length-converter',
      'age-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'bmi' },
    howTo: [
      'Choose metric or imperial units.',
      'Enter weight and height.',
      'Read your BMI and category.',
    ],
    about: [
      'BMI = weight (kg) ÷ height (m)². WHO categories for adults: under 18.5 underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30 and above obesity.',
    ],
    faqs: [
      {
        q: 'Is BMI accurate for athletes?',
        a: 'Not always — BMI cannot tell muscle from fat, so muscular people may be classed as overweight.',
      },
    ],
  },
  {
    slug: 'bmr-calculator',
    category: 'calculators',
    name: 'BMR Calculator',
    icon: '🔥',
    shortDescription: 'Estimate calories burned at rest and per day.',
    description:
      'Estimate your basal metabolic rate (BMR) and total daily energy expenditure (TDEE) with the Mifflin-St Jeor equation, plus calorie targets for weight loss.',
    title: 'BMR Calculator – Basal Metabolic Rate & Daily Calories',
    metaDescription:
      'Calculate BMR and daily calorie needs (TDEE) with the Mifflin-St Jeor equation. See targets for weight loss. Free.',
    keywords: [
      'bmr calculator',
      'basal metabolic rate',
      'tdee calculator',
      'calorie calculator',
    ],
    relatedTools: ['bmi-calculator', 'energy-converter', 'weight-converter'],
    component: 'form-calculator',
    config: { calculator: 'bmr' },
    howTo: [
      'Enter sex, age, weight and height.',
      'Choose your activity level.',
      'Read your BMR and daily calorie estimates.',
    ],
    about: [
      'Mifflin-St Jeor: BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5 (men) or − 161 (women). TDEE multiplies BMR by an activity factor from 1.2 to 1.9.',
    ],
    faqs: [
      {
        q: 'What is the difference between BMR and TDEE?',
        a: 'BMR is what you burn at complete rest; TDEE adds daily activity and exercise.',
      },
    ],
  },
  {
    slug: 'loan-calculator',
    category: 'calculators',
    name: 'Loan Calculator',
    icon: '🏦',
    shortDescription: 'Monthly payment and total interest for a loan.',
    description:
      'Calculate the monthly payment, total interest and total cost of a loan, with a yearly amortization table. For home loans with taxes, insurance and PMI, use the mortgage calculator.',
    title: 'Loan Calculator – Monthly Payment, Interest & Amortization',
    metaDescription:
      'Calculate loan and mortgage payments online: monthly payment, total interest and yearly amortization schedule. Free.',
    keywords: [
      'loan calculator',
      'monthly payment calculator',
      'amortization calculator',
      'personal loan calculator',
    ],
    relatedTools: [
      'mortgage-calculator',
      'emi-calculator',
      'compound-interest-calculator',
      'percentage-calculator',
      'vat-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'loan' },
    howTo: [
      'Enter the loan amount, annual interest rate and term in years.',
      'Read the monthly payment and total interest.',
      'Review the yearly amortization table.',
    ],
    about: [
      'Payment = P × r ÷ (1 − (1 + r)^−n), where P is the principal, r the monthly rate (annual rate ÷ 12) and n the number of monthly payments. Early payments are mostly interest; later ones mostly principal.',
    ],
    faqs: [
      {
        q: 'Does it include fees or insurance?',
        a: 'No — it calculates principal and interest only. Add fees, taxes and insurance separately.',
      },
    ],
  },
  {
    slug: 'emi-calculator',
    category: 'calculators',
    name: 'EMI Calculator',
    icon: '💳',
    shortDescription: 'Equated monthly instalment with full schedule.',
    description:
      'Calculate the EMI (equated monthly instalment) for a home, car or personal loan, with the total interest and a month-by-month repayment schedule.',
    title: 'EMI Calculator – Home, Car & Personal Loan EMI',
    metaDescription:
      'Calculate EMI for home, car and personal loans with total interest and a monthly repayment schedule. Free online EMI calculator.',
    keywords: [
      'emi calculator',
      'loan emi',
      'home loan emi',
      'car loan emi',
      'personal loan emi',
    ],
    relatedTools: [
      'loan-calculator',
      'compound-interest-calculator',
      'percentage-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'emi' },
    howTo: [
      'Enter the principal, interest rate per year and tenure in months.',
      'Read the EMI, total interest and total payment.',
      'Scroll through the monthly schedule.',
    ],
    about: [
      'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), with r the monthly interest rate and n the tenure in months. The EMI stays constant while the split between principal and interest shifts each month.',
    ],
    faqs: [
      {
        q: 'How can I reduce my EMI?',
        a: 'A longer tenure lowers the EMI but increases total interest; a larger down payment or lower rate reduces both.',
      },
    ],
  },
  {
    slug: 'tip-calculator',
    category: 'calculators',
    name: 'Tip Calculator',
    icon: '🍽️',
    shortDescription: 'Calculate tip and split the bill.',
    description:
      'Calculate the tip and total for a bill and split it evenly between any number of people.',
    title: 'Tip Calculator – Calculate Tip & Split the Bill',
    metaDescription:
      'Calculate tips and split bills between friends. Enter the bill, tip percentage and people — instant per-person totals. Free.',
    keywords: [
      'tip calculator',
      'split bill calculator',
      'gratuity calculator',
      'restaurant tip',
    ],
    relatedTools: [
      'percentage-calculator',
      'discount-calculator',
      'vat-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'tip' },
    howTo: [
      'Enter the bill amount.',
      'Set the tip percentage and number of people.',
      'Read the total per person.',
    ],
    about: [
      'Customary tips vary by country — around 15–20% in the US, 5–10% or rounding up in much of Europe, and none in Japan.',
    ],
    faqs: [
      {
        q: 'Should I tip on the amount before or after tax?',
        a: 'Etiquette guides usually suggest tipping on the pre-tax amount, but many people tip on the total.',
      },
    ],
  },
  {
    slug: 'discount-calculator',
    category: 'calculators',
    name: 'Discount Calculator',
    icon: '🏷️',
    shortDescription: 'Sale price and savings after a discount.',
    description:
      'Calculate the sale price and how much you save after a percentage discount — including stacked discounts like “an extra 10% off”.',
    title: 'Discount Calculator – Sale Price & Savings',
    metaDescription:
      'Calculate the final price and savings after a percentage discount, including stacked discounts. Free online discount calculator.',
    keywords: [
      'discount calculator',
      'sale price calculator',
      'percent off calculator',
      'savings calculator',
    ],
    relatedTools: ['percentage-calculator', 'vat-calculator', 'tip-calculator'],
    component: 'form-calculator',
    config: { calculator: 'discount' },
    howTo: [
      'Enter the original price.',
      'Enter the discount percentage (and an extra discount if any).',
      'Read the final price and savings.',
    ],
    about: [
      'Stacked discounts multiply rather than add: 25% off then an extra 10% off is 32.5% off in total, not 35%.',
    ],
    faqs: [
      {
        q: 'How do I find the original price from a sale price?',
        a: 'Divide the sale price by (1 − discount ÷ 100). For example 75 ÷ 0.75 = 100.',
      },
    ],
  },
  {
    slug: 'compound-interest-calculator',
    category: 'calculators',
    name: 'Compound Interest Calculator',
    icon: '💹',
    shortDescription: 'See how savings grow with compound interest.',
    description:
      'Calculate how an investment grows with compound interest and regular monthly contributions, with a year-by-year breakdown.',
    title: 'Compound Interest Calculator – With Monthly Contributions',
    metaDescription:
      'Calculate compound interest with monthly contributions and yearly, monthly or daily compounding. See growth year by year. Free.',
    keywords: [
      'compound interest calculator',
      'investment calculator',
      'savings calculator',
      'interest calculator',
    ],
    relatedTools: [
      'loan-calculator',
      'emi-calculator',
      'percentage-increase-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'compound-interest' },
    howTo: [
      'Enter the starting amount, monthly contribution, interest rate and years.',
      'Choose how often interest compounds.',
      'Read the final balance and yearly table.',
    ],
    about: [
      'Compound interest earns interest on previous interest. With no contributions, A = P × (1 + r/n)^(n × t). The “rule of 72” estimates doubling time: 72 ÷ annual rate (%) years.',
    ],
    faqs: [
      {
        q: 'Does it account for inflation or taxes?',
        a: 'No. For a rough real return, subtract the expected inflation rate from the interest rate.',
      },
    ],
  },
  {
    slug: 'vat-calculator',
    category: 'calculators',
    name: 'VAT Calculator',
    icon: '🧾',
    shortDescription: 'Add or remove VAT / sales tax.',
    description:
      'Add VAT to a net price or remove VAT from a gross price at any rate, and see the net, tax and gross amounts.',
    title: 'VAT Calculator – Add or Remove VAT Online',
    metaDescription:
      'Add or remove VAT (or sales tax) at any rate. Get net, VAT and gross amounts instantly. Free online VAT calculator.',
    keywords: [
      'vat calculator',
      'add vat',
      'remove vat',
      'reverse vat',
      'sales tax calculator',
    ],
    relatedTools: [
      'percentage-calculator',
      'discount-calculator',
      'tip-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'vat' },
    howTo: [
      'Choose “add VAT” or “remove VAT”.',
      'Enter the amount and the VAT rate.',
      'Read the net, VAT and gross amounts.',
    ],
    about: [
      'To remove VAT, divide the gross amount by (1 + rate ÷ 100) — not by subtracting the rate. For 119 at 19%: 119 ÷ 1.19 = 100 net, 19 VAT.',
    ],
    faqs: [
      {
        q: 'What VAT rate should I use?',
        a: 'It depends on the country and product, e.g. 19% standard in Germany, 20% in the UK and France.',
      },
    ],
  },
  {
    slug: 'time-duration-calculator',
    category: 'calculators',
    name: 'Time Duration Calculator',
    icon: '⏱️',
    shortDescription: 'Hours and minutes between two times.',
    description:
      'Calculate the time between a start and end time, minus breaks — in hours and minutes and as decimal hours for timesheets. Overnight shifts are supported.',
    title: 'Time Duration Calculator – Hours Between Two Times',
    metaDescription:
      'Calculate hours and minutes between two times, minus breaks, with decimal hours for timesheets. Handles overnight shifts.',
    keywords: [
      'time duration calculator',
      'hours calculator',
      'time between two times',
      'timesheet calculator',
    ],
    relatedTools: [
      'time-converter',
      'date-difference-calculator',
      'working-days-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'time-duration' },
    howTo: [
      'Enter the start and end times.',
      'Enter break minutes, if any.',
      'Read the duration and decimal hours.',
    ],
    about: [
      'Decimal hours convert minutes to fractions of an hour: 7 h 45 min = 7.75 hours. Payroll systems often require this format.',
    ],
    faqs: [
      {
        q: 'What if the shift ends after midnight?',
        a: 'If the end time is earlier than the start, it is treated as the next day.',
      },
    ],
  },
  {
    slug: 'average-calculator',
    category: 'calculators',
    name: 'Average Calculator',
    icon: '📊',
    shortDescription: 'Mean, median, mode and more.',
    description:
      'Calculate the average (mean), median, mode, range, sum and standard deviation of a list of numbers.',
    title: 'Average Calculator – Mean, Median, Mode & Std Dev',
    metaDescription:
      'Calculate mean, median, mode, range, sum and standard deviation of any list of numbers. Free online average calculator.',
    keywords: [
      'average calculator',
      'mean calculator',
      'median calculator',
      'mode calculator',
      'standard deviation',
    ],
    relatedTools: [
      'percentage-calculator',
      'random-number-generator',
      'sort-lines',
    ],
    component: 'form-calculator',
    config: { calculator: 'average' },
    howTo: [
      'Enter or paste numbers separated by commas, spaces or new lines.',
      'Read the mean, median, mode and other statistics.',
    ],
    about: [
      'The mean is the sum divided by the count; the median is the middle value when sorted; the mode is the most frequent value. The median is less affected by outliers than the mean.',
    ],
    faqs: [
      {
        q: 'Population or sample standard deviation?',
        a: 'Both are shown. Use sample (n − 1) when your numbers are a sample of a larger group.',
      },
    ],
  },

  {
    slug: 'scientific-calculator',
    category: 'calculators',
    name: 'Scientific Calculator',
    icon: '🧮',
    shortDescription: 'Trig, logs, powers, roots and factorials.',
    description:
      'A full scientific calculator in your browser: trigonometry in degrees or radians, logarithms, powers, roots, factorials, constants π and e, parentheses and calculation history. Type with your keyboard or tap the buttons.',
    title: 'Scientific Calculator Online – Free, With History & Keyboard',
    metaDescription:
      'Free online scientific calculator with sin, cos, tan, log, ln, powers, roots, factorials, π and e. Degrees or radians, keyboard input and history.',
    keywords: [
      'scientific calculator',
      'online calculator',
      'calculator with sin cos tan',
      'log calculator',
      'free calculator',
    ],
    relatedTools: [
      'percentage-calculator',
      'average-calculator',
      'angle-converter',
      'number-to-words',
      'roman-numeral-converter',
    ],
    component: 'scientific-calculator',
    popular: true,
    howTo: [
      'Type an expression such as 2^10 or sin(30) + log(100), or use the buttons.',
      'Choose degrees or radians for trigonometry.',
      'Press = or Enter. Use “Ans” to reuse the last result; earlier results stay in the history.',
    ],
    about: [
      'Operator precedence follows standard maths rules: powers before multiplication and division, then addition and subtraction; powers are right-associative, so 2^3^2 = 2^9 = 512. Implicit multiplication like 2π or 3(4+1) is supported.',
      'Expressions are evaluated by a small built-in parser — not by running code — and the calculator works offline once loaded.',
    ],
    faqs: [
      {
        q: 'What is the difference between log and ln?',
        a: 'log is the base-10 logarithm (log(1000) = 3); ln is the natural logarithm with base e (ln(e) = 1).',
      },
      {
        q: 'Why does tan(90) show an error?',
        a: 'In degrees, tan(90°) is undefined because cos(90°) is zero, so the calculator reports it instead of showing a huge rounding artefact.',
      },
    ],
  },
  {
    slug: 'gpa-calculator',
    category: 'calculators',
    name: 'GPA Calculator',
    icon: '🎓',
    shortDescription: 'Semester and cumulative GPA on a 4.0 scale.',
    description:
      'Calculate your semester GPA from letter grades and credit hours, and your new cumulative GPA by adding your previous GPA and credits. Uses the common 4.0 scale (A = 4.0, A- = 3.7, B+ = 3.3 …).',
    title: 'GPA Calculator – Semester & Cumulative GPA (4.0 Scale)',
    metaDescription:
      'Calculate semester and cumulative GPA on a 4.0 scale from letter grades and credit hours. Add as many courses as you need. Free and instant.',
    keywords: [
      'gpa calculator',
      'college gpa calculator',
      'cumulative gpa calculator',
      'semester gpa',
      'grade point average',
    ],
    relatedTools: [
      'grade-calculator',
      'average-calculator',
      'percentage-calculator',
      'scientific-calculator',
    ],
    component: 'gpa-calculator',
    popular: true,
    howTo: [
      'Add each course with its letter grade and credit hours.',
      'Optionally enter your current cumulative GPA and completed credits.',
      'Read your semester GPA and new cumulative GPA instantly.',
    ],
    about: [
      'GPA is a credit-weighted average: each course’s grade points (e.g. B+ = 3.3) are multiplied by its credits, added up, and divided by the total credits. A 4-credit course therefore counts twice as much as a 2-credit one.',
      'Scales differ between schools — some give A+ = 4.3, others don’t use plus/minus at all. Check your school’s scale and pick the matching letter grades.',
    ],
    faqs: [
      {
        q: 'How do I raise my cumulative GPA?',
        a: 'The more credits you have completed, the harder it is to move. Use the cumulative fields to see exactly what semester GPA you need.',
      },
    ],
  },
  {
    slug: 'grade-calculator',
    category: 'calculators',
    name: 'Grade Calculator',
    icon: '📝',
    shortDescription: 'Weighted grade and what you need on the final.',
    description:
      'Work out your current course grade from weighted assignments, quizzes and exams — and find the score you need on the final exam to reach your target grade.',
    title: 'Grade Calculator – Weighted Grade & Final Exam Score Needed',
    metaDescription:
      'Calculate your weighted course grade and the final exam score you need to reach a target. Add assignments with weights. Free grade calculator.',
    keywords: [
      'grade calculator',
      'final grade calculator',
      'what do i need on my final',
      'weighted grade calculator',
    ],
    relatedTools: [
      'gpa-calculator',
      'average-calculator',
      'percentage-calculator',
    ],
    component: 'grade-calculator',
    howTo: [
      'Add each graded item with your score (%) and its weight (%).',
      'Enter your target grade and the weight of the final exam.',
      'See your current grade, letter grade and the score needed on the final.',
    ],
    about: [
      'A weighted grade multiplies each score by its weight and divides by the total weight. If homework is 20% and you scored 90, it contributes 18 points of the final grade.',
      'The final-exam formula is: needed = (target − current × (1 − final weight)) ÷ final weight. A result above 100% means the target is out of reach unless there is extra credit.',
    ],
    faqs: [
      {
        q: 'What if my weights don’t add up to 100%?',
        a: 'The current grade is calculated from the weights you have entered so far, which is how most gradebooks show a running grade.',
      },
    ],
  },
  {
    slug: 'calorie-calculator',
    category: 'calculators',
    name: 'Calorie Calculator',
    icon: '🥗',
    shortDescription: 'Daily calories and macros for your goal.',
    description:
      'Find out how many calories you need per day to lose, maintain or gain weight, plus a protein, carbohydrate and fat breakdown. Based on the Mifflin-St Jeor equation and your activity level.',
    title: 'Calorie Calculator – Daily Calories & Macros for Weight Goals',
    metaDescription:
      'Calculate daily calories to lose, maintain or gain weight, with protein, carb and fat targets. Mifflin-St Jeor equation and activity level. Free.',
    keywords: [
      'calorie calculator',
      'how many calories should i eat',
      'calorie deficit calculator',
      'macro calculator',
      'tdee calculator',
    ],
    relatedTools: [
      'bmr-calculator',
      'bmi-calculator',
      'weight-converter',
      'energy-converter',
    ],
    component: 'form-calculator',
    config: { calculator: 'calorie' },
    popular: true,
    howTo: [
      'Enter sex, age, weight and height.',
      'Choose your activity level and goal.',
      'Read your daily calorie target and macro grams.',
    ],
    about: [
      'Your maintenance calories (TDEE) are your basal metabolic rate multiplied by an activity factor. A deficit of about 550 kcal per day corresponds to roughly 0.5 kg of weight loss per week, since 1 kg of body fat holds about 7,700 kcal.',
      'Targets are not lowered below 1,200 kcal (women) or 1,500 kcal (men), common minimums without medical supervision.',
    ],
    faqs: [
      {
        q: 'Is the BMR calculator the same thing?',
        a: 'The BMR calculator focuses on energy use at rest and maintenance; this tool turns that into a goal-based daily target with macros.',
      },
    ],
  },
  {
    slug: 'due-date-calculator',
    category: 'calculators',
    name: 'Pregnancy Due Date Calculator',
    icon: '🤰',
    shortDescription: 'Due date, weeks pregnant and milestones.',
    description:
      'Estimate your due date from the first day of your last period, your conception date or an IVF transfer date — and see how many weeks pregnant you are, your trimester and key milestones.',
    title: 'Pregnancy Due Date Calculator – How Many Weeks Pregnant Am I?',
    metaDescription:
      'Calculate your pregnancy due date from your last period, conception or IVF transfer. See weeks pregnant, trimester and key milestone dates.',
    keywords: [
      'due date calculator',
      'pregnancy calculator',
      'how many weeks pregnant am i',
      'conception calculator',
      'ivf due date calculator',
    ],
    relatedTools: [
      'ovulation-calculator',
      'date-difference-calculator',
      'week-number-calculator',
      'date-add-subtract',
    ],
    component: 'form-calculator',
    config: { calculator: 'due-date' },
    popular: true,
    howTo: [
      'Choose what you know: last period, conception date or IVF transfer.',
      'Enter the date (and your usual cycle length for the last-period method).',
      'Read your estimated due date, weeks pregnant and milestones.',
    ],
    about: [
      'Pregnancy is dated from the first day of the last menstrual period (LMP), about two weeks before conception. Naegele’s rule adds 280 days (40 weeks) to the LMP, adjusted for cycles longer or shorter than 28 days.',
      'From a known conception date, the due date is 266 days later; for IVF, 263 days after a 3-day embryo transfer or 261 days after a 5-day transfer.',
    ],
    faqs: [
      {
        q: 'How accurate is a due date?',
        a: 'It is an estimate — most babies arrive within two weeks either side. An early ultrasound is the most accurate way to date a pregnancy.',
      },
    ],
  },
  {
    slug: 'ovulation-calculator',
    category: 'calculators',
    name: 'Ovulation Calculator',
    icon: '🌸',
    shortDescription: 'Fertile window and ovulation date.',
    description:
      'Estimate your ovulation date and fertile window from your last period and cycle length, with predictions for the next three cycles.',
    title: 'Ovulation Calculator – Fertile Window & Ovulation Date',
    metaDescription:
      'Estimate your ovulation day and fertile window from your last period and cycle length, with the next three cycles. Free ovulation calculator.',
    keywords: [
      'ovulation calculator',
      'fertile window calculator',
      'when do i ovulate',
      'ovulation tracker',
    ],
    relatedTools: [
      'due-date-calculator',
      'date-add-subtract',
      'date-difference-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'ovulation' },
    howTo: [
      'Enter the first day of your last period.',
      'Enter your average cycle length (and luteal phase if you know it).',
      'See your estimated ovulation day, fertile window and next period.',
    ],
    about: [
      'Ovulation usually happens about 14 days before the next period (the luteal phase), not necessarily on day 14 of the cycle. In a 32-day cycle it is about 18 days after the period starts.',
      'The fertile window is the five days before ovulation plus the day after, because sperm can survive up to five days. The two days before ovulation and ovulation day itself are the most fertile.',
    ],
    faqs: [
      {
        q: 'Can I use this for contraception?',
        a: 'No. Cycles vary and ovulation can shift, so calendar estimates are not reliable contraception.',
      },
    ],
  },
  {
    slug: 'mortgage-calculator',
    category: 'calculators',
    name: 'Mortgage Calculator',
    icon: '🏠',
    shortDescription: 'Monthly mortgage payment with taxes, insurance and PMI.',
    description:
      'Estimate your full monthly mortgage payment — principal and interest plus property tax, home insurance, PMI and HOA fees. Enter the home price, down payment, rate and term, add extra payments to see how much interest and time you save, and review the yearly amortization schedule.',
    title: 'Mortgage Calculator – Payment With Taxes, Insurance & PMI',
    metaDescription:
      'Free mortgage calculator: monthly payment with property tax, insurance, PMI and HOA, extra payments, payoff date and amortization schedule.',
    keywords: [
      'mortgage calculator',
      'mortgage payment calculator',
      'house payment calculator',
      'mortgage calculator with taxes and insurance',
      'pmi calculator',
    ],
    relatedTools: [
      'loan-calculator',
      'savings-goal-calculator',
      'compound-interest-calculator',
      'salary-to-hourly-calculator',
      'percentage-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'mortgage' },
    popular: true,
    howTo: [
      'Enter the home price and your down payment (as a percentage or an amount).',
      'Set the interest rate and loan term.',
      'Add property tax, insurance, PMI and HOA costs — or leave the defaults as estimates.',
      'Optionally add an extra monthly principal payment, then read the monthly total and amortization table.',
    ],
    about: [
      'The principal-and-interest part uses the standard formula M = P × r ÷ (1 − (1 + r)^−n), with the monthly rate r and n monthly payments. Property tax, insurance and HOA fees are added on top, because lenders usually collect them in the same monthly payment.',
      'With less than 20 % down, most conventional US loans add private mortgage insurance (PMI). The calculator charges PMI until the balance reaches 80 % of the home price and shows how many months that takes. Extra principal payments shorten the loan and cut total interest.',
    ],
    faqs: [
      {
        q: 'How much of my payment is interest?',
        a: 'Early on, most of it. In a 30-year loan at 6.5 %, about 85 % of the first payment is interest; the share falls every month as the balance shrinks. The amortization table shows the split year by year.',
      },
      {
        q: 'Are the tax and insurance figures exact?',
        a: 'No — they are estimates you can change. Use your county’s property tax rate and a real insurance quote for an accurate figure.',
      },
    ],
  },
  {
    slug: 'salary-to-hourly-calculator',
    category: 'calculators',
    name: 'Salary to Hourly Calculator',
    icon: '💼',
    shortDescription: 'Convert a yearly salary to an hourly wage and back.',
    description:
      'Convert pay between yearly, monthly, bi-weekly, weekly, daily and hourly amounts. Enter your salary or hourly rate, your hours per week and paid weeks per year, and see what you earn for every pay period — before tax.',
    title: 'Salary to Hourly Calculator – Hourly, Weekly, Monthly Pay',
    metaDescription:
      'Convert salary to hourly wage and hourly to annual salary. Adjust hours per week and paid weeks to see yearly, monthly, weekly, daily and hourly pay.',
    keywords: [
      'salary to hourly',
      'hourly to salary',
      'salary calculator',
      'hourly wage calculator',
      'annual salary calculator',
    ],
    relatedTools: [
      'percentage-increase-calculator',
      'time-duration-calculator',
      'mortgage-calculator',
      'savings-goal-calculator',
      'vat-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'salary' },
    popular: true,
    howTo: [
      'Enter your pay and choose how often you receive it (per year, month, week, hour…).',
      'Adjust hours per week, days per week and paid weeks per year.',
      'Read your hourly rate or yearly salary and the full table of pay periods.',
    ],
    about: [
      'Hourly rate = yearly salary ÷ (hours per week × paid weeks per year). With the usual 40 hours and 52 weeks that is 2,080 hours, so $60,000 a year is about $28.85 an hour.',
      'If some weeks off are unpaid, lower the weeks per year: a contractor who takes six unpaid weeks earns over 46 weeks, which raises the hourly rate needed to match a salary.',
    ],
    faqs: [
      {
        q: 'Is the result before or after tax?',
        a: 'Before tax (gross). Taxes and deductions depend on your country and situation.',
      },
      {
        q: 'What is the difference between bi-weekly and semi-monthly?',
        a: 'Bi-weekly means every two weeks — 26 paychecks a year. Semi-monthly means twice a month — 24 paychecks — so each one is slightly larger.',
      },
    ],
  },
  {
    slug: 'fraction-calculator',
    category: 'calculators',
    name: 'Fraction Calculator',
    icon: '➗',
    shortDescription:
      'Add, subtract, multiply and divide fractions with steps.',
    description:
      'Add, subtract, multiply and divide fractions and mixed numbers like 1 1/2 and 3/4. The result is simplified automatically and shown as a fraction, mixed number, decimal and percent, with each step of the working explained.',
    title: 'Fraction Calculator – Add, Subtract, Multiply & Divide, With Steps',
    metaDescription:
      'Free fraction calculator for fractions and mixed numbers. Get simplified results as fractions, mixed numbers and decimals, with step-by-step working.',
    keywords: [
      'fraction calculator',
      'adding fractions',
      'mixed number calculator',
      'simplify fractions',
      'dividing fractions',
    ],
    relatedTools: [
      'ratio-calculator',
      'percentage-calculator',
      'scientific-calculator',
      'square-root-calculator',
      'average-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'fraction' },
    popular: true,
    howTo: [
      'Type the first fraction — 3/4, a mixed number like 1 1/2, a whole number or a decimal.',
      'Choose add, subtract, multiply or divide.',
      'Type the second fraction and read the simplified result and steps.',
    ],
    about: [
      'To add or subtract, the fractions are rewritten over their least common denominator; to multiply, tops and bottoms are multiplied; to divide, you multiply by the reciprocal. Every result is reduced by the greatest common divisor, so 6/8 becomes 3/4.',
      'Decimals are converted exactly (0.75 → 3/4), and the arithmetic uses whole-number maths without rounding, so even large fractions stay exact.',
    ],
    faqs: [
      {
        q: 'How do I enter a mixed number?',
        a: 'Put a space between the whole number and the fraction: 2 3/8. A minus sign in front makes the whole value negative: -2 3/8.',
      },
      {
        q: 'Can I enter decimals?',
        a: 'Yes. 0.25 is read as 1/4 and 1.5 as 3/2, so you can mix decimals and fractions.',
      },
    ],
  },
  {
    slug: 'ratio-calculator',
    category: 'calculators',
    name: 'Ratio Calculator',
    icon: '⚖️',
    shortDescription: 'Solve proportions, simplify ratios and split totals.',
    description:
      'Solve ratio problems in three ways: find the missing value in A : B = C : D, simplify a ratio to its lowest terms (also with decimals), or split a total in a given ratio. Results include the 1 : n form and percentage split.',
    title: 'Ratio Calculator – Solve Proportions & Simplify Ratios',
    metaDescription:
      'Solve A:B = C:D for the missing value, simplify ratios like 1.5:2 to 3:4 and split a total in a ratio. Free online ratio and proportion calculator.',
    keywords: [
      'ratio calculator',
      'proportion calculator',
      'simplify ratio',
      'ratio solver',
      'split in ratio',
    ],
    relatedTools: [
      'aspect-ratio-calculator',
      'fraction-calculator',
      'percentage-calculator',
      'unit-price-calculator',
      'average-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'ratio' },
    howTo: [
      'Choose what to calculate: a missing value, a simplified ratio or a split.',
      'Enter the known numbers — for a proportion, leave exactly one of A, B, C, D empty.',
      'Read the answer and the other forms of the ratio.',
    ],
    about: [
      'A proportion A : B = C : D is solved by cross-multiplication: A × D = B × C. For example 3 : 4 = 9 : ? gives ? = 4 × 9 ÷ 3 = 12.',
      'To simplify, decimals are first scaled to whole numbers and then divided by their greatest common divisor, so 1.5 : 2 becomes 3 : 4. Splitting 700 in the ratio 3 : 4 gives 300 and 400.',
    ],
    faqs: [
      {
        q: 'What is the 1 : n form?',
        a: 'It rescales the ratio so the first part is 1 — handy for maps and model scales. 3 : 4 is 1 : 1.333…',
      },
      {
        q: 'Can I use it for recipes?',
        a: 'Yes. To scale 250 g flour for 4 people to 6 people, solve 4 : 250 = 6 : ? — the answer is 375 g.',
      },
    ],
  },
  {
    slug: 'aspect-ratio-calculator',
    category: 'calculators',
    name: 'Aspect Ratio Calculator',
    icon: '📐',
    shortDescription: 'Find the aspect ratio and resize width or height.',
    description:
      'Find the aspect ratio of any width and height — 1920 × 1080 is 16:9 — see the closest standard ratio, and calculate a new width or height that keeps the proportions. Includes common sizes for the ratio, from 320 px to 4K.',
    title: 'Aspect Ratio Calculator – 16:9, 4:3, 21:9 & Resize',
    metaDescription:
      'Calculate aspect ratio from width and height, find the nearest standard (16:9, 4:3, 21:9) and resize while keeping proportions. Free for video, photos and screens.',
    keywords: [
      'aspect ratio calculator',
      '16:9 calculator',
      'resolution calculator',
      'aspect ratio resize',
      'screen ratio',
    ],
    relatedTools: [
      'screen-resolution-checker',
      'ratio-calculator',
      'image-resizer',
      'social-media-image-resizer',
      'image-cropper',
      'fraction-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'aspect' },
    howTo: [
      'Enter the width and height in pixels — the maths works the same for any unit.',
      'Read the simplified ratio, the decimal ratio and the closest standard.',
      'To resize, enter a new width or a new height (if you fill both, the new width is used) and get the matching other side.',
    ],
    about: [
      'The aspect ratio is width ÷ height reduced to whole numbers by their greatest common divisor: 1920 and 1080 share 120, giving 16:9. Screens sold as 21:9 are really 64:27 (2.37:1) and cinema formats like 2.39:1 are given as decimals.',
      'When resizing, the new height is new width × height ÷ width (or the new width is new height × width ÷ height), rounded to whole pixels. The table shows which common widths divide evenly for the ratio, which avoids blurry half-pixel scaling.',
    ],
    faqs: [
      {
        q: 'What aspect ratio is 1080 × 1920?',
        a: '9:16 — the same as 16:9 turned to portrait, used for phone videos, Stories and Reels.',
      },
      {
        q: 'Why does my monitor say 21:9 but the calculator says 64:27?',
        a: '“21:9” is a marketing name. 2560 × 1080 is exactly 64:27 (2.37:1), which is close to 21:9 (2.33:1).',
      },
    ],
  },
  {
    slug: 'body-fat-calculator',
    category: 'calculators',
    name: 'Body Fat Calculator',
    icon: '📏',
    shortDescription: 'Estimate body fat % with the U.S. Navy tape method.',
    description:
      'Estimate your body fat percentage from a few tape-measure readings using the U.S. Navy method: height, neck and waist (plus hips for women). See your category, and add your weight to get fat mass and lean mass — metric or imperial.',
    title: 'Body Fat Calculator – U.S. Navy Method, Metric & Imperial',
    metaDescription:
      'Estimate body fat percentage with the U.S. Navy tape method: neck, waist and hip measurements. Get your category plus fat and lean mass. Free.',
    keywords: [
      'body fat calculator',
      'body fat percentage',
      'navy body fat calculator',
      'lean body mass calculator',
      'body fat estimate',
    ],
    relatedTools: [
      'bmi-calculator',
      'ideal-weight-calculator',
      'bmr-calculator',
      'calorie-calculator',
      'age-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'body-fat' },
    howTo: [
      'Choose metric or imperial units and your sex.',
      'Measure your height, neck (just below the larynx) and waist — at the navel for men, the narrowest point for women — and hips for women.',
      'Optionally enter your weight, then read your body fat percentage and category.',
    ],
    about: [
      'The U.S. Navy method estimates body density from circumferences using the Hodgdon–Beckett equations; it was developed to assess personnel without lab equipment. It is typically within about 3–4 percentage points of methods like DEXA, and less accurate for very muscular or very lean people.',
      'Categories follow the American Council on Exercise (ACE): for men, 14–17 % is “fitness” and 25 % or more “obese”; for women the ranges are about 7–8 points higher. This is an estimate, not medical advice.',
    ],
    faqs: [
      {
        q: 'How should I measure?',
        a: 'Use a flexible tape, keep it level and snug without compressing the skin, measure relaxed (not sucking in), and take the average of two or three readings.',
      },
      {
        q: 'Is body fat better than BMI?',
        a: 'It tells you more about composition: two people with the same BMI can have very different body fat. Both are screening tools, not diagnoses.',
      },
    ],
  },
  {
    slug: 'ideal-weight-calculator',
    category: 'calculators',
    name: 'Ideal Weight Calculator',
    icon: '⚖️',
    shortDescription:
      'Ideal body weight by Devine, Robinson, Miller and Hamwi.',
    description:
      'Find your ideal body weight from your height and sex using four classic formulas — Devine, Robinson, Miller and Hamwi — and compare it with the healthy weight range for a BMI of 18.5 to 24.9, in kilograms or pounds.',
    title: 'Ideal Weight Calculator – Devine, Robinson, Miller & BMI Range',
    metaDescription:
      'Calculate ideal body weight by height and sex with the Devine, Robinson, Miller and Hamwi formulas plus the healthy BMI weight range. Metric or imperial.',
    keywords: [
      'ideal weight calculator',
      'ideal body weight',
      'healthy weight for my height',
      'devine formula',
      'weight for height',
    ],
    relatedTools: [
      'bmi-calculator',
      'body-fat-calculator',
      'calorie-calculator',
      'bmr-calculator',
      'percentage-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'ideal-weight' },
    howTo: [
      'Choose metric or imperial units and your sex.',
      'Enter your height (in inches for imperial — 5 ft 10 in is 70).',
      'Compare the four formula results with the healthy BMI weight range.',
    ],
    about: [
      'Each formula starts from a base weight at 5 feet and adds a fixed amount per extra inch. Devine (1974), still used in medicine to dose drugs, gives men 50 kg + 2.3 kg per inch over 5 ft and women 45.5 kg + 2.3 kg; Robinson, Miller and Hamwi use slightly different constants, which is why the results form a range.',
      'The healthy BMI range shows the weights at which BMI is between 18.5 and 24.9 for your height — usually a wider, more forgiving band. None of these formulas account for muscle mass or frame size; they are estimates, not medical advice.',
    ],
    faqs: [
      {
        q: 'Why do the formulas give different answers?',
        a: 'They were fitted to different populations and purposes (drug dosing, insurance tables). Treat the spread as a rough target range rather than one exact number.',
      },
      {
        q: 'Do they work for children?',
        a: 'No. They are meant for adults; children’s healthy weight is judged with age-specific growth charts.',
      },
    ],
  },
  {
    slug: 'profit-margin-calculator',
    category: 'calculators',
    name: 'Profit Margin Calculator',
    icon: '📈',
    shortDescription: 'Calculate margin, markup, profit and selling price.',
    description:
      'Calculate profit margin and markup from cost and selling price — or work backwards to the price you need for a target margin or markup, or the cost a price and margin allow. Results always show profit, margin and markup side by side.',
    title: 'Profit Margin Calculator – Margin, Markup & Selling Price',
    metaDescription:
      'Calculate profit margin and markup from cost and price, or find the selling price for a target margin or markup. Free margin vs markup calculator.',
    keywords: [
      'profit margin calculator',
      'margin calculator',
      'gross margin calculator',
      'selling price calculator',
      'margin vs markup',
    ],
    relatedTools: [
      'roi-calculator',
      'discount-calculator',
      'vat-calculator',
      'percentage-calculator',
      'unit-price-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'margin' },
    popular: true,
    howTo: [
      'Choose what you know: cost and price, cost and margin, cost and markup, or price and margin.',
      'Enter the two values.',
      'Read the missing figure plus profit, margin and markup.',
    ],
    about: [
      'Margin is profit as a percentage of the selling price; markup is profit as a percentage of the cost. Buying at 60 and selling at 100 is a 40 % margin but a 66.7 % markup — mixing the two up is one of the most common pricing mistakes.',
      'To hit a target margin, price = cost ÷ (1 − margin); for a target markup, price = cost × (1 + markup). A 40 % margin on a 60 cost needs a price of 100.',
    ],
    faqs: [
      {
        q: 'Can a margin be more than 100 %?',
        a: 'No — margin is a share of the price, so it is always below 100 %. Markup has no upper limit: selling for three times the cost is a 200 % markup.',
      },
      {
        q: 'Should I include VAT or sales tax?',
        a: 'Usually no. Calculate margins on net prices (excluding VAT); use the VAT calculator to add tax afterwards.',
      },
    ],
    variants: [
      {
        slug: 'markup-calculator',
        name: 'Markup Calculator',
        title: 'Markup Calculator – Selling Price From Cost & Markup %',
        metaDescription:
          'Calculate selling price from cost and markup percentage, and see the resulting profit margin. Free online markup calculator for retail and resale.',
        description:
          'Enter your cost and markup percentage to get the selling price, profit and the profit margin it equals — for example a 50 % markup on a cost of 60 gives a price of 90 and a 33.3 % margin.',
        config: { calculator: 'margin', init_mode: 'cost-markup' },
        keywords: [
          'markup calculator',
          'markup percentage',
          'cost plus pricing',
          'markup to margin',
        ],
      },
    ],
  },
  {
    slug: 'roi-calculator',
    category: 'calculators',
    name: 'ROI Calculator',
    icon: '💹',
    shortDescription: 'Return on investment and annualized ROI (CAGR).',
    description:
      'Calculate return on investment from what you put in and what you got back, plus the annualized return (CAGR) over a number of years or between two dates — so investments held for different lengths of time can be compared fairly.',
    title: 'ROI Calculator – Return on Investment & Annualized ROI',
    metaDescription:
      'Free ROI calculator: return on investment percentage, gain or loss, multiple and annualized return (CAGR) by years or dates.',
    keywords: [
      'roi calculator',
      'return on investment',
      'annualized return calculator',
      'cagr calculator',
      'investment return',
    ],
    relatedTools: [
      'compound-interest-calculator',
      'profit-margin-calculator',
      'retirement-calculator',
      'savings-goal-calculator',
      'percentage-increase-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'roi' },
    howTo: [
      'Enter the amount invested and the final value (including any income received).',
      'Choose a period in years, start and end dates, or no annualizing.',
      'Read the ROI, the gain or loss and the annualized return.',
    ],
    about: [
      'ROI = (final value − amount invested) ÷ amount invested. Turning 10,000 into 14,500 is a 45 % ROI.',
      'Annualized ROI (compound annual growth rate) spreads the gain evenly over the years: (final ÷ invested)^(1 ÷ years) − 1. A 45 % gain over 3 years is about 13.2 % a year — much less impressive than 45 % in one year. Include fees and taxes for a realistic figure.',
    ],
    faqs: [
      {
        q: 'What is a good ROI?',
        a: 'It depends on risk and time. Compare the annualized figure with alternatives such as a savings account or a broad stock index over the same period.',
      },
      {
        q: 'Can ROI be negative?',
        a: 'Yes — if the final value is below what you invested. The calculator then shows a loss and a negative annualized return.',
      },
    ],
  },
  {
    slug: 'savings-goal-calculator',
    category: 'calculators',
    name: 'Savings Goal Calculator',
    icon: '🎯',
    shortDescription: 'How much to save each month to reach a goal.',
    description:
      'Work out how much to save each month to reach a savings goal by a deadline — or how long it will take with a fixed monthly amount. Interest is compounded monthly, and a year-by-year table shows deposits, interest and balance.',
    title: 'Savings Goal Calculator – Monthly Saving Needed & Time to Goal',
    metaDescription:
      'Calculate the monthly savings needed to reach a goal, or how long your savings will take, with interest. Year-by-year table. Free savings calculator.',
    keywords: [
      'savings goal calculator',
      'savings calculator',
      'how much to save per month',
      'time to save',
      'savings plan calculator',
    ],
    relatedTools: [
      'compound-interest-calculator',
      'retirement-calculator',
      'mortgage-calculator',
      'roi-calculator',
      'salary-to-hourly-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'savings-goal' },
    howTo: [
      'Enter your goal, what you have saved already and the expected interest rate.',
      'Choose “monthly saving needed” and a deadline in years — or “time to reach the goal” and your monthly saving.',
      'Read the answer and the year-by-year table.',
    ],
    about: [
      'The calculator assumes you deposit at the end of each month and that interest compounds monthly. With interest, the required deposit is (goal − current × (1 + r)^n) × r ÷ ((1 + r)^n − 1), where r is the monthly rate and n the number of months.',
      'Even a modest rate helps: saving for 20,000 over 3 years from 2,000 needs about 465 a month at 4 % instead of 500 with no interest.',
    ],
    faqs: [
      {
        q: 'What interest rate should I use?',
        a: 'Use your savings account’s current rate for cash goals. For invested money, use a conservative long-term average and remember returns are not guaranteed.',
      },
      {
        q: 'Does it include inflation?',
        a: 'No. For long-term goals, raise the goal by expected inflation — or use the retirement calculator, which accounts for it.',
      },
    ],
  },
  {
    slug: 'retirement-calculator',
    category: 'calculators',
    name: 'Retirement Calculator',
    icon: '🏖️',
    shortDescription: 'Project retirement savings and how long they last.',
    description:
      'Estimate how much you will have saved by retirement, what that is worth in today’s money, how much yearly income it supports at a safe withdrawal rate, and whether your desired income lasts as long as you need — with a year-by-year balance table by age.',
    title: 'Retirement Calculator – Savings, Income & How Long It Lasts',
    metaDescription:
      'Free retirement calculator: projected nest egg, value in today’s money, income at a 4% withdrawal rate and how long your savings last. Inflation included.',
    keywords: [
      'retirement calculator',
      'retirement savings calculator',
      'how much do i need to retire',
      '4 percent rule calculator',
      'retirement planner',
    ],
    relatedTools: [
      'savings-goal-calculator',
      'compound-interest-calculator',
      'roi-calculator',
      'age-calculator',
      'salary-to-hourly-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'retirement' },
    popular: true,
    howTo: [
      'Enter your age, planned retirement age and the age to plan until.',
      'Add your current savings, monthly contribution and expected returns before and during retirement.',
      'Set inflation, the yearly income you want (in today’s money) and a withdrawal rate.',
      'Read your projected savings, sustainable income and whether the money lasts.',
    ],
    about: [
      'Savings grow with monthly contributions and compound returns until retirement; the result is shown both in future money and deflated to today’s purchasing power. The 4 % rule suggests withdrawing about 4 % of the balance in the first year is likely to last around 30 years.',
      'The withdrawal rate sets the “income at X %” figure; the separate drawdown check takes your desired income, raises it with inflation every year and withdraws it while the rest keeps earning the retirement return. Real markets fluctuate and taxes, fees and pensions are not included — treat the result as an estimate, not financial advice.',
    ],
    faqs: [
      {
        q: 'What return should I assume?',
        a: 'Long-term stock market averages are often quoted around 6–7 % before inflation, but they come with large ups and downs. Using a lower rate gives a more cautious plan.',
      },
      {
        q: 'Are pensions or Social Security included?',
        a: 'No. Lower the income you need from savings by the amount you expect from pensions or state benefits.',
      },
    ],
  },
  {
    slug: 'unit-price-calculator',
    category: 'calculators',
    name: 'Unit Price Calculator',
    icon: '🛒',
    shortDescription: 'Compare prices per kg, litre or item.',
    description:
      'Find the best value when shopping: enter the price and size of up to four products and see the price per 100 g, kilogram, pound, ounce, 100 ml, litre, fluid ounce or item — even when the packs use different units — with the best value shown first.',
    title: 'Unit Price Calculator – Compare Price per kg, oz or Litre',
    metaDescription:
      'Compare unit prices of up to four products — price per 100 g, kg, lb, oz, litre or item — even across different units. Find the best deal. Free.',
    keywords: [
      'unit price calculator',
      'price per kg calculator',
      'price per ounce',
      'compare prices',
      'best value calculator',
    ],
    relatedTools: [
      'discount-calculator',
      'percentage-calculator',
      'weight-converter',
      'volume-converter',
      'tip-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'unit-price' },
    howTo: [
      'Enter the price and size of each product and pick its unit (g, kg, oz, lb, ml, l, fl oz or items).',
      'Fill in at least two products — up to four.',
      'Read the best value and the price per unit for each product.',
    ],
    about: [
      'Unit price = price ÷ size, after converting sizes to a common base (grams, millilitres or items). That way a 500 g pack at 3.49 and a 1 kg pack at 5.99 compare directly: 0.698 versus 0.599 per 100 g.',
      'Weight and volume can’t be compared with each other without the product’s density, so all products must use weight units, volume units or item counts.',
    ],
    faqs: [
      {
        q: 'Is the bigger pack always cheaper?',
        a: 'Not always — promotions on small packs often beat bulk prices. That is exactly what comparing unit prices reveals.',
      },
      {
        q: 'Which currency does it use?',
        a: 'Any. Prices are shown without a currency symbol, so use whatever currency you shop in.',
      },
    ],
  },
  {
    slug: 'probability-calculator',
    category: 'calculators',
    name: 'Probability Calculator',
    icon: '🎲',
    shortDescription: 'Odds, independent events, binomial and combinations.',
    description:
      'Calculate probabilities for single events, two independent events (A and B, A or B, exactly one), the chance of something happening at least once in several tries, binomial “exactly k of n” questions, and exact combinations and permutations (nCr, nPr).',
    title: 'Probability Calculator – Events, Binomial, nCr & nPr',
    metaDescription:
      'Free probability calculator: single events, A and B, A or B, at least once, binomial probability and exact combinations/permutations (nCr, nPr).',
    keywords: [
      'probability calculator',
      'binomial probability calculator',
      'combination calculator',
      'permutation calculator',
      'odds calculator',
    ],
    relatedTools: [
      'dice-roller',
      'coin-flip',
      'random-number-generator',
      'percentage-calculator',
      'average-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'probability' },
    howTo: [
      'Choose the kind of question: one event, two events, at least once, k successes, or combinations.',
      'Enter the probabilities (in %) or counts.',
      'Read the probability, its decimal and percentage forms, and — for binomials with up to 200 tries — the full distribution table.',
    ],
    about: [
      'For independent events, P(A and B) = P(A) × P(B) and P(A or B) = P(A) + P(B) − P(A and B). The chance of at least one success in n tries is 1 − (1 − p)^n: with a 10 % chance each time, ten tries give about 65 %, not 100 %.',
      'The binomial distribution gives the probability of exactly k successes in n independent tries: C(n, k) × p^k × (1 − p)^(n − k). Combinations count choices where order doesn’t matter — there are 2,598,960 five-card poker hands — and are computed exactly even for large numbers (very long results are shortened on screen).',
    ],
    faqs: [
      {
        q: 'What is the difference between combinations and permutations?',
        a: 'Combinations ignore order (which 3 people get picked); permutations count each order separately (who comes first, second and third). P(n, k) = C(n, k) × k!.',
      },
      {
        q: 'Does a coin “owe” me heads after several tails?',
        a: 'No — independent tries have no memory. The chance stays 50 % each flip; that mistaken belief is the gambler’s fallacy.',
      },
    ],
  },
  {
    slug: 'square-root-calculator',
    category: 'calculators',
    name: 'Square Root Calculator',
    icon: '√',
    shortDescription: 'Square, cube and nth roots with simplified radicals.',
    description:
      'Calculate square roots, cube roots and any nth root to 14 significant digits, check whether a number is a perfect square or cube, and see the simplified radical form — for example √72 = 6√2. Negative numbers get the real answer for odd roots and the imaginary answer for square roots.',
    title: 'Square Root Calculator – Cube & nth Roots, Simplify Radicals',
    metaDescription:
      'Free square root calculator: square, cube and nth roots, perfect-square check and simplified radicals like √72 = 6√2. Handles negative numbers.',
    keywords: [
      'square root calculator',
      'cube root calculator',
      'nth root calculator',
      'simplify radicals',
      'perfect square',
    ],
    relatedTools: [
      'exponent-calculator',
      'scientific-calculator',
      'fraction-calculator',
      'percentage-calculator',
      'average-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'square-root' },
    howTo: [
      'Enter a number.',
      'Choose square root, cube root or nth root (and n).',
      'Read the root, whether it is a perfect power and the simplified radical.',
    ],
    about: [
      'A radical is simplified by pulling out every factor that is a perfect power: 72 = 36 × 2, and √36 = 6, so √72 = 6√2. The same works for cube roots: ∛54 = 3∛2 because 54 = 27 × 2.',
      'Even roots of negative numbers are not real; the square root of −9 is 3i in complex numbers. Odd roots of negatives are real: ∛−8 = −2. Simplified radicals are shown for whole numbers up to one trillion.',
    ],
    faqs: [
      {
        q: 'How do I know if a number is a perfect square?',
        a: 'Its square root is a whole number — 144 is (12²), 150 is not. The calculator tells you either way.',
      },
      {
        q: 'Why do some roots look rounded?',
        a: 'Most roots are irrational and never end, so they are shown to 14 significant digits; the simplified radical form is exact.',
      },
    ],
  },
  {
    slug: 'exponent-calculator',
    category: 'calculators',
    name: 'Exponent Calculator',
    icon: 'xⁿ',
    shortDescription: 'Powers, logarithms and roots — solve aⁿ for any part.',
    description:
      'Raise any number to a power — including negative and fractional exponents — and see huge or tiny results in scientific notation (up to about 10³⁰⁸), with exact digits for whole-number powers. You can also solve for the exponent (a logarithm) or the base.',
    title: 'Exponent Calculator – Powers, Scientific Notation & Logs',
    metaDescription:
      'Free exponent calculator: compute aⁿ with negative and fractional exponents, exact big powers and scientific notation, or solve for the exponent or base.',
    keywords: [
      'exponent calculator',
      'power calculator',
      'raise to the power',
      'scientific notation calculator',
      'solve for exponent',
    ],
    relatedTools: [
      'square-root-calculator',
      'scientific-calculator',
      'compound-interest-calculator',
      'fraction-calculator',
      'percentage-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'exponent' },
    howTo: [
      'Choose what to solve for: the result, the exponent or the base.',
      'Enter the two known values.',
      'Read the answer, its scientific notation and a check.',
    ],
    about: [
      'aⁿ multiplies a by itself n times; a negative exponent means the reciprocal (2⁻³ = 1/8) and a fractional exponent means a root (8^(1/3) = 2). Whole-number powers are calculated exactly, so 2¹⁰⁰ shows all 31 digits (very long results show the first and last digits).',
      'Solving for the exponent uses logarithms: n = log(result) ÷ log(base), so 2ⁿ = 1024 gives n = 10. Solving for the base takes the nth root of the result.',
    ],
    faqs: [
      {
        q: 'What is anything to the power of 0?',
        a: '1, for any non-zero base. 0⁰ is usually defined as 1 in algebra and combinatorics.',
      },
      {
        q: 'Why can’t I raise a negative number to 0.5?',
        a: 'That is the square root of a negative number, which has no real value. Use the square root calculator to see the imaginary result.',
      },
    ],
  },
];
