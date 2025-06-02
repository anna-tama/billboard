
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IDeceased } from '../../interfaces/deceased.interface';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartelera.component.html',
  styleUrl: './cartelera.component.scss'
})
export class CarteleraComponent implements OnInit {

  router = inject(Router)
  data: any;


 ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.data = nav?.extras?.state?.['data'] ?? history.state.data;
    console.log('Datos recibidos:', this.data);
  }

  getImgRoot(religion: string): string {
    const root = '../assets/img/religion/' + religion.toLowerCase() + '.svg'
    console.log('root', root)
    return root;
  }

  formatDate(fechaIso: string): string {
    const [year, month, day] = fechaIso.split('-');
    return `${day}/${month}/${year}`;
  }
}
