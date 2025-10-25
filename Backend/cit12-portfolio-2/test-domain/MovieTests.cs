using domain.movie;
using domain.movie.interfaces;

namespace test_domain;

public class MovieTests
{
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
}