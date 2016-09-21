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

///<reference path="../replay.ts"/>
///<reference path="logLine.ts"/>
///<reference path="logLineType.ts"/>
///<reference path="logLineMethod.ts"/>
///<reference path="logSource.ts"/>
///<reference path="../entities/tags.ts"/>
///<reference path="../replayEvent.ts"/>
///<reference path="../events/createGame.ts"/>
///<reference path="../events/fullEntity.ts"/>
///<reference path="../events/action.ts"/>
///<reference path="../events/showEntity.ts"/>
///<reference path="../events/hideEntity.ts"/>
///<reference path="../events/tagChange.ts"/>

namespace HearthPlays {

    export class ReplayParser {
        
        // Parser data
        private lines: LogLine[];
        private events: ReplayEvent[];
        // Parser state
        private currentLineNumber: number;
        private sourceType: LogSource;
        // Parser's current replay
        private progressingReplay: Replay;
        // Gets the current line to be parsed
        private get currentLine(): LogLine {
            if (this.currentLineNumber == this.lines.length) {
                return new LogLine(""); // Return a last line
            }
            return this.lines[this.currentLineNumber];
        }
        // Expected number of remaining incoming "DebugPowerPrint" log lines.
        private expectedPP: number;
        
        /////////////
        //         //
        // GENERIC //
        //         //
        /////////////
        
        /**
         * Creates a parser designed to read a certain type of input.
         * @param sourceFile Source type from which the logs are taken
         */
        constructor(source: LogSource) {
            this.sourceType = source;
        }

        /**
         * Creates a Replay object from a complete game's logs.
         * @param logs Contains the whole logs of a game
         * @returns    Represents all the replay's actions
         */
        public parse(logs: string): Replay {
            this.progressingReplay = new Replay();
            var content: string[] = logs.split("\n");
            this.lines = new Array<LogLine>();
            this.events = new Array<ReplayEvent>();
            for (var i in content) {
                this.lines[i] = new LogLine(content[i]);
            }
            this.currentLineNumber = -1;
            this.nextLine();
            var currentEvent: ReplayEvent;
            try {
                while (this.currentLineNumber < this.lines.length) {
                    currentEvent = this.parseFirstLevelLine();
                    if (currentEvent != undefined) {
                        this.progressingReplay.addEvent(currentEvent);
                    }
                }
            } catch (e) {
                if (e instanceof RangeError) {
                    return this.progressingReplay;
                } else {
                    throw e;
                }
            }
            return this.progressingReplay;
        }


        /**
         * Parses a first-level event line and goes to the next.
         */
        private parseFirstLevelLine(): ReplayEvent {
            var line = this.currentLine;
            switch (line.method) {
                case LogLineMethod.DEBUG_PRINT_POWER:
                    switch (line.type) {
                        case LogLineType.CREATE_GAME:
                            return this.parseCreateGame();
                        case LogLineType.FULL_ENTITY:
                            return this.parseFullEntity();
                        case LogLineType.ACTION_START:
                            // TODO : Implement correctly
                            //this.parseAction();
                            this.nextLine();
                            break;
                        case LogLineType.ACTION_END:
                            throw new Error("Misplaced ACTION_END");
                        case LogLineType.TAG_CHANGE:
                            return this.parseTagChange();
                        case LogLineType.SHOW_ENTITY:
                            // TODO : Implement correctly
                            //this.parseShowEntity();
                            this.nextLine();
                            break;
                        case LogLineType.HIDE_ENTITY:
                            // TODO : Implement correctly
                            //this.parseHideEntity();
                            this.nextLine();
                            break;
                        case LogLineType.META_DATA:
                            throw new Error("Misplaced META_DATA");
                        case LogLineType.meta:
                            throw new Error("Misplaced meta information");
                        default:
                            throw new Error("Unrecognized event");
                    }
                    break;

                case LogLineMethod.DEBUG_PRINT_POWER_LIST:
                    this.parsePrintPowerList();
                    break;

                case LogLineMethod.DEBUG_PRINT_CHOICES:
                    // TODO : Implement correctly
                    //this.parseDebugPrintChoices();
                    this.nextLine();
                    break;

                case LogLineMethod.SEND_CHOICES:
                    // TODO : Implement correctly
                    //this.parseSendChoices();
                    this.nextLine();
                    break;

                case LogLineMethod.DEBUG_PRINT_OPTIONS:
                    // TODO : Implement correctly
                    //this.parseDebutPrintOptions();
                    this.nextLine();
                    break;

                case LogLineMethod.SEND_OPTION:
                    // TODO : Implement correctly
                    //this.parseSendOption();
                    this.nextLine();
                    break;

                case LogLineMethod.lastLine:
                    this.nextLine();
                    return;

                default:
                    throw new Error("Unknown method name");
            }
        }

        /**
         * Moves the line reference to the next line.
         * @returns The line to be parsed.
         */
        private nextLine(): LogLine {
            this.currentLineNumber++;
            if (this.currentLineNumber >= this.lines.length) {
                this.currentLineNumber = this.lines.length;
            }
            if (this.expectedPP != undefined && this.currentLine.method == LogLineMethod.DEBUG_PRINT_POWER && this.currentLine.type != LogLineType.meta) {
                this.expectedPP--;
            }
            return this.currentLine;
        }
        
        /////////////////
        ///// Event /////
        // CREATE_GAME //
        /////////////////
        /////////////////

        /**
         * Parses a complete first-level CREATE_GAME event.
         * @returns Event containing all the parsed informations
         */
        private parseCreateGame(): CreateGame {
            // Creating the event we'll return
            var event: CreateGame = new CreateGame();
            // Checking if we're on the correct line
            if (this.currentLine.type != LogLineType.CREATE_GAME) {
                throw new Error("Tried to parse wrong event");
            }
            this.nextLine();
            // Adding all meta information
            while (this.currentLine.type == LogLineType.meta) {
                var words = this.currentLine.print.split(" ");
                
                // Parsing the "GameEntity" part
                if (words[0] == "GameEntity") {
                    event.gameEntity = this.parseCreateGame_GameEntity();
                } else if (words[0] == "Player") {
                    event.players.push(this.parseCreateGame_Player());
                }
            }
            return event;
        }

        /**
         * Parses the GameEntity part in a CREATE_GAME event.
         */
        private parseCreateGame_GameEntity(): GameEntity {
            var line = this.currentLine;
            var assignations = ReplayParser.readAssignations(line.print);
            var gameEntity = new GameEntity(<number>assignations.EntityID);
                    
            // Getting all tag values in it
            var parentIndentation = line.indentation;
            this.nextLine();
            this.parseAllMetaTags(gameEntity, parentIndentation);

            return gameEntity;
        }

        /**
         * Parses a Player part in a CREATE_GAME event.
         */
        private parseCreateGame_Player(): Player {
            var assignations = ReplayParser.readAssignations(this.currentLine.print);
            var entityID: number;
            var playerID: number;
            var gameAccountId;
            for (var assignationKey in assignations) {
                var assignationValue = assignations[assignationKey];
                switch (assignationKey) {
                    case "EntityID":
                        entityID = assignationValue;
                        break;
                    case "PlayerID":
                        playerID = assignationValue;
                        break;
                    case "GameAccountId":
                        gameAccountId = assignationValue;
                        break;
                    default:
                        console.log("Unrecognized assignation in Player : " + assignationKey);
                }
            }
            var player = new Player(playerID, entityID, gameAccountId);
                    
            // Getting all tag values in it
            var parentIndentation = this.currentLine.indentation;
            this.nextLine();
            this.parseAllMetaTags(player, parentIndentation);

            return player;
        }
        
        /////////////////
        ///// Event /////
        // FULL_ENTITY //
        /////////////////
        /////////////////
        
        /**
         * Parses a complete first-level CREATE_GAME event.
         * @returns Event containing all the parsed informations
         */
        private parseFullEntity(): FullEntity {
            // Creating the event we'll return
            var event: FullEntity = new FullEntity();
            // Checking if we're on the correct line
            if (this.currentLine.type != LogLineType.FULL_ENTITY) {
                throw new Error("Tried to parse wrong event");
            }
            var id: number;
            var cardID: number;
            var assignations = ReplayParser.readAssignations(this.currentLine.print);
            for (var assignationKey in assignations) {
                var assignationValue = assignations[assignationKey];
                switch (assignationKey) {
                    case "ID":
                        event.id = assignationValue;
                        break;
                    case "CardID":
                        event.cardId = assignationValue;
                        break;
                    default:
                        console.log("Unrecognized assignation in FULL_ENTITY's declaration : " + assignationKey);
                }
            }
            
            // Getting all tag values in it
            var parentIndentation = this.currentLine.indentation;
            this.nextLine();
            this.parseAllMetaTags(event.entity, parentIndentation);

            return event;
        }
        
        ////////////////
        //// Event /////
        // TAG_CHANGE //
        ////////////////
        ////////////////
        
        private parseTagChange(): TagChange {
            // Creating the event we'll return
            var event = new TagChange();
            var assignations = ReplayParser.readAssignations(this.currentLine.print);
            for (var assignationKey in assignations) {
                var assignationValue = assignations[assignationKey];
                switch (assignationKey) {
                    case "Entity":
                        event.entity = assignationValue;
                        break;
                    case "tag":
                        event.tag = assignationValue;
                        break;
                    case "value":
                        event.value = assignationValue;
                        break;
                    default:
                        console.log("Unrecognized assignation in TAG_CHANGE : " + assignationKey);
                }
            }
            this.nextLine();

            return event;
        }
        
        //////////////////
        ////// Event /////
        // ACTION_START //
        //////////////////
        //////////////////
        
        private parseAction(): Action {
            // Creating the event we'll return
            var event = new Action();

            // Getting the assignation in this line
            var assignations = ReplayParser.readAssignations(this.currentLine.print);
            for (var assignationKey in assignations) {
                var assignationValue = assignations[assignationKey];
                switch (assignationKey) {
                    case "Entity":
                        event.entity = assignationValue;
                        break;
                    case "BlockType":
                        event.blockType = assignationValue;
                        break;
                    case "Index":
                        event.index = assignationValue;
                        break;
                    case "Target":
                        event.target = assignationValue;
                        break;
                    default:
                        console.log("Unrecognized assignation in ACTION_START : " + assignationKey);
                }
            }

            this.nextLine();
            
            // Getting all meta events
            var currentEvent: ReplayEvent;
            // TODO : There is *ONE* ACTION_START that does not end by an ACTION_END.
            // This needs to be handled correctly.
            while (this.currentLine.type != LogLineType.ACTION_END) {
                currentEvent = this.parseFirstLevelLine();
                if (currentEvent != undefined) {
                    event.events.push(currentEvent);
                }
                this.nextLine();
            }


            this.nextLine();

            return event;
        }
        
        /////////////
        // UTILITY //
        /////////////
        
        /**
         * Used to read a line containing assignations like "HEALTH=3 SOMETHING=[hi=2 low=4]"
         * @param line Contains only the assignations part of a line.
         * @return     Object containing left part of assignations as keys and right parts as values.
         */
        public static readAssignations(line: string): any {
            var findAssignations: RegExp = /(\S*?(?:\[\S+\])?)=(\[.*?\]|\S+)/g;
            var findArrayInDeclaration: RegExp;
            var findArrayInValue: RegExp;
            var readArrayInValue: RegExp;
            var assignations: any = new Array();
            var result = {};
            var replaceFunct = function(a, key, value): string {
                findArrayInValue = /\[(?: *(?:(\w|-)*)=(.*) *)*\]/g;

                if (findArrayInValue.test(value)) { // Check if there are arrays involved in the value
                    var resultValue = {};
                    readArrayInValue = /([^ \[\t\n\r]+)=((?:[^ =\]]+ *(?!\S+=))+)/g;
                    var replaceArrayValueFunct = function(a, b, c): string {
                        resultValue[b] = ReplayParser.tryParseInt(c);
                        return a;
                    };
                    value.replace(readArrayInValue, replaceArrayValueFunct);
                } else { // If no, simply parse the value
                    resultValue = ReplayParser.tryParseInt(value);
                }

                findArrayInDeclaration = /((?:\w|-)+)\[((?:\w|-)+)\]/g;
                var arrayDeclarationResult = findArrayInDeclaration.exec(key);
                if (arrayDeclarationResult != null) { // Check if there are arrays involved in the key
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
                        for (var resultKey in resultValue) {
                            result[arrayName][arrayIndex][resultKey] = resultValue[resultKey];
                        }
                    } else {
                        // If no entry, simply assign the object
                        result[arrayName][arrayIndex] = resultValue;
                    }
                } else {
                    // If there isn't any array in the key, simply assign the statement
                    result[key] = resultValue;
                }
                return a;
            };
            line.replace(findAssignations, replaceFunct);
            return result;
        }

        private static tryParseInt(value: string): (string | number) {
            return isNaN(parseInt(value)) ? value : parseInt(value);
        }
        
        /**
         * Parses all the meta tags on multiple lines and add them to an entity.
         * @param entity            Entity to which add parsed tags
         * @param parentIndentation Number of indentations of the event's declaration
         */
        private parseAllMetaTags(entity: Entity, parentIndentation: number): void {
            var assignations: any = new Array();
            while (this.currentLine.indentation > parentIndentation) {
                assignations = ReplayParser.readAssignations(this.currentLine.print);
                var tagKey: string;
                var tagValue: string | number;
                for (var assignationKey in assignations) {
                    var assignationValue = assignations[assignationKey];
                    if (assignationKey == "tag") {
                        tagKey = assignationValue;
                    } else if (assignationKey == "value") {
                        tagValue = assignationValue;
                    } else {
                        console.log("Unrecognized assignation (Not a tag/value assignation) : " + assignationKey);
                    }
                }
                entity.setTag(tagKey, tagValue);
                this.nextLine();
            }
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
            if (this.expectedPP != undefined && this.expectedPP != 0) {
                throw new Error("Misplaced DebugPrintPowerList()");
            }
            if (this.currentLine.type == LogLineType.meta) {
                this.expectedPP = parseInt(this.currentLine.print.split("Count=")[1]);
            } else {
                throw new Error("Malformed DebugPrintPowerList()");
            }
            this.nextLine();
        }

    }

}