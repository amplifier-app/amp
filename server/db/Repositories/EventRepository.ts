import { TypedKnex } from '@wwwouter/typed-knex';
import { Event } from '../models/Event';
import { BaseRepository } from './BaseRepository';

export class EventRepository extends BaseRepository<Event> {
    db: TypedKnex;

    constructor() {
        super(Event);
    }

    public async findOne(id: string): Promise<Event> {
        try {
            const query = this.db
                .query(Event)
                .where("id", id);

            return await query.getSingle().then((data: Event) => data);
        } catch (e) {
            throw new Error(`Failed to findOne item: ${e}`);
        }
    }
}

const eventRepository = new EventRepository();
export default eventRepository;