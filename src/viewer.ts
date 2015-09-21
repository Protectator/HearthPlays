/*	This file is part of HearthPlays.

    HearthPlays - Web Hearthstone replays viewer
    Copyright (C) 2015  Kewin Dousse (Protectator)
    
    HearthPlays is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or any later version.
    
    HearthPlays is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Contact : me@protectator.ch
    Project's repository : https://github.com/Protectator/HearthPlays
*/

///<reference path="../lib/pixijs/pixi.js.d.ts"/>

namespace HearthPlays {
    export class Viewer {

        public static defaultLength = 1920;
        public static defaultHeight = 1080;
        public static defaultFrameRate = 60;

        private length: number;
        private height: number;
        private frameRate: number;
        private started: boolean;
        private currentRenderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
        private rendererView: HTMLCanvasElement;

        constructor() {
            this.length = Viewer.defaultLength;
            this.height = Viewer.defaultHeight;
            this.frameRate = Viewer.defaultFrameRate;
            this.started = false;
        }

        public start(): void {
            if (this.started) {
                console.log("HearthPlays viewer has already been started.");
                return;
            }
            this.currentRenderer = PIXI.autoDetectRenderer(this.length, this.height);
            document.getElementById("viewer-container").appendChild(this.currentRenderer.view);
            document.getElementById("viewer-container").className = "active";
            this.rendererView = document.getElementById("viewer-container").getElementsByTagName("canvas")[0];
            this.scaleRenderer();
        }

        private scaleRenderer() {
            var targetWidth: number = document.getElementById("viewer-container").offsetWidth;
            var ratio: number = this.length / this.height;
            this.rendererView.style.width = targetWidth + "px";
            this.rendererView.style.height = (targetWidth / ratio) + "px";
        }

        private launchFullscreen(element): void {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }
}