# Backend Configuration - CORS Setup Required

## Your Current Program.cs

```csharp
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Services;
using EmployeeManagement.Infrastructure.Data;
using EmployeeManagement.Infrastructure.Repositories;
using EmployeeManagement.Application.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplicationBuilder.CreateBuilder(args);
            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            builder.Services.AddScoped<IEmployeeService, EmployeeService>();

            // Register MediatR
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateEmployeeCommand).Assembly));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseMiddleware<EmployeeManagement.API.Middleware.ExceptionMiddleware>();
            app.MapControllers();
            app.Run();
        }
    }
}
```

## ? Updated Program.cs with CORS

Replace your Program.cs with this version that includes CORS:

```csharp
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Application.Services;
using EmployeeManagement.Infrastructure.Data;
using EmployeeManagement.Infrastructure.Repositories;
using EmployeeManagement.Application.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace EmployeeManagement.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplicationBuilder.CreateBuilder(args);

            // Add CORS Policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")          // React frontend URL
                          .AllowAnyMethod()                              // Allow GET, POST, PUT, DELETE, etc.
                          .AllowAnyHeader()                              // Allow any headers
                          .AllowCredentials();                           // Allow credentials if needed
                });
            });

            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            builder.Services.AddScoped<IEmployeeService, EmployeeService>();

            // Register MediatR
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateEmployeeCommand).Assembly));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Use CORS Policy (IMPORTANT: Place before UseAuthorization)
            app.UseCors("AllowReactApp");

            app.UseAuthorization();
            app.UseMiddleware<EmployeeManagement.API.Middleware.ExceptionMiddleware>();
            app.MapControllers();
            app.Run();
        }
    }
}
```

## ?? Key Changes Made

### 1. Added CORS Using Statement
```csharp
using Microsoft.AspNetCore.Cors;
```

### 2. Added CORS Policy in Services
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### 3. Applied CORS Middleware
```csharp
app.UseCors("AllowReactApp");
```

### ?? Important: Middleware Order
The `app.UseCors()` must be placed **BEFORE** `app.UseAuthorization()`.

---

## ?? CORS Configuration Explanation

### WithOrigins("http://localhost:3000")
- Allows requests from React frontend running on localhost:3000
- Change if frontend runs on different URL

### AllowAnyMethod()
- Allows: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Required for all CRUD operations

### AllowAnyHeader()
- Allows all HTTP headers
- Needed for Content-Type, Authorization, etc.

### AllowCredentials()
- Allows cookies and authentication headers
- Set to true if using authentication

---

## ?? Advanced CORS Configuration

If you need more control, use this version:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",        // Development
                "http://localhost:3001",        // Alternate port
                "https://yourdomain.com"        // Production
            )
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .WithHeaders("Content-Type", "Authorization")
            .AllowCredentials();
    });
});
```

---

## ?? For Different Environments

### Development (localhost)
```csharp
policy.WithOrigins("http://localhost:3000");
```

### Production (Azure)
```csharp
policy.WithOrigins("https://yourdomain.com");
```

### Multiple Environments
```csharp
if (app.Environment.IsDevelopment())
{
    policy.WithOrigins("http://localhost:3000");
}
else
{
    policy.WithOrigins("https://yourdomain.com");
}
```

---

## ? Verification Steps

After updating Program.cs:

1. **Rebuild Solution**
   ```bash
   dotnet build
   ```

2. **Run Backend**
   ```bash
   dotnet run
   ```
   Backend should start on `https://localhost:7295`

3. **Start React Frontend**
   ```bash
   cd employee-management-frontend
   npm start
   ```
   Frontend starts on `http://localhost:3000`

4. **Test CORS**
   - Open React app
   - Try fetching employees
   - No CORS errors should appear in console

5. **Check Swagger**
   - Visit `https://localhost:7295/swagger/index.html`
   - Test endpoints directly

---

## ?? CORS Error Troubleshooting

### Error: "Cross-Origin Request Blocked"
**Solution**: Ensure `app.UseCors()` is called before `app.UseAuthorization()`

### Error: "Access-Control-Allow-Origin header missing"
**Solution**: Verify CORS policy is added and applied

### Error: "Method not allowed"
**Solution**: Ensure `AllowAnyMethod()` is set or specific methods are listed

### Error: "Header not allowed"
**Solution**: Ensure `AllowAnyHeader()` is set or specific headers are listed

---

## ?? Complete Implementation Checklist

```
Backend Setup
? Update Program.cs with CORS configuration
? Add using statement: using Microsoft.AspNetCore.Cors;
? Add builder.Services.AddCors(...)
? Add app.UseCors("AllowReactApp");
? Ensure UseCors() is before UseAuthorization()
? Build solution: dotnet build
? Run backend: dotnet run
? Verify backend runs on https://localhost:7295

Frontend Setup
? Navigate to employee-management-frontend
? npm install
? Create .env.local with API URL
? npm start
? Frontend runs on http://localhost:3000

Testing
? Open React frontend in browser
? Check browser console for errors
? Try creating an employee
? Check backend console for successful requests
? Try editing an employee
? Try deleting an employee
```

---

## ?? You're Ready!

Once CORS is configured on the backend and the frontend is running:

1. React frontend will successfully communicate with your .NET backend
2. All CRUD operations will work without errors
3. Data will flow seamlessly between frontend and backend
4. No more CORS-related console errors

---

## ?? Additional Resources

- [Microsoft CORS Documentation](https://learn.microsoft.com/en-us/aspnet/core/security/cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [ASP.NET Core CORS with Credentials](https://learn.microsoft.com/en-us/aspnet/core/security/cors#preflight-requests)

---

## ?? Pro Tips

1. **Test with Postman First**: Verify backend works before enabling CORS
2. **Check Browser DevTools**: Network tab shows actual CORS errors
3. **Review Backend Logs**: Check for server-side errors
4. **Use Specific Origins**: More secure than `AllowAnyOrigin()` in production
5. **Keep Backup**: Save original Program.cs before making changes

---

**Backend is now ready for the React frontend! ??**
