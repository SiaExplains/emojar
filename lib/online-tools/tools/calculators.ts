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
      'Calculate the monthly payment, total interest and total cost of a loan or mortgage, with a yearly amortization table.',
    title: 'Loan Calculator – Monthly Payment, Interest & Amortization',
    metaDescription:
      'Calculate loan and mortgage payments online: monthly payment, total interest and yearly amortization schedule. Free.',
    keywords: [
      'loan calculator',
      'mortgage calculator',
      'monthly payment calculator',
      'amortization calculator',
    ],
    relatedTools: [
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
];
