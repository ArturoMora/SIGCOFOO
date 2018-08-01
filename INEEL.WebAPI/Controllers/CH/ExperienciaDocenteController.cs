﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.WebAPI.Utilidades;

namespace INEEL.WebAPI.Controllers.CH
{
    public class ExperienciaDocenteController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ExperienciaDocenteController));
        ExperienciaDocenteRepository _repository;
        AdjuntoRepository _adjuntoRepo;

        public ExperienciaDocenteController()
        {
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new ExperienciaDocenteRepository();
        }
        [Route("api/ExperienciaDocente/GetByClaveEmpEstadoFlujo/{clave}/{estados}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpEstadoFlujo(string clave, /*int yearsBack,*/ String estados)
        {

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                EstadosToInt param = new EstadosToInt(estados/*, yearsBack*/);
                var r = await _repository.GetByClaveEmpEstadoFlujo(clave, /*param.Fecha,*/ param.ListEstados);
                return Ok(r);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Route("api/ExperienciaDocente/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetByClave(string clave){ try {
                var result = await _repository.GetByClave(clave);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(ExperienciaDocente Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(Obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var sni = await _repository.GetById(Id);
                return Ok(sni);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(ExperienciaDocente Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                
                //solución de ALAN replicada
                //if (Obj.Adjunto != null)
                //    Obj.AdjuntoId = Obj.Adjunto.AdjuntoId;
                await _repository.Update(Obj);
                return Ok(Obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(ExperienciaDocente Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(Obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}