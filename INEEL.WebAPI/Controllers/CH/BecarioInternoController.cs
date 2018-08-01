using System;
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
    public class BecarioInternoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(BecarioInternoController));
        BecarioInternoRepository _repository;
        AdjuntoRepository _adjuntoRepo;

        PersonasRepository _personas;

        public BecarioInternoController()
        {
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new BecarioInternoRepository();
            _personas = new PersonasRepository();
        }

        [Route("api/BecarioInterno/GetByClave/{clave}")]
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
        public async Task<IHttpActionResult> Create(BecarioInterno BI)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.Create(BI);
                return Ok("Registro creado correctamente!");
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
        public async Task<IHttpActionResult> Update(BecarioInterno Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                // if (Obj.Adjunto != null)
                // {
                //     //Elimar archivo
                //     if (Obj.Adjunto.nombre == "eliminar")
                //     {
                //         int id = Convert.ToInt32(Obj.AdjuntoId);
                //         Obj.AdjuntoId = null;
                //         await _repository.Update(Obj);
                //         await _adjuntoRepo.Delete(id);
                //         return Ok();
                //     }
                //     ///Agregar archivo al editar
                //     if (Obj.Adjunto.AdjuntoId == 0)
                //     {
                //         Adjunto key = await _adjuntoRepo.CreateAd(Obj.Adjunto);
                //         Obj.AdjuntoId = key.AdjuntoId;
                //         Obj.Adjunto.AdjuntoId = key.AdjuntoId;
                //         await _repository.Update(Obj);
                //         return Ok(key);
                //     }
                // }
                //solución de ALAN replicada
                // if (Obj.Adjunto != null)
                //     Obj.AdjuntoId = Obj.Adjunto.AdjuntoId;
                await _repository.Update(Obj);
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
        public async Task<IHttpActionResult> UpdateEstado(BecarioInterno Obj)
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
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss)
        {
            try
            {
                var entities = await _repository.getData(ss);

                var result = new
                {
                    ss.draw,
                    ss.recordsFiltered,
                    ss.recordsTotal,
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
        public async Task<IHttpActionResult> ValidarDuplicados(BecarioInterno Obj)
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
