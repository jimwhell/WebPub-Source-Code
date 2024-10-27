document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        const loginMessage = document.getElementById('loginMessage');

        if (response.ok) {
            loginMessage.textContent = data.message;
            // Redirect to admin dashboard
            window.location.href = '/admin'; // Redirect to admin.html
        } else {
            loginMessage.textContent = data.message;
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.adminUser) {
        return next(); // User is authenticated
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}

module.exports = isAuthenticated;

