using EnglishGamesPlatform.Backend.Models.Entities;

namespace EnglishGamesPlatform.Backend.Repositories.Interfaces
{
    public interface IFakeSentenceRepository
    {
        Task<List<GrammarQuestionFakeSentence>> GetAllAsync();
        

    }
}
