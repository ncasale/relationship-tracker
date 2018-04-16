export class DateObj { 
    constructor(
        public title: string,
        public location: string,
        public hour: string,
        public minute: string,
        public date: Date,
        public relationshipId: string,
        public createUserId?: string,
        public createTimestamp?: Date,
        public editTimestamp?: Date
    ) {}
}