using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class TipoUnidadRepository : IDisposable
    {
        
        private GEN_Context _db;

        public TipoUnidadRepository()
        {
            _db = new GEN_Context();
        }

      

        public async Task<IEnumerable<TipoUnidad>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetTipoUnidad.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoUnidad> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetTipoUnidad.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TipoUnidadID == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoUnidad model)
        {
            try
            {

                _db.dbSetTipoUnidad.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoUnidad model)
        {
            try
            {
                var _model = await _db.dbSetTipoUnidad.FirstOrDefaultAsync(e => e.TipoUnidadID == model.TipoUnidadID);
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
                var _model = await _db.dbSetTipoUnidad.FirstOrDefaultAsync(e => e.TipoUnidadID == id);
                if (_model != null)
                {
                    _db.dbSetTipoUnidad.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoUnidad obj)
        {
            try
            {
                var _obj = await _db.dbSetTipoUnidad.FirstOrDefaultAsync(e => e.TipoUnidadID == obj.TipoUnidadID);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;

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
