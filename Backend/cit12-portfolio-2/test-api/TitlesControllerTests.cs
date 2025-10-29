using api.controllers;
using application.titleService;
using domain.title;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using service_patterns;

namespace test_api;

public class TitlesControllerTests
{
        [Fact]
        public void TitleController_Constructor_ShouldCreateInstance()
        {
            // Arrange
            var mockTitleService = new MockTitleService();

            // Act
            var controller = new TitlesController(mockTitleService);

            // Assert
            Assert.NotNull(controller);
        }

        [Fact]
        public async Task GetById_ExistingTitle_ShouldReturnOkWithTitleDto()
        {
            // Arrange
            var titleId = Guid.NewGuid();
            var movie = Title.Create("movie", "Test Title");
            
            var mockTitleService = new MockTitleService();
            var expectedTitleDto = new TitleDto(titleId, "movie", "Test Title", "Original Test Title", false, 2023, null, 120, "https://example.com/poster.jpg", "Test plot");
            mockTitleService.SetupGetByIdAsync(Result<TitleDto>.Success(expectedTitleDto));
            var controller = new TitlesController(mockTitleService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetById(titleId, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var titleDto = Assert.IsType<TitleDto>(okResult.Value);
            Assert.Equal(titleId, titleDto.Id);
            Assert.Equal("Test Title", titleDto.PrimaryTitle);
        }

        [Fact]
        public async Task GetById_NonExistentTitle_ShouldReturnNotFound()
        {
            // Arrange
            var titleId = Guid.NewGuid();
            var mockTitleService = new MockTitleService();
            mockTitleService.SetupGetByIdAsync(Result<TitleDto>.Failure(TitleErrors.NotFound));
            var controller = new TitlesController(mockTitleService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetById(titleId, CancellationToken.None);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var problemDetails = Assert.IsType<ProblemDetails>(notFoundResult.Value);
            Assert.Equal(404, problemDetails.Status);
        }

        [Fact]
        public async Task GetByLegacyId_ExistingTitle_ShouldReturnOkWithTitleDto()
        {
            // Arrange
            var legacyId = "tt1234567";
            var movie = Title.Create("movie", "Test Title");
            
            var mockTitleService = new MockTitleService();
            var expectedTitleLegacyDto = new TitleLegacyDto(Guid.NewGuid(), legacyId, "movie", "Test Title", null, false, 2023, null, 120, null, "Test plot");
            mockTitleService.SetupGetByLegacyIdAsync(Result<TitleLegacyDto>.Success(expectedTitleLegacyDto));
            var controller = new TitlesController(mockTitleService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetByLegacyId(legacyId, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var titleLegacyDto = Assert.IsType<TitleLegacyDto>(okResult.Value);
            Assert.Equal(legacyId, titleLegacyDto.LegacyId);
        }

        [Fact]
        public async Task GetByLegacyId_NonExistentTitle_ShouldReturnNotFound()
        {
            // Arrange
            var legacyId = "tt9999999";
            var mockTitleService = new MockTitleService();
            mockTitleService.SetupGetByLegacyIdAsync(Result<TitleLegacyDto>.Failure(TitleErrors.NotFound));
            var controller = new TitlesController(mockTitleService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.GetByLegacyId(legacyId, CancellationToken.None);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var problemDetails = Assert.IsType<ProblemDetails>(notFoundResult.Value);
            Assert.Equal(404, problemDetails.Status);
        }

        [Fact]
        public async Task Search_ValidQuery_ShouldReturnTitles()
        {
            // Arrange
            var query = new SearchTitlesQuery("Test", 1, 10);
            var movies = new List<Title>
            {
                Title.Create("movie", "Test Title")
            };

            var mockTitleService = new MockTitleService();
            var expectedTitleDtos = new List<TitleDto> { new TitleDto(Guid.NewGuid(), "movie", "Test Title", null, false, 2023, null, 120, null, "Test plot") };
            mockTitleService.SetupSearchTitlesAsync(Result<IEnumerable<TitleDto>>.Success(expectedTitleDtos));
            var controller = new TitlesController(mockTitleService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.Search(query.Query, query.Page, query.PageSize, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var titleDtos = Assert.IsAssignableFrom<IEnumerable<TitleDto>>(okResult.Value);
            Assert.Single(titleDtos);
        }

        [Fact]
        public async Task Search_EmptyQuery_ShouldReturnEmptyList()
        {
            // Arrange
            var query = new SearchTitlesQuery("", 1, 10);
            var emptyTitles = Enumerable.Empty<Title>();

            var mockTitleService = new MockTitleService();
            mockTitleService.SetupSearchTitlesAsync(Result<IEnumerable<TitleDto>>.Success(Enumerable.Empty<TitleDto>()));
            var controller = new TitlesController(mockTitleService);
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Act
            var result = await controller.Search(query.Query, query.Page, query.PageSize, CancellationToken.None);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var titleDtos = Assert.IsAssignableFrom<IEnumerable<TitleDto>>(okResult.Value);
            Assert.Empty(titleDtos);
        }
    }

    // Simple mock implementation without external dependencies
    public class MockTitleService : ITitleService
    {
        private Result<TitleDto> _getByIdResult = Result<TitleDto>.Failure(TitleErrors.NotFound);
        private Result<TitleLegacyDto> _getByLegacyIdResult = Result<TitleLegacyDto>.Failure(TitleErrors.NotFound);
        private Result<IEnumerable<TitleDto>> _searchResult = Result<IEnumerable<TitleDto>>.Success(Enumerable.Empty<TitleDto>());

        public void SetupGetByIdAsync(Result<TitleDto> result) => _getByIdResult = result;
        public void SetupGetByLegacyIdAsync(Result<TitleLegacyDto> result) => _getByLegacyIdResult = result;
        public void SetupSearchTitlesAsync(Result<IEnumerable<TitleDto>> result) => _searchResult = result;

        public Task<Result<TitleDto>> GetTitleByIdAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(_getByIdResult);

        public Task<Result<TitleLegacyDto>> GetTitleByLegacyIdAsync(string legacyId, CancellationToken cancellationToken)
            => Task.FromResult(_getByLegacyIdResult);

        public Task<Result<IEnumerable<TitleDto>>> SearchTitlesAsync(SearchTitlesQuery query, CancellationToken cancellationToken)
            => Task.FromResult(_searchResult);

        public Task<Result<TitleDto>> CreateTitleAsync(CreateTitleCommand command, CancellationToken cancellationToken)
            => Task.FromResult(Result<TitleDto>.Failure(TitleErrors.NotFound));

        public Task<Result<TitleDto>> UpdateTitleAsync(Guid id, UpdateTitleCommand command, CancellationToken cancellationToken)
            => Task.FromResult(Result<TitleDto>.Failure(TitleErrors.NotFound));

        public Task<Result> DeleteTitleAsync(Guid id, CancellationToken cancellationToken)
            => Task.FromResult(Result.Failure(TitleErrors.NotFound));
    }
