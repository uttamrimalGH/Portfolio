document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const menuButton = document.querySelector('.menu-button');
    const navMenu = document.querySelector('#nav-menu');
    const nav = document.querySelector('nav');
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    const sections = document.querySelectorAll('.section[id]'); // Select sections with IDs for animation and nav highlighting
    const navLinks = document.querySelectorAll('#nav-menu li a');
    const yearSpan = document.getElementById('current-year');

    // --- Modals ---
    const videoModal = document.getElementById('video-modal');
    const clientModal = document.getElementById('client-modal');
    const reelModal = document.getElementById('reel-modal');
    const allModals = [videoModal, clientModal, reelModal];
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // --- Modal Content ---
    const youtubePlayerContainer = document.getElementById('youtube-player-container');
    const clientInfoContainer = document.getElementById('client-info');
    const reelPlayerContainer = document.getElementById('reel-player');

    // --- Modal Navigation ---
    const modalNavigations = document.querySelectorAll('.modal-navigation'); // Select all nav containers
    const prevArrows = document.querySelectorAll('.prev-arrow');
    const nextArrows = document.querySelectorAll('.next-arrow');


    // --- Data ---
    const videos = [
        { id: 'EPoaSIIOVQM', title: 'Corporate Brand Story', type: 'youtube' },
        { id: 'nfWlot6h_JM', title: 'Travel Vlog Highlights', type: 'youtube' },
        { id: 'LXb3EKWsInQ', title: 'Product Demo Reel', type: 'youtube' },
        { id: 'rokGy0huYEA', title: 'Event Recap Montage', type: 'youtube' },
        { id: '6l7J1i1OD_s', title: 'Short Film Trailer', type: 'youtube' },
        { id: 'z_AbfPXTKms', title: 'Music Video Edit', type: 'youtube' },
    ];

    const reels = [
        // Using placeholder IDs and assuming Instagram embed structure
        // Replace with actual INSTAGRAM REEL IDs
        { id: 'Cq1qzQ8gQ7f', title: 'Dynamic Transitions', thumb: 'images/reel-thumb-1.jpg' },
        { id: 'Cq_QZQ9gQ9g', title: 'Fast-Paced Promo', thumb: 'images/reel-thumb-2.jpg' },
        { id: 'CrEdRaUgRrL', title: 'Cinematic Color Grade', thumb: 'images/reel-thumb-3.jpg' },
         // Add more reel objects
    ];

    const clients = [
        // Ensure logoSrc paths match your 'images' folder
        { id: 1, name: 'Creative Agency X', logoSrc: 'images/client-logo-1.png', description: 'Collaborated on multiple high-impact marketing campaigns, providing fast turnarounds and exceptional quality.' },
        { id: 2, name: 'Travel Influencer Ventures', logoSrc: 'images/client-logo-2.png', description: 'Edited weekly travel vlogs, enhancing storytelling and viewer engagement through dynamic cuts and sound design.' },
        { id: 3, name: 'Tech Startup Innovate', logoSrc: 'images/client-logo-3.png', description: 'Produced engaging product launch videos and tutorials, simplifying complex features for a wider audience.' },
        { id: 4, name: 'Local Event Co.', logoSrc: 'images/client-logo-4.png', description: 'Captured and edited vibrant event highlight reels, showcasing the energy and success of their conferences.' }
        // Add more client objects
    ];

    // --- State ---
    let player; // YouTube player instance
    let currentModal = null; // Track the currently open modal
    let currentClientIndex = 0;
    let currentReelIndex = 0;
    let clientLogos = []; // Will be populated after DOM query
    let reelItems = []; // Will be populated after DOM query


    // --- Initialization ---

    function init() {
        populateVideoGrid();
        populateReelsGrid();
        setupEventListeners();
        handleScroll(); // Initial check for scroll position
        animateOnScroll(); // Initial check for visible elements
        updateCopyrightYear();

        // Populate clientLogos and reelItems after grids are populated
        clientLogos = document.querySelectorAll('.client-logo');
        reelItems = document.querySelectorAll('.reel-item .reel-thumbnail'); // Target the thumbnail div for click

        // Add event listeners specifically after population
        addDynamicEventListeners();
    }

    // --- Populate Grids ---

    function populateVideoGrid() {
        const videoGrid = document.getElementById('video-grid');
        if (!videoGrid) return;
        videoGrid.innerHTML = ''; // Clear placeholder
        videos.forEach((video, index) => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            // Use maxresdefault, fallback to hqdefault if needed
            videoItem.innerHTML = `
                <div class="video-thumbnail" data-video-id="${video.id}" data-video-type="${video.type}" data-index="${index}">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" loading="lazy" onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg';">
                    <div class="play-button"></div>
                </div>
                <h3>${video.title}</h3>
            `;
            videoGrid.appendChild(videoItem);
        });
    }

    function populateReelsGrid() {
        const reelsContainer = document.getElementById('reels-container');
         if (!reelsContainer) return;
        reelsContainer.innerHTML = ''; // Clear placeholder
        reels.forEach((reel, index) => {
            const reelItem = document.createElement('div');
            reelItem.className = 'reel-item';
            reelItem.innerHTML = `
                <div class="reel-thumbnail" data-reel-id="${reel.id}" data-index="${index}">
                    <img src="${reel.thumb}" alt="${reel.title}" loading="lazy">
                    <div class="play-button"></div>
                </div>
                <h3>${reel.title}</h3>
            `;
            reelsContainer.appendChild(reelItem);
        });
    }

     // --- Event Listeners Setup ---

    function setupEventListeners() {
        menuButton.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', closeMenuOnClickOutside);
        navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
        scrollToTopButton.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', handleScroll);
        closeModalButtons.forEach(btn => btn.addEventListener('click', closeModal));
        window.addEventListener('click', closeModalsOnClickOutside);
        window.addEventListener('keydown', handleEscKey); // Close modal with Esc key

        // Setup Modal Navigation Arrows
        prevArrows.forEach(arrow => arrow.addEventListener('click', navigateModalPrev));
        nextArrows.forEach(arrow => arrow.addEventListener('click', navigateModalNext));

         // Form submission (preventing default for now, add AJAX later)
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
    }

     function addDynamicEventListeners() {
        // Video item clicks
        document.querySelectorAll('.video-thumbnail').forEach(item => {
            item.addEventListener('click', function() {
                const videoId = this.dataset.videoId;
                const videoType = this.dataset.videoType || 'youtube'; // Default to youtube
                openVideoModal(videoId, videoType);
            });
        });

        // Client logo clicks
        clientLogos.forEach((logo, index) => {
            logo.addEventListener('click', () => {
                currentClientIndex = parseInt(logo.dataset.clientId) - 1; // Assuming client IDs are 1-based
                if(isNaN(currentClientIndex) || currentClientIndex < 0 || currentClientIndex >= clients.length) {
                   currentClientIndex = 0; // Fallback if ID is weird
                }
                openClientModal(currentClientIndex);
            });
        });

        // Reel item clicks
         reelItems.forEach((item) => {
            item.addEventListener('click', function() {
                currentReelIndex = parseInt(this.dataset.index);
                openReelModal(currentReelIndex);
            });
        });
    }

    // --- Mobile Menu ---

    function toggleMobileMenu() {
        navMenu.classList.toggle('show');
        menuButton.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('show');
        menuButton.setAttribute('aria-expanded', isExpanded);
         // Toggle body scroll
        // document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    function closeMenuOnClickOutside(event) {
        if (!nav.contains(event.target) && navMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
    }

    // --- Navigation & Scrolling ---

    function handleNavLinkClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerOffset = nav.offsetHeight + 10; // Dynamic offset + buffer
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            if (navMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleScroll() {
        const scrollPosition = window.pageYOffset;

        // Toggle scrolled class for nav
        nav.classList.toggle('scrolled', scrollPosition > 50);

        // Toggle scroll-to-top button visibility
        scrollToTopButton.classList.toggle('visible', scrollPosition > 300);

        // Update active nav link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - nav.offsetHeight - 50; // Adjusted offset
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Trigger animations
        animateOnScroll();
    }

    // --- Animations ---

    function animateOnScroll() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% visible

        // Observe sections and specific grid containers
        document.querySelectorAll('.section[id], .video-grid, .reels-grid, .blog-grid').forEach(el => {
             // Check if already animated to avoid re-observing if dynamically added later
            if (!el.classList.contains('animate')) {
                observer.observe(el);
            }
        });
    }

     // --- Typed.js ---
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['Video Editor', 'Storyteller', 'Motion Graphics Artist', 'Visual Craftsman'],
            typeSpeed: 60,
            backSpeed: 40,
            loop: true,
            backDelay: 1500,
            smartBackspace: true,
             cursorChar: '_',
        });
    }

    // --- Testimonial Slider ---
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }

     function startTestimonialSlider() {
        stopTestimonialSlider(); // Clear existing interval
         if (testimonialItems.length > 1) {
            showTestimonial(currentTestimonial);
            testimonialInterval = setInterval(nextTestimonial, 6000); // Rotate every 6 seconds
         } else if (testimonialItems.length === 1) {
             showTestimonial(0); // Show the single item if only one exists
         }
    }
     function stopTestimonialSlider() {
         clearInterval(testimonialInterval);
     }

    startTestimonialSlider(); // Initialize


    // --- Modal Handling ---

    function openModal(modalElement) {
        if (!modalElement) return;
        allModals.forEach(m => m.style.display = 'none'); // Close others if any are open
        modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        currentModal = modalElement; // Track the open modal

        // Show/hide navigation based on modal type and item count
        updateModalNavigation(modalElement);
    }

    function closeModal() {
        if (!currentModal) return;
        const modalToClose = currentModal; // Reference the modal before clearing currentModal
        modalToClose.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll

        // Stop YouTube video if playing
        if (modalToClose === videoModal && player && typeof player.stopVideo === 'function') {
            player.stopVideo();
            youtubePlayerContainer.innerHTML = '<div id="youtube-player"></div>'; // Reset player container
            player = null; // Clear player instance
        }
        // Clear reel player
        if (modalToClose === reelModal) {
             reelPlayerContainer.innerHTML = ''; // Clear iframe
        }
         // Clear client info
        if (modalToClose === clientModal) {
             clientInfoContainer.innerHTML = '';
        }
        currentModal = null; // Clear tracker
    }

    function closeModalsOnClickOutside(event) {
        if (currentModal && event.target === currentModal) {
            closeModal();
        }
    }
     function handleEscKey(event) {
        if (event.key === 'Escape' && currentModal) {
            closeModal();
        }
    }

    // Specific Modal Openers
    function openVideoModal(videoId, videoType) {
         if (videoType === 'youtube') {
             loadYoutubeVideo(videoId);
         } else {
             // Handle other video types (e.g., Vimeo, local file) if needed
            youtubePlayerContainer.innerHTML = `<p>Video type "${videoType}" not supported yet.</p>`;
         }
        openModal(videoModal);
    }

    function openClientModal(index) {
         if (index < 0 || index >= clients.length) return;
        currentClientIndex = index;
        const client = clients[currentClientIndex];
        clientInfoContainer.innerHTML = `
            <img src="${client.logoSrc}" alt="${client.name}" loading="lazy">
            <h2>${client.name}</h2>
            <p>${client.description}</p>
        `;
        openModal(clientModal);
    }

     function openReelModal(index) {
         if (index < 0 || index >= reels.length) return;
         currentReelIndex = index;
        const reel = reels[currentReelIndex];
         // Using Instagram's basic embed structure
         // Note: Instagram embeds can be unreliable or require login.
         // Consider alternatives like linking out or using video files if possible.
         reelPlayerContainer.innerHTML = `
            <iframe src="https://www.instagram.com/reel/${reel.id}/embed"
                    frameborder="0"
                    scrolling="no"
                    allowtransparency="true"
                    allowfullscreen="true">
            </iframe>`;
        openModal(reelModal);
    }


    // --- YouTube Player ---
    function loadYoutubeVideo(videoId) {
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
             console.error("YouTube IFrame API not loaded yet.");
             youtubePlayerContainer.innerHTML = '<p>Error loading video player.</p>';
            // Optionally, try loading the API script here if it failed initially
             return;
        }

        // Ensure the target div exists
        if (!document.getElementById('youtube-player')) {
            youtubePlayerContainer.innerHTML = '<div id="youtube-player"></div>';
        }

        // Destroy existing player if any
        if (player && typeof player.destroy === 'function') {
            player.destroy();
        }

        player = new YT.Player('youtube-player', {
            height: '100%', // Responsive height managed by container
            width: '100%',  // Responsive width managed by container
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'modestbranding': 1,
                'rel': 0,
                'controls': 1,
                'showinfo': 0,
                'iv_load_policy': 3 // Don't show annotations
            },
            events: {
                // 'onReady': event => event.target.playVideo() // Autoplay handled by playerVars
            }
        });
    }
     // This function is called by the YouTube IFrame API script once it's ready
     // It needs to be globally accessible
     window.onYouTubeIframeAPIReady = function() {
         console.log("YouTube API Ready");
         // You could potentially trigger loading of a default video here if needed
     };


     // --- Modal Navigation ---
     function updateModalNavigation(modalElement) {
         const navContainer = modalElement.querySelector('.modal-navigation');
         if (!navContainer) return;

         let showNav = false;
         if (modalElement === clientModal && clients.length > 1) {
             showNav = true;
         } else if (modalElement === reelModal && reels.length > 1) {
             showNav = true;
         }
         // Add conditions for video navigation if implemented later

         navContainer.style.display = showNav ? 'flex' : 'none';
     }

     function navigateModalPrev() {
         if (!currentModal) return;

         if (currentModal === clientModal && clients.length > 1) {
             currentClientIndex = (currentClientIndex - 1 + clients.length) % clients.length;
             openClientModal(currentClientIndex); // Re-opens the modal with new content
         } else if (currentModal === reelModal && reels.length > 1) {
             currentReelIndex = (currentReelIndex - 1 + reels.length) % reels.length;
             openReelModal(currentReelIndex);
         }
         // Add video navigation logic here if needed
     }

     function navigateModalNext() {
         if (!currentModal) return;

         if (currentModal === clientModal && clients.length > 1) {
             currentClientIndex = (currentClientIndex + 1) % clients.length;
             openClientModal(currentClientIndex);
         } else if (currentModal === reelModal && reels.length > 1) {
             currentReelIndex = (currentReelIndex + 1) % reels.length;
             openReelModal(currentReelIndex);
         }
         // Add video navigation logic here if needed
     }

    // --- Form Handling & Validation ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    function handleFormSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            // Placeholder for actual submission (e.g., using fetch to send data)
            console.log('Form is valid, simulating submission...');
            updateFormStatus('Sending message...', 'info');

            // Simulate network delay
            setTimeout(() => {
                 // Simulate success
                 updateFormStatus('Thank you! Your message has been sent.', 'success');
                 contactForm.reset(); // Clear the form
                 removeErrorStates(); // Clear error styling

                 // Hide status message after a few seconds
                 setTimeout(() => updateFormStatus('', ''), 4000);

                // Simulate error
                // updateFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');

            }, 1500);

        } else {
             console.log('Form validation failed.');
             updateFormStatus('Please correct the errors above.', 'error');
        }
    }

     function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        // Optional: subject validation
        // const subject = document.getElementById('subject');

        // Reset previous errors
        removeErrorStates();
        updateFormStatus('', ''); // Clear status message

        if (!name || name.value.trim() === '') {
            isValid = false;
            showError(name, 'Please enter your name.');
        }

        if (!email || email.value.trim() === '') {
            isValid = false;
            showError(email, 'Please enter your email address.');
        } else if (!isValidEmail(email.value)) {
            isValid = false;
            showError(email, 'Please enter a valid email address.');
        }

        if (!message || message.value.trim() === '') {
            isValid = false;
            showError(message, 'Please enter your message.');
        } else if (message.value.trim().length < 10) {
             isValid = false;
             showError(message, 'Message should be at least 10 characters long.');
        }

        // Add subject validation if needed
        // if (!subject || subject.value.trim() === '') {
        //     isValid = false;
        //     showError(subject, 'Please enter a subject.');
        // }

        return isValid;
    }

    function showError(input, message) {
         if (!input) return;
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show'); // Make it visible via CSS
        }
        input.classList.add('error'); // Add error class for styling
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorElement ? errorElement.id : ''); // Link error msg
    }

     function removeError(input) {
          if (!input) return;
         const formGroup = input.closest('.form-group');
          if (!formGroup) return;
         const errorElement = formGroup.querySelector('.error-message');
         if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
         input.removeAttribute('aria-describedby');
     }

     function removeErrorStates() {
          const errorInputs = contactForm.querySelectorAll('.error');
          const errorMessages = contactForm.querySelectorAll('.error-message.show');
          errorInputs.forEach(input => removeError(input)); // Use removeError to clear ARIA etc.
     }

    function isValidEmail(email) {
        // Simple regex, consider a more robust one for production
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(String(email).toLowerCase());
    }

    function updateFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`; // type can be 'success', 'error', 'info'
    }


    // --- Footer Year ---
    function updateCopyrightYear() {
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- Run Initialization ---
    init();

}); // End DOMContentLoaded