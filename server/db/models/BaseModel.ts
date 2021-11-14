import { Column, Table } from "@wwwouter/typed-knex";

@Table("base")
export class BaseModel {
    @Column({ primary: true })
    id: string;
    @Column()
    createdAt: Date;
}