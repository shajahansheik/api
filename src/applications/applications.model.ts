import { CareerRole } from "../career/career.model";

class ApplicationType {
    static PRODUCT_MANAGE = "PRODUCT_MANAGE";
    static SENIOR_DEVELOPER = "SENIOR_DEVELOPER";
    static JUNIOR_BACKEND_ENGINEER = "JUNIOR_BACKEND_ENGINEER";
}

class SoftSkills {
    skill: string;
    level: string;
}

class Languages {
    language: string;
    level: string;
}

class Education {
    education: string;
    from: number;
    to: number;
}

class Internships {
    internship: string;
    from: number;
    to: number;
}

class Experience {
    from: number;
    to: number;
    duration: number;
    companyName: string;
    industry: string;
    jobTitle: string;
    projectObjective: string;
    accomplishments: string;
    programmingLanguagesUsed: string;
    softwareToolsUsed: string;
    operatingSystem: string;
    reference: string;
}

export class Application {
    applicationId: string;
    careerRoleInfo: CareerRole;
    email: string;
    softSkills: SoftSkills[];
    toKnowYourSelft: string[];
    languages: Languages[];
    education: Education[];
    internships: Internships[];
    experience: Experience[];

    metaInfo: {
        createdAt: number;
    }
}