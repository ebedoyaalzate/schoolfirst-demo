import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentCard } from './student-card';

describe('StudentCard', () => {
  let fixture: ComponentFixture<StudentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StudentCard] }).compileComponents();
    fixture = TestBed.createComponent(StudentCard);
    // Con input() se usa setInput, no asignación directa
    fixture.componentRef.setInput('student', { id: 7, name: 'Ana', grade: 9, email: 'a@s.com', average: 4.25 });
    await fixture.whenStable();
  });

  it('muestra nombre y promedio formateado', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Ana');
    expect(text).toContain('4.3');
  });

  it('emite el id al seleccionar', () => {
    let emitted: number | undefined;
    fixture.componentInstance.select.subscribe(id => (emitted = id));
    fixture.nativeElement.querySelector('button.main').click();
    expect(emitted).toBe(7);
  });

  it('expone el estado de favorito para lectores de pantalla', async () => {
    fixture.componentRef.setInput('favorite', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button.fav').getAttribute('aria-pressed')).toBe('true');
  });
});
