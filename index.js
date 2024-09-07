import {supportedLangueges} from "./languages.js";

const swapButton = document.querySelector('.switch button');
const translateButton = document.querySelector('.translate-button');

// add the supported languages to the selection element
const target = document.getElementById('to');
const source = document.getElementById('from');
let selectHtml = '';
for (let key in supportedLangueges) {
    selectHtml += `
        <option value="${key}">${key}</option>
    `;
}
target.innerHTML = selectHtml;
source.innerHTML = selectHtml;

// get the text input , handle the api request and display the translation
function translateText() {
    const text = document.querySelector('.trasnslate-input textarea').value;
    const sourceLanguage = supportedLangueges[source.value];
    const targetLanguage = supportedLangueges[target.value];
    const langPair = `${sourceLanguage}|${targetLanguage}`;
    const translationArea = document.querySelector('.translation textarea');
    translationArea.placeholder = 'translating...';

    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${langPair}`;

    fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Response network was not ok')
        }
    }).then(translation => {
        const translationText = translation.responseData.translatedText;
        translationArea.value = translationText; 

    }).catch(error => {
        console.log(`Error during fetch: ${error}`)
    })
    
}

// swap the selected languages when the swap button is clicked 
const translationText = document.querySelector('.translation textarea');
const text = document.querySelector('.trasnslate-input textarea');

swapButton.addEventListener('click',event => {
    const targetLanguage = document.getElementById('to');
    const sourceLanguage = document.getElementById('from');
    
    let tmp = targetLanguage.value;
    targetLanguage.value = sourceLanguage.value;
    sourceLanguage.value = tmp;

    if (translationText.value.length > 0) {
        tmp = translationText.value;
        translationText.value = text.value;
        text.value = tmp;
     }
    
});

// run translate function when translate text button is clicked
translateButton.addEventListener('click', event => {
    translateText();
})

// copy the textarea text when clicking one of the copy icon
function copyToClipBoard(text) {
    if (text) {
        navigator.clipboard.writeText(text);
    }
}
const copyButtons = document.querySelectorAll('.copy');
copyButtons[0].addEventListener('click', event => {
    copyToClipBoard(document.querySelector('.trasnslate-input textarea').value);
});
copyButtons[1].addEventListener('click', event => {
    copyToClipBoard(document.querySelector('.translation textarea').value)
});


// text to speech event 
const formToSpeech = document.querySelector('.from-tospeech');
const translationToSpeech = document.querySelector('.to-tospeech');

formToSpeech.addEventListener('click', event => {
    if (text.value) {
        const utterance = new SpeechSynthesisUtterance(text.value);
        utterance.lang = source.value;
        speechSynthesis.speak(utterance);
    }
});

translationToSpeech.addEventListener('click', event => {
    if (translationText.value) {
        const utterance = new SpeechSynthesisUtterance(translationText.value);
        utterance.lang = target.value;
        speechSynthesis.speak(utterance);
    }
});