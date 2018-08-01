using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TipoProductoServicioRepository : IDisposable
    {
        private CR_Context _db;
        public TipoProductoServicioRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<TipoProductoServicio>> GetAll()
        {
            try
            {
                var entities = await _db.TipoProductoServicio.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoProductoServicio> Get(int id)
        {
            try
            {
                var entities = await _db.TipoProductoServicio.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TipoProductoServicioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoProductoServicio model)
        {
            try
            {

                _db.TipoProductoServicio.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoProductoServicio model)
        {
            try
            {
                var _model = await _db.TipoProductoServicio.FirstOrDefaultAsync(e => e.TipoProductoServicioId == model.TipoProductoServicioId);
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
                var _model = await _db.TipoProductoServicio.FirstOrDefaultAsync(e => e.TipoProductoServicioId == id);
                if (_model != null)
                {
                    _db.TipoProductoServicio.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoProductoServicio model)
        {
            try
            {
                var _model = await _db.TipoProductoServicio.FirstOrDefaultAsync(e => e.TipoProductoServicioId == model.TipoProductoServicioId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
            _db.Dispose();
        }
    }
}