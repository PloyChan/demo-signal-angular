import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface User {
  id: number,
  name: string
}
@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {
  // #http = inject(HttpClient)
  //
  // getUser() {
  //   return this.#http.get<User[]>(`https://jsonplaceholder.typicode.com/users`)
  // }
}
