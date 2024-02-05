using Microsoft.AspNetCore.Identity;
using System.Data.SQLite;

namespace strikkeapp.services;

public interface IUserService
{
	bool Test();
	public int CreateUser(string userEmail, string userPwd);
}

public class UserService : IUserService
{
	public UserService() 
	{
	}

    private readonly PasswordHasher<object> _passwordHasher = new PasswordHasher<object>();

    private string HashPassword(string password)
    {
        // Return hased password
        return _passwordHasher.HashPassword(null!, password);
    }

    public bool Test()
	{
		return true;
	}

	public int CreateUser(string userEmail, string userPwd)
	{
		// Hash password
		var hashedPwd = HashPassword(userPwd);

		// Connection to database
        string connectionString = "Data Source=database/userInfo.db;Version=3;";

		// Try to insert user into database
		try
		{
			using (var connection = new SQLiteConnection(connectionString))
			{
				connection.Open();
				var command = connection.CreateCommand();
				// Insert user into database and return the id of the new user
				command.CommandText = @"
					INSERT INTO userLogIn (userEmail, userPwd, userStatus) 
					VALUES (@userEmail, @userPwd, @userStatus);
					SELECT last_insert_rowid();";
				command.Parameters.AddWithValue("@userEmail", userEmail);
				command.Parameters.AddWithValue("@userPwd", hashedPwd);
				command.Parameters.AddWithValue("@userStatus", "unverified");

				// Execute the command, and get userID
				var q_result = command.ExecuteScalar();
				if(q_result != null)
				{
					return Convert.ToInt32(q_result);
				}
				// If the command fails, return -1
				else
				{
					return -1;
				}
			}
		}

		// If an error occurs, return -1
        catch (Exception ex) 
		{
			Console.WriteLine($"An error occured when creating user: {ex.Message}");
			return -1;
		}
	}
}