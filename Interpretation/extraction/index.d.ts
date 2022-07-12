type Extraction = {
  original_input: string;
  function: {
    type: string;
    name: string;
    arguments: { [key: string]: any };
  };
  confidence: number;
};

type Mappings = {
  [key: string]: number;
};
