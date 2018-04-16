import { Component, Input } from "@angular/core";
import { DateObj } from "./dateObj.model";

@Component({
    selector: 'app-date-card',
    templateUrl: './date-card.component.html',
    styleUrls: ['./date-card.component.css']
})
export class DateCardComponent {
    @Input() date: DateObj;

}