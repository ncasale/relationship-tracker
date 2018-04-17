export class Chore {
    constructor(
        public title: string,
        public dueDate: Date,
        public assignedUserId: string,
        public relationshipId: string,
        public createUserId?: string,
        public createTimestamp?: Date,
        public editUserId?: string,
        public editTimestamp?: Date
    ) {}
}