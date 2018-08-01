using INEEL.DataAccess.GEN;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;

namespace INEEL.WebAPI.Controllers.CH
{
    public class CursoInternoController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(CursoInternoController));
        CursoInternoRepository _repository;
        AutorInternoCursoInternoRepository _AutoresInt;
        AdjuntoRepository _adjuntoRepo;

        public CursoInternoController()
        {
            _AutoresInt = new AutorInternoCursoInternoRepository();
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new CursoInternoRepository();
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

        [HttpPost]
        public async Task<IHttpActionResult> GetCursosForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                var registros = await _repository.GetCursosForDetailsBusqueda(parametro);//id is estadoFlujo
                return Ok(registros);
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

        [Route("api/CursoInterno/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string clave)
        {
            try
            {
                List<CursoInterno> Obj = new List<CursoInterno>();
                var colaboracion = await _AutoresInt.GetAllColaboracion(clave);
                var aux = await _repository.GetByIdColaboracion(colaboracion);
                foreach (var f in aux) { Obj.Add(f); }
                var result = await _repository.GetByClave(clave);
                foreach (var x in result)
                {
                    Obj.Add(x);
                }
                Obj.RemoveAll(item => item == null);
                var resu = Obj.GroupBy(x => x.CursoInternoId).Select(y => y.First());
                return Ok(resu);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Route("api/CursoInterno/GetByClaveAutorWithCoAutores/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveAutorWithCoAutores(string clave)
        {
            try
            {
                var result= await _repository.GetByClaveAutorWithCoAutores(clave);
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
        public async Task<IHttpActionResult> Create(CursoInterno Obj)
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

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update(CursoInterno Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //if (Obj.Adjunto != null)
                //{
                //    //Elimar archivo
                //    if (Obj.Adjunto.nombre == "eliminar")
                //    {
                //        int id = Convert.ToInt32(Obj.AdjuntoId);
                //        Obj.AdjuntoId = null;
                //        await _repository.Update(Obj);
                //        await _adjuntoRepo.Delete(id);
                //        return Ok();
                //    }
                //    ///Agregar archivo al editar
                //    if (Obj.Adjunto.AdjuntoId == 0)
                //    {
                //        Adjunto key = await _adjuntoRepo.CreateAd(Obj.Adjunto);
                //        Obj.AdjuntoId = key.AdjuntoId;
                //        Obj.Adjunto.AdjuntoId = key.AdjuntoId;
                //        await _repository.Update(Obj);
                //        return Ok(key);
                //    }
                //}
                await _repository.Update(Obj);

                ////Agregar a OC
                //OC Compartido
                if (Obj.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "CursoCH",
                           Obj.Titulo,
                            "indexMT.html#/BuscarCursosDetails/" + Obj.CursoInternoId,
                           Obj.CursoInternoId + ""
                           ));
                }
                //if (Obj.EstadoFlujoId == 3)
                //{
                //    await new NuevoOCRepository().Create(
                //    new NuevoOC("MT",
                //               "CursoCH",
                //    Obj.Titulo,
                //    "indexMT.html#/BuscarCursosDetails/" + Obj.CursoInternoId
                //        ));
                //}
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
        public async Task<IHttpActionResult> UpdateEstado(CursoInterno Obj)
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

        [HttpGet]
        public async Task<IHttpActionResult> GetTitulo(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var objetos = await _repository.GetTitulo(id);
                return Ok(objetos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProy(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var objetos = await _repository.GetProy(id);
                return Ok(objetos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetFecIni(Fechas id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var objetos = await _repository.GetFecIni(id.Fecha);
                return Ok(objetos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetTipo(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var objetos = await _repository.GetTipo(id);
                return Ok(objetos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //[HttpGet]
        //public async Task<IHttpActionResult> GetById(int id)
        //{
        //    try
        //    {
        //        var TipoBeca = await _repository.GetById(id);
        //        return Ok(TipoBeca);
        //    }
        //    catch (Exception e)
        //    {

        //        return InternalServerError(e);
        //    }
        //}

    }

}
