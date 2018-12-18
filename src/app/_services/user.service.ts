import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { Config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${Config.apiUrl}/users`);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${Config.apiUrl}/users/${id}`);
  }
}
