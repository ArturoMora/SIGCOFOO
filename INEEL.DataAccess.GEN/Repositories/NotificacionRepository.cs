using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Repositories.GI;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class NotificacionRepository
    {
        CR_Context _dbCR;
        GI_Context _ctxGI;
        GEN_Context _dbGen;
        MT_Context _db;
        SIGCOCHContext _ctx;
        PersonasRepository _personaRepo;
        SolicitudRepository _SolicitudRepository;
        EvaluadorIdeaRepository _evaluadorRepo;
        public NotificacionRepository()
        {
            _ctx = new SIGCOCHContext();
            _personaRepo = new PersonasRepository();
            _SolicitudRepository = new SolicitudRepository();
            _db = new MT_Context();
            _dbGen = new GEN_Context();
            _ctxGI = new GI_Context();
            _evaluadorRepo = new EvaluadorIdeaRepository();
            _dbCR = new CR_Context();
        }


        public async Task<IEnumerable<Notificacion>> GetCountSolicitudesNotification(int roll, string clavePersona)
        {
            try
            {
                var fechaActual = DateTime.Now;
                string url = string.Empty;
                HttpRequest request = HttpContext.Current.Request;
                var server = request.UrlReferrer.Authority;
                var scheme = request.UrlReferrer.Scheme;

                url = scheme + "://" + server;

                //if (server.Contains("localhost") || server.Contains("5080") || server.Contains("8040"))
                //{
                //    url = "http://";
                //}
                //else
                //{
                //    url = "https://";
                //}

                //url += server;

                List<Notificacion> Solicitud = new List<Notificacion>();

                //Si es administrador de CH
                if (roll == 1)
                {
                    Solicitud = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
                                                       .Where(e => e.TipoInformacionId != 18)
                                                       .Where(e => e.TipoInformacionId != 21)
                                                       .Where(e => e.tipoPersonal_Id.Equals("INV") || e.tipoPersonal_Id.Equals("MAN"))
                                                       .Include(e => e.TipoInformacion)
                                                       .GroupBy(e => e.TipoInformacionId)
                                                       .Select(y => new Notificacion
                                                       {
                                                           Nombre = y.FirstOrDefault().TipoInformacion.Descripcion,
                                                           Contador = y.Count(),
                                                           State = url + "/indexCH.html#/solicitudesrh"
                                                       })
                                                       .AsNoTracking()
                                                       .ToListAsync();
                }

                if (roll == 4 || roll == 5 || roll == 16)
                {
                    var persona = await _personaRepo.GetByClaveFechaEfectiva(clavePersona);
                    var SolicitudCH = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == 8 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12
                                      || e.EstadoFlujoId == 13 && e.TipoInformacionId != 18)
                                     .Where(e => e.TipoInformacionId != 21)
                                     .Where(x => x.ClaveUnidadAut == persona.ClaveUnidad)
                                                     .Include(e => e.TipoInformacion)
                                                     .GroupBy(e => e.TipoInformacionId)
                                                        .Select(y => new Notificacion
                                                        {
                                                            Nombre = y.FirstOrDefault().TipoInformacion.Descripcion,
                                                            Contador = y.Count(),
                                                            State = url + "/indexCH.html#/solicitudesrh"
                                                        })
                                                        .AsNoTracking()
                                                        .ToListAsync();

                    if (SolicitudCH.Count > 0)
                    {
                        foreach (var item in SolicitudCH)
                        {
                            Solicitud.Add(item);
                        }
                    }


                    ///Obtener ITF
                    var entities = await _dbGen.dbSetUnidadOrganizacional.AsNoTracking()
                   .Where(e => e.ClaveResponsable == clavePersona)
                   .OrderByDescending(e => e.FechaEfectiva)
                   .FirstOrDefaultAsync();
                    if (entities != null)
                    {
                        var claveUnidad = entities.ClaveUnidad;
                        var solicitudesMT = await _db.dbSetInformeTFs
                            .Include(x => x.Proyecto)
                            .AsNoTracking()
                            .Where(e => e.Proyecto.UnidadOrganizacionalId.Equals(claveUnidad) && e.EstadoITFFlujoId == 1)
                          .ToListAsync();

                        if (solicitudesMT.Count > 0)
                        {
                            Notificacion itm = new Notificacion();
                            itm.Nombre = "Informe técnico final";
                            itm.Contador = solicitudesMT.Count();
                            itm.State = url + "/indexMT.html#/Solicitudes/ITF";
                            Solicitud.Add(itm);

                        }
                    }


                    var SolicitudGI = await _ctxGI.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 8)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.ClaveUnidadAut == persona.ClaveUnidad)
                                                    .GroupBy(e => e.TipoInformacionId)
                                                        .Select(y => new Notificacion
                                                        {
                                                            Nombre = y.FirstOrDefault().TipoInformacion.Descripcion,
                                                            Contador = y.Count(),
                                                            State = url + "/indexGI.html#/solicitudesGI"
                                                        })
                                                        .AsNoTracking()
                                                        .ToListAsync();
                    if (SolicitudGI.Count > 0)
                    {
                        foreach (var item in SolicitudGI)
                        {
                            Solicitud.Add(item);
                        }
                    }

                    var _oportunidadNegocios = await _dbCR.OportunidadNegocio
                       .Where(a => a.ClaveUnidad == persona.ClaveUnidad && (a.EstadoFlujoONId == 5 || a.EstadoFlujoONId == 11))
                       .AsNoTracking().ToListAsync();
                    if (_oportunidadNegocios.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "ON por asignar";
                        aux.Contador = _oportunidadNegocios.Count();
                        aux.State = url + "/indexCR.html#/oportunidadesPorAsignar";
                        Solicitud.Add(aux);
                    }

                    var solicitudesAcceso = await _dbGen.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.unidadAutorizadoraId == persona.ClaveUnidad && (x.EstadoFlujoId == 8 || x.EstadoFlujoId == 11))
                    .Include(x => x.TipoInformacion)
                    .Include(x => x.EstadoFlujo)
                    .ToListAsync();

                    if (solicitudesAcceso.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "Solicitudes acceso";
                        aux.Contador = solicitudesAcceso.Count();
                        aux.State = url + "/indexMT.html#/SolicitudesAcceso";
                        Solicitud.Add(aux);
                    }


                }

                // if (roll == 5)
                // {
                //     var persona = await _personaRepo.GetByClaveFechaEfectiva(clavePersona);
                //     var _oportunidadNegocios = await _dbCR.OportunidadNegocio
                //        .Where(a => a.ClaveUnidad == persona.ClaveUnidad && (a.EstadoFlujoONId == 5 || a.EstadoFlujoONId == 11))
                //        .AsNoTracking().ToListAsync();
                //     if (_oportunidadNegocios.Count > 0)
                //     {
                //         Notificacion aux = new Notificacion();
                //         aux.Nombre = "ON por asignar";
                //         aux.Contador = _oportunidadNegocios.Count();
                //         aux.State = url + "/indexCR.html#/oportunidadesPorAsignar";
                //         Solicitud.Add(aux);
                //     }
                // }

                if (roll == 2)
                {
                    var itf = await _db.dbSetSolicitudRevisionITF
                        .Include(x => x.InformeTecnicoFinal.Proyecto)
                        .AsNoTracking()
                        .Where(e => (e.InformeTecnicoFinal.EstadoITFFlujoId == 2 && e.EstadoSolicitudId == 2))
                      .ToListAsync();
                    if (itf.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "Informe técnico final";
                        aux.Contador = itf.Count();
                        aux.State = url + "/indexMT.html#/Solicitudes/ITFMT";


                        Solicitud.Add(aux);
                    }
                }

                if (roll == 19)
                {
                    var SolicitudCP = await _ctx.Solicitud.Where(e => e.TipoInformacionId == 18)
                    .Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
                                                    .AsNoTracking()
                                                    .ToListAsync();

                    if (SolicitudCP.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "Curso impartido";
                        aux.Contador = SolicitudCP.Count();
                        aux.State = url + "/indexCH.html#/solicitudescp";
                        Solicitud.Add(aux);
                    }

                }

                if (roll == 1026)
                {
                    Solicitud = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
                                                       .Where(e => e.TipoInformacionId != 18)
                                                       .Where(e => e.TipoInformacionId != 21)
                                                       .Where(e => e.tipoPersonal_Id.Equals("ADM") || e.tipoPersonal_Id.Equals("SIN"))
                                                       .Include(e => e.TipoInformacion)
                                                       .GroupBy(e => e.TipoInformacionId)
                                                       .Select(y => new Notificacion
                                                       {
                                                           Nombre = y.FirstOrDefault().TipoInformacion.Descripcion,
                                                           Contador = y.Count(),
                                                           State = url + "/indexCH.html#/solicitudesrh"
                                                       })
                                                       .AsNoTracking()
                                                       .ToListAsync();
                }

                if (roll == 1028)
                {
                    Solicitud = await _ctxGI.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 14)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.TipoInformacionId != 30)
                                                    .GroupBy(e => e.TipoInformacionId)
                                                       .Select(y => new Notificacion
                                                       {
                                                           Nombre = y.FirstOrDefault().TipoInformacion.Descripcion,
                                                           Contador = y.Count(),
                                                           State = url + "/indexGI.html#/solicitudesGI"
                                                       })
                                                       .AsNoTracking()
                                                       .ToListAsync();


                    var entities = await _ctxGI.DbSetProductoGI.AsNoTracking()
                        .Where(x => x.EstadoFlujoId == 3 && (x.EstadoFlujoComite == 16 || x.EstadoFlujoComite == 17))
                        .AsNoTracking()
                        .ToListAsync();

                    if (entities.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "Factor de innovación";
                        aux.Contador = entities.Count();
                        aux.State = url + "/IndexGI.html#/productoFI";
                        Solicitud.Add(aux);
                    }

                }
                if (roll == 1029)
                {

                    var solpend = await _evaluadorRepo.GetByClave(clavePersona);
                    List<string> ids = solpend.Select(x => Convert.ToString(x.IdeaInnovadoraId)).ToList();
                    Solicitud = await _ctxGI.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 14)
                    .Where(x => x.TipoInformacionId == 28)
                    .Where(x => ids.Contains(x.InformacionId))
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.TipoInformacionId != 30)
                                                    .GroupBy(e => e.TipoInformacionId)
                                                       .Select(y => new Notificacion
                                                       {
                                                           Nombre = y.FirstOrDefault().TipoInformacion.Descripcion,
                                                           Contador = y.Count(),
                                                           State = url + "/indexGI.html#/solicitudesGI"
                                                       })
                                                       .AsNoTracking()
                                                       .ToListAsync();
                }

                if (roll == 15)
                {
                    var _oportunidadNegocios = await _dbCR.OportunidadNegocio
                        .Include(em => em.Empresa)
                        .Where(o => o.EstadoFlujoONId == 4 || o.EstadoFlujoONId == 13)
                        .Where(a => a.Investigador == null && a.Especialista == null && a.Responsable == null)
                        .AsNoTracking().ToListAsync();

                    if (_oportunidadNegocios.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "ON por asignar";
                        aux.Contador = _oportunidadNegocios.Count();
                        aux.State = url + "/indexCR.html#/asignarOportunidad";
                        Solicitud.Add(aux);
                    }
                }

                if (roll == 1025)
                {
                    var _oportunidadNegocios = await _dbCR.OportunidadNegocio
                   .Where(a => (a.EstadoFlujoONId == 3 || a.EstadoFlujoONId == 12 || a.EstadoFlujoONId == 10) && a.Especialista == clavePersona)
                   .AsNoTracking().ToListAsync();

                    if (_oportunidadNegocios.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "ON por asignar";
                        aux.Contador = _oportunidadNegocios.Count();
                        aux.State = url + "/indexCR.html#/misOportunidadesAsignadas";
                        Solicitud.Add(aux);
                    }
                }

                //Aqui van las consultas que no tienen rol
                List<int> productosGIId = await _ctxGI.DbSetProductoGIEvaluadores.AsNoTracking()
                    .Include(x => x.MiembrosGI)
                    .Include(x => x.ProductoGI)
                    .Where(x => x.MiembrosGI.ClavePersona == clavePersona && x.ProductoGI.EstadoFlujoComite == 16)
                    .Select(x => x.ProductoGIId)
                    .ToListAsync();
                if (productosGIId.Count > 0)
                {
                    var registrosSolitariosFI = await _ctxGI.DbSetProductoGISolicitud.AsNoTracking()
                    .Where(x => productosGIId.Contains(x.ProductoId))
                    .ToListAsync();

                    if (registrosSolitariosFI.Count > 0)
                    {
                        Notificacion aux = new Notificacion();
                        aux.Nombre = "Factor de innovación";
                        aux.Contador = registrosSolitariosFI.Count();
                        aux.State = url + "/IndexGI.html#/productoFI";
                        Solicitud.Add(aux);
                    }
                }

                var onAsignadasEmpleados = await _dbCR.OportunidadNegocio.Where(e => e.Investigador == clavePersona && e.EstadoFlujoONId == 7).AsNoTracking().ToListAsync();
                if (onAsignadasEmpleados.Count() > 0)
                {

                    Notificacion aux = new Notificacion();
                    aux.Nombre = "ONs asignadas";
                    aux.Contador = onAsignadasEmpleados.Count();
                    aux.State = url + "/indexCR.html#/misOportunidadesAsignadas";
                    Solicitud.Add(aux);


                }


                return Solicitud.OrderBy(e => e.Nombre);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
