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
    public class FortalezasRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public FortalezasRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<Fortalezas>> GetAll()
        {
            try
            {
                var entities = await _db.fortalezas.AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Fortalezas>> GetPorEmpleado(int Id)
        {
            try
            {
                var entities = await _db.fortalezas
                    .Where(e => e.EmpleadoEvaluacionId == Id)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Fortalezas> Get(int id)
        {
            try
            {
                var entities = await _db.fortalezas.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Fortalezas model)
        {
            try
            {
                _db.fortalezas.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Fortalezas model)
        {
            try
            {
                var _model = await _db.fortalezas.FirstOrDefaultAsync(e => e.Id== model.Id);
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
                var _model = await _db.fortalezas.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.fortalezas.Remove(_model);
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
