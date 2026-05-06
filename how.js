// Fade-in animation on page load
document.addEventListener("DOMContentLoaded", () => {
    const howSection = document.querySelector(".how-card");

    howSection.style.opacity = "0";
    howSection.style.transform = "translateY(30px)";

    setTimeout(() => {
        howSection.style.transition = "all 0.8s ease";
        howSection.style.opacity = "1";
        howSection.style.transform = "translateY(0)";
    }, 200);
});

// Scroll reveal
const revealElements = document.querySelectorAll(
    ".how-card h3, .how-card p"
);

// Initial hidden state
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
});

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.transition = "all 0.6s ease";
        }
    });
};

window.addEventListener("scroll", revealOnScroll);
