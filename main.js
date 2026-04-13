const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// efecto metálico
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "#bbbbbb");
gradient.addColorStop(0.3, "#e0e0e0");
gradient.addColorStop(0.6, "#a6a6a6");
gradient.addColorStop(1, "#cccccc");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// texto
ctx.fillStyle = "#333";
ctx.font = "14px Arial";
ctx.fillText("Rasca aquí", canvas.width / 2 - 35, canvas.height / 2 + 5);

let isDrawing = false;

canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);
canvas.addEventListener("mousemove", scratch);

canvas.addEventListener("touchstart", () => isDrawing = true);
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", scratchTouch);

function scratch(e) {
    if (!isDrawing) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, 18, 0, Math.PI * 2);
    ctx.fill();

    checkScratch();
}

function scratchTouch(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    checkScratch();
}

// desbloquear interacción
function checkScratch() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
    }

    let percent = transparent / (pixels.length / 4);

    if (percent > 0.5) {
        canvas.style.pointerEvents = "none";
    }
}


const copyBtn = document.getElementById("copyBtn");
const codeText = document.getElementById("code");
const sound = document.getElementById("sound");

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(codeText.innerText);

    sound.currentTime = 0;
    sound.play();

    copyBtn.innerText = "¡Copiado!";
    
    setTimeout(() => {
        copyBtn.innerText = "Copiar";
    }, 2000);
});


const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let pieces = [];

for (let i = 0; i < 150; i++) {
    pieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
}

function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    pieces.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.01);

        if (p.y > confettiCanvas.height) {
            p.y = -10;
            p.x = Math.random() * confettiCanvas.width;
        }

        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(updateConfetti);
}

updateConfetti();

window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});