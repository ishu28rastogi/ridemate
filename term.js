// Fade-in animation on page load
document.addEventListener("DOMContentLoaded", () => {
    const termSection = document.querySelector(".terms-container");

    termSection.style.opacity = "0";
    termSection.style.transform = "translateY(30px)";

    setTimeout(() => {
        termSection.style.transition = "all 0.8s ease";
        termSection.style.opacity = "1";
        termSection.style.transform = "translateY(0)";
    }, 200);
});

// Scroll reveal
const revealElements = document.querySelectorAll(
    ".terms-container h2, .terms-container p, .terms-container li"
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
