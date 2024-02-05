using Microsoft.AspNetCore.Identity;
using System.Data.SQLite;

namespace strikkeapp.services;

public interface IUserService
{
    public int CreateUser(string userEmail, string userPwd, string userFullName, int? userDOB, string userGender);
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

    public int CreateUser(string userEmail, string userPwd, string userFullName, int? userDOB, string userGender)
    {
        // Hash password
        var hashedPwd = HashPassword(userPwd);

        // Connection to database
        string connectionString = "Data Source=database/userInfo.db;Version=3;";


        // Try to insert user into database
        try
        {
            int userId = -1; // Default value indicating failure
            using (var connection = new SQLiteConnection(connectionString))
            {
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    using (var command = connection.CreateCommand())
                    {
                        command.Transaction = transaction;
                        command.CommandText = @"
                            INSERT INTO userLogIn (userEmail, userPwd, userStatus) 
                            VALUES (@userEmail, @userPwd, @userStatus);
                            SELECT last_insert_rowid();";
                        command.Parameters.AddWithValue("@userEmail", userEmail);
                        command.Parameters.AddWithValue("@userPwd", hashedPwd);
                        command.Parameters.AddWithValue("@userStatus", "unverified");

                        var q_result = command.ExecuteScalar();
                        if (q_result != null && int.TryParse(q_result.ToString(), out userId))
                        {
                            // Clear previous parameters and add new command
                            command.Parameters.Clear();
                            command.CommandText = @"
                                INSERT INTO userDetails(userID, userFullName, userDateOfBirth, userGender, userType)
                                VALUES(@userID, @userFullName, @userDateOfBirth, @userGender, @userType);";

                            command.Parameters.AddWithValue("@userID", userId);
                            command.Parameters.AddWithValue("@userFullName", userFullName);
                            command.Parameters.AddWithValue("@userDateOfBirth", userDOB);
                            command.Parameters.AddWithValue("@userGender", userGender);
                            command.Parameters.AddWithValue("@userType", "user");

                            command.ExecuteNonQuery();
                            transaction.Commit(); // Commit only if everything is successful
                        }
                        else
                        {
                            transaction.Rollback(); // Rollback if the first insert fails
                            userId = -1; // Ensure userId reflects failure
                        }
                    }
                }
            }
            return userId;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred when creating user: {ex.Message}");
            return -1;
        }

    }
}