
export interface AppState {
  targetAmount: number;
  unitValue: number;
  salesCount: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  value: number;
}
