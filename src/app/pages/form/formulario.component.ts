import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',

})
export class FormularioComponent implements OnInit {

  form!: FormGroup;
  showOtherDestination = false;

  religions = [
    { id: 'cristianismo', label: 'Cristianismo', value: 'cristianismo' },
    { id: 'budismo', label: 'Budismo', value: 'budismo' },
    { id: 'judaismo', label: 'Judaísmo', value: 'judaismo' },
    { id: 'evangelismo', label: 'Evangelismo', value: 'evangelismo' },
    { id: 'umbandismo', label: 'Umbandismo', value: 'umbandismo' },
    { id: 'none', label: 'Ninguno', value: 'none' },
  ];

  rooms = [
    { id: 'salaA', label: 'Sala A' },
    { id: 'salaB', label: 'Sala B' },
  ];

  destinations = [
    { label: 'Crematorio: Burzaco' },
    { label: 'Cementerio: Camposanto' },
    { label: 'Crematorio: Cementerio Libertad' },
    { label: 'Cementerio: Chacarita' },
    { label: 'Cementerio: Colonial' },
    { label: 'Cementerio: Flores' },
    { label: 'Cementerio: Jardin de Paz Pilar' },
    { label: 'Cementerio: Lar de Paz' },
    { label: 'Cementerio: Las Praderas' },
    { label: 'Cementerio: Libertad' },
    { label: 'Crematorio: Lomas de Zamora' },
    { label: 'Crematorio: Los Ceibos' },
    { label: 'Cementerio: Los Ceibos' },
    { label: 'Crematorio: Monte Paraiso' },
    { label: 'Cementerio: Moron' },
    { label: 'Crematorio: Moron' },
    { label: 'Cementerio: Olivos' },
    { label: 'Cementerio: Pablo Podesta', },
    { label: 'Cementerio: Paraguay' },
    { label: 'Cementerio: Parque Hurlingham', },
    { label: 'Cementerio: Parque Iraola' },
    { label: 'Cementerio: San Justo' },
    { label: 'Cementerio: San Martin' },
    { label: 'Crematorio: San Martin' },
    { label: 'Cementerio: Villegas' },
  ];

  router = inject(Router)
  fb = inject(FormBuilder)

  constructor() { }

  ngOnInit(): void {
    this.formBuild();
  }

  formBuild() {
    const currentDate = this.getFormattedDate();
    const currentTime = this.getFormattedTime();

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateEntry: [currentDate, Validators.required],
      timeEntry: [currentTime, Validators.required],
      dateDeparture: [currentDate, Validators.required],
      timeDeparture: [currentTime, Validators.required],
      destination: [this.destinations[0].label, Validators.required],
      newDestination: [''],
      room: [this.rooms[0].label, Validators.required],
      imagenPerfil: [''],
      religion: [this.religions[0].value, Validators.required],
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

  enviar() {
    console.log('enviar', this.form.value);
    console.log(localStorage.length)

    if (this.form.valid) {
      localStorage.setItem((localStorage.length + 1).toString(), JSON.stringify(this.form.value));
      // this.router.navigate(['/cartelera'], {
      //   state: { data: this.form.value }
      // });
    }
  }

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
