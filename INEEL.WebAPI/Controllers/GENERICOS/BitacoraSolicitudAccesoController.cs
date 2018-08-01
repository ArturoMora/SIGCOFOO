using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class BitacoraSolicitudesAccesoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BitacoraSolicitudesAccesoController));
        //SolicitudRepository _solicitudesRepo;
        BitacoraSolicitudesAccesoRepository _repository;
        //PersonasRepository _PersonasRepository;

        public BitacoraSolicitudesAccesoController()
        {
            //_solicitudesRepo = new SolicitudRepository();
            _repository = new BitacoraSolicitudesAccesoRepository();
            //_PersonasRepository = new PersonasRepository();
        }
        //[Route("api/BitacoraSolicitudesAcceso/GetByIds/{id}/{id2}")]
        //[AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetBySolicitudAccesoId(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var Bita = await _repository.GetBySolicitudAccesoId(id);
                var _PersonasRepository = new PersonasRepository();
                foreach (var obj in Bita)
                {
                    var p = await _PersonasRepository.GetByClave(obj.ClavePersona);
                    obj.NombreCompleto = p.NombreCompleto;
                }

                return Ok(Bita);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(BitacoraSolicitudesAcceso Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                //Obj.FechaMovimiento= Obj.FechaMovimiento.ToLocalTime();
                var result = await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
