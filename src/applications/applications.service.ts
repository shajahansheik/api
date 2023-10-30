import { Injectable } from '@nestjs/common';
import { Application } from './applications.model';
import { MongoService } from '../app-commons/mongo.service';
import { v4 as uuidv4 } from 'uuid';
import * as moment from "moment";

@Injectable()
export class ApplicationsService {
    constructor(
        private mongoService: MongoService
    ) {}

    getApplicationId() {
        return `application|${uuidv4()}`
    }

    async createApplication(application: Application) {
        application.applicationId = this.getApplicationId();
        application.metaInfo = {
            createdAt: moment().unix()
        }

        return await this.mongoService.getApplicationsCollection().insertOne(application);
    }

    async getApplication(email: string, careerRoleId: string) {
        return await this.mongoService.getApplicationsCollection().findOne({
            "userDetails.email": email,
            "careerRoleInfo.careerRoleId": careerRoleId
        })
    }

    async getApplications() {
        return await this.mongoService.getApplicationsCollection().find({}).toArray()
    }
}
