import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApiTags } from '@nestjs/swagger';
import { Application } from './applications.model';
import { TokenService } from '../app-commons/token.service';

@ApiTags("Applications")
@Controller('applications')
export class ApplicationsController {

    constructor(
        private applicationsService: ApplicationsService,
        private tokenService: TokenService
    ) {}

    @Post("create")
    async createApplication(@Body() application: Application) {
        try {
            await this.applicationsService.createApplication(application);
            return {
                code: 1,
                message: "Successfully created"
            }
        } catch (e) {
            // console.log(e)
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not create Application ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("email/:email/careerRoleId/:careerRoleId")
    async getApplication(
        @Param("email") email: string,
        @Param("careerRoleId") careerRoleId: string,
    ) {
        try {
            const application = await this.applicationsService.getApplication(email, careerRoleId);
            return {
                code: 1,
                application
            }
        } catch (e) {
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not get Application ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("list")
    async getApplications(
        @Headers("authorization") authorization: string
    ) {
        try {
            if(!authorization) throw new HttpException("Not authorized", HttpStatus.BAD_REQUEST);

            const token = authorization.split(" ")?.[1];
            const payload = await this.tokenService.verifyToken(token);
            if(!payload?.isAdmin) throw new HttpException("Not an admin", HttpStatus.BAD_REQUEST);
        } catch (e) {
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not create User ", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        try {
            const application = await this.applicationsService.getApplications();

            return {
                code: 1,
                application
            }
        } catch (e) {
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not get Application ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
