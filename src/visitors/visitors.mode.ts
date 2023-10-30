
export class VisitorType {
    static PROFESSIONAL = "professional";
    static CASUAL = "casual";
}

export class Visitor {
    visitorId?: string;
    email?: string;
    visitorType?: VisitorType;
    firstVisitedAt?: number;
    lastVisitedAt?: number;
    visits?: {
        visitedAt: number
    }[];
}