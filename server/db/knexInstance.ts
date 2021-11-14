import { knex } from "knex";
import { TypedKnex } from "@wwwouter/typed-knex";
const config = require("./knexfile");
const env: string = process.env.NODE_ENV || "development";

const connection = new TypedKnex(knex(config[env]));

export default connection;
