namespace strikkeapp.services;

public interface IUserService
{
	bool Test();
}

public class UserService : IUserService
{
	public UserService() 
	{
	}

	public bool Test()
	{
		return true;
	}
}