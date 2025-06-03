import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { addDoc, collection } from 'firebase/firestore'; // Sigue importando las funciones de Firebase SDK normal
import { doc, Firestore, updateDoc } from '@angular/fire/firestore'; // ¡Importa Firestore desde @angular/fire/firestore!
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';
import { RELIGIONS } from '../../constants/religions';
import { ROOMS } from '../../constants/rooms';
import { DESTINATIONS } from '../../constants/destination';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',

})
export class FormularioComponent implements OnInit {

  alertMessage: string = '';
  form!: FormGroup;
  showOtherDestination = false;
  showAlert: boolean = false;
  title: string = '';
  destinations: any[] = DESTINATIONS;
  religions: any[] = RELIGIONS;
  rooms: any[] = ROOMS;

  router = inject(Router)
  fb = inject(FormBuilder)
  firestore = inject(Firestore);
  // storage = inject(Storage);

  data: any;

  constructor() { }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.data = nav?.extras?.state?.['data'] ?? history.state.data;
    if (this.data) {
      console.log('Datos recibidos:', this.data);
      this.title = 'Editar Registro';
    } else {
      this.title = 'Nuevo Registro';
    }
    this.formBuild();

  }

  formBuild() {
    const currentDate = this.getFormattedDate();
    const currentTime = this.getFormattedTime();

    this.form = this.fb.group({
      firstName: [this.data ? this.data.firstName : '', Validators.required],
      lastName: [this.data ? this.data.lastName : '', Validators.required],
      dateEntry: [this.data ? this.data.dateEntry : currentDate, Validators.required],
      timeEntry: [this.data ? this.data.timeEntry : currentTime, Validators.required],
      dateDeparture: [this.data ? this.data.dateDeparture : currentDate, Validators.required],
      timeDeparture: [this.data ? this.data.timeDeparture : currentTime, Validators.required],
      destination: [this.data ? this.data.destination : DESTINATIONS[0].label, Validators.required],
      newDestination: [''],
      room: [this.data ? this.data.room : ROOMS[0].label, Validators.required],
      imagenPerfil: [''],
      religion: [this.data ? this.data.religion : RELIGIONS[0].value, Validators.required],
    });
  }

  onFileChange(event: any, tipo: 'imagenPerfil' | 'imagenReligion') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ [tipo]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  async send() {
    if (this.form.valid && this.data) {
      console.log('actualizar registro')
      await updateDoc(doc(this.firestore, 'users', this.data.id), {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        dateEntry: this.form.value.dateEntry,
        timeEntry: this.form.value.timeEntry,
        dateDeparture: this.form.value.dateDeparture,
        timeDeparture: this.form.value.timeDeparture,
        destination: this.form.value.destination,
        room: this.form.value.room,
        imagenPerfil: this.form.value.imagenPerfil,
        religion: this.form.value.religion,
      });
      this.showAlertMessage('Editado correctamente')

    } else if (this.form.valid) {
      try {
        console.log('nuevo registro')

        const docRef = await addDoc(collection(this.firestore, "users"), {
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          dateEntry: this.form.value.dateEntry,
          timeEntry: this.form.value.timeEntry,
          dateDeparture: this.form.value.dateDeparture,
          timeDeparture: this.form.value.timeDeparture,
          destination: this.form.value.destination,
          room: this.form.value.room,
          imagenPerfil: this.form.value.imagenPerfil,
          religion: this.form.value.religion,
        });

        await updateDoc(doc(this.firestore, 'users', docRef.id), {
          id: docRef.id
        });
        this.showAlertMessage('Agregado correctamente')

        // this.uploadFile();
      } catch (e) {
        console.error("Error al añadir documento: ", e);
      }
    }
    else {
      this.showAlertMessage('Todos los campos son obligatorios');
    }
  }

  showAlertMessage(mensaje: string) {
    this.alertMessage = mensaje;
    this.showAlert = true;

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      this.showAlert = false;
      this.formBuild();
    }, 2500);
  }

  // async uploadFile() {
  //   try {
  //     // Asegúrate de que 'imagenPerfil' en tu formulario contenga un objeto File
  //     const file: File = this.form.value.imagenPerfil;

  //     if (!file) {
  //       console.warn("No se seleccionó ningún archivo para subir.");
  //       return null; // O lanza un error, dependiendo de tu lógica
  //     }

  //     const filePath = `uploads/${file.name}`;
  //     // Usar 'this.storage' que fue inyectado
  //     const fileReference = storageRef(this.storage, filePath); // <-- Aquí el cambio

  //     // Sube el archivo
  //     const snapshot = await uploadBytes(fileReference, file);
  //     console.log('¡Archivo subido exitosamente!', snapshot);

  //     // Obtiene la URL de descarga
  //     const downloadURL = await getDownloadURL(snapshot.ref);
  //     console.log('URL de descarga:', downloadURL);
  //     return downloadURL;

  //   } catch (error) {
  //     console.error("Error al subir el archivo: ", error);
  //     throw error; // Propaga el error para manejarlo en la UI
  //   }
  // }

  onDestinoChange(): void {
    const valor = this.form.get('destination')?.value;
    this.showOtherDestination = valor === 'otro';

    // Limpiar nuevo destino si se elige otra cosa
    if (!this.showOtherDestination) {
      this.form.get('newDestination')?.setValue('');
    }
  }

  agregarNuevoDestino(): void {
    const nuevoLabel = this.form.get('newDestination')?.value?.trim();
    if (!nuevoLabel) return;

    // Agregar al array
    this.destinations.push({
      label: nuevoLabel,
    });

    // Establecer el nuevo destino en el form y ocultar input
    this.form.get('destination')?.setValue(nuevoLabel);
    this.form.get('newDestination')?.reset();
    this.showOtherDestination = false;
  }


  get newDestinationControl(): FormControl {
    return this.form.get('newDestination') as FormControl;
  }

  private getFormattedDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // formato requerido por input type="date"
  }

  private getFormattedTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // formato requerido por input type="time"
  }

  verHistorial() {
    this.router.navigate(['/historic']);
  }
}