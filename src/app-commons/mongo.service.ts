import { Injectable } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoService {
    medexMongoClient: MongoClient;
    MONGODB_NAME = "bondaf";

    bondafDb: Db;

    MONGO_VISITORS_COLLECTION_NAME = "visitors";
    MONGO_USERS_COLLECTION_NAME = "users";
    MONGO_ADMINS_COLLECTION_NAME = "admins";
    MONGO_APPLICATIONS_COLLECTION_NAME = "applications";
    MONGO_CAREER_ROLES_COLLECTION_NAME = "careers_roles";
    MONGO_SCHEDULING_COLLECTION_NAME = "scheduling";


    async onModuleInit(): Promise<void> {
        try {
            this.medexMongoClient = await MongoClient.connect(process.env.MONGO_URL);
            this.bondafDb = this.medexMongoClient.db(this.MONGODB_NAME);
            console.log(`Successfully connected to ${this.MONGODB_NAME.toUpperCase()} DB.`);
        } catch (e) {
            console.log('Error ', e);
        }
    }
    
    getVisitorsCollection(): Collection {
        return this.bondafDb.collection(this.MONGO_VISITORS_COLLECTION_NAME);
    }

    getUsersCollection(): Collection {
        return this.bondafDb.collection(this.MONGO_USERS_COLLECTION_NAME);
    }

    getAdminsCollection(): Collection {
        return this.bondafDb.collection(this.MONGO_ADMINS_COLLECTION_NAME);
    }

    getApplicationsCollection(): Collection {
        return this.bondafDb.collection(this.MONGO_APPLICATIONS_COLLECTION_NAME);
    }

    getCareersCollection(): Collection {
        return this.bondafDb.collection(this.MONGO_CAREER_ROLES_COLLECTION_NAME);
    }

    getSchedulingCollection(): Collection {
        return this.bondafDb.collection(this.MONGO_SCHEDULING_COLLECTION_NAME);
    }
}