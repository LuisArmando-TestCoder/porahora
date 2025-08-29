import { user } from "$lib/stores/user";
import store, { emptyStoreSnapshot, saveToConfig, saveToStore } from "../../store";
import { complementaryColor, complementaryColorSnapshot, foregroundColor, foregroundColorSnapshot } from "../../ThemeChanger/theme-store";
import type { Store } from "../../types";

export default async function logout() {
  // Call server-side endpoint to erase user cookie
  await fetch("/logout", { method: "POST" });

  foregroundColor.set(foregroundColorSnapshot);
  complementaryColor.set(complementaryColorSnapshot);
  saveToStore(emptyStoreSnapshot);
  deleteAllKeysToSaveInLocalStorage();
  user.set(null);
  window.location.href = "/";
}

function deleteAllKeysToSaveInLocalStorage() {
  store.subscribe((currentStore: Store) => {
    for (const key of currentStore.keysToSave) {
      localStorage.removeItem(key);
    }
  });
}
