import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private restangular: Restangular, private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.restangular.all('/users').doGET().pipe(map(data => {
      // console.log(data);
      return data;
    }),
    catchError(error => {
      return throwError(error.message || 'Server Error!');
    }),
    () => console.log('fetched data from REST successfully')
    );
  } 

  getHttpAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/users').pipe(tap(data => {
      return data
    }),
    catchError(error => {
      return throwError(error.message || 'Server Error!');
    })
    );
  }
}
