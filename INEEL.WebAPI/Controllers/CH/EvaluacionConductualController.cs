using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.CH;
using System.Web.Script.Serialization;

namespace INEEL.WebAPI.Controllers.CH
{
    [Authorize]
    public class EvaluacionConductualController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(EvaluacionConductualController));
        EvaluacionConductualesRepository _repository;

        public string GraficaJson { get; set; }


        public EvaluacionConductualController()
        {
            _repository = new EvaluacionConductualesRepository();
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
        public async Task<IHttpActionResult> GetByClaveCategoria(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.GetByClaveCategoria(Id);
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
        
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetByUnidadPeriodo(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByUnidadPeriodo(parametros);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetTopByPersona(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var ClaveEmpleado = id;
                var campo = await _repository.GetTopByPersona(ClaveEmpleado);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetPromedioCompetencias(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetPromedioCompetencias(parametros);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetByPersonaPeriodo(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByPersonaPeriodo(parametros);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetByCategoriaPeriodo(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetByCategoriaPeriodo(parametros);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetTodosByUnidadPeriodo(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetTodosByUnidadPeriodo(parametros);
                return Ok(campo);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost][Authorize] public async Task<IHttpActionResult> Create(EvaluacionEmpleadosCompetenciasConductuales obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Evaluación registrada correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> cargarEmpleadosPeriodo(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.cargarEmpleadosPeriodo(id);
                return Ok("Evaluación registrada correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public void OrganizaPlanesMejorasFortalezas()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                 _repository.OrganizaPlanesMejorasFortalezas();
                
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
               
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> duplicarCompetencias(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.duplicarCompetencias(id);
                return Ok("Cambios realizados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> duplicarfamiias(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.duplicarFamilias(id);
                return Ok("Cambios realizados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> duplicarCategorias(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.duplicarCategorias(id);
                return Ok("Cambios realizados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> duplicarMatriz(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.duplicarMatriz(id);
                return Ok("Cambios realizados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(EvaluacionEmpleadosCompetenciasConductuales obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Datos del empleado actualizados correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _repository.Delete(Id);
                return Ok("Evaluación eliminada correctamente!");

            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }


        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(EvaluacionEmpleadosCompetenciasConductuales obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GraficaResultadosPeriodo(BusquedaNivel parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var grafica = await _repository.GetGraficaResultados(parametros);
                return Ok(grafica);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }








    }
}
