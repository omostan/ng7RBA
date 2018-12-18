import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AuthenticationService, UserService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  userFromAPi: User;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
   }

  ngOnInit() {
    this.getUserById();
  }

  getUserById() {
    this.userService.getUserById(this.currentUser.id).pipe(first()).subscribe(user => {
      this.userFromAPi = user;
    });
  }
}
