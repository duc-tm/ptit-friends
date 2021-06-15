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