// ==========================================
// QUIZ DATA
// ==========================================
const questions = [
    {
        question: "Why do people open the fridge repeatedly?", 
        answers: [
            {text: "To cool the kitchen", correct: false},
            {text: "To burn calories", correct: false},
            {text: "To check the light", correct: false},
            {text: "To check if food magically appeared", correct: true}
        ],
        correctFeedback: "Correct! You understand the ancient ritual of fridge-checking 🎯",
        wrongFeedback: "Wrong! But we admire your creative refrigerator theories 😅",
        backgroundColor: "#FFE5E5"
    },
    {
         question: "What is the most common reaction after sending a risky text?", 
        answers: [
            {text: "Celebration", correct: false},
            {text: "Instant regret", correct: true},
            {text: "Turning off the phone", correct: false},
            {text: "Forgetting it existed", correct: false}
        ],
        correctFeedback: "Correct! You've clearly experienced the instant regret phenomenon 📱",
        wrongFeedback: "Wrong! You're either brave or in denial 🙈",
        backgroundColor: "#E5F3FF"
    },
    {
        question: "Which button fixes most tech problems?", 
        answers: [
            {text: "Delete", correct: false},
            {text: "Power off forever", correct: false},
            {text: "Restart", correct: true},
            {text: "Volume up", correct: false}
        ],
        correctFeedback: "Correct! You're basically an IT professional now 💻",
        wrongFeedback: "Wrong! Have you tried turning it off and on again? 🔄",
        backgroundColor: "#E5FFE5"
    },
    {
        question: "What do people say when they do not understand anything?", 
        answers: [
            {text: "Explain again", correct: false},
            {text: "I am confused", correct: false},
            {text: "Yeah yeah", correct: true},
            {text: "Can you slow down", correct: false}
        ],
        correctFeedback: "Correct! You're suspiciously good at pretending to understand 😏",
        wrongFeedback: "Wrong! You must be the honest one in your friend group 🤔",
        backgroundColor: "#FFF5E5"
    },
    {
        question: "What disappears faster than motivation?", 
        answers: [
            {text: "Sleep", correct: false},
            {text: "Money", correct: false},
            {text: "Weekend time", correct: true},
            {text: "Phone battery", correct: false}
        ],
        correctFeedback: "Correct! Sunday evenings hit different, don't they? ⏰",
        wrongFeedback: "Wrong! But we feel you on the phone battery struggle 🔋",
        backgroundColor: "#F5E5FF"
    }
];

// ==========================================
// DOM ELEMENTS
// ==========================================
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// ==========================================
// STATE VARIABLES
// ==========================================
let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let userAnswers = [];
let darkMode = false;

// ==========================================
// QUIZ FLOW FUNCTIONS
// ==========================================

// Initialize quiz and reset all state
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    userAnswers = [];
    
    nextButton.innerHTML = "Next";
    nextButton.style.display = "none";
    
    document.getElementById('total-questions').textContent = questions.length;
    showQuestion();
}

// Display current question and generate answer buttons
function showQuestion() {
    resetState();
    
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
    document.body.style.backgroundColor = currentQuestion.backgroundColor;
    
    updateProgressBar();
    
    // Generate answer buttons dynamically
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        
        button.addEventListener("click", selectAnswer);
    });
}

// Handle answer selection and update game state
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    // Store answer for AI analysis
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedText: selectedBtn.innerHTML,
        correct: isCorrect
    });
    
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
        streak++;
        
        if (streak > maxStreak) {
            maxStreak = streak;
        }
        
        // Trigger confetti for streaks of 2+
        if (streak >= 2) {
            createConfetti();
        }
        
        updateStreakDisplay();
    } else {
        selectedBtn.classList.add("incorrect");
        streak = 0;
        updateStreakDisplay();
    }
    
    // Disable all buttons and show correct answer
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    
    showFeedback(isCorrect);
    nextButton.style.display = "block";
}

// Move to next question or show final results
function handleNextButton() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

// Clean up previous question elements
function resetState() {
    nextButton.style.display = "none";
    
    // Remove all answer buttons
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    
    // Remove previous feedback, buttons, and notifications
    const elementsToRemove = ['.feedback', '.challenge-btn', '.ai-roast-box', '.copy-notification'];
    elementsToRemove.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.remove();
    });
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

// Update progress bar width and question counter
function updateProgressBar() {
    document.getElementById('current-question-num').textContent = currentQuestionIndex + 1;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

// Show or hide streak counter
function updateStreakDisplay() {
    const streakDisplay = document.getElementById('streak-display');
    const streakCount = document.getElementById('streak-count');
    
    if (streak >= 2) {
        streakDisplay.style.display = 'block';
        streakCount.textContent = streak;
    } else {
        streakDisplay.style.display = 'none';
    }
}

// Display feedback message after answer selection
function showFeedback(isCorrect) {
    const currentQuestion = questions[currentQuestionIndex];
    const feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback");
    
    if (isCorrect) {
        feedbackDiv.classList.add("correct-feedback");
        feedbackDiv.innerHTML = currentQuestion.correctFeedback;
    } else {
        feedbackDiv.classList.add("wrong-feedback");
        feedbackDiv.innerHTML = currentQuestion.wrongFeedback;
    }
    
    answerButtons.parentNode.insertBefore(feedbackDiv, nextButton);
}

// ==========================================
// VISUAL EFFECTS
// ==========================================

// Generate falling confetti animation
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Toggle between light and dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.sun-icon').style.display = 'none';
        document.querySelector('.moon-icon').style.display = 'block';
    } else {
        document.body.classList.remove('dark-mode');
        document.querySelector('.sun-icon').style.display = 'block';
        document.querySelector('.moon-icon').style.display = 'none';
    }
}

// ==========================================
// RESULTS SCREEN
// ==========================================

// Display final score and generate personalized title
function showScore() {
    resetState();
    
    document.body.style.backgroundColor = darkMode ? '#1a1a2e' : '#f0f0f0';
    document.getElementById('streak-display').style.display = 'none';
    
    const scoreTitle = getScoreTitle(score);
    
    questionElement.innerHTML = `
        <div class="result-title">${scoreTitle}</div>
        <p style="font-size: 24px; margin: 20px 0;">You scored ${score} out of ${questions.length}!</p>
        ${maxStreak > 1 ? `<p style="font-size: 18px; color: #ff6b35;">🔥 Best Streak: ${maxStreak}</p>` : ''}
    `;
    
    generateAIRoast();
    
    // Create share button
    const challengeBtn = document.createElement("button");
    challengeBtn.innerHTML = "🔗 Challenge a Friend";
    challengeBtn.classList.add("challenge-btn");
    challengeBtn.addEventListener("click", copyQuizLink);
    nextButton.parentNode.insertBefore(challengeBtn, nextButton);
    
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

// Return personalized title based on score
function getScoreTitle(finalScore) {
    const titles = {
        0: "🤖 Digital Alien - You might be from another planet!",
        1: "👽 Barely Human - Are you sure you're not a bot?",
        2: "🤔 Almost Human - You're getting there... maybe",
        3: "😊 Pretty Human - Not bad, fellow earthling!",
        4: "🎉 Certified Human™ - Welcome to the club!",
        5: "👑 Supreme Human - You've achieved peak humanity!"
    };
    
    return titles[finalScore] || titles[5];
}

// ==========================================
// AI-STYLE ROAST FEATURE
// ==========================================

async function generateAIRoast() {
    const aiRoastBox = document.createElement("div");
    aiRoastBox.classList.add("ai-roast-box");
    aiRoastBox.innerHTML = `
        <h3>🤖 AI-Style Verdict:</h3>
        <p class="ai-roast-text">
            <span class="loading-spinner"></span> Analyzing your choices...
        </p>
    `;
    
    nextButton.parentNode.insertBefore(aiRoastBox, nextButton);
    
    // Simulate loading delay 
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate roast based on score and wrong answers
    let roastText = "";
    
    const wrongAnswers = userAnswers.filter(ans => !ans.correct);
    
    if (score === 0) {
        roastText = "Zero out of five? Wow. I've seen captcha tests with better human detection skills. But hey, at least you're consistently... not human? 🤖";
    } else if (score === 1) {
        roastText = "One correct answer. Either you got incredibly lucky or you briefly channeled actual human behavior. Don't let it happen again. 👽";
    } else if (score === 2) {
        roastText = "Two out of five. You're like a coin flip, except the coin is confused about basic human behavior. Progress, I guess? 🤔";
    } else if (score === 3) {
        const wrongQ = questions[wrongAnswers[0]?.questionIndex]?.question;
        roastText = `Three out of five - not bad! Though getting "${wrongQ}" wrong is... interesting. Do you even interact with humans? 😊`;
    } else if (score === 4) {
        const wrongQ = questions[wrongAnswers[0]?.questionIndex]?.question;
        roastText = `Four out of five! So close to perfection. But that one wrong answer about "${wrongQ}"? That's going to keep you up tonight, isn't it? 🎉`;
    } else {
        roastText = "Perfect score! You're either genuinely human or an AI that's gotten TOO good at pretending. Either way, I'm impressed... and slightly concerned. 👑";
    }
    
    aiRoastBox.querySelector('.ai-roast-text').innerHTML = roastText;
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================

// Copy quiz link to clipboard
function copyQuizLink() {
    const quizLink = window.location.href;
    
    navigator.clipboard.writeText(quizLink).then(() => {
        const notification = document.createElement("div");
        notification.classList.add("copy-notification");
        notification.innerHTML = "✅ Link copied! Share it with your friends!";
        
        const challengeBtn = document.querySelector(".challenge-btn");
        challengeBtn.parentNode.insertBefore(notification, challengeBtn.nextSibling);
        
        setTimeout(() => notification.remove(), 2000);
    }).catch(err => {
        alert("Failed to copy. Link: " + quizLink);
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Next button handler
nextButton.addEventListener("click", () => {
    if (nextButton.innerHTML === "Play Again") {
        startQuiz();
    } else {
        handleNextButton();
    }
});

// Dark mode toggle handler
darkModeToggle.addEventListener("click", toggleDarkMode);

// ==========================================
// INITIALIZE
// ==========================================
startQuiz();