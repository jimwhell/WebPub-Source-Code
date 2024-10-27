
let showHide = false;
const searchButton = document.querySelector(".searchbar-container");
const searchButtonImg = document.querySelector("#searchButton");
const cartButton = document.querySelector(".cart-container");
const productModal = document.querySelector('.modals');

const overlay = document.querySelector('.overlay');

const navLink = document.querySelectorAll('.navigation a');
const navContainer = document.querySelector('.nav-container');

const hiddenElements = document.querySelectorAll('.hiddenContent');
const cart = document.querySelector('.cart-container');

const button = document.querySelector(".button-container-cart");
const done = document.querySelector(".done");
const notDone = document.querySelector(".notDone");

// empty cart
const generateCartTemplate = () => {
    let cartCount = countCartItems();

    let emptyCartContainer = document.querySelector('.empty-main-parent');
    if (cartCount == 0) {
        emptyCartContainer.style.display = "block";
    } 
    else 
    {
        emptyCartContainer.style.display = "none";
    }
};


// navbar on scroll
document.addEventListener('scroll', () => {
    const navContainer = document.querySelector('.nav-container');

    if (window.scrollY > 0  ) {
        navContainer.classList.add('scrolled');
        navContainer.style.backgroundColor = "#BBDCE3";
    }

    else {
        navContainer.classList.remove('scrolled');
        navContainer.style.backgroundColor = "transparent";
    }
})

// hover child element to parent
navLink.forEach(link => {
    link.addEventListener('mouseenter', () => {
        if (window.scrollY === 0) { 
            navContainer.style.backgroundColor = '#BBDCE3';
            
        }
    });

    link.addEventListener('mouseleave', () => {
        if (window.scrollY === 0) { 
            navContainer.style.backgroundColor = ''; 
            
        }
    });
});


// cart container 
function showCart() {
    cartButton.classList.remove('hide');
    cartButton.classList.add("show");
    overlay.style.display = 'block';
    document.body.classList.add('overlay-active');
    showHide = true;
};

function hideCart(){
    cartButton.classList.remove('show');
    cartButton.classList.add('hide');
    overlay.style.display = 'none';
    document.body.classList.remove('overlay-active');
    showHide = false;
};

overlay.addEventListener('click', hideCart);
document.querySelector('.cart').addEventListener('click', showCart);
document.querySelector('#closeCart').addEventListener('click', hideCart);


window.onload = () => {
    loadCartFromSessionStorage(); //retrieves all shopping cart data from the session storage
    initializeProductCardBtns(); //attaches event listeners to all product buttons and images to conduct specific logic.
    updateCartTotal(); // once the cart data is retrieved from the session storage, this function is called to calculate the shopping cart's total.
}

// --------------------function which creates a card template containing all of the details for a certain product and appends it to the empty cart container div.------------------------
const addItemToCart = (productName, productPrice, productQuantity, productImg) => {
    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-content');
    let cartProducts = document.getElementsByClassName('cart-container')[0];
    let cartItemNames = cartProducts.getElementsByClassName('product-name');
    let cartProductQuantityElements = cartProducts.getElementsByClassName('cart-quantity-input');
    let cartContentParent = document.querySelector('.cart-content-parent');

    // Check if the product is already in the cart
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].textContent == productName) {
            let cartProductQuantity = parseInt(cartProductQuantityElements[i].value);
            cartProductQuantity += parseInt(productQuantity);
            cartProductQuantityElements[i].value = cartProductQuantity;
            updateCartTotal();
            saveCartToSessionStorage();
            return;
        }
    }



    // Create cart row data with product details
    cartRowData = `
        <div class="picture-cart-container">
            <img src="${productImg}" alt="" class="imagecart">
        </div>
        <div class="product-name-cart">
            <div class="grid-product-name"><h3 class="product-name">${productName}</h3></div>
            <div class="grid-product-name"><h3 class="product-cart-price">${productPrice}</h3></div>
        </div>
        <div class="quantity-remove-cart">
            <div class="grid-product-name">
                <div class="quantity-number-cart"> 
                    <button class="minus buttondown"> - </button>
                    <input type="number" class="cart-quantity-input" id="quantity" name="quantity" min="1" value="${productQuantity}">
                    <button class="plus buttonplus"> + </button> 
                </div>
            </div>
            <div class="grid-product-name remove">
                <img src="images/trash.svg" class="trashbin" alt="">
            </div>
        </div>
    `;

    cartRow.innerHTML = cartRowData; //appends the created cart product template to the created cart-row div.
    cartContentParent.append(cartRow); //appends the cart row to empty cart container.

    // Attach event listeners to newly created elements
    InitializeCartInputBtns(cartRow);

    saveCartToSessionStorage(); /*after new cart row is appended to the HTML, this function is called to 
    update the cart in the session storage.*/
    
   
    generateCartTemplate();
    updateCartTotal();
}


//attaches event listeners to created cart row buttons and inputs inside the shopping cart. 
const InitializeCartInputBtns = (cartRow) => {
    cartRow.querySelector('.trashbin').addEventListener('click', removeCartItem);
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);

    cartRow.querySelector('.plus').addEventListener('click', function() {
        let input = this.parentNode.querySelector('input[type=number]');
        input.stepUp();
        quantityChanged({ target: input });
    });

    cartRow.querySelector('.minus').addEventListener('click', function() {
        let input = this.parentNode.querySelector('input[type=number]');
        input.stepDown();
        quantityChanged({ target: input });
    });
}





// --------------------function called by the add-to-cart buttons to retrieve the inherent product data of the clicked button.------------------------
const addToCartClicked = (event) => {
    showCart();
    let button = event.target;
    let productCard = button.parentElement.parentElement.parentElement;
    let productName = productCard.getElementsByClassName('product-label-name')[0].innerText;
    let productPrice = productCard.getElementsByClassName('product-price')[0].innerText;
    let productQuantity = productCard.querySelectorAll('#quantity')[0].value
    let productQuantityElement = productCard.querySelector('#quantity');
    let productImg = productCard.querySelectorAll('img')[0].src;
    if (typeof productQuantity === 'string') {
        productQuantity = parseInt(productQuantity); // Convert the string to an integer
    }
    
    // Default to 1 if the value is not a valid number
    if (isNaN(productQuantity) || productQuantity <= 0) {
        productQuantity = 1;
    }
    

    addItemToCart(productName, productPrice, productQuantity, productImg); //provides data as arguments for the addItemToCart function.
    productQuantityElement.value = 1; //resets the value of the input HTML element to one.
    
   
}

// --------------------function to initialize all buttons upon window load.------------------------
const initializeProductCardBtns = () => {
    const removeCartItemBtns = document.getElementsByClassName('trashbin');
    //loops through all delete buttons in cart cards and attaches event listeners
    for (let i = 0; i < removeCartItemBtns.length; i++)
    {
        let button = removeCartItemBtns[i];
        button.addEventListener('click', removeCartItem);
    }

     //loops through all addToCart buttons in product cards and attaches event listeners
    const addToCartBtns = document.getElementsByClassName('shopping-btn');
    for (let i = 0; i < addToCartBtns.length; i++)
    {
        let button = addToCartBtns[i];
        button.addEventListener('click', addToCartClicked);
    }

    //loops through all quantity inputs in product cards and attaches event listeners
    const cartQuantityInputs = document.getElementsByClassName('cart-quantity-input');

    for (var i = 0 ;i < cartQuantityInputs.length ; i++)
    {
        var cartQuantityInput = cartQuantityInputs[i];
        cartQuantityInput.addEventListener('change', quantityChanged);

       
    }
    
    //adds an event listener for the search bar and calls the searchAllItems to manage the filtering logic.
    

    // --------------------function to add event listeners to every product image for the generation of their own product modals.------------------------
    const productCards = document.getElementsByClassName('product-img');
    for (let i = 0; i < productCards.length; i++) {
        let productCard = productCards[i];
        productCard.addEventListener('click', productCardClicked);
    }
}


// --------------------function to retrieve the name and image of the clicked product images. sends the data as arguments to the generateProductModal function. ------------------------
const productCardClicked = (event) => {
    
    let productCard = event.target.closest('.productContainer');
    let productName = productCard.getElementsByClassName('product-label-name')[0].innerText;
    // let modalProductPrice = productCard.getElementsByClassName('product-price')[0].innerText;
    let productImg = productCard.getElementsByClassName('product-img')[0].src;
    
    generateProductModal(productName, productImg); 
    
};

// --------------------function used by the productCard event listeners to display the modal once a product image is clicked.------------------------
const generateProductModal = (productName, productImg) => { //retrieves the productName and productImg as parameters
    
    overlay.style.display = 'block';
    document.body.classList.add('overlay-active');
    productModal.style.display = "block"; //makes the modal visible from its initial value of display:none
    let productModalName = productModal.querySelector('.modal-product-name');
    let productModalImg = productModal.querySelector('.modal-img');
    let veryBadBtn = productModal.querySelector('.rating1');
    let badBtn = productModal.querySelector('.rating2');            //selects all modal elements from the html
    let goodBtn = productModal.querySelector('.rating3');
    let veryGoodBtn = productModal.querySelector('.rating4');
    resetRatingBtns(veryBadBtn, badBtn, goodBtn, veryGoodBtn);
    initializeRatingBtns(veryBadBtn, badBtn, goodBtn, veryGoodBtn);
    
    productModalName.innerText = productName; //Modal Title is assigned to the name of the clicked product.
    productModalImg.src = productImg; //Modal image is assigned to the image of the clicked product.
    overlay.addEventListener('click', hideModal);
}

// --------------------function enabling users to exit the modal by clicking on the overlay------------------------
const hideModal = () => {
    productModal.style.display = "none";
    overlay.style.display = 'none';
    document.body.classList.remove('overlay-active');
    
}

// --------------------Initializes the rating buttons inside the modal------------------------
const initializeRatingBtns = (veryBadBtn, badBtn, goodBtn, veryGoodBtn) => {
    // Define the rating button elements and their respective colors
    const buttons = [veryBadBtn, badBtn, goodBtn, veryGoodBtn];
    const colors = ["#d3acfa", "#c393f3", "#be7bff", "#b16ef4"];

    //loops through all buttons 
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const currentColor = window.getComputedStyle(btn).backgroundColor;
            const activeColor = colors[index];
            const isActive = currentColor === activeColor;

            // Toggle button and all previous buttons before their index
            for (let i = 0; i < buttons.length; i++) {
                if (i <= index) {
                    buttons[i].style.backgroundColor = isActive ? '' : colors[i];
                } else {
                    buttons[i].style.backgroundColor = '';
                }
            }
        });
    });
};



//function to reset rating buttons 
const resetRatingBtns = (veryBadBtn, badBtn, goodBtn, veryGoodBtn) => {
    veryBadBtn.style.backgroundColor = '';
    badBtn.style.backgroundColor = '';
    goodBtn.style.backgroundColor = '';
    veryGoodBtn.style.backgroundColor = ''; 

}





// --------------------function called by the remove button event listeners inside the cart------------------------
const removeCartItem = (event) => {
    let button = event.target; // targets the parent element
    button.parentElement.parentElement.parentElement.remove();
    updateCartTotal(); 
    saveCartToSessionStorage();

}


// --------------------function called by the quantity input button event listeners inside the cart------------------------
const quantityChanged = (event) => 
{
    let input = event.target;
    if(isNaN(input.value) || input.value <= 0 ){
        input.value = 1;
    }
    saveCartToSessionStorage();
    updateCartTotal();
}

// --------------------function to fetch the cart's contents and calculate their total.------------------------
const updateCartTotal = () => {
    const cartItemContainer = document.getElementsByClassName('cart-container')[0]; //selects the cart container
    const cartRows = cartItemContainer.getElementsByClassName('cart-content'); //selects all the cart containers inside the cart
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) // loops through all the stored products inside the cart
    {
        let cartRow = cartRows[i];
        let priceElement = cartRow.getElementsByClassName('product-cart-price')[0];
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        let price = parseFloat(priceElement.textContent.replace('P', ''));
        let quantity = quantityElement.value;
        console.log(quantity);
        total = total + (price * quantity);
    }
    total = Math.round(total * 100 )/100;
    document.getElementsByClassName('cart-total')[0].innerText = 'P'+ total + '.00'; //appends the value of the price to the total HTML element.
    generateCartTemplate();
    
}

// --------------------function to fetch the cart's contents and calculate their total.------------------------
const countCartItems = () => {
    const cartItemContainer = document.getElementsByClassName('cart-container')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-content');
    let count = 0;
    for (let i = 0; i < cartRows.length; i++)
    {
        count += 1;
    }

    return count;
}

// --------------------function to save the cart data inside the browser's session storage.------------------------
const saveCartToSessionStorage = () => {
    let cartItems = []; //empty array to store all products
    const cartItemContainer = document.getElementsByClassName('cart-container')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-content'); //fetches all products inside the cart

    for (let i = 0; i < cartRows.length; i++) { // loop to iterate through all cart contents
        let cartRow = cartRows[i];
        let productName = cartRow.getElementsByClassName('product-name')[0].textContent;
        let productPrice = cartRow.getElementsByClassName('product-cart-price')[0].textContent;
        let productQuantity = cartRow.getElementsByClassName('cart-quantity-input')[0].value;
        let productImg = cartRow.getElementsByClassName('imagecart')[0].src;

        let cartItem = {   //assigns the extracted cart content to an object
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            imgSrc: productImg
        };     
        console.log(cartItem.quantity);
        cartItems.push(cartItem); //Cart item object is sent to the cartItems array. The CartItems array is now an array of cart-item objects.
    }


    sessionStorage.setItem('cart', JSON.stringify(cartItems)); //cartItems is stored inside the sessionstorage
};


// --------------------function to load cart data from the browser's session storage.------------------------
const loadCartFromSessionStorage = () => {
    let storedCart = sessionStorage.getItem('cart'); //retrieves array of objects containing cart item objects.
    if (storedCart) {
        let cartItems = JSON.parse(storedCart); 
        cartItems.forEach(item => { //for loop to extract all product details
            addItemToCart(item.name, item.price, item.quantity, item.imgSrc); // addItemToCart is called to add all loaded items, ensuring that the user cart data is not erased when the browser is refreshed.
        });
    }
   
};





