import {effect, Injectable, signal} from '@angular/core';

function syncEffect<T>(key: string , valueGetter: () => T) {
  return effect(() => localStorage.setItem('items', JSON.stringify(valueGetter())))
}
type Item = {
  id: number,
  name: string
}
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  // JSON.parse(localStorage.getItem('items')!) as Item[]
  // #item = signal<string | undefined>('abc') // private property
  // get item() {
  //   return this.#item()
  // }
  #items = signal(JSON.parse(localStorage.getItem('items')!) as Item[])
  synchronizeItemsEffect= syncEffect('items', () => this.#items())

  items = this.#items.asReadonly()

  clearItems() {
    // let removedItems = this.#items().splice(0)
    // let mutated = this.#items()
    // // this.items.set([])
    // console.log({removedItems, mutated})
    this.#items.set([])
  }

  appendItem(name: string) {
    this.#items.update(item => [...item, {id: item.length + 1, name: name}])
  }
}
