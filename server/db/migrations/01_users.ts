import { Knex } from "knex";

exports.up = (knex: Knex) => {
	return knex.schema.createTable("users", (t) => {
		t.uuid("id").primary();
		t.timestamp("createdAt").defaultTo(knex.fn.now());
		t.string("name");
	});
};

exports.down = (knex: Knex) => {
	return knex.schema.dropTable("users");
};
