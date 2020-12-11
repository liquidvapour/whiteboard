import { expect } from 'chai';
import { scaleAround } from './utils';

describe("scale around arbitarty point", () => {
    [
        { i: [0, 0], e: [1.5, 1.5] },
        { i: [6, 0], e: [4.5, 1.5] },
        { i: [6, 6], e: [4.5, 4.5] },
        { i: [3, 3], e: [3, 3] }
    ].forEach(({ i, e }) =>
        it(`${i} should become ${e}`, () => {
            const result = scaleAround(i, [3, 3], 0.5);

            expect(result).to.deep.equal(e);
        }));
});