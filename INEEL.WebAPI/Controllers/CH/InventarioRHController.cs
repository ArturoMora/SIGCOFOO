using System;
using System.Threading.Tasks;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using INEEL.DataAccess.CH.Models;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    public class InventarioRHController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(InventarioRHController));

        InventarioRHRepository _repository;

        public InventarioRHController()
        {
            _repository = new InventarioRHRepository();
        }

        [HttpPost]
        public async Task<IHttpActionResult> GetByUnidadOrganizacional(CatInvestigadores catinvestigadores)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetByUnidadOrganizacional(catinvestigadores);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPersonalInvestigacion(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetPersonalInvestigacion(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPersonalSNI(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetPersonalSNI(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPersonalSNIDatos(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetPersonalSNIDatos(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPeronalEstudios(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetPersonalEstudios(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPersonalEstudiosxFecha(ParametrosConsultas parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.InvestigadoresFAXFecha(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPeronalVigente(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetPersonalVigente(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaPersonalVigentexFecha(ParametrosConsultas parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetPersonalVigentexFecha(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaAnalisisSNI(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetAnalisisSNI(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e); 
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ConsultaAnalisisSNIxFECHA(ParametrosConsultas parametros)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetAnalisisSNIxFECHA(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }



        [HttpPost]
        public async Task<IHttpActionResult> ConsultaEvolucionPlantilla(ParametrosConsultas parametros)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var reportecatInvestigadores = await _repository.GetEvolucionPlantilla(parametros);
                return Ok(reportecatInvestigadores);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> EdadPromedio(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));

                var result = await _repository.GetPersonasEdadPromedio(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> piramidecategoias(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));

                var result = await _repository.GetPersonaspiramidecategoias(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> PerfilCurricular(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));

                var result = await _repository.GetPersonasPerfilCurricular(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GradosSNI(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var result = await _repository.GetPersonasGradosSNI(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> investigadoresgerencia(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));

                var result = await _repository.Getinvestigadoresgerencia(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> investigadoresdisciplina(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));

                var result = await _repository.Getinvestigadoresdisciplina(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> composicionespescialidades(string id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));

                var result = await _repository.Getcomposicionespescialidades(id);
                return Ok(result);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> InvestigadoresHome()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var result = await _repository.GetInvestigadoresCache();
                var ok = false;
                Grafica grafica = null;
                if (result != null)
                {
                    if (!String.IsNullOrEmpty(result.GraficaJson))
                    {

                        grafica = new JavaScriptSerializer().Deserialize<Grafica>(result.GraficaJson);
                        ok = true;
                    }
                }
                if (!ok)
                {
                    grafica = await _repository.GetInvestigadoresHome();
                    if (grafica != null)
                    {
                        try { log.Info(new MDCSet(this.ControllerContext.RouteData)); 
                        InvestigadoresHome model = new InvestigadoresHome();
                        model.Fecha = DateTime.Now;
                        model.GraficaJson = new JavaScriptSerializer().Serialize(grafica);
                        await _repository.CreateInvestigadoresHome(model);
                        }
                        catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                        }
                    }
                }
                return Ok(grafica);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> InvestigadoresHomeSYNC()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var grafica = await _repository.GetInvestigadoresHome();
                if (grafica != null && grafica.Datos!=null && grafica.Datos.Count>0)
                {
                    try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                        InvestigadoresHome model = new InvestigadoresHome();
                        model.Fecha = DateTime.Now;
                        model.GraficaJson = new JavaScriptSerializer().Serialize(grafica);
                        await _repository.CreateInvestigadoresHome(model);
                    }
                    catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                    }
                }
                return Ok(grafica);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> CountCatalogoPersonasFechaActual()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var CountCatalogoPersonasFechaActual = await _repository.CountCatalogoPersonasFechaActual();
                return Ok(CountCatalogoPersonasFechaActual);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

    }
}