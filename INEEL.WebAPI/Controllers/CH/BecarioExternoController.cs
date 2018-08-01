using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories;

namespace INEEL.WebAPI.Controllers.CH
{
    public class BecarioExternoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BecarioExternoController));
        BecarioExternoRepository _BecarioExternoRepo;

        public BecarioExternoController()
        {
            _BecarioExternoRepo = new BecarioExternoRepository();
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> counInternoANDexternoByStatus(int id)
        {
            try {
                var cant = await _BecarioExternoRepo.counInternoANDExternoByStatus(id);//id is estadoFlujo

                return Ok(cant);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Obtener todos los ambitos
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var BecarioExterno = await _BecarioExternoRepo.GetAll();
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }

        }

        //Obtener un ambito por id
        [HttpGet]public async Task<IHttpActionResult> GetById(int id){ try {
                var BecarioExterno = await _BecarioExternoRepo.GetById(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveBecario(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var BecarioExterno = await _BecarioExternoRepo.GetByClaveBecario(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByClaveAsesor(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var BecarioExterno = await _BecarioExternoRepo.GetByClaveAsesor(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }



        //Crear BecarioExterno

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(BecarioExterno BecarioExterno)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _BecarioExternoRepo.Create(BecarioExterno);
                return Ok("Registro creado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar BecarioExterno
        
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(BecarioExterno BecarioExterno)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _BecarioExternoRepo.Update(BecarioExterno);
                if (BecarioExterno.EstadoFlujoId == 3)
                {
                    //await new NuevoOCRepository().Create(
                    //new NuevoOC("MT",
                    //           "IBE",
                    //BecarioExterno.Titulo,
                    //"indexMT.html#/InformeBecariooDetails/" + BecarioExterno.BecarioExternoId
                    //    ));
                    ////Agregar a OC
                    await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "BecarioExterno",
                           BecarioExterno.Titulo.Length <= 0 ? "Sin descripción" : BecarioExterno.Titulo,
                           "IndexCH.html#/BecarioExternoDetails/" + BecarioExterno.BecarioExternoId + "/",
                           BecarioExterno.BecarioExternoId + ""
                           ));

                }
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Actualizar Estado
        
        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(BecarioExterno BecarioExterno)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _BecarioExternoRepo.UpdateEstado(BecarioExterno);
                return Ok("Registro actualizado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //Eliminar BecarioExterno
        
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _BecarioExternoRepo.Delete(id);
                return Ok("Registro eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        //eliminar  DeleteAdjuntoBecarioExterno
        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> DeleteAdjuntoBecarioExterno(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _BecarioExternoRepo.DeleteAdjuntoBecarioExterno(id);
                return Ok("Adjunto de becario externo eliminado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> GetByTitulo(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var BecarioExterno = await _BecarioExternoRepo.GetByTitulo(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByInstitucion(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var BecarioExterno = await _BecarioExternoRepo.GetByInstitucion(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetByProyecto(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var BecarioExterno = await _BecarioExternoRepo.GetByProyecto(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        //[HttpPost]
        //public async Task<IHttpActionResult> GetByFecIni(Fechas id)
        //{
        //    try
        //    {
        //        var objetos = await _BecarioExternoRepo.GetByFecIni(id.Fecha);
        //        return Ok(objetos);
        //    }
        //    catch (Exception e)
        //    {

        //        return InternalServerError(e);
        //    }
        //}

        //[HttpPost]
        //public async Task<IHttpActionResult> GetByFecTer(Fechas id)
        //{
        //    try
        //    {
        //        var objetos = await _BecarioExternoRepo.GetByFecTer(id.Fecha);
        //        return Ok(objetos);
        //    }
        //    catch (Exception e)
        //    {

        //        return InternalServerError(e);
        //    }
        //}

        [HttpGet]
        public async Task<IHttpActionResult> GetByTipo(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var BecarioExterno = await _BecarioExternoRepo.GetByTipo(id);
                return Ok(BecarioExterno);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost] public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss){try {
                var draw2 = HttpContext.Current.Request.Form["search[value]"];

                //DataServerSide ss = new DataServerSide(HttpContext.Current.Request, parameters);

                var entities =  await _BecarioExternoRepo.getData(ss);

                var result = new
                {
                    draw = ss.draw,
                    recordsFiltered = ss.recordsFiltered,
                    recordsTotal = ss.recordsTotal,
                    data = entities
                };

                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetExistente(BecarioExterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _BecarioExternoRepo.GetExistente(Obj);
                return Ok(exis);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ValidarDuplicados(BecarioExterno Obj)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var exis = await _BecarioExternoRepo.ValidarDuplicados(Obj);
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
