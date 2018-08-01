using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Repositories.PI;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.WebAPI.Controllers.PI
{
    public class DAExternoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(DAExternoController));
        DAExternoRepository _repository;
        AdjuntoRepository _adjuntoRepo;
        AutoresIntDARepository _autoresDAExterno;
        /////////////////////////////////////
        SolicitudParticiantesDARepository _SolicitudParticiantesDARepository;
        SolicitudesDARepository _SolicitudesDARepository;
        public DAExternoController()
        {
            _autoresDAExterno = new AutoresIntDARepository();
            _repository = new DAExternoRepository();
            _adjuntoRepo = new AdjuntoRepository();
            _SolicitudesDARepository = new SolicitudesDARepository();
            _SolicitudParticiantesDARepository = new SolicitudParticiantesDARepository();
        }

        [Route("api/DAExterno/GetByClave/{clave}")]
        [HttpGet]public async Task<IHttpActionResult> GetByClave(string clave){ try {
                List<DAExterno> DAExterno = new List<DAExterno>();
                var colaboracionDAExterno = await _autoresDAExterno.GetAllColaboracion(clave);
                var aux = await _repository.GetByIdColaboracion(colaboracionDAExterno);
                foreach (var f in aux) { DAExterno.Add(f); }
                var result = await _repository.GetByClave(clave);
                foreach (var x in result)
                {
                    DAExterno.Add(x);
                }
                //ObtenerPatrimoniales
                var solicitudes = await _SolicitudesDARepository.GetByClave(clave);
                var solicitudesParticipacion = await _SolicitudParticiantesDARepository.GetByClave(clave);
                List<SolicitudesDA> SolicitudesDA = new List<SolicitudesDA>();
                foreach (var item in solicitudes){SolicitudesDA.Add(item); }
                foreach (var item in solicitudesParticipacion){var solicitud =await _SolicitudesDARepository.GetById(item.SolicitudesDAId);SolicitudesDA.Add(solicitud);}
                var resultadosDA = SolicitudesDA.GroupBy(x => x.SolicitudesDAId).Select(y=>y.First());
                DAExterno.RemoveAll(item => item == null);
                var resu = DAExterno.GroupBy(x => x.DAExternoId).Select(y => y.First());
                List<DAExterno> DAExterno2 = new List<DAExterno>();
                foreach (var item in resu){DAExterno2.Add(item);}
                foreach (var item in resultadosDA)
                {
                    DAExterno Obj = new DAExterno();
                    Obj.DAExternoId =item.SolicitudesDAId;
                    Obj.Titulo = item.TituloObra;
                    Obj.RamaDAId = item.RamaDAId;
                    Obj.RamaDA = item.RamaDA;
                    Obj.FechaValidacion = item.Fecha;
                    Obj.Sintesis = "Patrimonio";
                    DAExterno2.Add(Obj);
                }
                /////////
                

                return Ok(DAExterno2);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(DAExterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result =await _repository.Create(Obj);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(int id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                await _repository.Delete(id);
                return Ok("Registro eliminado correctamente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                throw new Exception(e.Message, e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetById(int Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var sni = await _repository.GetById(Id);
                return Ok(sni);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update(DAExterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
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
                                      "DA",
                           Obj.Titulo,
                           "IndexCH.html#/detallesdaexterno/" + Obj.DAExternoId + "/",
                           Obj.DAExternoId + ""
                           ));
                }
                return Ok(Obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(DAExterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _repository.UpdateEstado(Obj);
                return Ok("Registro actualizado correctamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
    }
}
