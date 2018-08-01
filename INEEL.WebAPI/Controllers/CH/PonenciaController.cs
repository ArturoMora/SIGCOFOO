using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System.Web;

namespace INEEL.WebAPI.Controllers.CH
{
    public class PonenciaController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(PonenciaController));
        AutorIIEPonenciaRepository _ponenciaAutor;
        PonenciaRepository _repository;
        AdjuntoRepository _adjuntoRepo;

        public PonenciaController()
        {
            _ponenciaAutor = new AutorIIEPonenciaRepository();
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new PonenciaRepository();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> countByStatus(int id)
        {
            try
            {
                var cant = await _repository.countByStatus(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Route("api/Ponencia/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string clave)
        {
            try
            {
                List<Ponencia> Ponencia = new List<Ponencia>();
                var colaboracionPonencia = await _ponenciaAutor.GetAllColaboracion(clave);
                var aux = await _repository.GetByIdColaboracion_NuevoFlujo(colaboracionPonencia);
                foreach (var f in aux) { Ponencia.Add(f); }
                var result = await _repository.GetByClave(clave);
                foreach (var x in result)
                {
                    x.yearAux = int.Parse(x.year);
                    Ponencia.Add(x);
                }
                Ponencia.RemoveAll(item => item == null);


                foreach (var x in Ponencia)
                {
                    x.yearAux = int.Parse(x.year);

                }

                var resu = Ponencia.GroupBy(x => x.PonenciaId).Select(y => y.First()).OrderBy(x => x.yearAux);

                return Ok(resu);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetPonenciasForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.GetPonenciasForDetailsBusqueda(parametro);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Ponencia Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpDelete]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var sni = await _repository.GetById(Id);
                return Ok(sni);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByProyecto(string Id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var ent = await _repository.GetByProyecto(Id);
                return Ok(ent);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(Ponencia Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                
                //solución de ALAN replicada
                //if (Obj.Adjunto != null)
                //    Obj.AdjuntoId = Obj.Adjunto.AdjuntoId;
                await _repository.Update(Obj);
                ////Agregar a OC
                if (Obj.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "PonenciaCH",
                           Obj.TituloPonencia,
                           "IndexCH.html#/detallesponencia/" + Obj.PonenciaId,
                           Obj.PonenciaId + ""
                           ));
                }

                return Ok(Obj);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(Ponencia Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(Obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateEstadoActivo(Ponencia Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstadoActivo(Obj);
                return Ok("Registro actualizado correctamente!");
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
                var entities = await _repository.GetAll();
                return Ok(entities);
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

                var entities = await _repository.getData(ss);

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
