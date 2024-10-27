// Function to fetch data from the server and render it on the page
async function renderData() {
    try {
        const response = await fetch('/api/products');
        const items = await response.json();

        const dataContainer = document.querySelector('.grid-product-container');

        items.forEach((item) => {
            const productContainer = document.createElement('div');
            productContainer.classList.add('grid-each-product-container');


            if (item.prodStock != 0) {
                productContainer.innerHTML = `
           
            <div class="productContainer unavailableContainer" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <img src="${item.prodImg}"></img>
                <div class="product-label-name">
                    <h2>${item.prodName}</h2>
                </div>

                <div class="product-price">
                    <h2>P ${item.prodPrice}</h2>
                </div>
                <div class="quantity">
                    <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus buttondown"><h5>-</h5> </button>
                    <input type="number" id="quantity" name="quantity" min="1" placeholder="quantity"  >
                    <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus buttonplus"> <h5>+</h5></button> 
                </div>

                <div class="button-container-cart" >
                    <button type="submit"  class="shopping-btn" data-bs-toggle="modal" data-bs-target="#myModal">
                            ADD TO CART
                    </button>
                </div>



            </div>
    
            `;
            } else {
                productContainer.innerHTML = `
           
            <div class="unavailproductContainer" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <img src="${item.prodImg}"></img>
                <div class="product-label-name">
                    <h2>${item.prodName}</h2>
                </div>

                <div class="product-price">
                    <h2>P ${item.prodPrice}</h2>
                </div>
                <div class="quantity    ">
                    <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus buttondown"><h5>-</h5> </button>
                    <input type="number" id="quantity" name="quantity" min="1" placeholder="quantity"  >
                    <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus buttonplus"> <h5>+</h5></button> 
                </div>

                <div class="button-container-cart" >
                    <button type="button" class="shopping-btn" disabled>
                        NOT AVAILABLE
                    </button>
                </div>
            </div>
            `;
            }
            

            // Append the item element to the container
            dataContainer.appendChild(productContainer);
        });

        document.querySelectorAll('.shopping-btn').forEach(button => {
            button.addEventListener('click',addToCartClicked)
        });
    } catch (error) {
        console.error("Error rendering data:", error);
    }
}

// Call renderData on page load
window.onload = renderData;
