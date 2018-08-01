using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using INEEL.DataAccess.GEN.Models.GI;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.WebAPI.Utilidades.Data;
using log4net;

namespace INEEL.WebAPI.Controllers.GI
{
    public class BitacoraSolicitudesGIController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(BitacoraSolicitudesGIController));

        BitacoraSolicitudesGIRepository _repository;
        SolicitudGIRepository _solicitudesRepo;
        PersonasRepository _PersonasRepository;

        public BitacoraSolicitudesGIController()
        {
            _repository = new BitacoraSolicitudesGIRepository();
            _solicitudesRepo = new SolicitudGIRepository();
            _PersonasRepository = new PersonasRepository();
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create([FromBody]BitacoraSolicitudesGI Obj)
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


        [Route("api/BitacoraSolicitudesGI/GetById/{id}/{id2}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id, string id2)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var solicitudes = await _solicitudesRepo.GetByInfo(id, id2);
                List<BitacoraSolicitudesGI> Bita = new List<BitacoraSolicitudesGI>();
                foreach (var item in solicitudes)
                {
                    var result = await _repository.GetById(item.SolicitudId);
                    foreach (var item2 in result)
                    {
                        Bita.Add(item2);
                    }
                }


                foreach (var obj in Bita)
                {
                    var p = await _PersonasRepository.GetByClave(obj.ClavePersona);
                    obj.NombreCompleto = p.NombreCompleto;
                }

                return Ok(Bita);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Route("api/BitacoraSolicitudesGI/getbyidAprobadaAntes/{id}/{id2}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getbyidAprobadaAntes(int id, string id2)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var solicitudes = await _solicitudesRepo.GetByInfo(id, id2);
                List<BitacoraSolicitudesGI> Bita = new List<BitacoraSolicitudesGI>();
                foreach (var item in solicitudes)
                {
                    var result = await _repository.GetByIdAprobadoAntes(item.SolicitudId);
                    foreach (var item2 in result)
                    {
                        Bita.Add(item2);
                    }
                }


                foreach (var obj in Bita)
                {
                    var p = await _PersonasRepository.GetByClave(obj.ClavePersona);
                    obj.NombreCompleto = p.NombreCompleto;
                }

                return Ok(Bita);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [Route("api/BitacoraSolicitudesGI/GetEstadoAprobadaByInfo/{id}/{id2}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetEstadoAprobadaByInfo(int id, string id2)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var estado = await _solicitudesRepo.GetEstadoAprobadaByInfo(id, id2);
                return Ok(estado);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> GetJustificacionSolicitud(BitacoraSolicitudesGI id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var estado = await _repository.GetJustificacionSolicitud(id);
                return Ok(estado);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }



    }
}
