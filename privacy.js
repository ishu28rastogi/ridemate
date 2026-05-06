// Fade-in on page load
document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("privacy-policy");
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";

    setTimeout(() => {
        section.style.transition = "all 0.8s ease";
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
    }, 200);
});

// Scroll reveal animation
const revealItems = document.querySelectorAll(
    "#privacy-policy h2, #privacy-policy p, .policy-footer"
);

revealItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
});

const revealOnScroll = () => {
    revealItems.forEach(item => {
        const top = item.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
            item.style.transition = "all 0.6s ease";
        }
    });
};

window.addEventListener("scroll", revealOnScroll);