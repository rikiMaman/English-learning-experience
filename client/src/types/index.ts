
import { SentenceShuffleResponse } from "./gamesTypes/SentenceShuffle";
import { PicPickResponse } from "./gamesTypes/PicPick";
import { GrammarGuruResponse } from "./gamesTypes/GrammarGuru";
import { OppositeQuestResponse } from "./gamesTypes/OppositeQuest";
import { TwinWordsResponse } from "./gamesTypes/TwinWords";
import { MiniWordleResponse } from "./gamesTypes/MiniWordle";
import { MemorySynonymsResponse } from "./gamesTypes/MemorySynonyms";
import { MemoryAntonymsResponse } from "./gamesTypes/MemoryAntonyms";
import { RhymeTimeResponse } from "./gamesTypes/RhymeTime";
import { WordwiseFlashResponse } from "./gamesTypes/WordwiseFlash";
import { WordSorterResponse } from "./gamesTypes/WordSorter";
import { LetterChaosResponse } from "./gamesTypes/LetterChaos";
import { GuessMasterResponse } from "./gamesTypes/GuessMaster";
import { DoubleVisionResponse } from "./gamesTypes/DoubleVision";
import { ContextCluesResponse } from "./gamesTypes/ContextClues";
import { PhraseCrazeResponse } from "./gamesTypes/PhraseCraze";
import { PictureHangmanResponse } from "./gamesTypes/PictureHangman";

export interface GameResponseMap {
  4: SentenceShuffleResponse;
  17 : PicPickResponse;
  9: GrammarGuruResponse;
  1: OppositeQuestResponse;
  10: TwinWordsResponse;
  6 : MiniWordleResponse;
  8: MemorySynonymsResponse;
  11: MemoryAntonymsResponse;
  18: RhymeTimeResponse;
  wordwiseFlash: WordwiseFlashResponse;
  2: PictureHangmanResponse;
  7: WordSorterResponse;
  3: LetterChaosResponse;
  14: GuessMasterResponse;
  12 : DoubleVisionResponse;
  15: ContextCluesResponse;
  16: PhraseCrazeResponse;
}


export type GameId = keyof GameResponseMap;
export type GameDataResponse = GameResponseMap[GameId];
export type GameResponseFor<T extends GameId> = GameResponseMap[T];
export interface GameResponseBase<T extends GameId, D> {
  gameId: T;
  data: D;
}

export type { LeaderboardResponse } from "./Leaderboard";
export type { Game } from "./Game";
export type { SubmitProgressPayload, SubmitProgressResponse } from "./SubmitProgress";
