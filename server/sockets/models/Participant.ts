import { SocketConfig } from "../ParticipantConnection";
import {
    BASE_SCORE,
    FavouriteScores,
    MATCHED_SCORE,
} from "../compatibility-weights"

export default class Participant {
    id: string; // ID from OAuth "sub" field
    dailyCoId: string; // Unique ID from DailyCo. Use this to subscribe to a channel
    socketId: string; // Unique ID of the connected Sockets
    socket: any; // Id of their Socket Connection
    channel: number; // Id of their Socket Connection

    company: string; // User's Company
    title: string; // User's Title

    //UserProfile Data from auth0
    name: string;
    sub: string;
    picture: string;
    email: string;
    given_name: string;
    family_name: string;
    nickname: string;

    //User's preferred people to match with. Order counts, and it should be three max
    favouritesIds: string[] = [];

    // People we've arleady matched with. Sorted by IDs
    matchedIds: string[] = [];

    localScores: { participantId: string, score: number }[];

    constructor(socketId: string, socketConfig: SocketConfig) {
        this.socketId = socketId;
        this.channel = 0;
        this.dailyCoId = socketConfig.dailyCoId;
        this.company = socketConfig.company;
        this.title = socketConfig.title;

        this.name = socketConfig.name;
        this.sub = socketConfig.sub;
        this.picture = socketConfig.picture;
        this.email = socketConfig.email;
        this.given_name = socketConfig.given_name;
        this.family_name = socketConfig.family_name;
        this.nickname = socketConfig.nickname;
    }

    toDTO(): any {
        return {
            id: this.dailyCoId,
            name: this.name,
            company: this.company,
            title: this.title,
            picture: this.picture,
        };
    }

    // Score of the compatability of two participants
    generateCompatibility(p2: Participant): number {
        var score = BASE_SCORE;

        // Check if they have matched before
        if (this.matchedIds.includes(p2.dailyCoId) || p2.matchedIds.includes(this.dailyCoId)) {
            return MATCHED_SCORE;
        }

        // Take into account our favourites
        if (this.favouritesIds.includes(p2.dailyCoId)) {
            //Get index of id from favourites eg. 0, 1, 2
            const index = this.favouritesIds.indexOf(p2.dailyCoId);
            // Add score
            score += FavouriteScores[index];
        }
        // Take into account their favourites
        if (p2.favouritesIds.includes(this.dailyCoId)) {
            const index = p2.favouritesIds.indexOf(this.dailyCoId);
            score += FavouriteScores[index];
        }

        return score;
    }

    m_makeLocalScores(participantIds: string[]) {
        participantIds.forEach(function (id) {
            if (id == this.dailyCoId) return;  //Dont add self to preferences

            // Set a default score to the base score
            var score = BASE_SCORE;

            // If there's some weighting attached by user, calculate preferences score
            if (this.favouritesIds.includes(id)) {
                //Get index of id from favourites eg. 0, 1, 2
                const index = this.favouritesIds.indexOf(id);
                // Add score
                score += FavouriteScores[index];
            }

            // if (this.matchedIds.includes(id)) {
            //     score *= MATCHED_SCORE;
            // }

            this.preferences.push({ participantId: id, score: BASE_SCORE })
        })
    }
}