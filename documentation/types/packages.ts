export type NLUPackage = {
  current_step: number;
  steps: {
    [key: number]: {
      query: string;
      command: string;
      deposit: number;
      data: {
        deposited: string;
        gathered: any;
      };
      next: string;
      completed: boolean;
      errors: string[];
      use_files: number[];
    };
  };
  files: string[];
};
