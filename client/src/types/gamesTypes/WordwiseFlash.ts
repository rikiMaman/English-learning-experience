//import { GameResponseBase } from "./index";
//import { GameResponseBase } from "../../types/index"; 
import { GameResponseBase } from "..";
export interface WordwiseFlashItem {
  // empty item shape by request
}


export interface WordwiseFlashResponse
  extends GameResponseBase<"wordwiseFlash", WordwiseFlashItem> {}
