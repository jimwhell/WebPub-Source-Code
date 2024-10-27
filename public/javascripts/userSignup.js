document.getElementById('userSignupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email, address })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('signupMessage').innerText = 'User created successfully!';
            // Optionally redirect to login page
            window.location.href = '/userLogin';
        } else {
            document.getElementById('signupMessage').innerText = result.message;
        }
    } catch (error) {
        console.error('Error during user sign-up:', error);
    }
});
