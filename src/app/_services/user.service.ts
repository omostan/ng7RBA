import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { Config } from '../config';
import { Restangular } from 'ngx-restangular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private restangular: Restangular) { }

  getAll() {
    return this.restangular.all('/users').doGET().pipe(map(data => {
      return data;
    }));
    // return this.http.get<User[]>(`${Config.apiHostUrl}/users`)map(data => {
    // return data;
    // }));
  }

  getUserById(id: number) {
    return this.restangular.one(`/users/${id}`).doGET().pipe(map(data => {
      // console.log('User by id: ' + JSON.stringify(data));
      return data;
    }));
    // return this.http.get<User>(`${Config.apiUrl}/users/${id}`)data => {
    // return data;
    // }));
  }
}
