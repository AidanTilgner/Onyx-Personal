export type NLUPackageBody = {
  pkg: string;
  files: string[];
};

export type NLUPackage = {
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
      use_files: number[];
    };
  };
  files: string[];
  session_id: string;
};
