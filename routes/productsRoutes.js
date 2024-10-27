const express = require('express');
const router = express.Router();
const { db, storage } = require('../config');
const { doc, collection, getDocs, addDoc, deleteDoc, updateDoc } = require('firebase/firestore');
const { getDownloadURL, ref, uploadBytes } = require('firebase/storage');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = [];

        querySnapshot.forEach((doc) => {
            const itemData = doc.data();
            // Include the document ID in the response object
            items.push({ id: doc.id, ...itemData });
        });

        res.json(items);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Error fetching data');
    }
});

// POST method to add a new product
router.post('/', upload.single('prodImg'), async (req, res) => {
    try {
        const { prodName, prodPrice, prodStock } = req.body;

        if (!req.file) {
            return res.status(400).send('No image file uploaded.');
        }

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `products/${req.file.originalname}`);
        const snapshot = await uploadBytes(storageRef, req.file.buffer);
        
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Create the product data object
        const productData = {
            prodName,
            prodPrice,
            prodStock,
            prodImg: downloadURL
            
        };

        // Add product to Firestore database
        const docRef = await addDoc(collection(db, 'products'), productData);
        res.status(201).json({ id: docRef.id, ...productData });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send('Error adding product');
    }
});

// DELETE method to delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Delete the product from Firestore
        await deleteDoc(doc(db, 'products', productId));

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send('Error deleting product');
    }
});


// PATCH method to update an existing product
router.patch('/:id', upload.single('prodImg'), async (req, res) => {
    try {
        const { id } = req.params;
        const { prodName, prodPrice, prodStock } = req.body;

        // Retrieve document reference
        const productRef = doc(db, 'products', id);

        // Create the updated data object
        let updatedData = { prodName, prodPrice, prodStock };

        // If there's a new image, upload it and update the image URL
        if (req.file) {
            const storageRef = ref(storage, `products/${req.file.originalname}`);
            const snapshot = await uploadBytes(storageRef, req.file.buffer);
            const downloadURL = await getDownloadURL(snapshot.ref);
            updatedData.prodImg = downloadURL;
        }

        // Update the document in Firestore
        await updateDoc(productRef, updatedData);
        res.status(200).json({ id, ...updatedData });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send('Error updating product');
    }
});



module.exports = router;
