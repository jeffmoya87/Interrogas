using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class ElectionResult
    {
        public int ElectionId { get; set; }

        public int CandidateId { get; set; }

        public DateTime ElectionDate { get; set; }


        public string GivenName { get; set; }

        public string Surnames { get; set; }

        public string Party { get; set; }

        public int Votes { get; set; }

        public decimal Percentage { get; set; }

        public string AvatarUrl { get; set; }


    }
}
