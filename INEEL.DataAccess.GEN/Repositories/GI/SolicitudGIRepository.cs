using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class SolicitudGIRepository : IDisposable
    {
        public void Dispose() { _ctx.Dispose(); }
        GI_Context _ctx;
        public SolicitudGIRepository()
        {
            _ctx = new GI_Context();
            //_ctx.Database.Log = Escribe.Write;
        }

        public async Task<SolicitudGI> GetSolicitudByAttrs(int estadoFlujoId, int tipoInformacionId, string informacionId)
        {
            try
            {

                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == estadoFlujoId &&
                e.TipoInformacionId == tipoInformacionId && e.InformacionId.Equals(informacionId))
                                                    .OrderByDescending(e => e.FechaSolicitud)
                                                    .AsNoTracking()
                                                    .FirstOrDefaultAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudGI>> getAllsolicitudesITF()
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI/*.Where(e => e.EstadoFlujoId == 2 )*/
                                                    .Where(e => e.TipoInformacionId == 21)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<int> GetAllCount(String personaID)
        {
            throw new Exception("CORREGIR CONSULTA");
            //try
            //{
            //    var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => (e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
            //    //&& (e.ClavePersonaAut == null || e.ClavePersonaAut.Equals(personaID))
            //    )
            //                                        .Where(e => e.TipoInformacionId != 18)
            //                                        .Where(e => e.TipoInformacionId != 21)
            //                                        .AsNoTracking()
            //                                        .CountAsync();
            //    return Solicitud;
            //}
            //catch (Exception e)
            //{
            //    throw new Exception(e.Message, e);
            //}
        }
        /// <summary>
        /// pendientes
        /// </summary>
        /// <param name="claveUnidad"></param>
        /// <returns></returns>
        public async Task<IEnumerable<SolicitudGI>> getAllSolicitudesGerenteGI(String claveUnidad)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 8)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x=>x.ClaveUnidadAut==claveUnidad)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudGI>> getAllPendientesAdministradorGI()
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 14)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x=> x.TipoInformacionId!=30)
                                                    .OrderByDescending(x=>x.FechaSolicitud)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<SolicitudGI>> getAllAceptadasAdministradorGI()
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 10)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudGI>> getAllAceptadasGerenteGI(String claveUnidad)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 10)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.ClaveUnidadAut == claveUnidad  && x.TipoInformacionId==30)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudGI>> getAllRechazadasAdministradorGI()
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 15)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudGI>> getAllRechazadasGerenteGI(String claveUnidad)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 15)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.ClaveUnidadAut == claveUnidad && x.TipoInformacionId == 30)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudGI>> GetAllAceptadas()
        {
            throw new Exception("CORREGIR CONSULTA");
            //try
            //{
            //    var entities = await _ctx.DbSetSolicitudGI.AsNoTracking()
            //        .Where(x => x.EstadoFlujoId == 3 || x.EstadoFlujoId == 13)
            //        .Include(e => e.TipoInformacion)
            //        .Include(e => e.EstadoFlujo)
            //         .OrderByDescending(e => e.FechaSolicitud)
            //        .ToListAsync();
            //    entities = entities.Distinct(new ComparerIdInformacionTipo()).ToList();
            //    return entities;


            //}
            //catch (Exception e)
            //{
            //    throw new Exception(e.Message, e);
            //}
        }

        public async Task<IEnumerable<SolicitudGI>> getAllPendientesEvaluadoresGI(List<string> ids)
        {
            try
            {

                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 14)
                    .Where(x=>x.TipoInformacionId==28)
                    .Where(x=>ids.Contains(x.InformacionId))
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.TipoInformacionId != 30)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudGI>> GetAllRechazadas()
        {
            throw new Exception("CORREGIR CONSULTA");
            //try
            //{

            //    var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 1 || e.EstadoFlujoId == 12)
            //                                   .Distinct()
            //                                   .OrderBy(e => e.TipoInformacionId).ThenBy(e => e.InformacionId).ThenBy(e => e.FechaSolicitud)
            //                                   .Include(e => e.TipoInformacion)
            //                                   .Include(e => e.EstadoFlujo)
            //                                   .AsNoTracking()
            //                                   .ToListAsync();
            //    return Solicitud;

            //}
            //catch (Exception e)
            //{
            //    throw new Exception(e.Message, e);
            //}
        }

        public async Task<IEnumerable<SolicitudGI>> getbyId(IEnumerable<BitacoraSolicitudesGI> resultadosBitacoras)
        {
            List<BitacoraSolicitudesGI> Bita = new List<BitacoraSolicitudesGI>();
            List<SolicitudGI> Soli = new List<SolicitudGI>();
            foreach (var item in resultadosBitacoras)
            {
                Bita.Add(item);
            }
            foreach (var item in Bita)
            {
                var Sol = await _ctx.DbSetSolicitudGI.Where(e => e.SolicitudId == item.SolicitudId).Include(e => e.TipoInformacion).Include(e => e.EstadoFlujo).AsNoTracking().FirstOrDefaultAsync();
                if (Sol != null)
                {
                    Soli.Add(Sol);
                }
            }
            return Soli;
        }

        public async Task<IEnumerable<SolicitudGI>> getbyIdUnidad(IEnumerable<BitacoraSolicitudesGI> resultadosBitacoras, string claveUnidad)
        {
            List<BitacoraSolicitudesGI> Bita = new List<BitacoraSolicitudesGI>();
            List<SolicitudGI> Soli = new List<SolicitudGI>();
            foreach (var item in resultadosBitacoras)
            {
                Bita.Add(item);
            }
            foreach (var item in Bita)
            {
                var Sol = await _ctx.DbSetSolicitudGI.Where(e => e.SolicitudId == item.SolicitudId && e.ClaveUnidadAut == claveUnidad).Include(e => e.TipoInformacion).Include(e => e.EstadoFlujo).AsNoTracking().FirstOrDefaultAsync();
                if (Sol != null)
                {
                    Soli.Add(Sol);
                }
            }
            return Soli;
        }

        public async Task<IEnumerable<SolicitudGI>> GetAllTodas()
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Include(e => e.TipoInformacion)
                                                    .Distinct()
                                                    .OrderBy(e => e.TipoInformacionId).ThenBy(e => e.InformacionId).ThenBy(e => e.FechaSolicitud)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene el listado de solicitudes que sean acorde al tipo de informacion solicitada y al id
        /// </summary>
        /// <param name="id">tipo de informacion a buscar, plan de negocio (30), propuesta(29), etc. </param>
        /// <param name="id2">id del registro, no de la solicitud</param>
        /// <returns></returns>
        public async Task<IEnumerable<SolicitudGI>> GetByInfo(int id, string id2)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.TipoInformacionId == id)
                                                    .Where(e => e.InformacionId.Equals(id2))
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene el ultimo registro de la bitacora con estado de aprobado de una solicitud
        /// </summary>
        /// <param name="id">tipo de informacion de la solicitud</param>
        /// <param name="id2">id del registro a buscar</param>
        /// <returns></returns>
        public async Task<Object> GetEstadoAprobadaByInfo(int id, string id2)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.TipoInformacionId == id)
                                                    .Where(e => e.InformacionId.Equals(id2))
                                                    .AsNoTracking()
                                                    .FirstOrDefaultAsync();

                //La solicitud y su log en la bitacora de solicitudes van de la mano
                if (Solicitud != null)
                {
                    //Recuperamos los ultimos dos movimientos de la bitacora (normalmente un movimiento deberia ser el de "enviar" y el anterior deberia ser "aprobada, rechazada, modificacion")
                    var propuestaAprobada = await _ctx.DbSetBitacoraSolicitudesGI
                                                        .Where(c => c.SolicitudId == Solicitud.SolicitudId && c.Descripcion.Contains("Aprobada"))
                                                        .AsNoTracking()
                                                        .OrderByDescending(x => x.FechaMovimiento)
                                                        .FirstOrDefaultAsync();

                    if (propuestaAprobada!=null) //En caso de que la solicitud se haya enviado mas de una sola vez
                    {
                        return propuestaAprobada;
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<IEnumerable<SolicitudGI>> validarEstadoRechazadas(IEnumerable<SolicitudGI> solicitudes)
        {
            try
            {
                List<SolicitudGI> result = new List<SolicitudGI>();
                foreach (var item in solicitudes)
                {
                    var obj = await _ctx.DbSetSolicitudGI.Where(e => e.SolicitudId == item.SolicitudId)
                        //&& (e.EstadoFlujoId == 1 || e.EstadoFlujoId == 12))
                        .Include(e => e.TipoInformacion).Include(e => e.EstadoFlujo).AsNoTracking().FirstOrDefaultAsync();
                    if (obj != null)
                    {
                        result.Add(obj);
                    }
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudGI>> GetAllGerente(String claveUnidad)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .Where(x => x.ClaveUnidadAut == claveUnidad && x.TipoInformacionId == 30)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private IQueryable<SolicitudGI> GetAllGerenteByClaveConsult(string claveunidad)
        {
            throw new Exception("CORREGIR CONSULTA");
            //try
            //{
            //    var Solicitud = _ctx.DbSetSolicitudGI.Where(e => e.EstadoFlujoId == 8 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12
            //                        || e.EstadoFlujoId == 13 && e.TipoInformacionId != 18)
            //                        .Where(x => x.ClaveUnidadAut == claveunidad)
            //                                        .Include(e => e.TipoInformacion)
            //                                        .Include(e => e.EstadoFlujo)
            //                                        .AsNoTracking();

            //    return Solicitud;
            //}
            //catch (Exception e)
            //{
            //    throw new Exception(e.Message, e);
            //}
        }
        public async Task<int> GetAllGerenteByClaveCount(string claveunidad)
        {
            try
            {
                var Solicitud = await this.GetAllGerenteByClaveConsult(claveunidad)
                                                    .CountAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudGI>> GetAllGerenteByClave(string claveunidad)
        {
            try
            {
                var Solicitud = await this.GetAllGerenteByClaveConsult(claveunidad)
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudGI>> GetAllCursosCP()
        {
            throw new Exception("CORREGIR CONSULTA");
            //try
            //{
            //    var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.TipoInformacionId == 18)
            //        .Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
            //                                        .Include(e => e.TipoInformacion)
            //                                        .Include(e => e.EstadoFlujo)
            //                                        .AsNoTracking()
            //                                        .ToListAsync();
            //    return Solicitud;
            //}
            //catch (Exception e)
            //{
            //    throw new Exception(e.Message, e);
            //}
        }

        //Actualizar estado
        public async Task UpdateEstado(SolicitudGI Solicitud)
        {
            //throw new Exception("CORREGIR CONSULTA");
            try
            {
                var _Solicitud = await _ctx.DbSetSolicitudGI.FirstOrDefaultAsync(e => e.SolicitudId == Solicitud.SolicitudId);
                if (_Solicitud != null)
                {
                    _Solicitud.EstadoFlujoId = Solicitud.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudGI> UpdateEstadoActualizacion(SolicitudGI solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.DbSetSolicitudGI.FirstOrDefaultAsync(e => e.SolicitudId == solicitud.SolicitudId);
                if (_Solicitud != null)
                {
                    _Solicitud.EstadoFlujoId = solicitud.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                    return (_Solicitud);
                }
                return _Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Verifica si ya existe una solicitud para el oc requerido
        /// </summary>
        /// <param name="tipoInformacionId">propuesta(29), plan de negocio(30), etc...</param>
        /// <param name="informacionId">id del registro al que se le desea crear una solicitud</param>
        /// <returns></returns>
        public async Task<SolicitudGI> existe(int tipoInformacionId, string informacionId)
        {
            try
            {
                var Solicitud = await _ctx.DbSetSolicitudGI.Where(e => e.TipoInformacionId == tipoInformacionId)
                                                    .Where(e => e.InformacionId.Equals(informacionId))
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .FirstOrDefaultAsync();

                return (Solicitud);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        //Crear
        public async Task<SolicitudGI> Create(SolicitudGI Solicitud)
        {
            try
            {
                Solicitud.TipoPersonal_Id = "Sin definir";
                PersonasRepository repo = new PersonasRepository();
                var person = await repo.GetById(Solicitud.ClavePersona);
                if (person != null)
                {
                    Solicitud.TipoPersonal_Id = person.TipoPersonalId;
                }

                var result = _ctx.DbSetSolicitudGI.Add(Solicitud);
                await _ctx.SaveChangesAsync();
                return (Solicitud);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudGI> UpdateCreate(SolicitudGI Solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.DbSetSolicitudGI.FirstOrDefaultAsync(e => e.TipoInformacionId == Solicitud.TipoInformacionId && e.ClavePersona == Solicitud.ClavePersona && e.InformacionId == Solicitud.InformacionId);
                if (_Solicitud != null)
                {
                    _Solicitud.TipoInformacionId = Solicitud.TipoInformacionId;
                    _Solicitud.InformacionId = Solicitud.InformacionId;
                    _Solicitud.FechaSolicitud = Solicitud.FechaSolicitud;
                    _Solicitud.EstadoFlujoId = Solicitud.EstadoFlujoId;
                    _Solicitud.ClavePersona = Solicitud.ClavePersona;
                    await _ctx.SaveChangesAsync();
                    return (_Solicitud);
                }
                else
                {
                    try
                    {

                        _ctx.DbSetSolicitudGI.Add(Solicitud);
                        await _ctx.SaveChangesAsync();
                        return (_Solicitud);

                    }
                    catch (Exception e)
                    {
                        throw new Exception(e.Message, e);
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudGI> GetPermiso(SolicitudGI Solicitud)
        {
            try
            {

                var entities = await _ctx.DbSetSolicitudGI.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ClavePersona == Solicitud.ClavePersona &&
                                              e.TipoInformacionId == Solicitud.TipoInformacionId &&
                                              e.InformacionId.Equals(Solicitud.InformacionId));
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> GetPermisoEdicion(SolicitudGI Solicitud)
        {
            try
            {

                var entities = await _ctx.DbSetSolicitudGI.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ClavePersona == Solicitud.ClavePersona &&
                                              e.TipoInformacionId == Solicitud.TipoInformacionId &&
                                              e.InformacionId.Equals(Solicitud.InformacionId) &&
                                              e.IdRol==null);
                if(entities!=null){
                    return true;
                }else{
                    return false;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudGI> GetById(int Id)
        {
            try
            {

                var entities = await _ctx.DbSetSolicitudGI.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.SolicitudId == Id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
