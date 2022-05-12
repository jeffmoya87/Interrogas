using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Candidates;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Candidates;
using Sabio.Services;
using Sabio.Services.Candidates;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;

namespace Sabio.Web.Api.Controllers.Candidates
{
  
    [Route("api/candidates")]
    [ApiController]
   
    public class CandidateApiController : BaseApiController
    {
        private ICandidateService _service = null;
        private IAuthenticationService<int> _authService = null;
        public CandidateApiController(ICandidateService service,
            ILogger<CandidateApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

      

        #region Candidate API End Points
        [AllowAnonymous]
        [HttpGet("{id:int}")]

        public ActionResult<ItemResponse<Candidate>> GetId(int id)
        {

            int code = 200;
            BaseResponse response = null;


            try
            {
                Candidate candidate = _service.GetById(id);
                response = new ItemResponse<Candidate> { Item = candidate };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }


            return StatusCode(code, response);
        }

        [HttpGet]
        public ActionResult<ItemsResponse<Candidate>> GetAllSurnames()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Candidate> list = _service.GetAllSurnames();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Candidate> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }


        [HttpPost]

        public ActionResult<ItemResponse<int>> Create(CandidateAddRequest model)
        {
            ObjectResult result = null;
            int code = 200;


            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                response.Item = id;

                result = Created201(response);
            }
            catch (Exception ex)
            {

                code = 500;
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(code, response);
            }

            return result;
        }

        [HttpDelete("{id:int}")]

        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {

                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }


        [HttpPut("{id:int}")]

        public ActionResult<SuccessResponse> Update(CandidateUpdateRequest model)
        {

            int code = 200;
            BaseResponse response = null;


            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }


            return StatusCode(code, response);
        }

        [HttpGet("paginate")]

        public ActionResult<ItemResponse<Paged<Candidate>>> GetPaginate(int pageIndex, int pageSize)
        {
            int code = 200;

            BaseResponse response = null;

            try
            {
                Paged<Candidate> paged = _service.GetAllPagination(pageIndex, pageSize);


                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Candidate>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);

        }

    }
} 
#endregion
