using System;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Repositories.CR;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.WebAPI.Controllers.CR
{
    public class ClientesController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(ClientesController));
        ClientesRepository _clientesRepo;

        public ClientesController()
        {
            _clientesRepo = new ClientesRepository();
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosVigentes()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetProyectosVigentes();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> getclientesactuales()

        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetClientesProyectosVigentes();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosClientesVigentes()

        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetProyectosClientesVigentes();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProyectosClientesHistoricos()

        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetProyectosClientesHistoricos();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetClientesWithUnidadesForModal()

        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetClientesWithUnidadesForModal();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        public async Task<IHttpActionResult> CountProyectosClientesVigentes()

        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.CountProyectosClientesVigentes();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> CountProyectosClientesHistoricos()

        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.CountProyectosClientesHistoricos();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetActualesPotenciales()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetClientesActualesPotenciales();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPropuestasONIniciativas()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetPropuestasONIniciativas();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPOIPotenciales()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetPropuestasONIniciativasPotenciales();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetEsAliado(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var aliadoid = _clientesRepo.GetClienteEsAliado(id);
                return Ok(aliadoid);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        public async Task<IHttpActionResult> GetTotalProyectos()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetTotalProyectos();
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }

        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPropuestas(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var propuestas = await _clientesRepo.GetPropuestas(id);
                return Ok(propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAniosdePropuestas()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var propuestas = await _clientesRepo.GetAniosdePropuestas();
                return Ok(propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetIniciativas(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var iniciativas = await _clientesRepo.GetIniciativas(id);
                return Ok(iniciativas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAniosdeIniciativas()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var propuestas = await _clientesRepo.GetAniosdeIniciativas();
                return Ok(propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetOportunidadesNegocio(int id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var ons = await _clientesRepo.GetON(id);
                return Ok(ons);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAniosdeOpotunidadesNegocio()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var propuestas = await _clientesRepo.GetAniosdeON();
                return Ok(propuestas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetProspectosIniciativas()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var prospectos = await _clientesRepo.GetProspectosIniciativas();
                return Ok(prospectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetEmpresasRelacionadas()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var empresas = await _clientesRepo.GetEmpresasRelacionadas();
                return Ok(empresas);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetConsultaParametrizadaClientes(Proyecto p)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var proyectos = await _clientesRepo.GetConsultaParametrizadaClientes(p);
                return Ok(proyectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //[HttpGet]
        //public async Task<IHttpActionResult> GetAniosdeProspectosIniciativas()
        //{
        //    try
        //    {
        //        var propuestas = await _clientesRepo.GetAniosdeProspectosIniciativas();
        //        return Ok(propuestas);
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}

        [HttpGet]
        public async Task<IHttpActionResult> GetProspectosON()
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var prospectos = await _clientesRepo.GetProspectosON();
                return Ok(prospectos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //[HttpGet]
        //public async Task<IHttpActionResult> GetAniosdeProspectosON()
        //{
        //    try
        //    {
        //        var propuestas = await _clientesRepo.GetAniosdeProspectosIniciativas();
        //        return Ok(propuestas);
        //    }
        //    catch (Exception e)
        //    {
        //        return InternalServerError(e);
        //    }
        //}
    }
}
