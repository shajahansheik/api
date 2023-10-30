import { Injectable } from '@nestjs/common';
import { ScheduleEvent } from './scheduling.model';
import { MongoService } from '../app-commons/mongo.service';
const axios = require('axios').default;
import * as moment from "moment";

@Injectable()
export class SchedulingService {
    constructor(
        private mongoService: MongoService
    ) {}

    async getMicrosoftGraphApisAccessToken() {
        const tokenRes = await axios.post(`${process.env.OUTLOOK_TOKEN_URI}/common/oauth2/v2.0/token`, {
            "client_id": process.env.OUTLOOK_CLIENT_ID,
            "client_secret": process.env.OUTLOOK_CLIENT_SECRET,
            "refresh_token": process.env.OUTLOOK_REFRESH_TOKEN,
            "grant_type": process.env.OUTLOOK_GRANT_TYPE,
            "scope": process.env.OUTLOOK_SCOPE
        }, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
        return tokenRes?.data?.access_token
    }

    async createCalenderEvent(scheduleEvent: ScheduleEvent) {

        await this.mongoService.getSchedulingCollection().insertOne({
            ...scheduleEvent,
            scheduledAt: moment(scheduleEvent?.end?.dateTime).unix()
        });

        delete scheduleEvent.userEmail;
        const outlookAccessToken = await this.getMicrosoftGraphApisAccessToken();
        let res = await axios.post(`${process.env.OUTLOOK_EVENTS_URI}/v1.0/me/events`, scheduleEvent, {
            headers: {
                "Authorization": "Bearer " + outlookAccessToken
            }
        })
        return res?.data;
    }

    async getEvents(startDateTime: string, endDateTime: string) {
        const outlookAccessToken = await this.getMicrosoftGraphApisAccessToken();

        let res = await axios.get(`${process.env.OUTLOOK_EVENTS_URI}/v1.0/me/calendar/calendarView?startDateTime=${startDateTime}&endDateTime=${endDateTime}`, {
            headers: {
                "Authorization": "Bearer " + outlookAccessToken,
                "Prefer": "outlook.timezone=\"India Standard Time\""
            }
        })
        return res?.data;
    }

    async getScheduledDetails(userEmail) {
        return await this.mongoService.getSchedulingCollection().findOne({
            userEmail,
            scheduledAt: {$gt: moment().unix()}
        })
    }
}
