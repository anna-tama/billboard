
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billboard.component.html',
  styleUrl: './billboard.component.scss'
})
export class BillboardComponent implements OnInit {
  data: any;
  router = inject(Router)

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

  goToForm() {
    this.router.navigate(['/form']);
  }
}
