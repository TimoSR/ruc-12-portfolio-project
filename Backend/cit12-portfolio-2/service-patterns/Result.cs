namespace service_patterns;

public record Error(string Code, string Description)
{
    public static readonly Error None = new(string.Empty, string.Empty);
}

public class Result
{
    public bool IsSuccess { get; }
    public Error Error { get; }

    protected Result(bool isSuccess, Error error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);
}

public class Result<T> : Result
{
    public T? Value { get; }

    protected Result(T? value, bool isSuccess, Error error)
        : base(isSuccess, error)
    {
        Value = value;
    }

    public static Result<T> Success(T value) => new(value, true, Error.None);
    public static new Result<T> Failure(Error error) => new(default, false, error);

    // Implicit conversion from Result<T> → Result

    public static Result ToResult(Result<T> result) => result.IsSuccess ? Success() : Failure(result.Error);
}
