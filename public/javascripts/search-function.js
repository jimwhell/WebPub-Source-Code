
const searchAllItems = (event) => {
    const searchTerm = event.target.value.toLowerCase() || '';

    let productCards = document.getElementsByClassName('grid-each-product-container');
    let productNameElements = document.getElementsByClassName('product-label-name');
    let noItemFound = document.querySelector('.no-item-found');

    let itemFound = false;

    for (let i = 0; i < productNameElements.length; i++) { //loops through all productNames for every input inside the searchbar.
        let productName = productNameElements[i].innerText.trim().toLowerCase(); 
        let productNameFirstLetter = productName.length > 0 ? productName[0] : '';
        let searchTermFirstLetter = searchTerm.length > 0 ? searchTerm[0] : '';  

    
        if (searchTerm === '' || (productName.includes(searchTerm) && productNameFirstLetter === searchTermFirstLetter)) //displays matching outputs conisting of product cards derived from the searchBar input
        {
            noItemFound.style.display = "none";
            productCards[i].style.display = "grid";
            productCards[i].style.placeItems = "center";
            itemFound = true; 
        } 
        else //hides all incompatible product cards
        {
            productCards[i].style.display = "none";
        }
    }

    if (!itemFound) //displays no item found banner if no matches were found.
    {
        noItemFound.style.display = "flex";
    }
};

const searchInput = document.querySelector('input[type="search"]').addEventListener('input', searchAllItems);
