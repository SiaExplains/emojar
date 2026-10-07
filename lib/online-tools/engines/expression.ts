// Safe math expression evaluator for the scientific calculator: tokenizer +
// shunting-yard → RPN. No eval/Function; only whitelisted functions.

import { ToolInputError } from './data';

export type AngleMode = 'deg' | 'rad';

type Token =
  | { t: 'num'; v: number }
  | { t: 'neg' }
  | { t: 'op'; v: string }
  | { t: 'fn'; v: string }
  | { t: 'lp' }
  | { t: 'rp' }
  | { t: 'comma' }
  | { t: 'post'; v: '!' | '%' };

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  π: Math.PI,
  e: Math.E,
  tau: 2 * Math.PI,
  phi: (1 + Math.sqrt(5)) / 2,
};

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n))
    throw new ToolInputError(
      'Factorial is only defined for whole numbers ≥ 0.',
    );
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function makeFunctions(
  mode: AngleMode,
): Record<string, (...a: number[]) => number> {
  const toRad = (x: number) => (mode === 'deg' ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (mode === 'deg' ? (x * 180) / Math.PI : x);
  // Snap tiny float noise so sin(180°) is 0, not 1.2e-16.
  const clean = (x: number) => (Math.abs(x) < 1e-12 ? 0 : x);
  return {
    sin: (x) => clean(Math.sin(toRad(x))),
    cos: (x) => clean(Math.cos(toRad(x))),
    tan: (x) => {
      const c = Math.cos(toRad(x));
      if (Math.abs(c) < 1e-12)
        throw new ToolInputError('tan is undefined at this angle.');
      return clean(Math.tan(toRad(x)));
    },
    asin: (x) => fromRad(Math.asin(x)),
    acos: (x) => fromRad(Math.acos(x)),
    atan: (x) => fromRad(Math.atan(x)),
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    sqrt: (x) => {
      if (x < 0)
        throw new ToolInputError(
          'Square root of a negative number is not a real number.',
        );
      return Math.sqrt(x);
    },
    cbrt: Math.cbrt,
    ln: (x) => {
      if (x <= 0)
        throw new ToolInputError('ln is only defined for positive numbers.');
      return Math.log(x);
    },
    log: (x) => {
      if (x <= 0)
        throw new ToolInputError('log is only defined for positive numbers.');
      return Math.log10(x);
    },
    log2: Math.log2,
    abs: Math.abs,
    exp: Math.exp,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    fact: factorial,
    min: (...a) => Math.min(...a),
    max: (...a) => Math.max(...a),
    nroot: (x, n) =>
      x < 0 && n % 2 === 1 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n),
  };
}

const PREC: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  mod: 2,
  neg: 3,
  '^': 4,
};
const RIGHT = new Set(['^', 'neg']);

export function tokenize(src: string): Token[] {
  const s = src
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/√\s*(\d+\.?\d*|\.\d+|π|pi\b|e\b)/gi, 'sqrt($1)')
    .replace(/√/g, 'sqrt')
    .replace(/\*\*/g, '^');
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const num = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));
    if (num) {
      tokens.push({ t: 'num', v: Number(num[0]) });
      i += num[0].length;
      continue;
    }
    const word = /^[a-zπ][a-z0-9]*/i.exec(s.slice(i));
    if (word) {
      const w = word[0].toLowerCase();
      if (w in CONSTANTS) tokens.push({ t: 'num', v: CONSTANTS[w] });
      else if (w === 'mod') tokens.push({ t: 'op', v: 'mod' });
      else tokens.push({ t: 'fn', v: w });
      i += word[0].length;
      continue;
    }
    if ('+-*/^'.includes(c)) tokens.push({ t: 'op', v: c });
    else if (c === '(') tokens.push({ t: 'lp' });
    else if (c === ')') tokens.push({ t: 'rp' });
    else if (c === ',') tokens.push({ t: 'comma' });
    else if (c === '!' || c === '%') tokens.push({ t: 'post', v: c });
    else throw new ToolInputError(`Unexpected character “${c}”.`);
    i++;
  }
  // Insert implicit multiplication: 2pi, 3(4), (2)(3), 2sin(30).
  const out: Token[] = [];
  for (const tk of tokens) {
    const prev = out[out.length - 1];
    const prevEndsValue =
      prev && (prev.t === 'num' || prev.t === 'rp' || prev.t === 'post');
    const startsValue = tk.t === 'num' || tk.t === 'lp' || tk.t === 'fn';
    if (prevEndsValue && startsValue) out.push({ t: 'op', v: '*' });
    out.push(tk);
  }
  return out;
}

export function evaluate(
  expr: string,
  mode: AngleMode = 'deg',
  ans = 0,
): number {
  if (!expr.trim()) throw new ToolInputError('Enter an expression.');
  const fns = makeFunctions(mode);
  const tokens = tokenize(expr.replace(/\bans\b/gi, `(${ans})`));
  const output: (Token | { t: 'call'; v: string; argc: number })[] = [];
  const stack: Token[] = [];
  const argCounts: number[] = [];
  let prev: Token | null = null;

  for (const tk of tokens) {
    if (tk.t === 'num') output.push(tk);
    else if (tk.t === 'fn') {
      if (!(tk.v in fns))
        throw new ToolInputError(`Unknown function “${tk.v}”.`);
      stack.push(tk);
    } else if (tk.t === 'post') output.push(tk);
    else if (tk.t === 'comma') {
      while (stack.length && stack[stack.length - 1].t !== 'lp')
        output.push(stack.pop()!);
      if (!argCounts.length)
        throw new ToolInputError(
          'Commas are only allowed inside function arguments.',
        );
      argCounts[argCounts.length - 1]++;
    } else if (tk.t === 'op') {
      const unary =
        (tk.v === '-' || tk.v === '+') &&
        (!prev || prev.t === 'op' || prev.t === 'lp' || prev.t === 'comma');
      if (unary) {
        if (tk.v === '-') stack.push({ t: 'neg' });
      } else {
        while (stack.length) {
          const top = stack[stack.length - 1];
          const topOp = top.t === 'neg' ? 'neg' : top.t === 'op' ? top.v : null;
          if (!topOp) break;
          if (
            PREC[topOp] > PREC[tk.v] ||
            (PREC[topOp] === PREC[tk.v] && !RIGHT.has(tk.v))
          )
            output.push(stack.pop()!);
          else break;
        }
        stack.push(tk);
      }
    } else if (tk.t === 'lp') {
      stack.push(tk);
      argCounts.push(prev?.t === 'fn' ? 1 : 0);
    } else if (tk.t === 'rp') {
      while (stack.length && stack[stack.length - 1].t !== 'lp')
        output.push(stack.pop()!);
      if (!stack.length) throw new ToolInputError('Mismatched parentheses.');
      stack.pop();
      const argc = argCounts.pop() ?? 0;
      const top = stack[stack.length - 1];
      if (top && top.t === 'fn') {
        stack.pop();
        output.push({ t: 'call', v: top.v, argc: Math.max(1, argc) });
      }
    }
    prev = tk;
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.t === 'lp') throw new ToolInputError('Mismatched parentheses.');
    if (top.t === 'fn')
      throw new ToolInputError(
        `“${top.v}” needs parentheses, e.g. ${top.v}(30).`,
      );
    output.push(top);
  }

  const values: number[] = [];
  const pop = () => {
    const v = values.pop();
    if (v === undefined)
      throw new ToolInputError('The expression is incomplete.');
    return v;
  };
  for (const tk of output) {
    if (tk.t === 'num') values.push(tk.v);
    else if (tk.t === 'neg') values.push(-pop());
    else if (tk.t === 'post') {
      const v = pop();
      values.push(tk.v === '!' ? factorial(v) : v / 100);
    } else if (tk.t === 'call') {
      const args = Array.from({ length: tk.argc }, pop).reverse();
      values.push(fns[tk.v](...args));
    } else if (tk.t === 'op') {
      const b = pop();
      const a = pop();
      switch (tk.v) {
        case '+':
          values.push(a + b);
          break;
        case '-':
          values.push(a - b);
          break;
        case '*':
          values.push(a * b);
          break;
        case '/':
          if (b === 0) throw new ToolInputError('Division by zero.');
          values.push(a / b);
          break;
        case 'mod':
          values.push(((a % b) + b) % b);
          break;
        case '^':
          values.push(Math.pow(a, b));
          break;
      }
    }
  }
  if (values.length !== 1)
    throw new ToolInputError('The expression is incomplete.');
  const result = values[0];
  if (Number.isNaN(result))
    throw new ToolInputError('The result is not a real number.');
  return result;
}

export function formatResult(n: number): string {
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '-∞';
  if (n !== 0 && (Math.abs(n) >= 1e15 || Math.abs(n) < 1e-9))
    return n.toExponential(10).replace(/\.?0+e/, 'e');
  return String(Number(n.toPrecision(14)));
}
