# Employee Management Frontend

A React-based frontend for the Employee Management System that integrates with the .NET 8 backend API.

## Features

- ? View all employees
- ? Create new employee
- ? Edit existing employee
- ? Delete employee
- ? Responsive Bootstrap UI
- ? Error handling and loading states
- ? Success notifications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd employee-management-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `src/services/employeeService.js` if needed:
```javascript
const API_BASE_URL = 'https://localhost:7295/api'; // Change this if your API runs on a different port
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Fetch all employees |
| GET | `/api/employees/{id}` | Fetch employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

## Project Structure

```
src/
??? components/
?   ??? EmployeeList.js       # Main employee management component
??? services/
?   ??? employeeService.js    # API service with axios
??? styles/
?   ??? App.css               # App global styles
?   ??? EmployeeList.css      # Employee list styles
??? App.js                    # Root component
??? index.js                  # React entry point
```

## Technologies Used

- **React 18.2.0** - UI library
- **Axios** - HTTP client
- **React Bootstrap** - UI components
- **Bootstrap 5.3.0** - CSS framework

## CORS Configuration (Backend)

Make sure your .NET backend has CORS enabled to allow requests from the React frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

app.UseCors("AllowReactApp");
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Troubleshooting

### CORS Error
If you see CORS errors, ensure your .NET backend has CORS configured properly and is running on the correct URL.

### API Connection Failed
- Check that your .NET backend is running
- Verify the API base URL in `employeeService.js`
- Ensure the backend port matches (default: 7295)

### Port Already in Use
If port 3000 is already in use, React will ask to use another port.

## License

This project is licensed under the MIT License.
