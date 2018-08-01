using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class SolicitudAccesoRepository : IDisposable
    {

        private GEN_Context _db;
        public SolicitudAccesoRepository()
        {
            _db = new GEN_Context();
            _db.Database.Log = Escribe.Write;
        }
        public async Task<IEnumerable<SolicitudAcceso>> setNombreCompletoSolicitante(IEnumerable<SolicitudAcceso> entities)
        {
            try
            {
                var clavesP = new HashSet<String>(entities.Select(x => x.ClavePersonaSolicitante).ToList());
                var ListPersonas = await new PersonasRepository(_db).GetAllCollectionWithoutStatus(clavesP);
                Personas p;

                var llavesRegistros= entities.Select(x=> x.SolicitudAccesoId).ToList();
                var bitacoraSolicitudes= await _db.dbSetBitacoraSolicitudesAcceso.AsNoTracking()
                                                    .Where(e=> llavesRegistros
                                                    .Contains(e.SolicitudAccesoId))
                                                    .OrderByDescending(e=> e.FechaMovimiento)
                                                    .ToListAsync();

                foreach (var r in entities)
                {
                    p = ListPersonas.Find(x => x.ClavePersona == r.ClavePersonaSolicitante);
                    if (p != null)
                    {
                        r.NombreCompletoSolicitante = p.NombreCompleto;
                    }
                    r.justificacion= bitacoraSolicitudes.Where(x=> x.SolicitudAccesoId== r.SolicitudAccesoId).Select(x=> x.justificacion).FirstOrDefault();
                }
                return entities;
            }
            catch (Exception e) { throw new Exception(e.Message, e); }
        }

        public async Task<Object> GetSolicitudByItf(BitacoraITFSolicitudDescarga model)
        {
            try
            {
                var solicitud = await _db.dbSetSolicitudAcceso.Where(e => e.TipoInformacionId == 21
                                                                    && e.InformacionOCId == model.iditf
                                                                    && e.ClavePersonaSolicitante == model.claveSolicitante)
                                                               .AsNoTracking().FirstOrDefaultAsync();
                return solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudAcceso>> GetAllByUnidad(String unidadOrgId)
        {
            try
            {                
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.unidadAutorizadoraId == unidadOrgId)
                    .Include(x => x.TipoInformacion)
                    .Include(x => x.EstadoFlujo)
                    .ToListAsync();
                if (entities == null)
                {
                    return new List<SolicitudAcceso>();
                }
                return await this.setNombreCompletoSolicitante(entities);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task<Boolean> ExisteSolicitud(String ClavePersonaSolicitante, string InformacionOCId, int EstadoFlujoId)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.ClavePersonaSolicitante == ClavePersonaSolicitante && x.InformacionOCId == InformacionOCId && x.EstadoFlujoId== EstadoFlujoId)
                    .FirstOrDefaultAsync();

                if (entities == null)
                {
                    return false;
                }
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<SolicitudAcceso> solicitud(String ClavePersonaSolicitante, string InformacionOCId, int EstadoFlujoId)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.ClavePersonaSolicitante == ClavePersonaSolicitante && x.InformacionOCId == InformacionOCId && x.EstadoFlujoId == EstadoFlujoId)
                    .FirstOrDefaultAsync();

               
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudAcceso>> GetAllByUnidadWithEstadoFlujoTop(String unidadOrgId, int estadoFlujoId, int top)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.unidadAutorizadoraId == unidadOrgId && x.EstadoFlujoId == estadoFlujoId)
                    .Include(x => x.TipoInformacion)
                    .Include(x => x.EstadoFlujo)
                     .OrderByDescending(e => e.FechaSolicitud)
                    .Take(top)
                    .ToListAsync();
                if (entities == null)
                {
                    return new List<SolicitudAcceso>();
                }
                return await this.setNombreCompletoSolicitante(entities);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudAcceso>> GetAllByUnidadWithEstadoFlujoList(String unidadOrgId, List<String> estadosFlujoId)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.unidadAutorizadoraId == unidadOrgId && estadosFlujoId.Contains(x.EstadoFlujoId.ToString()))
                    .Include(x => x.TipoInformacion)
                    .Include(x => x.EstadoFlujo)
                    .ToListAsync();
                if (entities == null)
                {
                    return new List<SolicitudAcceso>();
                }
                return await this.setNombreCompletoSolicitante(entities);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudAcceso>> GetAllByUnidadWithEstadoFlujo(String unidadOrgId, int estadoFlujoId)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.unidadAutorizadoraId == unidadOrgId && x.EstadoFlujoId == estadoFlujoId)
                    .Include(x => x.TipoInformacion)
                    .Include(x => x.EstadoFlujo)
                    .ToListAsync();
                if (entities == null)
                {
                    return new List<SolicitudAcceso>();
                }
                return await this.setNombreCompletoSolicitante(entities);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudAcceso>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudAcceso> Get(long id)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.SolicitudAccesoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> existeSolicitudByPersonaInformOCIdANDestadoFlujo(String personaId, string InformacionOCId, int estadoFlujoId)
        {
            try
            {
                var entities = await SolicitudByPersonaInformOCIdANDestadoFlujo(personaId,InformacionOCId,estadoFlujoId);
                if (entities == null)
                {
                    return false;
                }
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SolicitudAcceso> SolicitudByPersonaInformOCIdANDestadoFlujo(String personaId, string InformacionOCId, int estadoFlujoId)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAcceso.AsNoTracking()
                    .Where(x => x.ClavePersonaSolicitante == personaId && x.InformacionOCId == InformacionOCId && x.EstadoFlujoId == estadoFlujoId)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(SolicitudAcceso model)
        {
            try
            {

                _db.dbSetSolicitudAcceso.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(SolicitudAcceso model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudAcceso.FirstOrDefaultAsync(e => e.SolicitudAccesoId == model.SolicitudAccesoId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Actualizar estadoFlujoId
        public async Task UpdateEstado(long id, int estadoFlujoId)
        {
            try
            {
                var model = await _db.dbSetSolicitudAcceso.FirstOrDefaultAsync(e => e.SolicitudAccesoId == id);
                if (model != null)
                {
                    model.EstadoFlujoId = estadoFlujoId;
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.dbSetSolicitudAcceso.FirstOrDefaultAsync(e => e.SolicitudAccesoId == id);
                if (_model != null)
                {
                    _db.dbSetSolicitudAcceso.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
