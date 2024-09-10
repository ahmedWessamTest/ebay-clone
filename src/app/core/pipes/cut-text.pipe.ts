import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutText',
  standalone: true
})
export class CutTextPipe implements PipeTransform {

  transform(value: string, numberOfText: number): string {
    return value.split(" ", numberOfText).join('');
  }

}
