using Microsoft.AspNetCore.Identity;
using System.Data.SQLite;

namespace strikkeapp.services;

public interface IUserService
{
    public int CreateUser(string userEmail, string userPwd, string userFullName, int? userDOB);
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

    public int CreateUser(string userEmail, string userPwd, string userFullName, int? userDOB)
    {
        // Hash user password
        var hashedPwd = HashPassword(userPwd);
        
        try
        {
            // Default value indicating failure
            int userId = -1;

            // Connect to and open database
            string connectionString = "Data Source=database/userInfo.db;Version=3;";
            using (var connection = new SQLiteConnection(connectionString))
            {
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    // Insert into userLogIn
                    using (var command = connection.CreateCommand())
                    {
                        command.Transaction = transaction;
                        command.CommandText = @"
                        INSERT INTO userLogIn (userEmail, userPwd, userStatus) 
                        VALUES (@userEmail, @userPwd, 'unverified');
                        SELECT last_insert_rowid();";
                        command.Parameters.AddWithValue("@userEmail", userEmail);
                        command.Parameters.AddWithValue("@userPwd", hashedPwd);

                        // Get userID is successfull
                        var q_result = command.ExecuteScalar();
                        if (q_result != null && int.TryParse(q_result.ToString(), out userId))
                        {
                            // Insert into userDetails
                            command.Parameters.Clear();
                            command.CommandText = @"
                            INSERT INTO userDetails(userID, userFullName, userDateOfBirth, userType)
                            VALUES(@userID, @userFullName, @userDateOfBirth, 'user');";
                            command.Parameters.AddWithValue("@userID", userId);
                            command.Parameters.AddWithValue("@userFullName", userFullName);
                            command.Parameters.AddWithValue("@userDateOfBirth", userDOB);

                            command.ExecuteNonQuery();
                            transaction.Commit();
                        }

                        // Rollback on failure
                        else
                        {
                            transaction.Rollback();
                            userId = -1;
                        }
                    }
                }
            }

            return userId;
        }

        // SQLite errors
        catch (SQLiteException ex)
        {
            if (ex.ErrorCode == (int)SQLiteErrorCode.Constraint)
            {
                // Return -2 if email already exsists
                Console.WriteLine("User email already exists.");
                return -2;
            }
            Console.WriteLine($"An SQLite error occurred: {ex.Message}");
            return -1; // Return -1 for general SQLite errors
        }

        // Catch other errors
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred when creating user: {ex.Message}");
            return -1;
        }
    }


}