// Initialize SpeechRecognition object
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

// Variables for text area and buttons
const inputText = document.getElementById('input-text');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const editBtn = document.getElementById('edit-btn');
const languageSelect = document.getElementById('language-select');
const copyBtn = document.getElementById('copy-btn');
const recognizedText = document.getElementById('recognized-text');
const translatedText = document.getElementById('translated-text');
const recognizedTextContainer = document.getElementById('recognized-text-container');
const speechLanguageSelect = document.getElementById('speech-language-select');

// Function to set language based on selection
function setLanguage(languageCode) {
    recognition.lang = languageCode;
}

// Language select change event
languageSelect.addEventListener('change', () => {
    setLanguage(languageSelect.value);
});

// Start button click event
startBtn.addEventListener('click', () => {
    recognition.start();
});

// Stop button click event
stopBtn.addEventListener('click', () => {
    recognition.stop();
});

// Edit button click event
editBtn.addEventListener('click', () => {
    inputText.removeAttribute('readonly'); // Allow user to edit text
    inputText.focus(); // Set focus on the text area
});

// Copy button click event
copyBtn.addEventListener('click', () => {
    inputText.select();
    document.execCommand('copy');
});

// Speech recognition result event
recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    recognizedText.textContent = transcript;
    if (transcript.trim() !== '') {
        recognizedTextContainer.style.display = 'block';
        translateText(transcript, languageSelect.value); // Use selected language for translation
    } else {
        recognizedTextContainer.style.display = 'none';
        translatedText.textContent = '';
    }
};

// Function to translate text
function translateText(text, targetLang) {
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURI(text)}`)
        .then(response => response.json())
        .then(data => {
            const translated = data[0][0][0];
            translatedText.textContent = translated;
            inputText.value += translated + ' ';
        })
        .catch(error => {
            console.error('Translation error:', error);
        });
}

// Speech recognition error event
recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

// Speech language select change event
speechLanguageSelect.addEventListener('change', () => {
    const selectedSpeechLanguage = speechLanguageSelect.value;
    setLanguage(selectedSpeechLanguage);
});

