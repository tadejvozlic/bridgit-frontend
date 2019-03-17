import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iterableNumber'
})
export class IterableNumberPipe implements PipeTransform {

  transform(value: number): number[] {
    return Array(value).fill(1).map((x, i) => i);
  }

}
