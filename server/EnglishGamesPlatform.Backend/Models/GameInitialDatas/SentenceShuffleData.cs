using EnglishGamesPlatform.Backend.Models.DTOs;

namespace EnglishGamesPlatform.Backend.Models.GameInitialDatas
{
    public class SentenceShuffleData : GameInitialData
    {
        public List<SentenceShuffleItem> Rounds { get; set; } = new();

    }
    public class SentenceShuffleItem
    {
        public string CorrectSentence { get; set; } = string.Empty;
        public List<string> Words { get; set; } = new();
    }
}
