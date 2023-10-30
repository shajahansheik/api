
export class User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;

    isVerified: boolean;

    metaInfo: {
        createdAt: number;
    }
}