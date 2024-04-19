import {Component, computed, effect, inject, signal, untracked} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {BehaviorSubject} from "rxjs";
import {User, UsersHttpService} from "./users-http.service";
import {ItemsService} from "./items.service";
import {AsyncPipe, NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ChildComponent} from "./child/child.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgClass,
    ChildComponent,
    HttpClientModule
  ],
  providers: [HttpClient]
})
export class AppComponent {
  showChild: boolean = false;
  itemService = inject(ItemsService)
  userHttpService = inject(UsersHttpService)
  #http = inject(HttpClient)
  // user$ = this.userHttpService.getUser()
  // user = toSignal(this.userHttpService.getUser())

  user$ = this.getUser()
  user = toSignal(this.getUser())
  getUser() {
    return this.#http.get<User[]>(`https://jsonplaceholder.typicode.com/users`)
  }
  chooseItem$ = new BehaviorSubject<number>(1)
  chooseItem(id:number) {
    this.chooseItem$.next(id)
  }
  chosenItem = toSignal(this.chooseItem$, {requireSync: true})
  handleClick() {
    console.log(this.itemService.items())
  }
  consoleLogEffect = effect(() => {
    console.log(this.itemService.items(), untracked(() => this.nameFilter()))
  });
  lastItem = computed(() => this.itemService.items().slice(-1)[0])

  nameFilter = signal('')
  nameFilter$ = toObservable(this.nameFilter)

  constructor() {
    this.nameFilter$.subscribe(console.log)
  }
  updateNameFilter(event: Event) {
    this.nameFilter.set((event.target as HTMLInputElement)['value'])
  }
  filterItem = computed(() => {
    //case sensitive
    // return this.items().filter(item => item.name.includes(this.nameFilter()))

    //case insensitive
    const nameFilter = this.nameFilter().toLowerCase()
    return this.itemService.items().filter(item => item.name.toLowerCase().includes(nameFilter))
  })

  ascOrder = signal(true)
  visible = computed(() => {
    const order = this.ascOrder() ? 1 : -1
    return this.filterItem().sort((a,b) => {
      return a.name.localeCompare(b.name) * order
    })
  })

  newItemName = signal('')

  updateNewItem(event : Event) {
    this.newItemName.set((event.target as HTMLInputElement)['value'])
  }
}
