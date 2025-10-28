using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.GameInitialDatas;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;

namespace EnglishGamesPlatform.Backend.Repositories.Classes.Games
{
    public class WordSorterRepository : IGeneralGameRepository
    {
        private readonly IWordRepository _wordRepository;
        private readonly ICategoryRepository _categoryRepository;

        public WordSorterRepository(IWordRepository wordRepository, ICategoryRepository categoryRepository)
        {
            _wordRepository = wordRepository;
            _categoryRepository = categoryRepository;
        }

        public string GameName => "Word Sorter";

        public async Task<GameInitialData> GetData()
        {
            var random = new Random();

            var word = (await _wordRepository.GetRandomWordsAsync(1)).First();

            var allCategories = await _categoryRepository.GetRandomCategoriesAsync(14);

            var otherCategories = allCategories
                .Where(c => c != null && c.CategoryId != word.CategoryId)
                .OrderBy(_ => random.Next())
                .Take(3)
                .ToList();

            var mixedCategories = otherCategories
                .Append(word.Category)
                .Where(c => c != null)
                .OrderBy(_ => random.Next())
                .ToList();


            var data = new WordSorterData
            {
                WordText = word.WordText,
                Categories = mixedCategories.Select(c => c.CategoryName).ToList(),
                CorrectIndex = mixedCategories.FindIndex(c => c.CategoryId == word.CategoryId)
            };

            return data;
        }

    }
}
