using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    
    public class VocabularioController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(VocabularioController));

        VocabularioRepository _repository;

        public VocabularioController() {
            _repository = new VocabularioRepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllLike(String id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var Vocabulario = await _repository.GetAllLike(id, 15);
                return Ok(Vocabulario);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var Vocabulario = await _repository.GetAll();
                return Ok(Vocabulario);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var persona = await _repository.GetIdAsync(Id);
                return Ok(persona);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        


        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Vocabulario obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Vocabulario obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                throw new Exception("no se ha definido el tipo de eliminación: fisica o logica");
                await _repository.Delete(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }


    


    }
}