export type ActionsPackageBody = {
  pkg: string;
  files: string[];
};

export type ActionsPackage = {
  current_step: number;
  steps: {
    [key: number]: {
      action: string;
      deposit: number;
      data: {
        deposited: any;
        gathered: any;
      };
      next: string;
      completed: boolean;
      errors: any[];
      use_file: string;
      use_files: number[];
    };
  };
  files: string[];
};
