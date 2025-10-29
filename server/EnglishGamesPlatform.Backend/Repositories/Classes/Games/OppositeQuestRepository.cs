using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.GameInitialDatas;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnglishGamesPlatform.Backend.Repositories.Classes.Games
{
    public class OppositeQuestRepository : IGeneralGameRepository
    {
        private readonly IOppositeWordRepository _oppositeWordRepository;
        private readonly IWordRepository _wordRepository;
        public OppositeQuestRepository(IOppositeWordRepository oppositeWordRepository, IWordRepository wordRepository)
        {
            _oppositeWordRepository = oppositeWordRepository;
            _wordRepository = wordRepository;
        }
        public string GameName => "Opposite Quest";

        public async Task<GameInitialData> GetData()
        {
            var pairs =await _oppositeWordRepository.GetRandomPairsOppositeWordsAsync();
            var data = new OppositeQuestData();

            foreach (var pair in pairs)
            {
                var wrongOptions = _wordRepository
                    .GetWordsAsync(pair.FirstWordId, pair.SecondWordId)
                    .Result
                    .Select(w => w.WordText)
                    .ToList();

                var options = wrongOptions.Append(pair.SecondWord.WordText).ToList();
                var shuffled = options.OrderBy(x => Guid.NewGuid()).ToList();
                int correctIndex = shuffled.IndexOf(pair.SecondWord.WordText);

                data.AddItem(new OppositeQuestItem
                {
                    Id = pair.OppositeWordId,
                    Word = pair.FirstWord.WordText,
                    Options = shuffled.ToArray(),
                    CorrectIndex = correctIndex
                });
            }

            return data;
        }
    }
}
