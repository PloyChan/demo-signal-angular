import {Component, effect, inject, Injector} from '@angular/core';
import {ItemsService} from "../items.service";

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class ChildComponent {
  itemService = inject(ItemsService)
  #injector = inject(Injector)

  ngOnInit() {
    effect((onCleanup) => {
        const timerId = setInterval(() => {
          console.log(this.itemService.items().length)
        }, 1000)

        onCleanup(() => {
          console.log('on clean up')
          clearInterval(timerId)
        })
      },
      {
        injector: this.#injector
      })
  }

}
