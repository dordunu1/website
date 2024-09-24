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

    // Slideshow
    startSlideshow();

    // Carousel
    initializeCarousel();

    // Book Appointment functionality
    initializeAppointmentForm();

      // Show appointment modal when "Book An Appointment" link in footer is clicked
      const contactBookAppointment = document.getElementById('contact-book-appointment');
      const navBookAppointment = document.getElementById('book-appointment-button');
      const appointmentModal = document.getElementById('appointment-modal');
      const closeModalButton = document.querySelector('.modal-content .close');
  
  
      if (footerBookAppointment && appointmentModal) {
        footerBookAppointment.addEventListener('click', function(event) {
            event.preventDefault();
            appointmentModal.style.display = 'flex';
            console.log('Footer appointment link clicked'); // Add this for debugging
        });
    } else {
        console.error('Footer book appointment link or modal not found'); // Add this for debugging
    }
  
          closeModalButton.addEventListener('click', function() {
              appointmentModal.style.display = 'none';
          });
  
          // Close the modal when clicking outside of it
          window.addEventListener('click', function(event) {
              if (event.target == appointmentModal) {
                  appointmentModal.style.display = 'none';
              }
          });
      }
  );

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

     // Initialize horizontal scrolling
     initializeHorizontalScroll();
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
    const otherServiceCheckbox = document.getElementById('other-service-checkbox');
    const otherServiceInput = document.getElementById('other-service');

    otherServiceCheckbox.addEventListener('change', () => {
        otherServiceInput.style.display = otherServiceCheckbox.checked ? 'block' : 'none';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email') || null,
            phone: formData.get('phone'),
            address: formData.get('address'),
            services: formData.getAll('services'),
            other_service: formData.get('other_service') || null,
            budget: formData.get('budget'),
            event_date: formData.get('event_date'),
            event_location: formData.get('event_location')
        };

        try {
            const response = await fetch('/.netlify/functions/bookAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                showConfirmationCard();
                form.reset(); // Reset the form
                otherServiceInput.style.display = 'none'; // Hide the "Other" input
                // Uncheck all checkboxes
                form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
            } else {
                console.error('Error booking appointment:', result.error);
                alert('Failed to book appointment: ' + result.error);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment: ' + error.message);
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

function initializeHorizontalScroll() {
    const collectionGrid = document.querySelector('.collection-grid');
    if (!collectionGrid) return;

    let isScrolling = false;
    let startX;
    let scrollLeft;

    collectionGrid.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startX = e.touches[0].pageX - collectionGrid.offsetLeft;
        scrollLeft = collectionGrid.scrollLeft;
    });

    collectionGrid.addEventListener('touchend', () => {
        isScrolling = false;
    });

    collectionGrid.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.touches[0].pageX - collectionGrid.offsetLeft;
        const walk = (x - startX) * 2;
        collectionGrid.scrollLeft = scrollLeft - walk;
    });
}

function initializeMobileMenu() {
    const collectionsMenu = document.querySelector('.collections-menu');
    if (collectionsMenu) {
        collectionsMenu.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', initializeMobileMenu);
// Call this function when the page loads
document.addEventListener('DOMContentLoaded', lazyLoadBackgroundImages);