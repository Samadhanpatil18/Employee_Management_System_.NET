# ?? Copy-Paste Commands - Get Started in 5 Minutes

## ?? Quick Start (No Reading Required)

### 1?? First: Update Your Backend

**Edit: `EmployeeManagement.API/Program.cs`**

Add this at the very top (after using statements):
```csharp
using Microsoft.AspNetCore.Cors;
```

Add this after `builder.Services.AddSwaggerGen();`:
```csharp
// Add CORS Policy
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

Add this before `app.UseAuthorization();`:
```csharp
app.UseCors("AllowReactApp");
```

### 2?? Run Your Backend
```bash
dotnet run
```
Wait until you see: "Application started..."

### 3?? Install Frontend
```bash
cd employee-management-frontend
npm install
```

### 4?? Start Frontend
```bash
npm start
```
Browser will open automatically.

### 5?? Test It!
- Create a new employee
- Edit it
- Delete it
- Done! ?

---

## ?? Full Command Sequence

### Windows (PowerShell)

```powershell
# 1. Start backend
cd EmployeeManagement.API
dotnet run

# In new PowerShell window:
# 2. Go to frontend
cd employee-management-frontend

# 3. Install dependencies
npm install

# 4. Start frontend
npm start
```

### Mac/Linux (Terminal)

```bash
# 1. Start backend
cd EmployeeManagement.API
dotnet run &

# 2. Go to frontend
cd employee-management-frontend

# 3. Install dependencies
npm install

# 4. Start frontend
npm start
```

---

## ?? Setup without Reading Documents

Just do this:

```bash
# Terminal Window 1: Backend
cd EmployeeManagement.API
dotnet run
# Runs on https://localhost:7295

# Terminal Window 2: Frontend
cd employee-management-frontend
npm install
npm start
# Opens http://localhost:3000
```

---

## ?? Component Choice (Edit Once)

Edit: `employee-management-frontend/src/App.js`

### Simple Version
```javascript
import EmployeeList from './components/EmployeeList';

function App() {
  return <EmployeeList />;
}
export default App;
```

### Advanced Version (Recommended)
```javascript
import EmployeeListAdvanced from './components/EmployeeListAdvanced';

function App() {
  return <EmployeeListAdvanced />;
}
export default App;
```

Save and the frontend will auto-reload.

---

## ?? Environment Setup (Optional)

If your backend runs on different port:

Create: `employee-management-frontend/.env.local`

```
REACT_APP_API_BASE_URL=https://localhost:7295/api
```

Change the port if needed. Default is 7295 for .NET 8.

---

## ? Verify Everything Works

### In Browser (http://localhost:3000)
- ? You see a page titled "Employee Management System"
- ? Click "+ Add New Employee"
- ? Fill in Name, Department, Salary
- ? Click "Create Employee"
- ? See success message
- ? Employee appears in table
- ? Can edit and delete

### If Something Fails
- ? Press F12 to open DevTools
- ? Check Console tab for errors
- ? Check Network tab for API calls
- ? Verify backend is still running

---

## ?? One-Time Setup Commands

```bash
# Copy-paste these exact commands:

# 1. Move to frontend folder
cd employee-management-frontend

# 2. Install once
npm install

# 3. Run forever (or until you stop it)
npm start
```

That's it! Frontend will auto-reload when you edit files.

---

## ??? Common Issues & Quick Fixes

### CORS Error
```
? "Cross-Origin Request Blocked"

? Fix: Edit Program.cs and add CORS code
   (See "Update Your Backend" section above)
   Then: dotnet run
```

### Port 3000 Already in Use
```
React will ask: "Something is already using port 3000. Use 3001?"
Press: Y
Done!
```

### npm: command not found
```
? Node.js not installed

? Download: https://nodejs.org/
   Install and restart terminal
   Then: npm install
```

### Can't Connect to Backend
```
? Backend not running or wrong port

? Check: Is backend window showing "Application started"?
   If not: Run "dotnet run"
   If yes: Check API URL in .env.local
```

---

## ?? Choosing Components

### Fast Prototype
Use: `EmployeeList.js`
- Simple UI
- Just works
- No extra features

### Professional App
Use: `EmployeeListAdvanced.js`
- Dashboard
- Stats
- Search & Sort
- Better looking

---

## ?? Project Locations

```
Frontend:    employee-management-frontend/
Backend:     EmployeeManagement.API/
Frontend App: http://localhost:3000
Backend API: https://localhost:7295/api
```

---

## ?? From Zero to Running

### Step 1: Edit Program.cs (2 minutes)
Add CORS code (see above)

### Step 2: Start Backend (1 minute)
```bash
dotnet run
```

### Step 3: Start Frontend (2 minutes)
```bash
cd employee-management-frontend
npm install
npm start
```

### Step 4: Test (1 minute)
Create/Edit/Delete an employee

**Total: ~6 minutes**

---

## ?? Environment Template

### `.env.local` File

```
REACT_APP_API_BASE_URL=https://localhost:7295/api
```

Save this as `employee-management-frontend/.env.local`

---

## ?? URL Reference

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | https://localhost:7295 |
| Swagger | https://localhost:7295/swagger |
| API Endpoint | https://localhost:7295/api/employees |

---

## ?? Success Indicators

You'll know it works when:

1. ? Terminal shows "webpack compiled successfully"
2. ? Browser opens to http://localhost:3000
3. ? You see the employee management interface
4. ? No red errors in browser console
5. ? Click buttons and they work
6. ? Data flows between frontend and backend

---

## ?? Time Breakdown

```
CORS Setup:        2 minutes
Backend Start:     30 seconds
Frontend Install:  2-3 minutes
Frontend Start:    30 seconds
Test Operations:   1 minute
?????????????????????????????
Total:            ~6-7 minutes
```

---

## ?? Done!

When you see the app working in your browser, you're done!

### Next Steps (Optional)
- Read `DOCUMENTATION.md` for advanced features
- Try the advanced component
- Deploy to production

---

## ?? Cheat Sheet

### Start Everything
```bash
# Terminal 1
cd EmployeeManagement.API
dotnet run

# Terminal 2
cd employee-management-frontend
npm install
npm start
```

### Stop Everything
```bash
Ctrl+C (in both terminals)
```

### Rebuild Frontend
```bash
npm run build
```

### Clean & Reinstall
```bash
npm cache clean --force
npm install
npm start
```

---

## ?? Need Help?

Files to read (in order):
1. This file (quick commands)
2. `SETUP_GUIDE.md`
3. `DOCUMENTATION.md`

---

**Ready? Start with the commands above! ??**
