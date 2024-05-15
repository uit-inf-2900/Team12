using System;
using AutoMapper;
using Strikkeapp.Models;
using Strikkeapp.Data.Entities;
using Strikkeapp.Recipes.Models;

namespace Strikkeapp.Services;

public class AutoMapperProfile : Profile
{
	public AutoMapperProfile()
	{
		CreateMap<ProjectEntity, ProjectModel>()
			.ForMember(pm => pm.Needles, opt => opt.Ignore())
			.ForMember(pm => pm.Yarns, opt => opt.Ignore())
			.ReverseMap();

		CreateMap<ProjectCreateModel, ProjectEntity>()
			.ForMember(pe => pe.YarnIds, opt => opt.MapFrom(pcm => pcm.YarnIds != null ? pcm.YarnIds.Keys.ToList() : null));

		CreateMap<YarnInventory, YarnInventoryDto>();

		CreateMap<NeedleInventory, NeedleInventoryDto>();

		CreateMap<AddNeedleRequest, NeedleInventory>()
			.ForMember(ni => ni.NumInUse, opt => opt.MapFrom(v => 0))
			.ForMember(ni => ni.NumItem, opt => opt.MapFrom(anr => anr.NumItem != null ? anr.NumItem : 1));

		CreateMap<AddYarnRequest, YarnInventory>()
			.ForMember(yi => yi.InUse, opt => opt.MapFrom(v => 0))
			.ForMember(yi => yi.NumItems, opt => opt.MapFrom(ayr => ayr.NumItem != null ? ayr.NumItem : 1));

		CreateMap<YarnInventoryDto, UpdateYarnRequest>()
			.ForMember(uyr => uyr.NewNum, opt => opt.MapFrom(yid => yid.NumItems))
			.ForMember(uyr => uyr.UserToken, opt => opt.Ignore());

		CreateMap<KnittingRecipes, RecipeInfo>();

	}
}

