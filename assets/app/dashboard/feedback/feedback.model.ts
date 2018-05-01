export class Feedback{
    constructor(
        public title: string,
        public description: string,
        public feedbackId?: string,
        public createUser?: string,
        public createTimestamp?: string
    ){}
}