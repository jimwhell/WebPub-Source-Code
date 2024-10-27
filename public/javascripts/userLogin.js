document.getElementById('userLoginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('loginMessage').innerText = 'Login successful!';
            // Redirect to dashboard or home page
            window.location.href = '/'; 
        } else {
            document.getElementById('loginMessage').innerText = result.message;
        }
    } catch (error) {
        console.error('Error during user login:', error);
    }
});
