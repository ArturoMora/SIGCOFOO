using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System.Linq;


namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class TipoInsumoRepository : IDisposable
    {


        private MT_Context _db;
        public TipoInsumoRepository()
        {
            _db = new MT_Context();
        }
        public TipoInsumoRepository(MT_Context db)
        {
            _db = db;
        }

        //public async Task<IEnumerable<TipoInsumo>> OtrosMetodos(){ ... }
        
            public async Task<IEnumerable<TipoInsumo>> GetAllByEstado(Boolean estado)
        {
            try
            {
                var entities = await _db.dbSetTipoInsumo.AsNoTracking()
                    .Where(x=>x.EstadoDisponible== estado)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<TipoInsumo>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetTipoInsumo.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoInsumo> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetTipoInsumo.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoInsumoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoInsumo model)
        {
            try
            {

                _db.dbSetTipoInsumo.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoInsumo model)
        {
            try
            {
                var _model = await _db.dbSetTipoInsumo.FirstOrDefaultAsync(e => e.TipoInsumoId == model.TipoInsumoId);
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
                var _model = await _db.dbSetTipoInsumo.FirstOrDefaultAsync(e => e.TipoInsumoId == id);
                if (_model != null)
                {
                    _db.dbSetTipoInsumo.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateEstado(TipoInsumo model)
        {
            try
            {
                var _model = await _db.dbSetTipoInsumo.FirstOrDefaultAsync(e => e.TipoInsumoId == model.TipoInsumoId);
                if (_model != null)
                {
                    _model.EstadoDisponible = model.EstadoDisponible;

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
