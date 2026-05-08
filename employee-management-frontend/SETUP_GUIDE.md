# Setup Guide - React Frontend for Employee Management System

## Quick Start

### 1. Prerequisites
- Node.js v16+ installed
- .NET 8 backend running (on `https://localhost:7295`)
- npm or yarn package manager

### 2. Installation Steps

```bash
# Navigate to the frontend directory
cd employee-management-frontend

# Install all dependencies
npm install

# Create environment configuration
cp .env.example .env.local

# Start the development server
npm start
```

The application will automatically open at `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with:

```
REACT_APP_API_BASE_URL=https://localhost:7295/api
```

**Note:** The `.env` file should NOT be committed to version control. Use `.env.example` as a template.

## Backend CORS Setup (Required)

Your .NET 8 backend must have CORS enabled. Update your `Program.cs`:

```csharp
using Microsoft.AspNetCore.Cors;

var builder = WebApplicationBuilder.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // React frontend URL
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode on port 3000.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Test
```bash
npm test
```
Runs the test suite.

## Features Overview

### Employee List View
- Displays all employees in a responsive table
- Shows: ID, Name, Department, Salary

### Create Employee
- Click "+ Add New Employee" button
- Fill in: Name, Department, Salary
- Submit to create

### Edit Employee
- Click "Edit" button on any employee row
- Modify the details
- Submit to save changes

### Delete Employee
- Click "Delete" button on any employee row
- Confirm deletion
- Employee will be removed

### Loading & Error States
- Loading spinner while fetching data
- Error alerts for failed operations
- Success notifications for completed actions
- Auto-refresh after create/update/delete

## API Endpoints Called

```
GET    /api/employees           ? Get all employees
GET    /api/employees/{id}      ? Get employee by ID
POST   /api/employees           ? Create new employee
PUT    /api/employees/{id}      ? Update employee
DELETE /api/employees/{id}      ? Delete employee
```

## Troubleshooting

### Issue: "Failed to fetch employees"
**Solution:** 
- Verify .NET backend is running on `https://localhost:7295`
- Check CORS configuration in backend
- Open browser DevTools ? Network tab to see the actual error

### Issue: CORS error in console
**Solution:**
- Update `Program.cs` with CORS configuration shown above
- Make sure `WithOrigins("http://localhost:3000")` matches your frontend URL

### Issue: Certificate error
**Solution:**
- For development, you may need to bypass certificate validation
- In `src/services/employeeService.js`, add:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7295/api',
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: {
    rejectUnauthorized: false, // Only for development!
  },
});
```

### Issue: Port 3000 already in use
**Solution:**
- React will ask to use a different port (e.g., 3001)
- Press 'Y' to continue on the new port
- Or kill the process using port 3000

## Project Structure

```
employee-management-frontend/
??? public/
?   ??? index.html              # HTML entry point
??? src/
?   ??? components/
?   ?   ??? EmployeeList.js     # Main employee management component
?   ??? services/
?   ?   ??? employeeService.js  # API client using Axios
?   ??? styles/
?   ?   ??? App.css             # Global styles
?   ?   ??? EmployeeList.css    # Component styles
?   ??? App.js                  # Root React component
?   ??? index.js                # React DOM render
??? .env.example                # Environment template
??? .gitignore                  # Git ignore rules
??? package.json                # Dependencies & scripts
??? README.md                   # Documentation
```

## Dependencies

- **react**: UI library
- **react-dom**: React rendering
- **axios**: HTTP client for API calls
- **bootstrap**: CSS framework
- **react-bootstrap**: Bootstrap components for React

## Production Deployment

### Build the application
```bash
npm run build
```

### Serve the build
```bash
# Using serve package
npm install -g serve
serve -s build
```

### Docker (Optional)
Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t employee-frontend .
docker run -p 3000:3000 employee-frontend
```

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review React and Axios documentation
3. Check backend logs for API errors
