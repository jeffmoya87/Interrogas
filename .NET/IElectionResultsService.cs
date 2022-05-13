using System.Models;
using System.Models.Domain;
using System.Models.Domain.WebScraping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Services.Interfaces
{
    public interface IElectionResultsService
    {
        ElectionResult Get(int id);
        Paged<ElectionResult> SearchPagination(int pageIndex, int pageSize, string Query);
        List<ElectionData> ElectionDataWikiScrape(string location, string key);
        IEnumerable<dynamic> PollsterDataWikiScrape(string location, string key, string candidates);
        IEnumerable<dynamic> CoalitionDataWikiScrape(string location, string key, string coalitions);
    }
}
