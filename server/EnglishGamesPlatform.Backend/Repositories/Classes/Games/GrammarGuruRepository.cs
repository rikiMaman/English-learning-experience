using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.GameInitialDatas;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using System;

namespace EnglishGamesPlatform.Backend.Repositories.Classes.Games
{
    public class GrammarGuruRepository : IGeneralGameRepository
    {
        private static readonly Random _random = new();
        private readonly IGrammarQuestionRepository _grammarQuestionRepository;
        private readonly ISentenceRepository _sentenceRepository;
        private readonly IFakeSentenceRepository _fakeSentenceRepository;

        public GrammarGuruRepository(
            IGrammarQuestionRepository grammarQuestionRepository,
            ISentenceRepository sentenceRepository,
            IFakeSentenceRepository fakeSentenceRepository)
        {
            _grammarQuestionRepository = grammarQuestionRepository;
            _sentenceRepository = sentenceRepository;
            _fakeSentenceRepository = fakeSentenceRepository;
        }

        public string GameName => "Grammar Guru";

        public async Task<GameInitialData> GetData()
        {
            var questions = await _grammarQuestionRepository.GetAllAsync();
            if (questions is null || questions.Count == 0)
                return new GrammarGuruDataList { Data = [] };

            var sentences = await _sentenceRepository.GetAllAsync();
            var fakeSentences = await _fakeSentenceRepository.GetAllAsync();

            var sentenceById = sentences.ToDictionary(s => s.SentenceId, s => s.SentenceText);
            var fakeByQuestion = fakeSentences
                .GroupBy(f => f.GrammarQuestionId)
                .ToDictionary(g => g.Key, g => g.Select(f => f.Sentence).ToList());

            var shuffledQuestions = questions.OrderBy(_ => Random.Shared.Next()).ToList();
            var dataList = new List<GrammarGuruData>(shuffledQuestions.Count);

            foreach (var q in shuffledQuestions)
            {
                if (!sentenceById.TryGetValue(q.CorrectSentenceId, out var correctSentence))
                    continue;

                if (!fakeByQuestion.TryGetValue(q.Id, out var fakeList))
                    fakeList = new List<string>();

                var allSentences = new List<string> { correctSentence };
                allSentences.AddRange(fakeList);

                var shuffled = allSentences.OrderBy(_ => Random.Shared.Next()).ToArray();
                var correctIndex = Array.IndexOf(shuffled, correctSentence);

                dataList.Add(new GrammarGuruData
                {
                    Sentences = shuffled,
                    CorrectIndex = correctIndex
                });
            }

            return new GrammarGuruDataList { Data = dataList };
        }

    }
}
