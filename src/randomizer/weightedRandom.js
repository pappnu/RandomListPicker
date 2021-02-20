// From: https://stackoverflow.com/a/8435261
// Expects input of form: [{weight:1}, {weight:0.4}, {weight:12.57}]
export function weightedRandom(items) {
    let weight_sum = items.reduce((accumulator, item) => accumulator + item.weight, 0);
    let accumulated_sum = 0;
    let r = Math.random();
    for (let item of items) {
        accumulated_sum += item.weight / weight_sum;
        if (r <= accumulated_sum) {
            return item;
        }
    }
    return undefined;
}
