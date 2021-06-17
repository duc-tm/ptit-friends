const dropDownBtn = document.querySelector('.header__acc--dropdown');
const optionsContainer = document.querySelector('.options-container');

dropDownBtn.addEventListener('click', ()=>{
    optionsContainer.classList.toggle('hidden');
});

window.addEventListener('click', (e)=>{
    if(e.target !== dropDownBtn){
        if(!optionsContainer.classList.contains('hidden')){
            optionsContainer.classList.add('hidden');
        }
    }
});

const logout = async () => {
    const res = await fetch('http://localhost:3000/user/logout', {
        method: 'POST',
        credentials: 'include',
    });

    const resData = await res.json();
    if(resData.state) {
        console.log('redirect')
        window.location.pathname = resData.redirectPath;
    }
}