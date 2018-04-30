export class Gratitude {
    constructor(
        public title: string,
        public text: string,
        public gratitudeId?: string,
        public relationshipId?: string,
        public createTimestamp?: string,
        public createUser?: string,
        public editTimestamp?: string,
        public editUser?: string
    ) {}
}