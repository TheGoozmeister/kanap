const getProductDatas = productId => {
    // Function to get the product Datas from the API with its Id
    // Returns err if failed 

    return fetch("http://localhost:3000/api/products/" + productId)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(function(err) {
            console.log("Couldn't reach product Datas : ", err);
        });
    }

function getId() {
    // Function to get product id from URL

    const productUrl = new URL(window.location.href);
    return productUrl.searchParams.get("id");
}

function fillProductDatas (product) {
    // Function which fills the DOM with the product datas

    document.getElementsByClassName("item__img")[0].innerHTML = "<img src=" + product.imageUrl + " alt=" + product.altTxt + ">";
    document.getElementById("title").innerText = product.name;
    document.getElementById("price").innerText = product.price; 
    document.getElementById("description").innerText = product.description;
    for (let colorIndex=0; colorIndex < product.colors.length; colorIndex++) {
        const color = document.createElement("option");
        color.setAttribute("value", product.colors[colorIndex]);
        color.innerText = product.colors[colorIndex];
        document.getElementById("colors").appendChild(color);
    }
}

function createBasket() {
    // Function to create basket in local storage
    // Returns array basket
    
    let basket = [];
    let basketJson = JSON.stringify(basket);
    localStorage.setItem("basket", basketJson);
    console.log(basket);
    return basket;
}

function addToBasket () {
    // Function that add the product (Id, Quantity, Color) to the basket if product is not in basket 
    // Increases quantity if it's already here

    const productId = getId();
    const productColor = document.getElementById("colors").value;
    const productQuantity = document.getElementById("quantity").value;
    const productToAdd = [productId, productColor, productQuantity];
    // console.log(productToAdd);
    
    let basketLinea = localStorage.getItem("basket");
    // console.log(basketLinea);
    let basket = JSON.parse(basketLinea);
    if (basket === null) {
        basket = createBasket();
    }
    console.log(basket);
    const productInBasket = findProductInBasket(basket,productId,productColor);
    
    // Check if product is alreay in basket
    if (productInBasket === null) {
        basket.push(productToAdd);
    }
    else {
        productInBasket[2] = parseInt(productQuantity) + parseInt(productInBasket[2]);
    }
    
    console.log(basket);
    basketLinea = JSON.stringify(basket);
    localStorage.setItem("basket", JSON.stringify(basket));
}

function findProductInBasket (basket, productId, productColor) {
    // Function that takes a product id and a product color to check if it's already in basket
    // Return null or product

    let productInBasket = null;
    if (basket === null) {
        return null;
    }
    else {
        for (let i=0; i < basket.length; i++) {
            if (basket[i][0] === productId && basket[i][1] === productColor) {
                productInBasket = basket[i];
                console.log(productInBasket);
            } 
        }
        return productInBasket;
    }
}

async function main () {
    const productId = getId();
    const product = await getProductDatas(productId);
    fillProductDatas(product);
    document.getElementById("addToCart").addEventListener("click", addToBasket);
}

main();