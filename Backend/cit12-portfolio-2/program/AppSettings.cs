namespace program;

public class AppSettings
{
    public string? Name { get; set; }
    public string? Version { get; set; }
}

public class DatabaseSettings
{
    public string? Host { get; set; }
    public int? Port { get; set; }
    public int? Timeout { get; set; }
    public int? MaxRetries { get; set; }
    public string? ConnectionString { get; set; }
}
