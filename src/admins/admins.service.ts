import { Injectable } from '@nestjs/common';
import { MongoService } from '../app-commons/mongo.service';
import { Admin } from './admins.model';
const bcrypt = require('bcrypt');

@Injectable()
export class AdminsService {
    constructor(
        private mongoService: MongoService
    ) {}

    async getAdminByEmail(email: string) {
        return await this.mongoService.getAdminsCollection().findOne({ email });
    }

    async login(admin: Admin, savedUser: any) {
        return await bcrypt.compare(admin.password, savedUser.password);
    }
}
