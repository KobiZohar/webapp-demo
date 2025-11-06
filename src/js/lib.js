// Pure helper functions for testing and reuse

// Box-Muller transform to generate normal (Gaussian) random numbers
function randNormal(mean = 0, std = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * std + mean;
}

// Given arrays (months, income, expenses, gap) produce CSV string
function csvFromArrays(months, incomeArr, expenseArr, gapArr) {
  const header = 'Month,Income,Expenses,Gap';
  const lines = [header];
  for (let i = 0; i < months.length; i++) {
    const m = months[i] ?? '';
    const inc = incomeArr[i] ?? 0;
    const exp = expenseArr[i] ?? 0;
    const gap = gapArr[i] ?? (inc - exp);
    lines.push(`${m},${inc},${exp},${gap}`);
  }
  return lines.join('\n');
}

// Compute gap array from income and expense arrays
function computeGap(incomeArr, expenseArr) {
  const len = Math.max(incomeArr.length, expenseArr.length);
  const gap = new Array(len);
  for (let i = 0; i < len; i++) {
    gap[i] = (incomeArr[i] || 0) - (expenseArr[i] || 0);
  }
  return gap;
}

export { randNormal, csvFromArrays, computeGap };
