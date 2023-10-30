import {HttpException, HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor() {}

    async use(req: any, res: any, next: () => void) {
        if (req.get("authorization")) {
            return next();
        } else {
            throw new HttpException("Authorization Token Required", HttpStatus.FORBIDDEN);
        }
    }
}
