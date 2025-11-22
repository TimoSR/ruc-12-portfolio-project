using api.controllers;
using application.accountService;
using application.titleService;
using application.ratingService;
using application.personService;
using Microsoft.EntityFrameworkCore;
using domain.title.interfaces;
using application.ratingService;
using domain.movie.person.interfaces;
using domain.movie.title.interfaces;
using domain.movie.titleRatings;
using domain.profile.account.interfaces;
using domain.profile.accountRatings;
using infrastructure;
using infrastructure.repositories;
using infrastructure.repositories.movie;
using infrastructure.repositories.profile;
using Microsoft.AspNetCore.Mvc;
using program;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load(".env.local");

builder.Configuration.AddEnvironmentVariables();
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("APP"));
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DATABASE"));

/*// 🔍 Print AppSettings
var appSettings = builder.Configuration.GetSection("APP").Get<AppSettings>();
Console.WriteLine("=== App Settings ===");
Console.WriteLine($"Name: {appSettings?.Name}");
Console.WriteLine($"Version: {appSettings?.Version}");

// 🔍 Print DatabaseSettings
var dbSettings = builder.Configuration.GetSection("DATABASE").Get<DatabaseSettings>();
Console.WriteLine("=== Database Settings ===");
Console.WriteLine($"ConnectionString: {dbSettings?.ConnectionString}");
Console.WriteLine($"Host: {dbSettings?.Host}");*/

// 1. Get the connection string
var connectionString = builder.Configuration["DATABASE_CONNECTION_STRING"];

// 2. Register DbContext
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Register your repositories and Unit of Work as Scoped
// This means you get one instance per HTTP request.
builder.Services.AddScoped<IAccountRatingRepository, AccountRatingRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<ITitleRepository, TitleRepository>();
builder.Services.AddScoped<ITitleRatingRepository, TitleRatingRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IPersonQueriesRepository, PersonQueriesRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// 4. Register you applications services
builder.Services.AddScoped<ITitleService, TitleService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IRatingService, RatingService>();
builder.Services.AddScoped<IPersonService, PersonService>();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

// 5. Register your controllers
builder.Services
    .AddControllers()
    .AddApplicationPart(typeof(AccountsController).Assembly)
    .AddApplicationPart(typeof(TitlesController).Assembly)
    .AddApplicationPart(typeof(RatingsController).Assembly)
    .AddApplicationPart(typeof(PersonsController).Assembly)
    .AddControllersAsServices();

// Application addons
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV"; // Format v1, v2, etc.
    options.SubstituteApiVersionInUrl = true;
});

builder.Services.AddSwaggerGen();

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = false;
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 3. Test database connection at startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MovieDbContext>();

    try
    {
        var canConnect = await dbContext.Database.CanConnectAsync();

        if (!canConnect)
        {
            throw new Exception("Failed to connect to the database. Check your connection string, database availability or VPN!.");
        }

        app.Logger.LogInformation("✅ Successfully connected to the database.");
    }
    catch (Exception ex)
    {
        app.Logger.LogCritical(ex, "❌ Could not connect to the database on startup.");
        throw; // Let the app crash early
    }
}

app.UseCors();
app.UseRouting();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

// Final configuration

app.UseHttpsRedirection();
app.MapControllers();
app.UseSwagger();
app.Run();

