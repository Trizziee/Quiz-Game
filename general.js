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
                question: "What is the capital city of France?",
                options: ["Paris", "London", "Berlin", "Madrid"],
                answer: "Paris"
            },
            {
                question: "Which animal is known as the 'King of the Jungle'?",
                options: ["Lion", "Elephant", "Tiger", "Giraffe"],
                answer: "Lion"
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                answer: "Pacific"
            },
            {
                question: "How many states are there in the United States?",
                options: ["50", "52", "48", "51"],
                answer: "50"
            },
            {
                question: "Who wrote the play 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Homer"],
                answer: "William Shakespeare"
            }
        ],
        medium: [
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Mars", "Venus", "Jupiter", "Saturn"],
                answer: "Mars"
            },
            {
                question: "What is the tallest mountain in the world?",
                options: ["Mount Everest", "Mount Kilimanjaro", "K2", "Mount Fuji"],
                answer: "Mount Everest"
            },
            {
                question: "Which element has the chemical symbol 'Na'?",
                options: ["Sodium", "Nitrogen", "Neon", "Nickel"],
                answer: "Sodium"
            },
            {
                question: "Which country is known as the Land of the Rising Sun?",
                options: ["China", "South Korea", "Japan", "Thailand"],
                answer: "Japan"
            },
            {
                question: "Who invented the telephone?",
                options: ["Nikola Tesla", "Alexander Graham Bell", "Thomas Edison", "Guglielmo Marconi"],
                answer: "Alexander Graham Bell"
            }
        ],
        hard: [
            {
                question: "Which famous scientist developed the theory of relativity?",
                options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Marie Curie"],
                answer: "Albert Einstein"
            },
            {
                question: "What is the longest river in the world?",
                options: ["Amazon", "Nile", "Yangtze", "Ganges"],
                answer: "Amazon"
            },
            {
                question: "Which planet has the most moons?",
                options: ["Jupiter", "Saturn", "Neptune", "Mars"],
                answer: "Saturn"
            },
            {
                question: "What year did the Titanic sink?",
                options: ["1912", "1905", "1898", "1920"],
                answer: "1912"
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Platinum", "Diamond", "Iron"],
                answer: "Diamond"
            }
        ],
        expert: [
            {
                question: "Who was the first woman to fly solo across the Atlantic Ocean?",
                options: ["Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Ellen Church"],
                answer: "Amelia Earhart"
            },
            {
                question: "What is the capital of Mongolia?",
                options: ["Ulaanbaatar", "Tashkent", "Astana", "Bishkek"],
                answer: "Ulaanbaatar"
            },
            {
                question: "Which element has the atomic number 79?",
                options: ["Gold", "Silver", "Platinum", "Copper"],
                answer: "Gold"
            },
            {
                question: "Who was the first president of the United States?",
                options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "James Madison"],
                answer: "George Washington"
            },
            {
                question: "What is the largest desert in the world?",
                options: ["Sahara", "Arctic", "Gobi", "Kalahari"],
                answer: "Sahara"
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