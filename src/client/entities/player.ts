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

///<reference path="../entity.ts"/>

namespace HearthPlays {
	export class Player extends Entity {
        public playerID: number;
        public entityID: number;
        public gameAccountId: {[key: string]: number};
        
        constructor(playerID: number, entityID: number, gameAccountId: {[key: string]: number}) {
            super();
            this.playerID = playerID;
            this.entityID = entityID;
            this.gameAccountId = gameAccountId;
        }
    }
}