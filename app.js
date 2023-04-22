window.onload = () => {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Collision = Matter.Collision,
        Detector = Matter.Detector,
        Events = Matter.Events;

    let targetColor = 187;
    const hueDiff = 63.5;
    const hueMiddle = 250.5;
    let userColor = 0;

    // create engine
    const engine = Engine.create({
        positionIterations: 30,
        velocityIterations: 30,
    });

    // create renderer
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
        }
    });

    // create runner
    const runner = Runner.create({
        isFixed: false
    });

    // create set number of circles
    const maleCircles = [];
    const femaleCircles = []
    const otherCircles = []
    const allCircles = [];
    const waterBody = [];
    function addCircle(colorType, circleArray, customColor) {
        if (colorType == 0) {
            //187
            currentVal = 187;
            color = `hsl(${currentVal}, 100%, 82%)`
            spawnX = 100
        } else if (colorType == 1) {
            //314
            currentVal = 314;
            color = `hsl(${currentVal}, 100%, 82%)`
            spawnX = 700;
        } else if (colorType == 2) {
            currentVal = customColor;
            color = `hsl(${currentVal}, 100%, 82%)`
            spawnX = 400;
        } else if (colorType == 3) {
            currentVal = '280';
            color = `hsl(${currentVal}, 100%, 82%)`
            spawnX = 400;
        }

        const particleSize = parseInt(document.getElementById('particleSize').value)

        let waterParticle = Bodies.circle(spawnX, 2, particleSize, {
            render: {
                fillStyle: 'blue',
                strokeStyle: 'black',
                lineWidth: 1,
            },
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
        })
        // assign each circle to a DOM element
        waterParticle.domElement = document.createElement('div');
        waterParticle.domElement.style.width = `${particleSize*2}px`;
        waterParticle.domElement.style.height = `${particleSize*2}px`;
        waterParticle.domElement.style.borderRadius = '50%';
        waterParticle.domElement.style.position = 'absolute';
        waterParticle.domElement.style.top = waterParticle.position.y + 'px';
        waterParticle.domElement.style.backgroundColor = color;
        waterParticle.domElement.className = 'water-particle';
        waterParticle.currentColor = currentVal;
        waterParticle.touchedWater = false;

        // add each circle to the DOM
        document.getElementById('fluid-container').appendChild(waterParticle.domElement);
        circleArray.push(waterParticle);
        allCircles.push(waterParticle);
        Composite.add(engine.world, waterParticle);
    }

    // generate slider percentage
    function generatePercentage(slider) {
        let value = document.getElementById(slider).value;
        let percentage = Math.round((value / 500) * 100);
        return percentage;
    }

    function regenerateHue() {
        const totalWater = maleCircles.length + femaleCircles.length;
        const percentageMale = (maleCircles.length/totalWater)*100;
        const percentageFemale = (femaleCircles.length/totalWater)*100;
        const huePowerMale = (percentageMale*127)/100;
        const huePowerFemale = (percentageFemale*127)/100;
        const huePowerMidpointMale = (huePowerMale*hueDiff)/100;
        const huePowerMidpointFemale = (huePowerFemale*hueDiff)/100;
        targetColor = (hueMiddle-huePowerMidpointMale)+huePowerMidpointFemale;
    }

    // add circle based on slider value
    document.getElementById('maleSlider').addEventListener('change', (e) => {
        const sliderValue = e.target.value;
        const currentCircles = maleCircles.length;
        let maleSlider = document.getElementById('maleSlider');
        let interval = setInterval(() => {
            addCircle(0, maleCircles);
            maleSlider.value = maleSlider.value - 1;
            if (document.getElementById('maleSlider').value < 2) {
                console.log(waterBody)
                clearInterval(interval);
            }
        }, 1)
    })

    document.getElementById('femaleSlider').addEventListener('change', (e) => {
        const sliderValue = e.target.value;
        const currentCircles = femaleCircles.length;
        let femaleSlider = document.getElementById('femaleSlider');
        let interval = setInterval(() => {
            addCircle(1, femaleCircles);
            femaleSlider.value = femaleSlider.value - 1;
            if (document.getElementById('femaleSlider').value < 2) {
                console.log(femaleCircles)
                clearInterval(interval);
            }
        }, 1)
    })

    document.getElementById('otherSlider').addEventListener('change', (e) => {
        const sliderValue = e.target.value;
        const currentCircles = otherCircles.length;
        let otherSlider = document.getElementById('otherSlider');
        let interval = setInterval(() => {
            addCircle(2, otherCircles, userColor);
            otherSlider.value = otherSlider.value - 1;
            if (document.getElementById('otherSlider').value < 2) {
                console.log(otherCircles)
                clearInterval(interval);
            }
        }, 1)
    })

    document.getElementById('customHue').addEventListener('input', (e) => {
        userColor = parseInt(e.target.value);
        document.getElementById('hue').innerText = userColor;
        document.getElementById('hueDisplay').style.backgroundColor = `hsl(${userColor}, 100%, 84%)`
    })
    
    document.getElementById('smoothingLevel').addEventListener('change', (e) => {
        smoothingLevel = parseInt(e.target.value);
        document.getElementById('fluid-container').style.filter = `blur(${smoothingLevel}px)`;
    })

    // create borders based on canvas size
    const borderOptions = {
        isStatic: true,
        render: {
            fillStyle: 'black',
            strokeStyle: 'black',
            lineWidth: 1
        }
    }
    const borderLeft = Bodies.rectangle(0, 300, 10, 600, borderOptions);
    const borderRight = Bodies.rectangle(800, 300, 10, 600, borderOptions);
    const ground = Bodies.rectangle(400, 600, 800, 10, borderOptions);
    const ceiling = Bodies.rectangle(400, 0, 800, 10, borderOptions);
    const mouseCollider = Bodies.circle(550, 10, 30, { isStatic: true });
    mouseCollider.domElement = document.createElement('div');
    mouseCollider.domElement.style.position = 'absolute';
    mouseCollider.domElement.style.backgroundColor = 'red';
    mouseCollider.domElement.style.borderRadius = '50%';
    mouseCollider.domElement.style.width = '60px';
    mouseCollider.domElement.style.height = '60px';
    //document.getElementById('border').appendChild(mouseCollider.domElement)

    Composite.add(engine.world, [borderLeft, borderRight, ground, ceiling]);

    // move mouseCollider to mouse position over container element
    let timeout;
    document.getElementById('fluid-container').addEventListener('mousemove', (e) => {
        clearTimeout(timeout);
        mouseCollider.position.x = e.clientX;
        mouseCollider.position.y = e.clientY;
        timeout = setTimeout(() => {mouseCollider.isStatic = 'true'}, 50)
    })

    // run the engine
    Runner.run(runner, engine);

    // run the renderer
    Render.run(render);
    Events.on(engine, 'collisionActive', (e) => {
        e.pairs.forEach((pair) => {
            if (!pair.bodyA.domElement || !pair.bodyB.domElement) {
                return
            } else if (pair.bodyA.currentColor != pair.bodyB.currentColor && pair.bodyA.currentColor && pair.bodyB.currentColor) {
                const bodyAcolor = pair.bodyA.currentColor
                const bodyBcolor = pair.bodyB.currentColor
                pair.bodyA.domElement.style.backgroundColor = `hsl(${(bodyAcolor+bodyBcolor)/2}, 100%, 84%)`
                pair.bodyB.domElement.style.backgroundColor = `hsl(${(bodyAcolor+bodyBcolor)/2}, 100%, 84%)`
                pair.bodyA.currentColor = (bodyAcolor+bodyBcolor)/2
                pair.bodyB.currentColor = (bodyAcolor+bodyBcolor)/2
            }
            e.pairs.forEach((pair) => {
                if (!pair.bodyA.touchedWater && pair.bodyB.touchedWater) {
                    pair.bodyA.touchedWater = true;
                } else if (!pair.bodyB.touchedWater && pair.bodyA.touchedWater) {
                    pair.bodyB.touchedWater = true;
                }
            })
        })
    })

    Events.on(engine, 'collisionStart', (e) => {
        e.pairs.forEach((pair) => {
            if (!pair.bodyA.touchedWater && pair.bodyB.touchedWater) {
                pair.bodyA.touchedWater = true;
            } else if (!pair.bodyB.touchedWater && pair.bodyA.touchedWater) {
                pair.bodyB.touchedWater = true;
            }
        })
    })

    Events.on(engine, 'collisionEnd' , (e) => {
        e.pairs.forEach((pair) => {
            pair.bodyA.touchedWater = false;
            pair.bodyB.touchedWater = false;
        })
    })

    // add event listener for debug checkbox
    document.getElementById('debug').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementsByTagName('canvas')[0].style.display = 'inline-block';
        } else {
            document.getElementsByTagName('canvas')[0].style.display = 'none';
        }
    })

    // add event listener for corruption button
    document.getElementById('corruption').addEventListener('click', () => {
        addCircle(3, otherCircles, userColor);
    })

    document.getElementById('shakeButton').addEventListener('click', () => {
        maleCircles.forEach((circle) => {
            Body.applyForce(circle, {x: 400, y: 650}, {x: 0.0001, y: -0.0001})
        })
        femaleCircles.forEach((circle) => {
            Body.applyForce(circle, {x: 400, y: 650}, {x: -0.0001, y: -0.0001})
        })
        otherCircles.forEach((circle) => {
            Body.applyForce(circle, {x: 400, y: 650}, {x: -0.0001, y: -0.0001})
        })
        document.getElementById('border').className = 'shake';
        setTimeout(() => {
            document.getElementById('border').className = '';
        }, 200)
    })

    // add event listener to each circl
    Events.on(engine, 'afterUpdate', () => {
        mouseCollider.domElement.style.left = mouseCollider.position.x + 'px';
        mouseCollider.domElement.style.top = mouseCollider.position.y + 'px';
        Body.setVelocity(mouseCollider, {x: 0.01, y: 0.01});
        maleCircles.forEach((circle, i) => {
            circle.domElement.style.left = circle.position.x + 'px';
            circle.domElement.style.top = circle.position.y + 'px';
            let skip = false;
        })
        femaleCircles.forEach((circle, i) => {
            circle.domElement.style.left = circle.position.x + 'px';
            circle.domElement.style.top = circle.position.y + 'px';
            let skip = false;
        })
        otherCircles.forEach((circle, i) => {
            circle.domElement.style.left = circle.position.x + 'px';
            circle.domElement.style.top = circle.position.y + 'px';
            let skip = false;
        })
        allCircles.forEach((circle, i) => {
            if (circle.position.y > 550) {
                circle.touchedWater = true;
            }
            if (circle.touchedWater && !waterBody.includes(circle)) {
                waterBody.push(circle);
            }
            if (!circle.touchedWater && waterBody.includes(circle)) {
                waterBody.splice(waterBody.indexOf(circle), 1);
                circle.render.fillStyle = 'yellow';
            }
            //prevent circles from clipping through each other
            allCircles.forEach((otherCircle, j) => {
                if (i != j && circle.position.y > otherCircle.position.y - 6 && circle.position.y < otherCircle.position.y + 6 && circle.position.x > otherCircle.position.x - 6 && circle.position.x < otherCircle.position.x + 6) {
                    Body.applyForce(circle, {x: circle.position.x, y: circle.position.y}, {x: 0, y: -0.00015})
                }
            })
        })
        // increase pressure based on the number of circles above the circle
        waterBody.forEach((circle, i) => {
            // split the canvas into a given number of vertical sections, and get the number of circles in each section
            const sections = 10;
            const sectionWidth = 800/sections;
            const sectionHeights = [];
            for (let i = 0; i < sections; i++) {
                sectionHeights.push(1);
            }
            waterBody.forEach((circle) => {
                const section = Math.floor(circle.position.x/sectionWidth);
                sectionHeights[section]++;
            })
            const section = Math.floor(circle.position.x/sectionWidth);
            const pressure = sectionHeights[section] * 0.00001;

            // move high pressure circles towards low pressure circles
            const sectionLeft = section - 1;
            const sectionRight = section + 1;
            if (sectionLeft >= 0 && sectionHeights[sectionLeft] < sectionHeights[section] && sectionHeights[sectionLeft] < sectionHeights[sectionRight]) {
                Body.applyForce(circle, {x: circle.position.x, y: circle.position.y}, {x: -0.00001, y: 0.00001})
            } else if (sectionRight < sections && sectionHeights[sectionRight] < sectionHeights[section] && sectionHeights[sectionRight] < sectionHeights[sectionLeft]) {
                Body.applyForce(circle, {x: circle.position.x, y: circle.position.y}, {x: 0.00001, y: 0.00001})
            }

        })

    })
}