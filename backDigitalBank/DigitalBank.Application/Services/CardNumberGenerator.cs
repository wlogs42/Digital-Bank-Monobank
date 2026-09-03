using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalBank.Application.Services
{
    public static class CardNumberGenerator
    {
        private static readonly Random R = new Random();

        public static string GenerateCardNumber() =>
        string.Concat(Enumerable.Range(0, 16).Select(_ => R.Next(0, 10)));

        public static string GenerateSecurityCode() =>
            R.Next(0, 1000).ToString("D3");

        public static string GenerateExpirationDate() =>
            DateTime.UtcNow.AddYears(4).ToString("MM/yy");
    }
}
