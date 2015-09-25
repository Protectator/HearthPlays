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

///<reference path="replay.ts"/>
///<reference path="logLine.ts"/>
///<reference path="logLineType.ts"/>
///<reference path="logLineMethod.ts"/>
///<reference path="replayEvent.ts"/>
///<reference path="events/createGame.ts"/>
///<reference path="events/fullEntity.ts"/>
///<reference path="events/action.ts"/>
///<reference path="events/showEntity.ts"/>
///<reference path="events/hideEntity.ts"/>
///<reference path="events/tagChange.ts"/>

namespace HearthPlays {
    export class ReplayParser {
        
        // Parser data
        private lines: LogLine[];
        private events: ReplayEvent[];
        
        // Parser state
        private currentLine: number;
        private expectedPP: number;

        public parse(logs: string): Replay {
            var content: string[] = logs.split("\n");
            this.lines = new Array<LogLine>();
            this.events = new Array<ReplayEvent>();
            for (var i in content) {
                this.lines[i] = new LogLine(content[i]);
            }
            this.currentLine = 0;
            console.log(this.lines);
            while (this.currentLine < this.lines.length) {
                this.parseFirstLevelLine();
            }
            return null;
        }

        private parseFirstLevelLine(): void {
            var line = this.lines[this.currentLine];

            switch (line.method) {
                case LogLineMethod.DEBUG_PRINT_POWER:
                    switch (line.type) {
                        case LogLineType.CREATE_GAME:
                            this.parseCreateGame();
                            break;
                        case LogLineType.FULL_ENTITY:
                            this.parseFullEntity();
                            break;
                        case LogLineType.ACTION_START:
                            this.parseAction();
                            break;
                        case LogLineType.ACTION_END:
                            throw new Error("Misplaced ACTION_END");
                            break;
                        case LogLineType.TAG_CHANGE:
                            this.parseTagChange();
                            break;
                        case LogLineType.SHOW_ENTITY:
                            this.parseShowEntity();
                            break;
                        case LogLineType.HIDE_ENTITY:
                            this.parseHideEntity();
                            break;
                        case LogLineType.META_DATA:
                            throw new Error("Misplaced META_DATA");
                            break;
                        case LogLineType.meta:
                            throw new Error("Misplaced block information");
                            break;
                        default:
                            throw new Error("Unrecognized event");
                    }
                    break;

                case LogLineMethod.DEBUG_PRINT_POWER_LIST:
                    this.parsePrintPowerList();
                    break;

                case LogLineMethod.DEBUG_PRINT_CHOICES:
                    // TODO
                    break;

                case LogLineMethod.SEND_CHOICES:
                    // TODO
                    break;

                case LogLineMethod.DEBUG_PRINT_OPTIONS:
                    // TODO
                    break;

                case LogLineMethod.SEND_OPTION:
                    // TODO
                    break;

                default:
                    throw new Error("Unknown method name");
            }
        }
        
        private parseCreateGame(): void {
            var line = this.lines[this.currentLine];
            var event = new CreateGame();
            // TODO Add tags etc
        }
        
        private parseFullEntity(): void {
            var line = this.lines[this.currentLine];
            var event = new FullEntity();
            // TODO
        }
        
        private parseAction(): void {
            var line = this.lines[this.currentLine];
            var event = new Action();
            // TODO
        }
        
        private parseTagChange(): void {
            var line = this.lines[this.currentLine];
            var event = new TagChange();
            // TODO
        }
        
        private parseShowEntity(): void {
            var line = this.lines[this.currentLine];
            var event = new ShowEntity();
            // TODO
        }
        
        private parseHideEntity(): void {
            var line = this.lines[this.currentLine];
            var event = new HideEntity();
            // TODO
        }

        private parsePrintPowerList(): void {
            var line = this.lines[this.currentLine]; // TODO Make a getter for current line
            if (line.type == LogLineType.meta) {
                this.expectedPP = parseInt(line.print.split("Count=")[1]);
            } else {
                throw new Error("Malformed DebugPrintPowerList()");
            }
        }
    }

}