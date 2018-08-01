using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;

namespace INEEL.WebAPI.Controllers.GI
{
    public class IndicadoresGIController : ApiController
    {

       IndicadoresGIRepository _irep;

     
        public IndicadoresGIController()
        {
            _irep = new IndicadoresGIRepository();
        }


        [HttpGet]
        public async Task<IHttpActionResult> getPropuestraEntreIdeas(string id)
        {
            try
            {                
                var obj = await _irep.propuestasentreideas(id);
                return Ok(obj);
            }
            catch (Exception e)
            {             
                return InternalServerError(e);
            }
        }



        [HttpGet]
        public async Task<IHttpActionResult> getIdeasEntreIdeas(string id)
        {
            try
            {
                var obj = await _irep.ideasentreideas(id);
                return Ok(obj);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}
