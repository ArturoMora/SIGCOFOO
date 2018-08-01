
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class LikesTipoRepository : IDisposable
    {
        private GEN_Context _db;
        public LikesTipoRepository()
        {
            _db = new GEN_Context();
        }

        //public async Task<IEnumerable<LikesTipo>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<LikesTipo>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetLikesTipo.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LikesTipo> Get(int id)
        {
            try
            {
                var entities = await _db.bdSetLikesTipo.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(LikesTipo model)
        {
            try
            {

                _db.bdSetLikesTipo.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LikesTipo model)
        {
            try
            {
                var _model = await _db.bdSetLikesTipo.FirstOrDefaultAsync(e => e.Id == model.Id);
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
                var _model = await _db.bdSetLikesTipo.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.bdSetLikesTipo.Remove(_model);
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
