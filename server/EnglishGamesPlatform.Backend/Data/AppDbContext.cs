using EnglishGamesPlatform.Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EnglishGamesPlatform.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<GrammarQuestion> GrammarQuestions { get; set; }
        public DbSet<GrammarQuestionFakeSentence> GrammarQuestionFakeSentences { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Word> Words { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<GameResult> GameResults { get; set; }
        public DbSet<Sentence> Sentences { get; set; }
        public DbSet<Progress> Progress { get; set; }
        public DbSet<OppositeWord> OppositeWords { get; set; }

        public DbSet<MissingWordSentence> MissingWords { get; set; }

        public DbSet<TwinWord> TwinWords { get; set; }
        public DbSet<MemoryMatchSynonymsPair> MemoryMatchSynonymsPairs { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<WordQuestionAnswerEntity> WordQuestionAnswers { get; set; }
        public DbSet<GuessMasterSession> GuessMasterSessions { get; set; }

        public DbSet<Phrase> Phrases { get; set; }

        public DbSet<ImageSentence> ImageSentences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Word>()
                .HasOne(w => w.Category)
                .WithMany(c => c.Words)
                .HasForeignKey(w => w.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Image>()
                .HasOne(i => i.Word)
                .WithMany(w => w.Images)
                .HasForeignKey(i => i.WordId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GameResult>()
                .HasOne(gr => gr.Game)
                .WithMany(g => g.GameResults)
                .HasForeignKey(gr => gr.GameId);

            modelBuilder.Entity<GameResult>()
                .HasOne(gr => gr.User)
                .WithMany(u => u.GameResults)
                .HasForeignKey(gr => gr.UserId);

            modelBuilder.Entity<Progress>()
                .HasOne(p => p.Game)
                .WithMany(g => g.Progress)
                .HasForeignKey(p => p.GameId);

            modelBuilder.Entity<Progress>()
                .HasOne(p => p.User)
                .WithMany(u => u.Progress)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<OppositeWord>()
                .HasOne(o => o.FirstWord)
                .WithMany()
                .HasForeignKey(o => o.FirstWordId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OppositeWord>()
                .HasOne(o => o.SecondWord)
                .WithMany()
                .HasForeignKey(o => o.SecondWordId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<MissingWordSentence>()
               .HasOne(mws => mws.Sentence)       
               .WithMany()                        
               .HasForeignKey(mws => mws.SentenceId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MissingWordSentence>()
                .HasOne(mws => mws.CorrectWord)   
                .WithMany()                        
                .HasForeignKey(mws => mws.CorrectWordId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<MemoryMatchSynonymsPair>()
               .HasOne(p => p.Word)
               .WithOne()
               .HasForeignKey<MemoryMatchSynonymsPair>(p => p.WordId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TwinWord>()
               .HasOne(t => t.BaseWord)
               .WithMany()
               .HasForeignKey(t => t.BaseWordId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TwinWord>()
                .HasOne(t => t.SynonymWord)
                .WithMany()
                .HasForeignKey(t => t.SynonymWordId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Question>()
              .Property(q => q.Text)
              .IsRequired()
              .HasMaxLength(200);
            modelBuilder.Entity<WordQuestionAnswerEntity>()
              .HasOne(a => a.Word)
              .WithMany()
              .HasForeignKey(a => a.WordId)
              .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<WordQuestionAnswerEntity>()
             .HasOne(a => a.Question)
             .WithMany()
             .HasForeignKey(a => a.QuestionId)
             .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<GuessMasterSession>()
             .Property(s => s.PlayerName)
             .HasMaxLength(100);


            modelBuilder.Entity<GrammarQuestion>()
               .HasOne(q => q.CorrectSentence)
               .WithMany()
               .HasForeignKey(q => q.CorrectSentenceId)
               .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);

        }
    }
}
