const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const getCookies = () => {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieObjects = decodedCookie.split('; ')
        .reduce((total, cookieString) => {
            const cookieData = cookieString.split('=');
            total[cookieData[0]] = cookieData[1];
            return total;
        }, {});
    return cookieObjects;
}