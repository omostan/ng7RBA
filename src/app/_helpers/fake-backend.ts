import { Injectable, OnInit } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, catchError, first } from 'rxjs/operators';
import { User, Role } from '../_models';
import { UserService } from '../_services';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    users: User[] = [];

    constructor(private userService: UserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.getAllUsers();
        // this.users = [
        //     { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
        //     { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User },
        //     { id: 3, username: 'omostan', password: 'dmr', firstName: 'Stanley', lastName: 'Omoregie', role: Role.User }
        // ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer wvFxXr4lGEhD8Cs7Wrp-q9UVQdErrs2X');
        const roleString = isLoggedIn && authHeader.split('.')[1];
        const role = roleString ? Role[roleString] : null;

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            
            // authenticate - public
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {                
                const user = this.users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    token: `wvFxXr4lGEhD8Cs7Wrp-q9UVQdErrs2X.${user.role}`
                });
            }

            // get user by id - admin or user (user can only access their own record)
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (!isLoggedIn) return unauthorized();

                // get id from request url
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);

                // only allow normal users access to their own record
                const currentUser = this.users.find(x => x.role === role);
                if (id !== currentUser.id && role !== Role.Admin) return unauthorized();

                const user = this.users.find(x => x.id === id);
                return ok(user);
            }

            // get all users (admin only)
            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (role !== Role.Admin) return unauthorized();
                return ok(this.users);
            }

            // pass through any requests not handled above
            return next.handle(request);
        }))
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

        // private helper functions

        function ok(body: any) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } });
        }

        function error(message: string) {
            return throwError({ status: 400, error: { message } });
        }
    }

    //#region getAllUsers 

getAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(
          (data: User []) => {
              this.users = data;
          },
          catchError(err => {    
            return throwError(err);
          }),
          () => console.log('Successfully fetched data from REST server!')
        );
      }

//#endregion getAllUsers
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};