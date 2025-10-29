using EnglishGamesPlatform.Backend.Data;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnglishGamesPlatform.Backend.Repositories.Classes
{
    public class WordRepository : IWordRepository
    {
        private readonly AppDbContext _appDbContext;

        public WordRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<Word?> GetByIdAsync(int id)
        {
            return await _appDbContext.Words.FindAsync(id);
        }

        public async Task<List<Word>> GetRandomWordsAsync(int count)
        {
            return await _appDbContext.Words
                .OrderBy(w => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }

        public async Task<List<Word>> GetRandomWordsAsync(int count, int? minLength = null, int? maxLength = null)
        {
            var query = _appDbContext.Words.AsQueryable();

         
            if (minLength.HasValue)
                query = query.Where(w => w.WordText.Length >= minLength.Value);

           
            if (maxLength.HasValue)
                query = query.Where(w => w.WordText.Length <= maxLength.Value);

         
            return await query
                .OrderBy(w => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }


        public async Task<List<Word>> GetWordsAsync(int firstWordId, int secondWordId)
        {
            return await _appDbContext.Words
                 .OrderBy(w => EF.Functions.Random())
                 .Where(w => w.WordId != firstWordId && w.WordId != secondWordId)
                 .Take(3)
                 .ToListAsync();
        }

        public async Task<List<Word>> GetWordsAsync(int firstWordId, int secondWordId, int categoryId, int count = 3)
        {
            return await _appDbContext.Words
                    .Where(w => w.WordId != firstWordId &&
                                w.WordId != secondWordId &&
                                w.CategoryId != categoryId)
                    .OrderBy(w => Guid.NewGuid())
                    .Take(count)
                    .ToListAsync();
        }
    }
}
