// Get the viewport size, and use it to determine if 
// user's device is mostly vertical (i.e. mobile, tablet
// or portrait mode) or mostly horizontal (i.e. desktop, 
// laptop)
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

if (viewportWidth < viewportHeight) {
    console.log("Vertical");
} else {
    console.log("Horizontal");
}