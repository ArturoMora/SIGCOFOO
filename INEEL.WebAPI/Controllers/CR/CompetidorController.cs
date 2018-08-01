using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class CompetidorController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(CompetidorController));

        private CompetidorRepository _entityRepo;

        public CompetidorController()
        {
            _entityRepo = new CompetidorRepository();

        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countByStatus(Boolean id)
        {
            try
            {
                var cant = await _entityRepo.countByStatus(id);
                return Ok(cant);
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
                var entities = await _entityRepo.GetAll();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaParametrizadaCompetidores(Competidor p)
        {
            try
            {
                var entities = await _entityRepo.GetConsultaParametrizadaCompetidores(p);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetServiciosCompetidores()
        {
            try
            {
                var entities = await _entityRepo.GetServiciosCompetidores();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProductosCompetidores()
        {
            try
            {
                var entities = await _entityRepo.GetProductosCompetidores();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetSegmentosCompetidores()
        {
            try
            {
                var entities = await _entityRepo.GetSegmentosCompetidores();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetEmpresasCompetidoras()
        {
            try
            {
                var entities = await _entityRepo.GetEmpresasCompetidoras();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetCompetidoresActivos()
        {
            try
            {
                var entities = await _entityRepo.GetCompetidoresActivos();
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetCompetidoresGraph()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var competidoresLinea = await _entityRepo.GetCompetidorGroupByLineaInvHot();
                return Ok(competidoresLinea);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



        [HttpGet]
        public async Task<IHttpActionResult> Get(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
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
        [Authorize]
        public async Task<IHttpActionResult> Create([FromBody]Competidor model)
        {
            if (!ModelState.IsValid)
            {
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
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> ValidaCompetidor(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.ValidaCompetidor(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        //[AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> ValidaProductoCompetidor(Competidor model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _entityRepo.ValidaProductoCompetidor(model);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        //[AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> ValidaServicioCompetidor(Competidor model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _entityRepo.ValidaServicioCompetidor(model);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }





        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateInsertaProducto(ProductoPorCompetidor model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                var result = await _entityRepo.InsertaProductoUpdate(model);
                return Ok(result);



            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                if (e.Message.Substring(0, 44) == "An error occurred while updating the entries")
                {
                    return BadRequest("Ya existe un registro con ese nombre");
                }
                return InternalServerError(e);
            }
        }


        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateInsertaServicio(ServicioPorCompetidor model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                var result = await _entityRepo.InsertaServicioUpdate(model);
                return Ok(result);



            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                if (e.Message.Substring(0, 44) == "An error occurred while updating the entries")
                {
                    return BadRequest("Ya existe un registro con ese nombre");
                }
                return InternalServerError(e);
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]Competidor model)
        {
            if (!ModelState.IsValid)
            {
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

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado([FromBody]Competidor model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(model);
                return Ok("Estado acualizado correctamente.");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteCompetidor(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.DeleteCompetidor(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> verificaGerenteComercializacion (string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result= await _entityRepo.verificaGerenteComercializacion(id);
                return Ok(result);

            }catch(Exception e){
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
