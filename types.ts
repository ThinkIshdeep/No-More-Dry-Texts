export interface SignalResponse {
  observer: string;
  question: string;
  witty: string;
}

export enum RelationshipLevel {
  UNKNOWN = "Random/Unknown (Safety First)",
  SINGLE = "Target is Single (Potential Interest)",
  FRIEND = "Friend (Casual)",
  CLOSE_FRIEND = "Close Friend (Bestie)",
  PARTNER = "Partner (Dating/Married)"
}

export enum ResponseType {
  OBSERVER = 'The Observer',
  QUESTION = 'The Question',
  WITTY = 'The Witty/Fun'
}

export interface HistoryItem extends SignalResponse {
  id: string;
  input: string;
  relationship: string;
  timestamp: number;
}