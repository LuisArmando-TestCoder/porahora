import { writable } from 'svelte/store';

function createUserStore() {
  let initial = null;
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        initial = JSON.parse(stored);
      } catch {}
    }
  }
  const { subscribe, set, update } = writable(initial);

  // Save to sessionStorage on set (client only)
  return {
    subscribe,
    set: (value) => {
      if (typeof window !== 'undefined') {
        if (value) {
          sessionStorage.setItem('user', JSON.stringify(value));
        } else {
          sessionStorage.removeItem('user');
        }
      }
      set(value);
    },
    update
  };
}

export const user = createUserStore();
