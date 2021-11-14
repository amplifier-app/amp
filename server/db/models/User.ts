import { Column, getTableName, Table } from "@wwwouter/typed-knex";
import db from "../knexInstance";
import { BaseModel } from "./BaseModel";

@Table("users")
export class User extends BaseModel {
    @Column({ primary: true })
    public id: string;
    @Column()
    public createdAt: Date;
    @Column()
    public name: string;
}