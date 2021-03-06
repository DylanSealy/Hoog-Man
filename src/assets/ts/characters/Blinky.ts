import {Color, GameVariables, GhostInterface, GhostMode, Name} from "../Types";
import p5, {Image} from "p5";
import Ghost from "../assets/Ghost.js";

export default class Blinky extends Ghost implements GhostInterface {
    color: Color;
    image: Image;
    mode: GhostMode;
    name: Name;
    pelletCounter: number;
    pelletThreshold: number;
    xPosition: number;
    yPosition: number;
    xStartPosition: number;
    yStartPosition: number;
    xTargetTile: number;
    yTargetTile: number;
    constructor(p: p5, v: GameVariables) {
        super(p, v);
        this.color = "red";
        this.image = this.p.loadImage("assets/images/blinky.png");
        this.mode = "scatter";
        this.movement = "left";
        this.name = "Blinky";
        this.pelletCounter = this.pelletThreshold = 0;
        this.xPosition = this.xStartPosition = this.v.gameBoard.xInner + this.v.gameBoard.widthUnit * 13.5;
        this.yPosition = this.yStartPosition = this.v.gameBoard.yInner + this.v.gameBoard.heightUnit * 0.5;
        this.xTargetTile = this.v.gameBoard.xOuter;
        this.yTargetTile = this.v.gameBoard.yOuter + v.gameBoard.outerHeight;
    } // Zorgt ervoor dat de correcte bewegingsrichting functie wordt aangeroepen voor elke modus.
    setMovement: () => void = () => {
        // 0, 0 zijn marges tussen een ghost en zijn doelwit.
        if (this.mode == "chase") {this.movementSequence(this.checkDistanceTarget("Hoog-Man", 0, 0));}
        else if (this.mode == "scatter") {this.movementSequence(this.checkDistanceTarget("Target tile", 0, 0));}
        else {this.frightenedMovement();}
    }
}
