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
    public class PIExternoController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(PIExternoController));
        RequisicionesPIRepository _requisicionesREpo;
        PIExternoRepository _repository;
        AdjuntoRepository _adjuntoRepo;
        AutoresIndustrialIntRepository _autoresPIExterno;
        AutoresIntPIPatrimonioRepository _autoresPatri;

        public PIExternoController()
        {
            _autoresPIExterno = new AutoresIndustrialIntRepository();
            _repository = new PIExternoRepository();
            _adjuntoRepo = new AdjuntoRepository();
            _requisicionesREpo = new RequisicionesPIRepository();
            _autoresPatri = new AutoresIntPIPatrimonioRepository();
        }

        [Route("api/PIExterno/GetByClave/{clave}")]
        [HttpGet]public async Task<IHttpActionResult> GetByClave(string clave){ try {
                List<PIExterno> PIExterno = new List<PIExterno>();
                var colaboracionPIExterno = await _autoresPIExterno.GetAllColaboracion(clave);
                var aux = await _repository.GetByIdColaboracion(colaboracionPIExterno);
                foreach (var f in aux) { PIExterno.Add(f); }
                var result = await _repository.GetByClave(clave);
                foreach (var x in result)
                {
                    PIExterno.Add(x);
                }
                ///////////////////////////////
                var resultclave = await _requisicionesREpo.GetByClave(clave);
                var resultautores = await _autoresPatri.GetByColaboracionRequisicion(clave);
                List<RequisicionesPI> RequisicionesPI = new List<RequisicionesPI>();
                foreach (var item in resultclave){RequisicionesPI.Add(item);}
                foreach (var item in resultautores){var solicitud = await _requisicionesREpo.GetById(item.RequisicionesPIId);RequisicionesPI.Add(solicitud);}
                var resultadosPI = RequisicionesPI.GroupBy(x => x.RequisicionesPIId).Select(y => y.First());
                PIExterno.RemoveAll(item => item == null);
                var resu = PIExterno.GroupBy(x => x.PIExternoId).Select(y => y.First());
                List<PIExterno> PIExterno2 = new List<PIExterno>();
                foreach (var item in resu){PIExterno2.Add(item);}
                foreach (var item in resultadosPI)
                {
                    PIExterno Obj = new PIExterno();
                    Obj.PIExternoId = item.RequisicionesPIId;
                    Obj.FechaValidacion = item.FechaSolicitud;
                    Obj.Titulo = item.Titulo;
                    Obj.TipoPIId = item.TipoPIId;
                    Obj.TipoPI = item.TipoPI;
                    Obj.NumSolicitudTitulo = "Patrimonial";
                    Obj.EstadoFlujoId = 3;
                    PIExterno2.Add(Obj);
                }
                ///////////////////////////////
                

                return Ok(PIExterno2);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create(PIExterno Obj)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.Create(Obj);
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
        public async Task<IHttpActionResult> Update(PIExterno Obj)
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
                                      "PI",
                           Obj.Titulo,
                           "IndexCH.html#/detallespiexterno/" + Obj.PIExternoId + "/",
                           Obj.PIExternoId + ""
                           ));
                }

                return Ok(Obj);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> UpdateEstado(PIExterno Obj)
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
