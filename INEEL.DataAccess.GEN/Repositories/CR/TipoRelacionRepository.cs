using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TipoRelacionRepository : IDisposable
    {
        private CR_Context _db;
        public TipoRelacionRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<TipoRelacion>> GetAll()
        {
            try
            {
                var entities = await _db.TipoRelacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoRelacion> Get(int id)
        {
            try
            {
                var entities = await _db.TipoRelacion.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TipoRelacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoRelacion model)
        {
            
            try
            {
                _db.TipoRelacion.Add(model);
                await _db.SaveChangesAsync();
                
            }
            catch (Exception e)
            {             
                throw new Exception(e.Message, e);
            }
            
        }

        public async Task Update(TipoRelacion model)
        {
            try
            {
                var _model = await _db.TipoRelacion.FirstOrDefaultAsync(e => e.TipoRelacionId == model.TipoRelacionId);
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
                var _model = await _db.TipoRelacion.FirstOrDefaultAsync(e => e.TipoRelacionId == id);
                if (_model != null)
                {
                    _db.TipoRelacion.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoRelacion model)
        {
            try
            {
                var _model = await _db.TipoRelacion.FirstOrDefaultAsync(e => e.TipoRelacionId == model.TipoRelacionId);
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