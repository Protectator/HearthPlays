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

namespace HearthPlays {
	export class Tag {
		public key: string;
		public value: string;
		
		constructor(key: string, value: string) {
			this.key = key;
			this.value = value;
		}
	}
	
	// Will be used later
	export enum TagKey {
		TURN,
		ZONE,
		ENTITY_ID,
		NEXT_STEP,
		CARDTYPE,
		STATE,
		TIMEOUT,
		PLAYSTATE,
		CURRENT_PLAYER,
		FIRST_PLAYER,
		HERO_ENTITY,
		MAXHANDSIZE,
		STARTHANDSIZE,
		PLAYER_ID,
		TEAM_ID,
		CONTROLLER,
		MAXRESOURCES,
		NUM_TURNS_LEFT,
		HEALTH,
		FACTION,
		RARITY,
		SHOWN_HERO_POWER,
		CREATOR,
		ATK,
		COST,
		TAUNT,
		DIVINE_SHIELD,
		ZONE_POSITION,
		CANT_PLAY,
		REVEALED,
		PREMIUM,
		TIME,
		NUM_CARDS_DRAWN_THIS_TURN,
		CTRIGGER_VISUAL,
		ELITE,
		NUM_OPTIONS,
		STEP,
		NUM_TURNS_IN_PLAY,
		EXHAUSTED,
		HEROPOWER_ACTIVATIONS_THIS_TURN,
		RESOURCES,
		PREDAMAGE,
		LAST_AFFECTED_BY,
		NUM_TIMES_HERO_POWER_USED_THIS_GAME,
		NUM_OPTIONS_PLAYED_THIS_TURN,
		COMBO_ACTIVE,
		PROPOSED_ATTACKER,
		PROPOSED_DEFENDER,
		DEFENDING
	}
	
	// Will be used later
	export enum TagValue {
		PLAY,
		BEGIN_MULLIGAN,
		GAME,
		RUNNING,
		PLAYING,
		PLAYER,
		NEUTRAL,
		FREE,
		HERO_POWER,
		HAND,
		ALLIANCE,
		HORDE,
		MINION,
		DECK,
		ABILITY,
		INPUT,
		DESLING,
		COMMON,
		RARE,
		LEGENDARY,
		EPIC,
		WAITING,
		DONE,
		MAIN_READY,
		MAIN_START_TRIGGERS,
		MAIN_START,
		MAIN_ACTION,
		MAIN_END,
		MAIN_CLEANUP,
		MAIN_NEXT,
		MAIN_COMBAT,
		MAIN_EXIT,
		SETASIDE,
		ENCHANTMENT,
		GRAVEYARD,
		REMOVEDFROMGAME,
		WEAPON,
		LOSING,
		LOST,
		WON,
		WINNING,
		FINAL_WRAPUP,
		FINAL_GAMEOVER,
		COMPLETE
	}
}