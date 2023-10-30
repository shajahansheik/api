import { Injectable } from '@nestjs/common';
import { Mail } from './communication.mode';
const sgMail = require('@sendgrid/mail');

@Injectable()
export class CommunicationService {

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    }

    async sendEmail(mailConfig: Mail) {
        const msg = {
            to: mailConfig.emailTo,
            from: process.env.MAIL_FROM,
            subject: mailConfig.subject,
            html: mailConfig.templateData,
            attachments: []
        };
        if (mailConfig?.attachments?.length) {
            for (const attachemnt of mailConfig.attachments) {
                msg.attachments.push({
                    content: attachemnt.base64,
                    filename: attachemnt.filename,
                    type: attachemnt.mimeType
                });
            }
        }
        return await sgMail.send(msg);
    }

    async sentBuldEmails(mailData: Mail[]) {
        for(let mailConfig of mailData) {
            const msg = {
                to: mailConfig.emailTo,
                from: process.env.MAIL_FROM,
                subject: mailConfig.subject,
                html: mailConfig.templateData,
                attachments: []
            };
            if (mailConfig?.attachments?.length) {
                for (const attachemnt of mailConfig.attachments) {
                    msg.attachments.push({
                        content: attachemnt.base64,
                        filename: attachemnt.filename,
                        type: attachemnt.mimeType
                    });
                }
            }
            sgMail.send(msg);
        }
    }
}
