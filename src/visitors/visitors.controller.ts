import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { Visitor } from './visitors.mode';
import { ApiTags } from '@nestjs/swagger';
import { TokenService } from '../app-commons/token.service';

@ApiTags("Visitors")
@Controller('visitors')
export class VisitorsController {
    constructor(
        private visitorService: VisitorsService,
        private tokenService: TokenService
    ) {}

    @Post("add")
    async addVisitor(@Body() visitor: Visitor) {
        try {
            await this.visitorService.addVisitor(visitor);
            return {
                code: 1,
                message: "Successfully added",
                email: visitor?.email
            }
        } catch (error) {
            throw new HttpException("Couldn't add visitor", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("list")
    async getVisitorsList(
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

            const visitors = await this.visitorService.getVisitorsList();
            return {
                code: 1,
                message: "Successfully fetched visitors",
                visitors
            }
        } catch (error) {
            throw new HttpException("Couldn't get visitors", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("visitorId/:visitorId")
    async getVisitorById(@Param("visitorId") visitorId: string) {
        try {
            const visitor = await this.visitorService.getVisitorById(visitorId);
            return {
                code: 1,
                message: "Successfully fetched visitor",
                visitor
            }
        } catch (error) {
            throw new HttpException("Couldn't get visitor", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("email/:email")
    async getVisitorByEmail(@Param("email") email: string) {
        try {
            const visitor = await this.visitorService.getVisitorByEmail(email);
            return {
                code: 1,
                message: "Successfully fetched visitor",
                visitor
            }
        } catch (error) {
            throw new HttpException("Couldn't get visitor", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
