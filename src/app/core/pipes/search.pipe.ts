import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], word: string): any[] {
    return value.filter((value) => value.title.includes(word));
  }

}
