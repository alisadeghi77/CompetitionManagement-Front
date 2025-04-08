import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-jalaali';

@Pipe({
  name: 'persianDate',
  standalone: true
})
export class PersianDatePipe implements PipeTransform {
  transform(value: string | Date, format: string = 'jD jMMMM jYYYY'): string {
    if (!value) return '';
    return moment(value).locale('fa').format(format);
  }
}
