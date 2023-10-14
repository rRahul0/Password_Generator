const copyButton = document.querySelector("[copy-button]");
const pswdText = document.querySelector("#pswd");
const copiedText = document.querySelector("[show-text]");
const slide = document.querySelector(".slider");
const slideText = document.querySelector("[slide-length-show]");
const allCheckbox = document.querySelectorAll("[type=checkbox]");
const strengthSignal = document.querySelector('[strength-signal]');
const generate = document.querySelector('[password-generate]');

const symbol = "~!@#$%^&*()_+-=[]]{};:,.<>?/|";

let slideLength = 10;


function slider() {
    slide.value = slideLength;
    slideText.innerText = slideLength;
    const max = slide.max;
    slide.style.backgroundSize = (slideLength*100/max) + "% 100%";
}
slider();

function randNum(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getUpperCase() {
    return String.fromCharCode(randNum(65, 91));
}
function getLowerCase() {
    return String.fromCharCode(randNum(97, 123));
}
function getNumber() {
    return randNum(0, 9);
}
function getSymbol() {
    return symbol[randNum(0, 28)];
}
function showText() {
    slideText.innerText = slideLength;
}

function calcStrength() {
    let upper = false;
    let lower = false;
    let number = false;
    let symbol = false;

    if (allCheckbox[0].checked) upper = true;
    if (allCheckbox[1].checked) lower = true;
    if (allCheckbox[2].checked) number = true;
    if (allCheckbox[3].checked) symbol = true;

    if (upper && lower && number && symbol && (slideLength >= 8)) {
        strengthSignal.classList.remove("yellow");
        strengthSignal.classList.remove("red");
        strengthSignal.classList.add("green");
    }
    else if ((upper || lower) && (number || symbol) && (slideLength >= 6)) {
        strengthSignal.classList.remove("green");
        strengthSignal.classList.remove("red");
        strengthSignal.classList.add("yellow");
    }
    else {
        strengthSignal.classList.remove("green");
        strengthSignal.classList.remove("yellow");
        strengthSignal.classList.add("red");
    }

}

async function copyClipboard() {
    try {
        await navigator.clipboard.writeText(pswdText.value);
        copiedText.innerText = "Copied!";
    }
    catch (e) {
        copiedText.innerText = "failed";
    }
    copiedText.classList.add('active');
    setTimeout(() => {
        copiedText.classList.remove('active');
        copiedText.innerText = "";
    }, 2000)
}

let checkCount = 1;
function handelCheckboxChange() {
    let count = 0;
    allCheckbox.forEach((element) => {
        if (element.checked) count++;
    })
    checkCount = count;
    if (count > slideLength) {
        slideLength = count;
        slider();
    }

}

copyButton.addEventListener('click', () => {
    if (pswdText.value) {
        copyClipboard();
    }
});

allCheckbox.forEach((element) => {
    element.addEventListener('change', () => { handelCheckboxChange() });

});

slide.addEventListener("input", () => {
    slideLength = slide.value;
    showText();
    slider();
});

generate.addEventListener('click', () => {
    if (checkCount == 0) return;
    if (slideLength < checkCount) {
        slideLength = checkCount;
        slider();
    }
    let arr = []
    let password = "";
    if (allCheckbox[0].checked) arr.push(getUpperCase());
    if (allCheckbox[1].checked) arr.push(getLowerCase());
    if (allCheckbox[2].checked) arr.push(getNumber());
    if (allCheckbox[3].checked) arr.push(getSymbol());

    let checkedBox = [];
    allCheckbox.forEach((el) => {
        if (el.checked) checkedBox.push(el);
    })

    const arrLen = arr.length;
    for (let i = 0; i < slideLength - arrLen; i++) {
        let newIndex = randNum(0, checkedBox.length);
        if (checkedBox[newIndex] == document.getElementById('uppercase')) arr.push(getUpperCase());
        else if (checkedBox[newIndex] == document.getElementById('lowercase')) arr.push(getLowerCase());
        else if (checkedBox[newIndex] == document.getElementById('numbers')) arr.push(getNumber());
        else arr.push(getSymbol());
    }


    let n = arr.length;
    for (let i = 0; i < n; i++) {
        let changeIndex = randNum(0, n);
        let temp = arr[i];
        arr[i] = arr[changeIndex];
        arr[changeIndex] = temp;
    }

    arr.forEach((el) => password += el)
    pswdText.value = password;

    calcStrength();
})