using AutoMapper;
using EnglishGamesPlatform.Backend.Models.DTOs;
using EnglishGamesPlatform.Backend.Models.DTOs.Entities_DTOs;
using EnglishGamesPlatform.Backend.Models.Entities;
using EnglishGamesPlatform.Backend.Repositories.Interfaces;
using EnglishGamesPlatform.Backend.Services.Interfaces;
using System.Net;

namespace EnglishGamesPlatform.Backend.Services.Classes
{
    public class GeneralGameService : IGeneralGameService
    {
        private readonly Dictionary<string, IGeneralGameRepository> _repositories;
        private readonly IGameRepository _gameRepository;
        private readonly IGameResultRepository _gameResultRepository;
        private readonly IMapper _mapper;

        public GeneralGameService(
            IEnumerable<IGeneralGameRepository> repositories,
            IGameRepository gameRepository,
            IGameResultRepository gameResultRepository,
            IMapper mapper
        )
        {
            _repositories = repositories.ToDictionary(r => r.GameName);
            _gameRepository = gameRepository;
            _gameResultRepository = gameResultRepository;
            _mapper = mapper;
        }




        public async Task<Response<FinalGameStatus>> GetFinalGameStatusAndAddGameResultAsync(GameResultDTO gameResultDTO)
        {
            if (gameResultDTO == null)
            {
                return new()
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Invalid Game Result Data.",
                };
            }

            GameResult gameResultMapper = _mapper.Map<GameResult>(gameResultDTO);
            GameResult gameResult = await AddGameResultAsync(gameResultMapper);

            int index = await GetRankByUserId(gameResultDTO.GameID, gameResultDTO.UserID, 10);

            if (index == -1)
            {
                return new()
                {
                    IsSuccess = true,
                    StatusCode = HttpStatusCode.OK,
                    Message = "Add Game Result Successfully.",
                    Data = new ()
                    {
                        IsLeadingPlayer = false,
                    }
                };
            }

            return new Response<FinalGameStatus>()
            {
                IsSuccess = true,
                StatusCode = HttpStatusCode.OK,
                Message = "Add Game Result Successfully.",

                Data = new FinalGameStatus()
                {
                    IsLeadingPlayer = true,
                    Rank = index + 1
                }
            };
        }

        public async Task<Response<GameData>> GetGameDataAsync(int gameId)
        {
            try
            {
                string? gameName = await GetGameNameByIdAsync(gameId);


                if (gameName == null)
                {
                    return new()
                    {
                        IsSuccess = false,
                        StatusCode = HttpStatusCode.NotFound,
                        Message = $"Game ID: {gameId} Not Found",
                    };
                }

                if (_repositories.TryGetValue(gameName, out var repository))
                {
                    GameInitialData? gameInitialData = await repository.GetData();

                    return new()
                    {
                        StatusCode = HttpStatusCode.OK,
                        IsSuccess = true,
                        Message = $"Get Initial Data For Game ID: {gameId} Successfully,",
                        Data = new GameData()
                        {
                            GameId = gameId,
                            Data = gameInitialData
                        }
                    };
                }
                else
                {
                    return new()
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        IsSuccess = false,
                        Message = $"Error Dependencies Injection - Repository",
                    };
                }
            } catch (Exception ex)
            {
                return new Response<GameData>()
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = $"Internal Server Error: {ex.Message}"
                };
            }
        }

        public async Task<Response<LeaderboardData>> GetLeaderboardAsync(int gameId)
        {
            var topResults = await _gameResultRepository.GetTop10ByGameAsync(gameId);

            return new()
            {
                StatusCode = HttpStatusCode.OK,
                IsSuccess = true,

                Message = $"Successfully retrieved the list of the 10 top players for game {gameId}.",
                Data = topResults
            };
        }

        #region Private Methods

        private async Task<string?> GetGameNameByIdAsync(int gameId)
        {
            return await _gameRepository.GetGameNameByIdAsync(gameId);
        }

        private async Task<GameResult> AddGameResultAsync(GameResult gameResult)
        {
            return await _gameResultRepository.AddGameResultAsync(gameResult);
        }


        private async Task<IEnumerable<GameResult>> GetTopGameResultsByGameIdAsync(int gameId, int topCount)
        {
            return await _gameResultRepository.GetTopGameResultsByGameIdAsync(gameId, topCount);
        }

        private async Task<int> GetRankByUserId(int gameId, int userId, int topCount)
        {

            List<GameResult> gameResults = (await GetTopGameResultsByGameIdAsync(gameId, topCount)).ToList();

            int index = gameResults.FindIndex(gameResult => gameResult.UserId == userId);

            return index;
        }

        #endregion
    }
}
