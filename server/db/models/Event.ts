import { Column, Table } from "@wwwouter/typed-knex";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

@Table("events")
export class Event extends BaseModel {
	@Column({ primary: true })
	public id: string;
	@Column()
	public createdAt: Date;
	@Column()
	public name: string;
	@Column()
	public startDate: Date;
	@Column()
	public duration: string;
	@Column()
	public details: string | null;
	@Column()
	public eventStarted: boolean;
	@Column()
	public eventFinished: boolean;
	@Column()
	public eventUrl: string;
	@Column()
	public creatorId: string;
	// @Column({ name: "creatorId" })
	// public user: User;
}

// function getEvents(trx: Knex.Transaction): Knex.QueryBuilder {
//     return db.query(Event).select();
// }
