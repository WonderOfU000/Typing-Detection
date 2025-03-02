const textToType = document.getElementById('text-to-type');
const userInput = document.getElementById('user-input');
const wpmValue = document.getElementById('wpm-value');
const accuracyValue = document.getElementById('accuracy-value');
const resultsContainer = document.getElementById('results-container');
const restartButton = document.getElementById('restart-button');
const nextButton = document.getElementById('next-button');
const menuButton = document.getElementById('menu-button');
const menuContent = document.getElementById('menu-content');
const easyMode = document.getElementById('easy-mode');
const mediumMode = document.getElementById('medium-mode');
const hardMode = document.getElementById('hard-mode');
const timeDisplay = document.getElementById('time-display');
const progressBar = document.getElementById('progress-bar');
const milestone50 = document.getElementById('milestone-50');

const sampleTexts = {
    easy: [
        "The quick brown fox jumps over the lazy dog with a swift leap across the grassy field.",
        "Pack my box with five dozen liquor jugs, then place them carefully on the shelf by the door.",
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood and not tire?",
        "Silly Sally swiftly shooed seven silly sheep through the field, making sure none got lost or strayed."
    ],
    medium: [
        "How razorback-jumping frogs can level six piqued gymnasts with incredible skill and precision, especially when they need to land on the highest platforms.",
        "Amazingly few discotheques provide jukeboxes that play all the songs you love and cherish, bringing back memories of past dances and music-filled nights.",
        "Zany yellow jackets waxed a big jeep for kids quickly, driving down a winding road where the trees seemed to whisper secrets of the past.",
        "Two lazy dogs slept soundly under the big tree near the fence, basking in the warm sunlight while birds chirped softly above them in the branches.",
        "The weather today is cold, but the sun is shining brightly, making it an unusual sight for the time of year, as the frost melts away slowly.",
        "A sharp wind blew through the forest, causing the leaves to scatter everywhere as the storm approached, darkening the sky and bringing with it an eerie stillness in the air that was felt deep in the bones.",
        "The giant mountain loomed in the distance, its peak hidden in the misty clouds that hung ominously above, as if concealing secrets that only the bravest adventurers dared to uncover with each passing day and daring step.",
        "The city streets were bustling with life, yet a sense of mystery hung in the air as if everyone had a secret, and every corner held an untold story waiting to unfold, just beyond the reach of ordinary eyes and inquisitive minds.",
        "The old library stood at the edge of the town, its ancient oak doors creaking open as the wind howled through the empty halls, a silent witness to the countless stories that had been read and forgotten within its walls over the years, waiting for the next curious visitor.",
        "After hours of driving through the barren desert, the group finally stumbled upon a small oasis, where the shimmering water provided a fleeting glimpse of hope before the relentless heat of the sun took over once more, overwhelming their senses with its intensity and leaving them longing for relief."
    ],
    hard: [
        "Jovial jock drives big Ford quiz taxi, as the crowd watches in admiration and awe, cheering loudly from the sidelines while he speeds through the streets.",
        "Grumpy wizards make toxic brew for the evil Queen and Jack, who seek vengeance on the one who betrayed them long ago under the light of the full moon.",
        "Twelve crazy zebras fought a big monster with ferocity and zeal, without hesitation, running and leaping with determination, ready to defend their home at any cost.",
        "The six slippery snails slid swiftly southward while staying in formation, moving with precision as the thick fog began to roll in, cloaking the path ahead.",
        "Under the blazing sun, fourteen hefty foxes swiftly jumped over high fences, their tails trailing behind like comets in the night sky, as the cool breeze from the distant mountains filled the air.",
        "The majestic eagle soared high above the rugged cliffs, casting a shadow over the vast, desolate desert below as the winds howled through the canyon like wolves on a hunt, echoing off the walls of the canyon as if calling to one another.",
        "In the darkened alleyways, a group of mysterious figures huddled around a glowing map, plotting their next great adventure in an ancient, forgotten city that had been lost for centuries, its secrets buried beneath layers of time.",
        "The ancient city was abandoned centuries ago, its towering stone walls now crumbled into ruins, covered by an overgrowth of vines and moss, yet its stories remained hidden deep within the earth, waiting to be uncovered by the bravest of explorers with a thirst for discovery and a will to conquer the unknown.",
        "A massive storm surged through the open ocean, its monstrous waves crashing against the sides of the ship as the crew scrambled to secure the rigging, knowing that they had only moments before the tempest would swallow them whole, leaving no trace behind in the vast, unforgiving waters of the sea, where no man had ever sailed before.",
        "The sprawling, futuristic metropolis glittered under the neon lights, its towering skyscrapers reaching into the sky like silver fingers, while the streets below bustled with a frenetic energy, as people from all walks of life hurried through the maze of interconnected alleys, each corner holding a new mystery or adventure to uncover that could change the future forever."
    ]
};

let difficulty = 'easy';  // Set default difficulty to easy
let startTime;
let timer;
let timerInterval;
let typingStarted = false;

menuButton.addEventListener('click', () => {
    menuContent.classList.toggle('hidden');
});

easyMode.addEventListener('click', () => {
    setDifficulty('easy');
    startTest();
});

mediumMode.addEventListener('click', () => {
    setDifficulty('medium');
    startTest();
});

hardMode.addEventListener('click', () => {
    setDifficulty('hard');
    startTest();
});

function setDifficulty(level) {
    difficulty = level;
    const randomText = sampleTexts[difficulty][Math.floor(Math.random() * sampleTexts[difficulty].length)];
    textToType.textContent = randomText;
}

function startTest() {
    userInput.value = '';
    userInput.disabled = false;
    userInput.focus();
    clearInterval(timer);
    clearInterval(timerInterval);
    typingStarted = false;
    timeDisplay.textContent = "00:00";
    updateProgressBar(0);
}

function startTimer() {
    let seconds = 0;
    let minutes = 0;

    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function updateWPM() {
    const elapsedTime = (new Date() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = userInput.value.trim().split(/\s+/).length;
    const wpm = (wordsTyped / elapsedTime).toFixed(2);
    wpmValue.textContent = wpm;
}

function endTest() {
    clearInterval(timer);
    clearInterval(timerInterval);
    userInput.disabled = true;
    const accuracy = calculateAccuracy();
    accuracyValue.textContent = accuracy + '%';
    showMisspelledWords();
    gsap.to(resultsContainer, { duration: 0.5, opacity: 1, display: 'block' });
}

function calculateAccuracy() {
    const typedText = userInput.value.trim().split(/\s+/);
    const originalText = textToType.textContent.trim().split(/\s+/);
    const correctWords = typedText.filter((word, idx) => word === originalText[idx]).length;
    return ((correctWords / originalText.length) * 100).toFixed(2);
}

function showMisspelledWords() {
    const typedText = userInput.value.trim().split(/\s+/);
    const originalText = textToType.textContent.trim().split(/\s+/);
    textToType.innerHTML = originalText.map((word, idx) => {
        if (word !== typedText[idx]) {
            return `<span class="misspelled">${word}</span>`;
        }
        return word;
    }).join(' ');
}

function updateProgressBar(progress) {
    progressBar.style.width = `${progress}%`;

    if (progress >= 50) {
        milestone50.classList.remove('hidden');
    } else {
        milestone50.classList.add('hidden');
    }
}

userInput.addEventListener('input', (e) => {
    if (!typingStarted) {
        startTime = new Date();
        typingStarted = true;
        timer = setInterval(updateWPM, 1000);
        startTimer();
    }
    const typedLength = userInput.value.length;
    const totalLength = textToType.textContent.length;
    const progress = (typedLength / totalLength) * 100;
    updateProgressBar(progress);

    if (e.inputType === 'insertText' && (e.data === '.' || e.data === '!' || e.data === '?')) {
        endTest();
    }
});

document.addEventListener('keydown', (e) => {
    const key = document.createElement('div');
    key.textContent = e.key.toUpperCase();
    key.className = 'key-press';
    key.style.left = `${e.clientX}px`;
    key.style.top = `${e.clientY}px`;
    document.body.appendChild(key);

    gsap.to(key, { duration: 1, y: -100, opacity: 0, onComplete: () => key.remove() });

    if (e.key === 'Enter') {
        endTest();
    }
});

// Add touch-based support for typing
userInput.addEventListener('touchstart', (e) => {
    if (!typingStarted) {
        startTime = new Date();
        typingStarted = true;
        timer = setInterval(updateWPM, 1000);
        startTimer();
    }
});

restartButton.addEventListener('click', () => {
    gsap.to(resultsContainer, { duration: 0.5, opacity: 0, display: 'none' });
    startTest();
});

nextButton.addEventListener('click', () => {
    gsap.to(resultsContainer, { duration: 0.5, opacity: 0, display: 'none' });
    moveToNextSentence();
    startTest();
});

function moveToNextSentence() {
    const randomText = sampleTexts[difficulty][Math.floor(Math.random() * sampleTexts[difficulty].length)];
    textToType.textContent = randomText;
}

document.addEventListener('DOMContentLoaded', () => {
    setDifficulty('easy');  // Set default difficulty to easy
    startTest();
});
