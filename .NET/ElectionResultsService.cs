using HtmlAgilityPack;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.WebScraping;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services
{
    public class ElectionResultsService : IElectionResultsService
    {
        public ElectionResultsService(IDataProvider data)
        {
            _data = data;
        }
        IDataProvider _data = null;

        public ElectionResult Get(int id)
        {
            ElectionResult electionResult = null;
            string procName = "[dbo].[ElectionResults_Select_ByElectionId]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                electionResult = MapElectionResult(reader, ref startingIndex);
            });
            return electionResult;
        }

        public Paged<ElectionResult> SearchPagination(int pageIndex, int pageSize, string Query)
        {
            Paged<ElectionResult> pagedList = null;
            List<ElectionResult> list = null;
            int totalCount = 0;
            string procName = "[dbo].[ElectionResults_Search]";

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@Query", Query);
            }, (reader, recordSetIndex) =>
            {
                int startingIndex = 0;
                ElectionResult electionResult = MapElectionResult(reader, ref startingIndex);
                if (totalCount == 0) 
                { 
                    totalCount = reader.GetSafeInt32(startingIndex++); 
                }

                if (list == null)
                {
                    list = new List<ElectionResult>();
                }
                list.Add(electionResult);
            });

            if (list != null)
            {
                pagedList = new Paged<ElectionResult>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<ElectionData> ElectionDataWikiScrape(string location, string key)
        {
            var html = @location + "#" + key;
            var web = new HtmlWeb();
            var htmlDoc = web.Load(html);

            if (htmlDoc == null)
            {
                throw new Exception("Invalid url");
            }

            var entryTest = htmlDoc.DocumentNode.SelectSingleNode("//span[@id='" + key + "']").ParentNode.NextSibling.NextSibling;
            var tbody = entryTest.SelectNodes("./tbody");

            List<string> filteredList = new List<string>();

            foreach (var item in tbody)
            {
                item.SelectSingleNode("./tr/td/div/div/table")?.Remove();
                item.SelectSingleNode("./tr/td/div/div/table")?.Remove();
                item.SelectSingleNode("./tr/td/div/div/table")?.Remove();

                var ar = item.InnerText.Trim().Replace("\n\n\n", "|").Replace("\n\n", "|").Replace("\n", "|").Replace("&#160;", "");
                var splitAr = ar.Split("|");

                for (int i = 0; i < splitAr.Length; i++)
                {
                    splitAr[i] = splitAr[i].Trim();
                    if (splitAr[i].Contains("["))
                    {
                        var bracketIndex = splitAr[i].IndexOf("[");
                        var updateditem = splitAr[i].Remove(bracketIndex);

                        filteredList.Add(updateditem);
                    }
                    else if (splitAr[i].Length > 0)
                    {
                        filteredList.Add(splitAr[i]);
                    }
                }
            }

            if (filteredList[0].Contains("Congreso"))
            {
                filteredList.RemoveRange(0, 2);
            }

            filteredList.RemoveRange((filteredList.IndexOf("Total de votos válidos")), 8);

            List<IEnumerable<string>> listOfLists = new List<IEnumerable<string>>();

            List<ElectionData> dataList = new List<ElectionData>();

            for (int i = 4; i < filteredList.Count; i += 5)
            {
                listOfLists.Add(filteredList.Skip(i).Take(5));
            }

            foreach (var list in listOfLists)
            {
                ElectionData newData = new ElectionData();
                var listAr = list.ToList();

                if (listAr.Count > 3)
                {
                    newData.Candidate = listAr[0];
                    newData.Party = listAr[2];
                    newData.Votes = listAr[3];
                    newData.Percentage = listAr[4];

                    dataList.Add(newData);
                }
            }

            return dataList;
        }

        public IEnumerable<dynamic> PollsterDataWikiScrape(string location, string key, string candidates)
        {
            var html = @location + "#" + key;
            var web = new HtmlWeb();
            var htmlDoc = web.Load(html);

            if (htmlDoc == null)
            {
                throw new Exception("Invalid url");
            }

            var tableData = htmlDoc.DocumentNode.SelectSingleNode("//span[@id='" + key + "']").ParentNode.NextSibling.NextSibling;
            var dataText = tableData.SelectSingleNode("./tbody").InnerText.Replace("\n", "|").Replace("&#160;", "");
            int columnCount = tableData.SelectNodes("./tbody/tr/th").Count;
            var td = tableData.SelectNodes("./tbody/tr/td");
            var dataAr = dataText.Split("|");
            string[] candidateAr = candidates?.Split("|");

            string firstCell = getFirstCell(td);

            List<string> filteredData = getFilteredData(dataAr);

            var bodyStartIndex = filteredData.IndexOf(firstCell);

            List<IEnumerable<string>> dataRows = getDataRows(filteredData, columnCount, bodyStartIndex);

            List<string> columnNames = getColumnNames(firstCell, filteredData);

            List<ExpandoObject> dataObj = new List<ExpandoObject>();

            foreach (var row in dataRows)
            {
                var cellAr = row.ToList();
                if (cellAr.Count >= columnCount)
                {
                    dataObj.Add(getPollsterData(cellAr, columnCount, candidateAr));
                }
            }

            return dataObj;
        }

        public IEnumerable<dynamic> CoalitionDataWikiScrape(string location, string key, string coalitions)
        {
            var html = @location + "#" + key;
            var web = new HtmlWeb();
            var htmlDoc = web.Load(html);

            if (htmlDoc == null)
            {
                throw new Exception("Invalid url");
            }

            var tableData = htmlDoc.DocumentNode.SelectSingleNode("//span[@id='" + key + "']").ParentNode.NextSibling.NextSibling;
            var dataText = tableData.SelectSingleNode("./tbody").InnerText.Replace("\n", "|").Replace("&#160;", "");
            int columnCount = tableData.SelectNodes("./tbody/tr/th").Count;
            var td = tableData.SelectNodes("./tbody/tr/td");
            var dataAr = dataText.Split("|");
            string[] coalitionAr = coalitions?.Split("|");

            string firstCell = getFirstCell(td);

            List<string> filteredData = getFilteredData(dataAr);

            var bodyStartIndex = filteredData.IndexOf(firstCell);

            List<IEnumerable<string>> dataRows = getDataRows(filteredData, columnCount, bodyStartIndex);

            List<string> columnNames = getColumnNames(firstCell, filteredData);

            List<ExpandoObject> dataObj = new List<ExpandoObject>();

            foreach (var row in dataRows)
            {
                var cellAr = row.ToList();
                if (cellAr.Count >= columnCount && bodyStartIndex == 4)
                {
                    dataObj.Add(getCoalitionDataFour(cellAr, columnCount, coalitionAr));
                }
                else if (cellAr.Count >= columnCount && bodyStartIndex == 6)
                {
                    dataObj.Add(getCoalitionDataSix(cellAr, columnCount, coalitionAr));
                }
            }

            return dataObj;
        }

        private string getFirstCell(HtmlNodeCollection data)
        {
            var firstCell = "";

            for (int i = 0; i < data.Count; i++)
            {
                if (data[i].InnerText == "\n")
                {
                    continue;
                }
                else
                {
                    firstCell = data[i].InnerText.Remove(data[i].InnerText.IndexOf("["));
                    break;
                }
            }

            return firstCell;
        }

        private List<string> getFilteredData(string[] dataAr)
        {
            List<string> filteredData = new List<string>();

            for (int i = 0; i < dataAr.Length; i++)
            {
                dataAr[i] = dataAr[i].Trim();

                if (dataAr[i].Contains("["))
                {
                    var bracketIndex = dataAr[i].IndexOf("[");
                    var updateditem = dataAr[i].Remove(bracketIndex);

                    filteredData.Add(updateditem);
                }
                else if (dataAr[i].Length > 0)
                {
                    filteredData.Add(dataAr[i]);
                }
            }

            return filteredData;
        }

        private List<IEnumerable<string>> getDataRows(List<string> filteredData, int columnCount, int startIndex)
        {
            List<IEnumerable<string>> dataRows = new List<IEnumerable<string>>();

            for (int i = startIndex; i < filteredData.Count; i += columnCount)
            {
                dataRows.Add(filteredData.Skip(i).Take(columnCount));
            }

            return dataRows;
        }

        private List<string> getColumnNames(string firstCell, List<string> data)
        {
            List<string> columnNames = new List<string>();

            int index = data.IndexOf(firstCell);
            for(int i = 0; i < index; i++)
            {
                columnNames.Add(data[i]);
            }

            return columnNames;
        }

        private ExpandoObject getPollsterData(List<string> cellAr, int columnCount, string[] candidateAr)
        {
            dynamic pollsterData = new ExpandoObject();

            pollsterData.Pollster = cellAr[0];
            pollsterData.Date = cellAr[1];
            pollsterData.SampleSize = cellAr[2];
            pollsterData.Error = cellAr[3];

            List<ExpandoObject> candObj = new List<ExpandoObject>();
            int index = 3;
            foreach (var cands in candidateAr)
            {
                index++;

                dynamic localCandidates = new ExpandoObject();

                localCandidates.Name = cands;
                localCandidates.Percentage = cellAr[index];

                candObj.Add(localCandidates);
            }

            pollsterData.Candidates = candObj;
            pollsterData.ONNS = cellAr[columnCount - 1];

            return pollsterData;
        }

        private ExpandoObject getCoalitionDataFour(List<string> cellAr, int columnCount, string[] coalitionAr)
        {
            dynamic coalitionData = new ExpandoObject();

            coalitionData.Pollster = cellAr[0];
            coalitionData.Date = cellAr[1];

            List<ExpandoObject> coalObj = new List<ExpandoObject>();
            int index = 1;
            foreach (var coal in coalitionAr)
            {
                index++;

                dynamic localCandidates = new ExpandoObject();

                localCandidates.Name = coal;
                localCandidates.Percentage = cellAr[index];

                coalObj.Add(localCandidates);
            }

            coalitionData.Coalitions = coalObj;
            coalitionData.ONNS = cellAr[columnCount - 1];

            return coalitionData;
        }
        private ExpandoObject getCoalitionDataSix(List<string> cellAr, int columnCount, string[] coalitionAr)
        {
            dynamic coalitionData = new ExpandoObject();

            coalitionData.Pollster = cellAr[0];
            coalitionData.Date = cellAr[1];
            coalitionData.SampleSize = cellAr[2];
            coalitionData.Error = cellAr[3];

            List<ExpandoObject> coalObj = new List<ExpandoObject>();
            int index = 1;
            foreach (var coal in coalitionAr)
            {
                index++;

                dynamic localCandidates = new ExpandoObject();

                localCandidates.Name = coal;
                localCandidates.Percentage = cellAr[index];

                coalObj.Add(localCandidates);
            }

            coalitionData.Coalitions = coalObj;
            coalitionData.ONNS = cellAr[columnCount - 1];

            return coalitionData;
        }

        private static ElectionResult MapElectionResult(IDataReader reader, ref int startingIndex)
        {
            ElectionResult aElectionResult = new ElectionResult();

            startingIndex = 0;
            aElectionResult.ElectionId = reader.GetSafeInt32(startingIndex++);
            aElectionResult.CandidateId = reader.GetSafeInt32(startingIndex++);
            aElectionResult.ElectionDate = reader.GetSafeDateTime(startingIndex++);
            aElectionResult.GivenName = reader.GetSafeString(startingIndex++);
            aElectionResult.Surnames = reader.GetSafeString(startingIndex++);
            aElectionResult.Party = reader.GetSafeString(startingIndex++);
            aElectionResult.Votes = reader.GetSafeInt32(startingIndex++);
            aElectionResult.Percentage = reader.GetSafeDecimal(startingIndex++);
            aElectionResult.AvatarUrl = reader.GetSafeString(startingIndex++);

            return aElectionResult;
        }
    }
}
