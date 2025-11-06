import { formatDate, generateRandomId } from '../src/js/utils.js';
import { randNormal, csvFromArrays, computeGap } from '../src/js/lib.js';

describe('utils module', () => {
    test('generateRandomId returns an id-like string', () => {
        const id = generateRandomId();
        expect(typeof id).toBe('string');
        expect(id).toMatch(/^id-[a-z0-9]+$/i);
    });

    test('formatDate returns a string containing the year', () => {
        const s = formatDate(new Date('2020-01-02'));
        expect(typeof s).toBe('string');
        expect(s).toEqual(expect.stringContaining('2020'));
    });
});

describe('lib module (pure helpers)', () => {
    test('randNormal produces values near the mean over many samples', () => {
        const mean = 15000;
        const std = 1000;
        const N = 1000;
        let sum = 0;
        for (let i = 0; i < N; i++) {
            sum += randNormal(mean, std);
        }
        const sampleMean = sum / N;
        // Should be reasonably close to mean (allow generous tolerance)
        expect(Math.abs(sampleMean - mean)).toBeLessThan(200);
    });

    test('computeGap returns correct differences', () => {
        const income = [10, 20, 30];
        const expenses = [1, 5, 10];
        expect(computeGap(income, expenses)).toEqual([9, 15, 20]);
    });

    test('csvFromArrays returns correctly formatted CSV', () => {
        const months = ['Jan', 'Feb'];
        const inc = [100, 200];
        const exp = [80, 150];
        const gap = computeGap(inc, exp);
        const csv = csvFromArrays(months, inc, exp, gap);
        const lines = csv.split('\n');
        expect(lines[0]).toBe('Month,Income,Expenses,Gap');
        expect(lines.length).toBe(3);
        expect(lines[1]).toBe('Jan,100,80,20');
        expect(lines[2]).toBe('Feb,200,150,50');
    });
});