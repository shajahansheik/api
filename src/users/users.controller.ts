import { Body, Controller, Get, Head, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { CommunicationService } from '../communication/communication.service';
import { Mail } from '../communication/communication.mode';
import { TokenService } from '../app-commons/token.service';
import { TemplatesService } from '../app-commons/templates.service';

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private communicationService: CommunicationService,
        private tokenService: TokenService,
        private templateService: TemplatesService
    ) {}

    @Post("signup")
    async createUser(@Body() user: User) {
        try {
            const isUserExistd = await this.usersService.getUserByEmail(user.email);
            if(isUserExistd) {
                throw new HttpException("User already created", HttpStatus.CONFLICT)
            }

            await this.usersService.createUser(user);

            const token = await this.tokenService.generateToken({
                email: user.email
            })

            const templateData = this.templateService.userVerificationTemplate(user?.firstName+ " " +user?.lastName, token, user.email)
            const mailConfig: Mail = {
                emailTo: user?.email,
                subject: "Bondaf Verification",
                templateData
            }
            await this.communicationService.sendEmail(mailConfig)

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
            throw new HttpException("Could not create User ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("verify")
    async verifyUser(
        @Headers("authorization") authorization: string
    ) {
        if(!authorization) throw new HttpException("Not authorized", HttpStatus.BAD_REQUEST)

        try {
            const token = authorization.split(" ")?.[1];
            const payload = await this.tokenService.verifyToken(token);
            
            const savedUser = await this.usersService.getUserByEmail(payload?.email);
            if(savedUser?.isVerified) {
                return {
                    code: 0,
                    message: "Already Verified"
                }
            }

            await this.usersService.verifyUser(payload?.email) 
            return {
                code: 1,
                message: "Successfully Verified",
                user: savedUser
            }
        } catch (e) {
            if(e?.message == "Verification link expired") {
                return {
                    code: 401,
                    message: e?.message
                }
            }
            else if(e?.message == "invalid signature") {
                return {
                    code: 403,
                    message: e?.message
                }
            }
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not create User ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("login")
    async login(@Body() user: User) {
        try {
            const savedUser = await this.usersService.getUserByEmail(user.email);
            if(!savedUser) {
                throw new HttpException("User not found", HttpStatus.NOT_FOUND)
            }

            const isValidUser = await this.usersService.login(user, savedUser);
            if(!isValidUser) {
                throw new HttpException("Wrong Passwond", HttpStatus.BAD_REQUEST)
            }
            return {
                code: 1,
                user: savedUser,
                message: "Valid User"
            }
        } catch (e) {
            // console.log(e)
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not found User ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("list")
    async getUsersList(
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
            const users = await this.usersService.getUsersList();
            return {
                code: 1,
                message: "Successfully fetched users",
                users
            }
        } catch (error) {
            throw new HttpException("Couldn't get users", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
