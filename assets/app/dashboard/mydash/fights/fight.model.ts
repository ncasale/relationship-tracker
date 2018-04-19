export class Fight {
    constructor(
        public title: string,
        public descriptions: [{text:string, userId:string}],
        public causes: [{text:string, userId:string}],
        public resolutions: [{text:string, userId:string}],
        public fightDate: Date,
        public relationshipId: string,
        public fightId?: string,
        public createUserId?: string,
        public createTimestamp?: string,
        public editUserId?: string,
        public editTimestamp?: string
    ){}
}