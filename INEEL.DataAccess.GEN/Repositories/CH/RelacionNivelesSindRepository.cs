using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class RelacionNivelesSindRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public RelacionNivelesSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<RelacionNivelesComportamientoSind>> GetAll()
        {
            try
            {
                var entities = await _db.relacionComportamientoSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RelacionNivelesComportamientoSind> Get(int id)
        {
            try
            {
                var entities = await _db.relacionComportamientoSind.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task Create(RelacionNivelesComportamientoSind model)
        {
            try
            {

                _db.relacionComportamientoSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RelacionNivelesComportamientoSind model)
        {
            try
            {
                var _model = await _db.relacionComportamientoSind.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.relacionComportamientoSind.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.relacionComportamientoSind.Remove(_model);
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
