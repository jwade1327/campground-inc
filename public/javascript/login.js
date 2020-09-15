// login form
async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch ('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        // check responses
        if (response.ok) {
            localStorage.setItem('loggedIn', true);
            document.location.replace('/dashboard')
        } else {
            alert(response.statusText);
            localStorage.setItem('loggedIn', false);
        }
    }
};

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);