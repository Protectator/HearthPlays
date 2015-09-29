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

///<reference path="Viewer.ts"/>

namespace HearthPlays {
    export class Launcher {
        public static launch() {
            var viewer: Viewer = new Viewer();
            document.getElementById("viewer-container").innerHTML = "";
            viewer.launch();
            // Binds to viewer
            document.getElementById("toggleFullscreen").addEventListener("click", function() {
                viewer.toggleFullscreen();
            });
            document.getElementById("previousTurn").addEventListener("click", function() {
                viewer.toggleFullscreen();
            });
            document.getElementById("previousAction").addEventListener("click", function() {
                viewer.previousAction();
            });
            document.getElementById("playPause").addEventListener("click", function() {
                viewer.playPause();
            });
            document.getElementById("nextAction").addEventListener("click", function() {
                viewer.nextAction();
            });
            document.getElementById("nextTurn").addEventListener("click", function() {
                viewer.nextTurn();
            });
            // Binds to input
            viewer.fileInput = <HTMLInputElement>document.getElementById("uploadReplay");
            // Binds to file
            document.getElementById('uploadReplay').addEventListener('change', function(event: Event) {
                viewer.loadFromFileInput(event);
            }, false);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("autoLaunch")) {
        HearthPlays.Launcher.launch();
    }
}, false);