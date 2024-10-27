const express = require('express');
const router = express.Router();
const { db } = require('../config');
const { collection, getDocs } = require('firebase/firestore');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const querySnapshot = await getDocs(collection(db, 'admin'));
        let adminUser = null;

        querySnapshot.forEach((doc) => {
            const adminData = doc.data();
            if (adminData.username === username && adminData.password === password) {
                adminUser = { id: doc.id, ...adminData };
            }
        });

        if (adminUser) {
            // Store admin user info in session
            req.session.adminUser = adminUser.id;
            console.log(`Fuck: ${req.session.adminUser}`);
            res.status(200).json({ message: 'Login successful', adminUser });

        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).send('Error during admin login');
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/adminLogin'); // Redirect to login after logout
    });
});

router.get('/allUsers', async (req, res) => {
    try
    {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            users.push({ id: doc.id, ...userData});
        });

        res.json(users);
    }
    catch(error)
    {
        console.error('Error encountered in fetching all users. ', error);
        res.status(500).send('Error fetching all user data.');
    }
})


module.exports = router;
