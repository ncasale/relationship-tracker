import { Http, Headers, Response } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Message } from "./message.model";
import { ErrorService } from "../../../error/error.service";
import "rxjs/Rx";
import { Observable } from "rxjs";
import { Relationship } from "../../../relationships/relationship.model";
import { RelationshipService } from "../../../relationships/relationship.service";

@Injectable()
export class MessagesService {
    //Signal to set current relationship
    currentMyDashRelationshipEmitter = new EventEmitter<Relationship>();

    //Signal that passed message has been deleted
    messageDeletedEmitter = new EventEmitter<Message>();

    //Signal that message was updated. Send message
    messageEditEmitter = new EventEmitter<Message>();

    //Inject services
    constructor(private http: Http, private errorService: ErrorService) {}

    /**
     * Save the passed message to the db.
     * 
     * @param {Message} message the message to save
     * @returns the saved message
     * @memberof MessagesService
     */
    saveMessage(message: Message) {
        //Construct body
        const body = JSON.stringify(message);
        //Construct headers
        const headers = new Headers ({'Content-Type':'application/json'});
        //Get token
        const token  = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:3000/message/add' + token, body, {headers:headers})
            .map((response: Response ) => {
                const result = response.json().obj;
                const message = new Message(
                    result.text,
                    result.relationshipId,
                    result.userId,
                    result._id,
                    result.createTimestamp,
                    result.editTimestamp 
                );
                return message;
                
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Edit a passed message
     * 
     * @param {Message} message the message to edit
     * @returns the edited message
     * @memberof MessagesService
     */
    editMessage(message: Message) {
        //Create body
        const body = JSON.stringify(message);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.patch('http://52.91.114.12:3000/message/edit/' + message.messageId + token, body, {headers:headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                    result.obj.text,
                    result.obj.relationshipId,
                    result.obj.userId,
                    result.obj._id,
                    result.obj.createTimestamp,
                    result.obj.editTimestamp
                )
                return message;
        })
        .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
        })
    }

    /**
     * Get all messages associated with passed relationship id
     * 
     * @param {string} relationshipId ID of relationship to get messasges for.
     * @returns list of messages
     * @memberof MessagesService
     */
    getMessages(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.post('http://52.91.114.12:3000/message/getmessages/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                var messages = response.json().obj;
                var transformedMessages = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.text,
                        message.relationshipId,
                        message.userId,
                        message._id,
                        message.createTimestamp,
                        message.editTimestamp
                    )
                    );
                }
                //this.messages = transformedMessages;
                return transformedMessages;

            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }
    
    /**
     * Delete message from db with passed id
     * 
     * @param {string} messageId id of message to delete from db
     * @returns the deleted message
     * @memberof MessagesService
     */
    deleteMessage(messageId : string) {
        //Get token
        const token = this.getToken();
        //Create request
        return this.http.delete('http://52.91.114.12:3000/message/deletemessage/' + messageId + token)
            .map((response: Response) => {})
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })        
    }

    /**
     * Returns the local storage token if it exists
     * 
     * @returns string - local storage token
     * @memberof RelationshipService
     */
    getToken() {
        return localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
    }

}