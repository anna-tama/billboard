import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './custom-date-parser-formatter.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FormularioComponent implements OnInit {
  form!: FormGroup;
  today: Date = new Date();
  mostrarOtroDestino = false;


  religiones = [
    { id: 'cristianismo', label: 'Cristianismo', value: 'cristianismo' },
    { id: 'budismo', label: 'Budismo', value: 'budismo' },
    { id: 'judaismo', label: 'Judaísmo', value: 'judaismo' },
    { id: 'evangelismo', label: 'Evangelismo', value: 'evangelismo' },
    { id: 'umbandismo', label: 'Umbandismo', value: 'umbandismo' },
  ];
  salas = [
    { id: 'salaA', label: 'Sala A', value: 'salaA' },
    { id: 'salaB', label: 'Sala B', value: 'salaB' },
  ];

  destinos = [
    { label: 'Crematorio: Burzaco', value: 'crematorio-burzaco', disabled: true },
    { label: 'Cementerio: Camposanto', value: 'cementerio-camposanto' },
    { label: 'Crematorio: Cementerio Libertad', value: 'crematorio-cementerio-libertad' },
    { label: 'Cementerio: Chacarita', value: 'cementerio-chacarita' },
    { label: 'Cementerio: Colonial', value: 'cementerio-colonial' },
    { label: 'Cementerio: Flores', value: 'cementerio-flores' },
    { label: 'Cementerio: Jardin de Paz Pilar', value: 'cementerio-pilar' },
    { label: 'Cementerio: Lar de Paz', value: 'cementerio-lar-de-paz' },
    { label: 'Cementerio: Las Praderas', value: 'cementerio-praderas' },
    { label: 'Cementerio: Libertad', value: 'cementerio-libertad' },
    { label: 'Crematorio: Lomas de Zamora', value: 'crematorio-lomas-de-zamora' },
    { label: 'Crematorio: Los Ceibos', value: 'crematorio-los-ceibos' },
    { label: 'Cementerio: Los Ceibos', value: 'cementerio-los-ceibos' },
    { label: 'Crematorio: Monte Paraiso', value: 'crematorio-monte-paraiso' },
    { label: 'Cementerio: Moron', value: 'cementerio-moron' },
    { label: 'Crematorio: Moron', value: 'crematorio-moron' },
    { label: 'Cementerio: Olivos', value: 'cementerio-olivos' },
    { label: 'Cementerio: Pablo Podesta', value: 'cementerio-podesta' },
    { label: 'Cementerio: Paraguay', value: 'cementerio-paraguay' },
    { label: 'Cementerio: Parque Hurlingham', value: 'cementerio-parque-hurlingham' },
    { label: 'Cementerio: Parque Iraola', value: 'cementerio-parque-iraola' },
    { label: 'Cementerio: San Justo', value: 'cementerio-san-justo' },
    { label: 'Cementerio: San Martin', value: 'cementerio-san-martin' },
    { label: 'Crematorio: San Martin', value: 'crematorio-san-martin' },
    { label: 'Cementerio: Villegas', value: 'cementerio-villegas' },
  ];

  router = inject(Router)
  fb = inject(FormBuilder)

  constructor() { }

  ngOnInit(): void {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaEntrada: [this.today, Validators.required],
      horaEntrada: ['', Validators.required],
      fechaSalida: [this.today, Validators.required],
      horaSalida: ['', Validators.required],
      destino: ['', Validators.required],
      nuevoDestino: [''],
      sala: ['', Validators.required],
      imagenPerfil: [''],
      imagenReligion: [''],
      religion: [this.religiones[0].value, Validators.required],
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
    if (this.form.valid) {
      localStorage.setItem('responso', JSON.stringify(this.form.value));
      this.router.navigate(['/cartelera']);
    }
  }

  onDestinoChange(): void {
    const valor = this.form.get('destino')?.value;
    this.mostrarOtroDestino = valor === 'otro';

    // Limpiar nuevo destino si se elige otra cosa
    if (!this.mostrarOtroDestino) {
      this.form.get('nuevoDestino')?.setValue('');
    }
  }

  agregarNuevoDestino(): void {
    const nuevoLabel = this.form.get('nuevoDestino')?.value?.trim();
    if (!nuevoLabel) return;

    const nuevoValue = this.slugify(nuevoLabel);

    // Agregar al array
    this.destinos.push({
      label: nuevoLabel,
      value: nuevoValue
    });

    // Establecer el nuevo destino en el form y ocultar input
    this.form.get('destino')?.setValue(nuevoValue);
    this.form.get('nuevoDestino')?.reset();
    this.mostrarOtroDestino = false;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // elimina acentos
      .replace(/\s+/g, '-')            // espacios → guiones
      .replace(/[^a-z0-9\-]/g, '')     // solo caracteres válidos
      .replace(/\-+/g, '-')
      .replace(/^\-+|\-+$/g, '');
  }

  get nuevoDestinoControl(): FormControl {
    return this.form.get('nuevoDestino') as FormControl;
  }
}
