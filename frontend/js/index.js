// Typed text effect
const typedTextOutput = document.querySelector('.typed-text-output');
const words = [
  "Web Designer",
  "Web Developer",
  "Front-End Developer",
  "Apps Designer",
  "Apps Developer"
];
let wordIndex = 0;
let charIndex = 0;
const typingSpeed = 100; // Speed of typing
const deletingSpeed = 50; // Speed of deleting
const newWordDelay = 2000; // Delay before typing the next word

// Function to type a word
function typeWord() {
  if (charIndex < words[wordIndex].length) {
    typedTextOutput.innerHTML += words[wordIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWord, typingSpeed);
  } else {
    setTimeout(deleteWord, newWordDelay); // Start deleting after typing is done
  }
}

// Function to delete a word
function deleteWord() {
  if (charIndex > 0) {
    typedTextOutput.innerHTML = typedTextOutput.innerHTML.slice(0, -1); // Remove the last character
    charIndex--;
    setTimeout(deleteWord, deletingSpeed);
  } else {
    // Move to the next word
    wordIndex = (wordIndex + 1) % words.length; // Loop through the words
    setTimeout(typeWord, typingSpeed); // Start typing the next word
  }
}

// Start typing effect on page load
window.onload = typeWord;



const modalElement = document.getElementById('authModal');
const firstFocusableElement = modalElement.querySelector('input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'); // Adjust this selector to match your first focusable element

modalElement.addEventListener('show.bs.modal', function () {
  // Remove the inert attribute and make the modal interactable
  modalElement.removeAttribute('inert');
  firstFocusableElement.focus(); // Set focus to the first focusable element inside the modal
});

modalElement.addEventListener('hidden.bs.modal', function () {
  // Add the inert attribute and prevent interaction with the modal
  modalElement.setAttribute('inert', 'true');
  // Optional: You can focus back to the element that triggered the modal, like a button or link
  const triggerElement = document.querySelector('[data-bs-toggle="modal"]');
  triggerElement.focus(); // Return focus to the trigger element
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});


// Get the social sidebar element
const socialSidebar = document.querySelector('.social');
const header = document.querySelector('header');

// Function to handle scroll event and toggle visibility of social icons
function handleScroll() {
  const headerHeight = header.offsetHeight;
  if (window.scrollY > headerHeight) {
    socialSidebar.classList.add('hidden'); // Hide social sidebar when scrolled past the header
  } else {
    socialSidebar.classList.remove('hidden'); // Show social sidebar when at the top
  }
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);






document.addEventListener('DOMContentLoaded', () => {
  // Password toggle helper (optional if you want toggle buttons)
  function togglePassword(id) {
    const input = document.getElementById(id);
    const button = input?.nextElementSibling;
    if (!input || !button) return;

    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Show' : 'Hide';
  }

  // Email validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Password validation: 8-16 chars, at least one letter and one number
  function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password);
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value;
      const password = document.getElementById('loginPassword')?.value;
      const errorDiv = document.getElementById('loginError');

      if (!validateEmail(email)) {
        errorDiv.textContent = 'Invalid email format';
        document.getElementById('loginEmail')?.classList.add('is-invalid');
        return;
      }
      if (!validatePassword(password)) {
        errorDiv.textContent = 'Password must be 8-16 characters with at least one letter and one number';
        document.getElementById('loginPassword')?.classList.add('is-invalid');
        return;
      }

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        const data = await response.json();
        errorDiv.textContent = '';
        document.getElementById('loginEmail')?.classList.remove('is-invalid');
        document.getElementById('loginPassword')?.classList.remove('is-invalid');

        if (response.ok) {
          alert('Login successful');
          window.location.href = 'profile.html';
        } else {
          errorDiv.textContent = data.message || 'Login failed';
        }
      } catch (error) {
        errorDiv.textContent = 'Error: ' + error.message;
      }
    });
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername')?.value;
      const email = document.getElementById('registerEmail')?.value;
      const password = document.getElementById('registerPassword')?.value;
      const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
      const errorDiv = document.getElementById('registerError');

      if (!validateEmail(email)) {
        errorDiv.textContent = 'Invalid email format';
        document.getElementById('registerEmail')?.classList.add('is-invalid');
        return;
      }
      if (!validatePassword(password)) {
        errorDiv.textContent = 'Password must be 8-16 characters with at least one letter and one number';
        document.getElementById('registerPassword')?.classList.add('is-invalid');
        return;
      }
      if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        document.getElementById('registerConfirmPassword')?.classList.add('is-invalid');
        return;
      }

      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include',
        });

        const data = await response.json();
        errorDiv.textContent = '';
        document.getElementById('registerEmail')?.classList.remove('is-invalid');
        document.getElementById('registerPassword')?.classList.remove('is-invalid');
        document.getElementById('registerConfirmPassword')?.classList.remove('is-invalid');

        if (response.ok) {
          alert('Registration successful');
          document.getElementById('login-tab')?.click(); // Switch to login tab
        } else {
          errorDiv.textContent = data.message || 'Registration failed';
        }
      } catch (error) {
        errorDiv.textContent = 'Error: ' + error.message;
      }
    });
  }

  // Forgot password form
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotPasswordEmail')?.value;
      const errorDiv = document.getElementById('forgotPasswordError');

      if (!validateEmail(email)) {
        errorDiv.textContent = 'Invalid email format';
        document.getElementById('forgotPasswordEmail')?.classList.add('is-invalid');
        return;
      }

      try {
        const response = await fetch('/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include',
        });

        const data = await response.json();
        errorDiv.textContent = '';
        document.getElementById('forgotPasswordEmail')?.classList.remove('is-invalid');

        if (response.ok) {
          errorDiv.className = 'mt-2 text-success';
          errorDiv.textContent = 'Password reset link sent';
        } else {
          errorDiv.textContent = data.message || 'Failed to send reset link';
        }
      } catch (error) {
        errorDiv.textContent = 'Error: ' + error.message;
      }
    });
  }
});
