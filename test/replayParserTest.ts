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
            QUnit.module("Parser");
            QUnit.test("Mono values only", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(new TestCase("HEALTH=3", { "HEALTH": 3 }));
                tests.push(new TestCase("HEALTH=ALOT", { "HEALTH": "ALOT" }));
                tests.push(new TestCase("HEALTH=3 ATTACK=2", { "HEALTH": 3, "ATTACK": 2 }));
                tests.push(new TestCase("HEALTH=HEALTH ATTACK=ATTACK", { "HEALTH": "HEALTH", "ATTACK": "ATTACK" }));
                tests.push(new TestCase("2=3", { "2": 3 }));
                tests.push(new TestCase("4=SOMEVALUE", { "4": "SOMEVALUE" }));
                tests.push(new TestCase("-5=5", { "-5": 5 }));
                tests.push(new TestCase("-6=-6", { "-6": -6 }));
                tests.push(new TestCase("HEALTH=-12", { "HEALTH": -12 }));
                tests.push(new TestCase("SOMETAG=0", { "SOMETAG": 0 }));
                tests.push(new TestCase("12SOMETAG=22TAG", { "12SOMETAG": 22 }));
                tests.push(new TestCase("SOMETAG330=TAG7", { "SOMETAG330": "TAG7" }));
                tests.push(new TestCase("SOMETAG=-0", { "SOMETAG": 0 }));
                tests.push(new TestCase("-SOMETAG=-0", { "-SOMETAG": 0 }));
                tests.push(new TestCase("-0=-0", { "-0": 0 }));
                tests.push(new TestCase("HEALTH=-ATTACK", { "HEALTH": "-ATTACK" }));
                tests.push(new TestCase("    TAG_CHANGE=-TAG_CHANGE", { "TAG_CHANGE": "-TAG_CHANGE" }));
                tests.push(new TestCase("    TAG_CHANGE TAG_CHANGE=TAG_CHANGE", { "TAG_CHANGE": "TAG_CHANGE" }));
                tests.push(new TestCase("    tag=ZONE value=DECK", { "tag": "ZONE", "value": "DECK" }));
                tests.push(new TestCase("FULL_ENTITY - Creating ID=6 CardID=EX1_032", { "ID": 6, "CardID": "EX1_032" }));
                tests.push(new TestCase("FULL_ENTITY - Creating ID=7 CardID=", { "ID": 7 }));
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = HearthPlays.ReplayParser.readAssignations(test.argument);
                    var message = "Parsing '" + test.argument + "' returns " + JSON.stringify(test.expected);
                    assert.deepEqual(result, test.expected, message);
                }
            });

            QUnit.test("Array in key", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(new TestCase("ARRAY[0]=0", { "ARRAY": { "0": 0 } }));
                tests.push(new TestCase("ARRAY[2]=144", { "ARRAY": { "2": 144 } }));
                tests.push(new TestCase("DATA[-1]=VALUE", { "DATA": { "-1": "VALUE" } }));
                tests.push(new TestCase("ENTITY[ID]=-0", { "ENTITY": { "ID": 0 } }));
                tests.push(new TestCase("ID[-DECK]=-ZONE", { "ID": { "-DECK": "-ZONE" } }));
                tests.push(new TestCase("ARRAY[2ID2]=-42", { "ARRAY": { "2ID2": -42 } }));
                tests.push(new TestCase("ARRAY[2]=2 ARRAY[3]=-3", { "ARRAY": { "2": 2, "3": -3 } }));
                tests.push(new TestCase("ARRAY[5]= ARRAY[6]=-3", { "ARRAY": { "6": -3 } }));
                tests.push(new TestCase("12[5]=0 12[6]=-3 13[6]=13", { "12": { "5": 0, "6": -3 }, "13": {"6": 13} }));
                tests.push(new TestCase("ID[-DECK]=ENTITY ID[DECK]=ID ID[ID]=DECK DECK[ENTITY]=-0",
                    { "ID": { "-DECK": "ENTITY", "DECK": "ID", "ID": "DECK"}, "DECK": {"ENTITY": 0} }));
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = HearthPlays.ReplayParser.readAssignations(test.argument);
                    var message = "Parsing '" + test.argument + "' returns " + JSON.stringify(test.expected);
                    assert.deepEqual(result, test.expected, message);
                }
            });
           
            QUnit.test("Array in value", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(new TestCase("ARRAY=[first=1]", { "ARRAY": { "first": 1 } }));
                tests.push(new TestCase("FNU=[2=3]", { "FNU": { "2": 3 } }));
                tests.push(new TestCase("ENTITY=[1=first]", { "ENTITY": { "1": "first" } }));
                tests.push(new TestCase("ENTITY=[4=-7]", { "ENTITY": { "4": -7 } }));
                tests.push(new TestCase("ENTITY=[-2=-0]", { "ENTITY": { "-2": 0 } }));
                tests.push(new TestCase("-2=[ENTITY=01LIFE]", { "-2": { "ENTITY": 1 } }));
                tests.push(new TestCase("ENTITY=[01=LIFE01]", { "ENTITY": { "01": "LIFE01" } }));
                tests.push(new TestCase("ENTITY=[01=LIFE01 2=TEST]", { "ENTITY": { "01": "LIFE01", "2": "TEST" } }));
                tests.push(new TestCase("ENTITY=[HEALTH=15 ATTACK=-15 -15ATTACK=]",
                { "ENTITY": { "HEALTH": 15, "ATTACK": -15 } }));
                tests.push(new TestCase("ENTITY=[HEALTH=-0 0= 12=2 -9=ATTACK]",
                { "ENTITY": { "HEALTH": 0, "12": 2, "-9": "ATTACK" } }));
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = HearthPlays.ReplayParser.readAssignations(test.argument);
                    var message = "Parsing '" + test.argument + "' returns " + JSON.stringify(test.expected);
                    assert.deepEqual(result, test.expected, message);
                }
            });
            
            QUnit.test("Array in both key and value", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(new TestCase("ENTITY[0]=[HEALTH=2]", { "ENTITY": { "0": {"HEALTH": 2} } }));
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = HearthPlays.ReplayParser.readAssignations(test.argument);
                    var message = "Parsing '" + test.argument + "' returns " + JSON.stringify(test.expected);
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