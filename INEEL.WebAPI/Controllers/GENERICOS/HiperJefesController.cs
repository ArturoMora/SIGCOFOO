using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Util;
using System.Configuration;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class HiperJefesController : ApiController
    {

        /// <summary>
        /// retorna true si el id: idROL está dentro de la collección de la clave 'RolesJefes' en web.config
        /// </summary>
        /// <param name="id">idROL</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> AltosMandos(String id)
        {
            
            try
            {
                var result =  await Task.Run(() =>
                {
                    var jefes = ConfigurationManager.AppSettings["RolesJefes"];
                    if (String.IsNullOrEmpty(jefes))
                    {
                        throw new Exception("no se localizó la clave 'RolesJefes'");
                    }
                    var listJefes = jefes.Split(',');
                    if (listJefes.Contains(id))
                    {
                        return true;
                    }
                    else
                        return false;
                });
                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
