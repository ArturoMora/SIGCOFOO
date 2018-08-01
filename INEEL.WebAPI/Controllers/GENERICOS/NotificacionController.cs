using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class NotificacionController : ApiController
    {
        NotificacionRepository repo;

        public NotificacionController()
        {
            repo = new NotificacionRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetCountSolicitudesNotification(int id, string clave)
        {
            try
            {
                var obj = await repo.GetCountSolicitudesNotification(id, clave);
                return Ok(obj);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
