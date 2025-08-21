// Initialize Three.js Scene with enhanced settings
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
});
const container = document.getElementById('simulation-canvas');

if (container) {
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create abstract geometric shapes
    const shapes = [];
    
    // Create main geometric structure
    const torusGeometry = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
    const mainMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const mainShape = new THREE.Mesh(torusGeometry, mainMaterial);
    scene.add(mainShape);
    shapes.push(mainShape);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    for(let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
        if (i % 3 === 0) scales[i/3] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create orbiting spheres
    const orbitingSpheres = [];
    const sphereCount = 5;
    for(let i = 0; i < sphereCount; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.userData.orbit = Math.random() * Math.PI * 2;
        sphere.userData.speed = 0.001 + Math.random() * 0.002;
        sphere.userData.radius = 4 + Math.random() * 2;
        sphere.userData.y = (Math.random() - 0.5) * 4;
        orbitingSpheres.push(sphere);
        scene.add(sphere);
    }

    // Create energy lines
    const linesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3
    });
    const energyLines = [];
    
    for(let i = 0; i < 10; i++) {
        const points = [];
        const lineGeometry = new THREE.BufferGeometry();
        
        for(let j = 0; j < 50; j++) {
            points.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                )
            );
        }
        
        lineGeometry.setFromPoints(points);
        const line = new THREE.Line(lineGeometry, linesMaterial);
        energyLines.push(line);
        scene.add(line);
    }

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9d4edd, 0.8);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    camera.position.z = 15;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    // Animation loop with enhanced effects
    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera movement
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        camera.rotation.y = targetX;
        camera.rotation.x = targetY;

        // Rotate main shape
        mainShape.rotation.x += 0.001;
        mainShape.rotation.y += 0.002;
        mainShape.rotation.z += 0.001;

        // Animate particles
        particles.rotation.y += 0.0005;
        const positions = particles.geometry.attributes.position.array;
        for(let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Animate orbiting spheres
        orbitingSpheres.forEach(sphere => {
            sphere.userData.orbit += sphere.userData.speed;
            sphere.position.x = Math.cos(sphere.userData.orbit) * sphere.userData.radius;
            sphere.position.z = Math.sin(sphere.userData.orbit) * sphere.userData.radius;
            sphere.position.y = sphere.userData.y + Math.sin(Date.now() * 0.001) * 0.5;
        });

        // Animate energy lines
        energyLines.forEach((line, index) => {
            line.rotation.x += 0.001;
            line.rotation.y += 0.002;
            const positions = line.geometry.attributes.position.array;
            for(let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + i + index) * 0.01;
            }
            line.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Enhanced window resize handler
    function handleResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', handleResize);
}

// Floating Cards Animation
const cards = document.querySelectorAll('.info-card');
cards.forEach((card, index) => {
    const speed = parseFloat(card.dataset.speed);
    const randomDelay = Math.random() * 2;
    
    card.style.animation = `float ${6 / speed}s ease-in-out infinite`;
    card.style.animationDelay = `${randomDelay}s`;
    
    // Position cards
    card.style.left = `${20 + (index * 30)}%`;
    card.style.top = `${20 + (index * 20)}%`;
});

// Parallax Scrolling and Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate statistics when they come into view
            if (entry.target.classList.contains('stat-number')) {
                animateNumber(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.process-step, .testimonial-card, .stat-item').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// Number animation function
function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/[^0-9.]/g, ''));
    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = 50; // Update every 50ms
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = element.textContent.replace(/[0-9.]+/, target);
            clearInterval(timer);
        } else {
            element.textContent = element.textContent.replace(/[0-9.]+/, Math.floor(current));
        }
    }, stepTime);
}

// Process Timeline Animation
const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach((step, index) => {
    step.style.animationDelay = `${index * 0.2}s`;
    
    step.addEventListener('mouseenter', () => {
        step.classList.add('active');
    });
    
    step.addEventListener('mouseleave', () => {
        step.classList.remove('active');
    });
});

// Case Study Navigation
const caseStudyBtns = document.querySelectorAll('.case-study-nav .nav-btn');
const testimonialCards = document.querySelectorAll('.testimonial-card');

caseStudyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        caseStudyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show relevant case studies
        const industry = btn.dataset.industry;
        testimonialCards.forEach(card => {
            if (card.dataset.industry === industry || industry === 'all') {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('active'), 100);
            } else {
                card.classList.remove('active');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// Feature Cards Hover Effect
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.1)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'none';
    });
});

// Simulation Tabs and Preview Animations
const simulations = [
    {
        id: 'molecular-sim',
        init: () => {
            // Molecular simulation initialization
            initMolecularSimulation();
        }
    },
    {
        id: 'fluid-sim',
        init: () => {
            // Fluid dynamics simulation initialization
            initFluidSimulation();
        }
    },
    {
        id: 'material-sim',
        init: () => {
            // Material testing simulation initialization
            initMaterialSimulation();
        }
    },
    {
        id: 'quantum-sim',
        init: () => {
            // Quantum simulation initialization
            initQuantumSimulation();
        }
    }
];

// Tab Switching Logic
const tabButtons = document.querySelectorAll('.tab-btn');
const simulationCards = document.querySelectorAll('.simulation-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Show corresponding simulation card
        const targetTab = button.getAttribute('data-tab');
        simulationCards.forEach(card => {
            if (card.id === targetTab) {
                card.classList.add('active');
                // Initialize or reload simulation
                const sim = simulations.find(s => s.id === `${targetTab}-sim`);
                if (sim) sim.init();
            } else {
                card.classList.remove('active');
            }
        });
    });
});

simulations.forEach(sim => {
    const element = document.getElementById(sim.id);
    if (element) {
        sim.init();
    }
});

// Pricing Toggle and Cards Interaction
const billingToggle = document.getElementById('billingToggle');
const priceElements = document.querySelectorAll('.amount');
const monthlyPrices = ['$0', '$99', 'Custom'];
const annualPrices = ['$0', '$79', 'Custom'];

if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        const prices = billingToggle.checked ? annualPrices : monthlyPrices;
        priceElements.forEach((el, index) => {
            if (prices[index] !== 'Custom') {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.textContent = prices[index];
                    el.style.opacity = '1';
                }, 200);
            }
        });
    });
}

const pricingCards = document.querySelectorAll('.pricing-card');
const featuredCard = document.querySelector('.pricing-card.featured');

pricingCards.forEach(card => {
    if (!card.classList.contains('featured')) {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(c => {
                if (c !== featuredCard) {
                    c.style.transform = 'scale(0.98)';
                }
            });
            card.style.transform = 'scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            pricingCards.forEach(c => {
                if (c !== featuredCard) {
                    c.style.transform = 'scale(1)';
                }
            });
        });
    }
});

// AI Assistant
const aiTrigger = document.querySelector('.ai-trigger');
if (aiTrigger) {
    aiTrigger.addEventListener('click', () => {
        // AI chat implementation
        console.log('AI Assistant clicked');
    });
}

// Particle Effect
function createParticles() {
    const container = document.querySelector('.particle-container');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        container.appendChild(particle);
    }
}

// Initialize particle effect
createParticles();

// CTA Section Enhancements
function initializeCTASection() {
    // Company logo hover effect
    const companyLogos = document.querySelectorAll('.company-logo');
    companyLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.1)';
            logo.style.filter = 'grayscale(0) brightness(1)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1)';
            logo.style.filter = 'grayscale(1) brightness(2)';
        });
    });

    // Highlight items animation
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('animate-on-scroll');
        observer.observe(item);
    });

    // Quick start steps hover effect
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            step.style.transform = 'translateY(-5px)';
            step.style.background = 'rgba(255, 255, 255, 0.05)';
        });

        step.addEventListener('mouseleave', () => {
            step.style.transform = 'translateY(0)';
            step.style.background = 'rgba(255, 255, 255, 0.03)';
        });
    });

    // Trust metrics counter animation
    const trustMetrics = document.querySelectorAll('.trust-metrics .metric-value');
    trustMetrics.forEach(metric => {
        observer.observe(metric);
    });
}

// Initialize CTA section enhancements
document.addEventListener('DOMContentLoaded', () => {
    initializeCTASection();
});

// Footer Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Animate the button to show success
        const submitBtn = newsletterForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✓ Subscribed!';
        submitBtn.style.background = 'var(--color-accent)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            newsletterForm.reset();
        }, 2000);
    });
}

// Footer Certification Badges Animation
const certBadges = document.querySelectorAll('.cert-badge');
certBadges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.1)';
    });
    
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
    });
});

// Footer Social Links Hover Effect
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
