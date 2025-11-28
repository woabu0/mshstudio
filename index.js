// -------------------- Configuration Constants --------------------
const CONFIG = {
  ASSETS: {
    LOGO: "./assets/logo.png",
    WHITE_LOGO: "./assets/white-logo.png",
  },
  IMAGE_SERVICES: {
    UNSPLASH_BASE: "https://images.unsplash.com",
    PRAVATAR_BASE: "https://i.pravatar.cc",
    UNSPLASH_PARAMS: "w=800&h=600&fit=crop",
    PRAVATAR_SIZE: 150,
  },
  TIMING: {
    SWIPER_INIT_DELAY: 300,
    SCROLL_DELAY: 100,
    IDLE_CALLBACK_TIMEOUT: 2000,
    SWIPER_AUTOPLAY_DELAY: 4000,
  },
  MESSAGES: {
    FORM_SUCCESS: "Thanks for submitting, we will contact you soon",
  },
  SELECTORS: {
    FEEDBACK_SWIPER: ".feedback .swiper",
    FEEDBACK_PAGINATION: ".feedback .swiper-pagination",
    CONTACT_FORM: "form",
  },
  SWIPER_CONFIG: {
    DEFAULT_SLIDES: 4,
    DEFAULT_SPACE: 20,
    SPEED: 800,
    BREAKPOINTS: {
      MOBILE: { width: 320, slides: 1, space: 15 },
      TABLET: { width: 640, slides: 2, space: 20 },
      DESKTOP: { width: 1024, slides: 3, space: 20 },
      LARGE: { width: 1280, slides: 4, space: 20 },
    },
  },
};

// Helper function to build Unsplash image URL
const buildUnsplashUrl = (photoId) => 
  `${CONFIG.IMAGE_SERVICES.UNSPLASH_BASE}/photo-${photoId}?${CONFIG.IMAGE_SERVICES.UNSPLASH_PARAMS}`;

// Helper function to build Pravatar image URL
const buildPravatarUrl = (imgId) => 
  `${CONFIG.IMAGE_SERVICES.PRAVATAR_BASE}/${CONFIG.IMAGE_SERVICES.PRAVATAR_SIZE}?img=${imgId}`;

// -------------------- Navbar Component --------------------
class Navbar extends HTMLElement {
  connectedCallback() {
    const navItems = [
      { href: "#", text: "Home" },
      { href: "#about", text: "About" },
      { href: "#work", text: "Work" },
      { href: "#contact", text: "Contact" },
    ];

    const navLinks = navItems
      .map(
        (item) => `<a href="${item.href}" aria-label="${item.text}">${item.text}</a>`
      )
      .join("");

    this.innerHTML = `
      <nav>
        <header>
          <a href="#" aria-label="Home">
            <img class="brand" src="${CONFIG.ASSETS.LOGO}" alt="Mshstudio Logo" width="105" height="42" fetchpriority="high" decoding="async" />
          </a>
          <div class="menu">
            <div class="head-btn">
              <i class="fas fa-times close-btn"></i>
            </div>
            ${navLinks}
          </div>
          <div class="head-btn">
            <i class="fas fa-bars menu-btn"></i>
          </div>
        </header>
      </nav>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const menu = this.querySelector(".menu");
    const menuBtn = this.querySelector(".menu-btn");
    const closeBtn = this.querySelector(".close-btn");

    if (menu && menuBtn && closeBtn) {
      menuBtn.addEventListener("click", () => menu.classList.add("active"));
      closeBtn.addEventListener("click", () => menu.classList.remove("active"));
      
      // Close menu when clicking on a link and smooth scroll
      const links = menu.querySelectorAll("a");
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (href && href.startsWith("#")) {
            e.preventDefault();
            menu.classList.remove("active");
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              setTimeout(() => {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
              }, CONFIG.TIMING.SCROLL_DELAY);
            }
          } else {
            menu.classList.remove("active");
          }
        });
      });
    }
  }
}

// -------------------- Footer Component --------------------
class Footer extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    const socialIcons = [
      { icon: "fab fa-facebook-f", label: "Facebook", href: "#" },
      { icon: "fab fa-instagram", label: "Instagram", href: "#" },
      { icon: "fab fa-behance", label: "Behance", href: "#" },
      { icon: "fab fa-linkedin-in", label: "LinkedIn", href: "#" },
      { icon: "fab fa-x-twitter", label: "Twitter", href: "#" },
    ];

    const iconsHTML = socialIcons
      .map(
        (social) =>
          `<a href="${social.href}" aria-label="${social.label}" class="footer-social-link"><i class="${social.icon}"></i></a>`
      )
      .join("");

    const footerLinks = [
      { href: "#", text: "Home" },
      { href: "#about", text: "About" },
      { href: "#work", text: "Work" },
      { href: "#contact", text: "Contact" },
    ];

    const linksHTML = footerLinks
      .map(
        (link) =>
          `<a href="${link.href}" class="footer-link">${link.text}</a>`
      )
      .join("");

    this.innerHTML = `
      <footer>
        <div class="container footer">
          <div class="footer-content">
            <div class="footer-brand">
              <img src="${CONFIG.ASSETS.WHITE_LOGO}" alt="Mshstudio Logo" loading="lazy" width="100" height="50">
              <p>We are glad to see you on our website! We are sure that you will find everything you need for your project.</p>
            </div>
            <div class="footer-links">
              <h4>Quick Links</h4>
              <nav class="footer-nav">
                ${linksHTML}
              </nav>
            </div>
            <div class="footer-social">
              <h4>Follow Us</h4>
              <div class="footer-icons">
                ${iconsHTML}
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p class="copyright">Copyright © ${year} Mshstudio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("custom-navbar", Navbar);
customElements.define("custom-footer", Footer);

// -------------------- Swiper Initialization --------------------
let feedbackSwiper = null;

const initSwiper = () => {
  // Initialize Feedback Swiper
  const feedbackSwiperElement = document.querySelector(CONFIG.SELECTORS.FEEDBACK_SWIPER);
  if (feedbackSwiperElement && typeof Swiper !== "undefined") {
    if (feedbackSwiper) {
      feedbackSwiper.destroy(true, true);
    }
    
    const { SWIPER_CONFIG, TIMING } = CONFIG;
    const { BREAKPOINTS } = SWIPER_CONFIG;
    
    feedbackSwiper = new Swiper(CONFIG.SELECTORS.FEEDBACK_SWIPER, {
      direction: "horizontal",
      loop: true,
      loopedSlides: SWIPER_CONFIG.DEFAULT_SLIDES,
      slidesPerView: SWIPER_CONFIG.DEFAULT_SLIDES,
      spaceBetween: SWIPER_CONFIG.DEFAULT_SPACE,
      speed: SWIPER_CONFIG.SPEED,
      autoHeight: false,
      autoplay: {
        delay: TIMING.SWIPER_AUTOPLAY_DELAY,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: CONFIG.SELECTORS.FEEDBACK_PAGINATION,
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      effect: "slide",
      grabCursor: true,
      keyboard: {
        enabled: true,
      },
      breakpoints: {
        [BREAKPOINTS.MOBILE.width]: {
          slidesPerView: BREAKPOINTS.MOBILE.slides,
          spaceBetween: BREAKPOINTS.MOBILE.space,
        },
        [BREAKPOINTS.TABLET.width]: {
          slidesPerView: BREAKPOINTS.TABLET.slides,
          spaceBetween: BREAKPOINTS.TABLET.space,
        },
        [BREAKPOINTS.DESKTOP.width]: {
          slidesPerView: BREAKPOINTS.DESKTOP.slides,
          spaceBetween: BREAKPOINTS.DESKTOP.space,
        },
        [BREAKPOINTS.LARGE.width]: {
          slidesPerView: BREAKPOINTS.LARGE.slides,
          spaceBetween: BREAKPOINTS.LARGE.space,
        },
      },
    });
  }

  // Work section now uses grid layout, no swiper needed
};

// -------------------- Form Submission --------------------
const handleFormSubmit = (e) => {
  e.preventDefault();
  alert(CONFIG.MESSAGES.FORM_SUCCESS);
  e.target.reset();
};

// -------------------- Data-Driven Content Generation --------------------
const services = [
  {
    title: "UI/UX Design",
    description:
      "By putting users' needs at the forefront, we tell a unique story of your company, juggling with fancy visual elements.",
    icon: "fas fa-palette",
  },
  {
    title: "Technology",
    description:
      "The motto of our development process is creating digital experiences that are both appealing and functional.",
    icon: "fas fa-code",
  },
  {
    title: "Business",
    description:
      "With various tools, our experts can help you expand the target audience and increase brand awareness.",
    icon: "fas fa-chart-line",
  },
];

const expertList = [
  { 
    name: "Healthtech", 
    icon: "fas fa-heartbeat",
    description: "Innovative healthcare solutions and digital health platforms"
  },
  { 
    name: "Fintech", 
    icon: "fas fa-credit-card",
    description: "Secure financial technology and payment systems"
  },
  { 
    name: "E-commarce Tech", 
    icon: "fas fa-shopping-cart",
    description: "Modern e-commerce platforms and online retail solutions"
  },
  { 
    name: "Education", 
    icon: "fas fa-graduation-cap",
    description: "EdTech platforms and digital learning experiences"
  },
  { 
    name: "Foodtech", 
    icon: "fas fa-utensils",
    description: "Food delivery apps and restaurant technology solutions"
  },
  { 
    name: "Traveltech", 
    icon: "fas fa-plane",
    description: "Travel booking platforms and hospitality technology"
  },
  { 
    name: "Real state tech", 
    icon: "fas fa-building",
    description: "Property management and real estate digital solutions"
  },
  { 
    name: "B2B/SAAS", 
    icon: "fas fa-chart-line",
    description: "Enterprise software and business automation tools"
  },
];

const workItems = [
  {
    image: buildUnsplashUrl("1460925895917-afdab827c52f"),
    title: "E-Commerce Platform Redesign",
    description: "A complete redesign of a modern e-commerce platform focusing on user experience and conversion optimization. Features intuitive navigation and seamless checkout process.",
    link: "#",
    tags: ["Web Design", "UX/UI"],
  },
  {
    image: buildUnsplashUrl("1551650975-87deedd944c3"),
    title: "Mobile Banking App",
    description: "Secure and user-friendly mobile banking application with advanced features including biometric authentication, real-time transactions, and financial insights dashboard.",
    link: "#",
    tags: ["App Design", "Fintech"],
  },
  {
    image: buildUnsplashUrl("1551434678-e076c223a692"),
    title: "Healthcare Management System",
    description: "Comprehensive healthcare management platform for hospitals and clinics. Streamlined patient management, appointment scheduling, and medical records system.",
    link: "#",
    tags: ["SAAS", "Healthcare"],
  },
  {
    image: buildUnsplashUrl("1561070791-2526d30994b5"),
    title: "Brand Identity & Logo Design",
    description: "Complete brand identity package including logo design, color palette, typography, and brand guidelines for a modern tech startup. Creating a memorable visual identity.",
    link: "#",
    tags: ["Branding", "Logo Design"],
  },
  {
    image: buildUnsplashUrl("1551288049-bebda4e38f71"),
    title: "SaaS Dashboard Interface",
    description: "Modern and intuitive SaaS dashboard with advanced analytics, customizable widgets, and real-time data visualization. Designed for maximum productivity and user engagement.",
    link: "#",
    tags: ["SAAS Design", "Dashboard"],
  },
  {
    image: buildUnsplashUrl("1552664730-d307ca884978"),
    title: "Travel Booking Platform",
    description: "User-friendly travel booking platform with seamless flight, hotel, and car rental integration. Features smart search filters, price comparison, and instant booking capabilities.",
    link: "#",
    tags: ["Web Design", "Travel Tech"],
  },
  {
    image: buildUnsplashUrl("1561070791-2526d30994b5"),
    title: "Brand Identity & Logo Design",
    description: "Complete brand identity package including logo design, color palette, typography, and brand guidelines for a modern tech startup. Creating a memorable visual identity.",
    link: "#",
    tags: ["Branding", "Logo Design"],
  },
  {
    image: buildUnsplashUrl("1551288049-bebda4e38f71"),
    title: "SaaS Dashboard Interface",
    description: "Modern and intuitive SaaS dashboard with advanced analytics, customizable widgets, and real-time data visualization. Designed for maximum productivity and user engagement.",
    link: "#",
    tags: ["SAAS Design", "Dashboard"],
  },
  {
    image: buildUnsplashUrl("1552664730-d307ca884978"),
    title: "Travel Booking Platform",
    description: "User-friendly travel booking platform with seamless flight, hotel, and car rental integration. Features smart search filters, price comparison, and instant booking capabilities.",
    link: "#",
    tags: ["Web Design", "Travel Tech"],
  },
];

const feedbackItems = [
  {
    image: buildPravatarUrl(47),
    name: "Sarah Johnson",
    text: "Working with Mshstudio was an absolute pleasure! They transformed our outdated website into a modern, user-friendly platform. The attention to detail and creative solutions exceeded our expectations. Highly recommend!",
  },
  {
    image: buildPravatarUrl(12),
    name: "Michael Chen",
    text: "The team at Mshstudio delivered exceptional results on our mobile app project. Their expertise in UX/UI design and development is outstanding. The app has received fantastic feedback from our users. Thank you!",
  },
  {
    image: buildPravatarUrl(9),
    name: "Emily Rodriguez",
    text: "Mshstudio created a stunning brand identity for our startup. From logo design to brand guidelines, everything was executed perfectly. They truly understand how to bring a vision to life. Professional and creative!",
  },
  {
    image: buildPravatarUrl(1),
    name: "David Thompson",
    text: "Outstanding work on our SaaS platform redesign! The new interface is intuitive, beautiful, and has significantly improved user engagement. The team was responsive, professional, and delivered on time. Excellent experience!",
  },
  {
    image: buildPravatarUrl(10),
    name: "Lisa Anderson",
    text: "We've worked with many agencies, but Mshstudio stands out. Their design thinking and technical expertise helped us achieve our goals. The website they built for us has increased our conversions by 40%. Amazing results!",
  },
];

// -------------------- Content Renderers --------------------
const renderServices = () => {
  const serviceSection = document.querySelector(".service");
  if (serviceSection) {
    // Remove existing services container if it exists
    const existingContainer = serviceSection.querySelector(".services-container");
    if (existingContainer) {
      existingContainer.remove();
    }
    
    // Remove old services and lines
    const existingServices = serviceSection.querySelectorAll(".services");
    const existingLines = serviceSection.querySelectorAll(".horizontal-line");
    existingServices.forEach((el) => el.remove());
    existingLines.forEach((el) => el.remove());
    
    // Create services container
    const servicesHTML = `
      <div class="services-container">
        ${services
          .map(
            (service) => `
          <div class="services">
            <div class="services-icon"><i class="${service.icon}"></i></div>
            <h1>${service.title}</h1>
            <p>${service.description}</p>
            <div class="services-arrow"></div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
    
    // Insert services container into the service section
    serviceSection.insertAdjacentHTML("beforeend", servicesHTML);
  }
};

const renderExpertList = () => {
  const container = document.querySelector(".expert-list");
  if (container) {
    container.innerHTML = expertList
      .map((expert) => `
        <div class="expert-card">
          <i class="${expert.icon}"></i>
          <h3>${expert.name}</h3>
          <p>${expert.description}</p>
        </div>
      `)
      .join("");
  }
};

const renderWorkItems = () => {
  const container = document.querySelector(".work-grid");
  if (container) {
    // Only show first 4 items for 2x2 grid
    const itemsToShow = workItems.slice(0, 4);
    container.innerHTML = itemsToShow
      .map(
        (work) => `
      <div class="work-card">
        <div>
          <a href="${work.link}" target="_blank" rel="noopener noreferrer" class="work-card-link" aria-label="View ${work.title}"></a>
          <img src="${work.image}" alt="${work.title}" loading="lazy" width="700" height="700" decoding="async" fetchpriority="low" />
          <div class="work-card-content">
            <h1>${work.title}</h1>
            <p class="work-description">${work.description}</p>
            <div class="work-tags">
              ${work.tags.map((tag) => `<h6>${tag}</h6>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
};

const renderFeedback = () => {
  const swiperWrapper = document.querySelector(".feedback .swiper-wrapper");
  if (swiperWrapper) {
    swiperWrapper.innerHTML = feedbackItems
      .map(
        (feedback) => `
      <div class="swiper-slide">
        <img src="${feedback.image}" alt="${feedback.name}" loading="lazy" width="80" height="80" decoding="async" />
        <h3>${feedback.name}</h3>
        <p>${feedback.text}</p>
      </div>
    `
      )
      .join("");
  }
};

// -------------------- Initialize on DOM Load --------------------
// Use requestIdleCallback for non-critical initialization when available
const initNonCritical = () => {
  // Initialize Swiper after content is rendered (only for feedback)
  if (typeof Swiper !== "undefined") {
    initSwiper();
  } else {
    // Retry if Swiper hasn't loaded yet
    setTimeout(() => {
      if (typeof Swiper !== "undefined") {
        initSwiper();
      }
    }, 100);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Render data-driven content immediately
  renderServices();
  renderExpertList();
  renderWorkItems();
  renderFeedback();
  
  // Attach form submit handler immediately
  const contactForm = document.querySelector(CONFIG.SELECTORS.CONTACT_FORM);
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
  
  // Initialize Swiper when idle or after short delay
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initNonCritical, { timeout: CONFIG.TIMING.IDLE_CALLBACK_TIMEOUT });
  } else {
    setTimeout(initNonCritical, CONFIG.TIMING.SWIPER_INIT_DELAY);
  }
});

// Legacy function for backward compatibility
function sub() {
  alert(CONFIG.MESSAGES.FORM_SUCCESS);
}
