function getBasket () {
    // Function that get the basket from localstorage
    // Returns array basket

    return JSON.parse(localStorage.getItem("basket"))
}

function setBasket (basket) {
    //Function that set the basket in the localstorage

    localStorage.setItem("basket", JSON.stringify(basket));
}

async function getProductDatas (productId) {
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

async function addBasketToDOM () {
    // Function that gets products from the basket and creates a card for each

    const basket = getBasket();
    console.log(basket);
    for (let product of basket) {
        const productId = product[0];
        //console.log(productId);
        const productDatas = await getProductDatas(productId);
        //console.log(productDatas);
        const productColor = product[1];
        const productQuantity = product[2];
        const productName = productDatas.name;
        const productImageUrl = productDatas.imageUrl;
        const productAltTxt = productDatas.altTxt;
        
        newCard = document.createElement("article");
        newCard.classList.add("cart__item");
        //console.log(newCard);
        document.getElementById("cart__items").appendChild(newCard);
        newCard.innerHTML = '<article class="cart__item" data-id="' + productId + '" data-color="' + productColor + '">\
                            <div class="cart__item__img">\
                            <img src="' + productImageUrl + '" alt="' + productAltTxt + '">\
                            </div>\
                            <div class="cart__item__content">\
                                <div class="cart__item__content__description">\
                                <h2>' + productName + '</h2>\
                                <p>' + productColor + '</p>\
                                <p>' + await getProductPrice(productId) + ' €</p>\
                                </div>\
                                <div class="cart__item__content__settings">\
                                <div class="cart__item__content__settings__quantity">\
                                    <p>Qté : </p>\
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + productQuantity + '">\
                                </div>\
                                <div class="cart__item__content__settings__delete">\
                                    <p class="deleteItem">Supprimer</p>\
                                </div>\
                                </div>\
                            </div>';    
    }
}

async function getProductPrice (productId) {
    // Function that returns the price of a product using its id

    const productDatas = await getProductDatas(productId);
    return productDatas.price;

}

async function getTotalPrice () {
    // Function that calculates the total price of the basket and put in the DOM

    let priceTotal = 0;
    const basket = getBasket();
    for (product of basket) {
        const productQuantity = product[2];
        priceTotal += await getProductPrice(product[0]) * productQuantity;
    }
    console.log(priceTotal);
    document.getElementById("totalPrice").innerText = priceTotal;
}

function getTotalQuantity () {
    // Function that calculates the total quantity of the basket and put it in the Dom

    const basket = getBasket();
    let quantityTotal = 0;
    for (product of basket) {
        quantityTotal += parseInt(product[2]);
    }
    console.log(quantityTotal);
    document.getElementById("totalQuantity").innerText = quantityTotal;
}

function removeProductFromBasket (productId, productColor) {
    // Function that removes product from basket using its id and its color 

    let basket = getBasket();
    console.log(basket);
    for (let productIndex=0; productIndex<basket.length; productIndex++) {
        if (basket[productIndex][0] === productId && basket[productIndex][1] === productColor) {
            const nextIndex=productIndex + 1;
            basket.splice(productIndex, nextIndex);
            
        }
    }
    setBasket(basket);
    console.log(basket);
}

function deleteProduct () {
    // Function that add delete buttons the supression of product in DOM and basket

    const listOfDelete = document.getElementsByClassName("deleteItem");
    for (let deleteIndex=0; deleteIndex<listOfDelete.length; deleteIndex++) {
        const deleteItem = listOfDelete[deleteIndex]
        deleteItem.addEventListener('click', function(event) {
            const product = event.target.closest('.cart__item');
            const productId = product.dataset.id;
            const productColor = product.dataset.color;
            removeProductFromBasket(productId, productColor);
            getTotalQuantity();
            getTotalPrice();
            console.log(product);
            console.log(productId, productColor);
            product.remove();
        });
    }
}

function changeQuantity () {
    // Function that changes the quantity of a product and updates total quantities and price 

    listOfQuantities = document.getElementsByClassName("itemQuantity");
    for (let quantity of listOfQuantities) {
        quantity.addEventListener('change', function (event) {
            quantity.value = this.value;
            const product = event.target.closest(".cart__item");
            const productId = product.dataset.id;
            const productColor = product.dataset.color;
            changeQuantityInBasket(productId, productColor, quantity.value);
            getTotalQuantity();
            getTotalPrice();
        })
    }
}

function changeQuantityInBasket(productId,productColor,quantity) {
    // Function that modifies the quantities in the basket using product's id and color

    const basket = getBasket();
    for (let product of basket) {
        if (product[0] === productId && product[1] === productColor) {
            product[2] = quantity;
        }
    }
    setBasket(basket);
}

function validateContactForm (contact) {
    // Function that uses Regex for each form input and prints an error message if mistakes

    document.getElementById("firstName").addEventListener("input", function(inputText) {
        let firstName = inputText.target.value;
        if (/[^a-z A-Z\-\']/.test(firstName)) {
            document.getElementById("firstNameErrorMsg").innerText = "Saisie incorrecte, le prénom ne doit contenir que des lettres"
            Reflect.deleteProperty(contact, 'firstName');
        } 
        else {
            document.getElementById("firstNameErrorMsg").innerText = "";
            contact.firstName = firstName;
            console.log(contact);
        }
    });
    document.getElementById("lastName").addEventListener("input", function(inputText) {
        let lastName = inputText.target.value;
        if (/[^a-z A-Z\-\']/.test(lastName)) {
            document.getElementById("lastNameErrorMsg").innerText = "Saisie incorrecte, le nom ne doit contenir que des lettres";
            Reflect.deleteProperty(contact, 'lastName');
        } 
        else {
            document.getElementById("lastNameErrorMsg").innerText = "";
            contact.lastName = lastName;
            console.log(contact);
        }
    });
    document.getElementById("address").addEventListener("input", function(inputText) {
        let address = inputText.target.value;
        if (/[^\w' ]/.test(address)) {
            document.getElementById("addressErrorMsg").innerText = "Saisie incorrecte, l'addresse ne doit pas contenir";
            Reflect.deleteProperty(contact, 'address');
        }
        else {
            document.getElementById("addressErrorMsg").innerText = "";
            contact.address = address;
        }
    });
    document.getElementById("city").addEventListener("input", function(inputText) {
        let city = inputText.target.value;
        if (/[^a-z A-Z\-\']/.test(city)) {
            document.getElementById("cityErrorMsg").innerText = "Saisie incorrecte, l'addresse ne doit pas contenir";
            Reflect.deleteProperty(contact, 'city');
        }
        else {
            document.getElementById("cityErrorMsg").innerText = "";
            contact.city = city;
        }
    });
    document.getElementById("email").addEventListener("input", function(inputText) {
        let email = inputText.target.value;
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
            document.getElementById("emailErrorMsg").innerText = "";
            contact.email = email;
        }
        else {
            document.getElementById("emailErrorMsg").innerText = "Saisie incorrecte, entrer une adresse-mail valide";
            Reflect.deleteProperty(contact, 'email');
        }
    });
 
}

function getIdsFromBasket () {
    // Function that get basket and returns an array of ids 

    const basket = getBasket();
        let productsId = [];
        for (let product in basket) {
            productsId.push(basket[product][0]);
        }
    return productsId;    
}




async function main() {
    let contact = new Object();
    await addBasketToDOM();
    await getTotalPrice();
    getTotalQuantity();
    deleteProduct();
    changeQuantity();
    validateContactForm(contact);
    document.getElementById("order").addEventListener("click", async function(event) {
        event.preventDefault();
        const productsId = getIdsFromBasket();
        if (Object.keys(contact).length === 5 && productsId.length > 0) {
            let requestBody = new Object();
            requestBody.contact = contact;
            requestBody.products = productsId;
            let response = await fetch("http://localhost:3000/api/products/order", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(requestBody) 
            })
            let result =await response.json();
            window.location.replace("./confirmation.html?orderId=" + result.orderId);
        }
        
    })
}

main();