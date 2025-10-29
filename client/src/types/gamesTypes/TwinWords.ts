import { GameResponseBase } from "..";
export interface TwinWordsItem {
  id: any;
  data: {
    items: TwinWordsSingleQuestion[];
  }
};

export interface TwinWordsSingleQuestion { 
  id: number;
  word: string;
  options: string[];
  correctIndex: number;
}
export interface TwinWordsResponse extends GameResponseBase<10, TwinWordsItem> {
  data: any;
}
