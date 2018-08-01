/*using IIE.DataAccess;
using IIE.DataAccess.Repositories;*/
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Linq;
using System.Web.Http; using log4net; using INEEL.WebAPI.Utilidades.Data;
using System.Text;

namespace INEEL.WebAPI.Controllers.GENERICOS
{
    [Authorize]
    public class NuevoOCController : ApiController { private static readonly ILog log = LogManager.GetLogger(typeof(NuevoOCController));

        private NuevoOCRepository _entityRepo;

        public NuevoOCController()
        {
            _entityRepo = new NuevoOCRepository();

        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetTop(int id)
        {
            //is is cant of top
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                //var uri = Request.RequestUri.AbsoluteUri;
                //string[] serv = Regex.Split(uri, "api/");
                ////var server = ConfigurationManager.AppSettings["servidorAPI"];
                //var server = serv[0];
                var server = ConfigurationManager.AppSettings["servidorWeb"];
                var top = id;
                var entities = await _entityRepo.GetTop(server, top);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetTop()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var top = 5;
                //var uri = Request.RequestUri.AbsoluteUri;
                //string[] serv = Regex.Split(uri, "api/");

                var server = ConfigurationManager.AppSettings["servidorWeb"];
                //var server = serv[0];
                var entities = await _entityRepo.GetTop(server, top);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> test()
        {
            PersonasRepository p = new PersonasRepository();
            var r = await p.GetAllMAX();
            return Ok(r);
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> NotificationStart()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var NuevosOcs = await _entityRepo.GetAllNewsWithOCs(); //.Where(x=>x.nuevo==true)
                var listOcs = new List<NuevoOC>(NuevosOcs);
                for (int i = 0; i < 1; i++)
                {
                    
                    if (NuevosOcs == null || NuevosOcs.Count() == 0)
                        break;


                    OCSuscripcionesRepository susc = new OCSuscripcionesRepository();
                    var oCSuscripciones = await susc.GetAllEmpleadosANDsuscritoWithOc();
                    if (oCSuscripciones == null || oCSuscripciones.Count() == 0)
                        break;

                    HashSet<String> clavesEmpleado = new HashSet<string>(
                            oCSuscripciones.Select(x => x.ClaveEmpleado));

                    var personas = await susc.PersonasGetAllCollectionMAX(clavesEmpleado);
                    await _entityRepo.UpdateSetFalseInNuevo();
                    List<PersonaSuscripciones> lista = new List<PersonaSuscripciones>();

                    getCorreoConfig conf = new getCorreoConfig();
                    SendCorreo send = new SendCorreo();
                    Correo correo = new Correo();
                    List<OCSuscripciones> OCSuscripcion = new List<OCSuscripciones>();
                    
                    
                    if (NuevosOcs == null 
                        || listOcs==null || listOcs.Count<1 || NuevosOcs.Count()==0)
                        break;
                    try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                        string servidorWeb = ConfigurationManager.AppSettings["servidorWeb"];
                        List<OCSuscripciones> oCSuscripcionesList = new List<OCSuscripciones>(oCSuscripciones);
                        foreach (var p in personas)
                        {
                            var porEmpleado = oCSuscripcionesList.FindAll(x => x.ClaveEmpleado == p.ClavePersona);
                            if (porEmpleado != null)
                            {
                                OCSuscripcion = new List<OCSuscripciones>(porEmpleado);
                                var email = getCorreo(OCSuscripcion, listOcs, servidorWeb);
                                if (email.goSend)
                                {
                                    await send.Send(p, getCorreo(OCSuscripcion, listOcs, servidorWeb), conf);
                                }                                
                            }
                            //lista.Add(new PersonaSuscripciones(p, OCSuscripcion));

                        }
                    }
                    catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    }

                }
                return Ok("pendiente");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        private Correo getCorreo(List<OCSuscripciones> list, List<NuevoOC> nuevosOc, String servidorWeb)
        {

            Correo correo = new Correo();
            correo.TipoCorreo = "NotificationStart";
            correo.Descripcion1 = getSuscripciones(list, nuevosOc, servidorWeb);
            correo.goSend = true;
            if (String.IsNullOrEmpty(correo.Descripcion1))
            {
                correo.goSend = false;
            }
            correo.Subject = "SIGCO - suscripción de Objetos de Conocimiento";
            correo.Modulo = "SIGCO";
            return correo;
        }
        private String getSuscripciones(List<OCSuscripciones> list, List<NuevoOC> nuevosOc, String servidorWeb)
        {
            StringBuilder str = new StringBuilder();
            var nuevosOcs = false;
            if (list != null && nuevosOc!=null)
            {
                str.Append("<br/><ul>");
                
                foreach (var e in list)
                {
                    List<NuevoOC> nuevos = new List<NuevoOC>();
                    try { log.Info(new MDCSet(this.ControllerContext.RouteData)); 
                        nuevos = nuevosOc.FindAll(x => x.OcsId == e.OcsId).ToList();
                    }
                    catch (Exception nuev) { }

                    if (nuevos != null && nuevos.Count>0)
                    {
                        str.Append("<li><h4>").Append(e.Ocs.Nombre).Append("</h4>");
                            str.Append("<ul>");
                            foreach (var n in nuevos)
                            {
                                str.Append("<li><a href='").Append(servidorWeb).Append(n.liga).Append("'>").Append(n.descripcion).Append("</a></li>");
                                nuevosOcs = true;
                            }
                            str.Append("</ul>");
                        str.Append("</li>");
                    }
                   
                    
                }
                str.Append("</ul></br>");
            }
            if (nuevosOcs)
            {
                return str.ToString();                
            }
            else
            {
                return null;
            }
            
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("api/NuevoOC/GetTopByMODULO/{moduloId}/{top}")]
        public async Task<IHttpActionResult> GetTopByMODULO(String moduloId, int top)
        {
            //is is cant of top
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));

                var entities = await _entityRepo.GetTopByMODULO(moduloId, top);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllOfFirstDayOfWeekMODULO(String id)
        {
            //is is ModuloId
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                DateTime first = FirstDayOfWeekUtility.GetFirstDayOfWeek(DateTime.Now);
                var entities = await _entityRepo.GetAllOfDateMODULO(first, id);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetCATOcs()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetCATOcs();
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllOfFirstDayOfWeek()
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                DateTime first = FirstDayOfWeekUtility.GetFirstDayOfWeek(DateTime.Now);
                var entities = await _entityRepo.GetAllOfDate(first);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> GetAllOfDate(DateTime fecha)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                DateTime first = FirstDayOfWeekUtility.GetFirstDayOfWeek(DateTime.Now);
                var entities = await _entityRepo.GetAllOfDate(fecha);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
       [HttpGet] public async Task<IHttpActionResult> GetAll(){try { 
                var entities = await _entityRepo.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> getOCtopRaw(int id)
        {
            try {
                var entities = await _entityRepo.getOCtopRaw(id);
                return Ok(entities);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> Get(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                var entity = await _entityRepo.Get(Id);
                return Ok(entity);
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize] public async Task<IHttpActionResult> Create([FromBody]NuevoOC model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]NuevoOC model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> Delete(long Id){try{log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(Id));
                await _entityRepo.Delete(Id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize][HttpDelete]
        public async Task<IHttpActionResult> DeleteId(string Id,string OcsId)
        {
            try { log.Info(new MDCSet(this.ControllerContext.RouteData));
                await _entityRepo.DeleteId(Id,OcsId);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        //******************* for webmaster
        /// <summary>  
        /// obtiene los nuevos OCs considerando como nuevos a aquellos que se registraron con una fecha >  (DateTime.Now - id), donde id representa el número de días
        /// </summary> 
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllNewsByOc(int id)
        {
            var dias = id;
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var server = ConfigurationManager.AppSettings["servidorWeb"];
                var fecha = DateTime.Now;
                var dateFecha = new DateTime(fecha.Year, fecha.Month, fecha.Day); //fecha sisn tiempo
                dateFecha = dateFecha.AddDays(-dias);
                var modulos = ConfigurationManager.AppSettings["modulosLiberados"];
                var listModulos = modulos.Split(',');
                Dictionary<String, IEnumerable<OcIntranet>> nuevos = new Dictionary<string, IEnumerable<OcIntranet>>();
                //TODO en lu
                var list =  await _entityRepo.GetByOC(dateFecha, server);
                var tiposOC = list.Select(s => s.TipoOC).Distinct().ToList();
                var localList = new List<OcIntranet>(list);

                foreach (var t in tiposOC)
                {
                    nuevos.Add(t, localList.FindAll(x => x.TipoOC == t));
                }
                var result = new { StartingFrom = dateFecha, TiposOC = tiposOC, Resultado = nuevos };
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        /// <summary>  
        /// obtiene los nuevos OCs considerando como nuevos a aquellos que se registraron con una fecha >  (DateTime.Now - id), donde id representa el número de días
        /// </summary> 
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllNews(int id)
        {            
            var dias = id;
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var server = ConfigurationManager.AppSettings["servidorWeb"];
                var fecha = DateTime.Now;
                var dateFecha = new DateTime(fecha.Year, fecha.Month, fecha.Day); //fecha sisn tiempo
                dateFecha= dateFecha.AddDays(-dias);
                var modulos = ConfigurationManager.AppSettings["modulosLiberados"];
                var listModulos = modulos.Split(',');
                Dictionary<String, IEnumerable<OcIntranet>> nuevos = new Dictionary<string, IEnumerable<OcIntranet>>();
                foreach (var m in listModulos)
                {
                    nuevos.Add(m , await  this.GetByMODULO(m, dateFecha, server));
                }
                var result = new { StartingFrom = dateFecha, Modulos = listModulos, Resultado = nuevos };
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        /// <summary>  
        /// obtiene el conteno de los nuevos OCs considerando como nuevos a aquellos que se registraron con una fecha >  (DateTime.Now - id), donde id representa el número de días
        /// </summary> 
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllNewsNumber(int id)
        {
            var dias = id;
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var server = ConfigurationManager.AppSettings["servidorWeb"];
                var fecha = DateTime.Now;
                var dateFecha = new DateTime(fecha.Year, fecha.Month, fecha.Day); //fecha sisn tiempo
                dateFecha = dateFecha.AddDays(-dias);
                
                //var modulos = ConfigurationManager.AppSettings["modulosLiberados"];
                //var listModulos = modulos.Split(',');
                //Dictionary<String, int> nuevos = new Dictionary<string, int>();
                //foreach (var m in listModulos)
                //{
                //    nuevos.Add(m, await this.GetByMODULOCount(m, dateFecha, server));
                //}

                var ModuloCounts = await _entityRepo.GetByOCCount(dateFecha);
                var result = new { StartingFrom= dateFecha, /*Modulos = listModulos, Resultado = nuevos,*/ ObjetosConocimiento= ModuloCounts };
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        private async Task<IEnumerable<OcIntranet>> GetByMODULO(String moduloId, DateTime fecha, String server)
        {
            //is is cant of top
            try
            {
                
                //log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entities = await _entityRepo.GetByMODULO(moduloId, fecha, server);
                return entities;
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return null;
            }
        }
        private async Task<int> GetByMODULOCount(String moduloId, DateTime fecha, String server)
        {
            //is is cant of top
            try
            {

                //log.Info(new MDCSet(this.ControllerContext.RouteData));
                var cantidad = await _entityRepo.GetByMODULOCount(moduloId, fecha, server);
                return cantidad;
            }
            catch (Exception e)
            {
                //log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return 0;
            }
        }

    }
}
