namespace service_patterns;

public record Error(string Code, string Description)
{
    public static readonly Error None = new(string.Empty, string.Empty);
}

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }

    protected Result(bool isSuccess, Error error)
    {
        if (isSuccess && error != Error.None)
            throw new InvalidOperationException("Success result cannot have an error.");
        if (!isSuccess && error == Error.None)
            throw new InvalidOperationException("Failure result must have an error.");

        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);
}

public class Result<T> : Result
{
    public T Value { get; }

    protected Result(T value, bool isSuccess, Error error)
        : base(isSuccess, error)
    {
        if (isSuccess && value is null)
            throw new ArgumentNullException(nameof(value), "Success result must have a value.");
        if (!isSuccess && value is not null)
            throw new InvalidOperationException("Failure result cannot have a value.");

        Value = value!;
    }

    public static Result<T> Success(T value) => new(value, true, Error.None);
    public static new Result<T> Failure(Error error) => new(default!, false, error);

    // Safe conversion to untyped Result
    public static Result ToResult(Result<T> result) =>
        result.IsSuccess ? Success() : Failure(result.Error);
}

