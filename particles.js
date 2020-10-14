//Initialise particles container canvas
const particlesContainer = document.getElementById("particle-container");
const context = particlesContainer.getContext("2d");
particlesContainer.width = window.innerWidth;
particlesContainer.height = window.innerHeight;
//Global array of particles
let particlesArray;

//Create particle
class Particle {
    //Construct particle with specified values
    constructor(x, y, dirX, dirY, radius, colour) {
        //Initialise variables to parameters
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.radius = radius;
        this.colour = colour;
    }
    //Draw circular particle
    draw() {
        //Create arc of x, y, radius, startAngle, endAngle (radians) to create circle
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //Fill circle in specified colour
        context.fillStyle = this.colour;
        context.fill();
    }
    //Update particle each animation frame
    update() {
        //Move particle by velocity
        this.x += this.dirX;
        this.y += this.dirY;
        //Draw updated position
        this.draw();
    }
}

//Populate array with randomly generated particles
function createParticles() {
    //Initialise to empty array if not already empty
    particlesArray = [];
    //Create population of particles
    let numParticles = (particlesContainer.width * particlesContainer.height) / 5000;
    for(let i = 0; i < numParticles; i++) {
        //Randomly set radius between 1 and 5
        let radius = (Math.random() * 5) + 1;
        //Set particle position within container, accounting for particle diameter as buffer
        let x = (Math.random() * ((particlesContainer.width - radius * 2) - (radius * 2)) + radius * 2);
        let y = (Math.random() * ((particlesContainer.height - radius * 2) - (radius * 2)) + radius * 2);
        //Set particle velocity between -2.5 and 2.5
        let dirX = (Math.random() * 5) - 2.5;
        let dirY = (Math.random() * 5) - 2.5;
        //Set particle colour
        let colour = '#E3E6EC';
        //Create new particle and push to array
        particlesArray.push(new Particle(x, y, dirX, dirY, radius, colour));
    }
}

//Animation loop to update frames
function animateParticles() {
    //Update every animation frame
    requestAnimationFrame(animateParticles);
    //Clear drawn particles within container boundaries
    context.clearRect(0, 0, particlesContainer.width, particlesContainer.height);
    //For each particle
    for(let particle of particlesArray) {
        //Update particle
        particle.update();
    }
}

//Initialise particles
createParticles();
animateParticles();