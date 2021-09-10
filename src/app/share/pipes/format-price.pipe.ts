import {Pipe, PipeTransform} from '@angular/core';
import {MultiLanguageService} from "../translate/multiLanguageService";

/*
 * Format price
 * Takes a string as a value.
 * Usage:
 *  value | formatPrice
 * Example:
 *  // value.name = 1000000
 *  {{ value.name | formatPrice  }}
 *  formats to: 1,000,000 đ
*/
@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {
  vndText: string = "₫";
  constructor() {
  }

  transform(value: any, args: any[]): string {
    if (value === null) return 'N/A';
    let val = (value / 1).toFixed(0).replace(".", ",");
    return (
      val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " " + this.vndText
    );
  }
}
