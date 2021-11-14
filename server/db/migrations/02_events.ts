import { getTableName } from "@wwwouter/typed-knex";
import { Knex } from "knex";
import { Event } from "../models/Event";

export async function up(knex: Knex): Promise<void> {
	return knex.transaction(async (tx: Knex.Transaction) => {
		return knex.schema.createTable(getTableName(Event), (t: Knex.TableBuilder) => {
			t.uuid("id").primary();
			t.timestamp("createdAt").defaultTo(knex.fn.now());
			t.string("name");
			t.dateTime("startDate");
			t.string("duration");
			t.string("details").nullable();
			t.boolean("eventStarted").defaultTo(false);
			t.boolean("eventFinished").defaultTo(false);
			t.string("eventUrl");
			// t.string("creatorId").references("users.id").notNullable();
			t.string("creatorId").references("users.id");
		});
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("users");
}
