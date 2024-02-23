export interface TriageModels {
  Models: Model[]
}

export interface Model {
  name: string
  levels: Level[]
}

export interface Level {
  _id: number
  name: string
  colorRGB: string
}
