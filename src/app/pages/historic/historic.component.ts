
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IDeceased } from '../../interfaces/deceased.interface';
import { Observable } from 'rxjs';
import { collection } from 'firebase/firestore'; // Sigue importando las funciones de Firebase SDK normal
import { Firestore, collectionData } from '@angular/fire/firestore'; // ¡Importa Firestore desde @angular/fire/firestore!

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
  firestore = inject(Firestore);
  users$: Observable<any[]> | undefined;

  ngOnInit(): void {
    this.users$ = collectionData(collection(this.firestore, "users"), { idField: 'id' }) as Observable<any[]>;
    this.users$.subscribe(data => {
      this.data = data;
      console.log('Actualización de usuarios en tiempo real:', data);
    });
  }

  goToBillboard(item: IDeceased) {
    this.router.navigate(['/cartelera'], {
      state: {
        data: item
      }
    });
  }
}
