using Strikkeapp.Data.Entities;

namespace Strikkeapp.Models;

public class CounterResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;

    public static CounterResult ForSuccess() => new CounterResult
    {
        Success = true
    };

    public static CounterResult ForFailure(string message) => new CounterResult
    {
        Success = false,
        ErrorMessage = message
    };
}

public class GetCountersResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public List<Counter> UserCounters { get; set; } = new List<Counter>();

    public static GetCountersResult ForSuccess(List<Counter> counters) => new GetCountersResult
    {
        Success = true,
        UserCounters = counters
    };

    public static GetCountersResult ForFailure(string message) => new GetCountersResult
    {
        Success = false,
        ErrorMessage = message
    };
}
    

public class CreateCounterResult
{
    public bool Success { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public Guid CounterId { get; set; }

    public static CreateCounterResult ForSuccess(Guid id) => new CreateCounterResult
    {
        Success = true,
        CounterId = id
    };

    public static CreateCounterResult ForFailure(string message) => new CreateCounterResult
    {
        Success = false,
        ErrorMessage = message
    };

}

public class CreateCounterRequest
{
    public string userToken { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;

    public bool IsOK()
    {
        return !string.IsNullOrWhiteSpace(userToken) && 
            !string.IsNullOrWhiteSpace(name);
    } 
}

public class UpdateCounterRequest
{
    public string userToken { get; set; } = string.Empty;
    public Guid counterId { get; set; }
    public string newName { get; set; } = string.Empty;

    public bool IsOk()
    {
        return !string.IsNullOrWhiteSpace(userToken);
    }
}

public class DeleteCounterRequest
{
    public string userToken { get; set; } = string.Empty;
    public Guid counterId { get; set; }

    public bool IsOk()
    {
        return !string.IsNullOrWhiteSpace(userToken);
    }
}