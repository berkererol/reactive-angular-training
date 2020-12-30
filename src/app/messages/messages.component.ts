import { MessagesService } from './messages.service';
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessage = false;

  errors$: Observable<string[]>;

  constructor(public MessagesService: MessagesService) {

  }

  ngOnInit() {
    this.errors$ = this.MessagesService.errors$.pipe(
      tap(() => {
        this.showMessage = true;
      }
    ));
  }


  onClose() {
    this.showMessage = false;


  }

}
