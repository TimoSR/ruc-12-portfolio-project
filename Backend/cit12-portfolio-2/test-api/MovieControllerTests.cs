/*
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
            var movie = Movie.Create(movieId, "tt1234567", "movie", "Test Movie", 
                "Original Test Movie", false, 2023, null, 120, "https://example.com/poster.jpg", "Test plot");
            
            var mockMovieService = new MockMovieService();
            mockMovieService.SetupGetByIdAsync(Result<Movie>.Success(movie));
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
            Assert.Equal("tt1234567", movieDto.LegacyId);
            Assert.Equal("Test Movie", movieDto.PrimaryTitle);
        }

        [Fact]
        public async Task GetById_NonExistentMovie_ShouldReturnNotFound()
        {
            // Arrange
            var movieId = Guid.NewGuid();
            var mockMovieService = new MockMovieService();
            mockMovieService.SetupGetByIdAsync(Result<Movie>.Failure(MovieErrors.NotFound));
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
            var movie = Movie.Create(Guid.NewGuid(), legacyId, "movie", "Test Movie", 
                null, false, 2023, null, 120, null, "Test plot");
            
            var mockMovieService = new MockMovieService();
            mockMovieService.SetupGetByLegacyIdAsync(Result<Movie>.Success(movie));
            var controller = new MovieController(mockMovieService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetByLegacyId(legacyId, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var movieDto = Assert.IsType<MovieDto>(okResult.Value);
            Assert.Equal(legacyId, movieDto.LegacyId);
        }

        [Fact]
        public async Task GetByLegacyId_NonExistentMovie_ShouldReturnNotFound()
        {
            // Arrange
            var legacyId = "tt9999999";
            var mockMovieService = new MockMovieService();
            mockMovieService.SetupGetByLegacyIdAsync(Result<Movie>.Failure(MovieErrors.NotFound));
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
                Movie.Create(Guid.NewGuid(), "tt1234567", "movie", "Test Movie", 
                    null, false, 2023, null, 120, null, "Test plot")
            };

            var mockMovieService = new MockMovieService();
            mockMovieService.SetupSearchMoviesAsync(Result<IEnumerable<Movie>>.Success(movies));
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
            mockMovieService.SetupSearchMoviesAsync(Result<IEnumerable<Movie>>.Success(emptyMovies));
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
        private Result<Movie> _getByIdResult = Result<Movie>.Failure(MovieErrors.NotFound);
        private Result<Movie> _getByLegacyIdResult = Result<Movie>.Failure(MovieErrors.NotFound);
        private Result<IEnumerable<Movie>> _searchResult = Result<IEnumerable<Movie>>.Success(Enumerable.Empty<Movie>());

        public void SetupGetByIdAsync(Result<Movie> result) => _getByIdResult = result;
        public void SetupGetByLegacyIdAsync(Result<Movie> result) => _getByLegacyIdResult = result;
        public void SetupSearchMoviesAsync(Result<IEnumerable<Movie>> result) => _searchResult = result;

        public Task<Result<Movie>> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(_getByIdResult);

        public Task<Result<Movie>> GetMovieByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
            => Task.FromResult(_getByLegacyIdResult);

        public Task<Result<IEnumerable<Movie>>> SearchMoviesAsync(SearchMoviesQuery query, CancellationToken cancellationToken)
            => Task.FromResult(_searchResult);
    }
    */
