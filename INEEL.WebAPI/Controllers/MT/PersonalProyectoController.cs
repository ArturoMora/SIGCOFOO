/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.WebAPI.Utilidades;
using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.MT
{
    public class PersonalProyectoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(PersonalProyectoController));
        // AYUDA:
        //PersonalProyectoController.- Nombre de clase y tipicament constructor
        //PersonalProyectoRepository.- La implementación CRUD del Modelo:PersonalProyecto con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo PersonalProyectoRepository
        // entities.-        resultado de tipo Task<IEnumerable<PersonalProyecto>>
        // entity.-         resultado de tipo Task<PersonalProyecto>
        // PersonalProyecto.-         Modelo
       private PersonalProyectoRepository _entityRepo;
        AdjuntoRepository _adjuntoRepo;
        //private ProductsRepositories _productRepo;
        public PersonalProyectoController()
        {
            _entityRepo = new PersonalProyectoRepository();
            _adjuntoRepo = new AdjuntoRepository();
            // _productRepo = new ProductsRepositories();
        }
        [Route("api/PersonalProyecto/GetByClaveEmpEstadoFlujo/{clave}/{yearsBack}/{estados}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpEstadoFlujo(string clave, int yearsBack, String estados)
        {

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                EstadosToInt param = new EstadosToInt(estados, yearsBack);
                var r = await _entityRepo.GetByClaveEmpEstadoFlujo(clave, param.Fecha, param.ListEstados);
                return Ok(r);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _entityRepo.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
               return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [Route("api/PersonalProyecto/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]public async Task<IHttpActionResult> GetByClave(string clave){ try {
                var result = await _entityRepo.GetByClave(clave);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> PersonalProyecto_GetByClave(string id, string clave)
        {
            try
            {
                string numEmpleado = id;
                var result = await _entityRepo.PersonalProyecto_GetByClave(numEmpleado, clave); //clave del proyecto
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        
        [HttpGet]
        public async Task<IHttpActionResult> GetPersonasPorProyecto(String Id){
            try {log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetPersonasPorProyecto(Id);
                return Ok(entity);
            }
            catch (Exception e) {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyPersonas(String Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetProyPersonas(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]PersonalProyecto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> CreateReturn([FromBody]PersonalProyecto model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok(model);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(PersonalProyecto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (model.Adjunto != null)
                {
                    //Elimar archivo
                    if (model.Adjunto.nombre == "eliminar")
                    {
                        int id = Convert.ToInt32(model.AdjuntoId);
                        model.AdjuntoId = null;
                        await _entityRepo.Update(model);
                        await _adjuntoRepo.Delete(id);
                        return Ok();
                    }
                    ///Agregar archivo al editar
                    if (model.Adjunto.AdjuntoId == 0)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.AdjuntoId = key.AdjuntoId;
                        model.Adjunto.AdjuntoId = key.AdjuntoId;
                        await _entityRepo.Update(model);
                        return Ok(key);
                    }
                }
                //solución de ALAN replicada
                if (model.Adjunto != null)
                    model.AdjuntoId = model.Adjunto.AdjuntoId;
                await _entityRepo.Update(model);
                return Ok(model);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(PersonalProyecto Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(Obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
