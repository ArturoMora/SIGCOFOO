using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class SolicitudInsumoRepository : IDisposable
    {
        private MT_Context _db;
        public SolicitudInsumoRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<SolicitudInsumo>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<SolicitudInsumo>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetSolicitudInsumo.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudInsumo> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetSolicitudInsumo.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.SolicitudInsumoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(SolicitudInsumo model)
        {
            try
            {

                _db.dbSetSolicitudInsumo.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(SolicitudInsumo model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudInsumo.FirstOrDefaultAsync(e => e.InsumosId == model.InsumosId && e.ClavePersonaSolicitante == model.ClavePersonaSolicitante && e.ClavePersonaAutorizador == model.ClavePersonaAutorizador);
                if (_model != null)
                {
                    _model.Justificacion = model.Justificacion;
                    _model.FechaSolicitudInsumo = model.FechaSolicitudInsumo;
                    _model.EstadoSolicitudId = model.EstadoSolicitudId;
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateCreate(SolicitudInsumo model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudInsumo.FirstOrDefaultAsync(e => e.InsumosId == model.InsumosId && e.ClavePersonaSolicitante==model.ClavePersonaSolicitante&&e.ClavePersonaAutorizador==model.ClavePersonaAutorizador);
                if (_model != null)
                {
                    _model.Justificacion = model.Justificacion;
                    _model.FechaSolicitudInsumo = model.FechaSolicitudInsumo;
                    _model.EstadoSolicitudId = model.EstadoSolicitudId;
                    await _db.SaveChangesAsync();
                }
                else {
                    try
                    {

                        _db.dbSetSolicitudInsumo.Add(model);
                        await _db.SaveChangesAsync();

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

        public async Task UpdateEstado(SolicitudInsumo model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudInsumo.FirstOrDefaultAsync(e => e.SolicitudInsumoId == model.SolicitudInsumoId);
                if (_model != null)
                {
                    _model.EstadoSolicitudId = model.EstadoSolicitudId;
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateAut(SolicitudInsumo model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudInsumo.FirstOrDefaultAsync(e => e.InsumosId== model.InsumosId);
                if (_model != null)
                {
                    _model.EstadoSolicitudId = model.EstadoSolicitudId;
                    _model.FechaAtencion = model.FechaAtencion;
                    _model.TextoRespuesta = model.TextoRespuesta;
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
                var _model = await _db.dbSetSolicitudInsumo.FirstOrDefaultAsync(e => e.SolicitudInsumoId == id);
                if (_model != null)
                {
                    _db.dbSetSolicitudInsumo.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<SolicitudInsumo>> GetByClave(string Id)
        {
            try
            {
                var entities = await _db.dbSetSolicitudInsumo
                    .AsNoTracking()
                    .Where(e => e.ClavePersonaAutorizador.Equals(Id)&&e.EstadoSolicitudId==2)
                  .ToListAsync();
                //var entities = await _db.dbSetSolicitudInsumo
                //    .Where(e => e
                //    .ClavePersonaAutorizador.Equals(id) 
                //    .EstadoSolicitudId == 2)
                //   .AsNoTracking();
                return entities;

            }

            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<long> CountGetByClave(string Id)
        {
            try
            {                
                var count = (from e in _db.dbSetSolicitudInsumo
                             where e.ClavePersonaAutorizador.Equals(Id) && e.EstadoSolicitudId == 2
                             select e.SolicitudInsumoId);
                var result= await count.LongCountAsync();
                return result;

            }

            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudInsumo> GetPermiso(int id)
        {
            try
            {

                var entities = await _db.dbSetSolicitudInsumo.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.InsumosId == id);
                return entities;
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
