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

    // Book Appointment functionality
    initializeAppointmentForm();
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

function initializeAppointmentForm() {
    const form = document.getElementById('appointment-form');
    const serviceSelect = document.getElementById('service');
    const otherServiceLabel = document.getElementById('other-service-label');
    const otherServiceInput = document.getElementById('other-service');

    serviceSelect.addEventListener('change', () => {
        if (serviceSelect.value === 'Other') {
            otherServiceLabel.style.display = 'block';
            otherServiceInput.style.display = 'block';
            otherServiceInput.required = true;
        } else {
            otherServiceLabel.style.display = 'none';
            otherServiceInput.style.display = 'none';
            otherServiceInput.required = false;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value || null,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            service: serviceSelect.value === 'Other' ? otherServiceInput.value : serviceSelect.value,
            budget: document.getElementById('budget').value,
            event_date: document.getElementById('event-date').value,
            event_location: document.getElementById('event-location').value
        };

        try {
            const response = await fetch('/.netlify/functions/bookAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showConfirmationCard();
                form.reset();
                otherServiceLabel.style.display = 'none';
                otherServiceInput.style.display = 'none';
                // Close the appointment modal if it exists
                const appointmentModal = document.getElementById('appointment-modal');
                if (appointmentModal) {
                    appointmentModal.style.display = 'none';
                }
            } else {
                showCustomModal('Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showCustomModal('An error occurred. Please try again.');
        }
    });
}

function showCustomModal(message) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>${message}</p>
            <button class="custom-modal-ok-button">OK</button>
        </div>
    `;
    document.body.appendChild(modal);

    // Use event delegation
    modal.addEventListener('click', function(event) {
        if (event.target.classList.contains('custom-modal-ok-button')) {
            document.body.removeChild(modal);
        }
    });
}

function showConfirmationCard() {
    document.getElementById('appointment-modal').style.display = 'none';
    document.getElementById('confirmation-card').style.display = 'block';
    
    // Trigger confetti animation
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Hide the confirmation card after 5 seconds
    setTimeout(() => {
        document.getElementById('confirmation-card').style.display = 'none';
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    const appointmentLink = document.querySelector('a[href="#book-appointment"]');
    const appointmentModal = document.getElementById('appointment-modal');

    if (appointmentLink && appointmentModal) {
        appointmentLink.addEventListener('click', function(e) {
            e.preventDefault();
            appointmentModal.style.display = 'block';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('appointment-modal');
    var closeBtn = modal.querySelector('.close');

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

function lazyLoadBackgroundImages() {
    const slides = document.querySelectorAll('.slide');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slide = entry.target;
                const src = slide.getAttribute('data-src');
                if (src) {
                    slide.style.backgroundImage = `url(${src})`;
                    slide.removeAttribute('data-src');
                    observer.unobserve(slide);
                }
            }
        });
    }, {rootMargin: "0px 0px 200px 0px"});

    slides.forEach(slide => observer.observe(slide));
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', lazyLoadBackgroundImages);