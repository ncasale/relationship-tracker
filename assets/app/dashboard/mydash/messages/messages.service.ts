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
        console.log('Sending add message request...');
        return this.http.post('http://localhost:3000/message/add' + token, body, {headers:headers})
            .map((response: Response ) => {
                const result = response.json();
                const message = new Message(
                    result.obj.text,
                    result.obj.relationshipId,
                    result.obj.userId
                )
                console.log('Final message: ', message);
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            })
    }

}