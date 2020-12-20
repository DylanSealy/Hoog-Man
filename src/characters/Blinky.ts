import p5 from "p5";
import { Ghost } from "../assets/Ghost.js";
import { GameVariables, GhostInterface } from "../Types";

export class Blinky extends Ghost implements GhostInterface {
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.color = "red";
        this.mode = "scatter";
        this.name = "Blinky";
        this.pelletThreshold = 0;
        this.xPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
        this.yPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTarget = this.v.gameBoard.xOuter;
        this.yTarget = this.v.gameBoard.yOuter + v.gameBoard.outerHeight;
    }
}
