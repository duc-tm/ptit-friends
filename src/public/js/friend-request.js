const requestListContainer = $('.connect-request__list');
const targetInfoContainer = $('.imformation__content');
const userActionContainer = $('.user-action-container');
const majorMapping = new Map();

window.onload = () => {
    $$('.connect-request__item').forEach((element) => {
        element.onclick = getTargetInfo;
    });
    setMajorMap();
}

const setMajorMap = () => {
    majorMapping.set('CNTT', 'Công nghệ thông tin');
    majorMapping.set('CNDPT', 'Công nghệ đa phương tiện');
    majorMapping.set('ATTT', 'An toàn thông tin');
    majorMapping.set('TTDPT', 'Truyền thông đa phương tiện');
    majorMapping.set('Marketing', 'Marketing');
    majorMapping.set('QTKD', 'Quản trị kinh doanh');
}

const toggleActiveEle = (inactiveEle, activeEle, className) => {
    if (inactiveEle) inactiveEle.classList.remove(className);
    activeEle.classList.add(className);
}

const getTargetInfo = async function () {
    if (this.classList.contains('connect-request__item--active')) return;
    const prevActiveEle = $('.connect-request__item--active');
    toggleActiveEle(prevActiveEle, this, 'connect-request__item--active');

    const res = await fetch(`http://localhost:3000/user/get-info/${this.getAttribute('userid')}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const resData = await res.json();
    if (!resData.msg) {
        const targetInfo = resData.user;
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

const removeRequest = () => {
    $('.connect-request__item--active').remove();
    targetInfoContainer.innerHTML = '';
    userActionContainer.classList.add('hidden');
}

const respondFriendRequest = async (responseState) => {
    const senderId = $('.connect-request__item--active').getAttribute('userid');

    const res = await fetch('http://localhost:3000/user/respond-friend-request', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senderId, responseState })
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
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Phản hồi yêu cầu thành công!',
            showConfirmButton: false,
            timer: 1500
        });
        removeRequest();
    }
}

const rejectFriendRequest = async () => {
    const res = await respondFriendRequest(false);

    if (res) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Phản hồi yêu cầu thành công!',
            showConfirmButton: false,
            timer: 1500
        });
        removeRequest();
    }
}

$('.user-action__button--accept').addEventListener('click', acceptFriendRequest);
$('.user-action__button--reject').addEventListener('click', rejectFriendRequest);