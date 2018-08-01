using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System.Linq;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class UnidadOrganizacionalController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(UnidadOrganizacionalController));
        PersonasRepository _personasrepository;
        UORepository _repository;

        public UnidadOrganizacionalController()
        {
            _personasrepository = new PersonasRepository();
            _repository = new UORepository();
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetUnidadesSelectByNameLyke(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var nameLike = id;
                var likes = await _repository.GetUnidadesSelectByNameLyke(nameLike); //No incluye Dirección o unidad cuspide (donde padre==null)
                return Ok(likes);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
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
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllByCollectionCR(List<String> unidadesId)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetAllByCollectionCR(unidadesId);
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
        public async Task<IHttpActionResult> GetAllnodes()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetAllnodes(null);
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
        public async Task<IHttpActionResult> GetAllnodes(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var campo = await _repository.GetAllnodes(id);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetAllnodes(UnidadOrganizacional unidad)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetAllnodesPorFecha(unidad.ClaveUnidad, unidad.FechaEfectiva);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Route("api/UnidadOrganizacional/GetAllNodesId/{id}/{year}")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetAllNodesId(String id, int year)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var fecha = new DateTime(year, 1, 1);
                var campo = await _repository.GetAllnodesFechaEfectiva(id, fecha);
                return Ok(campo);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetAllnodesFechaEfectiva(UnidadOrganizacional unidad)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var campo = await _repository.GetAllnodesPorFechaEfectiva(unidad.FechaEfectiva);
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
        public async Task<IHttpActionResult> GetPadreUnidad(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.GetByIdWithFather(Id);
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
        public async Task<IHttpActionResult> GetNameById(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var campo = await _repository.GetNameById(Id);
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
        public async Task<IHttpActionResult> Create(UnidadOrganizacional obj)
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

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(UnidadOrganizacional obj)
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
                await _repository.Delete(Id);
                return Ok("Unidad organizacional eliminada correctamente!");

            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }


        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(UnidadOrganizacional obj)
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

        [HttpGet]
        public async Task<IHttpActionResult> GetAllDivicion(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                List<Personas> Personas = new List<Personas>();

                var result = await _repository.GetAllDivicion(id);
                //Obtener divicion
                var DivicionPersonas = await _personasrepository.GetUsersByClaveUnidad(result.ClaveUnidad);
                foreach (var item in DivicionPersonas)
                {
                    Personas.Add(item);
                }
                //Obtener Gerencias
                var gerencias = await _repository.getGerenciasforDivicion(result.ClaveUnidad);
                foreach (var item in gerencias)
                {
                    var gerenciasPersonas = await _personasrepository.GetUsersByClaveUnidad(item.ClaveUnidad);
                    foreach (var item2 in gerenciasPersonas)
                    {
                        Personas.Add(item2);
                    }
                }
                Personas = Personas
                    .GroupBy(x => x.ClavePersona)
                    .Select(x => x.FirstOrDefault())
                    .ToList();
                return Ok(Personas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}