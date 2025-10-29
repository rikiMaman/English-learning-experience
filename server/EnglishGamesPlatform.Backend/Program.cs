using EnglishGamesPlatform.Backend.Data;

using EnglishGamesPlatform.Backend.Extensions;
using EnglishGamesPlatform.Backend.Mapping;
using EnglishGamesPlatform.Backend.Models.DTOs.Entities_DTOs;
using EnglishGamesPlatform.Backend.Repositories.Classes;
using EnglishGamesPlatform.Backend.Repositories.Classes.Entities;
using EnglishGamesPlatform.Backend.Repositories.Classes.Games;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using EnglishGamesPlatform.Backend.Services.Classes;
using EnglishGamesPlatform.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

const string ClientCors = "ClientCors";

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

# region Connect to MySQL DB

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

#endregion


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#region AutoMapper

builder.Services.AddAutoMapper(typeof(MappingProfile));

#endregion

#region Dependency Injection

#region Game

builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<IGameService, GameService>();


#endregion

#region GameResult

builder.Services.AddScoped<IGameResultRepository, GameResultRepository>();

#endregion

#region General Game
builder.Services.AddScoped<IGeneralGameService, GeneralGameService>();
builder.Services.AddScoped<IGeneralGameRepository, PictureHangmanRepository>();
builder.Services.AddScoped<IGeneralGameRepository, OppositeQuestRepository>();
builder.Services.AddScoped<IGeneralGameRepository, MiniWordleRepository>();
builder.Services.AddScoped<IGeneralGameRepository, LetterChaosRepository>();
builder.Services.AddScoped<IGeneralGameRepository, TwinWordsGameRepository>();
builder.Services.AddScoped<IGeneralGameRepository, SentenceShuffleRepository>();
#endregion

builder.Services.AddScoped<IGeneralGameRepository, DoubleVisionRepository>();
builder.Services.AddScoped<IGeneralGameRepository, MemoryMatchSynonymsRepository>();
builder.Services.AddScoped<IGeneralGameRepository, PicPickRepository>();
builder.Services.AddScoped<IGeneralGameRepository,PhraseCrazeRepository>();

builder.Services.AddScoped<IGeneralGameRepository, MemoryMatchAntonymsRepository>();
builder.Services.AddScoped<IGeneralGameRepository, GrammarGuruRepository>();


#endregion 
builder.Services.AddScoped<IGeneralGameRepository,ContextCluesRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IImageRepository, ImageRepository>();

builder.Services.AddScoped<ISentenceRepository, SentenceRepository>();
builder.Services.AddScoped<IWordRepository, WordRepository>();
builder.Services.AddScoped<IOppositeWordRepository, OppositeWordRepository>();
builder.Services.AddScoped<ITwinWordRepository, TwinWordRepository>();

builder.Services.AddScoped<IFakeSentenceRepository, FakeSentenceRepository>();
builder.Services.AddScoped<IGeneralGameRepository, RhymeTimeRepository>();
builder.Services.AddScoped<IGrammarQuestionRepository, GrammarQuestionRepository>();
builder.Services.AddScoped<IGeneralGameRepository, GuessMaster20Repository>();
builder.Services.AddScoped<IGeneralGameRepository, WordSorterRepository>();





builder.Services.AddCustomServices();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    options.CallbackPath = "/signin-google";
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCustomExceptionHandler();

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

app.Run();
