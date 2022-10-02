export type IO = {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
} | null;

export interface Alert {
  title: string;
  subtitle: string;
  caption: string;
  kind:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "info-square"
    | "warning-alt";
  visible: boolean;
  timeout?: number;
}
