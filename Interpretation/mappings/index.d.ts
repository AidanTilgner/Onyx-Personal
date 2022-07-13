export type Types = {
  [key: string]: { name: string; words: { [key: string]: { value: number } } };
};

export type Result = {
  type: string;
  subType: string;
  functionName: string;
};

export type Mappings = {
  [key: string]: { value: number };
};

export type CommandSubtypes = {
  [key: string]: {
    name: string;
    words: { [key: string]: { value: number } };
    func: {
      name: string;
      entities: { [key: string]: string };
    };
  };
};

export type QuerySubtypes = {
  [key: string]: {
    name: string;
    words: { [key: string]: { value: number } };
    func: {
      name: string;
      entities: { [key: string]: string };
    };
  };
};

declare module "*.json" {
  const value: any;
  export default value;
}
