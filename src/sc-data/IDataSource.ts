export interface IDataSource {
    id: string;
    action?: string;
    category?: string;
    activationMode?: string;
    description?: string;
    localizedDescription?: string;
    keybind?:
      | string
      | {
          activationMode?: string;
          input?: string;
          inputdata?: { input: string }[];
        };
  }
