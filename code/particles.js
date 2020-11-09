//Initialise particles container canvas
const particlesContainer = document.getElementById("particle-container");
const context = particlesContainer.getContext("2d");
particlesContainer.width = window.innerWidth;
particlesContainer.height = window.innerHeight;

//Global array of particles
let particlesArray;
//Global mouse object
let mouse = {
    x: null,
    y: null,
    radius: calculateMouseRadius()
}

//Calculate mouse radius relative to container size
function calculateMouseRadius() {
    return (particlesContainer.width / 100) * (particlesContainer.height / 100);
}

//Update mouse position on movement
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
//Resize particles container on window resize
window.addEventListener("resize", () => {
    particlesContainer.width = window.innerWidth;
    particlesContainer.height = window.innerHeight;
    mouse.radius = calculateMouseRadius();
});
//Prevent mouse interaction when outside canvas
window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
});
//Expand mouse radius when mouse button held down
window.addEventListener("mousedown", () => {
    mouse.radius *= 1.25;
});
//Shrink mouse radius to original size when mouse button released
window.addEventListener("mouseup", () => {
    mouse.radius = calculateMouseRadius();
})

//Create particle
class Particle {
    //Construct particle with specified values
    constructor(x, y, dirX, dirY, radius, opacity, colour) {
        //Initialise variables to parameters
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.radius = radius;
        this.opacity = opacity;
        this.colour = colour;
    }
    //Draw circular particle
    draw() {
        //Create arc of x, y, radius, startAngle, endAngle (radians) to create circle
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //Set opacity of particle
        context.globalAlpha = this.opacity;
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
        //Perform collision check when mouse within boundaries
        if(mouse.x !== null && mouse.y !== null) {
            //Calculate distance between particle and cursor
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt((dx * dx) + (dy * dy));
            //Calculate normal from particle to mouse
            let normalVector = {
                x: dx / distance,
                y: dy / distance
            };
            //Set base repulsion factor to 0 (no collision)
            let repulsionFactor = 0;
            //If particle colliding with mouse
            if(distance < mouse.radius) {
                //Amplifies repulsion for stronger field
                let velocity = 100;
                //Calculate repulsion factor as ratio between distance and mouse radius
                repulsionFactor = (1 - (distance/mouse.radius)) * velocity;
            }
            //Move particle along normal by repulsion factor
            this.x += normalVector.x * repulsionFactor;
            this.y += normalVector.y * repulsionFactor;
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
    let numParticles = (particlesContainer.width * particlesContainer.height) / 3000;
    for(let i = 0; i < numParticles; i++) {
        //Randomly set radius between 0.5 and 2.5
        let radius = (Math.random() * 2.5) + 0.5;
        //Set particle position within container
        let x = getRandomCoordinateInBoundary(particlesContainer.width, radius);
        let y = getRandomCoordinateInBoundary(particlesContainer.height, radius);
        //Set particle speed between 0.05 and 1.5 with random direction
        let dirX = ((Math.random() * 1.5) + 0.05) * (Math.random() < 0.5 ? -1 : 1);
        let dirY = ((Math.random() * 1.5) + 0.05) * (Math.random() < 0.5 ? -1 : 1);
        //Set particle opacity between 0.1 and 1
        let opacity = (Math.random() * (1 - 0.1)) + 0.1;
        //Set particle colour
        let colour = '#E3E6EC';
        //Create new particle and push to array
        particlesArray.push(new Particle(x, y, dirX, dirY, radius, opacity, colour));
    }
}

//Return x/y coordinate value within container boundary
function getRandomCoordinateInBoundary(length, radius) {
    //Return position within boundary, accounting for particle diameter as buffer
    return (Math.random() * ((length - radius * 2) - (radius * 2)) + radius * 2);
}

function connectParticles() {
    //For each particle
    for(let a = 0; a < particlesArray.length; a++) {
        //For each particle after a
        for(let b = a; b < particlesArray.length; b++) {
            //Calculate distance between two particles
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt((dx * dx) + (dy * dy));
            //If particles within close proximity
            if(distance < 60) {
                //Set line colour
                context.strokeStyle = '#ECF0F3';
                //Set line opacity based on distance
                context.globalAlpha = 0.7 - (distance / 100);;
                //Set line width based on distance
                context.lineWidth = 1 + (distance / 75);
                //Draw line from particle A to particle B
                context.beginPath();
                context.moveTo(particlesArray[a].x, particlesArray[a].y);
                context.lineTo(particlesArray[b].x, particlesArray[b].y);
                context.stroke();
            }
        }
    }
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
    //Connect particles by distance
    connectParticles();
}

//Initialise particles
createParticles();
animateParticles();