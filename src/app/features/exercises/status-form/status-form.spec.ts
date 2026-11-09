import { TestBed } from '@angular/core/testing';
import { StatusForm } from './status-form';

describe('StatusForm', () => {
  let component: StatusForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatusForm] }).compileComponents();
    component = TestBed.createComponent(StatusForm).componentInstance;
  });

  it('requiere nombre y máximo 20 caracteres', () => {
    const name = component.form.controls.fullName;
    expect(name.hasError('required')).toBeTrue();
    name.setValue('a'.repeat(21));
    expect(name.hasError('maxlength')).toBeTrue();
    name.setValue('Ana Pérez');
    expect(name.valid).toBeTrue();
  });

  it('reason solo está activo y es requerido cuando status = false', () => {
    const { status, reason } = component.form.controls;
    expect(reason.disabled).toBeTrue();

    status.setValue(false);
    expect(reason.enabled).toBeTrue();
    expect(reason.hasError('required')).toBeTrue();

    status.setValue(true);
    expect(reason.disabled).toBeTrue();
    expect(reason.value).toBe('');
  });

  it('el formulario es válido con status true sin motivo', () => {
    component.form.setValue({ fullName: 'Ana', status: true, reason: '' });
    expect(component.form.valid).toBeTrue();
  });

  it('el formulario es inválido con status false sin motivo', () => {
    component.form.patchValue({ fullName: 'Ana', status: false });
    expect(component.form.valid).toBeFalse();
    component.form.controls.reason.setValue('Está enfermo');
    expect(component.form.valid).toBeTrue();
  });
});
