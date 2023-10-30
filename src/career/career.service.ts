import { Injectable } from '@nestjs/common';
import { MongoService } from '../app-commons/mongo.service';
import { v4 as uuidv4 } from 'uuid';
import { CareerRole } from './career.model';
import * as moment from "moment";

@Injectable()
export class CareerService {

    constructor(
        private mongoService: MongoService
    ) {}

    getCareerRoleId() {
        return `career_role|${uuidv4()}`
    }

    async addCareerRole(careerRole: CareerRole) {
        const careerRoleId = careerRole?.careerRoleId || this.getCareerRoleId();

        delete careerRole.careerRoleId;
        await this.mongoService.getCareersCollection().updateOne({
            careerRoleId
        }, {
            $setOnInsert: {
                careerRoleId,
            },
            $set: {
                ...careerRole,
                "metaInfo.createdAt": moment().unix()
            }
        }, {
            upsert: true
        })

        return {
            ...careerRole,
            careerRoleId
        }
    }

    async getCareerRolesList() {
        return await this.mongoService.getCareersCollection().find({
            isDeleted: {$ne: true}
        }, {projection: {_id: 0}}).toArray();
    }
}
