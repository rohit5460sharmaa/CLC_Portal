// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Team member bio toggles
    const bioToggles = document.querySelectorAll('.bio-toggle');
    
    bioToggles.forEach(button => {
        button.addEventListener('click', function() {
            const teamMember = this.closest('.team-member');
            const bio = teamMember.querySelector('.member-bio');
            
            bio.classList.toggle('hidden');
            
            if (bio.classList.contains('hidden')) {
                this.textContent = 'Read Bio';
            } else {
                this.textContent = 'Hide Bio';
            }
        });
    });

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Animated counters
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 200; // Lower is faster
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to animate counters
    function animateCounters() {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                const target = +counter.getAttribute('data-target');
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / counterSpeed;
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
            }
        });
    }
    
    // Initial check on page load
    animateCounters();
    
    // Check again on scroll
    window.addEventListener('scroll', animateCounters);
    
    // Add scroll to top button functionality
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.style.position = 'fixed';
    scrollTopBtn.style.bottom = '20px';
    scrollTopBtn.style.right = '20px';
    scrollTopBtn.style.zIndex = '99';
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.visibility = 'hidden';
    scrollTopBtn.style.width = '40px';
    scrollTopBtn.style.height = '40px';
    scrollTopBtn.style.borderRadius = '50%';
    scrollTopBtn.style.backgroundColor = 'var(--indigo-600)';
    scrollTopBtn.style.color = 'white';
    scrollTopBtn.style.border = 'none';
    scrollTopBtn.style.cursor = 'pointer';
    scrollTopBtn.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Add animation to services on scroll
    const services = document.querySelectorAll('.service-card');
    
    function animateServices() {
        services.forEach((service, index) => {
            if (isInViewport(service) && !service.classList.contains('animated')) {
                service.classList.add('animated');
                service.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                service.style.opacity = '0';
            }
        });
    }
    
    // Add CSS animation for fadeIn
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initial check on page load
    animateServices();
    
    // Check again on scroll
    window.addEventListener('scroll', animateServices);
    
    // Add hover effect to team members
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});