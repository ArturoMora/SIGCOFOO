using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    [Authorize]
    public class OCSuscripcionesController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(OCSuscripcionesController));

        private OCSuscripcionesRepository _entityRepo;

        public OCSuscripcionesController()
        {
            _entityRepo = new OCSuscripcionesRepository();

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado(String id)
        {
            //GetAllByEmpleadoANDsuscrito
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                //OCSuscripciones
                var ocs = await _entityRepo.GetCATOcsWithModulo(); // GetCATOcs();
                IEnumerable<string> OCsIdsuscripciones = await _entityRepo.GetOcsIdByEmpleadoANDsuscrito(id);

                foreach (var e in ocs)
                {
                    e.IsSuscrito = false;
                    if (OCsIdsuscripciones.Contains(e.OcsId))
                    {
                        e.IsSuscrito = true;
                    }
                }
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(ocs);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]OCSuscripciones model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(String id, [FromBody]Ocs model)
        {
            String clavePersona = id;

            if (String.IsNullOrEmpty(clavePersona))
            {
                return BadRequest(ModelState);
            }


            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                OCSuscripciones newSuscripcion = await _entityRepo.GetRowSuscripcionByEmpleadoANDocId(clavePersona, model.OcsId);
                if (newSuscripcion == null)
                {
                    OCSuscripciones nuevo = new OCSuscripciones();
                    nuevo.OcsId = model.OcsId;
                    nuevo.ClaveEmpleado = clavePersona;
                    nuevo.suscrito = model.IsSuscrito;
                    await _entityRepo.Create(nuevo);
                }
                else
                {
                    newSuscripcion.suscrito = model.IsSuscrito;
                    await _entityRepo.Update(newSuscripcion);
                }
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}