// Directory script
const directoryData = './product.json';
const display = document.querySelector('article')

fetch(directoryData)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonObject) {
        console.table(jsonObject);  // temporary checking for valid response and data parsing
        const products = jsonObject['products'];
        products.forEach(displayproducts);
    });
