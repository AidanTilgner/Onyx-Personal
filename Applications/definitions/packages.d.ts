export type AppsPackageBody = {
  pkg: string;
  files: string[];
};

export type AppsPackage = {
  current_step: number;
  steps: {
    [key: number]: {
      action: string;
      deposit: number;
      data: {
        deposited: string;
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
