const messageInput = $('.action__input');
const sendButton = $('.action__send');
const messageChat = $('.message-box__chat__main');

socket.on('server-send-message', (message) => {
    receiveMessage(message);
});

const sendMessage = async () => {
    const message = messageInput.value.trim();
    messageInput.value = '';
    messageInput.focus();
    if (message === '') return;

    const messageBoxActiveEle = $('.message-box__item--active');

    const res = await saveMessage(
        message,
        messageBoxActiveEle.getAttribute('messageBoxId')
    );

    if (!res.state) return;

    const targetId = messageBoxActiveEle.getAttribute('targetId');
    socket.emit('client-send-message', { message, targetId, senderId: userId });

    // updateLastMessage(message);
    renderMessage(message, 'massage-out');
    toBottomBox();
}

const receiveMessage = ({ message, senderId }) => {
    const imgLink = $('.massage-in__img').src;
    // updateLastMessage(message, senderId);
    renderMessage(message, 'massage-in', imgLink);
    toBottomBox();
}

// const updateLastMessage = (message, senderId) => {
//     let lastMessageContainer;
//     if (!senderId) {
//         lastMessageContainer = $('.message-box__item--active')
//             .querySelector('.message-box__item-last-message');
//     }
//     else {
//         lastMessageContainer = $(`.message-box__item[targetid="${senderId}"]`)
//             .querySelector('.message-box__item-last-message');
//     }
//     lastMessageContainer.innerText = message;
// }

const renderMessage = (message, messageContainer, imgLink) => {
    const html = `<div class="${messageContainer}">
                    ${imgLink ? `<img src="${imgLink}" alt="avatar" class="${messageContainer}__img" />` : ''}
                    <div class="${messageContainer}__text">${message}</div>
                </div>`;
    messageChat.insertAdjacentHTML('beforeend', html);
}

const saveMessage = async (message, messageBoxId) => {
    try {
        const res = await fetch(
            `http://localhost:3000/message/${messageBoxId}/save`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            }
        );
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

const assignShowBoxChatHandler = () => {
    const messageBoxEles = $$('.message-box__item');
    for (const messageBoxEle of messageBoxEles) {
        messageBoxEle.addEventListener('click', showBoxChat);
    }
}

const showBoxChat = async function () {
    if (this.classList.contains('message-box__item--active')) return;

    const messageBoxId = this.getAttribute('messageBoxId');
    try {
        const res = await fetch(
            `http://localhost:3000/message-box/${messageBoxId}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        )

        const { state, messageInfoList } = await res.json();
        if (state) {
            const targetFName = this.querySelector('.message-box__item-heading').textContent;
            $('.head__name').innerText = targetFName;
            const boxChatEle = $('.message-box__chat');
            $('.message-box__chat__main').innerHTML = '';

            toogleActiveClass(this, boxChatEle);

            messageInfoList.forEach((messageInfo) => {
                const messageContainer = userId === messageInfo.userId ? 'massage-out' : 'massage-in';
                console.log(messageInfo.createdAt)
                renderMessage(messageInfo.messageContent, messageContainer);
            });

            toBottomBox();
        }
    } catch (error) {
        console.log(error);
    }

}

const toBottomBox = () => {
    messageChat.scrollTop = messageChat.scrollHeight;
}

const toogleActiveClass = (messageBoxEle, boxChatEle) => {
    const activeMessageBox = $('.message-box__item--active');
    if (activeMessageBox) {
        activeMessageBox.classList.remove('message-box__item--active');
    }

    messageBoxEle.classList.add('message-box__item--active');
    if (!boxChatEle.classList.contains('message-box__chat--active')) {
        boxChatEle.classList.add('message-box__chat--active');
    }
}
$('body').onload = assignShowBoxChatHandler;

sendButton.addEventListener('click', sendMessage);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') sendMessage();
});