using EnglishGamesPlatform.Backend.Data;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnglishGamesPlatform.Backend.Repositories.Classes
{
    public class SentenceRepository : ISentenceRepository
    {
        private readonly AppDbContext _appDbContext;

        public SentenceRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<Sentence?> GetByIdAsync(int id)
        {
            return await _appDbContext.Sentences.FindAsync(id);
        }
        public async Task<List<Sentence>> GetRandomSentencesAsync(int count)
        {
            return await _appDbContext.Sentences

                .OrderBy(w => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }
        public async Task<List<Sentence>> GetAllAsync()
        {
            return await _appDbContext.Sentences.ToListAsync();
        }
        public async Task<List<Sentence>> GetRandomWrongSentencesAsync(int excludeSentenceId, int count)
        {
            return await _appDbContext.Sentences
                .Where(s => s.SentenceId != excludeSentenceId)
                .OrderBy(s => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }
        public async Task<Sentence?> GetCorrectSentenceByImageIdAsync(int imageId)
        {
            var imageSentence = await _appDbContext.ImageSentences
                .Include(isn => isn.CorrectSentence)
                .FirstOrDefaultAsync(isn => isn.ImageId == imageId);

            return imageSentence?.CorrectSentence;
        }
    }
}
