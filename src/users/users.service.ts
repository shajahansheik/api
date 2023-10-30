import { Injectable } from '@nestjs/common';
import { MongoService } from '../app-commons/mongo.service';
import { User } from './users.model';
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {

    constructor(
        private mongoService: MongoService 
    ) {}

    getUserId() {
        return `user|${uuidv4()}`
    }

    async createUser(user: User) {
        user.userId = this.getUserId();
        user.password = await bcrypt.hash(user.password, 10)
        user.metaInfo = {
            createdAt: moment().unix()
        }
        user.isVerified = false;
        return this.mongoService.getUsersCollection().insertOne(user);
    }

    async getUserByEmail(email: string) {
        return await this.mongoService.getUsersCollection().findOne({ email, isVerified: true });
    }

    async login(user: User, savedUser: any) {
        return await bcrypt.compare(user.password, savedUser.password);
    }

    async getUsersList() {
        return await this.mongoService.getUsersCollection().find({isVerified: true}, {projection: {_id: 0, password: 0}}).toArray()
    }

    async verifyUser(email: string) {
        return await this.mongoService.getUsersCollection().updateOne({email}, {
            $set: {
                isVerified: true
            }
        })
    }
}
