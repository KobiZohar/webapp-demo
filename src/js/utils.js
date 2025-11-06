// Utility functions for the application

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function generateRandomId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

export { formatDate, generateRandomId };