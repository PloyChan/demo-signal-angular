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
// export class AppComponent {
//   showChild: boolean = false;
//   itemService = inject(ItemsService)
//   userHttpService = inject(UsersHttpService)
//   #http = inject(HttpClient)
//   // user$ = this.userHttpService.getUser()
//   // user = toSignal(this.userHttpService.getUser())
//
//   user$ = this.getUser()
//   user = toSignal(this.getUser())
//   getUser() {
//     return this.#http.get<User[]>(`https://jsonplaceholder.typicode.com/users`)
//   }
//   chooseItem$ = new BehaviorSubject<number>(1)
//   chooseItem(id:number) {
//     this.chooseItem$.next(id)
//   }
//   chosenItem = toSignal(this.chooseItem$, {requireSync: true})
//   handleClick() {
//     console.log(this.itemService.items())
//   }
//   consoleLogEffect = effect(() => {
//     console.log(this.itemService.items(), untracked(() => this.nameFilter()))
//   });
//   lastItem = computed(() => this.itemService.items().slice(-1)[0])
//
//   nameFilter = signal('')
//   nameFilter$ = toObservable(this.nameFilter)
//
//   constructor() {
//     this.nameFilter$.subscribe(console.log)
//   }
//   updateNameFilter(event: Event) {
//     this.nameFilter.set((event.target as HTMLInputElement)['value'])
//   }
//   filterItem = computed(() => {
//     //case sensitive
//     // return this.items().filter(item => item.name.includes(this.nameFilter()))
//
//     //case insensitive
//     const nameFilter = this.nameFilter().toLowerCase()
//     return this.itemService.items().filter(item => item.name.toLowerCase().includes(nameFilter))
//   })
//
//   ascOrder = signal(true)
//   visible = computed(() => {
//     const order = this.ascOrder() ? 1 : -1
//     return this.filterItem().sort((a,b) => {
//       return a.name.localeCompare(b.name) * order
//     })
//   })
//
//   newItemName = signal('')
//
//   updateNewItem(event : Event) {
//     this.newItemName.set((event.target as HTMLInputElement)['value'])
//   }
// }
export class AppComponent {
  price = 100
  //signal(can wrap any type) number string boolean array function object
  //signal don't support the standard change value (quantity = 2) => is a standard change value
  //must use set() when set value for signal
  //get signal must like a function (quantity()) => is a gets the value
  //writeable signal requires a value
  //read and write
  quantity = signal(1)
  autoUpdate = false

  //computed signal requires an expression with signal
  //because total depend on quantity
  // total = this.price * this.quantity() // not working
  //computed function used to create a computed signal
  //read
  //signals getter call must not only exist, but actually be called
  //every computed signal has it own list of tracking signal
  //if at least one track signal changes, the computed signal is recalculated
  total = computed(() => {
    console.log('Computed signal: executed')
    if(this.autoUpdate) {
      return this.price * this.quantity() // not call and angular not tracking ต่อให้ set ค่าของ autoUpdate แล้วก็ตาม
    } else {
      return 0;
    }
  })
  id = signal(0)

  private logTotal = effect(() => {
    console.log('Total: ' + this.total())
  })

  //effect function call requires passing another function, which contains one or more signals
  // constructor() {
  //   //when signal is change the effect is not executed immediately
  //   //angular executes all effects only after changes in signals are completed
  //   //effect is executed only once after multiple signals is a changed
  //   //effect is executed if one or more signals have been changed
  //   //first execution identifies the signals in the effect whose values are gotten from a getter
  //   effect(() => {
  //     console.log('First effect')
  //     console.log('quantity: '+ this.quantity())
  //     console.log('total: '+ this.total())
  //     console.log('id: ' +this.id())
  //   });
  //   effect(() => {
  //     console.log('Second effect')
  //     console.log('id: ' +this.id())
  //     this.id.set(1000) //if don't have option this below are available it will cause an error on the frontend
  //     //if you need to change the signals inside the effect, you'll need to use this option
  //     //signal begin change in an effect without careful consideration can result in loops and other problems
  //   }, { allowSignalWrites: true});
  // }
  plus() {
    // this.quantity.set(this.quantity() + 1)
    this.quantity.update(value => value + 1)
    this.id.set(Math.random())
    this.autoUpdate = true
    console.log('Plus: click')
  }
  minus() {
    // this.quantity.set(this.quantity() - 1)
    this.quantity.update(value => value - 1)
  }
}
