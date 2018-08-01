using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class SolicitudAccesoITFRepository : IDisposable
    {
        private MT_Context _db;
        public SolicitudAccesoITFRepository()
        {
            _db = new MT_Context();
        }
        public SolicitudAccesoITFRepository(MT_Context ctx)
        {
            _db = ctx;
        }

        //public async Task<IEnumerable<SolicitudAccesoITF>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<SolicitudAccesoITF>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<SolicitudAccesoITF> AprobarAccesoITF(int SolicitudAccesoITFId)
        {
            return await this.ActualizaFlujo(SolicitudAccesoITFId, 10);
        }
        
        public async Task<SolicitudAccesoITF> RechazoCondicionalAccesoITF(int SolicitudAccesoITFId)
        {
            return await this.ActualizaFlujo(SolicitudAccesoITFId, 6);
        }
        public async Task<SolicitudAccesoITF> DenegarAccesoITF(int SolicitudAccesoITFId)
        {
            return await this.ActualizaFlujo(SolicitudAccesoITFId, 9);
        }
        
        private async Task<SolicitudAccesoITF> ActualizaFlujo(int SolicitudAccesoITFId, int flujo)
        {
            try
            {
                var solicitud = await this.Get(SolicitudAccesoITFId);
                if (solicitud == null)
                {
                    throw new Exception("Solicitud con ID " + SolicitudAccesoITFId + " no encontrada");
                }
                solicitud.EstadoFlujoId = flujo;
                await this.Update(solicitud);
                return solicitud;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudAccesoITF>> GetAccesoITFByClaveEmpleado(String ClaveEmpleado)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking()
                    .Where(x => x.ClavePersonaSolicitante== ClaveEmpleado)
                    //.Include(x => x.InformeTecnicoFinal.Proyecto)
                    .Include(x => x.EstadoFlujo)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SolicitudAccesoITF>> GetAccesoITFByClaveUnidad(String ClaveUnidad)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking()
                    .Where(x => x.ClaveUnidadDelSolicitante == ClaveUnidad && x.EstadoFlujoId == 8)
                    .Include(x=>x.InformeTecnicoFinal.Proyecto)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudAccesoITF> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.SolicitudAccesoITFId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SolicitudAccesoITF> GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante(String InformeTecnicoFinalId, String ClaveSolicitante)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == InformeTecnicoFinalId && e.ClavePersonaSolicitante == ClaveSolicitante);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SolicitudAccesoITF> GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_stadoFlujo(String InformeTecnicoFinalId, String ClaveSolicitante, int estadoFlujo)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == InformeTecnicoFinalId && e.ClavePersonaSolicitante == ClaveSolicitante && e.EstadoFlujoId== estadoFlujo);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SolicitudAccesoITF> GetSolicitudAccesoITFByInformeTecnicoFinalId(String InformeTecnicoFinalId)
        {
            try
            {
                var entities = await _db.dbSetSolicitudAccesoITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == InformeTecnicoFinalId);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task CreateSolicitudAccesoITF(SolicitudAccesoITF model)
        {
            try
            {
                _db.dbSetSolicitudAccesoITF.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        

        public async Task Update(SolicitudAccesoITF model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudAccesoITF.FirstOrDefaultAsync(e => e.SolicitudAccesoITFId == model.SolicitudAccesoITFId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.dbSetSolicitudAccesoITF.FirstOrDefaultAsync(e => e.SolicitudAccesoITFId == id);
                if (_model != null)
                {
                    _db.dbSetSolicitudAccesoITF.Remove(_model);
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
