import { Injectable } from '@nestjs/common';
var jwt = require('jsonwebtoken');

@Injectable()
export class TokenService {

    async generateToken(payload: any) {
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 });
    }

    async verifyToken(token: any) {
        return await jwt.verify(token, process.env.TOKEN_SECRET);
    }
}
