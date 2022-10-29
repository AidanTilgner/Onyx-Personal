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

export interface User {
  username: string;
  password: string;
  role: string;
}

export interface Role {
  name: string;
  permissions: string[];
  rank: number;
}

export type AllowedRoles = "hyperuser" | "superuser" | "user";
