if (!document.getElementById('productForm').hasAttribute('data-listener-added')) {
    document.getElementById('productForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData();
        formData.append('prodName', document.getElementById('prodName').value);
        formData.append('prodPrice', document.getElementById('prodPrice').value);
        formData.append('prodImg', document.getElementById('prodImg').files[0]);
        formData.append('prodStock', document.getElementById('prodStock').value);

        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable button to prevent double submission

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('responseMessage').innerHTML = `<div class="alert alert-success">Product added successfully! Product ID: ${data.id}</div>`;
            } else {
                document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Failed to add product.</div>`;
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error adding product: ${error.message}</div>`;
        } finally {
            submitButton.disabled = false; // Re-enable button
        }
    });

    // Mark that the listener has been added
    document.getElementById('productForm').setAttribute('data-listener-added', 'true');
}


async function renderData() {
    try {
        const response = await fetch('/api/products');
        const items = await response.json();

        const dataContainer = document.querySelector('#grid-product-container');
        dataContainer.innerHTML = ''; // Clear previous items

        items.forEach((item) => {
            const productContainer = document.createElement('div');
            productContainer.classList.add('grid-each-product-container');

            productContainer.innerHTML = `
                <div class="productContainer" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <img src="${item.prodImg}" alt="${item.prodName}">
                    <div class="product-label-name">
                        <h2>${item.prodName}</h2>
                    </div>
                    <div class="product-price">
                        <h2>P ${item.prodPrice}</h2>
                    </div>
                    <div class="product-stock"> <!-- Added stock display -->
                        <h2>Stock: ${item.prodStock}</h2>
                    </div>
                    <div class="button-container-delete button-container-product">
                        <button type="button" class="btn delete-button" style="background-color:#ff4d4d " data-id="${item.id}">
                            DELETE PRODUCT
                        </button>
                    </div>
                    <div class="button-container-update button-container-product">
                        <button type="button" class="btn update-button" style="background-color:#00cc00" data-id="${item.id}">
                            EDIT PRODUCT
                        </button>
                    </div>
                </div>
            `;

            dataContainer.appendChild(productContainer);
        })

        // Attach delete event listeners to all delete buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                deleteProduct(productId);
            });
        });

        document.querySelectorAll('.update-button').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const product = items.find(item => item.id === productId);
        
                // Populate modal fields with current product data
                document.getElementById('updateProdName').value = product.prodName;
                document.getElementById('updateProdPrice').value = product.prodPrice;
                document.getElementById('updateProdStock').value = product.prodStock; // Added stock field
                document.getElementById('updateProductId').value = productId;
                
                // Show the modal
                const updateProductModal = new bootstrap.Modal(document.getElementById('updateProductModal'));
                updateProductModal.show();
            });
        });
        
    } catch (error) {
        console.error("Error rendering data:", error);
    }
}


// Call renderData on page load
window.onload = renderData;


document.getElementById('updateProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productId = document.getElementById('updateProductId').value;
    const formData = new FormData();
    formData.append('prodName', document.getElementById('updateProdName').value);
    formData.append('prodPrice', document.getElementById('updateProdPrice').value);
    formData.append('prodStock', document.getElementById('updateProdStock').value); // Added prodStock

    const updatedImageFile = document.getElementById('updateProdImg').files[0];
    if (updatedImageFile) {
        formData.append('prodImg', updatedImageFile);
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            body: formData
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-success">Product updated successfully!</div>`;
            renderData(); // Refresh product list
            const updateProductModal = bootstrap.Modal.getInstance(document.getElementById('updateProductModal'));
            updateProductModal.hide(); // Close the modal
        } else {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Failed to update product.</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error updating product: ${error.message}</div>`;
    }
});


async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-success">Product deleted successfully!</div>`;
            renderData(); // Refresh the product list
        } else {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Failed to delete product.</div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error deleting product: ${error.message}</div>`;
    }
}
