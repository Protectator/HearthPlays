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
                            throw new Error("Misplaced meta information");
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
                    var assignations = ReplayParser.readAssignations(line.print);
                    event.gameEntity = new GameEntity(<number>assignations.EntityID);

                    var parentIndentation = line.indentation;
                    line = this.nextLine();
                    
                    // Getting all tag values in it
                    while (line.indentation > parentIndentation) {
                        assignations = ReplayParser.readAssignations(line.print);
                        var tagKey: string;
                        var tagValue: string|number;
                        for (var assignationKey in assignations) {
                            if (assignationKey == "tag") {
                                tagKey = assignations[assignationKey];
                            } else if (assignationKey == "value") {
                                tagValue = assignations[assignationKey];
                            } else {
                                console.log("Unrecognized assignation in GameEntity : " + assignationKey);
                            }
                        }
                        event.gameEntity.setTag(tagKey, tagValue);
                        console.log("Set tag " + tagKey + " to " + tagValue);
                        line = this.nextLine();
                    }
                    console.log(event.gameEntity);
                } else if (words[0] == "Player") {
                    // console.log(event); // TODO : See if GameEntity works
                    this.nextLine();
                    // TODO
                }


            }
        }
        
        /**
         * Used to read a line containing assignations like "HEALTH=3 SOMETHING=[hi=2 low=4]"
         */
        public static readAssignations(line: string): any {
            var findAssignations: RegExp = /(\S*?(?:\[\S+\])?)=(\[.*?\]|\S+)/g;
            var findArrayInDeclaration: RegExp;
            var findArrayInValue: RegExp;
            var readArrayInValue: RegExp;
            var assignations: any = new Array();
            var replaceFunct = function(a, b, c): string { // TODO : Refactor and do the logic in this function
                assignations.push(b);
                assignations.push(c);
                return a;
            }
            line.replace(findAssignations, replaceFunct);
            var result = {};
            for (var i = 0; i < assignations.length; i += 2) {
                var key = assignations[i];
                var value = assignations[i + 1];
                var resultValue;
                
                // Check if there are arrays involved in the value
                findArrayInValue = /\[(?: *(?:(\w|-)*)=(.*) *)*\]/g;
                if (findArrayInValue.test(value)) {
                    resultValue = {};
                    readArrayInValue = /([^ \[\t\n\r]+)=((?:[^ =\]]+ *(?!\S+=))+)/g;
                    var arrayValueResult: any = new Array();
                    var replaceArrayValueFunct = function(a, b, c): string { // TODO : Refactor and do the logic in this function
                        arrayValueResult.push(b);
                        arrayValueResult.push(c);
                        return a;
                    }
                    value.replace(readArrayInValue, replaceArrayValueFunct)
                    for (var j = 0; j < arrayValueResult.length; j += 2) {
                        resultValue[arrayValueResult[j]] = ReplayParser.tryParseInt(arrayValueResult[j + 1]);
                    }
                } else {
                    // If no, simply parse the value
                    resultValue = ReplayParser.tryParseInt(value);
                }
                
                // Check if there are arrays involved in the key
                findArrayInDeclaration = /((?:\w|-)+)\[((?:\w|-)+)\]/g;
                var arrayDeclarationResult = findArrayInDeclaration.exec(key);
                if (arrayDeclarationResult != null) {
                    var arrayName = arrayDeclarationResult[1];
                    var arrayIndex = arrayDeclarationResult[2];
                    // If the key doesn't exist, create it
                    if (result[arrayName] == null) {
                        result[arrayName] = {};
                    }
                    // If the key already has an entry
                    if (resultValue.constructor == Object &&
                        result[arrayName][arrayIndex] != null &&
                        result[arrayName][arrayIndex].constructor == Object) {
                        // Add the assignations instead of erasing the old object
                        for (var key in resultValue) {
                            result[arrayName][arrayIndex][key] = resultValue[key];
                        }
                    } else {
                        // If no entry, simply assign the object
                        result[arrayName][arrayIndex] = resultValue;
                    }
                } else {
                    // If there isn't any array in the key, simply assign the statement
                    result[key] = resultValue;
                }
            }
            return result;
        }

        private static tryParseInt(value: string): (string|number) {
            return isNaN(parseInt(value)) ? value : parseInt(value);
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
            if (this.currentLineNumber >= this.lines.length) {
                throw new Error("Out of bounds");
            }
            this.currentLineNumber++;
            if (this.currentLineNumber%100==0) {
                console.log("Parsing : " + this.currentLineNumber + " / " + this.lines.length);
            }
            return this.currentLine;
        }
    }

}