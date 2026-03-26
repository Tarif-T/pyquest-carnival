const levels = [
  {
    type: "mcq",
    title: "Balloon Booth: Variables",
    story: "A robot asks your name and shouts it on a balloon. Which line stores the name?",
    code: "name = \"Kai\"\nprint(name)",
    options: ["print(name)", "name = \"Kai\"", "if name == \"Kai\""],
    answer: 1,
    badge: "Variable Starter",
    hints: {
      kids: "Look for the line that puts a word into a labeled box.",
      adult: "Assignment binds a value to an identifier before reuse."
    },
    explain: "In Python, `=` stores a value in a variable name."
  },
  {
    type: "output",
    title: "Mirror Maze: Print Output",
    story: "A mirror only opens if you predict the output correctly.",
    code: "x = 4\ny = 3\nprint(x + y)",
    answerText: "7",
    badge: "Output Oracle",
    hints: {
      kids: "Add the two numbers and write only the final result.",
      adult: "Evaluate arithmetic expression in `print` after assignments."
    },
    explain: "The expression `x + y` becomes `4 + 3`, so it prints `7`."
  },
  {
    type: "fix",
    title: "Bug Bash: Missing Colon",
    story: "The carnival gate is broken. Pick the best code fix.",
    code: "age = 12\nif age > 10\n    print(\"Ride unlocked\")",
    options: [
      "if age > 10:",
      "if age > 10 then",
      "if (age > 10)"
    ],
    answer: 0,
    badge: "Debug Detective",
    hints: {
      kids: "Python likes a tiny two-dot smiley at the end of `if` lines.",
      adult: "Compound statements require a trailing colon before block indentation."
    },
    explain: "`if` statements in Python must end with a colon.",
  },
  {
    type: "arrange",
    title: "Token Tumbler: Build a Loop",
    story: "Build a loop spell to print numbers 1 to 3.",
    tokens: ["for", "i", "in", "range(1, 4):"],
    answerTokens: ["for", "i", "in", "range(1, 4):"],
    badge: "Loop Launcher",
    hints: {
      kids: "A loop sentence starts with `for` and ends with the `range(...)` part.",
      adult: "Use canonical `for i in range(start, stop):` form."
    },
    explain: "`range(1, 4)` gives 1, 2, 3."
  },
  {
    type: "mcq",
    title: "Function Fountain",
    story: "The fountain works when code is reusable. Pick the function definition.",
    code: "def cheer(name):\n    return \"Go, \" + name\n\nprint(cheer(\"Sam\"))",
    options: ["return \"Go\"", "def cheer(name):", "print(cheer(\"Sam\"))"],
    answer: 1,
    badge: "Function Friend",
    hints: {
      kids: "Functions begin with a special word and have parentheses.",
      adult: "Definition line begins with `def` and signature parameters."
    },
    explain: "Function definitions start with `def`.",
  },
  {
    type: "output",
    title: "List Lightning",
    story: "Lightning pulses for each list item. Guess the result.",
    code: "pets = [\"cat\", \"dog\", \"owl\"]\nprint(len(pets))",
    answerText: "3",
    badge: "List Learner",
    hints: {
      kids: "How many animals are in the list?",
      adult: "`len` returns count of elements in sequence."
    },
    explain: "The list has 3 items, so `len(pets)` is 3.",
  },
  {
    type: "fix",
    title: "Indentation Island",
    story: "A treasure map fails because indentation drifted. Pick the corrected block.",
    code: "for n in range(3):\nprint(n)",
    options: [
      "for n in range(3):\n    print(n)",
      "for n in range(3)\nprint(n)",
      "for n in range(3): print n"
    ],
    answer: 0,
    badge: "Indent Hero",
    hints: {
      kids: "Inside a loop, the next line must scoot right.",
      adult: "Suite statements require indentation after colon."
    },
    explain: "Python uses indentation to define blocks.",
  },
  {
    type: "arrange",
    title: "Condition Carousel",
    story: "Arrange a decision statement to check for rain.",
    tokens: ["if", "weather", "==", "\"rain\":"],
    answerTokens: ["if", "weather", "==", "\"rain\":"],
    badge: "Condition Captain",
    hints: {
      kids: "Start with `if` and end with a colon token.",
      adult: "Boolean comparison with equality operator and colon."
    },
    explain: "This line tests if `weather` equals `\"rain\"`.",
  }
];

const state = {
  levelIndex: -1,
  score: 0,
  streak: 0,
  badges: [],
  selectedOption: null,
  tokenAnswer: [],
  mode: "kids",
  started: false
};

const ui = {
  startBtn: document.getElementById("startBtn"),
  playerMode: document.getElementById("playerMode"),
  levelNumber: document.getElementById("levelNumber"),
  scoreValue: document.getElementById("scoreValue"),
  streakValue: document.getElementById("streakValue"),
  badgeValue: document.getElementById("badgeValue"),
  badgeList: document.getElementById("badgeList"),
  progressBar: document.getElementById("progressBar"),
  challengeTitle: document.getElementById("challengeTitle"),
  challengeStory: document.getElementById("challengeStory"),
  challengeBody: document.getElementById("challengeBody"),
  hintBtn: document.getElementById("hintBtn"),
  submitBtn: document.getElementById("submitBtn"),
  nextBtn: document.getElementById("nextBtn"),
  feedback: document.getElementById("feedback"),
  mcqTemplate: document.getElementById("mcqTemplate"),
  outputTemplate: document.getElementById("outputTemplate"),
  fixTemplate: document.getElementById("fixTemplate"),
  arrangeTemplate: document.getElementById("arrangeTemplate")
};

function updateStats() {
  ui.levelNumber.textContent = `${Math.max(state.levelIndex + 1, 0)} / ${levels.length}`;
  ui.scoreValue.textContent = String(state.score);
  ui.streakValue.textContent = String(state.streak);
  ui.badgeValue.textContent = String(state.badges.length);
  const progress = state.levelIndex < 0 ? 0 : ((state.levelIndex) / levels.length) * 100;
  ui.progressBar.style.width = `${Math.min(progress, 100)}%`;

  ui.badgeList.innerHTML = "";
  state.badges.forEach((badgeName) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = badgeName;
    ui.badgeList.appendChild(span);
  });
}

function getCurrentLevel() {
  return levels[state.levelIndex];
}

function renderLevel() {
  const level = getCurrentLevel();
  state.selectedOption = null;
  state.tokenAnswer = [];

  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  ui.nextBtn.disabled = true;
  ui.submitBtn.disabled = false;

  ui.challengeTitle.textContent = level.title;
  ui.challengeStory.textContent = level.story;
  ui.challengeBody.innerHTML = "";

  if (level.type === "mcq") {
    const fragment = ui.mcqTemplate.content.cloneNode(true);
    fragment.getElementById("mcqCode").textContent = level.code;
    const optionsWrap = fragment.getElementById("mcqOptions");

    level.options.forEach((option, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;
      btn.addEventListener("click", () => {
        state.selectedOption = i;
        [...optionsWrap.children].forEach((child) => child.classList.remove("selected"));
        btn.classList.add("selected");
      });
      optionsWrap.appendChild(btn);
    });

    ui.challengeBody.appendChild(fragment);
  }

  if (level.type === "output") {
    const fragment = ui.outputTemplate.content.cloneNode(true);
    fragment.getElementById("outputCode").textContent = level.code;
    ui.challengeBody.appendChild(fragment);
  }

  if (level.type === "fix") {
    const fragment = ui.fixTemplate.content.cloneNode(true);
    fragment.getElementById("fixCode").textContent = level.code;
    const optionsWrap = fragment.getElementById("fixOptions");

    level.options.forEach((option, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;
      btn.addEventListener("click", () => {
        state.selectedOption = i;
        [...optionsWrap.children].forEach((child) => child.classList.remove("selected"));
        btn.classList.add("selected");
      });
      optionsWrap.appendChild(btn);
    });

    ui.challengeBody.appendChild(fragment);
  }

  if (level.type === "arrange") {
    const fragment = ui.arrangeTemplate.content.cloneNode(true);
    ui.challengeBody.appendChild(fragment);

    const tokenPool = document.getElementById("tokenPool");
    const tokenAnswer = document.getElementById("tokenAnswer");

    const renderTokenAnswer = () => {
      tokenAnswer.innerHTML = "";
      state.tokenAnswer.forEach((part) => {
        const pill = document.createElement("span");
        pill.className = "token";
        pill.textContent = part;
        tokenAnswer.appendChild(pill);
      });
    };

    level.tokens.forEach((part) => {
      const token = document.createElement("button");
      token.className = "token";
      token.type = "button";
      token.textContent = part;
      token.addEventListener("click", () => {
        state.tokenAnswer.push(part);
        renderTokenAnswer();
      });
      tokenPool.appendChild(token);
    });

    document.getElementById("undoToken").addEventListener("click", () => {
      state.tokenAnswer.pop();
      renderTokenAnswer();
    });

    document.getElementById("clearToken").addEventListener("click", () => {
      state.tokenAnswer = [];
      renderTokenAnswer();
    });
  }
}

function markOptions(level, isCorrect) {
  if (level.type !== "mcq" && level.type !== "fix") {
    return;
  }

  const buttons = ui.challengeBody.querySelectorAll(".option-btn");
  buttons.forEach((btn, i) => {
    if (i === level.answer) {
      btn.classList.add("correct");
    }
    if (!isCorrect && i === state.selectedOption) {
      btn.classList.add("wrong");
    }
  });
}

function celebrate() {
  const colors = ["#ff006e", "#ffbe0b", "#3a86ff", "#2a9d8f", "#fb5607"];
  for (let i = 0; i < 26; i += 1) {
    const dot = document.createElement("span");
    dot.className = "confetti";
    dot.style.left = `${Math.random() * 100}vw`;
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];
    dot.style.animationDelay = `${Math.random() * 0.4}s`;
    dot.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1250);
  }
}

function evaluateAnswer() {
  const level = getCurrentLevel();
  let isCorrect = false;

  if (level.type === "mcq" || level.type === "fix") {
    isCorrect = state.selectedOption === level.answer;
  }

  if (level.type === "output") {
    const value = document.getElementById("outputAnswer").value.trim();
    isCorrect = value === level.answerText;
  }

  if (level.type === "arrange") {
    const player = state.tokenAnswer.join(" ");
    const answer = level.answerTokens.join(" ");
    isCorrect = player === answer;
  }

  markOptions(level, isCorrect);

  if (isCorrect) {
    state.streak += 1;
    state.score += 100 + (state.streak * 15);
    if (!state.badges.includes(level.badge)) {
      state.badges.push(level.badge);
    }
    ui.feedback.textContent = `Correct! ${level.explain}`;
    ui.feedback.className = "feedback ok";
    ui.submitBtn.disabled = true;
    ui.nextBtn.disabled = false;
    celebrate();
  } else {
    state.streak = 0;
    ui.feedback.textContent = `Not quite. ${level.explain}`;
    ui.feedback.className = "feedback nope";
  }

  updateStats();
}

function showHint() {
  const level = getCurrentLevel();
  ui.feedback.textContent = `Hint: ${level.hints[state.mode]}`;
  ui.feedback.className = "feedback";
}

function endGame() {
  ui.challengeTitle.textContent = "You finished PyQuest Carnival!";
  ui.challengeStory.textContent = "You completed every mission. Replay to beat your score and collect badges faster.";
  ui.challengeBody.innerHTML = `
    <div class="question-block">
      <pre class="code-card">final_score = ${state.score}\nbadges_earned = ${state.badges.length}\nprint(\"Python Power Unlocked!\")</pre>
      <p>Your score: <strong>${state.score}</strong></p>
      <p>Badges earned: <strong>${state.badges.length}</strong></p>
    </div>
  `;
  ui.submitBtn.disabled = true;
  ui.nextBtn.disabled = true;
  ui.feedback.textContent = "Great work. Press Start Adventure to play again.";
  ui.feedback.className = "feedback ok";
  ui.progressBar.style.width = "100%";
}

function nextLevel() {
  state.levelIndex += 1;
  if (state.levelIndex >= levels.length) {
    endGame();
    return;
  }

  renderLevel();
  updateStats();
}

function resetAndStart() {
  state.levelIndex = -1;
  state.score = 0;
  state.streak = 0;
  state.badges = [];
  state.mode = ui.playerMode.value;
  state.started = true;
  updateStats();
  nextLevel();
}

ui.startBtn.addEventListener("click", resetAndStart);
ui.submitBtn.addEventListener("click", () => {
  if (!state.started || ui.submitBtn.disabled) {
    return;
  }
  evaluateAnswer();
});
ui.nextBtn.addEventListener("click", nextLevel);
ui.hintBtn.addEventListener("click", () => {
  if (!state.started) {
    ui.feedback.textContent = "Pick a mode and press Start Adventure first.";
    return;
  }
  showHint();
});

updateStats();
