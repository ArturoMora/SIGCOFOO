using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TipoConvenioRepository : IDisposable
    {
        private CR_Context _db;
        public TipoConvenioRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<TipoConvenio>> GetAll()
        {
            try
            {
                var entities = await _db.TipoConvenio.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<TipoConvenio>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.TipoConvenio.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoConvenio> Get(int id)
        {
            try
            {
                var entities = await _db.TipoConvenio.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ConvenioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoConvenio model)
        {
            try
            {

                _db.TipoConvenio.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoConvenio model)
        {
            try
            {
                var _model = await _db.TipoConvenio.FirstOrDefaultAsync(e => e.ConvenioId == model.ConvenioId);
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
                var _model = await _db.TipoConvenio.FirstOrDefaultAsync(e => e.ConvenioId == id);
                if (_model != null)
                {
                    _db.TipoConvenio.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoConvenio model)
        {
            try
            {
                var _model = await _db.TipoConvenio.FirstOrDefaultAsync(e => e.ConvenioId == model.ConvenioId);
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

        public void Dispose()
        {
            _db.Dispose();
        }
    }
}