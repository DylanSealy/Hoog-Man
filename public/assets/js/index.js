import GameBoard from "./gameBoard/GameBoard.js";
import Obstacle from "./gameBoard/Obstacle.js";
import Pellet from "./gameBoard/Pellet.js";
import { HoogMan } from "./characters/HoogMan.js";
import { Blinky } from "./characters/Blinky.js";
const sketch = (p) => {
    p.preload = () => {
        p.soundFormats("mp3");
        p.loadFont("assets/fonts/Roboto-Light.ttf");
    };
    p.setup = () => {
        initializeVars(p);
        getInputMethod();
        p.createCanvas(v.gameBoard.canvasDimension, v.gameBoard.canvasDimension);
        p.frameRate();
        p.colorMode(p.RGB, 255);
        p.textFont("Roboto");
        p.textSize(v.gameBoard.widthUnit / 1.5);
        p.noCursor();
        p.textAlign(p.LEFT, p.CENTER);
    };
    p.draw = () => {
        p.background("black");
        p.noFill();
        v.gameBoard.draw();
        for (let obstacle in v.obstacles) {
            v.obstacles[obstacle].draw();
        }
        for (let pellet in v.pellets) {
            v.pellets[pellet].draw();
            v.pellets[pellet].checkEaten(pellet);
        }
        v.hoogMan.draw();
        v.hoogMan.collision = false;
        v.hoogMan.checkCollision();
        v.hoogMan.checkNextMovement();
        v.blinky.draw();
        v.blinky.collision = false;
        v.blinky.checkCollision();
        v.blinky.checkNextMovement();
        if (v.inputMethod == "keyboard") {
            if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {
                v.hoogMan.nextMovement = "up";
            }
            else if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {
                v.hoogMan.nextMovement = "right";
            }
            else if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {
                v.hoogMan.nextMovement = "down";
            }
            else if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {
                v.hoogMan.nextMovement = "left";
            }
        }
        else if (v.inputMethod == "touch") {
            touchControls();
        }
        else if (v.inputMethod == "gestures") {
            gestureControls();
        }
    };
};
const v = {};
const initializeVars = (p) => {
    v.gameBoard = new GameBoard(p, v);
    v.hoogMan = new HoogMan(p, v);
    v.blinky = new Blinky(p, v);
    v.gesturePosition = [null, null, null, null];
    (() => {
        v.obstacleCoordinates = [
            [1, 1, 3, 4], [4, 0, 5, 4], [6, 1, 8, 4], [9, 0, 10, 3], [11, 1, 13, 3], [14, 0, 17, 2], [0, 5, 1, 8], [2, 5, 4, 8],
            [5, 5, 7, 6], [8, 5, 9, 6], [9, 4, 10, 7], [11, 5, 12, 6], [11, 4, 16, 5], [14, 3, 16, 4], [5, 7, 6, 8], [7, 7, 8, 10],
            [9, 8, 10, 10], [10, 9, 11, 11], [11, 7, 14, 8], [13, 6, 14, 7], [15, 6, 16, 8], [1, 9, 3, 13], [4, 9, 6, 12], [7, 11, 9, 12],
            [8, 12, 9, 13], [12, 9, 13, 12], [14, 9, 17, 10], [4, 13, 7, 14], [10, 12, 11, 14], [11, 13, 14, 14], [14, 11, 16, 12], [15, 12, 16, 13]
        ];
        v.obstacles = [];
        for (let coordinates in v.obstacleCoordinates) {
            const obstacle = new Obstacle(p, v, v.obstacleCoordinates[coordinates][0], v.obstacleCoordinates[coordinates][1], v.obstacleCoordinates[coordinates][2], v.obstacleCoordinates[coordinates][3]);
            v.obstacles.push(obstacle);
        }
    })();
    (() => {
        v.pellets = [];
        for (let xPosition = 0; xPosition < 17; xPosition++) {
            for (let yPosition = 0; yPosition < 14; yPosition++) {
                const pellet = new Pellet(p, v, xPosition, yPosition);
                if (!pellet.checkCollisionObstacle()) {
                    v.pellets.push(pellet);
                }
            }
        }
    })();
};
const touchControls = () => {
    const upTouch = document.querySelector("#upTouch");
    upTouch.addEventListener("click", () => v.hoogMan.nextMovement = "up");
    upTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "up");
    const rightTouch = document.querySelector("#rightTouch");
    rightTouch.addEventListener("click", () => v.hoogMan.nextMovement = "right");
    rightTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "right");
    const downTouch = document.querySelector("#downTouch");
    downTouch.addEventListener("click", () => v.hoogMan.nextMovement = "down");
    downTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "down");
    const leftTouch = document.querySelector("#leftTouch");
    leftTouch.addEventListener("click", () => v.hoogMan.nextMovement = "left");
    leftTouch.addEventListener("touchstart", () => v.hoogMan.nextMovement = "left");
};
const gestureControls = () => {
    const checkGesture = () => {
        if (v.gesturePosition[0] != null && v.gesturePosition[1] != null) {
            if (v.gesturePosition[3] < v.gesturePosition[1] - v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "up";
            }
            else if (v.gesturePosition[2] > v.gesturePosition[0] + v.gameBoard.widthUnit) {
                v.hoogMan.nextMovement = "right";
            }
            else if (v.gesturePosition[3] > v.gesturePosition[1] + v.gameBoard.heightUnit) {
                v.hoogMan.nextMovement = "down";
            }
            else if (v.gesturePosition[2] < v.gesturePosition[0] - v.gameBoard.widthUnit) {
                v.hoogMan.nextMovement = "left";
            }
        }
    };
    const resetGesture = (event) => {
        event.preventDefault();
        v.gesturePosition = [null, null, null, null];
    };
    const main = document.querySelector("main");
    main.addEventListener("touchstart", event => {
        event.preventDefault();
        v.gesturePosition[0] = event.touches[0].clientX;
        v.gesturePosition[1] = event.touches[0].clientY;
    });
    main.addEventListener("mousedown", event => {
        event.preventDefault();
        v.gesturePosition[0] = event.clientX;
        v.gesturePosition[1] = event.clientY;
    });
    main.addEventListener("touchmove", event => {
        event.preventDefault();
        v.gesturePosition[2] = event.touches[0].clientX;
        v.gesturePosition[3] = event.touches[0].clientY;
        checkGesture();
    });
    main.addEventListener("mousemove", event => {
        event.preventDefault();
        v.gesturePosition[2] = event.clientX;
        v.gesturePosition[3] = event.clientY;
        checkGesture();
    });
    main.addEventListener("touchend", event => resetGesture(event));
    main.addEventListener("mouseup", event => resetGesture(event));
    main.addEventListener("touchcancel", event => resetGesture(event));
};
document.querySelector("#social").addEventListener("click", () => window.location.href = "https://github.com/DylanSealy/PO-2D-games-maken/");
document.querySelector("#startGame").addEventListener("click", () => {
    (() => {
        const main = document.querySelector("main");
        main.requestFullscreen();
        main.style.height = "100%";
        main.style.width = "100%";
        main.style.position = "absolute";
        main.style.top = "0";
        main.style.left = "0";
        main.style.backgroundColor = "black";
    })();
    v.game = new p5(sketch);
    const gameStartupContainer = document.querySelector("#gameStartupContainer");
    gameStartupContainer.style.display = "none";
    new AudioContext;
});
window.addEventListener("resize", () => {
    if (v.game) {
        v.game.remove();
        v.game = new p5(sketch);
    }
});
const getInputMethod = () => {
    const inputMethod = document.getElementsByName("controls");
    if (inputMethod[0].checked || v.inputMethod == "keyboard") {
        v.inputMethod = "keyboard";
    }
    else if (inputMethod[1].checked || v.inputMethod == "touch") {
        v.inputMethod = "touch";
        (() => {
            const touchControlsContainer = document.getElementById("touchControlsContainer");
            touchControlsContainer.style.display = "flex";
            const touchControls = document.getElementsByClassName("touchControls");
            if (v.gameBoard.orientation == "landscape") {
                const touchElementWidth = (document.querySelector("html").offsetWidth - v.gameBoard.canvasDimension) / 2;
                touchControlsContainer.style.width = `${touchElementWidth}px`;
                touchControlsContainer.style.height = "100%";
                touchControlsContainer.classList.remove("containerPortrait");
                touchControlsContainer.classList.add("containerLandscape");
                for (let i = 0; i < touchControls.length; i++) {
                    touchControls[i].classList.remove("touchPortrait");
                    touchControls[i].classList.add("touchLandscape");
                }
            }
            else if (v.gameBoard.orientation == "portrait") {
                const touchElementHeight = (document.querySelector("html").offsetHeight - v.gameBoard.canvasDimension) / 2;
                touchControlsContainer.style.height = `${touchElementHeight}px`;
                touchControlsContainer.style.width = "100%";
                touchControlsContainer.classList.remove("containerLandscape");
                touchControlsContainer.classList.add("containerPortrait");
                for (let i = 0; i < touchControls.length; i++) {
                    touchControls[i].classList.remove("touchLandscape");
                    touchControls[i].classList.add("touchPortrait");
                }
            }
        })();
    }
    else {
        v.inputMethod = "gestures";
    }
};
(() => {
    const year = new Date().getFullYear();
    document.querySelector("footer").innerText = `© ${year} Hoog-Man`;
})();
