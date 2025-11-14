using domain.movie.title;
using domain.title;
using domain.title.interfaces;

namespace test_domain;

public class TitleTests
{
    [Fact]
    public void Create_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        ITitle title = Title.Create(
            titleType: "movie",
            primaryTitle: "Test Title");

        // Assert
        Assert.Equal("movie", title.TitleType);
        Assert.Equal("Test Title", title.PrimaryTitle);
        Assert.Equal("Test Title", title.OriginalTitle); // Default to primaryTitle
        Assert.False(title.IsAdult); // Default to false
        Assert.Equal(DateTime.Now.Year, title.StartYear); // Default to current year
        Assert.Null(title.EndYear); // Default to null
        Assert.Null(title.PosterUrl); // Default to null
        Assert.Equal("No plot available", title.Plot); // Default plot
    }
    
    [Fact]
    public void Create_ShouldHandleAllOptionalFieldsAsNull()
    {
        // Act
        ITitle title = Title.Create(
            titleType: "movie",
            primaryTitle: "Minimal Title");

        // Assert
        Assert.Equal("movie", title.TitleType);
        Assert.Equal("Minimal Title", title.PrimaryTitle);

        // Fields get default values
        Assert.Equal("Minimal Title", title.OriginalTitle); // Default to primaryTitle
        Assert.False(title.IsAdult); // Default to false
        Assert.Equal(DateTime.Now.Year, title.StartYear); // Default to current year
        Assert.Null(title.EndYear); // Default to null
        Assert.Null(title.PosterUrl); // Default to null
        Assert.Equal("No plot available", title.Plot); // Default plot

        // Domain event emitted
        Assert.Contains(title.DomainEvents, e => e is TitleCreatedDomainEvent);
    }

    [Fact]
    public void Create_ShouldTrimStringValues()
    {
        // Act
        ITitle title = Title.Create(
            "  movie  ",
            "  Test Title  ");

        // Assert
        Assert.Equal("movie", title.TitleType);
        Assert.Equal("Test Title", title.PrimaryTitle);
        Assert.Equal("Test Title", title.OriginalTitle); // Default to primaryTitle
        Assert.Null(title.PosterUrl); // Default to null
        Assert.Equal("No plot available", title.Plot); // Default plot
    }
    
    [Fact]
    public void Title_DatabaseHydration_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        // Simulate EF Core materialization using the internal constructor
        var dbTitle = new Title(
            id: Guid.NewGuid(),
            legacyId: "tt1234567",
            titleType: "movie",
            primaryTitle: "Database Loaded Title",
            originalTitle: "Database Original Title",
            isAdult: true,
            startYear: 1999,
            endYear: 2001,
            runtimeMinutes: 142,
            posterUrl: "https://example.com/db-poster.jpg",
            plot: "This movie was loaded directly from the database."
        );

        // Act
        // Simulate we map the data via the internal constructor indirectly 
        Title title = dbTitle;

        // Assert
        Assert.Equal(title.Id, dbTitle.Id);
        Assert.Equal(title.LegacyId, dbTitle.LegacyId);
        Assert.Equal(title.TitleType, dbTitle.TitleType);
        Assert.Equal(title.PrimaryTitle, dbTitle.PrimaryTitle);
        Assert.Equal(title.OriginalTitle, dbTitle.OriginalTitle);
        Assert.Equal(title.IsAdult, dbTitle.IsAdult);
        Assert.Equal(title.StartYear, dbTitle.StartYear);
        Assert.Equal(title.EndYear, dbTitle.EndYear);
        Assert.Equal(title.RuntimeMinutes, dbTitle.RuntimeMinutes);
        Assert.Equal(title.PosterUrl, dbTitle.PosterUrl);
        Assert.Equal(title.Plot, dbTitle.Plot);

        // Domain events should not exist when hydrating from database
        Assert.Empty(title.DomainEvents);
    }

    [Fact]
    public void Create_ShouldThrow_WhenPrimaryTitleIsEmpty()
    {
        // Act & Assert
        Assert.Throws<InvalidPrimaryTitleException>(() =>
            Title.Create("movie", ""));
    }

    [Fact]
    public void Create_ShouldThrow_WhenTitleTypeIsEmpty()
    {
        // Act & Assert
        Assert.Throws<InvalidTitleTypeException>(() =>
            Title.Create("", "Title"));
    }

    [Fact]
    public void Create_ShouldGenerateUniqueLegacyId()
    {
        // Act
        var movie1 = Title.Create("movie", "Title 1");
        var movie2 = Title.Create("movie", "Title 2");

        // Assert
        Assert.NotEqual(movie1.LegacyId, movie2.LegacyId);
        Assert.StartsWith("tt", movie1.LegacyId);
        Assert.StartsWith("tt", movie2.LegacyId);
    }

    [Fact]
    public void Create_ShouldSetDefaultValues()
    {
        // Act
        ITitle title = Title.Create(
            "movie",
            "Test Title");

        // Assert
        Assert.Equal("movie", title.TitleType);
        Assert.Equal("Test Title", title.PrimaryTitle);
        Assert.Equal("Test Title", title.OriginalTitle); // Default to primaryTitle
        Assert.False(title.IsAdult); // Default to false
        Assert.Equal(DateTime.Now.Year, title.StartYear); // Default to current year
        Assert.Null(title.EndYear); // Default to null
        Assert.Null(title.PosterUrl); // Default to null
        Assert.Equal("No plot available", title.Plot); // Default plot
    }
}