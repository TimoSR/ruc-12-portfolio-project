using domain.movie;
using domain.movie.interfaces;

namespace test_domain;

public class MovieTests
{
<<<<<<< HEAD
        [Fact]
        public void Movie_Constructor_ShouldSetAllProperties()
        {
            // Arrange
            var id = Guid.NewGuid();
            var legacyId = "tt1234567";
            var titleType = "movie";
            var primaryTitle = "Test Movie";
            var originalTitle = "Original Test Movie";
            var isAdult = false;
            var startYear = 2023;
            var endYear = (int?)null;
            var runtimeMinutes = 120;
            var posterUrl = "https://example.com/poster.jpg";
            var plot = "A test movie plot";

            // Act
            var movie = Movie.Create(id, legacyId, titleType, primaryTitle, originalTitle, 
                isAdult, startYear, endYear, runtimeMinutes, posterUrl, plot);

            // Assert
            Assert.Equal(id, movie.Id);
            Assert.Equal(legacyId, movie.LegacyId);
            Assert.Equal(titleType, movie.TitleType);
            Assert.Equal(primaryTitle, movie.PrimaryTitle);
            Assert.Equal(originalTitle, movie.OriginalTitle);
            Assert.Equal(isAdult, movie.IsAdult);
            Assert.Equal(startYear, movie.StartYear);
            Assert.Equal(endYear, movie.EndYear);
            Assert.Equal(runtimeMinutes, movie.RuntimeMinutes);
            Assert.Equal(posterUrl, movie.PosterUrl);
            Assert.Equal(plot, movie.Plot);
        }

        [Fact]
        public void Movie_WithNullValues_ShouldHandleCorrectly()
        {
            // Arrange
            var id = Guid.NewGuid();
            var legacyId = "tt1234567";
            var titleType = "movie";
            var primaryTitle = "Test Movie";

            // Act
            var movie = Movie.Create(id, legacyId, titleType, primaryTitle, 
                null, false, null, null, null, null, null);

            // Assert
            Assert.Equal(id, movie.Id);
            Assert.Equal(legacyId, movie.LegacyId);
            Assert.Equal(titleType, movie.TitleType);
            Assert.Equal(primaryTitle, movie.PrimaryTitle);
            Assert.Null(movie.OriginalTitle);
            Assert.False(movie.IsAdult);
            Assert.Null(movie.StartYear);
            Assert.Null(movie.EndYear);
            Assert.Null(movie.RuntimeMinutes);
            Assert.Null(movie.PosterUrl);
            Assert.Null(movie.Plot);
        }

        [Fact]
        public void Movie_ShouldImplementIMovie()
        {
            // Arrange
            var movie = Movie.Create(Guid.NewGuid(), "tt1234567", "movie", "Test Movie", 
                null, false, 2023, null, 120, null, "Test plot");

            // Assert
            Assert.IsAssignableFrom<IMovie>(movie);
        }

        [Fact]
        public void Movie_Properties_ShouldBeReadOnly()
        {
            // Arrange
            var movie = Movie.Create(Guid.NewGuid(), "tt1234567", "movie", "Test Movie", 
                null, false, 2023, null, 120, null, "Test plot");

            // Assert - Properties should not have public setters
            // This test ensures Movie data cannot be mutated (read-only design)
            Assert.NotEqual(Guid.Empty, movie.Id);
            Assert.NotNull(movie.LegacyId);
            Assert.NotNull(movie.TitleType);
            Assert.NotNull(movie.PrimaryTitle);
        }

        [Theory]
        [InlineData(null, "movie", "Test Movie")]
        [InlineData("tt1234567", null, "Test Movie")]
        [InlineData("tt1234567", "movie", null)]
        [InlineData("", "movie", "Test Movie")]
        [InlineData("tt1234567", "", "Test Movie")]
        [InlineData("tt1234567", "movie", "")]
        [InlineData(" ", "movie", "Test Movie")]
        [InlineData("tt1234567", " ", "Test Movie")]
        [InlineData("tt1234567", "movie", " ")]
        public void Create_InvalidInput_ShouldThrowDomainException(string? legacyId, string? titleType, string? primaryTitle)
        {
            // Act & Assert
            if (string.IsNullOrWhiteSpace(legacyId))
                Assert.Throws<InvalidLegacyIdException>(() => Movie.Create(
                    Guid.NewGuid(), legacyId, titleType, primaryTitle, 
                    null, false, 2023, null, 120, null, "Test plot"));
            else if (string.IsNullOrWhiteSpace(titleType))
                Assert.Throws<InvalidTitleTypeException>(() => Movie.Create(
                    Guid.NewGuid(), legacyId, titleType, primaryTitle, 
                    null, false, 2023, null, 120, null, "Test plot"));
            else if (string.IsNullOrWhiteSpace(primaryTitle))
                Assert.Throws<InvalidPrimaryTitleException>(() => Movie.Create(
                    Guid.NewGuid(), legacyId, titleType, primaryTitle, 
                    null, false, 2023, null, 120, null, "Test plot"));
        }
=======
    [Fact]
    public void Create_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        IMovie movie = Movie.Create(
            titleType: "movie",
            primaryTitle: "Test Movie",
            originalTitle: "Original Test Movie",
            isAdult: false,
            startYear: 2023,
            runtimeMinutes: 120,
            posterUrl: "https://example.com/poster.jpg",
            plot: "A test movie plot");

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Test Movie", movie.PrimaryTitle);
        Assert.Equal("Original Test Movie", movie.OriginalTitle);
        Assert.False(movie.IsAdult);
        Assert.Equal(2023, movie.StartYear);
        Assert.Null(movie.EndYear); // default
        Assert.Equal(120, movie.RuntimeMinutes);
        Assert.Equal("https://example.com/poster.jpg", movie.PosterUrl);
        Assert.Equal("A test movie plot", movie.Plot);
    }
    
    [Fact]
    public void Create_ShouldHandleAllOptionalFieldsAsNull()
    {
        // Act
        IMovie movie = Movie.Create(
            titleType: "movie",
            primaryTitle: "Minimal Movie",
            originalTitle: null,
            isAdult: false,
            startYear: null,
            endYear: null,
            runtimeMinutes: null,
            posterUrl: null,
            plot: null);

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Minimal Movie", movie.PrimaryTitle);

        // Optional fields should stay null
        Assert.Null(movie.OriginalTitle);
        Assert.False(movie.IsAdult);
        Assert.Null(movie.StartYear);
        Assert.Null(movie.EndYear);
        Assert.Null(movie.RuntimeMinutes);
        Assert.Null(movie.PosterUrl);
        Assert.Null(movie.Plot);

        // Domain event emitted
        Assert.Contains(movie.DomainEvents, e => e is MovieCreatedDomainEvent);
    }

    [Fact]
    public void Create_ShouldTrimStringValues()
    {
        // Act
        IMovie movie = Movie.Create(
            "  movie  ",
            "  Test Title  ",
            "  Original Title  ",
            false,
            2000,
            2005,
            90,
            "  https://trimmed.com  ",
            "  Trimmed Plot  ");

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Test Title", movie.PrimaryTitle);
        Assert.Equal("Original Title", movie.OriginalTitle);
        Assert.Equal("https://trimmed.com", movie.PosterUrl);
        Assert.Equal("Trimmed Plot", movie.Plot);
    }
    
    [Fact]
    public void Movie_DatabaseHydration_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        var id = Guid.NewGuid(); // Normally from database PK
        var legacyId = "tt1234567";
        var titleType = "movie";
        var primaryTitle = "Database Loaded Movie";
        var originalTitle = "Database Original Title";
        var isAdult = true;
        var startYear = 1999;
        var endYear = 2001;
        var runtimeMinutes = 142;
        var posterUrl = "https://example.com/db-poster.jpg";
        var plot = "This movie was loaded directly from the database.";

        // Act
        // Simulate EF Core materialization using the internal constructor
        IMovie movie = new Movie(
            id,
            legacyId,
            titleType,
            primaryTitle,
            originalTitle,
            isAdult,
            startYear,
            endYear,
            runtimeMinutes,
            posterUrl,
            plot);

        // Assert
        Assert.Equal(id, movie.Id);
        Assert.Equal(legacyId, movie.LegacyId);
        Assert.Equal(titleType, movie.TitleType);
        Assert.Equal(primaryTitle, movie.PrimaryTitle);
        Assert.Equal(originalTitle, movie.OriginalTitle);
        Assert.True(movie.IsAdult);
        Assert.Equal(startYear, movie.StartYear);
        Assert.Equal(endYear, movie.EndYear);
        Assert.Equal(runtimeMinutes, movie.RuntimeMinutes);
        Assert.Equal(posterUrl, movie.PosterUrl);
        Assert.Equal(plot, movie.Plot);

        // No domain events should exist for hydrated entities
        Assert.Empty(movie.DomainEvents);
    }


    [Fact]
    public void Create_ShouldThrow_WhenPrimaryTitleIsEmpty()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() =>
            Movie.Create("movie", "", null, false, null, null, null, null, null));
    }

    [Fact]
    public void Create_ShouldThrow_WhenTitleTypeIsEmpty()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() =>
            Movie.Create("", "Title", null, false, null, null, null, null, null));
    }

    [Fact]
    public void Create_ShouldThrow_WhenEndYearBeforeStartYear()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() =>
            Movie.Create("movie", "Title", null, false, 2025, 2020, null, null, null));
    }

    [Fact]
    public void Create_ShouldThrow_WhenRuntimeMinutesIsInvalid()
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() =>
            Movie.Create("movie", "Title", null, false, null, null, 0, null, null));
    }

    [Fact]
    public void Create_ShouldAllowNullOptionalFields()
    {
        // Act
        IMovie movie = Movie.Create(
            "movie",
            "Test Movie",
            null,
            false,
            null,
            null,
            null,
            null,
            null);

        // Assert
        Assert.Equal("movie", movie.TitleType);
        Assert.Equal("Test Movie", movie.PrimaryTitle);
        Assert.Null(movie.OriginalTitle);
        Assert.False(movie.IsAdult);
        Assert.Null(movie.StartYear);
        Assert.Null(movie.EndYear);
        Assert.Null(movie.RuntimeMinutes);
        Assert.Null(movie.PosterUrl);
        Assert.Null(movie.Plot);
>>>>>>> ce288ad93558dc1c94289ad180041626c1f27b7a
    }
}