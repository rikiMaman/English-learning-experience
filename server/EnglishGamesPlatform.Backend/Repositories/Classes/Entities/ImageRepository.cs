using EnglishGamesPlatform.Backend.Data;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnglishGamesPlatform.Backend.Repositories.Classes
{
    public class ImageRepository :IImageRepository
    {
        private readonly AppDbContext _appDbContext;

        public ImageRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<Image?> GetByIdAsync(int id)
        {
            return await _appDbContext.Images.
                Include(i => i.Word)
                .FirstOrDefaultAsync(i => i.ImageId == id);
        }

        public async Task<List<Image>> GetRandomImagesAsync(int count)
        {
            return await _appDbContext.Images
                .Include(i => i.Word)
                .OrderBy(w => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }

        public async Task<int> GetCountImagesAsync()
        {
            return _appDbContext.Images.Count();
        }

        public async Task<Image?> GetRandomImageAsync()
        {
            return await _appDbContext.Images
                .Include(i => i.Word)
                .OrderBy(w => EF.Functions.Random())
                .FirstOrDefaultAsync();
        }

        public async Task<List<Image>> GetAllImagesWithSentenceAsync()
        {
            return await _appDbContext.ImageSentences
                .Include(isn => isn.Image)      
                .Select(isn => isn.Image)        
                .Distinct()                      
                .ToListAsync();
        }
    }
}
