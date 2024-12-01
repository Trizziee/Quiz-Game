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
            // Mythology Questions
            {
                question: "Who was the king of the Greek gods?",
                options: ["Zeus", "Apollo", "Hera", "Poseidon"],
                answer: "Zeus"
            },
            {
                question: "In Norse mythology, who is the god of thunder?",
                options: ["Odin", "Loki", "Thor", "Freyr"],
                answer: "Thor"
            },
            {
                question: "Which Greek goddess is known as the goddess of love?",
                options: ["Athena", "Hera", "Artemis", "Aphrodite"],
                answer: "Aphrodite"
            },
            {
                question: "Who is the Egyptian god of the sun?",
                options: ["Ra", "Osiris", "Horus", "Anubis"],
                answer: "Ra"
            },
            {
                question: "In Greek mythology, who was turned into a spider?",
                options: ["Medusa", "Arachne", "Persephone", "Hera"],
                answer: "Arachne"
            }
        ],
        medium: [
            // Mythology Questions
            {
                question: "Which Norse god is associated with wisdom and war?",
                options: ["Odin", "Thor", "Loki", "Balder"],
                answer: "Odin"
            },
            {
                question: "In Roman mythology, who is the god of war?",
                options: ["Mars", "Jupiter", "Venus", "Neptune"],
                answer: "Mars"
            },
            {
                question: "Who was the mother of the Greek hero Hercules?",
                options: ["Hera", "Aphrodite", "Alcmene", "Demeter"],
                answer: "Alcmene"
            },
            {
                question: "Which Roman goddess was the counterpart of the Greek goddess Artemis?",
                options: ["Juno", "Venus", "Diana", "Minerva"],
                answer: "Diana"
            },
            {
                question: "Which Greek titan was punished by Zeus to hold up the sky?",
                options: ["Prometheus", "Atlas", "Cronus", "Epimetheus"],
                answer: "Atlas"
            },
            // Mythology Questions
            {
                question: "In Hindu mythology, who is the god of destruction?",
                options: ["Vishnu", "Shiva", "Brahma", "Indra"],
                answer: "Shiva"
            },
            {
                question: "Which creature in Greek mythology has the head of a lion, body of a goat, and tail of a serpent?",
                options: ["Hydra", "Chimera", "Cerberus", "Minotaur"],
                answer: "Chimera"
            },
            {
                question: "In Egyptian mythology, who is the god of the underworld?",
                options: ["Osiris", "Anubis", "Ra", "Horus"],
                answer: "Osiris"
            },
            {
                question: "Who is the Roman goddess of love and beauty?",
                options: ["Minerva", "Juno", "Venus", "Diana"],
                answer: "Venus"
            },
            {
                question: "In Greek mythology, who was cursed to turn everything she touched into gold?",
                options: ["Medusa", "Pandora", "Midas", "Echidna"],
                answer: "Midas"
            }
        ],
        hard: [
            // Mythology Questions
            {
                question: "Who was the father of the Greek hero Achilles?",
                options: ["Zeus", "Poseidon", "Hades", "Peleus"],
                answer: "Peleus"
            },
            {
                question: "In Norse mythology, what is the name of the wolf that is fated to kill Odin during Ragnarök?",
                options: ["Fenrir", "Skoll", "Jörmungandr", "Narfi"],
                answer: "Fenrir"
            },
            {
                question: "Which goddess was the wife of Hephaestus in Greek mythology?",
                options: ["Athena", "Hera", "Aphrodite", "Artemis"],
                answer: "Aphrodite"
            },
            {
                question: "Who was the Greek god of wine and revelry?",
                options: ["Apollo", "Dionysus", "Hermes", "Hades"],
                answer: "Dionysus"
            },
            {
                question: "In Hindu mythology, who is the goddess of wealth and prosperity?",
                options: ["Lakshmi", "Saraswati", "Parvati", "Durga"],
                answer: "Lakshmi"
            },
            // Mythology Questions
            {
                question: "Which god in Greek mythology is known as the messenger of the gods?",
                options: ["Hermes", "Apollo", "Ares", "Zeus"],
                answer: "Hermes"
            },
            {
                question: "What is the name of the three-headed dog that guards the underworld in Greek mythology?",
                options: ["Cerberus", "Chimera", "Hecatoncheires", "Sphinx"],
                answer: "Cerberus"
            },
            {
                question: "Who was the Greek god of the sea?",
                options: ["Hades", "Zeus", "Apollo", "Poseidon"],
                answer: "Poseidon"
            },
            {
                question: "In Egyptian mythology, who is the goddess of love and motherhood?",
                options: ["Horus", "Isis", "Bastet", "Sekhmet"],
                answer: "Isis"
            },
            {
                question: "Which goddess in Roman mythology was considered the goddess of wisdom and strategy?",
                options: ["Minerva", "Vesta", "Juno", "Diana"],
                answer: "Minerva"
            }
        ],
        expert: [
            // Mythology Questions
            {
                question: "In which culture is the figure of Quetzalcoatl a prominent deity?",
                options: ["Aztec", "Inca", "Mayan", "Olmec"],
                answer: "Aztec"
            },
            {
                question: "Which Greek titan was condemned to hold up the heavens rather than the earth?",
                options: ["Prometheus", "Atlas", "Cronus", "Epimetheus"],
                answer: "Atlas"
            },
            {
                question: "Which god in Hindu mythology is known for his blue skin?",
                options: ["Krishna", "Shiva", "Vishnu", "Brahma"],
                answer: "Krishna"
            },
            {
                question: "Who is the goddess of the hunt in Greek mythology?",
                options: ["Artemis", "Athena", "Hera", "Persephone"],
                answer: "Artemis"
            },
            {
                question: "In Norse mythology, what is the name of the tree that connects the nine worlds?",
                options: ["Yggdrasil", "Frigg", "Asgard", "Jörmungandr"],
                answer: "Yggdrasil"
            },
            // Mythology Questions
            {
                question: "Who was the hero that performed twelve labors in Greek mythology?",
                options: ["Hercules", "Perseus", "Theseus", "Achilles"],
                answer: "Hercules"
            },
            {
                question: "Which Greek hero fought and defeated the Minotaur?",
                options: ["Perseus", "Theseus", "Hercules", "Achilles"],
                answer: "Theseus"
            },
            {
                question: "In Egyptian mythology, who is the god of knowledge and writing?",
                options: ["Thoth", "Osiris", "Ra", "Horus"],
                answer: "Thoth"
            },
            {
                question: "Who was the mother of the Norse gods, and wife of Odin?",
                options: ["Frigg", "Hel", "Loki's mother", "Sif"],
                answer: "Frigg"
            },
            {
                question: "Which Roman emperor was famously deified and was believed to be the son of the god Apollo?",
                options: ["Julius Caesar", "Augustus", "Nero", "Tiberius"],
                answer: "Augustus"
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