using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.GameInitialDatas;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;

namespace EnglishGamesPlatform.Backend.Repositories.Classes.Games
{
    public class SentenceShuffleRepository : IGeneralGameRepository
    {
        public string GameName => "Sentence Shuffle";
        private readonly ISentenceRepository _sentenceRepository;
        private readonly int count=3;

        public SentenceShuffleRepository(ISentenceRepository sentenceRepository)
        {
            _sentenceRepository = sentenceRepository;
        }

        public async Task<GameInitialData?> GetData()
        {
            var sentences = await _sentenceRepository.GetRandomSentencesAsync(count);
            if (sentences == null || sentences.Count == 0)
                return null;

            var data = new SentenceShuffleData();

            foreach (var sentence in sentences)
            {
                if (string.IsNullOrWhiteSpace(sentence.SentenceText))
                    continue;

                var words = sentence.SentenceText
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .ToList();

                var shuffledWords = words.OrderBy(_ => Guid.NewGuid()).ToList();

                if (string.Join(" ", shuffledWords) == sentence.SentenceText)
                    shuffledWords = words.OrderBy(_ => Guid.NewGuid()).ToList();

                data.Rounds.Add(new SentenceShuffleItem
                {
                    CorrectSentence = sentence.SentenceText,
                    Words = shuffledWords
                });
            }

            return data;
        }
    }
}
