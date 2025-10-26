using domain.movie;
using infrastructure;
using infrastructure.repositories;
using Microsoft.EntityFrameworkCore;

namespace test_infrastructure;

public class MovieRepositoryTests : IDisposable
{
        private readonly MovieDbContext _dbContext;
        private readonly MovieRepository _repository;

        public MovieRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<MovieDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new MovieDbContext(options);
            _repository = new MovieRepository(_dbContext);
            
            SeedTestData();
        }

        private void SeedTestData()
        {
            var movies = new List<Movie>
            {
                Movie.Create("movie", "Test Movie 1"),
                Movie.Create("movie", "Test Movie 2"),
                Movie.Create("tvSeries", "Test Series")
            };

            _dbContext.Movies.AddRange(movies);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GetByIdAsync_ExistingMovie_ShouldReturnMovie()
        {
            // Arrange
            var movie = _dbContext.Movies.First();
            var movieId = movie.Id;

            // Act
            var result = await _repository.GetByIdAsync(movieId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(movieId, result.Id);
            Assert.Equal(movie.LegacyId, result.LegacyId);
            Assert.Equal(movie.PrimaryTitle, result.PrimaryTitle);
        }

        [Fact]
        public async Task GetByIdAsync_NonExistentMovie_ShouldReturnNull()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();

            // Act
            var result = await _repository.GetByIdAsync(nonExistentId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetByLegacyIdAsync_ExistingMovie_ShouldReturnMovie()
        {
            // Arrange
            var movie = _dbContext.Movies.First();
            var legacyId = movie.LegacyId;

            // Act
            var result = await _repository.GetByLegacyIdAsync(legacyId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(legacyId, result.LegacyId);
            Assert.Equal(movie.Id, result.Id);
        }

        [Fact]
        public async Task GetByLegacyIdAsync_NonExistentMovie_ShouldReturnNull()
        {
            // Arrange
            var nonExistentLegacyId = "tt9999999";

            // Act
            var result = await _repository.GetByLegacyIdAsync(nonExistentLegacyId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task SearchAsync_ValidQuery_ShouldReturnMatchingMovies()
        {
            // Arrange
            var query = "Test";

            // Act
            var result = await _repository.SearchAsync(query, 1, 10);

            // Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.All(result, movie => Assert.Contains("Test", movie.PrimaryTitle));
        }

        [Fact]
        public async Task SearchAsync_NoMatches_ShouldReturnEmptyList()
        {
            // Arrange
            var query = "NonExistentMovie";

            // Act
            var result = await _repository.SearchAsync(query, 1, 10);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task SearchAsync_WithPagination_ShouldRespectPageSize()
        {
            // Arrange
            var query = "Test";
            var pageSize = 2;

            // Act
            var result = await _repository.SearchAsync(query, 1, pageSize);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Count() <= pageSize);
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
