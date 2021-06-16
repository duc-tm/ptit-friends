const modal = $('.modal');

const loginBtn = $(".login-btn");
const loginForm = $('.login');
const loginExitBtn = $('.login__exit-btn');
const loginMsgContainer = $('.login__message');
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
    toggleErrorMessage(loginMsgContainer, '', 'error-msg', false);
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
    toggleErrorMessage(loginMsgContainer, '', 'error-msg', false);

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

    try {
        const res = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const resData = await res.json();
        if(resData.msg) {
            toggleErrorMessage(loginMsgContainer, resData.msg, 'error-msg', true);
            return;
        }
        window.location.pathname = resData.redirectPath;
    } catch (error) {
        console.log(error)
    }

}

async function register() {
    const username = $('#register__username').value;
    const email = $('#register__email').value;
    const password = $('#register__password').value;
    const repassword = $('#register__password-confirm').value

    const res = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, repassword })
    });

    const msg = await res.json()
    if (msg.state) {
        // toggleErrorMessage(loginMsgContainer, resData.msg, 'error-msg', true);
        // return;
        // window.location.pathname = resData.redirectPath;
        return;
    }

}

function toggleErrorMessage(msgContainer, msg, htmlClass, toggleState) {
    msgContainer.innerText = msg;
    msgContainer.classList.toggle(htmlClass, toggleState);
}
