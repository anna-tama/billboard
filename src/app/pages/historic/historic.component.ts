
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from '../../modals/generic-modal/generic-modal.component';

@Component({
  selector: 'app-historic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historic.component.html',
  styleUrl: './historic.component.scss'
})
export class HistoricComponent implements OnInit {
  data: User[] | undefined = [];

  users$: Observable<any[]> | undefined;

  firestore = inject(Firestore);
  router = inject(Router)
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.users$ = collectionData(collection(this.firestore, "users"), { idField: 'id' }) as Observable<any[]>;
    this.users$.subscribe(data => {
      this.data = data;
    });
  }

  goToBillboard(item: User) {
    this.router.navigate(['/billboard'], {
      state: {
        data: item
      }
    });
  }

  goToForm() {
    this.router.navigate(['/form']);
  }

  editUser(item: User) {
    this.router.navigate(['/form'], {
      state: { data: item }
    });
  }

  async deleteRecord(id: string) {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '400px',
      data: { mensaje: 'Hola desde el modal' },
    });

    dialogRef.afterClosed().subscribe(async resultado => {
      if (resultado) {
        try {
          const userDocRef = doc(this.firestore, 'users', id);
          await deleteDoc(userDocRef);
        } catch (error) {
          console.error('Error eliminando el registro:', error);
        }
      }
    });
  }
}
