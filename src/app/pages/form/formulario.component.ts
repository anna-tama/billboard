import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { addDoc, collection } from 'firebase/firestore'; // Sigue importando las funciones de Firebase SDK normal
import { doc, Firestore, updateDoc } from '@angular/fire/firestore'; // ¡Importa Firestore desde @angular/fire/firestore!
import { RELIGIONS } from '../../constants/religions';
import { ROOMS } from '../../constants/rooms';
import { DESTINATIONS } from '../../constants/destination';
import { Storage, uploadBytes, getDownloadURL, ref } from '@angular/fire/storage';


@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',

})
export class FormularioComponent implements OnInit {
  alertMessage: string = '';
  data: any;
  destinations: any[] = DESTINATIONS;
  form!: FormGroup;
  showOtherDestination = false;
  showAlert: boolean = false;
  religions: any[] = RELIGIONS;
  rooms: any[] = ROOMS;
  title: string = '';

  fb = inject(FormBuilder)
  firestore = inject(Firestore);
  storage = inject(Storage);
  router = inject(Router)

  constructor() { }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.data = nav?.extras?.state?.['data'] ?? history.state.data;
    if (this.data) {
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
      // imagenPerfil: [''],
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
    if (!this.form.valid) {
      this.showAlertMessage('Todos los campos son obligatorios');
      return;
    }

    const formValues = this.form.value;
    const userPayload = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dateEntry: formValues.dateEntry,
      timeEntry: formValues.timeEntry,
      dateDeparture: formValues.dateDeparture,
      timeDeparture: formValues.timeDeparture,
      destination: formValues.destination,
      room: formValues.room,
      religion: formValues.religion,
    };

    try {
      if (this.data) {
        await updateDoc(doc(this.firestore, 'users', this.data.id), userPayload);
        this.showAlertMessage('Editado correctamente');
      } else {
        const docRef = await addDoc(collection(this.firestore, 'users'), userPayload);
        await updateDoc(doc(this.firestore, 'users', docRef.id), { id: docRef.id });
        this.showAlertMessage('Agregado correctamente');
      }
    } catch (e) {
      console.error("Error al procesar documento: ", e);
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

  uploadFile(id: string) {
    const file: File = this.form.value.imagenPerfil;

    if (!file) {
      console.warn("No se seleccionó ningún archivo para subir.");
      return;
    }

    const filePath = `uploads/${id}`;
    const fileReference = ref(this.storage, filePath);

    uploadBytes(fileReference, file)
      .then(snapshot => getDownloadURL(snapshot.ref))
      .then(downloadURL => {
        console.log('URL de descarga:', downloadURL);
        // puedes actualizar el documento con el nuevo downloadURL aquí si lo deseas
      })
      .catch(error => {
        console.error("Error al subir el archivo: ", error);
      });
  }

  onDestinationChange(): void {
    const valor = this.form.get('destination')?.value;
    this.showOtherDestination = valor === 'otro';

    // Limpiar nuevo destino si se elige otra cosa
    if (!this.showOtherDestination) {
      this.form.get('newDestination')?.setValue('');
    }
  }

  addNewDestination(): void {
    const nuevoLabel = this.form.get('newDestination')?.value?.trim();
    if (!nuevoLabel) return;

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

  goToHistoric() {
    this.router.navigate(['/historic']);
  }
}