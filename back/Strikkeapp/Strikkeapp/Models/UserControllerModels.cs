namespace Strikkeapp.Models;


public class CreateUserRequest
{
    public string UserEmail { get; set; } = string.Empty;
    public string UserPwd { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;
    public int UserDOB { get; set; }

    // Check that request is valid
    public bool requestOK()
    {
        return (!string.IsNullOrWhiteSpace(UserEmail) &&
        !string.IsNullOrWhiteSpace(UserPwd) &&
        !string.IsNullOrWhiteSpace(UserFullName));
    }

    // Calculate birth day
    public DateTime Dob2Dt()
    {
        int year = UserDOB / 10000;
        int month = (UserDOB / 100) % 100;
        int day = UserDOB % 100;

        DateTime dob = new DateTime(year, month, day);
        return dob;
    }
}

// Login request schema
public class LogInUserRequest
{
    public string UserEmail { get; set; } = string.Empty;
    public string UserPwd { get; set; } = string.Empty;

    public bool requestOk()
    {
        return (!string.IsNullOrWhiteSpace(UserEmail) &&
            !string.IsNullOrWhiteSpace(UserPwd));
    }
}

public class UserResultDto
{
    public string? Token { get; set; }
    public bool IsAdmin { get; set; }
}