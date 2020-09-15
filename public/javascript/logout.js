async function logout() {
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    });

    if (response.ok) {
        document.location.replace('/');
        localStorage.setItem('loggedIn', false);
    }
    else {
        alert(response.statusText);
    }
};

document.querySelector('#logout').addEventListener('click', logout);
