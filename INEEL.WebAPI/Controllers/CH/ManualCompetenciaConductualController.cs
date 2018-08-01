using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.CH
{
    public class ManualCompetenciaConductualController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(ManualCompetenciaConductualController));
        ManualCompetenciaConductualRepository _repository;
        AdjuntoRepository _adjuntoRepo;
        public ManualCompetenciaConductualController()
        {
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new ManualCompetenciaConductualRepository();
        }
        
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countConductualAndTecnica(Boolean id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var cant = await _repository.countConductualAndTecnica(id);//id no se utiliza actualmente
                return Ok(cant);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var idiomas = await _repository.GetAll();
                return Ok(idiomas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllConsulta()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var idiomas = await _repository.GetAllConsulta();
                return Ok(idiomas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var result = await _repository.GetById(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(ManualCompetenciaConductual Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(Obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(ManualCompetenciaConductual Obj)
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

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

    }
}
