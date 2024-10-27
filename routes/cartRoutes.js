// cartRoutes.js
const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { collection, doc, addDoc, getDocs, deleteDoc, updateDoc } = require('firebase/firestore');

// Middleware to ensure the user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Please log in' });
    }
}

// Add an item to the cart for the logged-in user
router.post('/add', isAuthenticated, async (req, res) => {
    const { itemDetails } = req.body;  // assuming itemDetails contains details like productId, quantity, etc.

    try {
        // Get reference to the logged-in user's document
        const userDoc = doc(db, 'users', req.session.user);
        const cartCollection = collection(userDoc, 'cart');

        // Add a new item to the user's cart subcollection
        await addDoc(cartCollection, itemDetails);
        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).send('Error adding item to cart');
    }
});

// Get all items in the cart for the logged-in user
router.get('/items', isAuthenticated, async (req, res) => {
    try {
        // Get reference to the logged-in user's cart subcollection
        const userDoc = doc(db, 'users', req.session.user);
        const cartCollection = collection(userDoc, 'cart');

        // Get all items in the cart for this user
        const querySnapshot = await getDocs(cartCollection);
        const cartItems = [];
        querySnapshot.forEach((doc) => {
            cartItems.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ cartItems });
    } catch (error) {
        console.error("Error retrieving cart items:", error);
        res.status(500).send('Error retrieving cart items');
    }
});

// Update an item in the cart
router.put('/update/:itemId', isAuthenticated, async (req, res) => {
    const { itemId } = req.params;
    const { updatedDetails } = req.body;

    try {
        // Get reference to the specific item in the user's cart
        const userDoc = doc(db, 'users', req.session.user);
        const cartItemDoc = doc(userDoc, 'cart', itemId);

        // Update the cart item
        await updateDoc(cartItemDoc, updatedDetails);
        res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).send('Error updating cart item');
    }
});

// Remove an item from the cart
router.delete('/remove/:itemId', isAuthenticated, async (req, res) => {
    const { itemId } = req.params;

    try {
        // Get reference to the specific item in the user's cart
        const userDoc = doc(db, 'users', req.session.user);
        const cartItemDoc = doc(userDoc, 'cart', itemId);

        // Delete the cart item
        await deleteDoc(cartItemDoc);
        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).send('Error removing cart item');
    }
});

module.exports = router;
