import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { ScheduleEvent } from './scheduling.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Scheduling")
@Controller('scheduling')
export class SchedulingController {
    constructor(
        private schedulingService: SchedulingService
    ) {}

    @Post("events/create")
    async createCalenderEvent(@Body() scheduleEvent: ScheduleEvent) {
        try {
            await this.schedulingService.createCalenderEvent(scheduleEvent);
            return {
                code: 1,
                message: "Your call scheduled"
            }
        } catch (error) {
            throw new HttpException(`Error${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("events")
    async getCalenderEvents(
        @Query("startDateTime") startDateTime: string,
        @Query("endDateTime") endDateTime: string
    ) {
        try {
            return await this.schedulingService.getEvents(startDateTime, endDateTime);
        } catch (error) {
            console.log(error?.response?.data)
            throw new HttpException(`Error${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("userEmail/:userEmail")
    async getScheduledDetails(
        @Param("userEmail") userEmail: string
    ) {
        try {
            const scheduledDetails = await this.schedulingService.getScheduledDetails(userEmail);
            return {
                code: 1,
                scheduledDetails
            }
        } catch (error) {
            console.log(error?.response?.data)
            throw new HttpException(`Error${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
