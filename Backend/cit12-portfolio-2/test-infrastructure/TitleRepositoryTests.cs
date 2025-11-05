using domain.title;
using infrastructure;
using infrastructure.repositories;
using infrastructure.repositories.movie;
using Microsoft.EntityFrameworkCore;

namespace test_infrastructure;

public class TitleRepositoryTests : IDisposable
{
        private readonly MovieDbContext _dbContext;
        private readonly TitleRepository _repository;

        public TitleRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<MovieDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new MovieDbContext(options);
            _repository = new TitleRepository(_dbContext);
            
            SeedTestData();
        }

        private void SeedTestData()
        {
            var titles = new List<Title>
            {
                Title.Create("movie", "Test Movie 1"),
                Title.Create("movie", "Test Movie 2"),
                Title.Create("tvSeries", "Test Series")
            };

            _dbContext.Titles.AddRange(titles);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GetByIdAsync_ExistingMovie_ShouldReturnMovie()
        {
            // Arrange
            var title = _dbContext.Titles.First();
            var titleId = title.Id;

            // Act
            var result = await _repository.GetByIdAsync(titleId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(titleId, result.Id);
            Assert.Equal(title.LegacyId, result.LegacyId);
            Assert.Equal(title.PrimaryTitle, result.PrimaryTitle);
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
            var title = _dbContext.Titles.First();
            var legacyId = title.LegacyId;

            // Act
            var result = await _repository.GetByLegacyIdAsync(legacyId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(legacyId, result.LegacyId);
            Assert.Equal(title.Id, result.Id);
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

        /*[Fact]
        public async Task SearchAsync_ValidQuery_ShouldReturnMatchingMovies()
        {
            // Arrange
            var query = "Test";

            // Act
            var result = await _repository.SearchAsync(query, 1, 10);

            // Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result.items);
            Assert.All(result.items, title => Assert.Contains("Test", title.PrimaryTitle));
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
            Assert.Empty(result.items);
            Assert.Equal(0, result.totalCount);
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
            Assert.True(result.items.Count() <= pageSize);
        }*/

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
