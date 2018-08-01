using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class DisciplinasController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(DisciplinasController));
        DisciplinasRepository _disciplinasRepo;

        public DisciplinasController()
        {
            _disciplinasRepo = new DisciplinasRepository();
        }

       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var disciplinas = await _disciplinasRepo.GetAll();
                return Ok(disciplinas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet][Authorize] public async Task<IHttpActionResult> GetAllAdmin(){ try {
                var disciplinas = await _disciplinasRepo.GetAllAdmin();
                return Ok(disciplinas);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var disciplina = await _disciplinasRepo.GetById(Id);
                return Ok(disciplina);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(Disciplina disciplina)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _disciplinasRepo.Create(disciplina);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(Disciplina disciplina)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _disciplinasRepo.UpdateDisciplina(disciplina);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Disciplina disciplina)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _disciplinasRepo.UpdateEstado(disciplina);
                return Ok();
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _disciplinasRepo.DeleteDisciplina(Id);
                return Ok("Registro eliminado correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }
    }
}
