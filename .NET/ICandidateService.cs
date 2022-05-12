using Sabio.Models;
using Sabio.Models.Domain.Candidates;
using Sabio.Models.Requests.Candidates;
using System.Collections.Generic;

namespace Sabio.Services.Candidates
{
    public interface ICandidateService
    {
        void Delete(int id);
        int Add(CandidateAddRequest model, int userId);
        Paged<Candidate> GetAllPagination(int pageIndex, int pageSize);
        Candidate GetById(int id);
        void Update(CandidateUpdateRequest model);
        List<Candidate> GetAllSurnames();
    }
}