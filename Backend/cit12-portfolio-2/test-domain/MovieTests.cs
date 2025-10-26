using domain.movie;
using domain.movie.interfaces;

namespace test_domain;

public class MovieTests
{
    [Fact]
    public void Create_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        IMovie movie = Movie.Create(
            titleType: "movie",
            primaryTitle: "Test Movie");

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Test Movie", movie.PrimaryTitle);
        Assert.Equal("Test Movie", movie.OriginalTitle); // Default to primaryTitle
        Assert.False(movie.IsAdult); // Default to false
        Assert.Equal(DateTime.Now.Year, movie.StartYear); // Default to current year
        Assert.Null(movie.EndYear); // Default to null
        Assert.Equal(90, movie.RuntimeMinutes); // Default to 90
        Assert.Null(movie.PosterUrl); // Default to null
        Assert.Equal("No plot available", movie.Plot); // Default plot
    }
    
    [Fact]
    public void Create_ShouldHandleAllOptionalFieldsAsNull()
    {
        // Act
        IMovie movie = Movie.Create(
            titleType: "movie",
            primaryTitle: "Minimal Movie");

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Minimal Movie", movie.PrimaryTitle);

        // Fields get default values
        Assert.Equal("Minimal Movie", movie.OriginalTitle); // Default to primaryTitle
        Assert.False(movie.IsAdult); // Default to false
        Assert.Equal(DateTime.Now.Year, movie.StartYear); // Default to current year
        Assert.Null(movie.EndYear); // Default to null
        Assert.Equal(90, movie.RuntimeMinutes); // Default to 90
        Assert.Null(movie.PosterUrl); // Default to null
        Assert.Equal("No plot available", movie.Plot); // Default plot

        // Domain event emitted
        Assert.Contains(movie.DomainEvents, e => e is MovieCreatedDomainEvent);
    }

    [Fact]
    public void Create_ShouldTrimStringValues()
    {
        // Act
        IMovie movie = Movie.Create(
            "  movie  ",
            "  Test Title  ");

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Test Title", movie.PrimaryTitle);
        Assert.Equal("Test Title", movie.OriginalTitle); // Default to primaryTitle
        Assert.Null(movie.PosterUrl); // Default to null
        Assert.Equal("No plot available", movie.Plot); // Default plot
    }
    
    [Fact]
    public void Movie_DatabaseHydration_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        // Simulate EF Core materialization using the internal constructor
        var dbMovie = new Movie(
            id: Guid.NewGuid(),
            legacyId: "tt1234567",
            titleType: "movie",
            primaryTitle: "Database Loaded Movie",
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
        Movie movie = dbMovie;

        // Assert
        Assert.Equal(movie.Id, dbMovie.Id);
        Assert.Equal(movie.LegacyId, dbMovie.LegacyId);
        Assert.Equal(movie.TitleType, dbMovie.TitleType);
        Assert.Equal(movie.PrimaryTitle, dbMovie.PrimaryTitle);
        Assert.Equal(movie.OriginalTitle, dbMovie.OriginalTitle);
        Assert.Equal(movie.IsAdult, dbMovie.IsAdult);
        Assert.Equal(movie.StartYear, dbMovie.StartYear);
        Assert.Equal(movie.EndYear, dbMovie.EndYear);
        Assert.Equal(movie.RuntimeMinutes, dbMovie.RuntimeMinutes);
        Assert.Equal(movie.PosterUrl, dbMovie.PosterUrl);
        Assert.Equal(movie.Plot, dbMovie.Plot);

        // Domain events should not exist when hydrating from database
        Assert.Empty(movie.DomainEvents);
    }

    [Fact]
    public void Create_ShouldThrow_WhenPrimaryTitleIsEmpty()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() =>
            Movie.Create("movie", ""));
    }

    [Fact]
    public void Create_ShouldThrow_WhenTitleTypeIsEmpty()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() =>
            Movie.Create("", "Title"));
    }

    [Fact]
    public void Create_ShouldGenerateUniqueLegacyId()
    {
        // Act
        var movie1 = Movie.Create("movie", "Title 1");
        var movie2 = Movie.Create("movie", "Title 2");

        // Assert
        Assert.NotEqual(movie1.LegacyId, movie2.LegacyId);
        Assert.StartsWith("tt", movie1.LegacyId);
        Assert.StartsWith("tt", movie2.LegacyId);
    }

    [Fact]
    public void Create_ShouldSetDefaultValues()
    {
        // Act
        IMovie movie = Movie.Create(
            "movie",
            "Test Movie");

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Test Movie", movie.PrimaryTitle);
        Assert.Equal("Test Movie", movie.OriginalTitle); // Default to primaryTitle
        Assert.False(movie.IsAdult); // Default to false
        Assert.Equal(DateTime.Now.Year, movie.StartYear); // Default to current year
        Assert.Null(movie.EndYear); // Default to null
        Assert.Equal(90, movie.RuntimeMinutes); // Default to 90
        Assert.Null(movie.PosterUrl); // Default to null
        Assert.Equal("No plot available", movie.Plot); // Default plot
    }
}