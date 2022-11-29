const getProductsDatas = () => {
    // Function to get the products Datas from the API
    // Returns err if failed 

    return fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .catch(function(err) {
            console.log("Couldn't reach products Datas : ", err);
        });
}

function addProduct (productDatas) {

        //Function to add a product to the DOM

        //Creating item
        const items =document.getElementById("items");
        const newItem =document.createElement("a");
        const itemArticle=document.createElement("article");
        const itemImg=document.createElement("img");
        const itemName=document.createElement("h3");
        const itemDescription=document.createElement("p");

        //Adding class
        itemName.classList.add("productName");
        itemDescription.classList.add("productDescription");
        
        //Adding the item to the DOM
        items.appendChild(newItem);
        newItem.appendChild(itemArticle);
        itemArticle.appendChild(itemImg);
        itemArticle.appendChild(itemName);
        itemArticle.appendChild(itemDescription);

        //Fulling item with the product Datas
        newItem.setAttribute("href", './product.html?id=' + productDatas._id);
        itemImg.setAttribute("src", productDatas.imageUrl);
        itemImg.setAttribute("alt", productDatas.altTxt);
        itemName.innerText = productDatas.name;
        itemDescription.innerText = productDatas.description;

};

async function main()  {
    const productsDatas = await getProductsDatas();
    for (let productIndex = 0; productIndex < productsDatas.length; productIndex++) {
        addProduct(productsDatas[productIndex]);
    }
};

main();