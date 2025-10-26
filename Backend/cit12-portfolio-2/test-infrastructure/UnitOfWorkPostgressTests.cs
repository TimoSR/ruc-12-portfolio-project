using domain.account;
using FluentAssertions;
using infrastructure;
using infrastructure.repositories;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit.Abstractions;

namespace test_infrastructure;

public sealed class UnitOfWorkPostgresTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _pgContainer;
    private MovieDbContext _dbContext = default!;
    private UnitOfWork _unitOfWork = default!;
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

    public async Task InitializeAsync()
    {
        await _pgContainer.StartAsync();

        var options = new DbContextOptionsBuilder<MovieDbContext>()
            .UseNpgsql(_pgContainer.GetConnectionString())
            .Options;

        _dbContext = new MovieDbContext(options);
        await _dbContext.Database.EnsureCreatedAsync();

        var repo = new AccountRepository(_dbContext);
        _unitOfWork = new UnitOfWork(_dbContext, repo);
    }

    public async Task DisposeAsync()
    {
        await _pgContainer.DisposeAsync();
    }

    [Fact]
    public async Task CommitTransaction_ShouldPersistChanges()
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
        var count = await _dbContext.Accounts.CountAsync();
        count.Should().Be(1);

        var persisted = await _dbContext.Accounts.FirstAsync();
        persisted.Email.Should().Be("commit@example.com");
        persisted.Username.Should().Be("commit_user");
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
        count.Should().Be(0);
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
        account.Id.Should().NotBe(Guid.Empty, "the database-generated Id should be populated after commit");
        _testLog.WriteLine($"[CommitTransaction_ShouldPersistChanges] Generated DB Account ID: {account.Id}");

        var count = await _dbContext.Accounts.CountAsync();
        count.Should().Be(1);

        var persisted = await _dbContext.Accounts.FirstAsync();
        persisted.Email.Should().Be("commit@example.com");
        persisted.Username.Should().Be("commit_user");
    }
}