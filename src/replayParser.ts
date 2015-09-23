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

namespace HearthPlays {
    export class ReplayParser {
        public static parse(logs: string): Replay {
            var content: string[] = logs.split("\n");
            var lines: LogLine[] = new Array<LogLine>();
            for (var i in content) {
                lines[i] = new LogLine(content[i]);
            }
            console.log(lines);
            return null;
        }
    }
    
    class LogLine {
        /** Useful content of the line i.e. Everything after "GameState.SomeThing() - ". Might containt useless leading spaces */
        private content: string;
        public type: string;
        public args: string;
        /** Level of indentation of the line. Usually corresponds to the nesting level of the line */
        public indentation: number;
        /** Actual useful content of the line */
        public data: string;
        /** Should be true. If not, it might be the last line of the file, and 'last' should be true. */
        public valid: boolean = false;
        /** True if it is detected as the last line. */
        public last: boolean = false;
        
        constructor(line: string) {
            // Might throw an error if the last line is empty
            try {
                this.content = line.split("() - ")[1];
                var temp = this.content.split("    ");
            } catch(e) {
                // This might be the last line
                if (e instanceof TypeError && this.content == undefined) {
                    // If it is, mark it as the last
                    this.last = true;
                    return;
                }
                // Else, this ain't normal : Throw the error.
                throw e;
            }
            this.indentation = temp.length-1;
            this.data = temp[this.indentation];
            this.valid = true;
        }
    }
}