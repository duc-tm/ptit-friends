const findBtn = $('.main__button');
const criteriaForm = $('.criteria-form');
const criteriaButtonFind = $('.criteria-form__btn-find');
const criteriaHobbiesItem = $$('.criteria-form__hobbies__item');
const criteriaMajorItem = $$('.criteria-form__major__item');
const criteriaExitBtn = $('.criteria-form__btn-exit');
const connectSendForm = $('.connect-send-form');
const targetInfoContainer = $('.imformation__content');
const userActionContainer = $('.user-action-container');
const majorMapping = new Map();
const chosenList = [];

findBtn.addEventListener('click', () => {
    criteriaForm.classList.remove('hidden');
});

criteriaHobbiesItem.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('criteria-form__hobbies__item--active');
    })
});

criteriaMajorItem.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('criteria-form__major__item--active');
    })
});

criteriaExitBtn.addEventListener('click', () => {
    criteriaForm.classList.add('hidden');
});

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

const submitCriteriaForm = async () => {
    const preferHobbyEles = [...$$('.criteria-form__hobbies__item--active')];
    const preferMajorEles = [...$$('.criteria-form__major__item--active')];
    const preferAge = $('#criteria-age').value;
    const preferGender = $('#criteria-gender').value;

    const preferHobbies = preferHobbyEles.map((preferHobbyEle) => preferHobbyEle.getAttribute('value'));
    const preferMajors = preferMajorEles.map((preferMajorEle) => preferMajorEle.getAttribute('value'));

    const res = await fetch('http://localhost:3000/user/matching', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferHobbies, preferMajors, preferAge, preferGender })
    });

    const resData = await res.json();
    if (!resData.msg) {
        const targetListEle = $('.connect-send__list');
        renderTargetList(resData, targetListEle);

        $$('.connect-send__item').forEach((targetItemEle) => {
            targetItemEle.onclick = getTargetInfo;
        });

        connectSendForm.classList.remove('hidden');
    }
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
        if (this.classList.contains('chosen')) {
            toggleChooseButton($('.user-action__button--remove'), $('.user-action__button--accept'));
        } else {
            toggleChooseButton($('.user-action__button--accept'), $('.user-action__button--remove'));
        }
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

const setMajorMap = () => {
    majorMapping.set('CNTT', 'Công nghệ thông tin');
    majorMapping.set('CNDPT', 'Công nghệ đa phương tiện');
    majorMapping.set('ATTT', 'An toàn thông tin');
    majorMapping.set('TTDPT', 'Truyền thông đa phương tiện');
    majorMapping.set('Marketing', 'Marketing');
    majorMapping.set('QTKD', 'Quản trị kinh doanh');
}
window.onload = setMajorMap;

criteriaButtonFind.addEventListener('click', submitCriteriaForm);

const toggleChooseButton = (displayButton, hiddenButton) => {
    displayButton.classList.remove('hidden');
    hiddenButton.classList.add('hidden');
}

const pushToChosenList = function () {
    const activeEle = $('.connect-send__item--active');
    const targetId = activeEle.getAttribute('userid');
    chosenList.push(targetId);
    activeEle.classList.add('chosen');
    toggleChooseButton($('.user-action__button--remove'), this);
}

const removeFromChosenList = function () {
    const activeEle = $('.connect-send__item--active');
    const targetId = activeEle.getAttribute('userid');
    chosenList.splice(chosenList.indexOf(targetId), 1);
    activeEle.classList.remove('chosen');
    toggleChooseButton($('.user-action__button--accept'), this);
}

const sendAddFriendRequest = async () => {
    if (chosenList.length > 0) {
        const res = await fetch('http://localhost:3000/user/send-friend-request', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chosenList })
        })

        const resData = await res.json();
        if (!resData.state) {
            console.log(error);
        }
    }
    window.location.pathname = '/';
}

$('.user-action__button--reject').addEventListener('click', () => {
    $('.connect-send__item--active').remove();
    targetInfoContainer.innerHTML = '';
    userActionContainer.classList.add('hidden');
});

$('.user-action__button--accept').addEventListener('click', pushToChosenList);

$('.user-action__button--remove').addEventListener('click', removeFromChosenList);

$('.user-action__button--confirm').addEventListener('click', sendAddFriendRequest)