using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Util
{
    public class SendCorreo
    {
        SIGCOCHContext _ctx;
        CorreoRepository _correoRepo;
        RolPersonaRepository _rolpersonaRepo;
        PersonasRepository _personaRepo;
        GEN_Context _db;

        public SendCorreo(CorreoRepository correoRepo, RolPersonaRepository rolpersonaRepo, PersonasRepository personaRepo)
        {
            _personaRepo = personaRepo;
            _rolpersonaRepo = rolpersonaRepo;
            _correoRepo = correoRepo;
            _db = new GEN_Context();
            _ctx = new SIGCOCHContext();
        }

        public SendCorreo()
        {
            _personaRepo = new PersonasRepository();
            _rolpersonaRepo = new RolPersonaRepository();
            _correoRepo = new CorreoRepository();
            _db = new GEN_Context();
            _ctx = new SIGCOCHContext();
        }

        public async Task<Boolean> Send(Correo correo, getCorreoConfig conf)
        {
            return await Send(new Personas(), correo, conf);
        }

        public async Task<Boolean> Coautores(Correo correo, getCorreoConfig conf)
        {
            List<Personas> personas = new List<Personas>();

            var claves = correo.coautores.Split(',');
            foreach (var item in claves)
            {
                if (item != ",")
                {

                    if (item != "")
                    {

                        if (item != correo.ClavePersona)
                        {
                            var NG = await _personaRepo.GetByClave(item);
                            if (NG != null)
                                personas.Add(NG);
                        }
                    }
                }
            }

            return await Send(personas, correo, conf);

           
            // return await Send(new Personas(), correo, conf);
        }

        /// <summary>
        ///  Hace la configuracion para el envio de correos
        /// </summary>
        /// <param name="listaCorreos"> Lista de correos a las cuales enviar correo</param>
        /// <param name="correo"> Objeto de tipo correo con la configuracion basica, es decir, como viene desde el front end</param>
        /// <param name="conf"> Configuracion default que se tiene para el envio de correos</param>
        /// <returns>true/false</returns>

        public async Task<bool> Send(Correo correo, string listaCorreos, getCorreoConfig conf)
        {
            return  await SendMails( correo, listaCorreos, conf);
        }

        /// <summary>
        ///  Hace la configuracion para el envio de correos 
        /// </summary>
        /// <param name="persona"> persona a la cual enviar correo</param>
        /// <param name="correo"> Objeto de tipo correo con la configuracion basica, es decir, como viene desde el front end</param>
        /// <param name="conf"> Configuracion default que se tiene para el envio de correos</param>
        /// <returns>true/false</returns>
        public async Task<Boolean> Send(Personas persona, Correo correo, getCorreoConfig conf)
        {
            List<Personas> personas = new List<Personas>();


            if (persona != null)
            {
                if (!String.IsNullOrEmpty(persona.Nombre) && !String.IsNullOrEmpty(persona.Correo))
                    personas.Add(persona);
            }
            return await Send(personas, correo, conf);
        }

        /// <summary>
        ///  Hace la configuracion para el envio de correos ()
        /// </summary>
        /// <param name="ToPersonas"> Lista de personas a la cual enviar correos</param>
        /// <param name="correo"> Objeto de tipo correo con la configuracion basica, es decir, como viene desde el front end</param>
        /// <param name="conf"> Configuracion default que se tiene para el envio de correos</param>
        /// <returns>true/false</returns>
        public async Task<Boolean> Send(List<Personas> ToPersonas, Correo correo, getCorreoConfig conf)
        {
            try
            {
                var ClaveCopiaEmpleadoSolicitud = correo.ClavePersona;
                var adminCR = ConfigurationManager.AppSettings["AdministradorCR"];
                var admins = await _rolpersonaRepo.GetAllByIdRolCH(adminCR);
                //Tipos de Correos!!!!
                // 1) Correo de Notificacion de Solicitud a Administradores de CH
                // 2) Correo de Aprobacion/Rechazo de Solicitud
                // 3) Solicitar descarga de insumos de MT

                List<RolPersona> rolesPersona = new List<RolPersona>();  //Es una lista que se usa para enviar correos a personas que no sean rol 8 (administradores, gerentes, directores, etc)
                List<Personas> personasList = new List<Personas>();
                Personas to = null;
             
                //List<Personas> personas = new List<Personas>();
                switch (correo.TipoCorreo)
                {
                    case "1":
                        var adminCH = ConfigurationManager.AppSettings["AdministradorCH"];
                        
                        if (!String.IsNullOrEmpty(correo.ClavePersona))
                        {
                            var personaParaSindicato = await _personaRepo.GetById(correo.ClavePersona);
                            correo.Empleado = personaParaSindicato.NombreCompleto;
                            var sindicato = ConfigurationManager.AppSettings["TipoSindicalizado"];
                            if (!String.IsNullOrEmpty(personaParaSindicato.TipoPersonalId))
                            {
                                if (personaParaSindicato.TipoPersonalId.Trim().Equals(sindicato))
                                {
                                    adminCH = ConfigurationManager.AppSettings["AdministradorCHsindicato"]; //SE SUPLANTA AL AdministradorCH POR AdministradorCHsindicato
                                }
                            }
                        }

                        var Admin = await _rolpersonaRepo.GetAllByIdRolCH(adminCH);
                        rolesPersona = Admin.ToList();
                        break;
                    case "2":
                        var Validar = await _personaRepo.GetByClave(correo.ClavePersona);
                        personasList.Add(Validar);
                        correo.Empleado = Validar.NombreCompleto;
                        if (correo.Descripcion5 != null && Boolean.Parse(correo.Descripcion5))
                        {
                            var roladminpi = ConfigurationManager.AppSettings["AdministradorPI"];
                            var adminPI = await _rolpersonaRepo.GetAllByIdRolCH(roladminpi);
                            var c = adminPI.Select(x => x.ClavePersona);
                            var lista = await _personaRepo.GetAllCollectionMAX(new HashSet<string>(c));
                            personasList.AddRange(lista);
                        }
                        correo.Descripcion5 = "";

                        break;
                    case "3":
                        var SolicitarAcceso = await _personaRepo.GetByClave(correo.ClavePersona);
                        personasList.Add(SolicitarAcceso);
                        break;
                    case "NotificacionGerenteviaAdmin":
                        var rol = await _rolpersonaRepo.GetByRolForsolicitud(correo.SeccionID);
                        var persona = await _personaRepo.GetByClave(rol.ClavePersona);
                        var resultado = await _personaRepo.GetResponsableByClaveUnidadWithoutStatus(persona.ClaveUnidad);

                        await _correoRepo.SendNotificacion(correo, resultado.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                        break;
                    case "SolicitudGerente":
                        //var SolicitarGerente = await _rolpersonaRepo.GetByRolForsolicitud(Convert.ToInt32(correo.Descripcion1));
                        var claveUnidad = await _personaRepo.GetByClave(correo.ClavePersona);
                        var result = await _personaRepo.GetResponsableByClaveUnidadWithoutStatus(claveUnidad.ClaveUnidad);

                        await _correoRepo.SendNotificacion(correo, result.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                        break;
                    case "SolicitudGerenteViaProyecto":
                        //var SolicitarGerente = await _rolpersonaRepo.GetByRolForsolicitud(Convert.ToInt32(correo.Descripcion1));
                        var solicitudgerente = await _personaRepo.GetResponsableByClaveUnidadWithoutStatus(correo.UnidadOrganizacionalId);
                        correo.TipoCorreo = "SolicitudGerente";

                        await _correoRepo.SendNotificacion(correo, solicitudgerente.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                        break;
                    case "solicitudDeRevisionITF":
                         break;
                    case "NotificacionesGerente":
                       
                        var claves = correo.ClavePersona.Split(',');
                        foreach (var item in claves)
                        {
                            var NG = await _personaRepo.GetByClave(item);
                            personasList.Add(NG);
                        }
                       
                        break;

                    case "NotificacionResultadoCP":
                        var notificacionCP = await _personaRepo.GetByClave(correo.ClavePersona);
                        personasList.Add(notificacionCP);
                        break;
                    case "SolicitudCentroPosgrado":
                        var adminCP = ConfigurationManager.AppSettings["AdministradorCP"];
                        var AdminCP = await _rolpersonaRepo.GetAllByIdRolCH(adminCP);
                        rolesPersona = AdminCP.ToList();
                        break;
                    case "AprobacionRechazoEnPublicacion":
                        break;
                    case "CreateSolicitudAccesoITF":
                        to = await _personaRepo.GetByClaveWithoutStatus(correo.UnidadOrganizacional.ClaveResponsable);
                        ToPersonas.Add(to);
                        break;
                    case "ApruebaRechazaGerenteITF":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "EnviaSolicituITFRevisionMT":
                        var roladminMT = ConfigurationManager.AppSettings["AdministradorMT"];
                        var adminMT = await _rolpersonaRepo.GetAllByIdRolCH(roladminMT);

                        foreach (var z in adminMT) {
                            ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(z.ClavePersona));
                        }

                        
                        break;
                    case "rechazoAccesoAITF":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;

                    case "AprobacionAccesoAITF":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;

                    case "NotificationStart":
                        //ToPersonas
                        break;
                    case "accesoGEN":
                        to = await _personaRepo.GetResponsableByClaveUnidadWithoutStatus(correo.UnidadOrganizacionalId);
                        ToPersonas.Add(to);
                        break;
                    case "AceptacionRechazoJefeUnidad":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioCreate":
                        foreach (var item in admins)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "OportunidadNegocioNotificaAdmin":
                        var AdminCR = ConfigurationManager.AppSettings["AdministradorCR"];
                        var AdminCRS = await _rolpersonaRepo.GetAllByIdRolCH(AdminCR);
                        foreach (var item in AdminCRS)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "OportunidadNegocioNotificaAdminAceptada":
                        foreach (var item in admins)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "OportunidadNegocioNotificarAdmonRechazoPorInvestigador":
                        foreach (var item in admins)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;

                    case "OportunidadNegocioNotificarAdminPorResponsable":
                        var AdminCRPr = ConfigurationManager.AppSettings["AdministradorCR"];
                        var adminis = await _rolpersonaRepo.GetAllByIdRolCH(AdminCRPr);
                        foreach (var item in adminis)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "OportunidadNegocioNotificarEspecialistaPorResponsable":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificaAdminRechazo":
                        foreach (var item in admins)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "OportunidadNegocioNotificarme":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificar":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarAceptada":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarPorResponsable":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarPorEspecialista":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarEspecialitaAceptada":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarPorUnidad":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarEspecialista":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarUnidad":
                        var fechaActual = DateTime.Now;
                        var UO = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                            .Where(x => x.ClaveResponsable.Equals(correo.ClavePersona) && x.Estado == 1 && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                p => p.FechaEfectiva <= fechaActual
                                && p.ClaveUnidad == x.ClaveUnidad
                                ).Max(e => e.FechaEfectiva))
                            .FirstOrDefaultAsync();

                        if (UO != null)
                        {
                            var asstente = await _ctx.Asistente.AsNoTracking()
                                .Where(x => x.ClaveUnidad.Equals(UO.ClaveUnidad) && x.FechaEfectiva == _ctx.Asistente.Where(
                                    p => p.FechaEfectiva <= fechaActual
                                    && p.ClaveUnidad == x.ClaveUnidad
                                    ).Max(e => e.FechaEfectiva))
                                .FirstOrDefaultAsync();

                            if (asstente != null)
                            {
                                var corr = await _personaRepo.GetByClaveWithoutStatus(asstente.ClavePersona);
                                correo.Descripcion10 = corr.Correo;
                            }
                        }

                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarEmpleado":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioRechazo":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioAcepto":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioAsignarInvestigador":
                        var fechaActualON = DateTime.Now;
                        var UOON = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                            .Where(x => x.ClaveResponsable.Equals(correo.ClavePersona) && x.Estado == 1 && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                p => p.FechaEfectiva <= fechaActualON
                                && p.ClaveUnidad == x.ClaveUnidad
                                ).Max(e => e.FechaEfectiva))
                            .FirstOrDefaultAsync();

                        if (UOON != null)
                        {
                            var asstente = await _ctx.Asistente.AsNoTracking()
                                .Where(x => x.ClaveUnidad.Equals(UOON.ClaveUnidad) && x.FechaEfectiva == _ctx.Asistente.Where(
                                    p => p.FechaEfectiva <= fechaActualON
                                    && p.ClaveUnidad == x.ClaveUnidad
                                    ).Max(e => e.FechaEfectiva))
                                .FirstOrDefaultAsync();

                            if (asstente != null)
                            {
                                var corr = await _personaRepo.GetByClaveWithoutStatus(asstente.ClavePersona);
                                correo.NombreProyecto = corr.Correo;
                            }
                        }

                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarRechazoPorUnidad":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarRechazoPorInvestigador":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "OportunidadNegocioNotificarmeRechazoPorInvestigador":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "SeguimientoNotificarAdministrador":
                        foreach (var item in admins)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "SeguimientoNotificarResponsable":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "SeguimientoNotificarEmpleado":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "SeguimientoNotificarEspecialista":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "SeguimientoNotificarEstadoEmpleado":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "SeguimientoNotificarEstadoResponsable":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "SeguimientoNotificarEstadoAdministrador":
                        foreach (var item in admins)
                        {
                            var person = await _personaRepo.GetByClaveWithoutStatus(item.ClavePersona);
                            ToPersonas.Add(person);
                        }
                        break;
                    case "SeguimientoNotificarEstadoEspecialista":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "RecuperaContrasena":
                        ToPersonas.Add(await _personaRepo.GetByClaveWithoutStatus(correo.ClavePersona));
                        break;
                    case "MailtoLinkedNetwork":
                        var personasRed= await _personaRepo.getRedPersonas(correo.ClavePersona, new List<String>(conf.subprogramasTecnicos.Split(',')));
                        personasList = new List<Personas>(personasRed);
                        break;
                    case "SolicitudAdminGI":
                        var adminGI = ConfigurationManager.AppSettings["AdministradorGI"];
                        if (!String.IsNullOrEmpty(correo.ClavePersona))
                        {
                            var personaParaSindicato = await _personaRepo.GetById(correo.ClavePersona);
                            var sindicato = ConfigurationManager.AppSettings["TipoSindicalizado"];
                            if (!String.IsNullOrEmpty(personaParaSindicato.TipoPersonalId))
                            {
                                if (personaParaSindicato.TipoPersonalId.Trim().Equals(sindicato))
                                {
                                    adminGI = ConfigurationManager.AppSettings["AdministradorCHsindicato"]; //SE SUPLANTA AL AdministradorCH POR AdministradorCHsindicato
                                }
                            }
                        }

                        var AdministradorGI = await _rolpersonaRepo.GetAllByIdRolCH(adminGI);
                        rolesPersona = AdministradorGI.ToList();
                        break;
                    case "NotificacionEvaluadoresIdeaInnovadora":
                            await _correoRepo.SendNotificacion(correo, correo.Descripcion1, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                        break;
                    case "NotificacionEvaluadoresFI":
                        await _correoRepo.SendNotificacion(correo, correo.Descripcion1, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                        break;
                    case "RechazarAprobarEditarAdminGI":   //Casos en los que el Admin de GI valida/rechaza/regresa solicitudes a los usuarios
                        var Empleado = await _personaRepo.GetByClave(correo.ClavePersona);
                        personasList.Add(Empleado);
                        if (correo.ClavePersona!=correo.Descripcion1) {
                            var Principal = await _personaRepo.GetByClave(correo.Descripcion1);
                            personasList.Add(Principal);
                        }
                        break;
                    case "SolicitudGerenteGI":
                        //En descripcion1 viene la unidad organizacional
                        UORepository unidadRepo = new UORepository();
                        var unidad= await unidadRepo.UnidadByFecha(DateTime.Now, correo.Descripcion1);
                        var gerente = unidad.Responsable;
                        ToPersonas.Add(gerente);
                        break;
                    case "GINotificacionPeriodoAbierto":                        
                            UORepository uoDB = new UORepository();
                            var personasObj = await uoDB.PersonasResponsablesByGetAllUniques();
                            ToPersonas = new List<Personas>(personasObj);
                            break;
                    case "AprobarRechazarGerenteGI":
                        var EmpleadoGI = await _personaRepo.GetByClave(correo.ClavePersona);
                        personasList.Add(EmpleadoGI);
                      
                        break;
                    case "AprobarRechazarGerenteGIPNE":
                        var EmpleadoGIPNE = await _personaRepo.GetByClave(correo.ClavePersona);
                        personasList.Add(EmpleadoGIPNE);
                       
                        break;
                    case "NotificarEvaluadores":
                        await _correoRepo.SendNotificacion(correo, correo.Descripcion1, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                        break;
                    case "FoliosBusquedas":  //folio que se genera cuando se realiza una busqueda de informes tecnicos finales [hasta ahora solo es para ese caso]
                        if (!String.IsNullOrEmpty(correo.copiaMandosMedios))
                        {
                            var clavesPersonas = correo.copiaMandosMedios.Split(';');
                            foreach(var p in clavesPersonas)
                            {
                                var investigador = await new PersonasRepository().GetByClave(p);
                                ToPersonas.Add(investigador);
                                //await _correoRepo.SendNotificacion(correo, correos, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                            }
                            
                        }
                        var empleado = await new PersonasRepository().GetByClave(correo.ClavePersona);
                        ToPersonas.Add(empleado);




                        break;

                    default:
                        throw new Exception("Tipo de correo invalido");
                       

                }

                string correos = "";
                ///////////////ADRIAN ENVIO DE ACUERDO A COLLECIONES:
                if(rolesPersona!=null && rolesPersona.Count > 0)
                {

                    var c = rolesPersona.Select(x => x.ClavePersona);
                    var lista= await _personaRepo.GetAllCollectionMAX(new HashSet<string>(c));
                    //var corrs= lista.Select(x => x.Correo);
                    var corrs = new HashSet<String>(lista.Select(x => x.Correo));
                    correos = string.Join(", ", corrs.ToArray());
                    await _correoRepo.SendNotificacion(correo, correos, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                }
                if (personasList != null && personasList.Count > 0)  //Copia a los autores
                {
                    var c = personasList.Select(x => x.ClavePersona);  //De la lista de personas se obtienen sus correos
                    var lista = await _personaRepo.GetAllCollectionMAX(new HashSet<string>(c));
                    var corrs = new HashSet<String>(lista.Select(x => x.Correo));
                    correos = string.Join(", ", corrs.ToArray());  //Se agregan al objeto del correo para su posterior envio

                    //Envio de correos
                    await _correoRepo.SendNotificacion(correo, correos, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                }
                if (ToPersonas != null)
                {
                    foreach (var per in ToPersonas)
                    {
                        await _correoRepo.SendNotificacion(per, correo, per.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                    }
                }
                //////////////////ALAN: SECCIÓN DE COPIAS
                if(correo.TipoCorreo== "1" )
                {
                    var correoCopia = await _personaRepo.GetByClave(ClaveCopiaEmpleadoSolicitud);
                    correo.TipoCorreo = "CopiaCorreoUsuarioAdmin";

                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                }
                if (correo.TipoCorreo == "SolicitudGerente" || correo.TipoCorreo == "SolicitudGerenteViaProyecto")
                {
                    var correoCopia = await _personaRepo.GetByClave(ClaveCopiaEmpleadoSolicitud);
                    correo.TipoCorreo = "CopiaCorreoUsuarioGerente";

                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                }
                if (correo.TipoCorreo == "SolicitudCentroPosgrado") // Siguiendo la logica de Alan
                {
                    var correoCopia = await _personaRepo.GetByClave(ClaveCopiaEmpleadoSolicitud);
                    correo.TipoCorreo = "CopiaSolicitudCentroPosgrado";

                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                }
                if (correo.TipoCorreo == "SolicitudAdminGI")
                {
                    var correoCopia = await _personaRepo.GetByClave(ClaveCopiaEmpleadoSolicitud);
                    correo.TipoCorreo = "CopiaCorreoUsuarioAdminGI";
                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                }
                if (correo.TipoCorreo == "SolicitudGerenteGI")
                {
                    var correoCopia = await _personaRepo.GetByClave(ClaveCopiaEmpleadoSolicitud);
                    correo.TipoCorreo = "CopiaCorreoUsuarioGerenteGI";
                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);
                }
                if (correo.TipoCorreo == "RechazarAprobarEditarAdminGI")
                {
                    var adminGI = ConfigurationManager.AppSettings["AdministradorGI"];
                    RolPersona adminGIPersona = await _rolpersonaRepo.GetByRolForsolicitud(Convert.ToInt32( adminGI));
                    var correoCopia = await _personaRepo.GetByClave(adminGIPersona.ClavePersona);
                    correo.TipoCorreo = "CopiaRechazarAprobarEditarAdminGI";
                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                }
                if (correo.TipoCorreo == "AprobarRechazarGerenteGI") // Siguiendo la logica de Alan
                {
                    var correoCopia = await _personaRepo.GetByClave(correo.Descripcion1);
                    correo.TipoCorreo = "AprobarRechazarGerenteGI";
                    correo.Empleado = correoCopia.NombreCompleto;

                    await _correoRepo.SendNotificacion(correo, correoCopia.Correo, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);

                }
                //////////FIN de copias


                return true;
            }
            catch (Exception ex) {
                return false;
            }
        }

        public async Task<bool> SendMails(Correo correo, string listaCorreos, getCorreoConfig conf)
        {
            try
            {
              await  _correoRepo.SendNotificacion(correo, listaCorreos, conf.From, conf.Password, conf.Solicitudes, conf.Subject, conf.host, conf.port, conf.enableSsl, conf.FichaPersonal, conf.EncabezadoImagen, conf.PiePaginaImagen, conf.ServidorDireccion, conf.serverlocal, conf.suplantarCorreoCH, conf.suplantarCorreoCR, conf.suplantarCorreoMT, conf.suplenteCorreoCH, conf.suplenteCorreoCR, conf.suplenteCorreoMT, conf.vCopiaOcultaATecnicosSIGCO, conf.correoTecnicosSIGCO, conf.suplantarCorreoDA, conf.suplantarCorreoPA, conf.suplantarCorreoGI, conf.suplenteCorreoDA, conf.suplenteCorreoPA, conf.suplenteCorreoGI, conf.SolicitudesGI, conf.ideasInnovadoras, conf.suplantarCorreoCP, conf.suplenteCorreoCP);                
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}
