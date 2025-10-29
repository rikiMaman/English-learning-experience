using EnglishGamesPlatform.Backend.Data;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EnglishGamesPlatform.Backend.Repositories.Classes
{
    public class CategoryRepository :ICategoryRepository
    {
        private readonly AppDbContext _appDbContext;

        public CategoryRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _appDbContext.Categories.FindAsync(id);
        }

        public async Task<List<Category>> GetRandomCategoriesAsync(int count)
        {
            return await _appDbContext.Categories
                .OrderBy(w => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }

    }
}
