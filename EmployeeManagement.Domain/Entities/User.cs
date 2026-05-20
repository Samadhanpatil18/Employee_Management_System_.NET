using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeManagement.Domain.Entities
{
    public class User
    {
        public int Id { get; private set; }

        public string Name { get; private set; } = string.Empty;

        public string Email { get; private set; } = string.Empty;

        public string Password { get; private set; } = string.Empty;

        public string Role { get; private set; } = "Employee";

        public User(
            string name,
            string email,
            string password,
            string role)
        {
            SetName(name);
            SetEmail(email);
            SetPassword(password);
            SetRole(role);
        }

        public void SetName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Name required");
            }

            Name = name;
        }

        public void SetEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email required");
            }

            Email = email;
        }

        public void SetPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException("Password required");
            }

            Password = password;
        }

        public void SetRole(string role)
        {
            Role = role;
        }
    }
}
