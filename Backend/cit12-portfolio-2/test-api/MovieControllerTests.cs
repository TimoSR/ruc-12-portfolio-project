using api.controllers;
using application.movieService;
using domain.movie;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using service_patterns;

namespace test_api;

public class MovieControllerTests
{
        [Fact]
        public void MovieController_Constructor_ShouldCreateInstance()
        {
            // Arrange
            var mockMovieService = new MockMovieService();

            // Act
            var controller = new MovieController(mockMovieService);

            // Assert
            Assert.NotNull(controller);
        }

        [Fact]
        public async Task GetById_ExistingMovie_ShouldReturnOkWithMovieDto()
        {
            // Arrange
            var movieId = Guid.NewGuid();
            var movie = Movie.Create("movie", "Test Movie");
            
            var mockMovieService = new MockMovieService();
            var expectedMovieDto = new MovieDto(movieId, "movie", "Test Movie", "Original Test Movie", false, 2023, null, 120, "https://example.com/poster.jpg", "Test plot");
            mockMovieService.SetupGetByIdAsync(Result<MovieDto>.Success(expectedMovieDto));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetById(movieId, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var movieDto = Assert.IsType<MovieDto>(okResult.Value);
            Assert.Equal(movieId, movieDto.Id);
            Assert.Equal("Test Movie", movieDto.PrimaryTitle);
        }

        [Fact]
        public async Task GetById_NonExistentMovie_ShouldReturnNotFound()
        {
            // Arrange
            var movieId = Guid.NewGuid();
            var mockMovieService = new MockMovieService();
            mockMovieService.SetupGetByIdAsync(Result<MovieDto>.Failure(MovieErrors.NotFound));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetById(movieId, CancellationToken.None);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var problemDetails = Assert.IsType<ProblemDetails>(notFoundResult.Value);
            Assert.Equal(404, problemDetails.Status);
        }

        [Fact]
        public async Task GetByLegacyId_ExistingMovie_ShouldReturnOkWithMovieDto()
        {
            // Arrange
            var legacyId = "tt1234567";
            var movie = Movie.Create("movie", "Test Movie");
            
            var mockMovieService = new MockMovieService();
            var expectedMovieLegacyDto = new MovieLegacyDto(Guid.NewGuid(), legacyId, "movie", "Test Movie", null, false, 2023, null, 120, null, "Test plot");
            mockMovieService.SetupGetByLegacyIdAsync(Result<MovieLegacyDto>.Success(expectedMovieLegacyDto));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetByLegacyId(legacyId, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var movieLegacyDto = Assert.IsType<MovieLegacyDto>(okResult.Value);
            Assert.Equal(legacyId, movieLegacyDto.LegacyId);
        }

        [Fact]
        public async Task GetByLegacyId_NonExistentMovie_ShouldReturnNotFound()
        {
            // Arrange
            var legacyId = "tt9999999";
            var mockMovieService = new MockMovieService();
            mockMovieService.SetupGetByLegacyIdAsync(Result<MovieLegacyDto>.Failure(MovieErrors.NotFound));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetByLegacyId(legacyId, CancellationToken.None);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var problemDetails = Assert.IsType<ProblemDetails>(notFoundResult.Value);
            Assert.Equal(404, problemDetails.Status);
        }

        [Fact]
        public async Task Search_ValidQuery_ShouldReturnMovies()
        {
            // Arrange
            var query = new SearchMoviesQuery("Test", 1, 10);
            var movies = new List<Movie>
            {
                Movie.Create("movie", "Test Movie")
            };

            var mockMovieService = new MockMovieService();
            var expectedMovieDtos = new List<MovieDto> { new MovieDto(Guid.NewGuid(), "movie", "Test Movie", null, false, 2023, null, 120, null, "Test plot") };
            mockMovieService.SetupSearchMoviesAsync(Result<IEnumerable<MovieDto>>.Success(expectedMovieDtos));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.Search(query, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var movieDtos = Assert.IsAssignableFrom<IEnumerable<MovieDto>>(okResult.Value);
            Assert.Single(movieDtos);
        }

        [Fact]
        public async Task Search_EmptyQuery_ShouldReturnEmptyList()
        {
            // Arrange
            var query = new SearchMoviesQuery("", 1, 10);
            var emptyMovies = Enumerable.Empty<Movie>();

            var mockMovieService = new MockMovieService();
            mockMovieService.SetupSearchMoviesAsync(Result<IEnumerable<MovieDto>>.Success(Enumerable.Empty<MovieDto>()));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.Search(query, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var movieDtos = Assert.IsAssignableFrom<IEnumerable<MovieDto>>(okResult.Value);
            Assert.Empty(movieDtos);
        }
    }

    // Simple mock implementation without external dependencies
    public class MockMovieService : IMovieService
    {
        private Result<MovieDto> _getByIdResult = Result<MovieDto>.Failure(MovieErrors.NotFound);
        private Result<MovieLegacyDto> _getByLegacyIdResult = Result<MovieLegacyDto>.Failure(MovieErrors.NotFound);
        private Result<IEnumerable<MovieDto>> _searchResult = Result<IEnumerable<MovieDto>>.Success(Enumerable.Empty<MovieDto>());

        public void SetupGetByIdAsync(Result<MovieDto> result) => _getByIdResult = result;
        public void SetupGetByLegacyIdAsync(Result<MovieLegacyDto> result) => _getByLegacyIdResult = result;
        public void SetupSearchMoviesAsync(Result<IEnumerable<MovieDto>> result) => _searchResult = result;

        public Task<Result<MovieDto>> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(_getByIdResult);

        public Task<Result<MovieLegacyDto>> GetMovieByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
            => Task.FromResult(_getByLegacyIdResult);

        public Task<Result<IEnumerable<MovieDto>>> SearchMoviesAsync(SearchMoviesQuery query, CancellationToken cancellationToken)
            => Task.FromResult(_searchResult);
    }
