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

///<reference path="./typings/index.d.ts"/>

import electron = require('electron');
import BrowserWindowOptions = Electron.BrowserWindowOptions;
let clientWatcher = require('electron-connect').client;
let app = electron.app;
let BrowserWindow = electron.BrowserWindow;

let mainWindow: Electron.BrowserWindow;

function createWindow(): void {
    let mainConsole = console;
    mainConsole.time('createWindow to dom-ready');
    let icon = electron.nativeImage.createFromPath(`${__dirname}/src/static/img/logo.png`);
    mainWindow = new BrowserWindow({width: 800, height: 600, title: 'HearthPlays', icon: icon});
    mainWindow.loadURL(`file://${__dirname}/src/static/index.html`);
    clientWatcher.create(mainWindow);
    mainWindow.webContents.on("dom-ready", () => {
        mainConsole.timeEnd('createWindow to dom-ready');
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});