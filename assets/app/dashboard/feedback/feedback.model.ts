export class Feedback{
    constructor(
        public title: string,
        public description: string,
        public feedbackId?: string,
        public createUserId?: string,
        public createTimestamp?: string,
        public closed?: boolean
    ){}
}