const modal = $('.modal');

const loginBtn = $(".login-btn");
const loginForm = $('.login');
const loginExitBtn = $('.login__exit-btn');
const messageContainerEle = $('.login__message');
const loginRegister = $('.login__header-signup');

const registerForm = $('.register');
const registerBtn = $('.signup-btn');
const registerExitBtn = $('.register__exit-btn');
const registerLogin = $('.register__header-login');

loginBtn.addEventListener("click", () => {
    modal.classList.remove('hidden');
    loginForm.classList.remove('hidden');
});

loginExitBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    loginForm.classList.add('hidden');
    toggleErrorMessage(messageContainerEle, '', 'error-msg', false);
});

loginRegister.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    modal.classList.remove('hidden');
});

modal.addEventListener('click', () => {
    modal.classList.add('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    toggleErrorMessage(messageContainerEle, '', 'error-msg', false);
});

registerBtn.addEventListener("click", () => {
    modal.classList.remove('hidden');
    registerForm.classList.remove('hidden');
});

registerExitBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    registerForm.classList.add('hidden');
});

registerLogin.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    modal.classList.remove('hidden');
});

async function login() {
    const username = $('#login__username').value;
    const password = $('#login__password').value;

    const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const resData = await res.json()
    if (resData.msg) {
        toggleErrorMessage(messageContainerEle, resData.msg, 'error-msg', true);
        return;
    }
    window.location.pathname = resData.redirectPath;
}

async function register() {
    const username = $('#register__username').value;
    const email = $('#register__email').value;
    const password = $('#register__password').value;
    const passwordConfirm = $('#register__password-confirm').value
    
    if(password !== passwordConfirm) return;

    const res = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const resData = await res.json()
    if (resData.msg) {
        toggleErrorMessage(messageContainerEle, resData.msg, 'error-msg', true);
        return;
    }
    window.location.pathname = resData.redirectPath;
}

function toggleErrorMessage(msgContainer, msg, htmlClass, toggleState) {
    msgContainer.innerText = msg;
    msgContainer.classList.toggle(htmlClass, toggleState);
}
