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
        //Respawn particle at new position if outside boundary
        if(this.x < 0 || this.x > particlesContainer.width) {
            this.x = getRandomCoordinateInBoundary(particlesContainer.width, this.radius);
        }
        if(this.y < 0 || this.y > particlesContainer.height) {
            this.y = getRandomCoordinateInBoundary(particlesContainer.height, this.radius);
        }
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
        //Set particle position within container
        let x = getRandomCoordinateInBoundary(particlesContainer.width, radius);
        let y = getRandomCoordinateInBoundary(particlesContainer.height,radius);
        //Set particle speed between 0.05 and 1.5 with random direction
        let dirX = ((Math.random() * 1.5) + 0.05) * (Math.random() < 0.5 ? -1 : 1);
        let dirY = ((Math.random() * 1.5) + 0.05) * (Math.random() < 0.5 ? -1 : 1);
        //Set particle colour
        let colour = '#E3E6EC';
        //Create new particle and push to array
        particlesArray.push(new Particle(x, y, dirX, dirY, radius, colour));
    }
}

//Return x/y coordinate value within container boundary
function getRandomCoordinateInBoundary(length, radius) {
    //Return position within boundary, accounting for particle diameter as buffer
    return (Math.random() * ((length - radius * 2) - (radius * 2)) + radius * 2);
}

//Animation loop to update frames
function animateParticles() {
    //Update every animation frame
    requestAnimationFrame(animateParticles);
    //Clear drawn particles within container boundaries
    context.clearRect(0, 0, particlesContainer.width, particlesContainer.height);
    //For each particle in array
    for(let particle of particlesArray) {
        //Update particle
        particle.update();
    }
}

//Initialise particles
createParticles();
animateParticles();

//Resize particles container on window resize
window.addEventListener("resize", () => {
    particlesContainer.width = window.innerWidth;
    particlesContainer.height = window.innerHeight;
});