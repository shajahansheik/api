
export class Attachments {
    base64: string;
    filename: string;
    mimeType: string;
}

export class Mail {
    emailTo?: string;
    emailFrom?: string;
    subject?: string;
    templateData?: string;
    attachments?: Attachments[];
}