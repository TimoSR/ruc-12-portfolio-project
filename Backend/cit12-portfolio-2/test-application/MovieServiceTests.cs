using application.movieService;
using domain.movie;
using domain.movie.interfaces;
using domain.account;
using domain.account.interfaces;
using infrastructure;
using Microsoft.Extensions.Logging;
using service_patterns;

namespace test_application;

public class MovieServiceTests
{
        [Fact]
        public void MovieService_Constructor_ShouldCreateInstance()
        {
            // Arrange
            var mockUnitOfWork = new MockUnitOfWork();
            var mockLogger = new MockLogger<MovieService>();

            // Act
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Assert
            Assert.NotNull(movieService);
        }

        [Fact]
        public async Task GetMovieByIdAsync_ExistingMovie_ShouldReturnSuccess()
        {
            // Arrange
            var movieId = Guid.NewGuid();
            var expectedMovie = new Movie(movieId, "tt1234567", "movie", "Test Movie", 
                null, false, 2023, null, 120, null, "Test plot");
            
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockMovieRepository.SetupGetByIdAsync(expectedMovie);
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.GetMovieByIdAsync(movieId, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(expectedMovie, result.Value);
        }

        [Fact]
        public async Task GetMovieByIdAsync_NonExistentMovie_ShouldReturnNotFound()
        {
            // Arrange
            var movieId = Guid.NewGuid();
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockMovieRepository.SetupGetByIdAsync(null);
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.GetMovieByIdAsync(movieId, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(MovieErrors.NotFound.Code, result.Error.Code);
        }

        [Fact]
        public async Task GetMovieByLegacyIdAsync_ExistingMovie_ShouldReturnSuccess()
        {
            // Arrange
            var legacyId = "tt1234567";
            var expectedMovie = new Movie(Guid.NewGuid(), legacyId, "movie", "Test Movie", 
                null, false, 2023, null, 120, null, "Test plot");
            
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockMovieRepository.SetupGetByLegacyIdAsync(expectedMovie);
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.GetMovieByLegacyIdAsync(legacyId, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(expectedMovie, result.Value);
        }

        [Fact]
        public async Task GetMovieByLegacyIdAsync_NonExistentMovie_ShouldReturnNotFound()
        {
            // Arrange
            var legacyId = "tt9999999";
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockMovieRepository.SetupGetByLegacyIdAsync(null);
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.GetMovieByLegacyIdAsync(legacyId, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(MovieErrors.NotFound.Code, result.Error.Code);
        }

        [Fact]
        public async Task SearchMoviesAsync_ValidQuery_ShouldReturnMovies()
        {
            // Arrange
            var query = new SearchMoviesQuery("Test", 1, 10);
            var expectedMovies = new List<Movie>
            {
                new Movie(Guid.NewGuid(), "tt1234567", "movie", "Test Movie 1", 
                    null, false, 2023, null, 120, null, "Test plot 1"),
                new Movie(Guid.NewGuid(), "tt1234568", "movie", "Test Movie 2", 
                    null, false, 2023, null, 120, null, "Test plot 2")
            };

            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockMovieRepository.SetupSearchAsync(expectedMovies);
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.SearchMoviesAsync(query, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(expectedMovies, result.Value);
        }

        [Fact]
        public async Task SearchMoviesAsync_EmptyQuery_ShouldReturnEmptyList()
        {
            // Arrange
            var query = new SearchMoviesQuery("", 1, 10);
            var mockUnitOfWork = new MockUnitOfWork();
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.SearchMoviesAsync(query, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Empty(result.Value);
        }

        [Fact]
        public async Task SearchMoviesAsync_NullQuery_ShouldReturnEmptyList()
        {
            // Arrange
            var query = new SearchMoviesQuery(null, 1, 10);
            var mockUnitOfWork = new MockUnitOfWork();
            var mockLogger = new MockLogger<MovieService>();
            var movieService = new MovieService(mockUnitOfWork, mockLogger);

            // Act
            var result = await movieService.SearchMoviesAsync(query, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Empty(result.Value);
        }
    }

    // Simple mock implementations without external dependencies
    public class MockUnitOfWork : IUnitOfWork
    {
        public MockMovieRepository MockMovieRepository { get; } = new();
        public MockAccountRepository MockAccountRepository { get; } = new();
        public IAccountRepository AccountRepository => MockAccountRepository;
        public IMovieRepository MovieRepository => MockMovieRepository;

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) => Task.FromResult(0);
        public Task BeginTransactionAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task CommitTransactionAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task RollbackTransactionAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Dispose() { }
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }

    public class MockMovieRepository : IMovieRepository
    {
        private Movie? _movieToReturn;
        private IEnumerable<Movie> _moviesToReturn = Enumerable.Empty<Movie>();

        public void SetupGetByIdAsync(Movie? movie) => _movieToReturn = movie;
        public void SetupGetByLegacyIdAsync(Movie? movie) => _movieToReturn = movie;
        public void SetupSearchAsync(IEnumerable<Movie> movies) => _moviesToReturn = movies;

        public Task<Movie?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_movieToReturn);

        public Task<Movie?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
            => Task.FromResult(_movieToReturn);

        public Task<IEnumerable<Movie>> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
            => Task.FromResult(_moviesToReturn);
    }

    public class MockAccountRepository : IAccountRepository
    {
        public Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) => Task.FromResult<Account?>(null);
        public Task<Account?> GetByUserNameAsync(string username, CancellationToken cancellationToken = default) => Task.FromResult<Account?>(null);
        public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Account account, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken) => Task.FromResult<Account?>(null);
    }

    public class MockLogger<T> : ILogger<T>
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => false;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) { }
    }
