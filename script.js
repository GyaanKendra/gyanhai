
    const words = ["Shekhawati University", "Rajasthan University", "Matsya University", "Admit Card", "Result", "Admission Form"];
    let i = 0, j = 0, isDeleting = false;

    function type() {
      const current = words[i];
      let display = current.substring(0, j);
      document.getElementById("typewriter").textContent = display;

      if (!isDeleting && j < current.length) {
        j++;
        setTimeout(type, 100);
      } else if (isDeleting && j > 0) {
        j--;
        setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) i = (i + 1) % words.length;
        setTimeout(type, 1000);
      }
    }
    type();


                     
    const scrollBtn = document.getElementById("scrollTopBtn");
    window.onscroll = () => {
      scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    };

  // Slider
    const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');

let currentIndex = 0;
const totalSlides = slides.length;
let autoSlideInterval;

function createDots() {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  const dots = dotsContainer.querySelectorAll('button');
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

function goToSlide(index) {
  currentIndex = (index + totalSlides) % totalSlides;
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

prevBtn.addEventListener('click', () => {
  prevSlide();
  stopAutoSlide();
  startAutoSlide();
});

nextBtn.addEventListener('click', () => {
  nextSlide();
  stopAutoSlide();
  startAutoSlide();
});

createDots();
goToSlide(0);
startAutoSlide();



// Success Story
document.addEventListener("DOMContentLoaded", function () {
      const cards = document.querySelectorAll(".success-card");

      cards.forEach((card) => {
        const postId = card.getAttribute("data-post-id");
        const reactions = card.querySelectorAll(".reaction");

        reactions.forEach((reaction) => {
          const type = reaction.dataset.type;
          const key = `reaction-${postId}-${type}`;
          const countSpan = reaction.querySelector(".count");

          // Reaction पहले किया गया हो तो दिखाएं
          if (localStorage.getItem(key) === "true") {
            reaction.classList.add("active");
            countSpan.textContent = parseInt(countSpan.textContent) + 1;
          }

          reaction.addEventListener("click", () => {
            let current = parseInt(countSpan.textContent);

            if (reaction.classList.contains("active")) {
              reaction.classList.remove("active");
              countSpan.textContent = current - 1;
              localStorage.removeItem(key);
            } else {
              reaction.classList.add("active");
              countSpan.textContent = current + 1;
              localStorage.setItem(key, "true");
            }
          });
        });
      });
    });


    
// subscribe form
    const subscribeBtn = document.getElementById('subscribe-btn');
  const userInput = document.getElementById('user-input');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  const welcomeMessage = document.getElementById('welcome-message');

  // Check submission attempts from LocalStorage
  function checkAttempts() {
    const attempts = localStorage.getItem('submissionAttempts') || 0;
    const lastAttemptTime = localStorage.getItem('lastAttemptTime');
    const currentTime = new Date().getTime();
    const blockDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    if (attempts >= 3 && (currentTime - lastAttemptTime) < blockDuration) {
      const timeRemaining = (blockDuration - (currentTime - lastAttemptTime)) / 1000;
      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      blockedMessage.textContent = `You are blocked. You can try again in ${hours} hours and ${minutes} minutes.`;
      blockedMessage.style.display = 'block';
      subscribeBtn.disabled = true;
      return false;
    }

    return true;
  }

  // Validate if the input is a valid Gmail email
  function validateInput(input) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (emailRegex.test(input)) {
      return true;
    } else {
      return false;
    }
  }

  // Enable Subscribe Button if the email is valid
  userInput.addEventListener('input', function() {
    const input = userInput.value;

    if (validateInput(input)) {
      subscribeBtn.disabled = false;
      errorMessage.style.display = 'none';
    } else {
      subscribeBtn.disabled = true;
      errorMessage.style.display = 'none';
    }
  });

  // On Subscribe Button Click
  subscribeBtn.addEventListener('click', function() {
    const input = userInput.value;
    const validationResult = validateInput(input);

    // If email is not valid
    if (!validationResult) {
      errorMessage.textContent = "Please enter a valid Gmail address.";
      errorMessage.style.display = 'block';
      return;
    }

    // Check if the user is blocked due to too many attempts
    if (!checkAttempts()) {
      return;
    }

    // Track and increment submission attempts
    const attempts = parseInt(localStorage.getItem('submissionAttempts')) || 0;
    localStorage.setItem('submissionAttempts', attempts + 1);
    localStorage.setItem('lastAttemptTime', new Date().getTime());

    // Clear error messages
    errorMessage.style.display = 'none';

    successMessage.textContent = "Thank you for subscribing! A welcome email has been sent to you.";
    successMessage.style.display = 'block';

    // Display welcome message on the webpage
    welcomeMessage.textContent = "Welcome to Gyaankendra! We'll keep you updated with university alerts.";
    welcomeMessage.style.display = 'block';

    // Call Google Sheets API here to save data and send email
    sendWelcomeEmail(input); // send email
    saveToGoogleSheet(input); // save to Google Sheet
  });

  function sendWelcomeEmail(input) {
    const url = "https://script.google.com/macros/s/AKfycbytH0OmLVVdWyf3fb0kS_CMQMSr3VsOEJIrcIUzKYXGYrzABag7HDw5vyZ-KMFbLVYg/exec"; // Replace with your Google Apps Script Web App URL

    const data = {
      "emailOrPhone": input  // Send the email or phone number to the Google Apps Script
    };

    fetch(url, {
      method: "POST",
      body: new URLSearchParams(data)  // Send data in the correct format
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);  // Handle the response if needed
    })
    .catch(error => {
      console.error('Error:', error);  // Handle errors if any
    });
  }

  function saveToGoogleSheet(input) {
    console.log(`Saving data to Google Sheets: ${input}`);
  }
    
     // Navbar toggle for mobile
    const btnMenu = document.getElementById('btn-menu');
    const navList = document.getElementById('nav-list');
    btnMenu.addEventListener('click', () => {
      navList.classList.toggle('active');
    });

    // Dropdown toggle for mobile
    if (window.innerWidth <= 768) {
      const dropdownParents = navList.querySelectorAll('li[tabindex="0"] > a');
      dropdownParents.forEach(parentLink => {
        parentLink.addEventListener('click', e => {
          e.preventDefault();
          const parentLi = parentLink.parentElement;
          parentLi.classList.toggle('active');
        });
      });
    }


// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBXYryH09Yai51dvpYN0QSX8QQhPjVn-G8",
  authDomain: "emogreaction.firebaseapp.com",
  databaseURL: "https://console.firebase.google.com/project/emogreaction/database/emogreaction-default-rtdb/data/~2F?fb_gclid=Cj0KCQjwnJfEBhCzARIsAIMtfKLCt5WwmAhszVIZk-R3rr84Xu7PSi5ClUOe-Je-SRIcNms4rWjwB7EaAlMIEALw_wcB",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// ✅ Firebase Init
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ Reaction Logic
document.querySelectorAll(".success-card").forEach(card => {
  const postId = card.dataset.post;

  card.querySelectorAll(".reaction").forEach(reaction => {
    const type = reaction.dataset.type;
    const countSpan = reaction.querySelector(".count");

    // ✅ Load counts from Firebase (No bounce)
    firebase.database().ref(`reactions/${postId}/${type}`).on("value", snapshot => {
      if (snapshot.exists()) {
        countSpan.textContent = snapshot.val();
      }
    });

    // ✅ Click event with bounce effect
    reaction.addEventListener("click", () => {
      const current = parseInt(countSpan.textContent) || 0;
      const newCount = current + 1;
      firebase.database().ref(`reactions/${postId}`).update({ [type]: newCount });

      // Bounce only when user clicks
      reaction.classList.add("active");
      setTimeout(() => reaction.classList.remove("active"), 300);
    });
  });
});

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBXYryH09Yai51dvpYN0QSX8QQhPjVn-G8",
    authDomain: "emogreaction.firebaseapp.com",
    databaseURL: "https://emogreaction-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "emogreaction",
    storageBucket: "emogreaction.firebasestorage.app",
    messagingSenderId: "548650679508",
    appId: "1:548650679508:web:21736c9b3f882dc13c4f41",
    measurementId: "G-98FVCFR4XD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>


  
