import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User;
  userFromApi: User;

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
    this.userService.getUserById(this.currentUser.id).subscribe((user: User) => {
      this.userFromApi = user;
    });
    // this.userService.getUserById(this.currentUser.id).pipe(first()).subscribe(user => {
    //   this.userFromApi = user;
    // });
  }
}
