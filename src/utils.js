import { subtract, add, multiply } from 'mathjs';

export const scaleAround = (p, o, s) => {
    const r = subtract(p, o);
    const n = multiply(r, s);
    return add(n, o);
};