
// Menu bar animation
const menuBar = document.getElementById('menu-bar');
const hamburgerIcon = document.getElementById('hamburger-icon');

hamburgerIcon.addEventListener('click', () => {
    menuBar.classList.toggle('visible');
    // menuBar.animate([
    //     {transform: 'translateX(-100%)'},
    //     {transform: 'translateX(0)'},
    // ], {
    //     duration: 1000,
    //     iterations: 1,
    //     fill: 'forwards'
    // });
});