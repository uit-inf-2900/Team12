using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Models;

namespace Strikkeapp.Services;

public interface ICounterService 
{
    public CreateCounterResult CreateCounter(string userToken, string name);
    public CounterResult UpdateCounter(string userToken, Guid counterId, string newName);
    public CounterResult DeleteCounter(string userToken, Guid counterId);
    public GetCountersResult GetCounters(string userToken);
    public CounterResult IncrementCounter(string userToken, Guid counterId);
    public CounterResult DecrementCounter(string userToken, Guid counterId);
}

public class CounterService : ICounterService
{
    private readonly StrikkeappDbContext _context;
    private readonly ITokenService _tokenService;

    public CounterService(StrikkeappDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public CreateCounterResult CreateCounter(string userToken, string name)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return CreateCounterResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var newCounter = new Counter
                {
                    RoundNumber = 0,
                    UserId = userId,
                    Name = name
                };

                _context.CounterInventory.Add(newCounter);
                _context.SaveChanges();

                transaction.Commit();
                return CreateCounterResult.ForSuccess(newCounter.CounterId);
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return CreateCounterResult.ForFailure(ex.Message);
            }
        }
    }

    public GetCountersResult GetCounters(string userToken)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return GetCountersResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        var counters = _context.CounterInventory
            .Where(uid => uid.UserId == userId)
            .ToList();

        return GetCountersResult.ForSuccess(counters);
    }

    public CounterResult UpdateCounter(string userToken, Guid counterId, string newName)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return CounterResult.ForFailure("Unauthorized");
        }

        var userId = tokenResult.UserId;

        using (var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                // Get counter
                var getCounter = _context.CounterInventory
                    .Where(uid => uid.UserId == userId)
                    .FirstOrDefault(cid => cid.CounterId == counterId);

                // Check if counter exists
                if (getCounter == null)
                {
                    // Return not found if counter does not exist
                    return CounterResult.ForFailure("Not found");
                }

                // Update counter name
                getCounter.Name = newName;
                _context.SaveChanges();
                
                // Commit transaction and return success
                transaction.Commit();
                return CounterResult.ForSuccess();
            }
            catch (Exception ex)
            {
                // Handle exception and return failure
                transaction.Rollback();
                return CounterResult.ForFailure(ex.Message);
            }
        }
    }

    public CounterResult IncrementCounter(string userToken, Guid counterId)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return CounterResult.ForFailure("Unauthorized");
        }

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var getCounter = _context.CounterInventory
                    .Where(uid => uid.UserId == tokenResult.UserId)
                    .FirstOrDefault(cid => cid.CounterId == counterId);

                if (getCounter == null)
                {
                    return CounterResult.ForFailure("Not found");
                }

                getCounter.RoundNumber++;
                _context.SaveChanges();

                transaction.Commit();
                return CounterResult.ForSuccess();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return CounterResult.ForFailure(ex.Message);
            }
        }
    }

    public CounterResult DecrementCounter(string userToken, Guid counterId)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return CounterResult.ForFailure("Unauthorized");
        }

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var getCounter = _context.CounterInventory
                    .Where(uid => uid.UserId == tokenResult.UserId)
                    .FirstOrDefault(cid => cid.CounterId == counterId);

                if (getCounter == null)
                {
                    return CounterResult.ForFailure("Not found");
                }

                getCounter.RoundNumber--;
                _context.SaveChanges();

                transaction.Commit();
                return CounterResult.ForSuccess();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return CounterResult.ForFailure(ex.Message);
            }
        }
    }

    public CounterResult DeleteCounter(string userToken, Guid counterId)
    {
        var tokenResult = _tokenService.ExtractUserID(userToken);
        if (!tokenResult.Success)
        {
            return CounterResult.ForFailure("Unauthorized");
        }

        using(var transaction = _context.Database.BeginTransaction())
        {
            try
            {
                var getCounter = _context.CounterInventory
                    .Where(uid => uid.UserId == tokenResult.UserId)
                    .FirstOrDefault(cid => cid.CounterId == counterId);

                if (getCounter == null)
                {
                    return CounterResult.ForFailure("Not found");
                }

                _context.CounterInventory.Remove(getCounter);
                _context.SaveChanges();

                transaction.Commit();
                return CounterResult.ForSuccess();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return CounterResult.ForFailure(ex.Message);
            }
        }
    }

        
}
