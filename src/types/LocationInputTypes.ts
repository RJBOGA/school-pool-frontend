// LocationInputTypes.ts
export interface LocationInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
    name: string;
    register: any;
  }
  