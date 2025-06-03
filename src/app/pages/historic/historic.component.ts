
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IDeceased } from '../../interfaces/deceased.interface';
import { Observable } from 'rxjs';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
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

  goToForm(){
     this.router.navigate(['/form']);
  }

 editUser(item: IDeceased) {
    this.router.navigate(['/form'], {
      state: { data: item } 
    });
  }

   async deleteRecord(id: string) {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este registro?');
    if (!confirmDelete) return;

    try {
      const userDocRef = doc(this.firestore, 'users', id);
      await deleteDoc(userDocRef);
      console.log(`Registro ${id} eliminado correctamente`);
    } catch (error) {
      console.error('Error eliminando el registro:', error);
    }
  }

}
