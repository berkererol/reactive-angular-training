import { AuthStore } from './services/auth.store';
import { MessagesService } from './messages/messages.service';
import { LoadingService } from './loading/loading.service';
import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LoadingService,
    MessagesService
  ]
})
export class AppComponent implements  OnInit {

    constructor(public authStore: AuthStore) {

    }

    ngOnInit() {


    }

  logout() {
    this.authStore.logout();
  }

}
