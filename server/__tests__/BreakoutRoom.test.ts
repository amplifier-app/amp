import Participant from "../sockets/models/Participant";
import Room from "../sockets/models/Room";
import { BASE_SCORE, FavouriteScores, MATCHED_SCORE } from "../sockets/compatibility-weights";
import { v4 as uuidv4 } from 'uuid';


function mockRoom(n: number = 6) {

    const room = new Room("asd098");
    //Generate Participants with random IDs
    for (var i = 0; i < n; i++) {
        room.participants.push(new Participant("1", {
            roomId: "1",
            dailyCoId: uuidv4(),
            name: "3",
            company: "4",
            title: "5",
        }));
    }
    room.isInBreakout = true;
    return room;
}


describe('Generating Compatability Scores (generateCompatabilityScores)', () => {
    const room = mockRoom();

    
    test('Score Favourites higher', (done) => {
        // Test 1st, Second and 3rd Favourites
        room.participants[0].favouritesIds.push(room.participants[1].dailyCoId)
        room.participants[0].favouritesIds.push(room.participants[2].dailyCoId)
        room.participants[0].favouritesIds.push(room.participants[3].dailyCoId)
        
        const pairingKey1 = room.getPairingKey(room.participants[0], room.participants[1])
        const pairingKey2 = room.getPairingKey(room.participants[0], room.participants[2])
        const pairingKey3 = room.getPairingKey(room.participants[0], room.participants[3])

        const scores = room.generateCompatabilityScores();

        expect(scores.get(pairingKey1)).toStrictEqual((BASE_SCORE) + FavouriteScores[0])
        expect(scores.get(pairingKey2)).toStrictEqual((BASE_SCORE) + FavouriteScores[1])
        expect(scores.get(pairingKey3)).toStrictEqual((BASE_SCORE) + FavouriteScores[2])
        done()
    });

    test('Discourage Already matched pairs', (done) => {
        room.participants[0].matchedIds.push(room.participants[1].dailyCoId)
        room.participants[0].matchedIds.push(room.participants[2].dailyCoId)

        const pairingKey1 = room.getPairingKey(room.participants[0], room.participants[1])
        const pairingKey2 = room.getPairingKey(room.participants[0], room.participants[2])
        const pairingKey4 = room.getPairingKey(room.participants[0], room.participants[4])

        const scores = room.generateCompatabilityScores();

        expect(scores.get(pairingKey1)).toStrictEqual(MATCHED_SCORE)
        expect(scores.get(pairingKey2)).toStrictEqual(MATCHED_SCORE)
        expect(scores.get(pairingKey4)).toStrictEqual(BASE_SCORE)
        done()
    })

})

describe("Test Rounds Generated from Scores (generateRoundFromScores) ", () => {
    const room = mockRoom();


    test('Discourage Already matched pairs', (done) => {

        //0: Cal
        //1: Jo
        //2: Alex
        //3: Lillia

        // Set 0 & 1 to be mutual favourites
        room.participants[0].favouritesIds.push(room.participants[1].dailyCoId)
        room.participants[1].favouritesIds.push(room.participants[0].dailyCoId)
        
        // Set 0 & 1 to be already matched
        room.participants[0].matchedIds.push(room.participants[1].dailyCoId)
        
        room.participants[2].matchedIds.push(room.participants[1].dailyCoId)

        const scores = room.generateCompatabilityScores();

        const round = room.generateRoundFromScores(scores);

        // Edge case, whre it's not discouraging matched pairs
        expect(round.pairings.find(pair => pair.participants.find(p => room.participants[0].dailyCoId == p.dailyCoId))).toBeNull()
        done()
    })

})