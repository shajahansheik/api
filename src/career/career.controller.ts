import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CareerService } from './career.service';
import { CareerRole } from './career.model';
import { ApiTags } from '@nestjs/swagger';
import { TokenService } from '../app-commons/token.service';

@ApiTags("Career Roles")
@Controller('career/roles')
export class CareerController {
    constructor(
        private careerService: CareerService,
        private tokenService: TokenService
    ) {}

    @Post("add")
    async addCareer(
        @Body() careerRole: CareerRole,
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
            const savedCareer = await this.careerService.addCareerRole(careerRole);
            return {
                code: 1,
                message: "Successfully added",
                savedCareer
            }
        } catch (error) {
            throw new HttpException("Couldn't add Career", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("list")
    async getCareerRolesList() {
        try {
            const careerRoles = await this.careerService.getCareerRolesList();
            return {
                code: 1,
                message: "Successfully fetched careers",
                careerRoles
            }
        } catch (error) {
            throw new HttpException("Couldn't get careers", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
