export class User {
    constructor(public email: string,
        public password: string,
        public firstname?: string,
        public lastname?: string,
        public userId?: string,
        public createTimestamp?: Date
    ) {}
}