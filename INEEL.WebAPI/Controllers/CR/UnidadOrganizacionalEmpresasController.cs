using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class UnidadOrganizacionalEmpresasController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(UnidadOrganizacionalEmpresasController));
        UnidadOrganizacionalEmpresasRepository _repository;

        public UnidadOrganizacionalEmpresasController()
        {
            _repository = new UnidadOrganizacionalEmpresasRepository();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                var campo = await _repository.GetAll();
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetInformacionUnidadEmpresa(string id)
        {
            try
            {
                var campo = await _repository.GetInformacionUnidadEmpresa(id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> GetInformacionNodoEmpresa(UnidadOrganizacionalEmpresas id)
        {
            try
            {
                var campo = await _repository.GetInformacionUnidadEmpresa(id.ClaveUnidad);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> ActualizaArbol(UnidadOrganizacionalEmpresas id)
        {
            try
            {
                await _repository.ActualizaArbol(id);
                //if (id.ContactoId != null)
                //{
                //    await _repository.ActualizaUnidadContacto(Convert.ToInt32(id.ContactoId), id.ClaveUnidad);
                //}
                return Ok("Informacion actualizada");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //[Route("api/UnidadOrganizacionalEmpresas/ContactosPorNodo/{id}/{clave}")]
        [HttpGet]
        public async Task<IHttpActionResult> ContactosPorNodo(string id)
        {
            try
            {
                var contactos= await _repository.ContactosPorNodo(id);
                return Ok(contactos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetAllnodes(UnidadOrganizacionalEmpresas uo)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetAllnodes(uo);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.GetById(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> Validador(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.Validador(Id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ValidadorClaves(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                var campo = await _repository.ValidadorClaves(model);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(UnidadOrganizacionalEmpresas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(obj);
                return Ok("Unidad organizacional creada correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CrearArbolUnidadOrganizacional(UnidadOrganizacionalEmpresas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //Crea los nodos de la estructura organizacional
                await _repository.CrearArbolUnidadOrganizacional(obj);
                return Ok("Unidad organizacional creada correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(UnidadOrganizacionalEmpresas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Update(obj);
                return Ok("Unidad organizacional actualizada correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                int count = _repository.ValidaUnidad(Id);

                if (count >= 1)
                {
                    throw new Exception("No se puede eliminar la unidad, se tiene asignada a un contacto");
                }
                else
                {
                    await _repository.Delete(Id);
                    return Ok("Unidad organizacional eliminada correctamente!");
                }
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> DeleteUnidad(UnidadOrganizacionalEmpresas model)
        {
            try
            {
                //log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var message = await _repository.VerificaAccionEliminarUnidad(model.ClaveUnidad);

                if (!String.IsNullOrEmpty(message))
                {
                    throw new Exception(message);
                }
                else
                {
                    await _repository.Delete(model.ClaveUnidad);
                    return Ok("Unidad organizacional eliminada correctamente!");
                }
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(UnidadOrganizacionalEmpresas obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}