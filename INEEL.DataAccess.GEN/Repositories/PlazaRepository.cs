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
    public class PlazaRepository : IDisposable { public void Dispose(){ _db.Dispose();}

        private GEN_Context _db;
        public PlazaRepository()
        {
            _db = new GEN_Context(); 
        }

        //public async Task<IEnumerable<Plaza>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Plaza>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetPlaza.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Plaza> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetPlaza.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.PlazaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task Create(Plaza model)
        {
            try
            {
                _db.dbSetPlaza.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Plaza model)
        {
            try
            {
                var _model = await _db.dbSetPlaza.FirstOrDefaultAsync(e => e.PlazaId == model.PlazaId);
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
                var _model = await _db.dbSetPlaza.FirstOrDefaultAsync(e => e.PlazaId == id);
                if (_model != null)
                {
                    _db.dbSetPlaza.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Plaza obj)
        {
            try
            {
                var _obj = await _db.dbSetPlaza.FirstOrDefaultAsync(e => e.PlazaId == obj.PlazaId);
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


    }
}
