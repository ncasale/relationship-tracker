/**
 * Representation of a relationship object in the app
 * 
 * @export
 * @class Relationship
 */
export class Relationship {
    constructor(public title: string,
        public relationshipId?: string,
        public userIds?: string[], 
        public invitees?: string[]) {}
}