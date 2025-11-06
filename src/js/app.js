// Main JavaScript file for the application (ES module)
import { formatDate, generateRandomId } from './utils.js';

let financialChart = null;

function initApp() {
    console.log('App initialized');
    setupEventListeners();
    initChart();
    
    // show today's date if element is present
    const todayEl = document.getElementById('today');
    if (todayEl) todayEl.textContent = formatDate(new Date());
}

function setupEventListeners() {
    const myButton = document.getElementById('myButton');
    const showId = document.getElementById('showId');
    const generatedId = document.getElementById('generatedId');
    const modalEl = document.getElementById('exampleModal');

    // Use Bootstrap 5's JS API (no jQuery)
    if (myButton && modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        myButton.addEventListener('click', () => modal.show());
    }

    if (showId && generatedId) {
        showId.addEventListener('click', () => {
            generatedId.textContent = generateRandomId();
        });
    }

    // Listen for input changes to update chart
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', updateChartData);
    });

    // Fill random data button (normal distributions)
    const fillBtn = document.getElementById('fillRandom');
    if (fillBtn) {
        fillBtn.addEventListener('click', () => {
            fillRandomData(15000, 1000, 13000, 3000);
        });
    }

    // Listen for tab changes to resize chart
    const chartsTab = document.getElementById('charts-tab');
    if (chartsTab) {
        chartsTab.addEventListener('shown.bs.tab', () => {
            if (financialChart) {
                financialChart.resize();
            }
        });
    }
}

function initChart() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: Array(12).fill(0),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: Array(12).fill(0),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Gap',
                    data: Array(12).fill(0),
                    backgroundColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? 
                            'rgba(75, 192, 192, 0.5)' : // green for positive
                            'rgba(255, 99, 132, 0.5)';  // red for negative
                    },
                    borderColor: function(context) {
                        const value = context.dataset.data[context.dataIndex];
                        return value >= 0 ? 
                            'rgba(75, 192, 192, 1)' : // green for positive
                            'rgba(255, 99, 132, 1)';  // red for negative
                    },
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

function updateChartData() {
    if (!financialChart) return;

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                   'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    const incomeData = months.map(month => {
        const input = document.getElementById(`${month}-income`);
        return input ? parseFloat(input.value) || 0 : 0;
    });

    const expenseData = months.map(month => {
        const input = document.getElementById(`${month}-expense`);
        return input ? parseFloat(input.value) || 0 : 0;
    });

    const gapData = months.map((_, i) => incomeData[i] - expenseData[i]);

    financialChart.data.datasets[0].data = incomeData;
    financialChart.data.datasets[1].data = expenseData;
    financialChart.data.datasets[2].data = gapData;

    financialChart.update();
}

// Box-Muller transform to generate normal (Gaussian) random numbers
function randNormal(mean = 0, std = 1) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * std + mean;
}

// Fill all monthly inputs with random numbers from specified normals
function fillRandomData(meanIncome = 15000, stdIncome = 1000, meanExpense = 13000, stdExpense = 3000) {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    months.forEach(month => {
        const incEl = document.getElementById(`${month}-income`);
        const expEl = document.getElementById(`${month}-expense`);
        if (incEl) {
            const val = Math.round(randNormal(meanIncome, stdIncome));
            incEl.value = Math.max(0, val);
        }
        if (expEl) {
            const val = Math.round(randNormal(meanExpense, stdExpense));
            expEl.value = Math.max(0, val);
        }
    });
    // Update chart once after all inputs set
    updateChartData();
}

// Download logic for chart and data
function chartToJPG() {
    if (!financialChart) return;
    const link = document.createElement('a');
    link.href = financialChart.toBase64Image('image/jpeg', 1.0);
    link.download = 'financial_chart.jpg';
    link.click();
}

function dataToCSV() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const income = financialChart.data.datasets[0].data;
    const expenses = financialChart.data.datasets[1].data;
    const gap = financialChart.data.datasets[2].data;
    let csv = 'Month,Income,Expenses,Gap\n';
    for (let i = 0; i < months.length; i++) {
        csv += `${months[i]},${income[i]},${expenses[i]},${gap[i]}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'financial_data.csv';
    link.click();
}

function chartAndDataToPDF() {
    if (!financialChart || !window.jspdf || !window.jspdf.jsPDF) return;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const income = financialChart.data.datasets[0].data;
    const expenses = financialChart.data.datasets[1].data;
    const gap = financialChart.data.datasets[2].data;
    const chartImg = financialChart.toBase64Image('image/jpeg', 1.0);
    const doc = new window.jspdf.jsPDF({ orientation: 'landscape' });
    doc.setFontSize(18);
    doc.text('Financial Chart', 14, 18);
    doc.addImage(chartImg, 'JPEG', 14, 25, 260, 80);
    doc.setFontSize(14);
    doc.text('Data Table', 14, 110);
    let table = [['Month', 'Income', 'Expenses', 'Gap']];
    for (let i = 0; i < months.length; i++) {
        table.push([months[i], income[i], expenses[i], gap[i]]);
    }
    let startY = 115;
    table.forEach((row, idx) => {
        doc.text(row.join('   '), 14, startY + idx * 8);
    });
    doc.save('financial_chart_and_data.pdf');
}

document.addEventListener('DOMContentLoaded', () => {
    // Run the app
    initApp();

    // Download event listeners
    const jpgBtn = document.getElementById('download-jpg');
    if (jpgBtn) jpgBtn.addEventListener('click', e => { e.preventDefault(); chartToJPG(); });
    const csvBtn = document.getElementById('download-csv');
    if (csvBtn) csvBtn.addEventListener('click', e => { e.preventDefault(); dataToCSV(); });
    const pdfBtn = document.getElementById('download-pdf');
    if (pdfBtn) pdfBtn.addEventListener('click', e => { e.preventDefault(); chartAndDataToPDF(); });
});