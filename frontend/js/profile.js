var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

// slider header

var nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel'),
    list = document.querySelector('.list'),
    item = document.querySelectorAll('.item');

let timeAutoNext = 7000;

nextBtn.onclick = function () {
    showSlider('next');
}

prevBtn.onclick = function () {
    showSlider('prev');
}

let runNextAuto = setTimeout(() => {
    nextBtn.click();
}, timeAutoNext);

function showSlider(type) {
    let sliderItemsDom = list.querySelectorAll('.carousel .list .item');
    if (type === 'next') {
        list.appendChild(sliderItemsDom[0]);
        carousel.classList.add('next');
    } else {
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        carousel.classList.add('prev');
    }

    clearTimeout(runNextAuto);

    runNextAuto = setTimeout(() => {
        nextBtn.click();
    }, timeAutoNext);

    setTimeout(() => {
        carousel.classList.remove('next');
        carousel.classList.remove('prev');
    }, 300);
}

// Automatically trigger the next slider every 7 seconds
clearTimeout(runNextAuto);
runNextAuto = setTimeout(() => {
    nextBtn.click();
}, timeAutoNext);



// Profile.js - Client-side JavaScript for user profile management
// profile.js
document.querySelector('#contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const body = {
    firstname: document.getElementById('firstname').value.trim(),
    lastname: document.getElementById('lastname').value.trim(),
    email: document.getElementById('email').value.trim(),
    contactNo: document.getElementById('contactNo').value.trim(),
    message: document.getElementById('message').value.trim(),
  };

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies for JWT
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Message sent successfully!');
      this.reset();
    } else {
      alert('❌ Error: ' + data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    alert('❌ Network error. Please try again.');
  }
});
