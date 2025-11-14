using domain.movie.person.interfaces;
using domain.movie.title.interfaces;
using domain.movie.titleRatings;
using domain.profile.account;
using domain.profile.account.interfaces;
using domain.profile.accountRatings;
using infrastructure;
using infrastructure.repositories;
using infrastructure.repositories.movie;
using infrastructure.repositories.profile;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit.Abstractions;

namespace test_infrastructure;

public sealed class UnitOfWorkPostgresTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _pgContainer;
    private MovieDbContext _dbContext = default!;
    private IUnitOfWork _unitOfWork = default!;
    private readonly ITestOutputHelper _testLog;

    public UnitOfWorkPostgresTests(ITestOutputHelper testLog)
    {
        _testLog = testLog;
        
        _pgContainer = new PostgreSqlBuilder()
            .WithDatabase("testdb")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .WithImage("postgres:16-alpine")
            .Build();
    }

    [Fact]
    public async Task CommitTransaction_ShouldPersistChanges_AndPopulateId()
    {
        // Arrange
        await _unitOfWork.BeginTransactionAsync();

        var account = Account.Create(
            email: "commit@example.com",
            username: "commit_user",
            password: "test"
        );

        await _unitOfWork.AccountRepository.AddAsync(account);

        // Act
        await _unitOfWork.CommitTransactionAsync();

        // Assert
        Assert.NotEqual(Guid.Empty, account.Id); // the database-generated Id should be populated after commit
        _testLog.WriteLine($"Generated DB Account ID: {account.Id}");

        var count = await _dbContext.Accounts.CountAsync();
        Assert.Equal(1, count);

        var persisted = await _dbContext.Accounts.FirstAsync();
        Assert.Equal("commit@example.com", persisted.Email);
        Assert.Equal("commit_user", persisted.Username);
    }
    
    public async Task InitializeAsync()
    {
        await _pgContainer.StartAsync();

        var options = new DbContextOptionsBuilder<MovieDbContext>()
            .UseNpgsql(_pgContainer.GetConnectionString())
            .Options;

        _dbContext = new MovieDbContext(options);
        await _dbContext.Database.EnsureCreatedAsync();

        IAccountRepository repo1 = new AccountRepository(_dbContext);
        IAccountRatingRepository repo2 = new AccountRatingRepository(_dbContext);
        ITitleRepository repo3 = new TitleRepository(_dbContext);
        ITitleRatingRepository repo4 = new TitleRatingRepository(_dbContext);
        IPersonRepository repo5 = new PersonRepository(_dbContext);
        IPersonQueriesRepository repo6 = new PersonQueriesRepository(_dbContext);
        
        _unitOfWork = new UnitOfWork(_dbContext, repo1, repo2, repo3, repo4, repo5, repo6);
    }

    public async Task DisposeAsync()
    {
        await _pgContainer.DisposeAsync();
    }

    [Fact]
    public async Task RollbackTransaction_ShouldRevertChanges()
    {
        // Arrange
        await _unitOfWork.BeginTransactionAsync();

        var account = Account.Create(
            email: "rollback@example.com",
            username: "rollback_user",
            password: "test"
        );

        await _unitOfWork.AccountRepository.AddAsync(account);

        // Act
        await _unitOfWork.RollbackTransactionAsync();

        // Assert
        var count = await _dbContext.Accounts.CountAsync();
        Assert.Equal(0, count);
    }
}