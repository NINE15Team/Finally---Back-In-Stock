export function parsePrice(price: any): number {
    if (!isNaN(price) && price != 0) {
        return Number(price);
    } else {
        console.error('Invalid or undefined price encountered.');
        return 0;
    }
}