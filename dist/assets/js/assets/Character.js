export default class Character {
    constructor(p, v) {
        this.draw = () => {
            const diameter = this.mode == "frightened" ? this.diameter * 0.75 : this.diameter;
            this.p.push();
            if (this.mode == "frightened") {
                this.p.stroke("white");
                this.p.strokeWeight(3);
            }
            else {
                this.p.noStroke();
            }
            if (this.name == "Hoog-Man") {
                this.p.translate(this.xPosition, this.yPosition);
                this.p.scale(diameter / 50);
                this.p.noStroke();
                this.p.fill("indianred");
                this.p.ellipse(0, 0, 50);
                this.p.fill("slategray");
                this.p.ellipse(-7, -10, 17);
                this.p.ellipse(7, -10, 17);
                this.p.fill("white");
                this.p.ellipse(-7, -8, 7, 13);
                this.p.ellipse(7, -8, 7, 13);
                this.p.fill("orange");
                this.p.ellipse(0, 3, 17);
                this.p.stroke("slategray");
                this.p.strokeWeight(3);
                this.p.fill("white");
                this.p.arc(0, 13, 26, 13, 0, this.p.PI, this.p.CHORD);
            }
            else if (this.mode != "frightened") {
                this.p.image(this.image, this.xPosition, this.yPosition, diameter / this.image.width * this.image.width, diameter / this.image.height * this.image.height);
            }
            else {
                this.p.image(this.v.frightenedImage, this.xPosition, this.yPosition, diameter / this.v.frightenedImage.width * this.v.frightenedImage.width, diameter / this.v.frightenedImage.height * this.v.frightenedImage.height);
            }
            this.p.pop();
            switch (this.movement) {
                case "up":
                    this.yPosition -= this.speed;
                    break;
                case "right":
                    this.xPosition += this.speed;
                    break;
                case "down":
                    this.yPosition += this.speed;
                    break;
                case "left":
                    this.xPosition -= this.speed;
                    break;
            }
        };
        this.checkCollision = () => {
            this.collision = false;
            if (this.name != "Hoog-Man") {
                if (this.xPosition + this.diameter / 3.5 >= this.v.hoogMan.xPosition - this.v.hoogMan.diameter / 3.5 &&
                    this.xPosition - this.diameter / 3.5 <= this.v.hoogMan.xPosition + this.v.hoogMan.diameter / 3.5 &&
                    this.yPosition + this.diameter / 3.5 >= this.v.hoogMan.yPosition - this.v.hoogMan.diameter / 3.5 &&
                    this.yPosition - this.diameter / 3.5 <= this.v.hoogMan.yPosition + this.v.hoogMan.diameter / 3.5) {
                    if (this.mode == "frightened") {
                        this.v.gameBoard.score += 1000;
                        return this.resetCharacter();
                    }
                    this.v.gameBoard.score -= 1000;
                    return this.v.endGame(this.p, true);
                }
            }
            for (const obstacle in this.v.obstacles) {
                if (this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.obstacles[obstacle].xPosition &&
                    this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition + this.v.gameBoard.heightUnit * 0.5 - 1 > this.v.obstacles[obstacle].yPosition) {
                    return this.resetMovement(true);
                }
                else if (this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.gameBoard.xInner ||
                    this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.gameBoard.xInner + this.v.gameBoard.innerWidth ||
                    this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.gameBoard.yInner ||
                    this.yPosition + this.v.gameBoard.heightUnit * 0.5 - 1 > this.v.gameBoard.yInner + this.v.gameBoard.innerHeight) {
                    return this.resetMovement(true);
                }
            }
            return undefined;
        };
        this.checkNextMovement = () => {
            if (!this.checkCollisionInput(this.nextMovement) && this.nextMovement != this.movement && this.nextMovement != null) {
                if (this.movement != null) {
                    this.previousMovement = this.movement;
                }
                const newMovement = this.nextMovement;
                this.resetMovement(false);
                this.movement = newMovement;
                this.constrainPosition();
            }
        };
        this.resetMovement = afterCollision => {
            if (this.movement != null) {
                this.previousMovement = this.movement;
            }
            this.collision = true;
            this.movement = this.nextMovement = null;
            if (afterCollision) {
                this.constrainPosition();
            }
        };
        this.checkCollisionInput = targetMovement => {
            for (const obstacle in this.v.obstacles) {
                switch (targetMovement) {
                    case "up":
                        if (this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 2 &&
                            this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit &&
                            this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit &&
                            this.yPosition > this.v.gameBoard.yInner &&
                            this.name == "Hoog-Man") {
                            this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.innerHeight;
                            return false;
                        }
                        else if (this.yPosition > this.v.gameBoard.yInner &&
                            this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit) {
                            return true;
                        }
                        else if (this.xPosition - this.v.gameBoard.widthUnit * 0.45 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                            this.xPosition + this.v.gameBoard.widthUnit * 0.45 >= this.v.obstacles[obstacle].xPosition &&
                            this.yPosition - this.v.gameBoard.heightUnit * 0.55 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                            this.yPosition + this.v.gameBoard.heightUnit * 0.45 >= this.v.obstacles[obstacle].yPosition) {
                            return true;
                        }
                        break;
                    case "right":
                        if (this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 16 &&
                            this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 17) {
                            return true;
                        }
                        else if (this.xPosition - this.v.gameBoard.widthUnit * 0.45 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                            this.xPosition + this.v.gameBoard.widthUnit * 0.55 >= this.v.obstacles[obstacle].xPosition &&
                            this.yPosition - this.v.gameBoard.heightUnit * 0.45 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                            this.yPosition + this.v.gameBoard.heightUnit * 0.45 >= this.v.obstacles[obstacle].yPosition) {
                            return true;
                        }
                        break;
                    case "down":
                        if (this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 2 &&
                            this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit &&
                            this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 14 &&
                            this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 13 &&
                            this.name == "Hoog-Man") {
                            this.yPosition = this.v.gameBoard.yInner;
                            return false;
                        }
                        else if (this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 13 &&
                            this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 14) {
                            return true;
                        }
                        else if (this.xPosition - this.v.gameBoard.widthUnit * 0.45 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                            this.xPosition + this.v.gameBoard.widthUnit * 0.45 >= this.v.obstacles[obstacle].xPosition &&
                            this.yPosition - this.v.gameBoard.heightUnit * 0.45 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                            this.yPosition + this.v.gameBoard.heightUnit * 0.55 >= this.v.obstacles[obstacle].yPosition) {
                            return true;
                        }
                        break;
                    case "left":
                        if (this.xPosition > this.v.gameBoard.xInner &&
                            this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit) {
                            return true;
                        }
                        else if (this.xPosition - this.v.gameBoard.widthUnit * 0.55 <= this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                            this.xPosition + this.v.gameBoard.widthUnit * 0.45 >= this.v.obstacles[obstacle].xPosition &&
                            this.yPosition - this.v.gameBoard.heightUnit * 0.45 <= this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                            this.yPosition + this.v.gameBoard.heightUnit * 0.45 >= this.v.obstacles[obstacle].yPosition) {
                            return true;
                        }
                        break;
                }
            }
            return false;
        };
        this.constrainPosition = () => {
            const xConstrain = () => {
                for (let i = 0; i < 17; i++) {
                    if (this.xPosition > this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * i &&
                        this.xPosition < this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (i + 1)) {
                        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * (i + 0.5);
                        break;
                    }
                }
            };
            const yConstrain = () => {
                for (let i = 0; i < 14; i++) {
                    if (this.yPosition > this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * i &&
                        this.yPosition < this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (i + 1)) {
                        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * (i + 0.5);
                        break;
                    }
                }
            };
            if (this.movement == "left" || this.movement == "right") {
                yConstrain();
            }
            else if (this.movement == "up" || this.movement == "down") {
                xConstrain();
            }
            else {
                xConstrain();
                yConstrain();
            }
        };
        this.resetCharacter = () => {
            this.xPosition = this.xStartPosition;
            this.yPosition = this.yStartPosition;
            this.previousMovement = null;
            if (this.name != "Hoog-Man") {
                this.chaseRound = this.scatterRound = 0;
            }
            this.movement = this.name == "Blinky" ? "left" : null;
            if (this.name != "Hoog-Man" && this.name != "Blinky") {
                this.mode = null;
            }
        };
        this.v = v;
        this.collision = false;
        this.diameter = this.v.gameBoard.heightUnit / 2;
        this.previousMovement = this.movement = this.nextMovement = null;
        this.p = p;
        this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight * 1.2;
    }
}
