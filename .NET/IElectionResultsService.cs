using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.WebScraping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
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
