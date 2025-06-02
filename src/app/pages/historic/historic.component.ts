
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IDeceased } from '../../interfaces/deceased.interface';

@Component({
  selector: 'app-historic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.scss'
})
export class HistoricComponent implements OnInit {
  data: IDeceased[] | undefined = [];

  router = inject(Router)

  ngOnInit(): void {
    Object.keys(localStorage).map((key: string) => {
      this.data?.push(JSON.parse(localStorage.getItem(key)!));
    })
  }

  goToBillboard(item: IDeceased) {
    this.router.navigate(['/cartelera'], {
      state: {
        data: item
      }
    });
  }
}
