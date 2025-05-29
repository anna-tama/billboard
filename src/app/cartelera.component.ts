
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cartelera.component.html',
  styleUrl: './cartelera.component.scss'
})
export class CarteleraComponent {
  datos = JSON.parse(localStorage.getItem('responso')!);
}
