/**
 * Representation of a message object in the app
 * 
 * @export
 * @class Message
 */
export class Message {
    constructor(public text: string,
        public relationshipId?: string,
        public userId?: string,
        public messageId?: string,
        public firstname?: string,
        public lastname?: string,
        public createTimestamp?: Date) {}
}