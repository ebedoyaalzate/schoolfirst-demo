import { TestBed } from '@angular/core/testing';
import { FavoritesStore } from './favorites.store';

describe('FavoritesStore', () => {
  it('agrega y quita favoritos', () => {
    const store = TestBed.inject(FavoritesStore);
    store.toggle(1);
    store.toggle(2);
    expect(store.count()).toBe(2);
    store.toggle(1);
    expect(store.isFavorite(1)).toBeFalse();
    expect(store.ids()).toEqual([2]);
  });
});
