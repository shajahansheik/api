import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Admin } from './admins.model';
import { TokenService } from '../app-commons/token.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Admins")
@Controller('admins')
export class AdminsController {

    constructor(
        private adminService: AdminsService,
        private tokenService: TokenService
    ) {}

    @Post("login")
    async login(@Body() admin: Admin) {
        try {
            const savedUser = await this.adminService.getAdminByEmail(admin.email);
            if(!savedUser) {
                throw new HttpException("Admin not found", HttpStatus.NOT_FOUND)
            }

            const isValidUser = await this.adminService.login(admin, savedUser);
            if(!isValidUser) {
                throw new HttpException("Wrong Passwond", HttpStatus.BAD_REQUEST)
            }

            const token = await this.tokenService.generateToken({
                email: admin.email,
                isAdmin: true
            })

            return {
                code: 1,
                token,
                admin: savedUser,
                message: "Valid Admin"
            }
        } catch (e) {
            // console.log(e)
            if (e.response && e.response.data)
                throw new HttpException(e.response.data.message, e.response.data.statusCode)
            if (e.status)
                throw new HttpException(e.message, e.status)
            throw new HttpException("Could not found Admin ", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
