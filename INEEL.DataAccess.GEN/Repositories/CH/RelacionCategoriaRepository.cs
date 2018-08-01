using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class RelacionCategoriaRepository : IDisposable
    {


        SIGCOCHContext _db;
        public RelacionCategoriaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<FooEntity>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<RelacionCategoriaNominaCompetencias>> GetAll()
        {
            try
            {
                var entities = await _db.relacionCategoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RelacionCategoriaNominaCompetencias> Get(int id)
        {
            try
            {
                var entities = await _db.relacionCategoria.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.RelacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(RelacionCategoriaNominaCompetencias model)
        {
            try
            {

                _db.relacionCategoria.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RelacionCategoriaNominaCompetencias model)
        {
            try
            {
                var _model = await _db.relacionCategoria.FirstOrDefaultAsync(e => e.RelacionId == model.RelacionId);
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
                var _model = await _db.relacionCategoria.FirstOrDefaultAsync(e => e.RelacionId == id);
                if (_model != null)
                {
                    _db.relacionCategoria.Remove(_model);
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
