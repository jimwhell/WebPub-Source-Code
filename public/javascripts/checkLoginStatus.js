const checkLoginStatus = async () => {
    try {
        const response = await fetch('/api/users/status');
        const data = await response.json();

        const statusElement = document.getElementById('status');

        if (data.loggedIn) {
            statusElement.textContent = 'Logout';
            statusElement.href = '#'; // Prevent the default link behavior
            statusElement.addEventListener('click', (event) => {
                event.preventDefault();
                logoutUser();
                window.location.href = '/';
            });
        } 
        
        else {
            statusElement.textContent = 'Login';
            statusElement.href = '/userLogin'; // Redirect to the login page
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
};

const logoutUser = async () => {
    try {
        const response = await fetch('/api/users/logout', { method: 'POST' });

        if (response.ok) {
            window.location.href = '/'; // Redirect after logout
        } else {
            console.error('Error during logout:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending logout request:', error);
    }
};


window.onload = () => {
    checkLoginStatus();
};
