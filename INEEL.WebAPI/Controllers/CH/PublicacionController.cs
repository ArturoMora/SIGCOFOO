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
using Newtonsoft.Json;

namespace INEEL.WebAPI.Controllers.CH
{
    public class PublicacionController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(PublicacionController));
        PublicacionRepository _repository;
        AutorIIEPublicacionRepository _publicacionAutor;
        AdjuntoRepository _adjuntoRepo;

        public PublicacionController()
        {
            _publicacionAutor = new AutorIIEPublicacionRepository();
            _adjuntoRepo = new AdjuntoRepository();
            _repository = new PublicacionRepository();
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
        [Route("api/Publicacion/GetByClave/{clave}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetByClave(string clave)
        {
            try
            {
                List<Publicacion> Publicacion = new List<Publicacion>();
                var colaboracionPublicacion = await _publicacionAutor.GetAllColaboracion(clave);
                var aux = await _repository.GetByIdColaboracion_NuevoFlujo(colaboracionPublicacion);
                foreach (var f in aux)
                {
                    if (f != null)
                    {
                        if (f.EstadoFlujoId == 2)
                        {
                            f.EstadoFlujo.Descripcion += " Admin CH";
                        }
                    }
                    Publicacion.Add(f);
                }
                var result = await _repository.GetByClave(clave);
                foreach (var x in result)
                {
                    if (x.EstadoFlujoId == 2)
                    {
                        x.EstadoFlujo.Descripcion += " Admin CH";
                    }
                    Publicacion.Add(x);
                }
                Publicacion.RemoveAll(item => item == null);
                var resu = Publicacion.GroupBy(x => x.PublicacionId).Select(y => y.First());
                return Ok(resu);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create(Publicacion Obj)
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

        [HttpPost]
        public async Task<IHttpActionResult> GetPublicacionesForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.GetPublicacionesForDetailsBusqueda(parametro);
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

        [HttpGet]
        public async Task<IHttpActionResult> GetByPublicacionesByProyecto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entity = await _repository.GetByPublicacionesByProyecto(id);
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
        public async Task<IHttpActionResult> Update(Publicacion Obj)
        {


            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));



                // if (Obj.Adjunto != null)
                //     Obj.AdjuntoId = Obj.Adjunto.AdjuntoId;

                await _repository.Update(Obj);


                ////Agregar a OC
                if (Obj.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "ArtículoCH",
                           Obj.TituloPublicacion,
                           "IndexCH.html#/detallespublicacion/" + Obj.PublicacionId,
                           Obj.PublicacionId + ""
                           ));
                }
                //if (Obj.EstadoFlujoId == 3)
                //{
                //    await new NuevoOCRepository().Create(
                //    new NuevoOC("MT",
                //               "ArtículoCH",
                //    Obj.TituloPublicacion,
                //    "indexMT.html#/PublicacionDetails/" + Obj.PublicacionId
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
        public async Task<IHttpActionResult> UpdateEstado(Publicacion Obj)
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
        public async Task<IHttpActionResult> UpdateEstadoActivo(Publicacion Obj)
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

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(Publicacion model)
        {
            try
            {
                var result= await  _repository.ValidarDuplicados(model);
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
