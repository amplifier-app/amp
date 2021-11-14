import BreakoutRound, { Pairing } from "./BreakoutRound";
import Participant from "./Participant";
import _ from "lodash";
import { BASE_SCORE, FavouriteScores, MATCHED_SCORE } from "../compatibility-weights";
import { Event } from '../../db/models/Event';

export default class Room {
	// event obj from our database
	event: Event;
	// ID of the DailyCo Event/Room
	id: string;
	//List of participants in room
	participants: Participant[] = [];

	//Admin ID. Set when breakout rooms are started, for ease early on.
	admin: Participant;
	rounds: BreakoutRound[] = [];

	isInBreakout: boolean = false;
	breakoutRound: number = 0;
	endTimer?: Date = null;

	constructor(id: string) {
		this.id = id;
	}

	setParticipantChannel(socketId: string, channel: number) {
		var participant = this.participants.find((p) => p.socketId == socketId);
		participant.channel = channel;
		if (this.isInBreakout) {
			this.rounds[this.breakoutRound].pairings[0].participants.push(participant);
		}
		return true;
	}

	getParticipantsInChannel(channelId: number) {
		return this.participants.filter((p) => p.channel == channelId);
	}

	getParticipant(id: string) {
		return this.participants.find((p) => p.dailyCoId == id);
	}

	// Get the channels the participants should be in at any one time
	getChannelConfig(): any {
		var channels: any = {};

		if (!this.isInBreakout) {
			this.participants.forEach((p) => {
				if (!channels[p.channel]) channels[p.channel] = [];
				channels[p.channel].push(p.toDTO());
			});
		} else {
			//Get the current round
			const round = this.rounds[this.breakoutRound];
			if (round == null) {
				// Breakouts are complete, push everyone back to channel 0
				this.isInBreakout = false;
				channels[0] = [];
				this.participants.forEach((p) => {
					channels[0].push(p.toDTO());
				});
				return channels;
			}
			round.pairings.forEach((pairing, index) =>
				pairing.participants.forEach((participant) => {
					if (!channels[index]) channels[index] = [];
					channels[index].push(participant.toDTO());
				})
			);
		}
		return channels;
	}

	generateBreakoutRound() {
		// --- NEW Algo ---
		// Scores rating compatability of each person
		const scores = this.generateCompatabilityScores();

		// Compile match scores into rounds
		const round = this.generateRoundFromScores(scores);

		console.log(round.pairings);
		// Add Matched, to apply penalty on next generation
		round.pairings.forEach((pairing) => {
			var p1Id = "";
			var p2Id = "";
			if (pairing.participants.length < 2) return; // Pairing was the host by themself

			p1Id = pairing.participants[0].dailyCoId;
			p2Id = pairing.participants[1].dailyCoId;

			this.participants.find((p) => p.dailyCoId == p1Id).matchedIds.push(p2Id);
			this.participants.find((p) => p.dailyCoId == p2Id).matchedIds.push(p1Id);
		});

		this.rounds.push(round);
	}

	generateCompatabilityScores(): Map<string, number> {
		const scores = new Map<string, number>();

		// Create a copy of participants
		const newParticipants = [...this.participants];
		while (newParticipants.length > 0) {
			const p1 = newParticipants[0];
			newParticipants.forEach((p2) => {
				if (p1.dailyCoId == p2.dailyCoId) {
					return;
				}
				const key = this.getPairingKey(p1, p2);
				const value = p1.generateCompatibility(p2);
				scores.set(key, value);
			});
			//Remove p[0] from the array because they have all their pairs calculated already.
			newParticipants.splice(0, 1);
		}
		return scores;
	}

	//return same key no matter the order
	getPairingKey(p1: Participant, p2: Participant) {
		if (p1.dailyCoId.localeCompare(p2.dailyCoId) == 1) {
			//If p1.id comes first in alphanbetical order
			return p1.dailyCoId + ";" + p2.dailyCoId;
		} else {
			return p2.dailyCoId + ";" + p1.dailyCoId;
		}
	}

	generateRoundFromScores(scores: Map<string, number>): BreakoutRound {
		const round = new BreakoutRound();

		//Sorted copy of scores, from highest to lowest
		const scoresSorted = _.fromPairs(_.sortBy(_.toPairs(scores), 1).reverse());
		var sortedParticipantKeys = Object.keys(scoresSorted);

		var isOdd = false;
		//If there's an odd number of participants, then remove the admin
		if (this.participants.length % 2 != 0) {
			isOdd = true;
			sortedParticipantKeys = sortedParticipantKeys.filter((k) => !k.includes(this.admin.dailyCoId));
		}

		while (sortedParticipantKeys.length > 0) {
			const [p1Id, p2Id] = sortedParticipantKeys[0].split(";");
			console.log("Score:", this.getParticipant(p1Id).name, this.getParticipant(p2Id).name, scores.get(sortedParticipantKeys[0]));

			if (p1Id != null && p2Id != null) {
				round.addPairing([this.getParticipant(p1Id), this.getParticipant(p2Id)]);
			}

			//Remove p1 & p2 from this round.
			sortedParticipantKeys = sortedParticipantKeys.filter((k) => !k.includes(p1Id) && !k.includes(p2Id));
		}

		if (isOdd && this.admin) {
			round.addPairing([this.admin]);
			round.setAdminFirstChannel(this.admin.dailyCoId);
		}

		return round;
	}

	m_generateCompatabilityScores(): any {
		const matrixSize = this.participants.length;
		const matrix = this.m_generateMatrix(matrixSize);

		const finalArray = Array(Math.floor(this.participants.length / 2)).fill([0, 0]);

		for (var i = 0; i < matrixSize; i++) {
			const matched = this.participants[i].matchedIds;
			const favouriteIds = this.participants[i].favouritesIds;

			const sortedByHightest: { participantId: string; score: number }[] = [];
			for (var j = i; j < matrixSize; j++) {
				if (i == j) {
					matrix[i][j] = 0;
					continue;
				} //Don't calculate self-compatability
				const p2 = this.participants[j];

				// If they've matched already, Decrease compatability score
				if (matched.includes(p2.dailyCoId)) {
					matrix[i][j] = MATCHED_SCORE;
					continue;
				}

				// Else, they're not matched
				// Populate their favourites
				if (favouriteIds.includes(p2.dailyCoId)) {
					// Get Index of favourite enGB. 1st, 2nd, 3rd
					const index = favouriteIds.indexOf(p2.dailyCoId);
					// Add score
					matrix[i][j] += FavouriteScores[index];
				}

				// add to SortedByHighest
				sortedByHightest.push();

				// matrix[j][i] != BASE_SCORE;
			}

			// Score by Compatability rating scores
			sortedByHightest.sort((a, b) => b.score - a.score);

			// Iterate through sortedByHightest
			// sortedByHightest.Foreach

			// Check finalArray has pairing already.
			// If not, Add Pairing to final pairings
			// finalArray.add()

			// Repeat until finalArray .length
			// finalArray.add()
		}

		return matrix;
	}

	m_generateMatrix(n: number = 100) {
		const matrix = [];
		for (var i = 0; i < n; i++) {
			matrix.push([]);
			for (var j = 0; j < n; j++) {
				matrix[i].push(BASE_SCORE * 2);
			}
		}

		return matrix;
	}
}
