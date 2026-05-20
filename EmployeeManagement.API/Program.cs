using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Services;
using EmployeeManagement.Infrastructure.Data;
using EmployeeManagement.Infrastructure.Repositories;
using EmployeeManagement.Application.Commands;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Database Connection
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                ));

            // Dependency Injection
            builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            builder.Services.AddScoped<IEmployeeService, EmployeeService>();

            // Fixed Backend URL
            builder.WebHost.UseUrls("http://localhost:5037");

            // Register MediatR
            builder.Services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(CreateEmployeeCommand).Assembly));

            // CORS Policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });



            builder.Services.AddAuthentication(
            JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
    {
              options.TokenValidationParameters =
             new TokenValidationParameters
         {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
            builder.Configuration["Jwt:Key"]))
        };
    });


            builder.Services.AddAuthorization();

            // Controllers
            builder.Services.AddControllers();

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Employee API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT Token"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            var app = builder.Build();

            // Swagger Middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // IMPORTANT:
            // Removed HTTPS Redirection because backend runs on HTTP
            // app.UseHttpsRedirection();

            // Enable CORS
            app.UseCors("AllowReact");

            //authentication
            app.UseAuthentication();
            // Authorization
            app.UseAuthorization();

            // Custom Exception Middleware
            app.UseMiddleware<EmployeeManagement.API.Middleware.ExceptionMiddleware>();

            // Map Controllers
            app.MapControllers();

            // Run Application
            app.Run();
        }
    }
}