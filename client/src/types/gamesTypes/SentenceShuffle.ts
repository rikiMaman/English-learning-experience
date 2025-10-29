import { GameResponseBase } from "..";

export interface SentenceShuffleItem {
  words: string[];
  correctSentence: string;
}

export interface SentenceShuffleData {
  rounds: SentenceShuffleItem[];
}
export interface SentenceShuffleResponse
  extends GameResponseBase<4, SentenceShuffleData> {}
