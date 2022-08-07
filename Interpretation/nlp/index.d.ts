export type TextToIntent = {
  name: string;
  examples: {
    text: string;
    intent: string;
    language: string;
  }[];
}[];

export type IntentToAction = {
  [key: string]: {
    [key: string]: {
      action: string;
    };
  };
};

export type Entity = {
  start: number;
  end: number;
  len: number;
  accuracy: number;
  sourceText: string;
  utteranceText: string;
  entity: string;
  resolution: {
    value: string | number;
    type: string;
    strValue: string;
    subtype: string;
    unit: string;
    localUnit: string;
    timex: string;
    date: string;
    strPastValue: string;
    strFutureValue: string;
    pastDate: string;
    futureDate: string;
    strPastStartValue: string;
    strPastEndValue: string;
    strFutureStartValue: string;
    strFutureEndValue: string;
    futureStartDate: string;
    futureEndDate: string;
  };
};
