using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Repositories;
using log4net;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class AdministracionAdjuntosServidorController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(AdministracionAdjuntosServidorController));
        AdministracionAdjuntosServidorRepository repo;
        public AdministracionAdjuntosServidorController()
        {
            repo = new AdministracionAdjuntosServidorRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> DepuraAdjuntos()
        {
            try
            {
                //private static readonly ILog log = LogManager.GetLogger(typeof(AdministracionAdjuntosServidorController));
                await repo.DepuraAdjuntos();
                return Ok("Proceso de limpieza de adjuntos ejecutado correctamente");
            }catch(Exception e)
            {
                throw new Exception("Error al ejecutar el proceso de limpieza, ver el archivo log_Error.txt para mas detalles", e);
            }
        }
    }
}
