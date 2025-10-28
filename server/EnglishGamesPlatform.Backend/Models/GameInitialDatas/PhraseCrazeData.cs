using global::EnglishGamesPlatform.Backend.Models.DTOs;
using System.Collections.Generic;

namespace EnglishGamesPlatform.Backend.Models.GameInitialDatas
{
    public class PhraseCrazeItem
    {
        public string Phrase { get; set; }
        public List<string> Options { get; set; }
        public int CorrectIndex { get; set; }
        public string? FullPhrase { get; set; }
        public string? Meaning { get; set; }
    }

    public class PhraseCrazeData : GameInitialData
    {
        public List<PhraseCrazeItem> Phrases { get; set; } = new List<PhraseCrazeItem>();
    }
}

