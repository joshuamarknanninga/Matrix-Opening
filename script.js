// script.js
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrix = "Dude this is the phrase I want to use.";
const font_size = 16;
const columns = canvas.width / font_size; // number of columns for the rain
const drops = [];

// Initialize the drops array
for (let x = 0; x < columns; x++)
    drops[x] = 1; 

// Drawing the characters
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0'; // Green text
    ctx.font = font_size + 'px arial';

    for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        if (drops[i] * font_size > canvas.height && Math.random() > 0.975)
            drops[i] = 0;

        drops[i]++;
    }
}

setInterval(draw, 33);
