// userRoutes.js
const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { collection, getDocs, addDoc } = require('firebase/firestore');
const bcrypt = require('bcrypt');
const isUserAuthenticated = require('../middleware/UserAuth');

// User Sign-Up Route
router.post('/signup', async (req, res) => {
    const { username, password, email, address } = req.body;

    try {
        const usersCollection = collection(db, 'users');
        // Check if user already exists
        const querySnapshot = await getDocs(usersCollection);
        let userExists = false;
        querySnapshot.forEach((doc) => {
            if (doc.data().username === username) {
                userExists = true;
            }
        });

        if (userExists) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        // Add new user
        await addDoc(usersCollection, { username, password: hashedPassword, email, address });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error during user sign-up:", error);
        res.status(500).send('Error during user sign-up');
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        let user = null;

        // Iterate through each document in the snapshot
        for (const doc of querySnapshot.docs) {
            const userData = doc.data();
            if (userData.username === username) {
                const match = await bcrypt.compare(password, userData.password);
                if (match) {
                    user = { id: doc.id, ...userData };
                    break; // Stop searching once we find the user
                }
            }
        }

        if (user) {
            req.session.user = user.id;
            console.log(` Session id: ${req.session.user}`);
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).send('Error during user login');
    }
});

// User Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login'); // Redirect to login after logout
    });
});


// Check if user is logged in
router.get('/status', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(200).json({ loggedIn: false });
    }   
});

// router.post('/addMessage', async (req, res) => {
//     const {firstName, lastName, email, contactNumber, message, dateSent} = req.body;
//     try
//     {
//         const usersCollection = collection('db', users);

//         const querySnapshot = await getDocs(usersCollection);

//     }
//     catch(error)
//     {

//     }

// })

// router.get('/getUserId', (req, res) => {
//     console.log(req.session.user);
//     if (req.session.user) 
//     {
//         res.status(200).json(req.session.user);
//     } 
//     else 
//     {
//         res.status(200).json({ message: 'No active session. User is not logged in.' });
//     }
// });

module.exports = router;
