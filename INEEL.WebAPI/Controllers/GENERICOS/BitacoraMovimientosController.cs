using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class BitacoraMovimientosController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BitacoraMovimientosController));

        public BitacoraMovimientosController()
        {

        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                    BitacoraSISTEMA.InsertaMovimiento(
                        "La bitácora",
                        "Bitácora",
                        new List<string> { "Consultó [ la bitácora]" },
                        "consulta",
                        "");

                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
                List<BitacoraMovSISTEMA> listaMovimientos = new List<BitacoraMovSISTEMA>();
                await Task.Run(() =>
                {
                    listaMovimientos = BitacoraSISTEMA.VerTodo();
                });
                return Ok(listaMovimientos.OrderByDescending(m => m.fechaMovimiento));
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
