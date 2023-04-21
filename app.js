window.onload = () => {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Collision = Matter.Collision,
        Detector = Matter.Detector,
        Events = Matter.Events;

    // create engine
    const engine = Engine.create({
        positionIterations: 20,
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
    const runner = Runner.create();

    // create set number of circles
    const circles = [];
    function addCircle() {
        const color = 'blue';

        let waterParticle = Bodies.circle(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600), 5, {
            render: {
                fillStyle: color,
                strokeStyle: 'black',
                lineWidth: 1,
                friction: 0,
            }
        })
        // assign each circle to a DOM element
        waterParticle.domElement = document.createElement('div');
        waterParticle.domElement.style.width = '10px';
        waterParticle.domElement.style.height = '10px';
        waterParticle.domElement.style.borderRadius = '50%';
        waterParticle.domElement.style.position = 'absolute';
        waterParticle.domElement.style.top = waterParticle.position.y + 'px';
        waterParticle.domElement.style.borderColor = 'black';
        waterParticle.domElement.style.backgroundColor = color;
        waterParticle.domElement.className = 'water-particle';

        // add each circle to the DOM
        document.getElementById('fluid-container').appendChild(waterParticle.domElement);

        circles.push(waterParticle);
        Composite.add(engine.world, waterParticle);
    }

    // generate slider percentage
    function generatePercentage(slider) {
        let value = document.getElementById(slider).value;
        let percentage = Math.round((value / 1000) * 100);
        return percentage;
    }

    // add circle based on slider value
    document.getElementById('maleSlider').addEventListener('change', (e) => {
        console.log(generatePercentage('maleSlider'))
        const sliderValue = e.target.value;
        const currentCircles = circles.length;
        if (sliderValue > currentCircles + 2) {
            for (let i = 0; i < sliderValue - currentCircles; i++) {
                addCircle();
            }
        } else if (sliderValue < currentCircles - 2) {
            for (let i = 0; i < currentCircles - sliderValue; i++) {
                const removedCircle = circles.pop();
                document.getElementById('fluid-container').removeChild(removedCircle.domElement);
                Composite.remove(engine.world, removedCircle);
            }
        }
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
    const mouseCollider = Bodies.circle(400, 300, 30, { isStatic: false });

    Composite.add(engine.world, [borderLeft, borderRight, ground, ceiling, mouseCollider]);

    // move mouseCollider to mouse position over container element
    document.getElementById('fluid-container').addEventListener('mousemove', (e) => {
        mouseCollider.position.x = e.clientX;
        mouseCollider.position.y = e.clientY;
    })

    // freeze mouseCollider on mouseout
    document.getElementById('fluid-container').addEventListener('mouseout', () => {
        mouseCollider.isStatic = true;
    })

    // unfreeze mouseCollider on mouseover
    document.getElementById('fluid-container').addEventListener('mouseover', () => {
        mouseCollider.isStatic = false;
    })

    // run the engine
    Runner.run(runner, engine);

    // run the renderer
    Render.run(render);

    // add event listener to each circl
    Events.on(engine, 'afterUpdate', () => {
        circles.forEach(circle => {
            circle.domElement.style.left = circle.position.x + 'px';
            circle.domElement.style.top = circle.position.y + 'px';
        })
    })
}