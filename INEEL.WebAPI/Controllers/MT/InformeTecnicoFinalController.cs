using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Repositories.MT;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using INEEL.WebAPI.Utilidades.Data;
using System.IO;
using INEEL.DataAccess.GEN.Repositories;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Web;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.WebAPI.Utilidades.report;
using System.Configuration;
using INEEL.WebAPI.Utilidades;

namespace INEEL.WebAPI.Controllers.MT
{
    public class InformeTecnicoFinalController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(InformeTecnicoFinalController));

        //EntityController1.- Nombre de clase y tipicament constructor
        //InformeTFRepository.- La implementación CRUD del Modelo:Entity con el patrón de diseño Repository
        //_entityRepo.-      varible de tipo InformeTFRepository
        // entities.-        resultado de tipo Task<IEnumerable<Entity>>
        // entity.-         resultado de tipo Task<Entity>
        // InformeTecnicoFinal.-         Modelo
        private InformeTFRepository dbITF;

        ProyectoRepository _proyectosRepo;
        public InformeTecnicoFinalController()
        {
            _proyectosRepo = new ProyectoRepository();
            dbITF = new InformeTFRepository();
        }
        [HttpPost]
        public async Task<HttpResponseMessage> Reporte(String id)
        {
            //id de ITF
            
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var itf= await dbITF.GetFKs(id);
                UORepository uo = new UORepository();
                var gerencia= await uo.GetById(itf.ClaveUnidadOrganizacional);
                var division= await uo.GetById(gerencia.padre);

                InformeTF util = new InformeTF();
                itf.NombreUnidadOrganizacional = gerencia.NombreUnidad;
                itf.NombreUnidadPadre = division.NombreUnidad;
                var autores = await dbITF.getAllAutoresByInformeTecnicoFinalId(itf.InformeTecnicoFinalId);

                var resultAutores = util.getAutoresOfList(autores);
                var docPDF=util.GetITFFichaReport(ConfigurationManager.AppSettings["templateITFficha"]/*"c:\\adjuntos\\itfFicha.dotx"*/, itf, id, Request, resultAutores);
                return docPDF;
            }
            
            catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message + " (del ITF "+id+")");
            }
}

        [HttpPost]
        public async Task<HttpResponseMessage> ReporteCaratula(String id)
        {
            //id de ITF

            try
            {
                ITFCaratula util = new ITFCaratula();

                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var itf = await dbITF.GetFKs(id);
                UORepository uo = new UORepository();
                var gerencia = await uo.GetById(itf.ClaveUnidadOrganizacional);
                var division = await uo.GetById(gerencia.padre);
                
                itf.NombreUnidadOrganizacional = gerencia.NombreUnidad;
                itf.NombreUnidadPadre = division.NombreUnidad;
                var autores = await dbITF.getAllAutoresByInformeTecnicoFinalId(itf.InformeTecnicoFinalId);

                var resultAutores = util.getAutoresOfList(autores);
                var docPDF = util.GetITFCaratulaReport(ConfigurationManager.AppSettings["templateITFcaratula"] /*"c:\\adjuntos\\itfCompleto.dotx"*/, itf, id, Request, resultAutores);
                
                return docPDF;
            }

            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message + " (del ITF " + id + ")");
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> enviarARevision(String id)
        {
            //id de ITF
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Identificador de ITF nulo o vacio");
                }
                var itf = await dbITF.GetIncludeProject(id);
                await dbITF.updateEstadoFlujo(itf.InformeTecnicoFinalId, 1);//--> Por autorizar

                var revisor = await dbITF.getPersonaResponsableByProyecto(itf.Proyecto);
                Correo correo = new Correo();
                correo.Modulo = "Memoria Tecnológica";
                correo.Empleado = SimpleSessionPersister.PersonaId;
                correo.Seccion = "ITF";
                correo.TipoCorreo = "solicitudDeRevisionITF";
                correo.Descripcion1 = String.Concat(
                    " se ha generado una solicitud de revisión del Informe Técnico Final del proyecto <b>",
                    itf.Proyecto.ProyectoId,
                    "  --  ", itf.Proyecto.Nombre, "</b>"
                );
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    getCorreoConfig conf = new getCorreoConfig();
                    SendCorreo send = new SendCorreo();
                    var result = await send.Send(revisor, correo, conf);
                }
                catch (Exception e)
                {
                    log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    dbITF = null;
                    dbITF = new InformeTFRepository();
                }

                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    SolicitudRevisionITF solITF = new SolicitudRevisionITF();
                    solITF.InformeTecnicoFinalId = itf.InformeTecnicoFinalId;
                    solITF.ClavePersonaSolicitante = SimpleSessionPersister.PersonaId;
                    DateTime localDate = DateTime.Now;
                    //ConfigAPI.cultureName
                    solITF.FechaSolicitud = localDate;
                    solITF.EstadoSolicitudId = EstadoSolicitudIds.Pendiente;
                    solITF.ClaveUnidad = itf.Proyecto.UnidadOrganizacionalId;
                    await dbITF.CreateSolicitudRevisionITF(solITF);
                    //SolicitudRevisionITF
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
                return Ok();
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> SolicitudRevisionITF_ByAdminMT(String id)
        {

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Identificador de ITF nulo o vacio");
                }
                var result = await dbITF.SolicitudRevisionITF_ByAdminMT(id);//el gerente autoriza y cambia a 2: autorizado/aprobado                                                       
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> SolicitudRevisionITF_GetByResponsableUO(String id)
        {
            //id de ITF
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Identificador de ITF nulo o vacio");
                }
                var result = await dbITF.SolicitudRevisionITF_GetByResponsableUO(id);//el gerente autoriza y cambia a 2: autorizado/aprobado                                                       
                return Ok(result);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> RechazaAprobacion1(String id)
        {
            //id de ITF
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Identificador de ITF nulo o vacio");
                }

                var result = await dbITF.updateEstadoFlujo(id, EstadoITFFlujoIds.EnEdicion);
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    log.Info(String.Concat("El registro ITF con el id ", id, "se modifica el estado a " + EstadoITFFlujoIds.EnEdicion));
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    var solicitud = await dbITF.GetSolicitudRevisionITF(id, EstadoSolicitudIds.Pendiente);
                    solicitud.EstadoSolicitudId = EstadoSolicitudIds.Denegada;
                    solicitud.FechaAtencion = DateTime.Now;
                    result = await dbITF.UpdateSolicitudRevisionITF(solicitud);
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }

                return Ok();
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> aprobacion1(String id)
        {
            //id de ITF
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Identificador de ITF nulo o vacio");
                }

                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    var result = await dbITF.updateEstadoFlujo(id, EstadoITFFlujoIds.Autorizado);//el gerente autoriza y cambia a 2: autorizado/aprobado                    
                    try
                    {
                        log.Info(new MDCSet(this.ControllerContext.RouteData));
                        
                        log.Info(String.Concat("El registro ITF con el id ", id, "se modifica el estado a " + EstadoITFFlujoIds.Autorizado));
                        
                        
                    }
                    catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); }
                    try
                    {
                        log.Info(new MDCSet(this.ControllerContext.RouteData));
                        //una vez aprobado...
                        var solicitud = await dbITF.GetSolicitudRevisionITF(id, EstadoSolicitudIds.Pendiente);
                        solicitud.EstadoSolicitudId = EstadoSolicitudIds.Aprobado;
                        solicitud.FechaAtencion = DateTime.Now;
                        result = await dbITF.UpdateSolicitudRevisionITF(solicitud);

                        DateTime localDate = DateTime.Now;
                        solicitud.FechaSolicitud = localDate;
                        solicitud.EstadoSolicitudId = EstadoSolicitudIds.Pendiente;
                        solicitud.FechaAtencion = null;
                        solicitud.SolicitudRevisionITFId = 0;
                        solicitud.AdminMT = true;
                        var existe = await dbITF.GetSolicitudRevisionITF_cvePersona_EstadoSolicitudId(solicitud);
                        if (existe != null)
                        {
                            solicitud.SolicitudRevisionITFId = existe.SolicitudRevisionITFId;
                            await dbITF.UpdateSolicitudRevisionITF(solicitud);
                        }
                        else
                        {
                            result = await dbITF.CreateSolicitudRevisionITF(solicitud);
                        }

                    }
                    catch (Exception ein)
                    {
                        var borrar = "debug";
                        String.Concat(ein, borrar, "foo");
                    }

                }
                catch (Exception e)
                {
                    log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    //dbITF = null;
                    //dbITF = new InformeTFRepository();
                }

                return Ok();
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> ExisteSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_estadoFlujo(SolicitudAccesoITF solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //var solicitudAccesoITF= await dbITF.GetSolicitudAccesoITFByInformeTecnicoFinalId(solicitud.InformeTecnicoFinalId);
                var solicitudAccesoITF = await dbITF.GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_stadoFlujo(
                    solicitud.InformeTecnicoFinalId,
                    solicitud.ClavePersonaSolicitante,
                    solicitud.EstadoFlujoId
                    );

                if (solicitudAccesoITF == null)
                {
                    return Ok(false);
                }
                else
                {
                    return Ok(true);
                }
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateSolicitudAccesoITF(SolicitudAccesoITF solicitud)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                //var solicitudAccesoITF= await dbITF.GetSolicitudAccesoITFByInformeTecnicoFinalId(solicitud.InformeTecnicoFinalId);
                var solicitudAccesoITF = await dbITF.GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_stadoFlujo(
                    solicitud.InformeTecnicoFinalId,
                    solicitud.ClavePersonaSolicitante,
                    solicitud.EstadoFlujoId
                    );
                if (solicitudAccesoITF != null)
                {
                    throw new Exception("Ya se encuentra una solicitud en proceso...");
                }

                solicitudAccesoITF = await dbITF.GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante(
                    solicitud.InformeTecnicoFinalId,
                    solicitud.ClavePersonaSolicitante
                );


                if (solicitudAccesoITF == null)
                {
                    await dbITF.CreateSolicitudAccesoITF(solicitud);
                }
                else
                {
                    //ya existe
                    //throw new Exception("Ya se encuentra una solicitud en proceso...");
                    solicitudAccesoITF.EstadoFlujoId = 8;
                    await dbITF.UpdateSolicitudAccesoITFByInformeTecnicoFinalId(solicitudAccesoITF);
                    solicitud.SolicitudAccesoITFId = solicitudAccesoITF.SolicitudAccesoITFId;
                }



                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    BitacoraSolicitudesRepository bitaReppo = new BitacoraSolicitudesRepository();
                    BitacoraSolicitudes bita = new BitacoraSolicitudes();
                    bita.SolicitudId = solicitud.SolicitudAccesoITFId;
                    bita.FechaMovimiento = DateTime.Now;
                    bita.ClavePersona = solicitud.ClavePersonaSolicitante; //??
                    bita.Descripcion = solicitud.Justificacion;
                    bita.EstadoFlujoId = 8;
                    bita.idRol = solicitud.idRol;

                    await bitaReppo.Create(bita);


                }
                catch (Exception e1)
                {

                    log.Warn(new MDCSet(this.ControllerContext.RouteData), e1);
                }
                return Ok();
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> PublicarITF(AprobacionRechazoData data)
        {
            //id de ITF
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(data.IdElemento))
                {
                    throw new Exception("Identificador de ITF nulo o vacio");
                }
                var accion = "rechazado";
                var justificacionOcomentarios = "";
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    if (data.Aprobacion == true)
                    {

                        if (String.IsNullOrEmpty(data.ClasificacionSignatura) || String.IsNullOrEmpty(data.NumInventario) || String.IsNullOrEmpty(data.NumInforme))
                        {
                            throw new Exception("No se proporcionaron todos los elementos del formulario");
                        }

                        var update = await dbITF.updateClasificacionSignatura(data.IdElemento, data.ClasificacionSignatura, data.NumInforme, data.NumInventario);
                        if (!update)
                        {
                            throw new Exception("no fue posible agregar ClasificacionSignatura");
                        }
                    }
                    dbITF = new InformeTFRepository();
                    var result = await dbITF.updateEstadoFlujo(data.IdElemento,
                        data.Aprobacion ? EstadoITFFlujoIds.Publicado : EstadoITFFlujoIds.EnEdicion);//el Admin autoriza y cambia a 2: autorizado/aprobado
                    if (data.Aprobacion == true)
                    {
                        accion = "aprobado";
                    }
                    else
                    {
                        justificacionOcomentarios = "<br/>Justificaci&oacute;n: " + data.JustificacionOcomentarios;
                    }

                    //una vez aprobado...
                    var solicitud = await dbITF.GetSolicitudRevisionITF(data.IdElemento, EstadoSolicitudIds.Pendiente);
                    solicitud.EstadoSolicitudId = data.Aprobacion ? EstadoSolicitudIds.Aprobado : EstadoSolicitudIds.Denegada;
                    solicitud.FechaAtencion = DateTime.Now;
                    result = await dbITF.UpdateSolicitudRevisionITF(solicitud);

                    //mandar correo


                    try
                    {
                        log.Info(new MDCSet(this.ControllerContext.RouteData));
                        var itf = await dbITF.GetIncludeProject(data.IdElemento);
                        var interesados = await dbITF.getJefeAndResponsableUnidad_ByPRoyecto(itf.Proyecto);
                        Correo correo = new Correo();
                        correo.Modulo = "Memoria Tecnológica";
                        correo.Empleado = SimpleSessionPersister.PersonaId;
                        correo.Seccion = "ITF";
                        correo.TipoCorreo = "AprobacionRechazoEnPublicacion";
                        correo.Descripcion1 = String.Concat(
                            "Se le notifica que el Informe Técnico Final del proyecto <b>",
                            itf.Proyecto.ProyectoId,
                            "  --  ", itf.Proyecto.Nombre, "</b> fué <b>", accion, "</b> por el administrador de MT",
                            justificacionOcomentarios
                        );
                        getCorreoConfig conf = new getCorreoConfig();
                        SendCorreo send = new SendCorreo();
                        var enviaCorreo = await send.Send(interesados.ToList(), correo, conf);
                    }
                    catch (Exception e)
                    {
                        log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                        //dbITF = null;
                        //dbITF = new InformeTFRepository();
                    }

                }
                catch (Exception e)
                {
                    log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                    //dbITF = null;
                    //dbITF = new InformeTFRepository();
                }

                return Ok();
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> getData([FromBody]DataServerSide ss)//DataTableParameters parameters)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var draw2 = HttpContext.Current.Request.Form["search[value]"];

                // DataServerSide ss = new DataServerSide(HttpContext.Current.Request, parameters);
                if (String.IsNullOrEmpty(ss.EstadoFlujoId))
                {
                    throw new Exception("No se estableció un EstadoFlujoId");
                }
                var entities = await dbITF.getData(ss);

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
        [HttpGet]
        public async Task<IHttpActionResult> GetProyectsByNumJefe(String id)
        {
            #region
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Numero de Jefe Nulo o vacio");
                }
                else
                {
                    if (id.ToLower().StartsWith("u"))
                        id = id.Substring(1, id.Length - 1);
                }
                var numJefe = id;
                var proyectos = await _proyectosRepo.GetByNumJefe(numJefe);
                var pItfs = await dbITF.GetITfsByNumJefe(numJefe);
                var proyectosdeItfs = pItfs.Select(x => x.Proyecto);

                //List<ProyectoConBandera> lista = new List<ProyectoConBandera>();
                foreach (var pro in proyectos)
                {
                    ProyectoConBandera newP = new ProyectoConBandera(pro);
                    //foreach (var proItf in proyectosdeItfs)
                    pro.Bandera = 1;
                    foreach (var proItf in pItfs)
                    {
                        if (proItf.Proyecto.ProyectoId == pro.ProyectoId)
                        {
                            //newP.bandera = true;
                            pro.Bandera = 2;
                            if (proItf.EstadoITFFlujoId > 0)
                            {
                                pro.Bandera = 3;
                            }
                            break;
                        }
                    }

                    //lista.Add(newP);
                }
                return Ok(proyectos);
                //return Ok(lista);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
            #endregion
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetProyecto(String id)
        {
            //ANY proyect
            #region
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Numero de proyecto Nulo o vacio");
                }

                var campos = await _proyectosRepo.GetById(id);
                return Ok(campos);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
            #endregion
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetAll(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(id))
                {
                    throw new Exception("Numero de Jefe Nulo o vacio");
                }
                else
                {
                    if (id.ToLower().StartsWith("u"))
                        id = id.Substring(1, id.Length - 1);
                }
                var numJefe = id;
                var entities = await dbITF.GetITfsByNumJefe(numJefe);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> getAllByProyecto(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData)); //id is proyectoId
                if (String.IsNullOrEmpty(id)) //Cadena is proyectoId
                {
                    throw new Exception("Identificador de proyecto Nulo o vacio");
                }
                var entities = await dbITF.getAllByProyecto(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> getAllByClaveEmpleado(String id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData)); //id is proyectoId
                if (String.IsNullOrEmpty(id)) //Cadena is proyectoId
                {
                    throw new Exception("Identificador de usuario Nulo o vacio");
                }
                var entities = await dbITF.getAllByClaveEmpleado(id);
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<IHttpActionResult> CountITF(int id)
        {
            try
            {
                var cant = await dbITF.countITFbyStatus(id);//id is estadoFlujo
                return Ok(cant);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> CountNumeroProyectoConITF(Body datos)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(datos.Cadena)) //Cadena is proyectoId
                {
                    throw new Exception("Identificador de proyecto Nulo o vacio");
                }
                var entities = await dbITF.CountNumeroProyectoConITF(datos.Cadena);
                return Ok(entities);
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
                var entities = await dbITF.GetAll();
                /*var products = await _productRepo.GetAll();
                var obj = new {message= "resultado OK", employees = entities, products = products};
                //return Ok(obj);*/
                return Ok(entities);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);

                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> Get(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData), new InfoException(id));
                var entity = await dbITF.Get(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetByID_Collections(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetByID_Collections(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> getAllAutores(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.getAllAutoresByInformeTecnicoFinalId(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetFKs(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetFKs(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> CreateFirst([FromBody]InformeTecnicoFinal model)
        {
            if (model != null)
            {
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await dbITF.Create(model);
                return Ok("Nuevo ITF para el proyecto " + model.ProyectoId);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> CountITFByProyecto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));

                var cant = await dbITF.CountITFByProyecto(id);
                return Ok(cant);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> Create([FromBody]InformeTecnicoFinal model)
        {
            if (model != null)
            {
                //PENDIENTE model.Archivos.Replace("\"", "");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await dbITF.setUnidad(model);
                await dbITF.Create(model);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IHttpActionResult> Update([FromBody]InformeTecnicoFinal model)
        {
            if (model != null)
            {
            }
            if (!ModelState.IsValid)
            {
                //  return BadRequest(ModelState);
            }

            if (model != null)
            {
                if (model.ITFgeneral != null)
                {
                    //model.ITFgeneral.ITFgeneralId = model.InformeTecnicoFinalId;
                    //model.ITFgeneralId = model.InformeTecnicoFinalId;
                }
            }


            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                /*if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }*/
                await dbITF.Update(model);
                return Ok("Registro actualizado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> deleteAdjuntoITF(AdjuntoITF id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var model = id;
                await dbITF.DeleteAdjuntoITF(model.AdjuntoITFId);
                try
                {
                    log.Info(new MDCSet(this.ControllerContext.RouteData));
                    long num = await dbITF.CountAdjuntoITFByRutaCompleta(model.Adjunto.RutaCompleta);
                    if (num == 1)
                    {
                        File.Delete(model.Adjunto.RutaCompleta);
                    }
                }
                catch (Exception e) { log.Error(new MDCSet(this.ControllerContext.RouteData), e); Escribe.Write(e); }
                return Ok("Elemento eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> Delete([FromBody]InformeTecnicoFinal itf)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await dbITF.UpdateEstado(itf); // Delete(id);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> AddAdjuntoPrincipal([FromBody]InformeTecnicoFinal itf)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await dbITF.AddAdjuntoPrincipal(itf); // Delete(id);
                return Ok(itf.AdjuntoId);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IHttpActionResult> AddAdjuntoCalidad([FromBody]  DataAccess.MT.Models.ITF.SatisCte sats)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                await dbITF.AddAdjuntoCalidad(sats); // Delete(id);
                return Ok(sats);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> DeleteAutor(AutorITF autor)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(autor.AutorITFId))
                {
                    autor.AutorITFId = autor.InformeTecnicoFinalId + "-" + autor.ClaveAutor;
                }
                await dbITF.DeleteAutor(autor.AutorITFId);
                return Ok("Registro eliminado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> AddAutor(AutorITF autor)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                if (String.IsNullOrEmpty(autor.AutorITFId))
                {
                    autor.AutorITFId = autor.InformeTecnicoFinalId + "-" + autor.ClaveAutor;
                }
                await dbITF.AddAutor(autor);
                return Ok("Registro creado exitosamente!");
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


        //[HttpGet]
        //public HttpResponseMessage GetFile(string id)
        //{                        
        //    var key = id;
        //    var entity =  dbITF.Get_(key);

        //    //var localFilePath = fetchFile.path + fetchFile.name;
        //    var localFilePath = "PENDIENTE "; /* entity.Archivos;
        //    localFilePath = localFilePath.Replace("\"", "");*/
        //    UtileriasArchivo util = new UtileriasArchivo();
        //    return util.GetFile(localFilePath, Request);
        //}

        [HttpGet]
        public async Task<IHttpActionResult> GetLA(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetLA(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetInsumosPublicosPorProyecto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetInsumosPublicosPorProyecto(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetLASinProyecto(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetLASinProyecto(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetPal(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetPal(id);
                return Ok(entity);
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
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetProy(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetJefe(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var entity = await dbITF.GetJefe(id);
                return Ok(entity);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }
        [HttpGet]
        public async Task<IHttpActionResult> GetGerenteAutorizadorByIDITF(string id)
        {
            try
            {
                log.Info(new MDCSet(this.ControllerContext.RouteData));
                var itf = await dbITF.Get(id);
                UORepository unidad = new UORepository();
                var fecha = DateTime.Now;
                if (itf.FechaPublicacion != null) {
                    fecha = itf.FechaPublicacion.Value;
                }
                else
                {
                    if (itf.AnioElaboracion != null)
                    {
                        new DateTime(itf.AnioElaboracion.Value, 2, 2);
                    }
                }

                var uni= await unidad.UnidadByFecha(fecha, itf.ClaveUnidadOrganizacional);
                if (uni == null)
                {
                    uni = await unidad.UnidadByFecha(DateTime.Now, itf.ClaveUnidadOrganizacional);
                }
                

                return Ok(uni);
            }
            catch (Exception e)
            {
                log.Error(new MDCSet(this.ControllerContext.RouteData), e);
                return InternalServerError(e);
            }
        }


    }
}