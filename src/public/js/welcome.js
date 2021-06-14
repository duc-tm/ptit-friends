const loginBtn = document.querySelector(".login-btn");
const modal = document.querySelector('.modal');
const loginForm = document.querySelector('.login');
const loginExitBtn = document.querySelector('.login__exit-btn');

loginBtn.addEventListener("click", () => {
    modal.classList.remove('hidden');
    loginForm.classList.remove('hidden');
});

loginExitBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    loginForm.classList.add('hidden');
});

modal.addEventListener('click', () => {
    modal.classList.add('hidden');
    loginForm.classList.add('hidden');
});

async function login() {
    const username = document.querySelector('#login__username').value;
    const password = document.querySelector('#login__password').value;

    const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    // html = await res.text()
    // document.querySelector('html').innerHTML = html;
    const url = window.location.toString();
    window.location = url.replace('welcome', '')
}