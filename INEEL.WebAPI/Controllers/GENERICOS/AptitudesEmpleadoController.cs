/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.WebAPI.Utilidades.Data;
using log4net;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class AptitudesEmpleadoController : ApiController
    {

        private static readonly ILog log = LogManager.GetLogger(typeof(AptitudesEmpleadoController));
        private AptitudesEmpleadoRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public AptitudesEmpleadoController()
        {
            _entityRepo = new AptitudesEmpleadoRepository();
            // _productRepo = new ProductsRepositories();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado(String id, String clave)
        {
            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAllByEmpleado(id, clave);
                return Ok(entities);
            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByEmpleado(String id)
        {
            try
            {
                var entities = await _entityRepo.GetAllByEmpleado(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> CreateAptitudesModel([FromBody]AptitudesModel model)
        {
            if (!ModelState.IsValid)
            {

                log.Warn(new MDCSet(this.ControllerContext.RouteData), new Exception("!ModelState.IsValid")); 
                return BadRequest(ModelState);
            }

            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _entityRepo.CreateValid(model);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]AptitudesEmpleado model)
        {
            if (!ModelState.IsValid)
            {
                log.Warn(new MDCSet(this.ControllerContext.RouteData), new Exception("!ModelState.IsValid"));
                return BadRequest(ModelState);
            }

            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]AptitudesEmpleado model)
        {
            if (!ModelState.IsValid)
            {

                log.Warn(new MDCSet(this.ControllerContext.RouteData), new Exception("!ModelState.IsValid"));
                return BadRequest(ModelState);
            }

            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {

                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteAptitudesModel([FromBody]System.Collections.Generic.List<long> listaids)
        {
            if (!ModelState.IsValid)
            {
                log.Warn(new MDCSet(this.ControllerContext.RouteData), new Exception("!ModelState.IsValid"));
                return BadRequest(ModelState);
            }

            try
            {

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.DeleteFromList(listaids);
                return Ok("Aptitudes actualizadas exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
