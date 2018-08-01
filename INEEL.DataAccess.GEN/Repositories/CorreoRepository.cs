using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using log4net;
using System.Text.RegularExpressions;
using System.Collections.Generic;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class CorreoRepository
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(CorreoRepository));
        //Crear correo
        public async Task SendNotificacion(Correo correo, string To, string From, string Password, string Solicitudes, string Subject, string host, int port, bool enableSsl, string FichaPersonal, string EncabezadoImagen, string PiePaginaImagen, string ServidorDireccion, string serverlocal, string suplantarCorreoCH, string suplantarCorreoCR, string suplantarCorreoMT, string suplenteCorreoCH, string suplenteCorreoCR, string suplenteCorreoMT, string vCopiaOcultaATecnicosSIGCO, string correoTecnicosSIGCO, string suplantarCorreoDA, string suplantarCorreoPA, string suplantarCorreoGI, string suplenteCorreoDA, string suplenteCorreoPA, string suplenteCorreoGI, string SolicitudesGI, string ideasInnovadoras, string suplantarCorreoCP, string suplenteCorreoCP)
        {
            await SendNotificacion(null, correo, To, From, Password, Solicitudes, Subject, host, port, enableSsl, FichaPersonal, EncabezadoImagen, PiePaginaImagen, ServidorDireccion, serverlocal, suplantarCorreoCH, suplantarCorreoCR, suplantarCorreoMT, suplenteCorreoCH, suplenteCorreoCR, suplenteCorreoMT, vCopiaOcultaATecnicosSIGCO, correoTecnicosSIGCO, suplantarCorreoDA, suplantarCorreoPA, suplantarCorreoGI, suplenteCorreoDA, suplenteCorreoPA, suplenteCorreoGI, SolicitudesGI, ideasInnovadoras, suplantarCorreoCP, suplenteCorreoCP);
        }
        //Define los cuerpos de cada correo
        public async Task SendNotificacion(Personas persona, Correo correo, string To, string From, string Password, string Solicitudes, string Subject, string host, int port, bool enableSsl, string FichaPersonal, string EncabezadoImagen, string PiePaginaImagen, string ServidorDireccion, string serverlocal, string suplantarCorreoCH, string suplantarCorreoCR, string suplantarCorreoMT, string suplenteCorreoCH, string suplenteCorreoCR, string suplenteCorreoMT, string vCopiaOcultaATecnicosSIGCO, string correoTecnicosSIGCO, string suplantarCorreoDA, string suplantarCorreoPA, string suplantarCorreoGI, string suplenteCorreoDA, string suplenteCorreoPA, string suplenteCorreoGI, string SolicitudesGI, string ideasInnovadoras, string suplantarCorreoCP, string suplenteCorreoCP)
        {
            try
            {
                CorreoTemplate correoTemplate = new CorreoTemplate();
                string Body = "";
                if (correo.TipoCorreo == "1" || correo.TipoCorreo == "SolicitudCentroPosgrado" || correo.TipoCorreo == "SolicitudGerente")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'>" +
                    "<tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "El empleado: <b>" + correo.Empleado + "</b> ha enviado para su validación información sobre <b>" + correo.Seccion + "</b><br/><br/> " +
                    "Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + Solicitudes + "'> Sistema </a><br/> para validar la información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "2" || correo.TipoCorreo == "NotificacionResultadoCP")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'>" +
                    "<tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "Estimado(a) <b>" + correo.Empleado + "</b> le informamos que su solicitud de <b>" + correo.Seccion + ":</b><br/><br/>"
                    + correo.Descripcion1 + correo.Descripcion2 + correo.Descripcion3 + correo.Descripcion4
                    + "<br/><br/>Ha sido <b>" + correo.Estado + "</b> por el Administrador con la siguiente justificación:</br></br>" + correo.Justificacion + "<br/><br/> " +
                    "Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + FichaPersonal + "'> Sistema </a><br/> para mayor información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "NotificacionGerenteviaAdmin")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>" +
                    "La solicitud del empleado <b>" + correo.Empleado + "</b> correspondiente a <b>" + correo.Seccion + ":</b><br/><br/>"
                    + correo.Descripcion1 + correo.Descripcion2 + correo.Descripcion3 + correo.Descripcion4 + "<br/><br/>" +
                    "Ha sido <b>" + correo.Estado + "</b> por el Administrador con la siguiente justificación:</br></br>" + correo.Justificacion + "<br/><br/> " +
                    "Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + Solicitudes + "'> Sistema </a><br/> para mayor información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "NotificacionesGerente")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "Estimado(a) <b>" + correo.Empleado + "</b> le informamos que su solicitud de <b>" + correo.Seccion + ":</b><br/><br/>"
                    + correo.Descripcion1 + correo.Descripcion2 + correo.Descripcion3 + correo.Descripcion4 + "<br/><br/>Ha sido <b>" + correo.Estado +
                    "</b> por el Gerente con la siguiente justificación:</br></br>" + correo.Justificacion + "<br/><br/> " +
                    "Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + FichaPersonal + "'> Sistema </a><br/> para mayor información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "3")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El Sistema de Gestión del Conocimiento" + " </b> le informa:<br/><br/> " +
                    "El empleado: <b>" + correo.Empleado + "</b> " + correo.Seccion + "<br/><br/> " +
                    "Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'> Sistema</a> para consultar la información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("solicitudDeRevisionITF"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                        "Estimado(a): <b>" + persona.NombreCompleto.Trim() + "</b>, " + correo.Descripcion1 +
                        "<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'> Sistema</a> para atender la solicitud de revisión." +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("AprobacionRechazoEnPublicacion"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                            "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                            "Estimado(a) " + persona.NombreCompleto + "<br/>" +
                             correo.Descripcion1 +
                            "<br/><br/> Atentamente:<br/><a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'> Sistema de Gestión del Conocimiento.</a> </td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("CreateSolicitudAccesoITF"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                        correo.Descripcion1 + correo.Descripcion2 +
                        "<br/>Justificaci&oacute;n: " + correo.Justificacion +
                        "<br/>Solicitante: " + correo.Empleado +

                        "<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'> Sistema</a> para atender la solicitud." +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("ApruebaRechazaGerenteITF"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa que la :<br/><br/> " +
                        correo.Descripcion1 +
                        "<br/>Estimado(a) " + persona.NombreCompleto + " la respuesta a su solicitud es: " +
                        correo.Descripcion2 +
                        correo.Descripcion3 +
                        "<br/>Justificaci&oacute;n: " + correo.Justificacion +
                        "<br/><br/> Atentamente:<br/> <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'>Sistema de Gestión del Conocimiento.</a></td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }

                if (correo.TipoCorreo.Equals("EnviaSolicituITFRevisionMT"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa :<br/><br/> " +
                        
                        "<br/>Estimado(a) " + persona.NombreCompleto + " se le informa que se ha enviado una solicitud para : " +
                        correo.Descripcion2 +
                        correo.Descripcion3 +
                        "<br/>Justificaci&oacute;n: " + correo.Justificacion +
                        "<br/><br/> Atentamente:<br/> <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'>Sistema de Gestión del Conocimiento.</a></td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }

                if (correo.TipoCorreo.Equals("rechazoAccesoAITF"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                        correo.Descripcion1 +
                        "<br/>Estimado(a) " + persona.NombreCompleto + " la respuesta a su solicitud es: " +
                        correo.Descripcion2 +
                        correo.Descripcion3 +
                        "<br/>Justificaci&oacute;n: " + correo.Justificacion +
                        "<br/><br/> Atentamente:<br/> <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'>Sistema de Gestión del Conocimiento.</a></td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("AprobacionAccesoAITF"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                        correo.Descripcion1 +
                        "<br/>Estimado(a) " + persona.NombreCompleto + " la respuesta a su solicitud es: " +
                        correo.Descripcion2 +
                        correo.Descripcion3 +
                        "<br/>Justificaci&oacute;n: " + correo.Justificacion +
                        "<br/><br/> Atentamente:<br/> <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'>Sistema de Gestión del Conocimiento.</a></td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("NotificationStart"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> <b>SIGCO</b> le informa:<br/><br/> " +
                        "<br/>Estimado(a) " + persona.NombreCompleto.Trim() + ", los nuevos <b>objetos de conocimiento</b> (a los que Ud. est&aacute; suscrito) son: " +
                        correo.Descripcion1 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("accesoGEN"))
                {
                    var url = SimpleSessionPersister.getUrlReferrer;
                    var goUrl = url.AbsoluteUri.Replace(url.AbsolutePath, "/sigco.html#/SolicitudesAcceso");

                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado(a) <b>" +
                         persona.NombreCompleto.Trim() + "</b>, el usuario " + correo.Empleado + " ha generado la siguiente solicitud: <br/><br/>" +
                        correo.Descripcion1 + "<br/>" +
                        "<b>Justificación:</b> " + correo.Justificacion + "<br/>" +
                        this.getEnlaceAtencion(goUrl) +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("AceptacionRechazoJefeUnidad"))
                {

                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> SIGCO </b> le informa:<br/><br/> Estimado(a) <b>" +
                         persona.NombreCompleto.Trim() + "</b>" +
                         correo.Descripcion1 + "<br/>" +
                         correo.Descripcion2 + "<br/>" +
                         correo.Descripcion3 + "<br/>" +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioCreate"))
                {
                    var fecha = correo.Descripcion2.Split('T')[0];
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, el usuario " + "<b>" + correo.Empleado + "</b> ha generado la siguiente oportunidad de negocio: <br/>" +
                         "<b>" + correo.Descripcion1 + "</b ></br>" +
                         "Fecha: " + fecha + "</br>" +
                         "Contacto: " + correo.Descripcion3 + "</br>" +
                         "Empresa: " + correo.Descripcion4 + "</br>" +
                         "Telefono: " + correo.Descripcion5 + "</br>" +
                         "Correo: " + correo.Descripcion6 + "</br>" +
                         "Comentarios: " + correo.Descripcion7 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificaAdmin"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido asignada "
                        + "a la unidad organizacional " + "<b>" + correo.Descripcion2 + "</b>" + " por el especialista " + "<b>" + correo.Descripcion3 + "</b>" +

                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificaAdminAceptada"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido aceptada "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>" + " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>"
                        + "con los siguientes comentarios:" + "<br/>"
                        + correo.Descripcion4 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarAdmonRechazoPorInvestigador"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido <b>rechazada</b> "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>" + " por la siguiente justificación: " + "<br/>"
                        + correo.Descripcion3 +

                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";

                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarmeRechazoPorInvestigador"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido <b>rechazada</b> "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>" + " por la siguiente justificación: " + "<br/>"
                        + correo.Descripcion3 +

                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";

                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificaAdminRechazo"))
                {
                    Body =
                     "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                     + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido <b>rechazada</b> "
                     + "por el responsable " + "<b>" + correo.Descripcion2 + "</b> de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>" + " por la siguiente justificación:<br/><br/>"
                     + correo.Descripcion4 +

                     "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";

                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarme"))
                {
                    Body =
                         "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, su oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido registrada con éxito y enviada al Administrador" +
                         " del módulo de capital relacional para su revisión." + "<br/><br/>"
                         + "Lo mantendremos informado por este medio acerca del estatus de su oportunidad de negocio." + "<br/>"
                         + "Gracias por su colaboración " +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificar"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado (a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>" + " la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b>" + " que usted registró, ha sido revisada por el Administrador" +
                         " del módulo de Capital Relacional y está en espera de ser asignada a un especialista" +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarEmpleado"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado (a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>" + " la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b>" + " que usted registró, ha sido revisada por el especialista " +
                         "<b>" + correo.Descripcion2 + "</b>" + " y asignada a la unidad organizacional " + "<b>" + correo.Descripcion3 + "<b>" +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarAceptada"))
                {
                    Body =
                       "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                       + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido aceptada "
                       + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>" + " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>"
                       + "por la siguiente justificación: " + "<br/>"
                       + correo.Descripcion4 +
                       "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarEspecialitaAceptada"))
                {
                    Body =
                       "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                       + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido aceptada "
                       + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>" + " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>"
                       + "por la siguiente justificación: :" + "<br/>"
                       + correo.Descripcion4 +
                       "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarPorResponsable"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado (a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>" + " la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b>" + " que usted registró, ha sido asignada al investigador " + "<b>" + correo.Descripcion2 + "</b>" +
                         " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>." +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarAdminPorResponsable"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado (a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>" + " la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b>" + " ha sido asignada al investigador " + "<b>" + correo.Descripcion2 + "</b>" +
                         " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>" +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarEspecialistaPorResponsable"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado (a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>" + " la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b>" + " ha sido asignada al investigador " + "<b>" + correo.Descripcion2 + "</b>" +
                         " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>" +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarPorEspecialista"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado (a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>" + " la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b>" + " ha sido asignada al "
                         + "especialista <b>" + correo.Descripcion2 + "</b>" +
                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarPorUnidad"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido <b>rechazada</b> "
                        + "por el responsable " + "<b>" + correo.Descripcion2 + "</b> de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>" + " con la siguiente justificación: :<br/><br/>"
                        + correo.Descripcion4 +

                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarEspecialista"))
                {
                    var fecha = correo.Descripcion2.Split('T')[0];
                    var fechaMaxima = correo.Descripcion8.Split('T')[0];

                    Body =
                      "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, se le ha asignado la siguiente oportunidad de negocio: <br/>" +
                         "<b>" + correo.Descripcion1 + "</b ></br>" +
                         "Fecha: " + fecha + "</br>" +
                         "Contacto: " + correo.Descripcion3 + "</br>" +
                         "Empresa: " + correo.Descripcion4 + "</br>" +
                         "Telefono: " + correo.Descripcion5 + "</br>" +
                         "Correo: " + correo.Descripcion6 + "</br>" +
                         "Fecha Máxima de atención: " + fechaMaxima + "</br>" +
                         "Comentarios: " + correo.Descripcion7 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarUnidad"))
                {
                    var fecha = correo.Descripcion2.Split('T')[0];
                    var fechaMaxima = correo.Descripcion8.Split('T')[0];
                    Body =
                       "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, el especialista <b>" + correo.Descripcion9 + "</b> le ha asignado la siguiente oportunidad de negocio: <br/>" +
                         "<b>" + correo.Descripcion1 + "</b ></br>" +
                         "Fecha: " + fecha + "</br>" +
                         "Contacto: " + correo.Descripcion3 + "</br>" +
                         "Empresa: " + correo.Descripcion4 + "</br>" +
                         "Telefono: " + correo.Descripcion5 + "</br>" +
                         "Correo: " + correo.Descripcion6 + "</br>" +
                         "Fecha Máxima de atención: " + fechaMaxima + "</br>" +
                         "Comentarios: " + correo.Descripcion7 + "</br>" +
                         "Comentarios del especialista: " + correo.Descripcion11 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioRechazo"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado (a) <b>" +
                        persona.NombreCompleto.Trim() + "</b>, el especialista " + correo.Descripcion4 + " le ha asignado la siguiente oportunidad: <br/>" +
                        correo.Descripcion1 + "<br/>" +
                        correo.Descripcion2 + "<br/>" +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioAcepto"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido aceptada "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>" + " de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>"
                        + "con la siguiente justificación: :" + "<br/>"
                        + correo.Descripcion4 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioAsignarInvestigador"))
                {

                    var fecha = correo.Descripcion2.Split('T')[0];
                    var fechaMaxima = correo.Descripcion10.Split('T')[0];
                    Body =
                       "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, se le ha asignado la siguiente oportunidad de negocio: <br/>" +
                         "<b>" + correo.Descripcion1 + "</b ></br>" +
                         "Fecha: " + fecha + "</br>" +
                         "Contacto: " + correo.Descripcion3 + "</br>" +
                         "Empresa: " + correo.Descripcion4 + "</br>" +
                         "Telefono: " + correo.Descripcion5 + "</br>" +
                         "Correo: " + correo.Descripcion6 + "</br>" +
                         "Fecha Máxima de atención: " + fechaMaxima + "</br>" +
                         "Comentarios de su jefe inmediato: " + correo.Descripcion7 + "</br>" +
                         "Comentarios del especialista: " + correo.Descripcion8 + "</br>" +
                         "Comentarios generales: " + correo.Descripcion9 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarRechazoPorUnidad"))
                {
                    Body =
                         "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido <b>rechazada</b> "
                         + "por el responsable " + "<b>" + correo.Descripcion2 + "</b> de la unidad organizacional " + "<b>" + correo.Descripcion3 + "</b>" + " por la siguiente justificación: :<br/><br/>"
                         + correo.Descripcion4 +

                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarRechazoPorInvestigador"))
                {
                    Body =
                         "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                         + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> ha sido <b>rechazada</b> "
                         + "por el investigador " + "<b>" + correo.Descripcion2 + "</b> debido al siguiente motivo:<br/><br/>"
                         + correo.Descripcion3 +

                         "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarEspecialista"))
                {
                    Body =
                         "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, en la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> se ha agregado una actividad "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b><br/>"
                        + "Actividad :" + "<br/>"
                        + correo.Descripcion3 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarEmpleado"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, en la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> se ha agregado una actividad "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b><br/>"
                        + "Actividad :" + "<br/>"
                        + correo.Descripcion3 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarResponsable"))
                {
                    Body =
                         "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, en la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> se ha agregado una actividad "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b><br/><br/>"
                        + "Actividad :" + "<br/>"
                        + correo.Descripcion3 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarAdministrador"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> se ha agregado una actividad "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b><br/>"
                        + "Actividad :" + "<br/>"
                        + correo.Descripcion3 +
                        "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }


                if (correo.TipoCorreo.Equals("SeguimientoNotificarEstadoEspecialista"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, se ha modificado la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>.<br/><br/>"
                        + "Detalles:" + "<br/>"
                        + "Estado:  <b>" + correo.Descripcion3 + " </b><br/>"
                        + "Comentarios: " + correo.Descripcion4 + "<br/>"
                        + "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarEstadoEmpleado"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, se ha modificado la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>.<br/><br/>"
                        + "Detalles:" + "<br/>"
                        + "Estado:  <b>" + correo.Descripcion3 + " </b><br/>"
                        + "Comentarios: " + correo.Descripcion4 + "<br/>"
                        + "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarEstadoResponsable"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, se ha modificado la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>.<br/>"
                        + "Detalles:" + "<br/>"
                        + "Estado:  <b>" + correo.Descripcion3 + " </b><br/>"
                        + "Comentarios: " + correo.Descripcion4 + "<br/>"
                        + "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo.Equals("SeguimientoNotificarEstadoAdministrador"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + persona.NombreCompleto.Trim() + "</b>, se ha modificado la oportunidad de negocio " + "<b>" + correo.Descripcion1 + "</b> "
                        + "por el investigador " + "<b>" + correo.Descripcion2 + "</b>.<br/>"
                        + "Detalles:" + "<br/>"
                        + "Estado: <b>" + correo.Descripcion3 + "</b><br/>"
                        + "Comentarios: " + correo.Descripcion4 + "<br/>"
                        + "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }


                if (correo.TipoCorreo.Equals("NotificacionEventosCP"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b><br/> le informa sobre la próxima reunión de la comunidad :" + correo.Descripcion4 + "<br/><br/>"
                        + "A celebrarse " + "<b>" + correo.Descripcion3 + "</b>, en " + "<b>" + correo.Descripcion2 + "</b> "
                        + "en donde se atenderán los siguientes puntos: <br/>" + correo.Descripcion1 + "<br/>"
                        + "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }



                if (correo.TipoCorreo == "CopiaCorreoUsuarioAdmin")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado(a) <b>" + correo.Empleado + "</b> su solicitud de <b>" + correo.Seccion + "</b> ha sido enviada para su validación al Administrador.<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "#/fichapersonal/" + "'> Sistema </a><br/> para seguimiento a su solicitud.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "CopiaCorreoUsuarioGerente")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado(a) <b>" + correo.Empleado + "</b> su solicitud de <b>" + correo.Seccion + "</b> ha sido enviada para su autorización al Gerente.<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "#/fichapersonal/" + "'> Sistema </a><br/> para seguimiento a su solicitud.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "CopiaSolicitudCentroPosgrado")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado(a) <b>" + correo.Empleado + "</b> su solicitud de <b>" + correo.Seccion + "</b> ha sido enviada para su autorización al Administradoor del Centro de Posgrado.<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "#/fichapersonal/" + "'> Sistema </a><br/> para seguimiento a su solicitud.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }


                if (correo.TipoCorreo.Equals("RecuperaContrasena"))
                {
                    Body =
                        "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El sistema <b>" + correo.Modulo + "</b> le informa:<br/><br/>"
                        + "Estimado(a) " + "<b>" + "</b>, se ha solicitado la recuperación de contraseña para ingresar a SIGCO "
                       + "<br/><br/> Favor de ingresar a  <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "#/newpassword/" + correo.Descripcion1 + "/" + correo.ClavePersona + "'> Recuperar Contraseña</a> ."
                        + "<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }

                if (correo.TipoCorreo.Equals("MailtoLinkedNetwork"))
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                        "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                        "<a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "#/detallePersonal/" + correo.ClavePersona + "'>" + correo.Empleado + "</a> " +
                        correo.Descripcion1 +
                        "<br/><br/> Atentamente:<br/> <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'>Sistema de Gestión del Conocimiento.</a></td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }

                if (correo.TipoCorreo == "SolicitudAdminGI")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td>"+
                        " El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> "+
                        "El empleado: <b>" + correo.Empleado + "</b> ha enviado para su validación información sobre <b>" + correo.Seccion
                        + "</b><br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + SolicitudesGI + "'> Sistema </a><br/> para validar la información.<br/><br/> "
                        +"Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "SolicitudGerenteGI")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> El empleado: <b>" + correo.Empleado + "</b> ha enviado para su autorización información sobre <b>" + correo.Seccion + "</b><br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + SolicitudesGI + "'> Sistema </a><br/> para validar la información.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "CopiaCorreoUsuarioAdminGI")
                {
                    var url = "";
                    switch (correo.Seccion)
                    {
                        case "Idea Innovadora":
                            url = "#/ideaInnovadora";
                            break;
                    }
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado(a) <b>" + correo.Empleado + "</b> su solicitud de <b>" + correo.Seccion + "</b> ha sido enviada para su validaci&oacute;n al Administrador de GI.<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + url + "'> Sistema </a><br/> para seguimiento a su solicitud.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "CopiaCorreoUsuarioGerenteGI")
                {
                    var url = "";
                    switch (correo.Seccion)
                    {
                        case "Producto Innovador":
                            url = "#/productoInnovador";
                            break;
                    }
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>"
                    + correo.Modulo + "</b> le informa:<br/><br/> Estimado(a) <b>" + correo.Empleado + "</b> su solicitud de <b>"
                    + correo.Seccion + "</b> ha sido enviada para su validaci&oacute;n al Gerente.<br/><br/> Favor de ingresar al <a href = '"
                    + SimpleSessionPersister.getUrlReferrerAbsoluteUri + url + "'> Sistema </a><br/> para seguimiento a su solicitud.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "NotificacionEvaluadoresIdeaInnovadora")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>"
                     + correo.Modulo + "</b> le informa:<br/><br/>El Administrador de Gestión de la Innovación lo asignó como evaluador de un OC correspondiente a <b>"
                      + correo.Seccion + "</b><br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + SolicitudesGI
                       + "'> Sistema </a><br/> para mayor información.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }
                if (correo.TipoCorreo == "NotificacionEvaluadoresFI")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr><tr><td> El módulo de <b>"
                    + correo.Modulo + "</b> le informa:<br/><br/>El Administrador de Gestión de la Innovación lo asignó como evaluador de un OC correspondiente a <b>"
                    + correo.Seccion + "</b><br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri
                    + "'> Sistema </a><br/> para mayor información.<br/><br/> Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }

                if (correo.TipoCorreo == "RechazarAprobarEditarAdminGI")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "Estimado(a) <b>" + correo.Empleado + "</b> le informamos que su solicitud de <b>" + correo.Seccion + "</b> ha sido <b>"
                     + correo.Estado + "</b> con la siguiente justificación: </br></br><b>" + correo.Descripcion2 + "</b></br></br>" +
                     " Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + ideasInnovadoras + "'> Sistema </a><br/> para mayor información.<br/><br/> " +
                     "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";

                    //Nota: parece que en algun momento el parametro 'ideasInnovadoras' se utilizaba, se deja igual debido a que a la fecha hay dudas sobre el modulo en general
                }
                if (correo.TipoCorreo == "CopiaRechazarAprobarEditarAdminGI")  //Aprobacion/rechazo de solicitudes en GI
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "La solicitud del empleado <b>" + correo.Empleado + "</b> de <b>" + correo.Seccion + "</b> ha sido <b>" + correo.Estado + "</b></br> " +
                    "Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + ideasInnovadoras + "'> Sistema </a><br/> para mayor información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                    //Nota: parece que en algun momento el parametro 'ideasInnovadoras' se utilizaba, se deja igual debido a que a la fecha hay dudas sobre el modulo en general
                }
                if (correo.TipoCorreo == "AprobarRechazarGerenteGI")
                {

                    var replacements = new Dictionary<string, object> {
                        { CorreoKeys.URL, SimpleSessionPersister.getUrlReferrerAbsoluteUri },
                        { CorreoKeys.MODULO, correo.Modulo },
                        {CorreoKeys.NOMBRECOMPLETO, persona.NombreCompleto },
                                            { CorreoKeys.Estado, correo.Estado}
                    };
                    Body = await this.GetBodyMail(correo.TipoCorreo, replacements);
                }
                if (correo.TipoCorreo == "AprobarRechazarGerenteGIPNE")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "Estimado(a) <b>" + correo.Empleado + "</b> le informamos que su solicitud de <b>" + correo.Seccion + ":</b><br/><br/>" +
                    "Ha sido <b>" + correo.Estado + "</b> por el Gerente con la siguiente justificación:</br></br>" + correo.Justificacion + "<br/><br/> Favor de ingresar al <a href = '" + SimpleSessionPersister.getUrlReferrerAbsoluteUri + "'> Sistema </a><br/> para mayor información.<br/><br/> " +
                    "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";
                }

                if (correo.TipoCorreo == "GINotificacionPeriodoAbierto")
                {
                    var replacements = new Dictionary<string, object> {
                        { CorreoKeys.URL, SimpleSessionPersister.getUrlReferrerAbsoluteUri },
                        { CorreoKeys.MODULO, correo.Modulo },
                        {CorreoKeys.NOMBRECOMPLETO, persona.NombreCompleto }
                    };
                    Body = await this.GetBodyMail(correo.TipoCorreo, replacements);
                }


                MailMessage mail = new MailMessage();


                if (correo.TipoCorreo == "NotificarEvaluadores")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El módulo de <b>" + correo.Modulo + "</b> le informa:<br/><br/> Estimado <b>Comite de evaluación</b> le informamos que existe una nueva solicitud de <b>"
                    + correo.Seccion + "</b> que ha sido enviada para su revisión.<br/><br/> " + correo.Descripcion2
                    + "<br/><br/>Por lo anterior hago de su conocimiento que se reunirá el comité para la revisión de esta.<br/>Esperen próxima información del lugar y hora de la reunión.<br/><br/>" +
                    " Atentamente:<br/> " + correo.Descripcion3 + ".</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";

                    if (correo.Seccion.Equals("Propuesta de Innovación"))
                    {
                        mail.Attachments.Add(new Attachment(correo.pathToAttachment));
                    }
                    else
                    {
                        var adjuntos = correo.pathToAttachment.Split('$');
                        foreach (var item in adjuntos)
                        {
                            mail.Attachments.Add(new Attachment(item));
                        }
                    }
                }
                if (correo.TipoCorreo == "FoliosBusquedas")
                {
                    Body = "<table style='width:810px;font-family:Helvetica,Arial;'><tr><td><img src='cid:encabezado'/></td></tr>" +
                    "<tr><td> El SIGCO en su módulo<b> " + correo.Modulo + "</b> le informa:<br/><br/> " +
                    "Estimado(a) <b>" + correo.Empleado + "</b> el detalle de la búsqueda realizada el " + DateTime.Now.ToString("dd-MM-yyy HH:mm") + " en <b>" + correo.Seccion + "</b>" +
                    " es el siguiente :<br/><br/>";
                    
                    var paramsArray = correo.Parametros.Split(';');
                    if (paramsArray.Length > 0)
                    {
                        var valuesArray = correo.ValoresParametros.Split(';');

                        Body += "Parámetros utilizados en su búsqueda <br/>";
                        var cadena = "";

                        for (var c = 0; c < paramsArray.Length; c++)
                        {
                            try
                            {
                                var valor = valuesArray[c];
                                if(valor.Equals("undefined") || valor.Equals("null"))
                                {
                                    valor = "--";
                                }
                                cadena += "<b>"+paramsArray[c] + "</b> : " + valor  + "<br/>";
                            }
                            catch (Exception f)
                            {
                                cadena += "<b>"+paramsArray[c] + "</b> : " +  "" + "<br/>";
                            }
                            
                        }

                        Body += cadena+ "<br/><br/>";

                    }

                    Body += "Obteniendo como resultado "+correo.Descripcion1+ "<br/>"+
                        "Se envía la siguiente evidencia a petición del interesado <br/><br/>" +
                        "Atentamente:<br/> Sistema de Gestión del Conocimiento.</td></tr><tr><td><img src='cid:piepagina'/></td></tr></table>";

                    correoTemplate.Asunto = Subject + correo.Modulo + "- Evidencia de búsqueda en informes técnicos finales";
                }



                string PathAux = HttpContext.Current.Server.MapPath("\\images");
                string myPath;
                SmtpClient SmtpServer;
                LinkedResource encabezadoImg;
                LinkedResource piepaginaImg;
                if (!serverlocal.Equals("true"))
                {
                    //servidor
                    SmtpServer = new SmtpClient();
                    myPath = ServidorDireccion;
                    //myPath = myPath.Replace("INEEL.WebAPI", "INEEL.SIGCO.Web");
                    encabezadoImg = new LinkedResource(myPath + EncabezadoImagen, MediaTypeNames.Image.Jpeg);
                    piepaginaImg = new LinkedResource(myPath + PiePaginaImagen, MediaTypeNames.Image.Jpeg);


                }
                else
                {

                    SmtpServer = new SmtpClient(host);
                    myPath = HttpContext.Current.Server.MapPath("\\images");
                    myPath = myPath.Replace("INEEL.WebAPI", "INEEL.SIGCO.Web");
                    encabezadoImg = new LinkedResource(@myPath + EncabezadoImagen, MediaTypeNames.Image.Jpeg);
                    piepaginaImg = new LinkedResource(@myPath + PiePaginaImagen, MediaTypeNames.Image.Jpeg);
                }


                //esto es para el local
                //SmtpClient SmtpServer = new SmtpClient(host);
                //string myPath = HttpContext.Current.Server.MapPath("\\images");
                //myPath = myPath.Replace("INEEL.WebAPI", "INEEL.SIGCO.Web");
                //LinkedResource encabezadoImg = new LinkedResource(@myPath + "\\Newsletter_sigco_up.png", MediaTypeNames.Image.Jpeg);
                //LinkedResource piepaginaImg = new LinkedResource(@myPath + "\\Newsletter_sigco_down.png", MediaTypeNames.Image.Jpeg);

                //esto es para el servidor
                //SmtpClient SmtpServer = new SmtpClient();
                //string myPath = "C:\\inetpub\\SIGCO3\\images";
                //myPath = myPath.Replace("INEEL.WebAPI", "INEEL.SIGCO.Web");
                //LinkedResource encabezadoImg = new LinkedResource(myPath + "\\Newsletter_sigco_up.png", MediaTypeNames.Image.Jpeg);
                //LinkedResource piepaginaImg = new LinkedResource(myPath + "\\Newsletter_sigco_down.png", MediaTypeNames.Image.Jpeg);


                AlternateView htmlView = AlternateView.CreateAlternateViewFromString(Body, Encoding.UTF8, MediaTypeNames.Text.Html);
                encabezadoImg.ContentId = "encabezado";
                piepaginaImg.ContentId = "piepagina";
                htmlView.LinkedResources.Add(encabezadoImg);
                htmlView.LinkedResources.Add(piepaginaImg);
                mail.AlternateViews.Add(htmlView);

                mail.From = new MailAddress(From);
                
                if (correo.TipoCorreo.Equals("OportunidadNegocioNotificarUnidad"))
                {
                    mail.CC.Add(correo.Descripcion10);
                }
                if (correo.TipoCorreo.Equals("OportunidadNegocioAsignarInvestigador"))
                {
                    mail.CC.Add(correo.NombreProyecto);
                }


                if (vCopiaOcultaATecnicosSIGCO.ToUpper().Equals("SI")) { mail.Bcc.Add(correoTecnicosSIGCO); };

                if (correo.Modulo == "Capital Relacional")
                {
                    mail.Subject = Subject + correo.Modulo + correo.tituloON;
                }
                else
                {
                    if (String.IsNullOrEmpty(correoTemplate.Asunto))
                    {
                        mail.Subject = Subject + correo.Modulo + " - Solicitud de Validación en " + correo.Seccion;
                    }
                    else
                    {
                        mail.Subject = correoTemplate.Asunto;
                    }
                }


                if (correo.Modulo == "Comunidad de Práctica")
                {
                    mail.Subject = Subject + correo.Modulo + correo.Seccion;
                }

                if (correo.TipoCorreo == "3")
                {
                    mail.Subject = Subject + correo.Modulo + " - Solicitud para descargar adjuntos de insumos";
                }
                if (correo.TipoCorreo == "RecuperaContrasena")
                {
                    mail.Subject = Subject + " - Solicitud para recuperar contraseña";
                }
                if (!String.IsNullOrEmpty(correo.Subject))
                {
                    mail.Subject = correo.Subject;
                }

                switch (correo.Modulo)
                {
                    case "Capital Relacional":
                        if (suplantarCorreoCR.ToUpper().Equals("SI")) { mail.To.Add(suplenteCorreoCR); if (mail.CC.Count > 0) { for (var i = 0; i < mail.CC.Count; i++) { mail.CC.Remove(mail.CC[i]); } } } else { mail.To.Add(To); };
                        break;
                    case "Capital Humano":
                        if (suplantarCorreoCH.ToUpper().Equals("SI")) { mail.To.Add(suplenteCorreoCH); if (mail.CC.Count > 0) { for (var i = 0; i < mail.CC.Count; i++) { mail.CC.Remove(mail.CC[i]); } } } else { mail.To.Add(To); };
                        break;
                    case "Memoria Tecnológica":
                        if (suplantarCorreoMT.ToUpper().Equals("SI")) { mail.To.Add(suplenteCorreoMT); if (mail.CC.Count > 0) { for (var i = 0; i < mail.CC.Count; i++) { mail.CC.Remove(mail.CC[i]); } } } else { mail.To.Add(To); };
                        break;
                    case "DA":
                        break;
                    case "PA":
                        break;
                    case "Gestión de la Innovación":
                        if (suplantarCorreoGI.ToUpper().Equals("SI")) { mail.To.Add(suplenteCorreoGI); if (mail.CC.Count > 0) { for (var i = 0; i < mail.CC.Count; i++) { mail.CC.Remove(mail.CC[i]); } } } else { mail.To.Add(To); };
                        break;
                    case "Comunidades de Práctica":
                        if (suplantarCorreoCP.ToUpper().Equals("SI")) { mail.To.Add(suplenteCorreoCP); if (mail.CC.Count > 0) { for (var i = 0; i < mail.CC.Count; i++) { mail.CC.Remove(mail.CC[i]); } } } else { mail.To.Add(To); };
                        break;
                    default:
                        if (!correo.Modulo.Equals("SIGCO"))
                        {

                            mail.To.Add(correoTecnicosSIGCO);
                            mail.Subject = "Error en nombre de Modulo / correo";
                            mail.Body = mail.Body + "<br/> correo.modulo:" + correo.Modulo;
                        }
                        else
                            mail.To.Add(To);

                        break;
                };
                mail.IsBodyHtml = true;
                SmtpServer.Credentials = new System.Net.NetworkCredential(From, Password);
                SmtpServer.Port = port;
                SmtpServer.Host = host;
                SmtpServer.EnableSsl = enableSsl;

                SmtpServer.Send(mail);
                //return ("(>^.^)>");
            }
            catch (Exception e)
            {
                //return(e.Message);
            }
        }
        private async Task<String> GetBodyMail(String TipoCorreo, Dictionary<String, object> replacements)
        {
            CorreoTemplateRepository repo = new CorreoTemplateRepository();
            var correoTemplate = await repo.GetById(TipoCorreo);
            var Body = correoTemplate.Header +
                               this.ReplaceUsingDictionary(correoTemplate.Body, replacements)
                               + correoTemplate.Footer;
            return Body;
        }
        private string getEnlaceAtencion(string uri)
        {
            return "<br/><br/>Favor de ingresar al <a href = '" + uri + "'> Sistema</a> para atender la solicitud.";
        }
        private string ReplaceUsingDictionary(string src, IDictionary<string, object> replacements)
        {
            return Regex.Replace(src, @"{(\w+)}", (m) =>
            {
                object replacement;
                var key = m.Groups[1].Value;
                if (replacements.TryGetValue(key, out replacement))
                {
                    return Convert.ToString(replacement);
                }
                else
                {
                    return m.Groups[0].Value;
                }
            });
        }
    }
}
