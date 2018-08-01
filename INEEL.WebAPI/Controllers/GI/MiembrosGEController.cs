using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories.GI;

namespace INEEL.WebAPI.Controllers.GI
{
    public class MiembrosGEController : ApiController
    {
        private MiembrosGERepository _repo;

        public MiembrosGEController()
        {
            _repo = new MiembrosGERepository();

        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id)//id 
        {
            try
            {
                var entity = await _repo.GetById(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getCorreos(int id)//id 
        {
            try
            {
                var entity = await _repo.getCorreos(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
