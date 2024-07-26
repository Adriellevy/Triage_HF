import {  PatientData } from "./Patinet";

interface ConflictData {
  currentData: Record<string, string[] | null>;
  newData: Record<string, string[] | null>;
}
  
  export interface ConflictResolverProps {
    conflictData: ConflictData;
    onResolve: (mergedData: Record<string, string>) => void;
    onAcceptCurrent: () => void;
    onCancel: () => void;
  }
  export interface Field {
    label: string
    key: keyof PatientData
    format: ((value: string) => string | Promise<string | null>) | null
  }