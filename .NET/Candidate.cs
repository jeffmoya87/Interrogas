using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Domain.Candidates
{
    public class Candidate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surnames { get; set; }
        public string GenderType { get; set; }
        public int Age { get; set; }
        public string AvatarUrl { get; set; }
        public string ElectionType { get; set; }
        public bool IsElected { get; set; }
        public string Party { get; set; }
        public string Status { get; set; }
        public string Biography { get; set; }
    }

}
