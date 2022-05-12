using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;

using Sabio.Models.Domain.Candidates;
using Sabio.Models.Requests.Candidates;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;

namespace Sabio.Services.Candidates
{
    public class CandidateService : ICandidateService
    {

        IDataProvider _data = null;
        public CandidateService(IDataProvider data)
        {
            _data = data;
        }

        public void Delete(int id)
        {

            string procName = "[dbo].[Candidates_Delete]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            });

         
        }

        public List<Candidate> GetAllSurnames()
        {
            string procName = "[dbo].[Candidates_SelectAllV3]";
            List<Candidate> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
            {
                Candidate candidate = new Candidate();
                candidate.Surnames = reader.GetSafeString(0);
                candidate.Id = reader.GetSafeInt32(1);
                if (list == null)
                {
                    list = new List<Candidate>();
                }
                list.Add(candidate);
            });
            return list;
        }

        public Candidate GetById(int id)
        {

            string procName = "[dbo].[Candidates_Select_ById]";

            Candidate candidate = null;


            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);


            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                candidate = Mapper(reader, ref startingIndex);


            });

            return candidate;
        }

        public Paged<Candidate> GetAllPagination(int pageIndex, int pageSize)
        {
            Paged<Candidate> pagedResult = null;

            List<Candidate> result = null;

            int totalCount = 0;

            string procName = "[dbo].[Candidates_SelectAll]";


            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@pageIndex", pageIndex);
                    parameterCollection.AddWithValue("@pageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Candidate model = new Candidate();

                    model = Mapper(reader, ref startingIndex);


                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }


                    if (result == null)
                    {
                        result = new List<Candidate>();
                    }

                    result.Add(model);
                }

            );
            if (result != null)
            {
                pagedResult = new Paged<Candidate>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public int Add(CandidateAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Candidates_InsertV2]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
             returnParameters: delegate (SqlParameterCollection returnCollection)
             {
                 object oId = returnCollection["@Id"].Value;

                 int.TryParse(oId.ToString(), out id);

             });
            return id;

        }

        public void Update(CandidateUpdateRequest model)
        {

            string procName = "[dbo].[Candidates_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                col.AddWithValue("@Id", model.Id);



            }, returnParameters: null);

        }



        private static void AddCommonParams(CandidateAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@givenName", model.Name);
            col.AddWithValue("@surnames", model.Surnames);
            col.AddWithValue("@genderType", model.GenderType);
            col.AddWithValue("@age", model.Age);
            col.AddWithValue("@avatarUrl", model.AvatarUrl);
            col.AddWithValue("@party", model.Party);
            col.AddWithValue("@electionType", model.ElectionType);
            col.AddWithValue("@status", model.StatusType);
            col.AddWithValue("@IsElected", model.IsElected);

        }

        private static Candidate Mapper(IDataReader reader, ref int startingIndex)
        {
            Candidate aCandidate = new Candidate();

            aCandidate.Id = reader.GetSafeInt32(startingIndex++);
            aCandidate.Name = reader.GetSafeString(startingIndex++);
            aCandidate.Surnames = reader.GetSafeString(startingIndex++);
            aCandidate.GenderType = reader.GetSafeString(startingIndex++);
            aCandidate.Age = reader.GetSafeInt32(startingIndex++);
            aCandidate.AvatarUrl = reader.GetSafeString(startingIndex++);
            aCandidate.Party = reader.GetSafeString(startingIndex++);
            aCandidate.ElectionType = reader.GetSafeString(startingIndex++);
            aCandidate.Status = reader.GetSafeString(startingIndex++);
            aCandidate.IsElected = reader.GetSafeBool(startingIndex++);
            aCandidate.Biography = reader.GetSafeString(startingIndex++);

            return aCandidate;
        }

    }
}
