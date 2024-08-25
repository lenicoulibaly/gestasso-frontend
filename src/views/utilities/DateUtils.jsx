export function isValidDate(value) {
    const date = new Date(value);
    return !isNaN(date) && date.toString() !== 'Invalid Date';
}
