using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.PI;
using INEEL.DataAccess.GEN.Repositories.CH;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class PropiedadIndustrialRepository : IDisposable
    {
        PI_Context _pictx;
        public void Dispose()
        {
            _pictx.Dispose();
        }

        public PropiedadIndustrialRepository()
        {
            _pictx = new PI_Context();
        }

        public async Task<IEnumerable<PropiedadIndustrial>> GetAll()
        {
            try
            {
                var propiedadin = await _pictx.PropiedadIndustrial
                    .AsNoTracking()
                    .ToListAsync();
                return propiedadin;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PropiedadIndustrial>> GetForCV(string id)
        {
            try
            {
                var result = await _pictx.AutoresPI.Where(e => e.ClavePersona.Equals(id))
                                        .AsNoTracking()
                                        .ToListAsync();
                List<int> lista = result.Select(x => x.PropiedadIndustrialId).ToList();

                var result2 = await _pictx.PropiedadIndustrial.Where(e => lista.Contains(e.PropiedadIndustrialId))
                    .Where(e => e.EstadoFlujoId == 3)
                    .Include(e => e.TipoPropiedadIndustrial)
                    .Include(e => e.EstadoDelProceso)
                    .AsNoTracking().ToListAsync();

                return result2;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task<Object> GetPropiedadIndustrialForDetailsBusqueda(busquedaAv parametro)
        {
            try
            {
                List<int> listaIds = new List<int>();
                var listaPreliminar = parametro.FieldD.Split(',').ToList();
                listaPreliminar.Remove("");
                listaIds = listaPreliminar.Select(int.Parse).ToList();

                var resultados = await _pictx.PropiedadIndustrial.Where(e => listaIds.Contains(e.PropiedadIndustrialId)).AsNoTracking()
                .Select(x => new {
                    id = x.PropiedadIndustrialId,
                    Nombre = x.Titulo,
                }).ToListAsync();

                return resultados;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
            
        }


        public async Task<Int32> GetAllPropiedadInstitutoCount()
        {
            try
            {
                var propiedadindustrial = await (from pi in _pictx.PropiedadIndustrial
                                                 where pi.EsPropiedadInstituto == true
                                                 && pi.Completo == true
                                                 && pi.EstadoFlujoId == 3
                                                 select pi)
                                           .AsNoTracking()
                                           .CountAsync();

                return propiedadindustrial;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtener todos los derechos de autor para modal
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetAllPropiedadInstitutoModal()
        {
            try
            {


                var propiedadindustrial = await (from pi in _pictx.PropiedadIndustrial
                                                 where pi.EsPropiedadInstituto == true
                                                 select pi)
                                                 .Include(e => e.TipoPropiedadIndustrial)
                                           .AsNoTracking()
                                           .ToListAsync();


                return propiedadindustrial;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener todos los derechos de autor
        public async Task<IEnumerable<Object>> GetAllPropiedadInstituto()
        {
            try
            {
                GEN_Context _gen = new GEN_Context();
                var unidadesId = await (_pictx.DerechosAutor
                    .Where(e => e.ClaveUnidad != "")
                    .Select(e => e.ClaveUnidad))
                    .AsNoTracking().ToListAsync();

                var unidades = await _gen.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => unidadesId.Contains(x.ClaveUnidad) //)
                                    && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                    .ToListAsync();
                var propiedadindustrial = await (from pi in _pictx.PropiedadIndustrial
                                                 where pi.EsPropiedadInstituto == true
                                                 select pi)
                                                 .Include(e => e.EstadoDelProceso)
                                                 .Include(e => e.TipoPropiedadIndustrial)
                                                 .Include(e => e.EstadoDelProceso)
                                                 .Include(e => e.Inventores)
                                           .AsNoTracking()
                                           .ToListAsync();
                if (propiedadindustrial != null)
                {


                    foreach (var prop in propiedadindustrial)
                    {
                        if (prop.ClaveUnidad != null)
                        {
                            prop.UnidadOrganizacional = (from unidad in unidades
                                                         where unidad.ClaveUnidad == prop.ClaveUnidad
                                                         select unidad).FirstOrDefault();
                        }

                        if (prop.NumeroProyecto != null)
                        {
                            prop.Proyecto = await (from proyecto in _gen.dbSetProyectoGEN
                                                   where proyecto.ProyectoId == prop.NumeroProyecto
                                                   select proyecto)
                                                   .FirstOrDefaultAsync();
                        }
                    }

                }

                return propiedadindustrial;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllPropiedadInstitutoReporte(PropiedadIndustrial parametros)
        {
            try
            {

                GEN_Context _gen = new GEN_Context();
                var unidadesId = await (_pictx.DerechosAutor
                    .Where(e => e.ClaveUnidad != "")
                    .Select(e => e.ClaveUnidad))
                    .AsNoTracking().ToListAsync();

                var unidades = await _gen.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => unidadesId.Contains(x.ClaveUnidad) //)
                                    && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                    .ToListAsync();




                var propiedadindustrial = (from pi in _pictx.PropiedadIndustrial.AsNoTracking()
                                                .Include(e => e.EstadoDelProceso)
                                                .Include(e => e.TipoPropiedadIndustrial)
                                                .Include(e => e.EstadoDelProceso)
                                                .Include(e => e.Inventores)
                                                .Where(e => e.EsPropiedadInstituto == true)
                                           select pi);


                if (propiedadindustrial != null)
                {

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        propiedadindustrial = propiedadindustrial.Where(e => (DbFunctions.TruncateTime(e.FechaExpedicion) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion)
                                                                             && DbFunctions.TruncateTime(e.FechaExpedicion) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion))
                                                                            || e.FechaExpedicion == null);
                    }
                    if (!String.IsNullOrEmpty(parametros.Titulo))
                    {
                        var listaPI = await GetPILikeNombreLatin1(parametros.Titulo);
                        propiedadindustrial = propiedadindustrial.Where(e => listaPI.Contains(e.PropiedadIndustrialId));
                    }

                    if (!String.IsNullOrEmpty(parametros.NumeroProyecto))
                    {
                        propiedadindustrial = propiedadindustrial.Where(e => e.NumeroProyecto.Contains(parametros.NumeroProyecto));
                    }

                    if (!String.IsNullOrEmpty(parametros.nombrePersona))
                    {
                        var listaPersonas = await GetAutoresByPILikeNombreLatin1(parametros.nombrePersona);
                        List<int> ids = listaPersonas.Select(x => Convert.ToInt32(x)).ToList();
                        propiedadindustrial = propiedadindustrial.Where(e => listaPersonas.Contains(e.PropiedadIndustrialId));
                    }

                    if (parametros.TipoPropiedadIndustrialId != 0)
                    {
                        propiedadindustrial = propiedadindustrial.Where(e => e.TipoPropiedadIndustrialId == parametros.TipoPropiedadIndustrialId);
                    }

                    if (!String.IsNullOrEmpty(parametros.ClaveUnidad))
                    {
                        propiedadindustrial = propiedadindustrial.Where(e => e.ClaveUnidad == parametros.ClaveUnidad);
                    }

                    if (parametros.EstadoDelProcesoId != 0)
                    {
                        propiedadindustrial = propiedadindustrial.Where(e => e.EstadoDelProcesoId == parametros.EstadoDelProcesoId);
                    }

                    List<BusquedaParams> datos = propiedadindustrial.Select(x => new BusquedaParams
                    {
                        propiedadIndustrialId = x.PropiedadIndustrialId,
                        ConsecutivoInterno = x.ConsecutivoInterno,
                        Titulo = x.Titulo,
                        NumeroProyecto = x.NumeroProyecto,
                        inventores = x.Inventores,
                        tipoPropiedadIndustrial = x.TipoPropiedadIndustrial.Descripcion,
                        fechaExpedicion2 = x.FechaExpedicion,
                        // unidadOrganizacional = x.UnidadOrganizacional.NombreUnidad,
                        estadoDelProceso = x.EstadoDelProceso.Descripcion,
                        expediente = x.Expediente,
                        fechaPresentacion = x.FechaPresentacion,
                        fechaVencimiento = x.FechaVencimiento,
                        fechaProximoPago = x.FechaProximoPago,
                        numeroTitulo = x.NumeroTitulo,
                        fechaInicioTramite = x.FechaInicioTramite,
                        licenciado = x.Licenciado,
                        ClaveUnidad = x.ClaveUnidad,
                        Observaciones=x.Observaciones
                    }).ToList();

                    foreach (var prop in datos)
                    {
                        if (prop.ClaveUnidad != null)
                        {
                            prop.UnidadOrganizacional = (from unidad in unidades
                                                         where unidad.ClaveUnidad == prop.ClaveUnidad
                                                         select unidad).FirstOrDefault();
                        }

                        if (prop.NumeroProyecto != null)
                        {
                            prop.Proyecto = await (from proyecto in _gen.dbSetProyectoGEN.AsNoTracking()
                                                   where proyecto.ProyectoId == prop.NumeroProyecto
                                                   select proyecto.Nombre)
                                                   .FirstOrDefaultAsync();
                        }
                    }

                    return datos;

                }

                return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetAutoresByPILikeNombreLatin1(String likeNombre)
        {
            try
            {

                var resultados = await _pictx.Database.SqlQuery<int>
                ("SELECT PropiedadIndustrialId FROM PI.tab_AutoresPI where Nombre collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();


                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetPILikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PropiedadIndustrialId FROM PI.tab_PropiedadIndustrial where Titulo collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Titulo collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _pictx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener PI por proyecto
        public async Task<IEnumerable<Object>> GetByProyecto(string id)
        {
            try
            {

                var propiedadindustrial = await _pictx.PropiedadIndustrial.Where(e => e.EsPropiedadInstituto == true && e.NumeroProyecto == id)
                    .Include(e => e.TipoPropiedadIndustrial)
                    .Select(x => new
                    {
                        Titulo = x.Titulo,
                        FechaExpedicion = x.FechaExpedicion,
                        Tipo = x.TipoPropiedadIndustrial.Descripcion,
                        Observaciones = x.Observaciones,
                        PropiedadIndustrialId = x.PropiedadIndustrialId


                    }).AsNoTracking().ToListAsync();

                return propiedadindustrial;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        //Obtener DA por id 
        public async Task<PropiedadIndustrial> GetById(int propiedadindustrialid)
        {
            try
            {

                var propiedadindustrial = await (from da in _pictx.PropiedadIndustrial
                                                 where da.PropiedadIndustrialId == propiedadindustrialid
                                                 select da).Include(e => e.Inventores)
                                          .Include(e => e.EstadoFlujo)
                                          .AsNoTracking()
                                          .FirstOrDefaultAsync();
                GEN_Context _gen = new GEN_Context();
                if (propiedadindustrial != null && propiedadindustrial.ClaveUnidad != null)
                {
                    propiedadindustrial.UnidadOrganizacional = (from unidad in _gen.dbSetUnidadOrganizacional
                                                                where unidad.ClaveUnidad == propiedadindustrial.ClaveUnidad
                                                                && unidad.FechaEfectiva == (from uni in _gen.dbSetUnidadOrganizacional
                                                                                            where uni.ClaveUnidad == unidad.ClaveUnidad
                                                                                            select uni)
                                                                                            .Max(e => e.FechaEfectiva)
                                                                select unidad
                                                               ).FirstOrDefault();
                }

                if (propiedadindustrial != null && propiedadindustrial.NumeroProyecto != null)
                {
                    propiedadindustrial.Proyecto = await (from proyecto in _gen.dbSetProyectoGEN
                                                          where proyecto.ProyectoId == propiedadindustrial.NumeroProyecto
                                                          select proyecto)
                                           .FirstOrDefaultAsync();
                }
                return propiedadindustrial;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }


        //Obtener DA por clave de persona 
        public async Task<Object> GetByClavePersona(string clavepersona)
        {
            try
            {
                var das = await (from da in _pictx.AutoresPI
                                 where da.ClavePersona.Equals(clavepersona) 
                                 select new
                                 {
                                     PropiedadIndustrialId = da.PropiedadIndustrialId,
                                     Titulo = da.PropiedadIndustrial.Titulo,
                                     Tipo = da.PropiedadIndustrial.TipoPropiedadIndustrial,
                                     EstadoFlujo = da.PropiedadIndustrial.EstadoFlujo,
                                     FechaValidacion = da.PropiedadIndustrial.FechaValidacion,
                                     SeEdita = !da.PropiedadIndustrial.EsPropiedadInstituto,
                                     ClavePersona= da.PropiedadIndustrial.ClavePersona
                                 })
                                  .AsNoTracking()
                                  .ToListAsync();

                foreach (var item in das)
                {
                    if (item.EstadoFlujo.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }

                return das;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetByClaveAutorWithCoAutores(string clave)
        {
            try
            {
                //Primero obtenemos la lista de capitulos registrados por el usuario buscado
                List<PropiedadIndustrial> lista= new List<PropiedadIndustrial>();
                var registros= await _pictx.PropiedadIndustrial.Where(e=> e.ClavePersona==clave)
                                .Include(e => e.EstadoFlujo)
                                .Include(e=> e.TipoPropiedadIndustrial)
                                .AsNoTracking().ToListAsync();
                lista.AddRange(registros);

                //Despues obtenemos la lista de capitulos registrados por el usuario como CO-AUTOR
                var primaryKeys= registros.Select(x=> x.PropiedadIndustrialId);
                var listaCoAutores= await _pictx.AutoresPI.AsNoTracking().Where(e=> e.ClavePersona==clave && !primaryKeys.Contains(e.PropiedadIndustrialId)).Select(x=> x.PropiedadIndustrialId).ToListAsync();
                var registrosCoautores= await _pictx.PropiedadIndustrial.Where(e=> listaCoAutores.Contains(e.PropiedadIndustrialId) && (e.EstadoFlujoId==3  || e.EstadoFlujoId==2) )
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e=> e.TipoPropiedadIndustrial)
                                            .AsNoTracking().ToListAsync();
                lista.AddRange(registrosCoautores);

                foreach (var item in lista)
                {
                    if (item.EstadoFlujo.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }

                return lista;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetPropiedadIndustrialPorPersona(string clavepersona)
        {
            try
            {
                var das = await (from da in _pictx.AutoresPI
                                 where da.ClavePersona.Equals(clavepersona)
                                 select new
                                 {
                                     PropiedadIndustrialId = da.PropiedadIndustrialId,
                                     Titulo = da.PropiedadIndustrial.Titulo,
                                     Tipo = da.PropiedadIndustrial.TipoPropiedadIndustrial.Descripcion,
                                     EstadoFlujo = da.PropiedadIndustrial.EstadoFlujo.EstadoFlujoId,
                                     FechaValidacion = da.PropiedadIndustrial.FechaValidacion,
                                     fechaExpedicion = da.PropiedadIndustrial.FechaExpedicion,
                                     espropiedadInst = da.PropiedadIndustrial.EsPropiedadInstituto,
                                     completo = da.PropiedadIndustrial.Completo
                                 })
                                  .AsNoTracking()
                                  .ToListAsync();

                return das;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }



        public async Task<string> Update(PropiedadIndustrial propiedadindustrial)
        {
            try
            {

                string mensaje = "Registro actualizado exitosamente!";
                var _propiedadindustrial = await _pictx.PropiedadIndustrial.FirstOrDefaultAsync(e => e.PropiedadIndustrialId == propiedadindustrial.PropiedadIndustrialId);
                if(_propiedadindustrial.AdjuntoId!=null && _propiedadindustrial != null && (!String.IsNullOrEmpty(propiedadindustrial.accion) && propiedadindustrial.accion == "elimina"))
                {
                    var id = _propiedadindustrial.AdjuntoId;
                    _propiedadindustrial.AdjuntoId = null;
                    await _pictx.SaveChangesAsync();

                    await new AdjuntoRepository().Delete(id);
                    
                }
                if (propiedadindustrial.EsPropiedadInstituto)
                {
                    propiedadindustrial.EstadoFlujoId = 3;
                }
                if (propiedadindustrial.Adjunto != null)
                {
                    if (propiedadindustrial.Adjunto.AdjuntoId == 0)
                    {
                        Adjunto key = await new AdjuntoRepository().CreateAd(propiedadindustrial.Adjunto);
                        propiedadindustrial.AdjuntoId = key.AdjuntoId;
                        propiedadindustrial.Adjunto.AdjuntoId = key.AdjuntoId;
                    }
                }
                var autores = await _pictx.AutoresPI.Where(e => e.PropiedadIndustrialId == propiedadindustrial.PropiedadIndustrialId).ToListAsync();
                if (autores.Count > 0)
                {
                    _pictx.AutoresPI.RemoveRange(autores);
                    await _pictx.SaveChangesAsync();
                }
                if (propiedadindustrial.Inventores.Count > 0)
                {
                    foreach (var autor in propiedadindustrial.Inventores)
                    {
                        autor.PropiedadIndustrialId = propiedadindustrial.PropiedadIndustrialId;
                    }
                    _pictx.AutoresPI.AddRange(propiedadindustrial.Inventores);
                    await _pictx.SaveChangesAsync();
                }

                
                if (_propiedadindustrial != null)
                {
                    _pictx.Entry(_propiedadindustrial).State = EntityState.Modified;
                    if (propiedadindustrial.EstadoFlujoId == 3 && propiedadindustrial.EsPropiedadInstituto == false)
                    {
                        DateTime hoy = DateTime.Now;
                        propiedadindustrial.FechaValidacion = hoy;
                    }
                    _pictx.Entry(_propiedadindustrial).CurrentValues.SetValues(propiedadindustrial);

                    await _pictx.SaveChangesAsync();
                }
                _propiedadindustrial = await _pictx.PropiedadIndustrial
                    .Include(e => e.EstadoFlujo)
                    .Include(e => e.TipoPropiedadIndustrial)
                    .FirstOrDefaultAsync(e => e.PropiedadIndustrialId == propiedadindustrial.PropiedadIndustrialId);
                _propiedadindustrial.Justificacion = propiedadindustrial.Justificacion;
                if (_propiedadindustrial.EstadoFlujoId == 2)
                {
                    if (!String.IsNullOrEmpty(propiedadindustrial.listacoautores))
                    {
                        _propiedadindustrial.listacoautores = propiedadindustrial.listacoautores;
                    }
                    await FlujoEstado2(_propiedadindustrial);

                }
                if (propiedadindustrial.Rechazar)
                {
                    if (!String.IsNullOrEmpty(propiedadindustrial.listacoautores))
                    {
                        _propiedadindustrial.listacoautores = propiedadindustrial.listacoautores;
                    }
                    await Rechazar(_propiedadindustrial);
                    mensaje = "Solicitud rechazada!";
                }
                if (propiedadindustrial.Aprobar)
                {
                    if (!String.IsNullOrEmpty(propiedadindustrial.listacoautores))
                    {
                        _propiedadindustrial.listacoautores = propiedadindustrial.listacoautores;
                    }
                    await Aprobar(_propiedadindustrial);
                    mensaje = "Solicitud aprobada!";
                }


                return mensaje;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task FlujoEstado2(PropiedadIndustrial _propiedadindustrial)
        {
            var nuevasolicitud = await this.GeneraSolicitud(_propiedadindustrial);

            if (nuevasolicitud != null && nuevasolicitud.SolicitudId > 0)
            {
                //crear registro bitacora 
                var bitacora = RegistraBitacora(nuevasolicitud.SolicitudId, nuevasolicitud.ClavePersona, "Se envió la solicitud", 1, 0);
            }

            await EnviarNotificacion(nuevasolicitud.ClavePersona, _propiedadindustrial);
        }

        private async Task CreaNuevoOC(PropiedadIndustrial _propiedadindustrial)
        {
            try
            {
                await new NuevoOCRepository().Create(
                           new NuevoOC("CH",
                                      "PI",
                           _propiedadindustrial.Titulo,
                           "IndexCH.html#/detallespiexterno/" + _propiedadindustrial.PropiedadIndustrialId + "/",
                           _propiedadindustrial.PropiedadIndustrialId + ""
                           ));
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e.InnerException);
            }

        }
        private async Task Rechazar(PropiedadIndustrial pin)
        {
            try
            {
                Solicitud solicitud = new Solicitud()
                {
                    TipoInformacionId = 16,
                    InformacionId = pin.PropiedadIndustrialId.ToString()
                };
                SolicitudRepository sol = new SolicitudRepository();
                var existe = await sol.existe(solicitud.TipoInformacionId, solicitud.InformacionId);
                if (existe != null)
                {
                    existe.EstadoFlujoId = 1;
                    solicitud = await sol.UpdateEstadoActualizacion(existe);

                    //registra bitacora 

                    await RegistraBitacora(existe.SolicitudId, existe.ClavePersona, "Rechazado: " + pin.Justificacion, 2, 1);
                }



                //enviar correo de rechazo
                await Notifica(pin, "Rechazada");


            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e.InnerException);
            }
        }


        private async Task Aprobar(PropiedadIndustrial pin)
        {
            try
            {
                Solicitud solicitud = new Solicitud()
                {
                    TipoInformacionId = 16,
                    InformacionId = pin.PropiedadIndustrialId.ToString()
                };
                SolicitudRepository sol = new SolicitudRepository();
                var existe = await sol.existe(solicitud.TipoInformacionId, solicitud.InformacionId);
                if (existe != null)
                {
                    existe.EstadoFlujoId = 3;
                    solicitud = await sol.UpdateEstadoActualizacion(existe);
                    //registra bitacora 

                    await RegistraBitacora(existe.SolicitudId, existe.ClavePersona, "Aprobado: " + pin.Justificacion, existe.EstadoFlujoId, 1);

                }



                //enviar correo de rechazo
                await Notifica(pin, "Aprobada");

                await CreaNuevoOC(pin);

            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e.InnerException);
            }
        }

        private async Task<Solicitud> GeneraSolicitud(PropiedadIndustrial pi)
        {

            try
            {
                DateTime hoy = DateTime.Now;
                Solicitud solicitud = new Solicitud()
                {
                    ClavePersona = pi.ClavePersona,
                    TipoInformacionId = 16,
                    InformacionId = pi.PropiedadIndustrialId.ToString(),
                    FechaSolicitud = hoy,
                    EstadoFlujoId = pi.EstadoFlujoId,
                    titulo = pi.Titulo
                };
                SolicitudRepository sol = new SolicitudRepository();
                var existe = await sol.existe(solicitud.TipoInformacionId, solicitud.InformacionId);
                if (existe == null)
                {
                    solicitud = await sol.Create(solicitud);
                }
                else
                {
                    existe.EstadoFlujoId = 2;
                    solicitud = await sol.UpdateEstadoActualizacion(existe);
                }

                return solicitud;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        private async Task RegistraBitacora(int solicitudId, string clavepersona, string descripcion, int estadoflujo, int idrol)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                BitacoraSolicitudes bitacora = new BitacoraSolicitudes()
                {
                    SolicitudId = solicitudId,
                    FechaMovimiento = hoy,
                    ClavePersona = clavepersona,
                    Descripcion = descripcion,
                    EstadoFlujoId = estadoflujo,
                    idRol = idrol
                };
                using (BitacoraSolicitudesRepository _bitacora = new BitacoraSolicitudesRepository())
                {
                    var regbitacora = await _bitacora.Create(bitacora);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EnviarNotificacion(string clavepersona)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Correo correo = new Correo()
                {
                    Modulo = "Capital Humano",
                    ClavePersona = clavepersona,
                    TipoCorreo = "1",
                    Seccion = "Propiedad Industrial"
                };
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();
                var result = await send.Send(correo, conf);
                if (!result)
                {
                    throw new Exception("No se pudo enviar el correo!");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task EnviarNotificacion(string clavepersona, PropiedadIndustrial p)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Correo correo = new Correo()
                {
                    Modulo = "Capital Humano",
                    ClavePersona = clavepersona,
                    TipoCorreo = "1",
                    Seccion = "Propiedad Industrial",
                    coautores=p.listacoautores
                };
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();
                var result = await send.Coautores(correo, conf);
                if (!result)
                {
                    throw new Exception("No se pudo enviar el correo!");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task Notifica(PropiedadIndustrial pin, string mailestado)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Correo correo = new Correo()
                {
                    Modulo = "Capital Humano",
                    ClavePersona = pin.ClavePersona,
                    TipoCorreo = "2",
                    Seccion = "Propiedad Industrial",
                    Descripcion1 = "<b>Titulo:</b> " + pin.Titulo + "<br/>",
                    Descripcion2 = "<b>Tipo de Propiedad:</b> " + pin.TipoPropiedadIndustrial.Descripcion + "<br/>",
                    Descripcion3 = "<b>Estado:</b> " + pin.EstadoFlujo.Descripcion + "<br/>",
                    Descripcion4 = "",
                    Justificacion = pin.Justificacion,
                    Estado = mailestado,
                    coautores = pin.listacoautores
                };
                getCorreoConfig conf = new getCorreoConfig();
                SendCorreo send = new SendCorreo();
                var result = await send.Coautores(correo, conf);
                if (!result)
                {
                    throw new Exception("No se pudo enviar el correo!");
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(PropiedadIndustrial propiedadindustrial)
        {
            try
            {
                propiedadindustrial.EsPropiedadInstituto = true;
                propiedadindustrial.EstadoFlujoId = 3;
                _pictx.PropiedadIndustrial.Add(propiedadindustrial);
                await _pictx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CreateCH(PropiedadIndustrial propiedadindustrial)
        {
            try
            {
                propiedadindustrial.EsPropiedadInstituto = false;
                propiedadindustrial.EstadoFlujoId = 1;
                _pictx.PropiedadIndustrial.Add(propiedadindustrial);
                await _pictx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _pictx.PropiedadIndustrial.FirstOrDefaultAsync(e => e.PropiedadIndustrialId == id);
                if (_model != null)
                {
                    _pictx.PropiedadIndustrial.Remove(_model);
                    await _pictx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Object> GetDatosGrafica()
        {
            try
            {

                List<string> etiquetas = new List<string>();
                List<object> resultados = new List<object>();
                List<object> vigentes = new List<object>();
                List<object> tramite = new List<object>();
                List<object> leyendas = new List<object>();



                var _tipos = await _pictx.TipoPropiedadIndustrial.Where(e => e.Estado == true).OrderBy(e => e.prioridadOrdenamiento).ToListAsync();



                foreach (var tipo in _tipos)
                {
                    string descTipoProp = tipo.Descripcion;

                    //contabiliza las propiedades industriales vigentes de acuerdo a la categoria
                    var cont_vigente = (from prop in _pictx.PropiedadIndustrial where prop.EsPropiedadInstituto == true && prop.TipoPropiedadIndustrialId == tipo.TipoPropiedadIndustrialId && prop.EstadoDelProcesoId == 4 select prop.EstadoDelProcesoId).Count();

                    //contabiliza las propiedades industriales en tramite de acuerdo a la categoria
                    var cont_tramite = (from prop in _pictx.PropiedadIndustrial where prop.EsPropiedadInstituto == true && prop.TipoPropiedadIndustrialId == tipo.TipoPropiedadIndustrialId && prop.EstadoDelProcesoId == 3 select prop.EstadoDelProcesoId).Count();


                    var datosVigentes = new { etiqueta = descTipoProp, cantidad = cont_vigente };
                    var datosTramite = new { etiqueta = descTipoProp, cantidad = cont_tramite };

                    vigentes.Add(datosVigentes);
                    tramite.Add(datosTramite);


                    etiquetas.Add(descTipoProp);

                }


                var resultado = new { tramite = tramite, vigente = vigentes };

                return resultado;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //Obtener DA por id  incluye tipo propiedad industrial
        public async Task<PropiedadIndustrial> GetByIdYTipoPropiedad(int propiedadindustrialid)
        {
            try
            {

                var propiedadindustrial = await (from da in _pictx.PropiedadIndustrial
                                                 where da.PropiedadIndustrialId == propiedadindustrialid
                                                 select da).Include(e => e.Inventores).Include(e => e.TipoPropiedadIndustrial).Include(e => e.Adjunto)
                                          .Include(e => e.EstadoFlujo)
                                          .AsNoTracking()
                                          .FirstOrDefaultAsync();
                GEN_Context _gen = new GEN_Context();
                if (propiedadindustrial != null && propiedadindustrial.ClaveUnidad != null)
                {
                    propiedadindustrial.UnidadOrganizacional = (from unidad in _gen.dbSetUnidadOrganizacional
                                                                where unidad.ClaveUnidad == propiedadindustrial.ClaveUnidad
                                                                && unidad.FechaEfectiva == (from uni in _gen.dbSetUnidadOrganizacional
                                                                                            where uni.ClaveUnidad == unidad.ClaveUnidad
                                                                                            select uni)
                                                                                            .Max(e => e.FechaEfectiva)
                                                                select unidad
                                                               ).FirstOrDefault();
                }

                if (propiedadindustrial != null && propiedadindustrial.NumeroProyecto != null)
                {
                    propiedadindustrial.Proyecto = await (from proyecto in _gen.dbSetProyectoGEN
                                                          where proyecto.ProyectoId == propiedadindustrial.NumeroProyecto
                                                          select proyecto)
                                           .FirstOrDefaultAsync();
                }
                return propiedadindustrial;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }




    }
}