import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface StatusFormValue {
  fullName: string;
  status: boolean | null;
  reason: string;
}

/**
 * Ejercicio: formulario reactivo con campo condicional.
 * - fullName: requerido, máx. 20 caracteres.
 * - status: radio True/False (requerido).
 * - reason: solo se muestra (y se vuelve requerido) cuando status === false.
 */
@Component({
  selector: 'app-status-form',
  imports: [ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-form.html',
  styleUrl: './status-form.scss',
})
export class StatusForm {
  private fb = inject(FormBuilder);

  readonly maxName = 20;
  protected submitted = signal<StatusFormValue | null>(null);

  form = this.fb.group({
    fullName: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(this.maxName)]),
    // null = ninguna opción elegida todavía
    status: this.fb.control<boolean | null>(null, Validators.required),
    reason: this.fb.nonNullable.control({ value: '', disabled: true }),
  });

  constructor() {
    // Validación dinámica: un control deshabilitado no se valida ni se incluye en form.value,
    // así que habilitar/deshabilitar es la forma más limpia de un campo condicional.
    this.form.controls.status.valueChanges.pipe(takeUntilDestroyed()).subscribe(status => {
      const reason = this.form.controls.reason;
      if (status === false) {
        reason.setValidators([Validators.required, Validators.minLength(5)]);
        reason.enable();
      } else {
        reason.clearValidators();
        reason.reset('');
        reason.disable();
      }
    });
  }

  protected get showReason(): boolean {
    return this.form.controls.status.value === false;
  }

  protected hasError(name: 'fullName' | 'status' | 'reason', error: string): boolean {
    const control = this.form.controls[name];
    return (control.touched || control.dirty) && control.hasError(error);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // getRawValue incluye los controles deshabilitados (reason vacío si status = true)
    this.submitted.set(this.form.getRawValue() as StatusFormValue);
    this.form.reset();
  }
}
