import { TypedKnex } from '@wwwouter/typed-knex';
import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';

export default class UserRepository extends BaseRepository<User> {
    db: TypedKnex;

    
}