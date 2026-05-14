class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }

    update(gravityWells, width, height) {
        gravityWells.forEach(well => {
            const dx = well.x - this.x;
            const dy = well.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Guard against division by zero when particle is on the well
            if (dist < 1) return;

            const force = well.mass / (dist * dist);

            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
        });

        // Apply damping to prevent unbounded velocity growth
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Cap velocity to prevent particles from teleporting across the canvas
        const maxSpeed = 10;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x += width;
        if (this.x > width) this.x -= width;
        if (this.y < 0) this.y += height;
        if (this.y > height) this.y -= height;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class GravityWell {
    constructor(x, y, mass) {
        this.x = x;
        this.y = y;
        this.mass = mass;
    }
}

const canvas = document.getElementById('universeCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const gravityWells = [];

const randomColor = () => `hsl(${Math.random() * 360}, 100%, 50%)`;

for (let i = 0; i < 1000; i++) {
    particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 1 - 0.5,
        Math.random() * 1 - 0.5,
        randomColor()
    ));
}

const addGravityWell = (x, y) => {
    gravityWells.push(new GravityWell(x, y, 1000));
};

canvas.addEventListener('mousedown', (event) => {
    addGravityWell(event.clientX, event.clientY);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update(gravityWells, canvas.width, canvas.height);
        particle.draw(ctx);
    });
    requestAnimationFrame(update);
};

update();