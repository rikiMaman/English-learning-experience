using System.ComponentModel.DataAnnotations;

namespace EnglishGamesPlatform.Backend.Models.Entities
{
    public class Phrase
    
    {
        [Key]
        public int PhraseId { get; set; }

        [Required]
        public string Text { get; set; } = null!;
        public string Meaning { get; set; }
    }
}
