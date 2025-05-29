import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const parts = value.trim().split(this.DELIMITER);
    if (parts.length !== 3) return null;
    return {
      day: Number(parts[0]),
      month: Number(parts[1]),
      year: Number(parts[2]),
    };
  }

  format(date: NgbDateStruct | null): string {
    if (!date) return '';
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    return `${day}/${month}/${date.year}`;
  }
}
