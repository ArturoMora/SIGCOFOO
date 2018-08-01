using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class EncargadoDespachoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EncargadoDespachoController));

        EncargadoDespachoRepository _Repository;
        PersonasRepository _PersonasRepository;
        public EncargadoDespachoController()
        {
            _Repository = new EncargadoDespachoRepository();
            _PersonasRepository = new PersonasRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var result = await _Repository.GetAll();
                foreach (var soli in result)
                {
                    var p = await _PersonasRepository.GetByClave(soli.ClavePersona);
                    if (p == null)
                    {
                        soli.NombrePersona = "No se encontro en la BD";
                    }
                    else
                    {
                        soli.NombrePersona = p.NombreCompleto;
                    }
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
        [Authorize] public async Task<IHttpActionResult> Create(EncargadoDespacho Obj)
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
        public async Task<IHttpActionResult> Update(EncargadoDespacho Obj)
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
