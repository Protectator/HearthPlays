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

// For Typescript to stop complaining about "moz" and "ms" not existing
// let's tell him they DO exist.
interface Document {
    mozCancelFullScreen: () => void;
    mozFullScreenElement: () => void;
    msFullscreenElement: () => void;
    msExitFullscreen: () => void;
}

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

        public constructor() {
            this.length = Viewer.defaultLength;
            this.height = Viewer.defaultHeight;
            this.frameRate = Viewer.defaultFrameRate;
            this.started = false;
        }

        public start(): void {
            // Abort if already running
            if (this.started) {
                console.log("HearthPlays viewer has already been started.");
                return;
            }
            
            // Create renderer and append it
            this.currentRenderer = PIXI.autoDetectRenderer(this.length, this.height);
            document.getElementById("viewer-container").appendChild(this.currentRenderer.view);
            this.rendererView = document.getElementById("viewer-container").getElementsByTagName("canvas")[0];
            document.getElementById("viewer-container").className = "active";
            
            // Firstly, scale the renderer
            this.scaleRendererOnWidth();
            
            //////////////
            // Bindings //
            //////////////
            var _this = this;
            
            // Bind handler on window resize
            window.onresize = this.viewerFullscreenModeHandler.bind(this);
            // Bind fullscreen toggle on button
            document.getElementById("toggleFullscreen").addEventListener("click", function() { _this.toggleFullscreen() });
            // Bind handler when fullscreen changes
            document.addEventListener("fullscreenchange", function() { _this.viewerFullscreenModeHandler(); });
            document.addEventListener("webkitfullscreenchange", function() { _this.viewerFullscreenModeHandler(); });
            document.addEventListener("mozfullscreenchange", function() { _this.viewerFullscreenModeHandler(); });
            document.addEventListener("MSFullscreenChange", function() { _this.viewerFullscreenModeHandler(); });
        }

        public toggleFullscreen(): void {
            if (!this.isFullscreenEnabled()) {
                this.askFullscreen();
            } else {
                this.cancelFullscreen();
            }
        }

        private isFullscreenEnabled() {
            return (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) ? true : false;
        }

        private askFullscreen(): void {
            this.launchFullscreen(document.getElementById("viewer-row"));
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

        private cancelFullscreen(): void {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        private viewerFullscreenModeHandler() {
            if (!this.isFullscreenEnabled()) {
                this.scaleRendererOnWidth();
            } else {
                this.scaleRendererOnSmallest();
            }
            this.updateFullscreenButton();
        }
        
        private updateFullscreenButton() {
            if (!this.isFullscreenEnabled()) {
                document.getElementById("toggleFullscreen").innerHTML="⇱";
            } else {
                document.getElementById("toggleFullscreen").innerHTML="⇲";
            }
        }

        private scaleRendererOnWidth() {
            var targetWidth: number = document.getElementById("viewer-container").offsetWidth;
            var ratio: number = this.length / this.height;
            console.log("Scaling on width : On " + targetWidth + "pixels");
            this.rendererView.style.width = targetWidth + "px";
            this.rendererView.style.height = (targetWidth / ratio) + "px";
        }

        private scaleRendererOnSmallest() {           
            var targetWidth: number = document.getElementById("viewer-container").offsetWidth;
            var targetHeight: number = window.innerHeight - document.getElementById("viewer-header").offsetHeight - document.getElementById("viewer-footer").offsetHeight;
            var ratio: number = this.length / this.height;
            console.log("Scaling on smallest");

            if (targetHeight * ratio < targetWidth) {
                // Scale based on height
                console.log("Scaling on HEIGHT : On " + targetHeight + "pixels");
                this.rendererView.style.height = targetHeight + "px";
                this.rendererView.style.width = (targetHeight * ratio) + "px";
            } else {
                // Scale based on width
                console.log("Scaling on WIDTH : On " + targetWidth + "pixels");
                this.rendererView.style.width = targetWidth + "px";
                this.rendererView.style.height = (targetWidth / ratio) + "px";
            }
        }
    }
}