import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

/**
 * NgRx SignalStore: la alternativa moderna y ligera para estado local de una feature.
 * Sin actions ni reducers: estado + computed + métodos, todo basado en signals.
 */
export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState({ ids: [] as number[] }),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
  })),
  withMethods(store => ({
    isFavorite(id: number): boolean {
      return store.ids().includes(id);
    },
    toggle(id: number): void {
      patchState(store, ({ ids }) => ({
        ids: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id],
      }));
    },
  })),
);
