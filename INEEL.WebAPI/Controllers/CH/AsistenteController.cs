using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.CH
{
    public class AsistenteController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(AsistenteController));
        AsistenteRepository _Repository;
        PersonasRepository _PersonasRepository;
        public AsistenteController()
        {
            _Repository = new AsistenteRepository();
            _PersonasRepository = new PersonasRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var result = await _Repository.GetAll();
                foreach (var soli in result)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    soli.NombrePersona = p.NombreCompleto;
                }
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var result = await _Repository.GetById(id);

                var p = await _PersonasRepository.GetByClave(result.ClavePersona);
                result.NombrePersona = p.NombreCompleto;

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Asistente Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _Repository.Create(Obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);

            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Asistente Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _Repository.Update(Obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
