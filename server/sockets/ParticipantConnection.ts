import Room from "./models/Room";
import Participant from "./models/Participant";
import { Socket } from "socket.io";
// import { v4 as uuidv4 } from "uuid";
import eventRepository from "../db/Repositories/EventRepository";

// List of RoomID, and corresponding Room
const rooms = new Map<string, Room>();

export interface SocketConfig {
	roomId: string;
	dailyCoId: string;

	company: string;
	title: string;

	//Info from Auth0
	name?: string;
	sub?: string;
	picture?: string;
	email?: string;
	given_name?: string;
	family_name?: string;
	nickname?: string;
}

export default class ParticipantConnection {
	socket: Socket; // Current connection
	io: any; // Socket.io instance. For emitting events
	participant: Participant; // Current Participant
	room: Room; // Current Room

	constructor(socket: any, io: any, socketConfig: SocketConfig) {
		this.socket = socket;
		this.io = io;

		// Setup endpoints for this socket
		this.socket.on("JOIN_ROOM", (data: any, callback: any) => this.joinRoom(data, callback));
		this.socket.on("SWITCH_CHANNEL", (data: any) => this.switchChannel(data.channel));
		this.socket.on("START_BREAKOUT", (data: any) => this.startBreakout(data));
		this.socket.on("NEXT_BREAKOUT", (data: any) => this.nextBreakout(data));
		this.socket.on("STOP_BREAKOUT", (data: any) => this.stopBreakout());
		this.socket.on("UPDATE_FAVOURITE", (favouriteIds: string[]) => this.updateFavourite(favouriteIds));
		this.socket.on("disconnect", () => this.disconnect());
		this.socket.on("connect_error", (err: any) => {
			console.log(`connect_error due to ${err.message}`);
		});

		this.socket.join(socketConfig.roomId);

		// On new connection, Create a new Participant
		this.participant = new Participant(this.socket.id, socketConfig);

		//Create new room if not exists
		this.room = rooms.get(socketConfig.roomId);
		if (!this.room) {
			this.room = new Room(socketConfig.roomId);
			//Create Channel 0
			rooms.set(socketConfig.roomId, this.room);
		}
		this.room.participants.push(this.participant);
		this.room.setParticipantChannel(this.socket.id, 0);
		this.notifyChannelsChanged();
	}

	async joinRoom(data: any, callbackToSender: any) {
		
		const returnData: any = {
			channels: this.room.getChannelConfig(),
			endTime: this.room.endTimer
		};
		
		const event = await eventRepository.findOne(this.room.id);
		if (event && event.creatorId == this.participant.sub) {
			returnData.isAdmin = true;
		}
		callbackToSender(returnData);
	}

	// Set Participant's channel and broadcast to neccesary participants
	switchChannel(newChannel: number) {
		const oldChannelId = this.participant.channel;
		this.room.setParticipantChannel(this.socket.id, newChannel);
		this.notifyChannelsChanged();
	}

	startBreakout(minutes: number = 5) {
		this.room.admin = this.participant;
		if (this.room.participants.length < 3) {
			this.socket.emit("ADMIN_MESSAGE", "Please have at least 3 participants");
			return;
		}
		this.room.isInBreakout = true;
		this.room.rounds = [];
		this.room.generateBreakoutRound();
		this.room.breakoutRound = 0;
		this.room.endTimer = new Date(new Date().getTime() + minutes * 60000);

		//Broadcast to all participants
		this.io.in(this.room.id).emit("UPDATE_CHANNELS", {
			channels: this.room.getChannelConfig(),
			endTime: this.room.endTimer,
		});
	}

	nextBreakout(minutes: number = 5) {
		this.room.generateBreakoutRound();
		this.room.breakoutRound++;
		this.room.endTimer = new Date(new Date().getTime() + minutes * 60000);
		this.notifyChannelsChanged();
	}

	stopBreakout() {
		this.room.isInBreakout = false;
		this.room.participants.forEach((p) => (p.channel = 0));
		this.room.breakoutRound = 0;
		this.room.endTimer = null;
		this.notifyChannelsChanged();
	}

	updateFavourite(favouriteIds: string[]) {
		const participant = this.room.participants.find((p) => p.socketId == this.socket.id);
		participant.favouritesIds = favouriteIds;
	}

	notifyChannelsChanged() {
		// Compile an obj of channels and the participants in them.
		// eg. channel["2"] = ["member1Id", "member2Id"]
		// Notify to everyone in the room
		this.io.in(this.room.id).emit("UPDATE_CHANNELS", { channels: this.room.getChannelConfig(), endTime: this.room.endTimer });
	}

	// Remove participant from room
	disconnect() {
		this.room.participants = this.room.participants.filter((p) => p.socketId != this.socket.id);
		if (this.room.participants.length == 0) {
			//Delete room if everyone's gone
			rooms.delete(this.room.id);
		}
	}
}
