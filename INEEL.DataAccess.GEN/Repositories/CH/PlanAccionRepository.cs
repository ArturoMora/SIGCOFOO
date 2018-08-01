using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class PlanAccionRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public PlanAccionRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<PlanAccion>> GetAll()
        {
            try
            {
                var entities = await _db.planAccion.AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PlanAccion>> GetPorEmpleado(int Id)
        {
            try
            {
                var entities = await _db.planAccion
                    .Where(e => e.EmpleadoEvaluacionId == Id)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PlanAccion> Get(int id)
        {
            try
            {
                var entities = await _db.planAccion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(PlanAccion model)
        {
            try
            {
                _db.planAccion.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PlanAccion model)
        {
            try
            {
                var _model = await _db.planAccion.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await _db.planAccion.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.planAccion.Remove(_model);
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
