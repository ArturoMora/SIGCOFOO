﻿using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    [Authorize]
    public class UnidadFamiliaController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(UnidadFamiliaController));

        UnidadFamiliaRepository _repository;
        public UnidadFamiliaController()
        {
            _repository = new UnidadFamiliaRepository();
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
        public async Task<IHttpActionResult> GetByFamilia(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var campo = await _repository.GetByFamilia(id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByPeriodo(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var campo = await _repository.GetByPeriodo(id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetByUnidad(BusquedaNivel param)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByUnidad(param);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.Get(Id);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(FamiliaUnidad obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Unidad organizacional asignada correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(FamiliaUnidad obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Unidad organzacional actualizada correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repository.Delete(Id);
                return Ok("Unidad organizacional eliminada correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(FamiliaUnidad obj)
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
