export class Character {
    constructor(p, v) {
        this.checkCollision = () => {
            for (let obstacle in this.v.obstacles) {
                if (this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.obstacles[obstacle].xPosition + this.v.obstacles[obstacle].width &&
                    this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.obstacles[obstacle].xPosition &&
                    this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.obstacles[obstacle].yPosition + this.v.obstacles[obstacle].height &&
                    this.yPosition + this.v.gameBoard.heightUnit * 0.5 - 1 > this.v.obstacles[obstacle].yPosition) {
                    this.resetMovement(true);
                }
                else if (this.xPosition - this.v.gameBoard.widthUnit * 0.5 + 1 < this.v.gameBoard.xInner ||
                    this.xPosition + this.v.gameBoard.widthUnit * 0.5 - 1 > this.v.gameBoard.xInner + this.v.gameBoard.innerWidth ||
                    this.yPosition - this.v.gameBoard.heightUnit * 0.5 + 1 < this.v.gameBoard.yInner ||
                    this.yPosition + this.v.gameBoard.heightUnit * 0.5 - 1 > this.v.gameBoard.yInner + this.v.gameBoard.innerHeight) {
                    this.resetMovement(true);
                }
            }
        };
        this.checkCollisionInput = () => {
            for (let obstacle in this.v.obstacles) {
                switch (this.nextMovement) {
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
        this.checkNextMovement = () => {
            if (!this.checkCollisionInput() && this.nextMovement != this.movement && this.nextMovement != null) {
                if (this.movement != null) {
                    this.previousMovement = this.movement;
                }
                const newMovement = this.nextMovement;
                this.resetMovement(false);
                this.movement = newMovement;
                this.constrainPosition();
            }
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
        this.draw = () => {
            this.p.push();
            this.p.fill(this.color);
            this.p.noStroke();
            this.p.ellipse(this.xPosition, this.yPosition, this.diameter);
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
        this.resetMovement = afterCollision => {
            if (this.movement != null) {
                this.previousMovement = this.movement;
            }
            this.collision = true;
            this.movement = null;
            this.nextMovement = null;
            if (afterCollision) {
                this.constrainPosition();
            }
        };
        this.p = p;
        this.v = v;
        this.collision = false;
        this.color = null;
        this.diameter = this.v.gameBoard.heightUnit / 2;
        this.previousMovement = null;
        this.movement = null;
        this.name = null;
        this.nextMovement = null;
        this.speed = 88 / 60 / 650 * this.v.gameBoard.innerHeight;
        this.xPosition = null;
        this.yPosition = null;
    }
}