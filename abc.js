const array = [1, 2, 3, 4, 5, '6', false]
// [2,4] - prints even numbers
const numbers = "1234567890";
const result = [];
const getEvenNumbers = (array) => {
    for (let i of array) {
        if (numbers.includes(i) && i % 2 == 0 && typeof i == 'number') {
            result.push(i);
        }
    }
    return result;
}

console.log(getEvenNumbers(array));