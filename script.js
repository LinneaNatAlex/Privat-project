/* ==================== JAVASCRIPT SECTION ==================== */
/* Main application logic, navigation, and animations */

// ==================== PAGE NAVIGATION SYSTEM ====================
// Get references to all main page sections for navigation control
const profileContent = document.querySelector(".profile-content");
const playlistContainer = document.querySelector(".playlist-container");
const romanceContainer = document.querySelector(".romance-container");
const funFactsContainer = document.querySelector(".fun-facts-container");
const quizContainer = document.querySelector(".quiz-container");

// SECTION SWITCHING FUNCTION - Controls which page section is visible
function switchToSection(sectionName) {
  // Hide all sections first to ensure clean transitions
  profileContent.style.display = "none";
  playlistContainer.style.display = "none";
  romanceContainer.style.display = "none";
  funFactsContainer.style.display = "none";
  quizContainer.style.display = "none";

  // Display the requested section based on navigation choice
  if (sectionName === "ROMANCE") {
    romanceContainer.style.display = "block";
  } else if (sectionName === "INSPO MUSIC") {
    playlistContainer.style.display = "block";
  } else if (sectionName === "FUN FACTS") {
    funFactsContainer.style.display = "block";
  } else if (sectionName === "QUIZ") {
    quizContainer.style.display = "block";
  } else {
    // Default fallback to profile page if no match found
    profileContent.style.display = "block";
  }
}

// ==================== BACKGROUND MUSIC SYSTEM ====================
// YouTube API integration for ambient background music
const musicToggle = document.getElementById("music-toggle");
const volumeSlider = document.getElementById("volume-slider");
const youtubePlayer = document.getElementById("youtube-player");

// MUSIC PLAYER STATE VARIABLES
let isPlaying = false; // Current playback status
let userPaused = false; // Track if user manually paused (prevents auto-restart)
let youtubePlayerInstance; // YouTube player API instance

// YOUTUBE API INITIALIZATION - Called when YouTube iframe API is ready
function onYouTubeIframeAPIReady() {
  youtubePlayerInstance = new YT.Player("youtube-player", {
    events: {
      onReady: onPlayerReady, // Triggered when player is fully loaded
      onStateChange: onPlayerStateChange, // Triggered on play/pause/end events
    },
  });
}

// PLAYER READY EVENT HANDLER - Sets up initial music state
function onPlayerReady(event) {
  console.log("YouTube player ready");
  // Set initial volume (0-100 scale)
  event.target.setVolume(30);
  if (volumeSlider) {
    volumeSlider.value = 30;
  }

  // Only start automatically on first load, not after pause
  if (!userPaused) {
    setTimeout(() => {
      try {
        event.target.playVideo();
        isPlaying = true;
        if (musicToggle) musicToggle.textContent = "⏸ Pause Music";
        console.log("Auto-play started");
      } catch (error) {
        console.log("Auto-play failed:", error);
      }
    }, 1000);
  }
}

function onPlayerStateChange(event) {
  console.log("Player state changed:", event.data, "userPaused:", userPaused);

  if (event.data == YT.PlayerState.PLAYING) {
    isPlaying = true;
    if (musicToggle) musicToggle.textContent = "⏸ Pause Music";
  } else if (event.data == YT.PlayerState.PAUSED) {
    isPlaying = false;
    if (musicToggle) musicToggle.textContent = "▶ Play Music";

    // NO automatic resume - let user control the music completely
    console.log("Music paused - waiting for user action");
  } else if (event.data == YT.PlayerState.ENDED) {
    // Video ended, restart it (only if not user-paused)
    if (!userPaused) {
      console.log("Video ended, restarting...");
      youtubePlayerInstance.seekTo(0);
      youtubePlayerInstance.playVideo();
    } else {
      console.log("Video ended but user paused - not restarting");
    }
  }
}

// Load YouTube API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Make onYouTubeIframeAPIReady global
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

// Music toggle button for YouTube
if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (!youtubePlayerInstance || !youtubePlayerInstance.playVideo) {
      alert(
        "YouTube player not ready yet. Please wait a moment and try again."
      );
      return;
    }

    if (isPlaying) {
      userPaused = true; // Mark that user manually paused
      youtubePlayerInstance.pauseVideo();
      musicToggle.textContent = "▶ Play Music";
      isPlaying = false;
      console.log("User manually paused music");
    } else {
      userPaused = false; // Reset pause flag when user starts
      youtubePlayerInstance.playVideo();
      musicToggle.textContent = "⏸ Pause Music";
      isPlaying = true;
      console.log("User manually started music");
    }
  });
}

// Volume control for YouTube
if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    if (youtubePlayerInstance && youtubePlayerInstance.setVolume) {
      youtubePlayerInstance.setVolume(e.target.value);
    }
  });
}

// ==================== VISUAL EFFECTS SYSTEM ====================

// MATRIX BACKGROUND ANIMATION - Falling code effect
const canvas = document.getElementById("matrix-bg");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Matrix characters
const chars =
  "0123456789天地人水火木金土日月星辰风云雨雪山川河流海洋森林城市国家世界宇宙科技数据系统网络信息";
const charArray = chars.split("");

// Columns
const fontSize = 20;
const columns = Math.floor(canvas.width / fontSize);
const drops = [];

// Initialize drops
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

// Draw function
function draw() {
  // Semi-transparent black to create fade effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Brighter blue text
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold " + fontSize + "px monospace";

  // Loop over drops
  for (let i = 0; i < drops.length; i++) {
    // Random character
    const char = charArray[Math.floor(Math.random() * charArray.length)];

    // Draw character
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    // Reset drop to top with random delay
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Animation loop
setInterval(draw, 50);

// === MAGICAL INTERACTIVE EFFECTS ===

// Spell Trail Effects - follows mouse movement
let mouseTrails = [];
let lastMouseX = 0;
let lastMouseY = 0;

function createSpellTrail(x, y) {
  const trail = document.createElement("div");
  trail.className = "spell-trail";
  trail.style.left = x + "px";
  trail.style.top = y + "px";
  document.body.appendChild(trail);

  // Create sparks around the trail
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const spark = document.createElement("div");
      spark.className = "spell-spark";
      spark.style.left = x + Math.random() * 20 - 10 + "px";
      spark.style.top = y + Math.random() * 20 - 10 + "px";
      document.body.appendChild(spark);

      // Remove spark after animation
      setTimeout(() => {
        if (spark.parentNode) {
          spark.parentNode.removeChild(spark);
        }
      }, 2000);
    }, i * 100);
  }

  // Remove trail after animation
  setTimeout(() => {
    if (trail.parentNode) {
      trail.parentNode.removeChild(trail);
    }
  }, 1500);
}

// Mouse movement tracking for spell trails
document.addEventListener("mousemove", (e) => {
  const currentX = e.clientX;
  const currentY = e.clientY;

  // Calculate distance moved
  const distance = Math.sqrt(
    Math.pow(currentX - lastMouseX, 2) + Math.pow(currentY - lastMouseY, 2)
  );

  // Only create trail if mouse moved enough (prevents too many trails)
  if (distance > 15) {
    createSpellTrail(currentX, currentY);
    lastMouseX = currentX;
    lastMouseY = currentY;
  }
});

// === SCROLL TO TOP FUNCTIONALITY ===
const scrollToTopBtn = document.getElementById("scroll-to-top");

// Show/hide scroll button based on scroll position
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }
});

// Smooth scroll to top when button is clicked
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// === IMAGE GALLERY FUNCTIONALITY ===
const gallerySlides = document.getElementById("gallery-slides");
const galleryDots = document.querySelectorAll(".gallery-dot");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");
const slides = document.querySelectorAll(".gallery-slide");

let currentSlide = 0;
const totalSlides = slides.length;

// Update gallery display
function updateGallery() {
  const translateX = -(currentSlide * (100 / totalSlides));
  gallerySlides.style.transform = `translateX(${translateX}%)`;

  // Update dots
  galleryDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });

  // Update active slide
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });
}

// Navigate to specific slide
function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateGallery();
}

// Previous slide
galleryPrev.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateGallery();
});

// Next slide
galleryNext.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateGallery();
});

// Dot navigation
galleryDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    goToSlide(index);
  });
});

// Slide click navigation (acts as menu buttons)
slides.forEach((slide, index) => {
  slide.addEventListener("click", () => {
    const menuTarget = slide.dataset.menu;

    // Update current slide
    goToSlide(index);

    // Switch to the corresponding content section
    switchToSection(menuTarget);
  });
});

// Initialize gallery
updateGallery();

// ==================== QUIZ SYSTEM ====================

// Quiz questions and relationship scoring
const quizQuestionsData = [
  {
    question: "Hva er ditt kjønn?",
    options: ["Mann", "Kvinne", "Ikke-binær", "Foretrekker ikke å si"],
    category: "gender",
  },
  {
    question: "Hvor kommer du fra?",
    options: [
      "Asia (Kina, Japan, Korea, osv.)",
      "Europa",
      "Nord-Amerika",
      "Annet",
    ],
    category: "origin",
  },
  {
    question: "Hva er din personlighetstype?",
    options: [
      "Ekstrovert og utadvendt",
      "Introvert og stille",
      "Balansert og tilpasningsdyktig",
      "Mystisk og reservert",
    ],
    category: "personality",
  },
  {
    question: "Hvordan håndterer du konflikter?",
    options: [
      "Møter dem frontalt",
      "Unngår dem helt",
      "Prøver å finne en fredelig løsning",
      "Lar andre håndtere det",
    ],
    category: "conflict",
  },
  {
    question: "Hva er din favorittmåte å tilbringe fritiden på?",
    options: [
      "Lesing eller studier",
      "Henge med venner",
      "Være utendørs",
      "Kreative aktiviteter",
    ],
    category: "hobbies",
  },
  {
    question: "Hva synes du om regler og autoritet?",
    options: [
      "Jeg følger dem strengt",
      "Jeg bøyer dem når nødvendig",
      "Jeg stiller spørsmål ved dem ofte",
      "Jeg foretrekker å lage mine egne regler",
    ],
    category: "authority",
  },
  {
    question: "Hva er ditt forhold til mat?",
    options: [
      "Jeg elsker å lage mat og spise",
      "Jeg spiser for å overleve",
      "Jeg er kresen på mat",
      "Jeg liker å prøve nye kjøkkener",
    ],
    category: "food",
  },
  {
    question: "Hvordan uttrykker du kjærlighet?",
    options: [
      "Fysisk berøring og klemmer",
      "Bekreftende ord",
      "Tjenester",
      "Jeg er ikke veldig kjærlig",
    ],
    category: "affection",
  },
  {
    question: "Hva er din tilnærming til forhold?",
    options: [
      "Jeg er veldig lojal og engasjert",
      "Jeg holder ting avslappet",
      "Jeg er selektiv men dyp",
      "Jeg foretrekker å være uavhengig",
    ],
    category: "relationships",
  },
  {
    question: "Hvordan håndterer du stress?",
    options: [
      "Jeg snakker med venner",
      "Jeg trener eller holder meg aktiv",
      "Jeg trenger alenetid",
      "Jeg distraherer meg selv med hobbyer",
    ],
    category: "stress",
  },
  {
    question: "Hva er din akademiske holdning?",
    options: [
      "Jeg er veldig flittig",
      "Jeg gjør minimumskravet",
      "Jeg liker å lære men ikke press",
      "Jeg foretrekker praktiske ferdigheter",
    ],
    category: "academic",
  },
  {
    question: "Hva synes du om dyr?",
    options: [
      "Jeg elsker alle dyr",
      "Jeg er likegyldig",
      "Jeg er redd for noen dyr",
      "Jeg foretrekker visse typer",
    ],
    category: "animals",
  },
  {
    question: "Hva er din kommunikasjonsstil?",
    options: [
      "Direkte og ærlig",
      "Myk og diplomatisk",
      "Jeg lytter mer enn jeg snakker",
      "Jeg er veldig uttrykksfull",
    ],
    category: "communication",
  },
  {
    question: "Hvordan håndterer du endring?",
    options: [
      "Jeg omfavner det",
      "Jeg motstår det",
      "Jeg tilpasser meg sakte",
      "Jeg planlegger for det",
    ],
    category: "change",
  },
  {
    question: "Hva er ditt forhold til musikk?",
    options: [
      "Jeg spiller et instrument",
      "Jeg elsker å høre på musikk",
      "Jeg er ikke veldig musikalsk",
      "Jeg liker å synge",
    ],
    category: "music",
  },
  {
    question: "Hva synes du om vann og natur?",
    options: [
      "Jeg elsker å være nær vann",
      "Jeg foretrekker innendørsaktiviteter",
      "Jeg liker fotturer og utendørs",
      "Jeg er nøytral til natur",
    ],
    category: "nature",
  },
  {
    question: "Hva er din tilnærming til å hjelpe andre?",
    options: [
      "Jeg søker aktivt å hjelpe",
      "Jeg hjelper når jeg blir spurt",
      "Jeg foretrekker å fokusere på meg selv",
      "Jeg er veldig beskyttende over kjære",
    ],
    category: "helping",
  },
  {
    question: "Hvordan håndterer du kritikk?",
    options: [
      "Jeg tar det konstruktivt",
      "Jeg blir defensiv",
      "Jeg ignorerer det",
      "Jeg reflekterer over det privat",
    ],
    category: "criticism",
  },
  {
    question: "Hva er ditt energinivå?",
    options: [
      "Veldig høy energi",
      "Moderat energi",
      "Lav energi",
      "Det varierer mye",
    ],
    category: "energy",
  },
  {
    question: "Hva synes du om tradisjoner?",
    options: [
      "Jeg respekterer og følger dem",
      "Jeg stiller spørsmål ved dem",
      "Jeg er likegyldig",
      "Jeg lager mine egne tradisjoner",
    ],
    category: "traditions",
  },
  {
    question: "Hva er ditt forhold til følelser?",
    options: [
      "Jeg er veldig følelsesladet",
      "Jeg holder følelser private",
      "Jeg er balansert",
      "Jeg sliter med følelser",
    ],
    category: "emotions",
  },
  {
    question: "Hvordan nærmer du deg nye opplevelser?",
    options: [
      "Jeg hopper rett inn",
      "Jeg observerer først",
      "Jeg trenger oppmuntring",
      "Jeg unngår dem",
    ],
    category: "experiences",
  },
  {
    question: "Hva er ditt forhold til renlighet?",
    options: [
      "Jeg er veldig organisert",
      "Jeg er rotete",
      "Jeg er moderat ryddig",
      "Jeg rydder når nødvendig",
    ],
    category: "cleanliness",
  },
  {
    question: "Hva synes du om å være i sentrum av oppmerksomhet?",
    options: [
      "Jeg elsker det",
      "Jeg hater det",
      "Jeg er komfortabel med det",
      "Jeg foretrekker å blande meg inn",
    ],
    category: "attention",
  },
  {
    question: "Hva er ditt forhold til tid?",
    options: [
      "Jeg er alltid punktlig",
      "Jeg er ofte sen",
      "Jeg er fleksibel",
      "Jeg planlegger alt nøye",
    ],
    category: "time",
  },
];

// Relationship types and their characteristics
const relationshipTypes = {
  "Beste Venn": {
    description:
      "Du og Zen ville vært bestevenner! Dere deler samme verdier om lojalitet, rettferdighet og beskyttelse av dem dere bryr dere om. Zen setter pris på din pålitelighet og støtte, og du forstår hans dype omsorgsfulle natur bak den seriøse fasaden. Sammen skaper dere et ubrutt bånd bygget på tillit og gjensidig respekt.",
    image:
      "https://i.pinimg.com/originals/92/a5/6e/92a56e99472407e72ede045e64f944a7.gif",
    traits: ["lojal", "pålitelig", "støttende", "forståelsesfull"],
  },
  "Romantisk Partner": {
    description:
      "Det er ubenektelig kjemi mellom deg og Zen! Du forstår hans komplekse personlighet - fra hans beskyttende instinkter til hans mykere, mer sårbare sider. Du kan se forbi hans tilsynelatende kalde fasade og setter pris på hans dype kapasitet for kjærlighet. Sammen balanserer dere hverandres styrker og svakheter perfekt.",
    image:
      "https://i.pinimg.com/originals/26/11/f3/2611f3670573f212c53d22353024f9e7.gif",
    traits: ["romantisk", "lidenskapelig", "forståelsesfull", "balanserende"],
  },
  "Familie fra Asia": {
    description:
      "Du deler kulturelle røtter og familiebånd med Zen! Som noen med asiatisk bakgrunn forstår du hans respekt for tradisjon, familie-ære og de forventningene som følger med. Dere har en naturlig forståelse av hverandres kulturelle identitet og kan støtte hverandre gjennom utfordringer knyttet til å navigere mellom to kulturer.",
    image:
      "https://i.pinimg.com/originals/02/7f/9d/027f9de4c8914d56a4c813ea37000431.gif",
    traits: [
      "kulturell forståelse",
      "familie-bånd",
      "tradisjonell",
      "støttende",
    ],
  },
  Studievenner: {
    description:
      "Du og Zen har et solid akademisk partnerskap! Dere motiverer hverandre til å prestere best mulig og deler en lidenskap for læring. Zen setter pris på din dedikasjon til studier, og du respekterer hans lederegenskaper og ansvarsfølelse. Sammen skaper dere en produktiv og støttende studiemiljø.",
    image:
      "https://i.pinimg.com/originals/cc/0f/76/cc0f761346e1dcafa27cc40cfb20c707.gif",
    traits: ["akademisk", "motiverende", "dedikert", "respektfull"],
  },
  Husvenner: {
    description:
      "Som Håsblås-studenter deler du og Zen huslojalitet og verdier! Dere forstår viktigheten av vennskap, lojalitet og å stå opp for hverandre. Zen setter pris på din trofasthet og evne til å være der for andre, mens du respekterer hans lederrolle og beskyttende instinkter for huset.",
    image:
      "https://i.pinimg.com/originals/59/47/95/5947955f03d49d935b4ce032f3d96402.gif",
    traits: ["lojal", "troffast", "beskyttende", "husånd"],
  },
  Motsetninger: {
    description:
      "Du og Zen representerer interessante motsetninger! Hvor han er seriøs og strukturert, bringer du kanskje mer spontanitet og letthet. Disse forskjellene skaper både spenning og muligheter for vekst. Zen lærer å slappe av med deg, mens du lærer verdien av hans disiplin og ansvarsfølelse.",
    image:
      "https://i.pinimg.com/originals/b4/81/d8/b481d82421a51220ae60e4b95a7e8493.gif",
    traits: ["komplementerende", "lærerik", "utfordrende", "vekst"],
  },
  Beundrere: {
    description:
      "Du setter stor pris på Zen fra en viss avstand! Du respekterer hans lederegenskaper, dedikasjon og måten han tar vare på andre på. Han inspirerer deg til å være en bedre person, og du setter pris på hans styrke og integritet, selv om dere kanskje ikke er super nære venner.",
    image:
      "https://i.pinimg.com/originals/ec/f5/00/ecf500da72775fb6bf2316a85842afbe.gif",
    traits: ["respektfull", "inspirert", "beundrende", "motivert"],
  },
};

// Quiz state variables
let currentQuestionIndex = 0;
let userAnswers = {};
let quizStarted = false;

// Quiz DOM elements
const startQuizBtn = document.getElementById("start-quiz");
const quizIntro = document.getElementById("quiz-intro");
const quizQuestions = document.getElementById("quiz-questions");
const quizResults = document.getElementById("quiz-results");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const prevQuestionBtn = document.getElementById("prev-question");
const nextQuestionBtn = document.getElementById("next-question");
const retakeQuizBtn = document.getElementById("retake-quiz");
const resultTitle = document.getElementById("result-title");
const resultDescription = document.getElementById("result-description");
const resultImage = document.getElementById("result-image");

// Debug: Check if elements exist
console.log("Quiz elements check:", {
  startQuizBtn,
  quizIntro,
  quizQuestions,
  quizResults,
  resultTitle,
  resultDescription,
  resultImage,
});

// Start quiz
startQuizBtn.addEventListener("click", () => {
  quizStarted = true;
  currentQuestionIndex = 0;
  userAnswers = {};
  showQuestion();
  quizIntro.style.display = "none";
  quizQuestions.style.display = "block";
  quizResults.style.display = "none";
});

// Shuffle array function for randomizing options
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Show current question
function showQuestion() {
  const question = quizQuestionsData[currentQuestionIndex];
  questionText.textContent = question.question;

  // Clear previous options
  answerOptions.innerHTML = "";

  // Create shuffled options array with original indices
  const optionsWithIndex = question.options.map((option, index) => ({
    text: option,
    originalIndex: index,
  }));
  const shuffledOptions = shuffleArray(optionsWithIndex);

  // Create answer options
  shuffledOptions.forEach((optionObj, displayIndex) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "answer-option";
    optionDiv.innerHTML = `
      <input type="radio" name="question${currentQuestionIndex}" value="${optionObj.originalIndex}" id="option${displayIndex}">
      <label for="option${displayIndex}">${optionObj.text}</label>
    `;

    // Check if this option was previously selected
    if (userAnswers[currentQuestionIndex] === optionObj.originalIndex) {
      optionDiv.classList.add("selected");
      optionDiv.querySelector("input").checked = true;
    }

    optionDiv.addEventListener("click", () => {
      // Remove selection from other options
      answerOptions.querySelectorAll(".answer-option").forEach((opt) => {
        opt.classList.remove("selected");
        opt.querySelector("input").checked = false;
      });

      // Select this option
      optionDiv.classList.add("selected");
      optionDiv.querySelector("input").checked = true;
      userAnswers[currentQuestionIndex] = optionObj.originalIndex;

      // Enable next button if we have an answer
      nextQuestionBtn.disabled = false;
    });

    answerOptions.appendChild(optionDiv);
  });

  // Update progress
  const progress =
    ((currentQuestionIndex + 1) / quizQuestionsData.length) * 100;
  progressFill.style.width = progress + "%";
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${
    quizQuestionsData.length
  }`;

  // Update navigation buttons
  prevQuestionBtn.disabled = currentQuestionIndex === 0;
  nextQuestionBtn.textContent =
    currentQuestionIndex === quizQuestionsData.length - 1
      ? "See Results"
      : "Next";

  // Disable next button if no answer is selected for current question
  if (userAnswers[currentQuestionIndex] === undefined) {
    nextQuestionBtn.disabled = true;
  } else {
    nextQuestionBtn.disabled = false;
  }
}

// Navigation buttons
prevQuestionBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

nextQuestionBtn.addEventListener("click", () => {
  if (currentQuestionIndex < quizQuestionsData.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    // Show results
    showResults();
  }
});

// Calculate relationship type
function calculateRelationship() {
  const scores = {
    "Beste Venn": 0,
    "Romantisk Partner": 0,
    "Familie fra Asia": 0,
    Studievenner: 0,
    Husvenner: 0,
    Motsetninger: 0,
    Beundrere: 0,
  };

  // Scoring logic based on answers
  Object.keys(userAnswers).forEach((questionIndex) => {
    const answer = userAnswers[questionIndex];
    const question = quizQuestionsData[questionIndex];

    // Gender scoring
    if (question.category === "gender") {
      if (answer === 1) {
        // Kvinne - høyere sjanse for romantisk
        scores["Romantisk Partner"] += 3;
      } else if (answer === 0) {
        // Mann - høyere sjanse for beste venn
        scores["Beste Venn"] += 2;
        scores["Husvenner"] += 1;
      }
    }

    // Origin scoring - VIKTIG for familie-kategorien
    if (question.category === "origin") {
      if (answer === 0) {
        // Asia - stor bonus til familie
        scores["Familie fra Asia"] += 5;
        scores["Beste Venn"] += 2;
      } else {
        scores["Studievenner"] += 1;
        scores["Beundrere"] += 1;
      }
    }

    // Personality scoring
    if (question.category === "personality") {
      if (answer === 1) {
        // Introvert - matcher Zen's dypere side
        scores["Beste Venn"] += 3;
        scores["Romantisk Partner"] += 2;
      } else if (answer === 0) {
        // Extrovert - motsetninger
        scores["Motsetninger"] += 2;
        scores["Husvenner"] += 1;
      } else if (answer === 2) {
        // Balansert
        scores["Studievenner"] += 2;
      }
    }

    // Conflict handling
    if (question.category === "conflict") {
      if (answer === 2) {
        // Fredelig løsning - matcher Zen's rettferdighetssans
        scores["Beste Venn"] += 3;
        scores["Romantisk Partner"] += 2;
        scores["Familie fra Asia"] += 1;
      } else if (answer === 0) {
        // Frontalt - motsetninger
        scores["Motsetninger"] += 2;
      } else if (answer === 1) {
        // Unngår - beundrere
        scores["Beundrere"] += 1;
      }
    }

    // Authority - viktig for Zen som prefekt
    if (question.category === "authority") {
      if (answer === 0) {
        // Følger strengt - støtter hans lederrolle
        scores["Beste Venn"] += 2;
        scores["Husvenner"] += 2;
        scores["Familie fra Asia"] += 1;
      } else if (answer === 1) {
        // Bøyer når nødvendig - balansert
        scores["Romantisk Partner"] += 2;
        scores["Studievenner"] += 1;
      } else if (answer === 2 || answer === 3) {
        // Stiller spørsmål/egne regler - motsetninger
        scores["Motsetninger"] += 3;
      }
    }

    // Food - Zen elsker matlaging
    if (question.category === "food") {
      if (answer === 0) {
        // Elsker å lage mat - stor bonus
        scores["Romantisk Partner"] += 4;
        scores["Beste Venn"] += 3;
        scores["Familie fra Asia"] += 2;
      } else if (answer === 3) {
        // Liker å prøve nye kjøkken
        scores["Familie fra Asia"] += 2;
      }
    }

    // Affection
    if (question.category === "affection") {
      if (answer === 0) {
        // Fysisk berøring
        scores["Romantisk Partner"] += 3;
      } else if (answer === 1) {
        // Bekreftende ord
        scores["Beste Venn"] += 2;
        scores["Familie fra Asia"] += 1;
      } else if (answer === 2) {
        // Tjenester - matcher Zen's omsorgsfullhet
        scores["Beste Venn"] += 2;
        scores["Romantisk Partner"] += 2;
      }
    }

    // Relationships
    if (question.category === "relationships") {
      if (answer === 0) {
        // Lojal og engasjert - matcher Zen perfekt
        scores["Beste Venn"] += 4;
        scores["Romantisk Partner"] += 3;
        scores["Familie fra Asia"] += 2;
      } else if (answer === 2) {
        // Selektiv men dyp
        scores["Romantisk Partner"] += 2;
        scores["Beste Venn"] += 2;
      }
    }

    // Academic - Zen er veldig akademisk
    if (question.category === "academic") {
      if (answer === 0) {
        // Veldig flittig
        scores["Studievenner"] += 4;
        scores["Beste Venn"] += 2;
        scores["Familie fra Asia"] += 1;
      } else if (answer === 2) {
        // Liker å lære uten press
        scores["Romantisk Partner"] += 2;
      } else if (answer === 3) {
        // Praktiske ferdigheter
        scores["Motsetninger"] += 2;
      }
    }

    // Helping others - viktig for Zen
    if (question.category === "helping") {
      if (answer === 0) {
        // Søker aktivt å hjelpe
        scores["Beste Venn"] += 4;
        scores["Husvenner"] += 2;
      } else if (answer === 3) {
        // Beskyttende over kjære - romantisk
        scores["Romantisk Partner"] += 3;
        scores["Familie fra Asia"] += 2;
      }
    }
  });

  // Find the highest scoring relationship
  let maxScore = 0;
  let bestRelationship = "Studievenner"; // Default

  Object.keys(scores).forEach((relationship) => {
    if (scores[relationship] > maxScore) {
      maxScore = scores[relationship];
      bestRelationship = relationship;
    }
  });

  console.log("Quiz Scores:", scores);
  console.log("Best Relationship:", bestRelationship, "with score:", maxScore);

  return bestRelationship;
}

// Show results
function showResults() {
  const relationship = calculateRelationship();
  const relationshipInfo = relationshipTypes[relationship];

  console.log("Relationship:", relationship);
  console.log("Relationship Info:", relationshipInfo);
  console.log("Elements:", { resultTitle, resultDescription, resultImage });

  if (resultTitle && resultDescription && resultImage && relationshipInfo) {
    resultTitle.textContent = `Du er Zens ${relationship}!`;
    resultDescription.textContent = relationshipInfo.description;
    resultImage.innerHTML = `<img src="${relationshipInfo.image}" alt="${relationship}" style="max-width: 100%; border-radius: 8px;">`;
  } else {
    console.error("Missing elements or relationship info");
  }

  quizQuestions.style.display = "none";
  quizResults.style.display = "block";
}

// Retake quiz
retakeQuizBtn.addEventListener("click", () => {
  quizStarted = false;
  currentQuestionIndex = 0;
  userAnswers = {};
  quizIntro.style.display = "block";
  quizQuestions.style.display = "none";
  quizResults.style.display = "none";
});

// ==================== SYSTEM LOG MESSAGES ====================
const logContainer = document.querySelector(".system-log-messages");
const logMessages = [
  "Galtvort Studentportal Initialisert.",
  "Skanner magisk aura...",
  "Huslojalitet: [Håsblås].",
  "Akademisk fremgangssporing aktiv.",
  "Urtegård drivhus tilgang innvilget.",
  "Magisk vesens affinitet oppdaget: Høy.",
  "Systemalarm: Enestående fagprestasjoner oppdaget.",
  "Beregner optimal studieplan...",
  "Sinnstilstand: Fokusert. Bestemt.",
  "Akademiske mål oppdatert. Fortsetter studier.",
];
let messageIndex = 0;

// Add message to system log
function addLogMessage() {
  if (logContainer.children.length > 20) {
    logContainer.removeChild(logContainer.firstChild);
  }

  const li = document.createElement("li");
  li.innerHTML = `<span class="log-prefix">[SYSTEM] </span>${logMessages[messageIndex]}`;
  logContainer.appendChild(li);

  logContainer.scrollTop = logContainer.scrollHeight;

  messageIndex = (messageIndex + 1) % logMessages.length;
}

// ==================== DROPDOWN FUNCTIONALITY ====================
// Toggle dropdown content visibility
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const arrow = dropdown.parentElement.querySelector(".dropdown-arrow");

  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
    arrow.textContent = "▲";
  } else {
    dropdown.style.display = "none";
    arrow.textContent = "▼";
  }
}

// Load everything when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize system log
  setInterval(addLogMessage, 3000);
  addLogMessage(); // Add first message right away
});
