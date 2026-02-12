const menuButton = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.section-reveal').forEach((section) => observer.observe(section));

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    const name = document.getElementById('name')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const message = document.getElementById('message')?.value?.trim() || '';
    if (!name || !email || !message) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const subject = encodeURIComponent(`Buildora Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=Buildoradigitalonline@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailComposeUrl, '_blank', 'noopener');
  });
}
