// script.js
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let matrix = document.getElementById('matrixText').value;
const font_size = 16;
const columns = canvas.width / font_size; // number of columns for the rain
const drops = [];

// Initialize the drops array with varying speeds
for (let x = 0; x < columns; x++) {
    drops[x] = {
        y: 1,
        speed: Math.random() * 3 + 1, // Random speed for each column
        alpha: 1, // Alpha for fading effect
    };
}

// Generate a random color with a slight variation
function getRandomColor() {
    return document.getElementById('colorPicker').value;
}

//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// Drawing the characters
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.fillStyle = '#0F0'; // Green text
    ctx.font = font_size + 'px arial';

    for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = getRandomColor(); // Apply random color for each drop
        ctx.globalAlpha = drops[i].alpha; // Apply alpha for fading effect

        const text = matrix[Math.floor(Math.random() * matrix.length)];
        if (Math.random() > 0.95) {
            ctx.font = `bold ${font_size}px arial`; // Apply glow to some characters
            ctx.shadowColor = getRandomColor();
            ctx.shadowBlur = 10;
        } else {
            ctx.font = `${font_size}px arial`;
            ctx.shadowBlur = 0;
        }

        ctx.fillText(text, i * font_size, drops[i].y * font_size);
// Reset drop position to the top once it reaches the bottom
if (drops[i].y * font_size > canvas.height && Math.random() > 0.975) {
    drops[i].y = 0;
    drops[i].speed = Math.random() * 3 + 1; // Reset speed when dropping from the top
    drops[i].alpha = 1; // Reset alpha
}

// Apply speed to the drop
drops[i].y += drops[i].speed;
// Apply fading effect
if (drops[i].y * font_size > canvas.height * 0.5) {
    drops[i].alpha -= 0.01;
}
}

ctx.globalAlpha = 1; // Reset alpha for next frame
}
    

setInterval(draw, 33);

document.getElementById('matrixText').addEventListener('input', function() {
    matrix = this.value;
});
