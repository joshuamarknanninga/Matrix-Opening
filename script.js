// script.js
const canvas = document.getElementById('matrix-canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

if (!gl) {
    alert("WebGL isn't supported in your browser.");
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the viewport
gl.viewport(0, 0, canvas.width, canvas.height);

// Clear the canvas with a black color
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Vertex Shader
const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    
    void main(void) {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
    }
`;

// Fragment Shader
const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    
    uniform sampler2D u_image;
    uniform vec4 u_color;
    uniform float u_time;

    void main(void) {
        vec2 uv = vec2(v_texCoord.x, mod(v_texCoord.y + u_time * 0.05, 1.0));
        vec4 color = texture2D(u_image, uv) * u_color;
        gl_FragColor = vec4(color.rgb, color.a);
    }
`;

// Compile shader
function compileShader(gl, shaderSource, shaderType) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed: ', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

// Link the program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking failed: ', gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Define the vertices for a full-screen quad
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0,  1.0,
    1.0,  1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Load text texture (using canvas 2D to render text onto a texture)
const textCanvas = document.createElement('canvas');
textCanvas.width = canvas.width;
textCanvas.height = canvas.height;
const textCtx = textCanvas.getContext('2d');

const font_size = 16; // Define font size

function updateTextTexture(text, color) {
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    textCtx.fillStyle = color;
    textCtx.font = `${font_size}px 'Press Start 2P', monospace`;
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';

    // Create a matrix effect by drawing the text multiple times
    for (let y = 0; y < textCanvas.height; y += font_size) {
        for (let x = 0; x < textCanvas.width; x += font_size) {
            const char = text[Math.floor(Math.random() * text.length)];
            textCtx.fillText(char, x, y);
        }
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.generateMipmap(gl.TEXTURE_2D);
}

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

// Get uniform locations
const colorLocation = gl.getUniformLocation(program, 'u_color');
const timeLocation = gl.getUniformLocation(program, 'u_time');

// Animation loop
function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update time uniform
    gl.uniform1f(timeLocation, time * 0.001);

    // Set text color
    const color = document.getElementById('colorPicker').value;
    const [r, g, b] = hexToRgb(color);
    gl.uniform4f(colorLocation, r / 255, g / 255, b / 255, 1.0);

    // Update the texture on each frame to simulate movement
    updateTextTexture(matrixTextInput.value, color);

    // Draw the quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

const matrixTextInput = document.getElementById('matrixText');
matrixTextInput.addEventListener('input', function() {
    updateTextTexture(this.value, document.getElementById('colorPicker').value);
});

// Initial render
updateTextTexture(matrixTextInput.value, document.getElementById('colorPicker').value);
requestAnimationFrame(render);
