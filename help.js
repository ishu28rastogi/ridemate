// Fade-in animation on page load
document.addEventListener("DOMContentLoaded", () => {
    const helpSection = document.querySelector(".help-card");

    helpSection.style.opacity = "0";
    helpSection.style.transform = "translateY(30px)";

    setTimeout(() => {
        helpSection.style.transition = "all 0.8s ease";
        helpSection.style.opacity = "1";
        helpSection.style.transform = "translateY(0)";
    }, 200);
});

// Scroll reveal for headings and content
const revealElements = document.querySelectorAll(
    ".help-card h3, .help-card p"
);

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

// Initial hidden state
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
});

window.addEventListener("scroll", revealOnScroll);
