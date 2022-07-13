export type Extraction = {
  original_input: string;
  function: {
    type: string;
    name: string;
    arguments: { [key: string]: any };
  };
  confidence: number;
};
