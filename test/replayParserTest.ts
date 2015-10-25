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
///<reference path="../src/replay"/>
///<reference path="../src/parser/replayParser"/>
///<reference path="../src/events/createGame"/>
///<reference path="../src/parser/logLine"/>

namespace HearthPlaysTest {
    export class ReplayParserTest {

        public static createGameString: string = `D 22:39:31.1128743 GameState.DebugPrintPower() - CREATE_GAME
D 22:39:31.1128743 GameState.DebugPrintPower() -     GameEntity EntityID=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=10 value=85
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=TURN value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=ZONE value=PLAY
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=ENTITY_ID value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=NEXT_STEP value=BEGIN_MULLIGAN
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=CARDTYPE value=GAME
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=STATE value=RUNNING
D 22:39:31.1128743 GameState.DebugPrintPower() -     Player EntityID=2 PlayerID=1 GameAccountId=[hi=144115198130930503 lo=29361374]
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=TIMEOUT value=75
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=PLAYSTATE value=PLAYING
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=CURRENT_PLAYER value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=FIRST_PLAYER value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=HERO_ENTITY value=4
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=MAXHANDSIZE value=10
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=STARTHANDSIZE value=4
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=PLAYER_ID value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=TEAM_ID value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=ZONE value=PLAY
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=CONTROLLER value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=ENTITY_ID value=2
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=MAXRESOURCES value=10
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=CARDTYPE value=PLAYER
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=NUM_TURNS_LEFT value=1
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=NUM_CARDS_DRAWN_THIS_TURN value=3
D 22:39:31.1128743 GameState.DebugPrintPower() -     Player EntityID=3 PlayerID=2 GameAccountId=[hi=144115198130930503 lo=20236080]
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=TIMEOUT value=75
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=PLAYSTATE value=PLAYING
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=HERO_ENTITY value=36
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=MAXHANDSIZE value=10
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=STARTHANDSIZE value=4
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=PLAYER_ID value=2
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=TEAM_ID value=2
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=ZONE value=PLAY
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=CONTROLLER value=2
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=ENTITY_ID value=3
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=MAXRESOURCES value=10
D 22:39:31.1128743 GameState.DebugPrintPower() -         tag=CARDTYPE value=PLAYER
D 22:39:31.1138745 GameState.DebugPrintPower() -         tag=NUM_TURNS_LEFT value=1
D 22:39:31.1138745 GameState.DebugPrintPower() -         tag=NUM_CARDS_DRAWN_THIS_TURN value=4
`;

        public static fullEntityString: string = `D 22:39:31.1138745 GameState.DebugPrintPower() - FULL_ENTITY - Creating ID=5 CardID=CS2_101
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=COST value=2
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ZONE value=PLAY
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CONTROLLER value=1
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ENTITY_ID value=5
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=FACTION value=NEUTRAL
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CARDTYPE value=HERO_POWER
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=RARITY value=FREE
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CREATOR value=4
D 22:39:31.1138745 GameState.DebugPrintPower() - FULL_ENTITY - Creating ID=6 CardID=EX1_032
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=HEALTH value=5
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ATK value=4
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=COST value=6
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ZONE value=HAND
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CONTROLLER value=1
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ENTITY_ID value=6
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=TAUNT value=1
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=DIVINE_SHIELD value=1
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=FACTION value=ALLIANCE
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CARDTYPE value=MINION
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=RARITY value=RARE
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ZONE_POSITION value=3
D 22:39:31.1138745 GameState.DebugPrintPower() - FULL_ENTITY - Creating ID=7 CardID=
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ZONE value=DECK
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CONTROLLER value=1
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ENTITY_ID value=7
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=ZONE_POSITION value=0
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=CANT_PLAY value=0
D 22:39:31.1138745 GameState.DebugPrintPower() -     tag=REVEALED value=0
`;

        public static run() {
            QUnit.module("Parser : Assignations");
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
                tests.push(new TestCase("12[5]=0 12[6]=-3 13[6]=13", { "12": { "5": 0, "6": -3 }, "13": { "6": 13 } }));
                tests.push(new TestCase("ID[-DECK]=ENTITY ID[DECK]=ID ID[ID]=DECK DECK[ENTITY]=-0",
                    { "ID": { "-DECK": "ENTITY", "DECK": "ID", "ID": "DECK" }, "DECK": { "ENTITY": 0 } }));
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
                tests.push(new TestCase("ENTITY=[ENTITY=]", { "ENTITY": {} }));
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
                tests.push(new TestCase("ENTITY[0]=[HEALTH=2]", { "ENTITY": { "0": { "HEALTH": 2 } } }));
                tests.push(new TestCase("ENTITY[ID]=[HEALTH=0 ATTACK=-3]", { "ENTITY": { "ID": { "HEALTH": 0, "ATTACK": -3 } } }));
                tests.push(new TestCase("ENTITY[-2]=[03=03 -4=LIFE LIFE= TEST= TAG=TAG]", { "ENTITY": { "-2": { "03": 3, "-4": "LIFE", "TAG": "TAG" } } }));
                tests.push(new TestCase("ENTITY[1]=[HEALTH=2 ENTITY=-0]", { "ENTITY": { "1": { "HEALTH": 2, "ENTITY": 0 } } }));
                tests.push(new TestCase("ENTITY[013LIFE]=[HEALTH=2L ATTACK=]", { "ENTITY": { "013LIFE": { "HEALTH": 2 } } }));
                tests.push(new TestCase("ENTITY[2]=[HEALTH=L3]", { "ENTITY": { "2": { "HEALTH": "L3" } } }));
                tests.push(new TestCase("ENTITY[0]=[HEALTH=2] ENTITY[0]=[ATTACK=3] ENTITY[0]=[COST=HEALTH]",
                    { "ENTITY": { "0": { "HEALTH": 2, "ATTACK": 3, "COST": "HEALTH" } } }));
                tests.push(new TestCase("ENTITY[0]=[HEALTH=2 ATTACK=12] ENTITY[1]=[ATTACK=3] ENTITY[TEST]=23",
                    { "ENTITY": { "0": { "HEALTH": 2, "ATTACK": 12 }, "1": { "ATTACK": 3 }, "TEST": 23 } }));
                tests.push(new TestCase("ENTITY[0]=[ENTITY=2] ENTITY[1]=[ATTACK=ATTACK] TEST[1]=[ENTITY=TEST TEST= TEST=-1 TEST=]",
                    { "ENTITY": { "0": { "ENTITY": 2 }, "1": { "ATTACK": "ATTACK" } }, "TEST": { "1": { "ENTITY": "TEST", "TEST": -1 } } }));
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = HearthPlays.ReplayParser.readAssignations(test.argument);
                    var message = "Parsing '" + test.argument + "' returns " + JSON.stringify(test.expected);
                    assert.deepEqual(result, test.expected, message);
                }
            });


            QUnit.module("Parser : CREATE_GAME");
            QUnit.test("Parsing GameEntity", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                
                // Parsing string : ReplayParserTest.fileStart
                var parser = new HearthPlays.ReplayParser();
                var input = ReplayParserTest.createGameString;
                var createGame = <HearthPlays.CreateGame>parser.parse(input).getTimeline()[0];
                tests.push(
                    new TestCase(
                        createGame,
                        85,
                        "In first CREATE_GAME, GameEntity's tag \"10\" is ",
                        (param) => (<HearthPlays.CreateGame>param).gameEntity.getTag("10")
                    ),
                    new TestCase(
                        createGame,
                        1,
                        "In first CREATE_GAME, GameEntity's \"EntityID\" is ",
                        (param) => (<HearthPlays.CreateGame>param).gameEntity.entityID
                    ),
                    new TestCase(
                        createGame,
                        "RUNNING",
                        "In first CREATE_GAME, GameEntity's tag \"STATE\" is ",
                        (param) => (<HearthPlays.CreateGame>param).gameEntity.getTag("STATE")
                    ),
                    new TestCase(
                        createGame,
                        2,
                        "In first CREATE_GAME, first Player's \"EntityID\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[0].entityID
                    ),
                    new TestCase(
                        createGame,
                        1,
                        "In first CREATE_GAME, first Player's \"PlayerID\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[0].playerID
                    ),
                    new TestCase(
                        createGame,
                        { "hi": 144115198130930503, "lo": 29361374 },
                        "In first CREATE_GAME, first Player's \"GameAccountId\" is : {\"hi\" : 144115198130930503, \"lo\" : 29361374}",
                        (param) => (<HearthPlays.CreateGame>param).players[0].gameAccountId
                    ),
                    new TestCase(
                        createGame,
                        "PLAYING",
                        "In first CREATE_GAME, first Player's tag \"PLAYSTATE\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[0].getTag("PLAYSTATE")
                    ),
                    new TestCase(
                        createGame,
                        75,
                        "In first CREATE_GAME, first Player's tag \"TIMEOUT\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[0].getTag("TIMEOUT")
                    ),
                    new TestCase(
                        createGame,
                        3,
                        "In first CREATE_GAME, first Player's tag \"NUM_CARDS_DRAWN_THIS_TURN\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[0].getTag("NUM_CARDS_DRAWN_THIS_TURN")
                    ),
                    new TestCase(
                        createGame,
                        3,
                        "In first CREATE_GAME, second Player's \"EntityID\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[1].entityID
                    ),
                    new TestCase(
                        createGame,
                        2,
                        "In first CREATE_GAME, second Player's \"PlayerID\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[1].playerID
                    ),
                    new TestCase(
                        createGame,
                        { "hi": 144115198130930503, "lo": 20236080 },
                        "In first CREATE_GAME, second Player's \"GameAccountId\" is : {\"hi\" : 144115198130930503, \"lo\" : 20236080}",
                        (param) => (<HearthPlays.CreateGame>param).players[1].gameAccountId
                    ),
                    new TestCase(
                        createGame,
                        "PLAYING",
                        "In first CREATE_GAME, second Player's tag \"PLAYSTATE\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[1].getTag("PLAYSTATE")
                    ),
                    new TestCase(
                        createGame,
                        75,
                        "In first CREATE_GAME, second Player's tag \"TIMEOUT\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[1].getTag("TIMEOUT")
                    ),
                    new TestCase(
                        createGame,
                        4,
                        "In first CREATE_GAME, second Player's tag \"NUM_CARDS_DRAWN_THIS_TURN\" is ",
                        (param) => (<HearthPlays.CreateGame>param).players[1].getTag("NUM_CARDS_DRAWN_THIS_TURN")
                    )
                );
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = test.callback(createGame);
                    var message = test.message + test.expected;
                    assert.deepEqual(result, test.expected, message);
                }
            });


            QUnit.module("Parser : FULL_ENTITY");
            QUnit.test("Parsing GameEntity", function(assert) {
                var tests: Array<TestCase> = new Array<TestCase>();
                
                // Parsing string : ReplayParserTest.fileStart
                var parser = new HearthPlays.ReplayParser();
                var input = ReplayParserTest.fullEntityString;
                
                // First Entity
                var fullEntity = <HearthPlays.FullEntity>parser.parse(input).getTimeline()[0];
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(
                    new TestCase(
                        fullEntity,
                        5,
                        "In first FULL_ENTITY, ID is ",
                        (param) => (<HearthPlays.FullEntity>param).id
                    ),
                    new TestCase(
                        fullEntity,
                        "CS2_101",
                        "In first FULL_ENTITY, CardID is ",
                        (param) => (<HearthPlays.FullEntity>param).cardId
                    ),
                    new TestCase(
                        fullEntity,
                        2,
                        "In first FULL_ENTITY, entity's tag \"COST\" is ",
                        (param) => (<HearthPlays.FullEntity>param).entity.getTag("COST")
                    ),
                    new TestCase(
                        fullEntity,
                        "NEUTRAL",
                        "In first FULL_ENTITY, entity's tag \"FACTION\" is ",
                        (param) => (<HearthPlays.FullEntity>param).entity.getTag("FACTION")
                    ),
                    new TestCase(
                        fullEntity,
                        4,
                        "In first FULL_ENTITY, entity's tag \"CREATOR\" is ",
                        (param) => (<HearthPlays.FullEntity>param).entity.getTag("CREATOR")
                    )
                );
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = test.callback(fullEntity);
                    var message = test.message + test.expected;
                    assert.deepEqual(result, test.expected, message);
                }
                
                // Third Entity
                var fullEntity = <HearthPlays.FullEntity>parser.parse(input).getTimeline()[2];
                var tests: Array<TestCase> = new Array<TestCase>();
                tests.push(
                    new TestCase(
                        fullEntity,
                        7,
                        "In third FULL_ENTITY, ID is ",
                        (param) => (<HearthPlays.FullEntity>param).id
                    ),
                    new TestCase(
                        fullEntity,
                        undefined,
                        "In third FULL_ENTITY, CardID is ",
                        (param) => (<HearthPlays.FullEntity>param).cardId
                    ),
                    new TestCase(
                        fullEntity,
                        "DECK",
                        "In third FULL_ENTITY, entity's tag \"ZONE\" is ",
                        (param) => (<HearthPlays.FullEntity>param).entity.getTag("ZONE")
                    ),
                    new TestCase(
                        fullEntity,
                        0,
                        "In third FULL_ENTITY, entity's tag \"REVEALED\" is ",
                        (param) => (<HearthPlays.FullEntity>param).entity.getTag("REVEALED")
                    )
                );
                for (var idx in tests) {
                    var test = tests[idx];
                    var result = test.callback(fullEntity);
                    var message = test.message + test.expected;
                    assert.deepEqual(result, test.expected, message);
                }
            });

        }
    }

    class TestCase {
        public argument: any;
        public expected: any;
        public message: string;
        public callback: (any?) => any;

        constructor(argument: any, expected: any, message?: string, callback?: (any?) => any) {
            this.argument = argument;
            this.expected = expected;
            this.message = message;
            this.callback = callback;
        }
    }
}