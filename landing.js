document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('.main-header');
    const scrollContainer = document.querySelector('.landing-container');

    scrollContainer.addEventListener('scroll', () => {
        if (scrollContainer.scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll for Scroll-Down Button & Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Animate on Scroll using Intersection Observer ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: remove class to re-animate on scroll up
                // entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Infinite Carousel Logic ---
    function setupCarousel(carouselId) {
        const carouselTrack = document.getElementById(carouselId);
        if (carouselTrack) {
            const items = Array.from(carouselTrack.children);
            // Duplicate items to create a seamless loop
            items.forEach(item => {
                const clone = item.cloneNode(true);
                carouselTrack.appendChild(clone);
            });
        }
    }

    setupCarousel('carousel-1');
    setupCarousel('carousel-2');

});