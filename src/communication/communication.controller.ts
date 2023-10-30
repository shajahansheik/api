import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { Mail } from './communication.mode';
import { CommunicationService } from './communication.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Communication")
@Controller('communication')
export class CommunicationController {
    constructor(
        private communicationService: CommunicationService
    ) { }

    @Post("mail/send")
    async sendMail(@Body() mailData: Mail) {
        try {
            const res = await this.communicationService.sendEmail(mailData);
            return {
                code: 1,
                message: "Successfully mail sent",
                mailTo: mailData?.emailTo
            }
        } catch (error) {
            throw new HttpException(`Error${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("mail/bulk/send")
    async sentBuldEmails(@Body() mailData: Mail[]) {
        try {
            await this.communicationService.sentBuldEmails(mailData);
            return {
                code: 1,
                message: "Successfully mail sent"
            }
        } catch (error) {
            throw new HttpException(`Error${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
