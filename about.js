// Fade-in animation on page load
document.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.getElementById("about-us");
    aboutSection.style.opacity = "0";
    aboutSection.style.transform = "translateY(30px)";

    setTimeout(() => {
        aboutSection.style.transition = "all 0.8s ease";
        aboutSection.style.opacity = "1";
        aboutSection.style.transform = "translateY(0)";
    }, 200);
});

// Scroll reveal for headings
const revealElements = document.querySelectorAll("#about-us h2, #about-us p, #about-us ul");

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