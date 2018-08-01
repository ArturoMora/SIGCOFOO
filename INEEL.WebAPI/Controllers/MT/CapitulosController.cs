/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Web;
using System.Collections.Generic;
using System.Linq;

namespace INEEL.WebAPI.Controllers.MT.ITF
{
    public class CapitulosController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(CapitulosController));
        // AYUDA:
        //CapitulosRepositoryController.- Nombre de clase y tipicament constructor
        //CapitulosRepository.- La implementación CRUD del Modelo:Capitulos con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo CapitulosRepository
        // entities.-        resultado de tipo Task<IEnumerable<Capitulos>>
        // entity.-         resultado de tipo Task<Capitulos>
        // Capitulos.-         Modelo
        private CapitulosRepository _entityRepo;
        //private ProductsRepositories _productRepo;
        public CapitulosController()
        {
            _entityRepo = new CapitulosRepository();
            // _productRepo = new ProductsRepositories();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countByStatus(int id)
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
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetById(Id);
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
        public async Task<IHttpActionResult> Create(Capitulos model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _entityRepo.Create(model);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]Capitulos model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Update(model);
                return Ok(model);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Capitulos model)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.UpdateEstado(model);
                return Ok("Registro actualizado exitosamente!");
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
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string id)
        {
            try
            { //replica de estrategia de Alan : a discutir
                var clave = id;
                List<Capitulos> Capitulos = new List<Capitulos>();
                var colaboracionCapitulos = await _entityRepo.GetAllColaboracion(clave);
                var aux = await _entityRepo.GetByIdColaboracion(colaboracionCapitulos);
                foreach (var f in aux) { Capitulos.Add(f); }
                var result = await _entityRepo.GetByClave(clave);
                foreach (var x in result)
                {
                    Capitulos.Add(x);
                }
                Capitulos.RemoveAll(item => item == null);
                var resu = Capitulos.GroupBy(x => x.CapitulosId).Select(y => y.First());

                return Ok(resu);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveAutor(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetByClaveAutor(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveAutorWithCoAutores(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.GetByClaveAutorWithCoAutores(Id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss)
        {
            try
            {
                var draw2 = HttpContext.Current.Request.Form["search[value]"];

                //DataServerSide ss = new DataServerSide(HttpContext.Current.Request, parameters);

                var entities = await _entityRepo.getData(ss);

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };

                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


    }
}
