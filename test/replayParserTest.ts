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

///<reference path="lib/qunit"/>
///<reference path="../src/replayParser"/>
///<reference path="../src/logLine"/>

namespace HearthPlaysTest {
    export class ReplayParserTest {
        public static run() {
            QUnit.test("Parser tests", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(new TestCase("HEALTH=3", {"HEALTH" : 3}));
                tests.push(new TestCase("HEALTH=ALOT", {"HEALTH" : "ALOT"}));
                tests.push(new TestCase("HEALTH=3 ATTACK=2", {"HEALTH" : 3, "ATTACK" : 2}));
                tests.push(new TestCase("HEALTH=HEALTH ATTACK=ATTACK", {"HEALTH" : "HEALTH", "ATTACK" : "ATTACK"}));
                tests.push(new TestCase("ARRAY[0]=0", {"ARRAY" : {"0" : 0}}));
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = HearthPlays.ReplayParser.readAssignations(test.argument);
                    var message = "Parsing '" + test.argument + "'";
                    assert.deepEqual(result, test.expected, message);
                }
            });
        }
    }
    
    class TestCase {
        public argument: any;
        public expected: any;
        
        constructor(argument: any, expected: any) {
            this.argument = argument;
            this.expected = expected;
        }
    }
}