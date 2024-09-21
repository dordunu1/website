let popup;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    // Initialize popup
    popup = document.createElement('div');
    popup.className = 'collection-popup';
    document.body.appendChild(popup);

    // Testimonial functionality
    initializeTestimonials();

    // Navigation functionality
    initializeNavigation();

    // Collections menu functionality
    initializeCollectionsMenu();

    // Emoji animation
    startEmojiAnimation();

    // Slideshow
    startSlideshow();

    // Carousel
    initializeCarousel();

    // Book Appointment clicks
    initializeAppointmentLinks();
});

function initializeTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) {
        console.error('Testimonial slider not found in the DOM');
        return;
    }

    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    showTestimonial(currentIndex);
    setInterval(nextTestimonial, 5000);
}

function initializeNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });
}

function initializeCollectionsMenu() {
    const collectionsMenu = document.querySelector('.collections-menu');
    const collectionsDropdown = document.querySelector('.collections-dropdown');
    const collectionLinks = document.querySelectorAll('.collections-dropdown a');

    if (collectionsMenu && collectionsDropdown) {
        collectionsMenu.addEventListener('mouseenter', () => {
            collectionsDropdown.style.display = 'block';
        });

        collectionsMenu.addEventListener('mouseleave', () => {
            collectionsDropdown.style.display = 'none';
        });

        collectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                showCollectionPopup(targetId);
                collectionsDropdown.style.display = 'none';
            });
        });
    }
}

function showCollectionPopup(collectionId) {
    popup.innerHTML = `
        <div class="popup-content">
            <div class="collection-header" style="background-image: url('images/${collectionId}9.jpg');">
                <h2>${collectionId.toUpperCase()}</h2>
            </div>
            <div class="collection-grid">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(num => 
                    `<img src="images/${collectionId}${num}.jpg" alt="${collectionId.toUpperCase()} ${num}" onclick="enlargeImage(this.src)">`
                ).join('')}
            </div>
            <button onclick="closePopup()">Close</button>
        </div>
    `;
    popup.style.display = 'flex';
}

function closePopup() {
    if (popup) {
        popup.style.display = 'none';
    }
}

function enlargeImage(imageSrc) {
    const enlargedContainer = document.createElement('div');
    enlargedContainer.className = 'enlarged-image-container';
    enlargedContainer.innerHTML = `
        <img src="${imageSrc}" class="enlarged-image" alt="Enlarged view">
    `;
    document.body.appendChild(enlargedContainer);

    enlargedContainer.addEventListener('click', () => {
        document.body.removeChild(enlargedContainer);
    });

    enlargedContainer.style.display = 'flex';
}

function createFloatingEmoji() {
    const emojis = ['👗', '👠', '👜', '👒', '👚', '👕', '👖', '🧥', '👘', '👙', '🧦', '👛', '🕶️', '👢'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const emojiElement = document.createElement('div');
    emojiElement.classList.add('floating-emoji');
    emojiElement.textContent = emoji;

    const startPositionY = Math.random() * window.innerHeight;
    const endPositionY = Math.random() * window.innerHeight;
    const duration = 15000 + Math.random() * 10000; // 15-25 seconds

    emojiElement.style.left = `${window.innerWidth}px`;
    emojiElement.style.top = `${startPositionY}px`;

    document.getElementById('emoji-container').appendChild(emojiElement);

    const animation = emojiElement.animate([
        { transform: `translate(0, 0)` },
        { transform: `translate(-${window.innerWidth + 100}px, ${endPositionY - startPositionY}px)` }
    ], {
        duration: duration,
        easing: 'linear'
    });

    animation.onfinish = () => {
        emojiElement.remove();
    };
}

function startEmojiAnimation() {
    setInterval(createFloatingEmoji, 1000); // Create a new emoji every second
}

function startSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

function initializeCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let intervalId;

    function startAutoSlide() {
        intervalId = setInterval(() => {
            carousel.scrollLeft += 2;
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft = 0;
            }
        }, 30);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        stopAutoSlide();
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        startAutoSlide();
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        startAutoSlide();
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        stopAutoSlide();
    });

    carousel.addEventListener('touchend', () => {
        isDown = false;
        startAutoSlide();
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    startAutoSlide();
}

function openAppointmentForm() {
    // Check if the form is already open
    if (document.querySelector('.appointment-form-container')) {
        return; // Exit the function if the form is already open
    }

    const formContainer = document.createElement('div');
    formContainer.className = 'appointment-form-container';
    formContainer.style.position = 'fixed';
    formContainer.style.top = '0';
    formContainer.style.left = '0';
    formContainer.style.width = '100%';
    formContainer.style.height = '100%';
    formContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    formContainer.style.display = 'flex';
    formContainer.style.justifyContent = 'center';
    formContainer.style.alignItems = 'center';
    formContainer.style.zIndex = '1000';

    const formContent = `
        <div class="modal-content" style="background-color: white; padding: 50px; border-radius: 5px; max-width: 350px; width: 90%; max-height: 800vh; overflow-y: auto;">
            <span class="close" style="float: right; cursor: pointer;">&times;</span>
            <h2>Book an Appointment</h2>
            <p>Kindly fill out the below with as much detail as you can to enable us provide the best service</p>
            <form id="appointment-form">
                <input type="text" placeholder="NAME* (Firstname Lastname)" required>
                <input type="email" placeholder="EMAIL*" required>
                <input type="tel" placeholder="PHONE*" required>
                <input type="text" placeholder="ADDRESS (Street, City, Country)">
                <select name="service" id="service-type" required>
                    <option value="">Select a service </option>
                    <option value="Wedding Gowns">Wedding Gowns</option>
                    <option value="Reception/Evening Gowns">Reception/Evening Gowns</option>
                    <option value="Bridesmaid Gowns">Bridesmaid Gowns</option>
                    <option value="Veils">Veils</option>
                    <option value="Kente">Kente</option>
                    <option value="Bridal Robes">Bridal Robes</option>
                </select>
                <h3>ENTER BUDGET PER SELECTED PRODUCT HERE (Please refer to price guide BELOW)</h3>
                <input type="text" placeholder="Product - GHC Budget" required>
                <p>All monies paid are not refundable.</p>
                <p>We require 500 cedis commitment for appointment booking. This amount is deducted from the final charge once we settle on your final design.</p>
                <p>We require a 70% deposit before we commence work.</p>
                <p>All digital sketches take at least a month. (cost per digital sketch is 500 cedis)</p>
                <input type="date" placeholder="CEREMONY/EVENT DATE" required>
                <input type="text" placeholder="CEREMONY/EVENT LOCATION" required>
                <button type="submit">BOOK APPOINTMENT</button>
            </form>
        </div>
    `;

    formContainer.innerHTML = formContent;
    document.body.appendChild(formContainer);

    // Prevent scrolling on the body when the modal is open
    document.body.style.overflow = 'hidden';

    function closeForm() {
        document.body.removeChild(formContainer);
        // Re-enable scrolling on the body when the modal is closed
        document.body.style.overflow = '';
    }

    formContainer.addEventListener('click', function(e) {
        if (e.target === formContainer) {
            closeForm();
        }
    });

    formContainer.querySelector('.close').addEventListener('click', closeForm);

    document.getElementById('appointment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Form submitted");
        closeForm();
    });
}

function initializeAppointmentLinks() {
    document.body.addEventListener('click', function(e) {
        const target = e.target.closest('a[href*="book-appointment"]');
        if (target) {
            e.preventDefault();
            openAppointmentForm();
        }
    });
}