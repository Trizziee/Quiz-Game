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
            // World Questions
            {
                question: "Which country is the largest by land area?",
                options: ["Canada", "United States", "Russia", "China"],
                answer: "Russia"
            },
            {
                question: "Which city is known as the 'Big Apple'?",
                options: ["Los Angeles", "New York City", "Chicago", "San Francisco"],
                answer: "New York City"
            },
            {
                question: "Which continent is known as the 'Dark Continent'?",
                options: ["Asia", "Africa", "Europe", "South America"],
                answer: "Africa"
            },
            {
                question: "What is the longest river in the world?",
                options: ["Amazon", "Nile", "Yangtze", "Ganges"],
                answer: "Amazon"
            },
            {
                question: "What is the smallest country in the world?",
                options: ["Monaco", "San Marino", "Vatican City", "Nauru"],
                answer: "Vatican City"
            }
        ],
        medium: [
            // World Questions
            {
                question: "What is the capital of Canada?",
                options: ["Vancouver", "Ottawa", "Toronto", "Montreal"],
                answer: "Ottawa"
            },
            {
                question: "Which country is known as the Land of the Rising Sun?",
                options: ["China", "South Korea", "Japan", "Thailand"],
                answer: "Japan"
            },
            {
                question: "Which country has the most official languages?",
                options: ["India", "Switzerland", "Canada", "South Africa"],
                answer: "South Africa"
            },
            {
                question: "In which country would you find the ancient city of Petra?",
                options: ["Egypt", "Jordan", "Syria", "Lebanon"],
                answer: "Jordan"
            },
            {
                question: "Which ocean is the largest?",
                options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                answer: "Pacific"
            },
            // Universe Questions
            {
                question: "What is the closest planet to the Sun?",
                options: ["Earth", "Mercury", "Venus", "Mars"],
                answer: "Mercury"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Mars", "Earth", "Venus", "Jupiter"],
                answer: "Mars"
            },
            {
                question: "What is the name of our galaxy?",
                options: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"],
                answer: "Milky Way"
            },
            {
                question: "Which planet has the most moons?",
                options: ["Saturn", "Jupiter", "Mars", "Neptune"],
                answer: "Saturn"
            },
            {
                question: "What is the name of the first manned mission to land on the Moon?",
                options: ["Apollo 11", "Gemini 7", "Apollo 13", "Apollo 1"],
                answer: "Apollo 11"
            }
        ],
        hard: [
            // World Questions
            {
                question: "Which is the smallest continent by land area?",
                options: ["Australia", "Europe", "Antarctica", "South America"],
                answer: "Australia"
            },
            {
                question: "What is the longest mountain range in the world?",
                options: ["Rockies", "Himalayas", "Andes", "Alps"],
                answer: "Andes"
            },
            {
                question: "Which country has the most pyramids?",
                options: ["Egypt", "Mexico", "Sudan", "Peru"],
                answer: "Sudan"
            },
            {
                question: "Which country has the most time zones?",
                options: ["Russia", "United States", "China", "France"],
                answer: "Russia"
            },
            {
                question: "In which country would you find the world's tallest waterfall, Angel Falls?",
                options: ["Venezuela", "Brazil", "Colombia", "Guyana"],
                answer: "Venezuela"
            },
            // Universe Questions
            {
                question: "What is the hottest planet in our Solar System?",
                options: ["Venus", "Mercury", "Mars", "Jupiter"],
                answer: "Venus"
            },
            {
                question: "What is the most distant planet from the Sun?",
                options: ["Neptune", "Uranus", "Saturn", "Pluto"],
                answer: "Neptune"
            },
            {
                question: "What is the name of the first artificial Earth satellite?",
                options: ["Sputnik 1", "Apollo 11", "Explorer 1", "Hubble 1"],
                answer: "Sputnik 1"
            },
            {
                question: "How many stars are in the Milky Way galaxy?",
                options: ["100 million", "200 million", "100 billion", "1 trillion"],
                answer: "100 billion"
            },
            {
                question: "Which moon of Saturn is known to have conditions that might support life?",
                options: ["Titan", "Enceladus", "Iapetus", "Rhea"],
                answer: "Enceladus"
            }
        ],
        expert: [
            // World Questions
            {
                question: "Which country is the world's largest producer of oil?",
                options: ["United States", "Saudi Arabia", "Russia", "China"],
                answer: "United States"
            },
            {
                question: "Which country has the longest coastline in the world?",
                options: ["Australia", "Canada", "Russia", "United States"],
                answer: "Canada"
            },
            {
                question: "Which country was the first to grant women the right to vote?",
                options: ["New Zealand", "United States", "United Kingdom", "Australia"],
                answer: "New Zealand"
            },
            {
                question: "Which country is the largest producer of coffee?",
                options: ["Brazil", "Colombia", "Vietnam", "India"],
                answer: "Brazil"
            },
            {
                question: "Which city is known as the 'City of Canals'?",
                options: ["Venice", "Amsterdam", "Stockholm", "Copenhagen"],
                answer: "Venice"
            },
            // Universe Questions
            {
                question: "What is the largest moon of Jupiter?",
                options: ["Europa", "Io", "Callisto", "Ganymede"],
                answer: "Ganymede"
            },
            {
                question: "What is the largest known star in the universe?",
                options: ["VY Canis Majoris", "Betelgeuse", "Antares", "UY Scuti"],
                answer: "UY Scuti"
            },
            {
                question: "What is the name of the closest star to Earth after the Sun?",
                options: ["Alpha Centauri", "Proxima Centauri", "Betelgeuse", "Sirius"],
                answer: "Proxima Centauri"
            },
            {
                question: "What is the largest planet in the Solar System?",
                options: ["Jupiter", "Saturn", "Neptune", "Earth"],
                answer: "Jupiter"
            },
            {
                question: "What is the name of the first black hole discovered?",
                options: ["Cygnus X-1", "Sagittarius A*", "M87", "V404 Cygni"],
                answer: "Cygnus X-1"
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