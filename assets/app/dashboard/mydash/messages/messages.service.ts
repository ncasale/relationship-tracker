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

    //Inject services
    constructor(private http: Http, private errorService: ErrorService) {}

    /**
     * Save a passed message to the database
     * 
     * @param message The message to save to the database
     */
    saveMessage(message: Message) {
        //Construct body
        const body = JSON.stringify(message);
        console.log('JSON Message: ', body);
        //Construct headers
        const headers = new Headers ({'Content-Type':'application/json'});
        //Get token
        const token  = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.post('http://localhost:3000/message/add' + token, body, {headers:headers})
            .map((response: Response ) => {
                const result = response.json();
                const message = new Message(
                    result.obj.text,
                    result.obj.relationshipId,
                    result.obj.userId,
                    result.obj._id,
                    result.obj.firstname,
                    result.obj.lastname
                )
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

    /**
     * Edit a passed message. The passed message contains the new content to update within the db.
     * 
     * @param message The message to edit
     */
    editMessage(message: Message) {
        //Create body
        const body = JSON.stringify(message);
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        return this.http.patch('http://localhost:3000/message/edit/' + message.messageId + token, body, {headers:headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                    result.obj.text,
                    result.obj.relationshipId,
                    result.obj.userId,
                    result.obj._id,
                    result.obj.firstname,
                    result.obj.lastname
                )
                return message;
        })
        .catch((error: Response) => {
            this.errorService.handleError(error.json());
            return Observable.throw(error.json());
        })
    }

    getMessages(relationshipId: string) {
        //Create body
        const body = {};
        //Create headers
        const headers = new Headers({'Content-Type':'application/json'});
        //Get token
        const token = localStorage.getItem('token') ?
            '?token=' + localStorage.getItem('token') :
            '';
        //Create request
        console.log(relationshipId);
        return this.http.post('http://localhost:3000/message/getmessages/' + relationshipId + token, body, {headers:headers})
            .map((response: Response) => {
                var messages = response.json().obj;
                var transformedMessages = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.text,
                        message.relationshipId,
                        message.userId,
                        message._id,
                        message.firstname
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


}