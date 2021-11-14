import Participant from "./Participant";

export default class BreakoutRound {
	pairings: Pairing[] = [];

	constructor() {}

	addPairing(participants: Participant[]) {
		this.pairings.push(new Pairing(participants));
	}
	
	setAdminFirstChannel(adminId: string) {
		const adminIndex = this.pairings.findIndex(p => p.participants.find(p => p.dailyCoId === adminId) != null);
		if (adminIndex) {
			const adminPairing = this.pairings[adminIndex];
			// Remove adminPairing
			this.pairings.splice(adminIndex, 1);
			// Insert adminPairing at the beginning
			this.pairings.unshift(adminPairing);
		}
	}

	hasParticipant(participant: Participant) {
		return this.pairings.findIndex(p => p.participants.find(p => p.dailyCoId === participant.dailyCoId) != null) !== -1;
	}
}

export class Pairing {
	participants: Participant[];

	constructor(participants: Participant[]) {
		this.participants = participants;
	}
}
