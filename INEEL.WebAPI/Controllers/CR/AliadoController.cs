using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Repositories.CR;

namespace INEEL.WebAPI.Controllers.CR
{
    public class AliadoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(AliadoController));
        // AYUDA:
        //AreaInvestigacionController.- Nombre de clase y tipicament constructor
        //AreaInvestigacionRepository.- La implementación CRUD del Modelo:AreaInvestigacion con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo AreaInvestigacionRepository
        // entities.-        resultado de tipo Task<IEnumerable<AreaInvestigacion>>
        // entity.-         resultado de tipo Task<AreaInvestigacion>
        // AreaInvestigacion.-         Modelo
        private AliadoRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public AliadoController()
        {
            _entityRepo = new AliadoRepository();
            // _productRepo = new ProductsRepositories();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countByStatus(Boolean id)
        {
            try
            {
                var cant = await _entityRepo.countByStatus(id);//id is estadoFlujo
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

        [HttpGet]
        public async Task<IHttpActionResult> GetAllConveniosHistoricos()
        {
            try
            {
                var entities = await _entityRepo.GetAllConveniosHistoricos();

                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllConveniosVigentes()
        {
            try
            {
                var entities = await _entityRepo.GetAllConveniosVigentes();

                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAllForModal()
        {
            try
            {
                var entities = await _entityRepo.GetAllForModal();
                return Ok(entities);
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
        [HttpGet]
        public async Task<IHttpActionResult> GetByIdFK(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetByIdFK(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetConvById(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetConvById(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetActByIdFK(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetActByIdFK(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> CountConveniosEmpresa(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.CountConveniosEmpresa(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetConvByIdFK(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetConvByIdFK(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetEmpresas()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _entityRepo.GetEmpresas();
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetTipoConvenios()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _entityRepo.GetTipoConvenios();
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaParametrizadaAliados(Convenio p)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await _entityRepo.GetConsultaParametrizadaAliados(p);
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
        public async Task<IHttpActionResult> Create([FromBody]Aliado model)
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
                if (e.Message.Substring(0, 44) == "An error occurred while updating the entries")
                {
                    return BadRequest("Ya existe un registro con ese nombre");
                }
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateConvenio(Aliado model)
        {


            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.CreateConvenio(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                //if (e.Message.Substring(0, 44) == "An error occurred while updating the entries")
                //{
                //    return BadRequest("Ya existe un registro con ese nombre");
                //}
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateActividad([FromBody]Aliado model)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.CreateActividad(model);
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
        public async Task<IHttpActionResult> ValidaAliado(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.ValidaAliado(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]Aliado model)
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
        public async Task<IHttpActionResult> UpdateConvenio(Convenio model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateConvenio(model);
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
        public async Task<IHttpActionResult> UpdateActividad(ActividadAdicional model)
        {


            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateActividad(model);
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
        public async Task<IHttpActionResult> UpdateActividadActualizados(ActividadAdicional model)
        {


            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateActividadActualizado(model);
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
        public async Task<IHttpActionResult> UpdateEstado([FromBody]Aliado model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(model);
                return Ok();
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

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteConvenioFromAliados(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.DeleteConvenioFromAliados(Id);
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
        public async Task<IHttpActionResult> DeleteActividadFromAliados(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.DeleteActividadFromAliados(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}
