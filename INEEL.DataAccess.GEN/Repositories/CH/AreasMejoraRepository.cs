using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq.Dynamic;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AreasMejoraRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public AreasMejoraRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AreasMejora>> GetAll()
        {
            try
            {
                var entities = await _db.areaMejora.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AreasMejora>> GetPorEmpleado(int Id)
        {
            try
            {
                var entities = await _db.areaMejora
                    .Where(e => e.EmpleadoEvaluacionId == Id)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AreasMejora> Get(int id)
        {
            try
            {
                var entities = await _db.areaMejora.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

      
        public async Task Create(AreasMejora model)
        {
            try
            {
                _db.areaMejora.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AreasMejora model)
        {
            try
            {
                var _model = await _db.areaMejora.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await _db.areaMejora.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.areaMejora.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(AreasMejora obj)
        {
            try
            {
                var _obj = await _db.areaMejora.FirstOrDefaultAsync(e => e.Id == obj.Id);
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
