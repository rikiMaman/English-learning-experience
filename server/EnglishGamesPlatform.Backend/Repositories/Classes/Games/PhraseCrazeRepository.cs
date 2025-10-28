using EnglishGamesPlatform.Backend.Data;
using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Models.GameInitialDatas;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace EnglishGamesPlatform.Backend.Repositories.Classes.Games
{
    public class PhraseCrazeRepository : IGeneralGameRepository
    {
        private readonly AppDbContext _appDbContext;
        private readonly IWordRepository _wordRepo;
        private readonly Random _random = new Random();

        public string GameName => "Phrase Craze";

        public PhraseCrazeRepository(AppDbContext appDbContext, IWordRepository wordRepo)
        {
            _appDbContext = appDbContext;
            _wordRepo = wordRepo;
        }
        public async Task<Phrase?> GetByIdAsync(int id)
        {
            return await _appDbContext.Phrases.FindAsync(id);
        }

        public async Task<List<Phrase?>> GetRandomPhrasesAsync(int count)
        {
            return await _appDbContext.Phrases
                .OrderBy(w => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }

    

        public async Task<GameInitialData?> GetData()
        {
            var sentences = await GetRandomPhrasesAsync(10);
            var gameData = new List<PhraseCrazeItem>();

            foreach (var sentence in sentences)
            {
                var wordsInSentence = Regex.Matches(sentence.Text, @"\b\w+\b")
                                           .Select(m => m.Value)
                                           .Where(w => w.Length > 2) 
                                           .ToList();

                if (!wordsInSentence.Any()) continue;

                var missingWord = wordsInSentence[_random.Next(wordsInSentence.Count)];

                var randomWords = await _wordRepo.GetRandomWordsAsync(3);
                while (randomWords.Any(w => w.WordText.Equals(missingWord, StringComparison.OrdinalIgnoreCase)))
                {
                    randomWords = await _wordRepo.GetRandomWordsAsync(3);
                }

                var options = randomWords.Select(w => w.WordText)
                                         .Append(missingWord)
                                         .OrderBy(x => _random.Next())
                                         .Distinct(StringComparer.OrdinalIgnoreCase) // לוודא שאין כפילויות
                                         .ToList();

                var correctIndex = options.IndexOf(missingWord);

                var displayedSentence = Regex.Replace(
                    sentence.Text,
                    $@"\b{Regex.Escape(missingWord)}\b",
                    "___"
                );

                gameData.Add(new PhraseCrazeItem
                {
                    Phrase = displayedSentence,
                    Options = options,
                    CorrectIndex = correctIndex,
                    FullPhrase = sentence.Text,
                    Meaning = sentence.Meaning, 
                });
            }


            return new PhraseCrazeData { Phrases = gameData };

        }
    }
}


