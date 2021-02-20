// From: https://stackoverflow.com/a/61078260
// Chooses k unique random elements from array.
export function sample(array, k) {
    let n = array.length;

    if (k < 0 || k > n)
        throw new RangeError('Sample is larger than population or negative');

    pool = Array.prototype.slice.call(array);

    if (
        n <=
        (k <= 5
            ? 21
            : 21 + Math.pow(4, Math.ceil(Math.log(k * 3) / Math.log(4))))
    ) {
        // Randomly order k first items
        for (let i = 0; i < k; i++) {
            // invariant: non-selected at [i,n)
            let j = (i + Math.random() * (n - i)) | 0;
            let x = pool[i];
            pool[i] = pool[j];
            pool[j] = x;
        }
        pool.length = k; // truncate
        return pool;
    } else {
        let selected = new Set(); // Set holds only unique values
        while (selected.add((Math.random() * n) | 0).size < k) {}
        return Array.prototype.map.call(selected, (i) => population[i]);
    }
}
