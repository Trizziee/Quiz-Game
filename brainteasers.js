const questionMarksContainer = document.getElementById('questionMarksContainer');
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E67E22', '#2ECC71'];

function createQuestionMark() {
    const questionMark = document.createElement('div');
    questionMark.classList.add('question-mark');
    questionMark.textContent = '?';
    questionMark.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random position
    questionMark.style.left = Math.random() * 100 + 'vw';
    questionMark.style.top = '100vh'; // Start from the bottom
    
    // Random animation duration
    const duration = Math.random() * 5 + 5; // Between 5s and 10s
    questionMark.style.transition = `transform ${duration}s linear`;
    
    // Append to container
    questionMarksContainer.appendChild(questionMark);
    
    // Trigger the animation
    setTimeout(() => {
        questionMark.style.transform = `translateY(-100vh)`; // Move up
    }, 10);
    
    // Remove question mark after animation
    questionMark.addEventListener('transitionend', () => {
        questionMarksContainer.removeChild(questionMark);
    });
}

// Create question marks at intervals
setInterval(createQuestionMark, 500); // Create a new question mark every 500ms

let currentLevel = "";
let currentQuestionIndex = 0;
let score = 0; // Track the score
let answered = false; // Ensure a question is answered before proceeding
let timer;
let timeLeft = 30;

const questions = {
  
    easy: [
      {
        question: "What has to be broken before you can use it?",
        options: ["Glass", "Egg", "Key", "Seed"],
        answer: "Egg"
      },
      {
        question: "What gets wetter the more it dries?",
        options: ["A sponge", "A towel", "A cloud", "Rain"],
        answer: "A towel"
      },
      {
        question: "What can travel around the world while staying in the same spot?",
        options: ["A plane", "A globe", "A stamp", "A satellite"],
        answer: "A stamp"
      },
      {
        question: "What has one eye but can't see?",
        options: ["A storm", "A needle", "A cyclone", "A pin"],
        answer: "A needle"
      },
      {
        question: "What has many keys but can't open a single lock?",
        options: ["A piano", "A keyboard", "A map", "A lockpick"],
        answer: "A piano"
      }
    ],
    medium: [
      {
        question: "What can fill a room but takes up no space?",
        options: ["Air", "Light", "Sound", "Heat"],
        answer: "Light"
      },
      {
        question: "The more of this you take, the more you leave behind. What is it?",
        options: ["Steps", "Time", "Memories", "Footsteps"],
        answer: "Footsteps"
      },
      {
        question: "What has a head, a tail, is brown, and has no legs?",
        options: ["A snake", "A coin", "A spoon", "A fish"],
        answer: "A coin"
      },
      {
        question: "What has hands but can’t clap?",
        options: ["A robot", "A statue", "A clock", "A shadow"],
        answer: "A clock"
      },
      {
        question: "I’m tall when I’m young, and I’m short when I’m old. What am I?",
        options: ["A tree", "A pencil", "A candle", "A shadow"],
        answer: "A candle"
      }
    ],
    hard: [
      {
        question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        options: ["The letter M", "Time", "A blink", "A moment"],
        answer: "The letter M"
      },
      {
        question: "What has roots as nobody sees, is taller than trees, up, up it goes, and yet it never grows?",
        options: ["A mountain", "A skyscraper", "A cloud", "A shadow"],
        answer: "A mountain"
      },
      {
        question: "What can you hold in your left hand but not in your right?",
        options: ["Your right hand", "A pen", "A glove", "Your left thumb"],
        answer: "Your right hand"
      },
      {
        question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?",
        options: ["A globe", "A map", "A video game", "A dream"],
        answer: "A map"
      },
      {
        question: "What has four wheels and flies?",
        options: ["A plane", "A garbage truck", "A helicopter", "A car"],
        answer: "A garbage truck"
      }
    ],
    expert: [
      {
        question: "I have keys but no locks. I have space but no room. You can enter but you can't go outside. What am I?",
        options: ["A keyboard", "A vault", "A spaceship", "A computer"],
        answer: "A keyboard"
      },
      {
        question: "The person who makes it, sells it. The person who buys it, never uses it. The person who uses it, never knows they're using it. What is it?",
        options: ["A coffin", "A mask", "A blanket", "A potion"],
        answer: "A coffin"
      },
      {
        question: "What has no beginning, middle, or end?",
        options: ["A loop", "A circle", "A shadow", "A spiral"],
        answer: "A circle"
      },
      {
        question: "What can run but never walks, has a bed but never sleeps, and has a mouth but never talks?",
        options: ["A stream", "A river", "A road", "A shadow"],
        answer: "A river"
      },
      {
        question: "What is so fragile that saying its name breaks it?",
        options: ["Glass", "Silence", "A promise", "A heart"],
        answer: "Silence"
      }
    ]
  };


  function selectLevel(level) {
    if (!questions[level]) {
        console.error(`Level ${level} is not defined!`);
        return;
    }

    // Shuffle questions and choices
    questions[level] = shuffleArray(questions[level]);
    questions[level].forEach((question) => {
        question.options = shuffleArray(question.options);
    });

    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0; // Reset score for the level
    answered = false; // Reset answered state
    document.getElementById("level-selection").style.display = "none";
    document.getElementById("question-section").style.display = "block";
    document.getElementById("score-display").textContent = `Score: ${score}`; // Reset score display
    displayQuestion();
}

function displayQuestion() {
  clearInterval(timer); // Clear previous timer
  timeLeft = 30; // Reset timer
  startTimer();

  const question = questions[currentLevel][currentQuestionIndex];
  if (!question) {
      endLevel(); // Show final score if no more questions
      return;
  }

  document.getElementById("question-text").textContent = question.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = ""; // Clear previous options
  question.options.forEach((option) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = option;
      optionButton.onclick = function () {
          selectedOption = option; // Store the selected option
          // Highlight selected option (optional for better UX)
          const optionButtons = optionsContainer.querySelectorAll("button");
          optionButtons.forEach(button => button.classList.remove("selected"));
          optionButton.classList.add("selected");
      };
      optionsContainer.appendChild(optionButton);
  });

  document.getElementById("progress").textContent = `Progress: ${currentQuestionIndex + 1}/5`;
  document.getElementById("feedback").textContent = ""; // Clear previous feedback
  document.getElementById("next-button").style.display = "none"; // Hide next button initially
  document.getElementById("submit-button").style.display = "block"; // Show submit button
  answered = false; // Reset answered state
}

function startTimer() {
  document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

      if (timeLeft <= 0) {
          clearInterval(timer);
          if (!answered && selectedOption === null) {
              checkAnswer(null); // Auto-check with no answer if time runs out
          }
      }
  }, 1000);
}

function checkAnswer() {
  if (answered) return; // Prevent multiple submissions

  clearInterval(timer); // Stop timer when answer is submitted or time runs out

  const correctAnswer = questions[currentLevel][currentQuestionIndex].answer;
  const feedbackElement = document.getElementById("feedback");

  // Provide feedback based on the selected option
  if (selectedOption === correctAnswer) {
      feedbackElement.textContent = "Correct!";
      feedbackElement.style.color = "green";
      score++; // Increase score for correct answer
  } else if (selectedOption === null) {
      feedbackElement.textContent = `Time's up! The correct answer is: ${correctAnswer}`;
      feedbackElement.style.color = "orange";
  } else {
      feedbackElement.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
      feedbackElement.style.color = "red";
  }

  // Update score display
  document.getElementById("score-display").textContent = `Score: ${score}`;

  // After showing feedback, mark the question as answered
  answered = true;

  // Hide submit button (we don't need it now)
  document.getElementById("submit-button").style.display = "none"; // Hide submit button
  document.getElementById("next-button").style.display = "block"; // Show next button
}

function nextQuestion() {
  if (!answered) return; // Prevent skipping without answering

  // Proceed to next question
  currentQuestionIndex++;

  // If there are more questions, display the next one; otherwise, end the level
  if (currentQuestionIndex < 5) {
      displayQuestion();
  } else {
      endLevel();
  }
}

function endLevel() {
  clearInterval(timer); // Clear the timer
  document.getElementById("question-section").style.display = "none";
  document.getElementById("level-selection").style.display = "block";

  const scoreBoard = document.getElementById("final-score");
  const feedbackElement = document.getElementById("feedback");

  // Display the score
  scoreBoard.textContent = `You completed the level! Final Score: ${score}/5`;
  scoreBoard.style.display = "block";

  // Provide feedback based on the score
  if (score === 5) {
      feedbackElement.textContent = "Excellent! You got a perfect score!";
      feedbackElement.style.color = "green";
  } else if (score >= 3) {
      feedbackElement.textContent = "Good job! You did well!";
      feedbackElement.style.color = "blue";
  } else {
      feedbackElement.textContent = "Better luck next time!";
      feedbackElement.style.color = "red";
  }

  feedbackElement.style.display = "block"; // Make feedback visible
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}