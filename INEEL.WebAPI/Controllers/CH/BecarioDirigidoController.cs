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
using INEEL.WebAPI.Utilidades;

namespace INEEL.WebAPI.Controllers.CH
{
    public class BecarioDirigidoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(BecarioDirigidoController));
        BecarioDirigidoRepository _repository;
        AdjuntoRepository _adjuntoRepo;
        public BecarioDirigidoController()
        {
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new BecarioDirigidoRepository();
        }
        [Route("api/BecarioDirigido/GetByClaveEmpEstadoFlujo/{clave}/{yearsBack}/{estados}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveEmpEstadoFlujo(string clave, int yearsBack, String estados)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                EstadosToInt param = new EstadosToInt(estados, yearsBack);
                var sni = await _repository.GetByClaveEmpEstadoFlujo(clave, param.Fecha, param.ListEstados);
                return Ok(sni);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Route("api/BecarioDirigido/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string clave)
        {
            try
            {
                var result = await _repository.GetByClave(clave);
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
        public async Task<IHttpActionResult> Create(BecarioDirigido Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(Obj);
                return Ok("Registro creado correctamente!");
                //return Ok("Registro creado correctamente!");
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

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(BecarioDirigido Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (Obj.Adjunto != null)
                {
                    //Elimar archivo
                    if (Obj.Adjunto.nombre == "eliminar")
                    {
                        int id = Convert.ToInt32(Obj.AdjuntoId);
                        Obj.AdjuntoId = null;
                        await _repository.Update(Obj);
                        await _adjuntoRepo.Delete(id);
                        return Ok();
                    }
                    ///Agregar archivo al editar
                    if (Obj.Adjunto.AdjuntoId == 0)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(Obj.Adjunto);
                        Obj.AdjuntoId = key.AdjuntoId;
                        Obj.Adjunto.AdjuntoId = key.AdjuntoId;
                        await _repository.Update(Obj);
                        return Ok(key);
                    }
                }
                //solución de ALAN replicada
                if (Obj.Adjunto != null)
                    Obj.AdjuntoId = Obj.Adjunto.AdjuntoId;
                await _repository.Update(Obj);

                ////Agregar a OC
                if (Obj.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "BecarioDirigido",
                           Obj.NombreEstancia,
                           "IndexCH.html#/detallesbecariodirigido/" + Obj.BecarioDirigidoId + "/",
                           Obj.BecarioDirigidoId + ""
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
        public async Task<IHttpActionResult> UpdateEstado(BecarioDirigido Obj)
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


        [HttpPost]
        public async Task<IHttpActionResult> GetExistente(BecarioDirigido Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _repository.GetExistente(Obj);
                return Ok(exis);
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

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(BecarioDirigido Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _repository.ValidarDuplicados(Obj);
                return Ok(exis);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
