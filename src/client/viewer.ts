/*	This file is part of HearthPlays.

    HearthPlays - Hearthstone replays viewer
    Copyright (C) 2015-2016  Kewin Dousse (Protectator)
    
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

///<reference path="../../typings/index.d.ts"/>
///<reference path="parser/replayParser.ts"/>
///<reference path="parser/logSource.ts"/>
///<reference path="replay.ts"/>

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
        private launched: boolean;
        private currentRenderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
        private rendererView: HTMLCanvasElement;
        private loadedReplay: Replay;
        public fileInput: HTMLInputElement;
        private replayData: JSON;

        public constructor() {
            this.length = Viewer.defaultLength;
            this.height = Viewer.defaultHeight;
            this.frameRate = Viewer.defaultFrameRate;
            this.launched = false;
        }

        public launch(): void {
            // Abort if already running
            if (this.launched) {
                console.log("HearthPlays viewer has already been started.");
                return;
            }
            this.launched = true;
            
            // Create renderer and append it
            this.currentRenderer = PIXI.autoDetectRenderer(this.length, this.height);
            document.getElementById("viewer-container").appendChild(this.currentRenderer.view);
            this.rendererView = <HTMLCanvasElement>(document.getElementById("viewer-container").getElementsByTagName("canvas")[0]);
            document.getElementById("viewer-container").className = "active";
            
            // Firstly, scale the renderer
            this.scaleRendererOnWidth();
            
            //////////////
            // Bindings //
            //////////////
            var _this = this;
            
            // --- Fullscreen ---
            // Bind handler on window resize
            window.onresize = this.viewerFullscreenModeHandler.bind(this);
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

        public previousTurn(): void {
            // TODO
        }

        public previousAction(): void {
            // TODO
        }

        public playPause(): void {
            // TODO
        }

        public nextAction(): void {
            // TODO
        }

        public nextTurn(): void {
            // TODO
        }

        public loadFromFileInput(event): void {
            var file: File = event.target.files[0];
            var name = file.name;
            var extension = name.substring(name.lastIndexOf("."));
            var reader: FileReader = new FileReader();
            var _this = this;

            reader.onprogress = function(data) {
                if (data.lengthComputable) {
                    var progress = parseInt(((data.loaded / data.total) * 100) + "", 10);
                    console.log("Loading file progress : " + progress + "%");
                }
            };

            switch (extension) {
                case ".hdtreplay":
                    reader.onload = (function(theFile) {
                        return function(e) {
                            _this.loadHdtReplay(e.target.result);
                        }
                    })(file);
                    reader.readAsArrayBuffer(file);
                    break;
                    
                case ".log":
                    reader.onload = (function(theFile) {
                        return function(e) {
                            _this.loadOfficialReplay(e.target.result);
                        }
                    })(file);
                    reader.readAsText(file);
                    break;
                    
                default:
                    throw new Error("Unrecognized file format.");
            }
        }

        //
        private loadHdtReplay(rawData: ArrayBuffer): void {
            var zip: JSZip = new JSZip();
            var viewer = this;
            zip.file("output_log.txt").async("string")
                .then(function (content) {
                    var parser = new ReplayParser(LogSource.HDTREPLAY);
                    viewer.loadedReplay = parser.parse(content);
                });
        }

        private loadOfficialReplay(rawData: string): void {
            var parser = new ReplayParser(LogSource.OFFICIAL_LOGS);
            this.loadedReplay = parser.parse(rawData);
        }

        private isFullscreenEnabled(): boolean {
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

        private viewerFullscreenModeHandler(): void {
            if (!this.isFullscreenEnabled()) {
                this.scaleRendererOnWidth();
            } else {
                this.scaleRendererOnSmallest();
            }
            this.updateFullscreenButton();
        }

        private updateFullscreenButton(): void {
            if (!this.isFullscreenEnabled()) {
                document.getElementById("toggleFullscreen").innerHTML = "⇱";
            } else {
                document.getElementById("toggleFullscreen").innerHTML = "⇲";
            }
        }

        private scaleRendererOnWidth(): void {
            var targetWidth: number = document.getElementById("viewer-container").offsetWidth;
            var ratio: number = this.length / this.height;
            console.log("Scaling on width : On " + targetWidth + "pixels");
            this.rendererView.style.width = targetWidth + "px";
            this.rendererView.style.height = (targetWidth / ratio) + "px";
        }

        private scaleRendererOnSmallest(): void {
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