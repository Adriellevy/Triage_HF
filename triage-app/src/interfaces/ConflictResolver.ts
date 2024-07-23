
export interface ConflictData {
    currentData: Record<string, [string]>;
    newData: Record<string, [string]>;
  }
  
  export interface ConflictResolverProps {
    conflictData: ConflictData;
    onResolve: (mergedData: Record<string, string>) => void;
    onAcceptCurrent: () => void;
    onCancel: () => void;
  }