using application.titleService;
using domain.movie.person;
using domain.movie.person.interfaces;
using domain.movie.title;
using domain.movie.title.interfaces;
using domain.movie.titleRatings;
using domain.title;
using domain.title.interfaces;
using domain.profile.account;
using domain.profile.account.interfaces;
using domain.profile.accountRatings;
using infrastructure;
using Microsoft.Extensions.Logging;

namespace test_application;

public class TitleServiceTests
{
        [Fact]
        public void TitleService_Constructor_ShouldCreateInstance()
        {
            // Arrange
            var mockUnitOfWork = new MockUnitOfWork();
            var mockLogger = new MockLogger<TitleService>();

            // Act
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Assert
            Assert.NotNull(titleService);
        }

        [Fact]
        public async Task GetTitleByIdAsync_ExistingTitle_ShouldReturnSuccess()
        {
            // Arrange
            var titleId = Guid.NewGuid();
            var expectedTitle = Title.Create("title", "Test Title");
            
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockTitleRepository.SetupGetByIdAsync(expectedTitle);
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.GetTitleByIdAsync(titleId, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal(expectedTitle.PrimaryTitle, result.Value.PrimaryTitle);
        }

        [Fact]
        public async Task GetTitleByIdAsync_NonExistentTitle_ShouldReturnNotFound()
        {
            // Arrange
            var titleId = Guid.NewGuid();
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockTitleRepository.SetupGetByIdAsync(null);
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.GetTitleByIdAsync(titleId, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(TitleErrors.NotFound.Code, result.Error.Code);
        }

        [Fact]
        public async Task GetTitleByLegacyIdAsync_ExistingTitle_ShouldReturnSuccess()
        {
            // Arrange
            var legacyId = "tt1234567";
            var expectedTitle = Title.Create("title", "Test Title");
            
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockTitleRepository.SetupGetByLegacyIdAsync(expectedTitle);
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.GetTitleByLegacyIdAsync(legacyId, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal(expectedTitle.PrimaryTitle, result.Value.PrimaryTitle);
        }

        [Fact]
        public async Task GetTitleByLegacyIdAsync_NonExistentTitle_ShouldReturnNotFound()
        {
            // Arrange
            var legacyId = "tt9999999";
            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockTitleRepository.SetupGetByLegacyIdAsync(null);
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.GetTitleByLegacyIdAsync(legacyId, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(TitleErrors.NotFound.Code, result.Error.Code);
        }

        [Fact]
        public async Task SearchTitlesAsync_ValidQuery_ShouldReturnTitles()
        {
            // Arrange
            var query = new SearchTitlesQuery("Test", 1, 10);
            var expectedTitles = new List<Title>
            {
                Title.Create("title", "Test Title 1"),
                Title.Create("title", "Test Title 2")
            };

            var mockUnitOfWork = new MockUnitOfWork();
            mockUnitOfWork.MockTitleRepository.SetupSearchAsync(expectedTitles);
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.SearchTitlesAsync(query, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal(expectedTitles.Count(), result.Value.items.Count());
            Assert.Equal(expectedTitles.Count(), result.Value.totalCount);
        }

        [Fact]
        public async Task SearchTitlesAsync_EmptyQuery_ShouldReturnEmptyList()
        {
            // Arrange
            var query = new SearchTitlesQuery("", 1, 10);
            var mockUnitOfWork = new MockUnitOfWork();
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.SearchTitlesAsync(query, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Empty(result.Value.items);
            Assert.Equal(0, result.Value.totalCount);
        }

        [Fact]
        public async Task SearchTitlesAsync_NullQuery_ShouldReturnEmptyList()
        {
            // Arrange
            var query = new SearchTitlesQuery(null, 1, 10);
            var mockUnitOfWork = new MockUnitOfWork();
            var mockLogger = new MockLogger<TitleService>();
            var titleService = new TitleService(mockUnitOfWork, mockLogger);

            // Act
            var result = await titleService.SearchTitlesAsync(query, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Empty(result.Value.items);
            Assert.Equal(0, result.Value.totalCount);
        }
    }

    // Simple mock implementations without external dependencies
    public class MockUnitOfWork : IUnitOfWork
    {
        public MockTitleRepository MockTitleRepository { get; } = new();
        public MockAccountRepository MockAccountRepository { get; } = new();
        public MockAccountRatingRepository MockAccountRatingRepository { get; } = new();
        public MockTitleRatingRepository MockTitleRatingRepository { get; } = new();
        
        
        public IAccountRepository AccountRepository => MockAccountRepository;
        public ITitleRepository TitleRepository => MockTitleRepository;

        public IAccountRatingRepository AccountRatingRepository => MockAccountRatingRepository;
        public ITitleRatingRepository TitleRatingRepository => MockTitleRatingRepository;
        public IPersonQueriesRepository PersonQueriesRepository { get; }
        public IPersonRepository PersonRepository { get; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) => Task.FromResult(0);
        public Task BeginTransactionAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task CommitTransactionAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task RollbackTransactionAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Dispose() { }
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }

    public class MockTitleRepository : ITitleRepository
    {
        private Title? _titleToReturn;
        private IEnumerable<Title> _titlesToReturn = Enumerable.Empty<Title>();

        public void SetupGetByIdAsync(Title? title) => _titleToReturn = title;
        public void SetupGetByLegacyIdAsync(Title? title) => _titleToReturn = title;
        public void SetupSearchAsync(IEnumerable<Title> titles) => _titlesToReturn = titles;

        public Task<Title?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_titleToReturn);

        public Task<Title?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
            => Task.FromResult(_titleToReturn);

        public Task<(IEnumerable<Title> items, int totalCount)> SearchAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default) => Task.FromResult((_titlesToReturn, _titlesToReturn.Count()));

        public Task AddAsync(Title title, CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task UpdateAsync(Title title, CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(true);

        public Task<IEnumerable<SimilarMovieItem>> GetSimilarMoviesAsync(Guid titleId, int limit = 10, CancellationToken cancellationToken = default)
            => Task.FromResult(Enumerable.Empty<SimilarMovieItem>());
    }

    public class MockTitleRatingRepository : ITitleRatingRepository
    {
        public IAsyncEnumerable<TitleRating> GetByAccountIdAsync(Guid accountId)
        {
            throw new NotImplementedException();
        }

        public Task<TitleRating?> GetByAccountIdAndTitleIdAsync(Guid accountId, Guid titleId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<TitleRating?> GetByRatingIdAsync(Guid ratingId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task AddAsync(TitleRating accountRating, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(TitleRating accountRating, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<TitleRating?> GetByAccountAndTitleAsync(Guid accountId, string titleId, CancellationToken token)
        {
            throw new NotImplementedException();
        }
    }

    public class MockAccountRepository : IAccountRepository
    {
        public Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) => Task.FromResult<Account?>(null);
        public Task<Account?> GetByUserNameAsync(string username, CancellationToken cancellationToken = default) => Task.FromResult<Account?>(null);
        public Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Account account, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task<Account?> GetByIdAsync(Guid id, CancellationToken cancellationToken) => Task.FromResult<Account?>(null);
    }

    public class MockAccountRatingRepository : IAccountRatingRepository
    {
        public IAsyncEnumerable<AccountRating> GetByAccountIdAsync(Guid accountId)
        {
            throw new NotImplementedException();
        }

        public Task<AccountRating?> GetByRatingIdAsync(Guid ratingId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task AddAsync(AccountRating accountRating, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(AccountRating accountRating, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Guid accountId, Guid ratingId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<AccountRating?> GetByAccountAndTitleAsync(Guid accountId, string titleId, CancellationToken token)
        {
            throw new NotImplementedException();
        }

        public Task<AccountRating?> GetByAccountAndTitleAsync(Guid accountId, Guid titleId, CancellationToken token)
        {
            throw new NotImplementedException();
        }
    }

    public class MockLogger<T> : ILogger<T>
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => false;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) { }
    }

    public class MockPersonRepository : IPersonRepository
    {
        public Task<bool> ExistsByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
            => Task.FromResult(false);

        public Task<Person?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult<Person?>(null);

        public Task<Person?> GetByLegacyIdAsync(string legacyId, CancellationToken cancellationToken = default)
            => Task.FromResult<Person?>(null);

        public Task AddAsync(Person person, CancellationToken cancellationToken = default)
            => Task.CompletedTask;
    }

    public class MockPersonQueriesRepository : IPersonQueriesRepository
    {
        public Task<(IEnumerable<PersonListItem> items, int totalCount)> SearchByNameAsync(string query, int page, int pageSize, CancellationToken cancellationToken = default)
            => Task.FromResult((Enumerable.Empty<PersonListItem>(), 0));

        public Task<IEnumerable<WordFrequencyItem>> GetPersonWordsAsync(string personName, int limit, CancellationToken cancellationToken = default)
            => Task.FromResult(Enumerable.Empty<WordFrequencyItem>());

        public Task<IEnumerable<CoActorItem>> GetCoActorsAsync(string personName, CancellationToken cancellationToken = default)
            => Task.FromResult(Enumerable.Empty<CoActorItem>());

        public Task<IEnumerable<PopularCoActorItem>> GetPopularCoActorsAsync(string personName, CancellationToken cancellationToken = default)
            => Task.FromResult(Enumerable.Empty<PopularCoActorItem>());

        public Task<IEnumerable<KnownForTitleItem>> GetKnownForTitlesAsync(Guid personId, CancellationToken cancellationToken = default)
            => Task.FromResult(Enumerable.Empty<KnownForTitleItem>());

        public Task<IEnumerable<ProfessionItem>> GetProfessionsAsync(Guid personId, CancellationToken cancellationToken = default)
            => Task.FromResult(Enumerable.Empty<ProfessionItem>());
    }
