const requestListContainer = $('.connect-request__list');
const targetInfoContainer = $('.imformation__content');
const userActionContainer = $('.user-action-container');

const renderTargetList = (targetList, targetListEle) => {
    let html = '';
    targetList.forEach((target) => {
        html += `<li class="connect-send__item" userid=${target.userId}>
        <img src="/img/monleo.jpg" alt="" class="connect-send__img">
        <div class="connect-send__brief">
        <div class="connect-send__name">${target.fName}</div>
        <div class="connect-send__gender">${target.gender === 'male' ? 'Nam' : 'Nữ'}</div>
        </div>
        </li>`;
    });
    targetListEle.insertAdjacentHTML('beforeend', html);
}

const toggleActiveEle = (inactiveEle, activeEle, className) => {
    if (inactiveEle) inactiveEle.classList.remove(className);
    activeEle.classList.add(className);
}

const getTargetInfo = async function () {
    if (this.classList.contains('connect-send__item--active')) return;
    const prevActiveEle = $('.connect-send__item--active');
    toggleActiveEle(prevActiveEle, this, 'connect-send__item--active');

    const res = await fetch(`http://localhost:3000/user/get-info/${this.getAttribute('userid')}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const resData = await res.json();
    if (!resData.msg) {
        const targetInfo = resData.target;
        renderTargetInfo(targetInfo);
    }
}

const renderTargetInfo = ({ fName, age, major, hobbies }) => {
    const html = `<img src="/img/monleo.jpg" alt="" class="imformation__content__img">
    <ul class="information__content__list">
    <li class="information__content__item">
    Tên:
    <span class="information__content__text information__content__name">
    ${fName}
    </span>
    </li>
    <li class="information__content__item">
    Tuổi:
    <span class="information__content__text information__content__age">
    ${age}
    </span>
    </li>
    <li class="information__content__item">
    Ngành học:
    <span class="information__content__text information__content__major">
    ${majorMapping.get(major)}
    </span>
    </li>
    <li class="information__content__item">
    Sở thích:
    ${hobbies.reduce((total, hobby) => {
        total += `<span class="information__content__text information__content__hobbies">
        ${hobby}
        </span>`
        return total;
    }, '')}
    </li>
    </ul>`;

    targetInfoContainer.innerHTML = html;
    userActionContainer.classList.remove('hidden');
}

const respondFriendRequest = async (state) => {
    const targetId = $('.connect-request__item--active').getAttribute('userid');

    const res = await fetch('http://localhost:3000/user/respond-friend-request', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetId, state })
    });

    const resData = await res.json();
    if (resData.state) {
        return true;
    }
    return false
}

const acceptFriendRequest = async () => {
    const res = await respondFriendRequest(true);

    if (res) {
        console.log('sent');
    }
}

const rejectFriendRequest = async () => {
    const res = await respondFriendRequest(false);

    if (res) {
        $('.connect-request__item--active').remove();
        targetInfoContainer.innerHTML = '';
        userActionContainer.classList.add('hidden');
    }
}

$('.user-action__button--accept').addEventListener('click', acceptFriendRequest);
$('.user-action__button--reject').addEventListener('click', rejectFriendRequest);