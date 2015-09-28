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
///<reference path="entities/tags.ts"/>
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
        private currentLineNumber: number;
        
        private get currentLine(): LogLine {
            return this.lines[this.currentLineNumber];
        }
        
        private expectedPP: number;

        public parse(logs: string): Replay {
            var content: string[] = logs.split("\n");
            this.lines = new Array<LogLine>();
            this.events = new Array<ReplayEvent>();
            for (var i in content) {
                this.lines[i] = new LogLine(content[i]);
            }
            this.currentLineNumber = -1;
            console.log(this.lines);
            while (this.currentLineNumber < this.lines.length) {
                this.parseFirstLevelLine();
            }
            return null;
        }

        private parseFirstLevelLine(): void {
            var line = this.nextLine();

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
            // Creating the event we'll return
            var event: CreateGame = new CreateGame();
            // Checking if we're on the correct line
            if (this.currentLine.type != LogLineType.CREATE_GAME) {
                throw new Error("Tried to parse wrong event");
            }
            var line = this.nextLine();
            // Adding all meta information
            while (line.type == LogLineType.meta) {
                var words = line.print.split(" ");
                
                // Parsing the "GameEntity" part
                if (words[0] == "GameEntity") {
                    var entityIdWords = words[1].split("=");
                    // Getting the EntityID of the line
                    if (entityIdWords[0] == "EntityID") {
                        event.gameEntity.entityID = parseInt(entityIdWords[1]);
                    }
                    var parentIndentation = line.indentation;
                    line = this.nextLine();
                    
                    // Getting all tag values in it
                    var currentTag: Tag;
                    while (line.indentation > parentIndentation) {
                        currentTag = this.readTag();
                        event.gameEntity.setTag(currentTag.key, currentTag.value);
                        line = this.nextLine();
                    }
                } else if (words[0] == "Player") {
                    console.log(event); // TODO : See if GameEntity works
                    // TODO
                }
                

            }
        }
        
        /**
         * Used to extract the tag name and value of a tag line
         * Current line must be a tag one
         */
        private readTag(): Tag {
            var words = this.currentLine.print.split(" ");
            var parts;
            var key, value: string;
            for (var word in words) {
                parts = word.split("="); 
                if (parts[0] == "tag") {
                    key = parts[1];
                } else if (parts[0] == "value") {
                    value = parts[1];
                } else {
                    throw new Error("Unknown tag parameter");
                }
            }
            return new Tag(key, value);
        }
        
        private readAssignations(line: string) {
            // TODO
        }
        
        private parseFullEntity(): void {

            var event = new FullEntity();
            // TODO
        }
        
        private parseAction(): void {

            var event = new Action();
            // TODO
        }
        
        private parseTagChange(): void {

            var event = new TagChange();
            // TODO
        }
        
        private parseShowEntity(): void {

            var event = new ShowEntity();
            // TODO
        }
        
        private parseHideEntity(): void {

            var event = new HideEntity();
            // TODO
        }

        private parsePrintPowerList(): void {
            if (this.currentLine.type == LogLineType.meta) {
                this.expectedPP = parseInt(this.currentLine.print.split("Count=")[1]);
            } else {
                throw new Error("Malformed DebugPrintPowerList()");
            }
            this.nextLine();
        }
        
        private nextLine(): LogLine {
            this.currentLineNumber++;
            return this.currentLine;
        }
    }

}