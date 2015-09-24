
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

///<reference path="logLineMethod.ts"/>
///<reference path="logLineType.ts"/>

namespace HearthPlays {
	export class LogLine {
		/** Useful content of the line i.e. Everything after "GameState.SomeThing() - ". Might containt useless leading spaces */
		private content: string;
		public args: string;
		/** Level of indentation of the line. Usually corresponds to the nesting level of the line */
		public indentation: number;
		/** Actual useful content of the line */
		public print: string;
		/** Should be true. If not, it might be the last line of the file, and 'last' should be true. */
		public valid: boolean = false;
		/** True if it is detected as the last line. */
		public last: boolean = false;
		public method: LogLineMethod;
		public type: LogLineType;

		constructor(line: string) {
			// Might throw an error if the last line is empty
			try {
				var parts = line.split("() - ");
				this.content = parts[1];
				var indentLevels = this.content.split("    ");
				
				// Check the method used to print
				var methodString = parts[0].split("GameState.")[1];
				switch (methodString) {
					case ("DebugPrintPower"):
						this.method = LogLineMethod.DEBUG_PRINT_POWER;
						break;
					case ("DebugPrintPowerList"):
						this.method = LogLineMethod.DEBUG_PRINT_POWER_LIST;
						break;
					case ("DebugPrintChoices"):
						this.method = LogLineMethod.DEBUG_PRINT_CHOICES;
						break;
					case ("SendChoices"):
						this.method = LogLineMethod.SEND_CHOICES;
						break;
					case ("DebugPrintOptions"):
						this.method = LogLineMethod.DEBUG_PRINT_OPTIONS;
						break;
					case ("SendOption"):
						this.method = LogLineMethod.SEND_OPTION;
						break;
				}

			} catch (e) {
				// This might be the last line
				if (e instanceof TypeError && this.content == undefined) {
					// If it is, mark it as the last
					this.last = true;
					return;
				}
				// Else, this ain't normal : Throw the error.
				throw e;
			}
			this.indentation = indentLevels.length - 1;
			this.print = indentLevels[this.indentation];
			
			// Check the type of the line
			var typeWord = this.content.split(" ")[0];
			switch (typeWord) {
				case ("CREATE_GAME"):
					this.type = LogLineType.CREATE_GAME;
					break;
				case ("FULL_ENTITY"):
					this.type = LogLineType.FULL_ENTITY;
					break;
				case ("ACTION_START"):
					this.type = LogLineType.ACTION_START;
					break;
				case ("ACTION_END"):
					this.type = LogLineType.ACTION_END;
					break;
				case ("TAG_CHANGE"):
					this.type = LogLineType.TAG_CHANGE;
					break;
				case ("SHOW_ENTITY"):
					this.type = LogLineType.SHOW_ENTITY;
					break;
				case ("HIDE_ENTITY"):
					this.type = LogLineType.HIDE_ENTITY;
					break;
				case ("META_DATA"):
					this.type = LogLineType.META_DATA;
					break;
				default:
					this.type = LogLineType.meta;
			}

			this.valid = true;
		}
	}
}