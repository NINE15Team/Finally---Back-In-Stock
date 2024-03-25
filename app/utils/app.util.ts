export function calculatePrice(price: any): number {
    if (typeof price === 'number' && !isNaN(price) && price !== 0) {
        return price / 100;
    } else {
        console.error('Invalid or undefined price encountered.');
        return 0;
    }
}