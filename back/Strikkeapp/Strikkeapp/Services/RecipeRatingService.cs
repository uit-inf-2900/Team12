using AutoMapper;
using Strikkeapp.Data.Context;
using Strikkeapp.Data.Entities;
using Strikkeapp.Enums;
using Strikkeapp.Models;


namespace Strikkeapp.Services;

public interface IRecipeRatingService
{
    RecipeRatingModel PostRating(Guid recipeId, Rating rating, Guid userId);
    RecipeRatingModel GetRating(Guid recipeId, Guid userId);
}

public class RecipeRatingService : IRecipeRatingService
{
    private readonly StrikkeappDbContext _context;
    private readonly IMapper _mapper;

    public RecipeRatingService(StrikkeappDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public RecipeRatingModel PostRating(Guid recipeId, Rating rating, Guid userId)
    {
        var existing = _context.RecipeRatings.Where(r => r.RecipeId == recipeId && r.UserId == userId).FirstOrDefault();

        if (existing != null)
        {
            existing.Rating = rating;
            _context.RecipeRatings.Update(existing);
            var res = _context.SaveChanges();

            if (res == 0)
                throw new InvalidOperationException("Could not save rating");

            return _mapper.Map<RecipeRatingModel>(existing);
        }

        var entity = new RecipeRatingEntity
        {
            RecipeId = recipeId,
            Rating = rating,
            UserId = userId
        };

        _context.RecipeRatings.Add(entity);

        var result = _context.SaveChanges();

        if (result == 0)
            throw new InvalidOperationException("Could not save rating");

        return _mapper.Map<RecipeRatingModel>(entity);
    }

    public RecipeRatingModel GetRating(Guid recipeId, Guid userId)
    {
        var entity = _context.RecipeRatings.Where(r => r.RecipeId == recipeId && r.UserId == userId).FirstOrDefault();

        if (entity == null)
            return new RecipeRatingModel { RecipeId = recipeId };

        return _mapper.Map<RecipeRatingModel>(entity);
    }
}