import { Alert } from "@src/declarations/main";
import { writable } from "svelte/store";

export const alerts = writable<Alert[]>([]);
export const currentAlert = writable<Alert | null>(null);

export const dispatchAlert = (alert: Alert) => {
  alerts.update((alerts) => [...alerts, alert]);
  currentAlert.set(alert);
};
