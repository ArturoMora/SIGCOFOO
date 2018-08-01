using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class NotificationController : ApiController
    {
        SolicitudRepository _SolicitudRepository;
        public NotificationController()
        {
            _SolicitudRepository = new SolicitudRepository();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllCount(String id)
        {
            try
            {
                var Solicitud = await _SolicitudRepository.GetAllCount(id); //id: personaID
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllGerenteByClaveCount(String id)
        {
            try
            {
                var Solicitud = await _SolicitudRepository.GetAllGerenteByClaveCount(id); //id: claveunidad
                return Ok(Solicitud);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
