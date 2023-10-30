import { Injectable } from '@nestjs/common';
import { MongoService } from '../app-commons/mongo.service';
import * as moment from "moment";
import { Visitor } from './visitors.mode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VisitorsService {

    constructor(
        private mongoService: MongoService
    ) {}

    getVisitorId() {
        return `visitor|${uuidv4()}`
    }

    async addVisitor(visitor: Visitor) {
        const epocTime = moment().unix();
        return await this.mongoService.getVisitorsCollection().updateOne({
            email: visitor?.email
        }, {
            $setOnInsert: {
                visitorId: this.getVisitorId(),
                email: visitor?.email,
                visitorType: visitor?.visitorType,
                firstVisitedAt: epocTime
            },
            $set: {
                lastVisitedAt: epocTime
            },
            $push: {
                visits: {
                    visitedAt: epocTime
                }
            }
        }, {
            upsert: true
        })
    }

    async getVisitorsList() {
        return await this.mongoService.getVisitorsCollection().find({}, {projection: {_id: 0}}).toArray()
    }
    
    async getVisitorById(visitorId: string) {
        return await this.mongoService.getVisitorsCollection().findOne({visitorId}, {projection: {_id: 0}});
    }

    async getVisitorByEmail(email: string) {
        return await this.mongoService.getVisitorsCollection().findOne({email}, {projection: {_id: 0}});
    }
}
