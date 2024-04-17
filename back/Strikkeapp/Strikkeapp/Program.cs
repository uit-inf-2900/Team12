using Microsoft.EntityFrameworkCore;
using Strikkeapp.Data.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Strikkeapp.Services;
using Microsoft.AspNetCore.Identity;
using MailerSend.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Add database service
builder.Services.AddDbContext<StrikkeappDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// When starting the app creates all this services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IUserInfoService, UserInfoService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IVerificationService, VerificationService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IMailService,  MailService>();

builder.Services.AddSingleton<IPasswordHasher<object>, PasswordHasher<object>>();


var jwtKey = builder.Configuration["Jwt:key"];
if(string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not correctly configured");
}


// Add tokenized log in
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Configure mailersend
builder.Services.Configure<MailerSendOptions>(builder.Configuration.GetSection("MailerSend"));
builder.Services.AddMailerSend();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(opt => opt
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    );

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
