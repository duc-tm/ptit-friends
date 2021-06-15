const modal = $('.modal');
const loginBtn = $(".login-btn");
const loginForm = $('.login');
const loginExitBtn = $('.login__exit-btn');
const messageContainerEle = $('.login__message');

loginBtn.addEventListener("click", () => {
    modal.classList.remove('hidden');
    loginForm.classList.remove('hidden');
});

loginExitBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    loginForm.classList.add('hidden');
    toggleErrorMessage(messageContainerEle, '', 'error-msg', false);
});

modal.addEventListener('click', () => {
    modal.classList.add('hidden');
    loginForm.classList.add('hidden');
    toggleErrorMessage(messageContainerEle, '', 'error-msg', false);

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
    if(resData.msg) {
        toggleErrorMessage(messageContainerEle, resData.msg, 'error-msg', true);
        return;
    }
    window.location.pathname = resData.redirectPath;
}

function toggleErrorMessage(msgContainer, msg, htmlClass, toggleState) {
    msgContainer.innerText = msg;
    msgContainer.classList.toggle(htmlClass, toggleState);
}
