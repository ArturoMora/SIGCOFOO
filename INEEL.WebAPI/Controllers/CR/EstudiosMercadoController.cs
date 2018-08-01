using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class EstudiosMercadoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EstudiosMercadoController));
        EstudiosMercadoRepository _repository;
        AdjuntoRepository _adjuntoRepo;
        public EstudiosMercadoController()
        {
            _repository = new EstudiosMercadoRepository();
            _adjuntoRepo = new AdjuntoRepository();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countByStatus(Boolean id)
        {
            try {
                var cant = await _repository.countByStatus(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var result = await _repository.GetAll();
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaParametrizadaEstudios(EstudiosMercado parametros)
        {
            try
            {
                var result = await _repository.GetConsultaParametrizadaEstudios(parametros);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(EstudiosMercado Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                int id=await _repository.Create(Obj);
                //return Ok("Registro creado correctamente!");
                return Ok(id);
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

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var result = await _repository.GetById(Id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(EstudiosMercado Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (Obj.Adjunto != null)
                {
                    //Elimar archivo
                    if (Obj.Adjunto.nombre == "eliminar")
                    {
                        int id = Convert.ToInt32(Obj.AdjuntoId);
                        Obj.AdjuntoId = null;
                        await _repository.Update(Obj);
                        await _adjuntoRepo.Delete(id);
                        return Ok();
                    }
                    ///Agregar archivo al editar
                    if (Obj.Adjunto.AdjuntoId == 0)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(Obj.Adjunto);
                        Obj.AdjuntoId = key.AdjuntoId;
                        Obj.Adjunto.AdjuntoId = key.AdjuntoId;
                        await _repository.Update(Obj);
                        return Ok(key);
                    }
                }
                //solución de ALAN replicada
                if (Obj.Adjunto != null)
                    Obj.AdjuntoId = Obj.Adjunto.AdjuntoId;
                await _repository.Update(Obj);
                return Ok(Obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> datosGrafica()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.GetEstudiosVigentesHOT();
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> AccesoArchivo(AccesoArchivo Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData)); //TODO:  new InfoException(Id)
                var result = await _repository.AccesoArchivo(Id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
