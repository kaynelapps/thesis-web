document.addEventListener('DOMContentLoaded', function() {
    
    // ==============================================
    // GLOBAL VARIABLES & CONFIGURATION
    // ==============================================
    
    let isLoading = false;
    let animationQueue = [];
    const primaryColor = '#9D4EDD';
    const secondaryColor = '#FF48B0';
    
    // ==============================================
    // CTA BUTTON FUNCTIONALITY
    // ==============================================
    
    const startButtons = document.querySelectorAll('#start-generating, #start-generating-bottom');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    startButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isLoading) return;
            isLoading = true;
            
            // Show loading overlay
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.opacity = '1';
                }, 10);
            }
            
            // Add loading state to button
            button.classList.add('loading');
            const buttonText = button.querySelector('.button-text');
            const originalText = buttonText.textContent;
            buttonText.textContent = 'Loading...';
            button.disabled = true;
            
            // Track button click analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'CTA',
                    'event_label': 'Start Generating Thesis',
                    'value': 1
                });
                
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
                });
            }
            
            // Store user intent
            storage.set('user_intent', {
                timestamp: Date.now(),
                source: button.id,
                page: window.location.pathname
            });
            
            // Redirect to Flutter app after loading animation
            setTimeout(() => {
                window.location.href = './app.html';
            }, 1800);
        });
    });
    
    // ==============================================
    // SCROLL ANIMATIONS & INTERSECTION OBSERVER
    // ==============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
                
                // Trigger any custom animations
                if (entry.target.hasAttribute('data-animation')) {
                    const animationType = entry.target.getAttribute('data-animation');
                    triggerCustomAnimation(entry.target, animationType);
                }
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.benefit-card, .step, .hero-visual, .trust-indicators, .testimonial-card, .feature-row, .faq-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(el);
    });
    
    // ==============================================
    // BUTTON HOVER EFFECTS & INTERACTIONS
    // ==============================================
    
    startButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('loading')) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = `0 8px 30px ${primaryColor}80`;
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('loading')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = `0 4px 20px ${primaryColor}50`;
            }
        });
        
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // ==============================================
    // FEATURE CARDS STAGGER ANIMATION
    // ==============================================
    
    const featureCards = document.querySelectorAll('.benefit-card');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.classList.add('card-animated');
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });
    
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        staggerObserver.observe(card);
    });
    
    // ==============================================
    // MOCKUP SCREEN INTERACTIONS
    // ==============================================
    
    const mockupScreen = document.querySelector('.mockup-screen');
    if (mockupScreen) {
        // Add subtle hover effect to mockup
        mockupScreen.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(8deg) scale(1.02)';
            this.style.boxShadow = `0 20px 40px ${primaryColor}30`;
        });
        
        mockupScreen.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(1)';
            this.style.boxShadow = `0 10px 30px ${primaryColor}20`;
        });
        
        // Simulate typing in the mockup field
        const mockupInput = document.querySelector('.field-input');
        if (mockupInput) {
            const texts = [
                'The Impact of AI on Education...',
                'Machine Learning in Healthcare...',
                'Sustainable Energy Solutions...',
                'Digital Marketing Strategies...',
                'Climate Change and Policy...',
                'Blockchain Technology Applications...'
            ];
            let currentIndex = 0;
            
            function typeText(text, element, callback) {
                element.textContent = '';
                let i = 0;
                const typeInterval = setInterval(() => {
                    element.textContent += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeInterval);
                        if (callback) callback();
                    }
                }, 100);
            }
            
            function startTypingCycle() {
                typeText(texts[currentIndex], mockupInput, () => {
                    setTimeout(() => {
                        currentIndex = (currentIndex + 1) % texts.length;
                        startTypingCycle();
                    }, 3000);
                });
            }
            
            // Start the typing animation after a delay
            setTimeout(startTypingCycle, 2000);
        }
    }
    
    // ==============================================
    // FAQ FUNCTIONALITY
    // ==============================================
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = '0';
                    q.nextElementSibling.style.opacity = '0';
                }
            });
            
            // Toggle current FAQ
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                
                // Track FAQ interaction
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'faq_open', {
                        'event_category': 'Engagement',
                        'event_label': this.textContent.trim()
                    });
                }
            } else {
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
            }
        });
    });
    
    // ==============================================
    // STATS COUNTER ANIMATION
    // ==============================================
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas
            const formattedNumber = Math.floor(current).toLocaleString();
            element.textContent = formattedNumber + (element.textContent.includes('%') ? '%' : '');
        }, 16);
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // ==============================================
    // SMOOTH SCROLLING FOR INTERNAL LINKS
    // ==============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Track internal navigation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'internal_navigation', {
                        'event_category': 'Navigation',
                        'event_label': this.getAttribute('href')
                    });
                }
            }
        });
    });
    
    // ==============================================
    // SCROLL PROGRESS INDICATOR
    // ==============================================
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
        
        // Update scroll progress bar if it exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }
    
    // ==============================================
    // BACK TO TOP BUTTON
    // ==============================================
    
    const backToTopButton = document.getElementById('back-to-top');
    
    function handleScroll() {
        updateScrollProgress();
        
        // Show/hide back to top button
        if (backToTopButton) {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
                backToTopButton.style.opacity = '1';
            } else {
                backToTopButton.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        backToTopButton.style.display = 'none';
                    }
                }, 300);
            }
        }
    }
    
    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'back_to_top', {
                    'event_category': 'Navigation'
                });
            }
        });
    }
    
    // ==============================================
    // COOKIE BANNER FUNCTIONALITY
    // ==============================================
    
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    
    // Show cookie banner if no preference is set
    if (!storage.get('cookieConsent') && cookieBanner) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
            cookieBanner.style.opacity = '0';
            setTimeout(() => {
                cookieBanner.style.opacity = '1';
            }, 100);
        }, 3000);
    }
    
    if (acceptCookies) {
        acceptCookies.addEventListener('click', function() {
            storage.set('cookieConsent', 'accepted');
            hideCookieBanner();
            
            // Initialize analytics if accepted
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted'
                });
            }
        });
    }
    
        if (declineCookies) {
        declineCookies.addEventListener('click', function() {
            storage.set('cookieConsent', 'declined');
            hideCookieBanner();
            
            // Update analytics consent
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied'
                });
            }
        });
    }
    
    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.style.opacity = '0';
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 300);
        }
    }
    
    // ==============================================
    // TESTIMONIALS CAROUSEL (if exists)
    // ==============================================
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 0) {
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonialCards.forEach((card, i) => {
                card.style.opacity = i === index ? '1' : '0.3';
                card.style.transform = i === index ? 'scale(1)' : 'scale(0.95)';
            });
        }
        
        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        }
        
        // Auto-rotate testimonials
        setInterval(nextTestimonial, 5000);
        showTestimonial(0);
    }
    
    // ==============================================
    // FORM VALIDATION & SUBMISSION
    // ==============================================
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            const errors = [];
            if (!data.name || data.name.trim().length < 2) {
                errors.push('Name must be at least 2 characters');
            }
            if (!data.email || !isValidEmail(data.email)) {
                errors.push('Please enter a valid email address');
            }
            if (!data.message || data.message.trim().length < 10) {
                errors.push('Message must be at least 10 characters');
            }
            
            if (errors.length > 0) {
                showFormErrors(errors);
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            }
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                showFormSuccess();
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormErrors(errors) {
        const errorContainer = document.getElementById('form-errors') || createErrorContainer();
        errorContainer.innerHTML = `
            <div class="error-message">
                <strong>Please fix the following errors:</strong>
                <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
            </div>
        `;
        errorContainer.style.display = 'block';
    }
    
    function showFormSuccess() {
        const successContainer = document.getElementById('form-success') || createSuccessContainer();
        successContainer.innerHTML = `
            <div class="success-message">
                <strong>✅ Message sent successfully!</strong>
                <p>Thank you for your message. We'll get back to you soon.</p>
            </div>
        `;
        successContainer.style.display = 'block';
        setTimeout(() => {
            successContainer.style.display = 'none';
        }, 5000);
    }
    
    function createErrorContainer() {
        const container = document.createElement('div');
        container.id = 'form-errors';
        container.className = 'form-feedback error';
        contactForm.insertBefore(container, contactForm.firstChild);
        return container;
    }
    
    function createSuccessContainer() {
        const container = document.createElement('div');
        container.id = 'form-success';
        container.className = 'form-feedback success';
        contactForm.insertBefore(container, contactForm.firstChild);
        return container;
    }
    
    // ==============================================
    // KEYBOARD NAVIGATION & ACCESSIBILITY
    // ==============================================
    
    // Handle keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
        // Handle Enter/Space on FAQ questions
        if (e.target.classList.contains('faq-question')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        }
        
        // Handle Escape key to close modals/overlays
        if (e.key === 'Escape') {
            if (loadingOverlay && loadingOverlay.style.display === 'flex') {
                loadingOverlay.style.display = 'none';
                isLoading = false;
            }
            if (cookieBanner && cookieBanner.style.display === 'block') {
                hideCookieBanner();
            }
        }
        
        // Handle Tab navigation for better accessibility
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ==============================================
    // FEATURE PREVIEW ITEMS HOVER EFFECTS
    // ==============================================
    
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.background = 'rgba(255, 255, 255, 0.15)';
            this.style.boxShadow = `0 8px 25px ${primaryColor}30`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // ==============================================
    // TRUST INDICATORS ANIMATION
    // ==============================================
    
    const trustItems = document.querySelectorAll('.trust-item');
    trustItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        
        const trustObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.5 });
        
        trustObserver.observe(item);
    });
    
    // ==============================================
    // STEP NUMBERS ANIMATION
    // ==============================================
    
    const stepNumbers = document.querySelectorAll('.step-number');
    stepNumbers.forEach(stepNumber => {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'pulse 0.6s ease-in-out';
                    
                    // Add completion checkmark after animation
                    setTimeout(() => {
                        entry.target.classList.add('completed');
                    }, 600);
                }
            });
        }, { threshold: 0.7 });
        
        stepObserver.observe(stepNumber);
    });
    
    // ==============================================
    // PERFORMANCE MONITORING & WEB VITALS
    // ==============================================
    
    // Monitor Core Web Vitals
    function reportWebVitals(metric) {
        console.log('Web Vital:', metric);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                'event_category': 'Web Vitals',
                'value': Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                'event_label': metric.id,
                'non_interaction': true,
            });
        }
        
        // Store for debugging
        storage.set(`webvital_${metric.name}`, {
            value: metric.value,
            timestamp: Date.now()
        });
    }
    
    // Initialize Web Vitals monitoring (if library is available)
    if (typeof webVitals !== 'undefined') {
        webVitals.getCLS(reportWebVitals);
        webVitals.getFID(reportWebVitals);
        webVitals.getFCP(reportWebVitals);
        webVitals.getLCP(reportWebVitals);
        webVitals.getTTFB(reportWebVitals);
    }
    
    // Basic performance monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            // Track to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': loadTime
                });
            }
            
            // Show performance warning if slow
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
        }
    });
    
    // ==============================================
    // CUSTOM ANIMATIONS & EFFECTS
    // ==============================================
    
    function triggerCustomAnimation(element, animationType) {
        switch (animationType) {
            case 'bounce':
                element.style.animation = 'bounce 0.6s ease-in-out';
                break;
            case 'shake':
                element.style.animation = 'shake 0.5s ease-in-out';
                break;
            case 'glow':
                element.style.animation = 'glow 2s ease-in-out infinite alternate';
                break;
            case 'float':
                element.style.animation = 'float 3s ease-in-out infinite';
                break;
        }
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        }, 16));
    }
    
    // ==============================================
    // SOCIAL SHARING FUNCTIONALITY
    // ==============================================
    
    const socialShareButtons = document.querySelectorAll('.social-share');
    socialShareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                
                // Track social share
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share', {
                        'method': platform,
                        'content_type': 'webpage',
                        'item_id': window.location.pathname
                    });
                }
            }
        });
    });
    
    // ==============================================
    // LAZY LOADING FOR IMAGES
    // ==============================================
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    // ==============================================
    // SEARCH FUNCTIONALITY (if search exists)
    // ==============================================
    
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        function performSearch(query) {
            // Mock search results (replace with actual search logic)
            const mockResults = [
                { title: 'How to write a thesis', url: '#faq' },
                { title: 'AI writing assistance', url: '#benefits' },
                { title: 'Academic formatting', url: '#features' }
            ].filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            
            displaySearchResults(mockResults);
        }
        
               function displaySearchResults(results) {
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            } else {
                searchResults.innerHTML = results.map(result => `
                    <div class="search-result-item">
                        <a href="${result.url}">${result.title}</a>
                    </div>
                `).join('');
            }
            searchResults.style.display = 'block';
        }
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // ==============================================
    // NEWSLETTER SIGNUP
    // ==============================================
    
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Track newsletter signup
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    'event_category': 'Engagement',
                    'event_label': 'Footer Newsletter'
                });
            }
            
            // Simulate API call (replace with actual endpoint)
            setTimeout(() => {
                showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Store subscription status
                storage.set('newsletter_subscribed', {
                    email: email,
                    timestamp: Date.now()
                });
            }, 2000);
        });
    }
    
    // ==============================================
    // NOTIFICATION SYSTEM
    // ==============================================
    
    function showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
    
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }
    
    // ==============================================
    // THEME SWITCHER (if implemented)
    // ==============================================
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = storage.get('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            storage.set('theme', newTheme);
            
            // Track theme change
            if (typeof gtag !== 'undefined') {
                gtag('event', 'theme_change', {
                    'event_category': 'UI',
                    'event_label': newTheme
                });
            }
        });
    }
    
    // ==============================================
    // PRELOAD CRITICAL RESOURCES
    // ==============================================
    
    function preloadCriticalResources() {
        // Preload the Flutter app
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = './app.html';
        document.head.appendChild(link);
        
        // Preload critical images
        const criticalImages = [
            './assets/hero-image.webp',
            './assets/app-mockup.webp'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
        
        // Preload fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    // ==============================================
    // ANALYTICS & TRACKING SETUP
    // ==============================================
    
    function initializeAnalytics() {
        // Track page view
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
            
            // Track user engagement
            gtag('event', 'page_view', {
                'event_category': 'Engagement',
                'event_label': 'Landing Page'
            });
        }
        
        // Track scroll depth
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 100];
        
        window.addEventListener('scroll', throttle(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !storage.get(`scroll_${milestone}`)) {
                        storage.set(`scroll_${milestone}`, true);
                        
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll', {
                                'event_category': 'Engagement',
                                'event_label': `${milestone}%`,
                                'value': milestone
                            });
                        }
                    }
                });
            }
        }, 1000));
        
        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'time_on_page',
                    'value': timeOnPage
                });
            }
        });
    }
    
    // ==============================================
    // ERROR HANDLING & FALLBACKS
    // ==============================================
    
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Track to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error?.toString() || 'Unknown error',
                'fatal': false,
                'event_category': 'Error'
            });
        }
        
        // Ensure CTA buttons still work even if JS fails
        startButtons.forEach(button => {
            if (!button.onclick) {
                button.onclick = function() {
                    window.location.href = './app.html';
                };
            }
        });
        
        // Show user-friendly error message for critical failures
        if (e.error && e.error.message && e.error.message.includes('critical')) {
            showNotification('Something went wrong. Please refresh the page.', 'error', 10000);
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': 'Unhandled promise rejection: ' + e.reason,
                'fatal': false,
                'event_category': 'Error'
            });
        }
    });
    
    // ==============================================
    // INITIALIZATION & STARTUP
    // ==============================================
    
    function initialize() {
        console.log('🎓 Thesis Generator landing page initializing...');
        
        // Initialize analytics
        initializeAnalytics();
        
        // Preload resources
        preloadCriticalResources();
        
        // Add loaded class to body for CSS animations
        document.body.classList.add('loaded');
        
        // Initialize entrance animations
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 100);
        
        // Initialize floating elements animation
        const floatingElements = document.querySelectorAll('.floating');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.5}s`;
        });
        
        console.log('✅ Thesis Generator landing page initialized successfully');
    }
    
    // Start initialization
    initialize();
    
    // ==============================================
    // PUBLIC API (for external scripts)
    // ==============================================
    
    window.ThesisGenerator = {
        showNotification,
        scrollToElement,
        storage,
        triggerCustomAnimation,
        version: '1.0.0'
    };
    
}); // End of DOMContentLoaded

// ==============================================
// UTILITY FUNCTIONS (Available globally)
// ==============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element with offset
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Local storage helpers with error handling
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return false;
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return false;
        }
    }
};

// Device detection utilities
const device = {
    isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: () => /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
    isDesktop: () => !device.isMobile() && !device.isTablet(),
    hasTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isRetina: () => window.devicePixelRatio > 1
};

// Browser detection utilities
const browser = {
    isChrome: () => /Chrome/i.test(navigator.userAgent),
    isFirefox: () => /Firefox/i.test(navigator.userAgent),
    isSafari: () => /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent),
    isEdge: () => /Edge/i.test(navigator.userAgent),
    isIE: () => /MSIE|Trident/i.test(navigator.userAgent)
};

// Performance utilities
const perf = {
    mark: (name) => {
        if ('performance' in window && 'mark' in performance) {
            performance.mark(name);
        }
    },
    measure: (name, startMark, endMark) => {
        if ('performance' in window && 'measure' in performance) {
            performance.measure(name, startMark, endMark);
            const measure = performance.getEntriesByName(name)[0];
            console.log(`${name}: ${measure.duration}ms`);
            return measure.duration;
        }
        return 0;
    }
};

// ==============================================
// CSS ANIMATIONS & KEYFRAMES (Injected via JS)
// ==============================================

const style = document.createElement('style');
style.textContent = `
    /* Ripple effect */
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Pulse animation */
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    /* Bounce animation */
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-30px,0);
        }
        70% {
            transform: translate3d(0,-15px,0);
        }
        90% {
            transform: translate3d(0,-4px,0);
        }
    }
    
    /* Shake animation */
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    /* Glow animation */
    @keyframes glow {
        from {
            box-shadow: 0 0 5px #9D4EDD, 0 0 10px #9D4EDD, 0 0 15px #9D4EDD;
        }
        to {
            box-shadow: 0 0 10px #FF48B0, 0 0 20px #FF48B0, 0 0 30px #FF48B0;
        }
    }
    
    /* Float animation */
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
    }
    
    /* Fade in up */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    /* Slide in left */
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translate3d(-100%, 0, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    /* Slide in right */
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translate3d(100%, 0, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    /* Scale in */
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
        }
        50% {
            opacity: 1;
        }
        to {
            opacity: 1;
            transform: scale3d(1, 1, 1);
        }
    }
    
    /* Rotate in */
    @keyframes rotateIn {
        from {
            opacity: 0;
            transform: rotate3d(0, 0, 1, -200deg);
        }
        to {
            opacity: 1;
            transform: rotate3d(0, 0, 1, 0deg);
        }
    }
    
    /* Loading spinner */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Notification slide in */
    @keyframes notificationSlideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Progress bar fill */
    @keyframes progressFill {
        from { width: 0%; }
        to { width: var(--progress-width, 100%); }
    }
    
    /* Typing cursor */
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    /* Gradient animation */
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    /* Utility classes */
    .loaded .hero-content {
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .feature-item {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .mockup-screen {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .floating {
        animation: float 6s ease-in-out infinite;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid #9D4EDD !important;
        outline-offset: 2px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 12px;
    }
    
    .notification-success {
        border-left: 4px solid #10B981;
    }
    
    .notification-error {
        border-left: 4px solid #EF4444;
    }
    
    .notification-warning {
        border-left: 4px solid #F59E0B;
    }
    
    .notification-info {
        border-left: 4px solid #3B82F6;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6B7280;
        margin-left: auto;
    }
    
    .notification-close:hover {
        color: #374151;
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #9D4EDD, #FF48B0);
        z-index: 9999;
        transition: width 0.3s ease;
    }
    
    .form-feedback {
        margin-bottom: 1rem;
        padding: 1rem;
        border-radius: 8px;
        display: none;
    }
    
    .form-feedback.error {
        background: #FEF2F2;
        border: 1px solid #FECACA;
        color: #DC2626;
    }
    
    .form-feedback.success {
        background: #F0FDF4;
        border: 1px solid #BBF7D0;
        color: #16A34A;
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
    }
    
    .search-result-item {
        padding: 12px 16px;
        border-bottom: 1px solid #F3F4F6;
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-item:hover {
        background: #F9FAFB;
    }
    
    .search-result-item a {
        text-decoration: none;
        color: #374151;
        font-weight: 500;
    }
    
    .search-no-results {
        padding: 16px;
        text-align: center;
        color: #6B7280;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
        
        .feature-item {
            margin-bottom: 1rem;
        }
        
        .step {
            margin-bottom: 2rem;
        }
        
        .step-arrow {
            display: none;
        }
    }
    
    /* Dark theme support */
    [data-theme="dark"] {
        --bg-primary: #1F2937;
        --bg-secondary: #374151;
        --text-primary: #F9FAFB;
        --text-secondary: #D1D5DB;
        --border-color: #4B5563;
    }
    
    [data-theme="dark"] .notification {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .search-results {
        background: var(--bg-secondary);
        border-color: var(--border-color);
    }
    
    [data-theme="dark"] .search-result-item:hover {
        background: var(--bg-primary);
    }
    
    /* Print styles */
    @media print {
        .notification,
        .cookie-banner,
        .back-to-top,
        .loading-overlay {
            display: none !important;
        }
    }
    
    /* High contrast mode */
    @media (prefers-contrast: high) {
        .feature-item,
        .benefit-card,
        .step {
            border: 2px solid currentColor;
        }
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(style);

// ==============================================
// FINAL INITIALIZATION CHECK
// ==============================================

// Ensure everything is loaded properly
window.addEventListener('load', function() {
    console.log('🎯 All resources loaded successfully');
    
    // Final performance check
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            console.log('📊 Performance metrics:', {
                'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
                'TCP Connection': navigation.connectEnd - navigation.connectStart,
                'Request': navigation.responseStart - navigation.requestStart,
                'Response': navigation.responseEnd - navigation.responseStart,
                'DOM Processing': navigation.domContentLoadedEventEnd - navigation.responseEnd,
                'Total Load Time': navigation.loadEventEnd - navigation.navigationStart
            });
        }
    }
    
    // Check for any missing critical elements
    const criticalElements = [
        '#start-generating',
        '.hero-content',
        '.benefits-grid'
    ];
    
    const missingElements = criticalElements.filter(selector => !document.querySelector(selector));
    if (missingElements.length > 0) {
        console.warn('⚠️ Missing critical elements:', missingElements);
    }
    
    // Initialize any remaining features
    initializeRemainingFeatures();
});

function initializeRemainingFeatures() {
    // Add scroll progress bar if not exists
    if (!document.querySelector('.scroll-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    // Add back to top button if not exists
    if (!document.getElementById('back-to-top')) {
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #9D4EDD, #FF48B0);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            display: none;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(157, 78, 221, 0.3);
        `;
        document.body.appendChild(backToTop);
    }
    
    // Final success message
    console.log('✅ Thesis Generator landing page fully loaded and ready!');
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        storage,
        device,
        browser,
        perf,
        debounce,
        throttle,
        isInViewport,
        scrollToElement
    };
}
