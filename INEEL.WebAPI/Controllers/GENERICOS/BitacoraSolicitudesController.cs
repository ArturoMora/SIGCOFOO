using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Repositories.CH;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class BitacoraSolicitudesController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(BitacoraSolicitudesController));
        SolicitudRepository _solicitudesRepo;
        BitacoraSolicitudesRepository _repository;
        PersonasRepository _PersonasRepository;

        public BitacoraSolicitudesController()
        {
            _solicitudesRepo = new SolicitudRepository();
            _repository = new BitacoraSolicitudesRepository();
            _PersonasRepository = new PersonasRepository();
        }


        [Route("api/BitacoraSolicitudes/GetById/{id}/{id2}")]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetById(int id, string id2)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var solicitudes = await _solicitudesRepo.GetByInfo(id,id2);
                List<BitacoraSolicitudes> Bita = new List<BitacoraSolicitudes>();
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
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        //service.AddBitacoraSolicitud = function(Registro)
        //{
        //    var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
        //    return $http.post(endPoint, Registro);
        //}

        //service.GetBitacoraSolicitudById = function(id)
        //{
        //    var endPoint = API + "BitacoraSolicitudes/GetById/" + id;
        //    return $http.get(endPoint);
        //}

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]BitacoraSolicitudes Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
