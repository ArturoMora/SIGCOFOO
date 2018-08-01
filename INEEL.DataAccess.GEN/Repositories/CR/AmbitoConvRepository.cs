using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AmbitoConvRepository : IDisposable
    {

        private CR_Context _db;
        public AmbitoConvRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<AmbitoConv>> GetAll()
        {
            try
            {
                var entities = await _db.AmbitoConv.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AmbitoConv>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.AmbitoConv.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AmbitoConv> Get(int id)
        {
            try
            {
                var entities = await _db.AmbitoConv.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AmbitoConvId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AmbitoConv model)
        {
            try
            {

                _db.AmbitoConv.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AmbitoConv model)
        {
            try
            {
                var _model = await _db.AmbitoConv.FirstOrDefaultAsync(e => e.AmbitoConvId == model.AmbitoConvId);
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

        public async Task UpdateEstado(AmbitoConv model)
        {
            try
            {
                var _model = await _db.AmbitoConv.FirstOrDefaultAsync(e => e.AmbitoConvId == model.AmbitoConvId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.AmbitoConv.FirstOrDefaultAsync(e => e.AmbitoConvId == id);
                if (_model != null)
                {
                    _db.AmbitoConv.Remove(_model);
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

