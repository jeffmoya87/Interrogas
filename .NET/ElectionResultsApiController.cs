using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Models;
using System.Models.Domain;
using System.Models.Domain.WebScraping;
using System.Services.Interfaces;
using System.Web.Controllers;
using System.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace System.Web.Api.Controllers
{
    [Route("api/elections/results")]
    [ApiController]
    public class ElectionResultsApiController : BaseApiController
    {
        private IElectionResultsService _service = null;

        public ElectionResultsApiController (IElectionResultsService service, ILogger<ElectionResultsApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ElectionResult>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                ElectionResult electionResult = _service.Get(id);

                if (electionResult == null)
                {
                    code = 404;
                    response = new ErrorResponse("This App Resource (ElectionResult) Was Not Found");
                }
                else
                {
                    response = new ItemResponse<ElectionResult>() { Item = electionResult };
                }
            }
            catch(ArgumentException argex)
            {
                code = 500;
                response = new ErrorResponse($"argumentexception errors {argex.Message}");
                base.Logger.LogError(argex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<ElectionResult>>> SearchPagination(int pageIndex, int pageSize, string Query)
        {
            ActionResult result = null;

            try
            {
                Paged<ElectionResult> page = _service.SearchPagination(pageIndex, pageSize, Query);

                if (page == null)
                {
                    result = NotFound404(new ErrorResponse("Search Pagination Resource Not Found."));
                }
                else
                {
                    ItemResponse<Paged<ElectionResult>> response = new ItemResponse<Paged<ElectionResult>>();
                    response.Item = page;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpPost("wikiscraper/electiondata")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<List<ElectionData>>> ElectionsDataWikiScrape(string location, string key)
        {
            ActionResult result = null;

            try
            {
                List<ElectionData> dataList = _service.ElectionDataWikiScrape(location, key);

                if (dataList == null)
                {
                    result = NotFound404(new ErrorResponse("WikiScrape yielded no results"));
                }
                else
                {
                    ItemResponse<List<ElectionData>> response = new ItemResponse<List<ElectionData>>();
                    response.Item = dataList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpPost("wikiscraper/pollsterdata")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<IEnumerable<dynamic>>> PollsterDataWikiScrape(string location, string key, string candidates)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                IEnumerable<dynamic> pollsterData = _service.PollsterDataWikiScrape(location, key, candidates);

                if (pollsterData == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<IEnumerable<dynamic>> { Item = pollsterData };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("wikiscraper/coalitiondata")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<IEnumerable<dynamic>>> CoalitionDataWikiScrape(string location, string key, string coalitions)
        {
            ActionResult result = null;

            try
            {
                IEnumerable<dynamic> coalitionData = _service.CoalitionDataWikiScrape(location, key, coalitions);

                if (coalitionData == null)
                {
                    result = NotFound404(new ErrorResponse("WikiScrape yielded no results"));
                }
                else
                {
                    ItemResponse<IEnumerable<dynamic>> response = new ItemResponse<IEnumerable<dynamic>>();
                    response.Item = coalitionData;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

    }
}
