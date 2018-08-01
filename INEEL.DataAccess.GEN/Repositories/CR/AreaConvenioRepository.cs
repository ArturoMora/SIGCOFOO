using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AreaConvenioRepository : IDisposable
    {

        private CR_Context _db;
        public AreaConvenioRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<AreaConvenio>> GetAll()
        {
            try
            {
                var entities = await _db.AreaConvenio.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AreaConvenio> Get(int id)
        {
            try
            {
                var entities = await _db.AreaConvenio.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AreaConvenioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<AreaConvenio> Create(AreaConvenio model)
        {
            try
            {

                var result = _db.AreaConvenio.Add(model);
                await _db.SaveChangesAsync();
                return (result);
                             

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AreaConvenio model)
        {
            try
            {
                var _model = await _db.AreaConvenio.FirstOrDefaultAsync(e => e.AreaConvenioId == model.AreaConvenioId);
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

        public async Task UpdateEstado(AreaConvenio model)
        {
            try
            {
                var _model = await _db.AreaConvenio.FirstOrDefaultAsync(e => e.AreaConvenioId == model.AreaConvenioId);
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
                var _model = await _db.AreaConvenio.FirstOrDefaultAsync(e => e.AreaConvenioId == id);
                if (_model != null)
                {
                    _db.AreaConvenio.Remove(_model);
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

