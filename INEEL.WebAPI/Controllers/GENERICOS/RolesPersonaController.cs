using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers
{
    public class RolPersonaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(RolPersonaController));
        PersonasRepository _personasRepo;
        RolPersonaRepository _repository;

        public RolPersonaController() {
            _repository = new RolPersonaRepository();
            _personasRepo = new PersonasRepository();
        }


        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var campo = await _repository.GetAll();
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByRol(int idrol)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByRol(idrol);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAdminCH()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetAdminCH();
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByRolForsolicitud(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var clave = await _repository.GetByRolForsolicitud(id);
                return Ok(clave);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.GetByRol(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetPersonasByIdRol()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetPersonasByIdRol();
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetPersonasByIdRolByTrue()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetPersonasByIdRolByTrue();
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(RolPersona obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Rol de usuario creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> CreateEspecialista(RolPersona obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.CreateEspecialista(obj);
                return Ok("Rol de usuario creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(RolPersona obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Rol de usuario actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Rol de usuario eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(RolPersona obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }



    }
}