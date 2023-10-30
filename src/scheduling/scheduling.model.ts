export class ScheduleEvent {
    userEmail: string;
    subject: string;
    body: {
        contentType: string;
        content: string;
    };
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    }
}