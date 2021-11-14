import { Entity, TypedKnex } from '@wwwouter/typed-knex';
import db from "../knexInstance";
import { BaseModel } from '../models/BaseModel';
import { v4 as uuidv4 } from 'uuid';

export class BaseRepository<T extends BaseModel> {
    db: TypedKnex = db;

    // Pass in the entity class. eg: User, Event
    constructor(private entity: new () => BaseModel) { }

    public async getAll() {
        const query = this.db
            .query(this.entity);

        return await query.getMany();
    }

    public async findOne(id: string): Promise<T> {
        try {
            const query = this.db
                .query(this.entity)
                .where("id", id);

            return await query.getSingle().then((data: T) => data);
        } catch (e) {
            throw new Error(`Failed to findOne item: ${e}`);
        }
    }

    /**
     * Inserts model and returns the model
     * @param {T} model
     * @returns {Promise<T>} model
     */
    public async insertItem(model: T): Promise<T> {
        if (!model.id) {
            model.id = uuidv4();
        }
        if (!model.createdAt) {
            model.createdAt = new Date();
        }
        try {
            const item = await this.db
                .query(this.entity)
                .insertItem(model);
            return await this.findOne(model.id);
        } catch (e) {
            throw new Error(`Failed to insert item: ${e}`);
        }
    }

    /**
     * Updates model
     * @param {T} model
     * @returns {T} updateModel
     */
    public async updateItem(id: string, model: Partial<T>) {
        const transaction = await this.db.beginTransaction();
        try {
            await this.db
                .query(this.entity)
                .transacting(transaction)
                .updateItemByPrimaryKey(id, model);
            await transaction.commit();
            return this.findOne(id);
        } catch (e) {
            await transaction.rollback();
            throw new Error(`Failed to update item: ${e}`);
        }
    }
}