using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AdjuntoPorConvenioRepository : IDisposable
    {

        private CR_Context _db;
        public AdjuntoPorConvenioRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<AdjuntoPorConvenio>> GetAll()
        {
            try
            {
                var entities = await _db.AdjuntoPorConvenio.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AdjuntoPorConvenio> Get(int id)
        {
            try
            {
                var entities = await _db.AdjuntoPorConvenio.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AdjuntoPorConvenioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<AdjuntoPorConvenio> Create(AdjuntoPorConvenio model)
        {
            try
            {

                var result =   _db.AdjuntoPorConvenio.Add(model);
                await _db.SaveChangesAsync();
                return (result);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AdjuntoPorConvenio model)
        {
            try
            {
                var _model = await _db.AdjuntoPorConvenio.FirstOrDefaultAsync(e => e.AdjuntoPorConvenioId == model.AdjuntoPorConvenioId);
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

        public async Task UpdateEstado(AdjuntoPorConvenio model)
        {
            try
            {
                var _model = await _db.AdjuntoPorConvenio.FirstOrDefaultAsync(e => e.AdjuntoPorConvenioId == model.AdjuntoPorConvenioId);
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
                var _model = await _db.AdjuntoPorConvenio.FirstOrDefaultAsync(e => e.AdjuntoPorConvenioId == id);
                if (_model != null)
                {
                    var idadjunto = _model.AdjuntoId;
                    _db.AdjuntoPorConvenio.Remove(_model);
                    await _db.SaveChangesAsync();

                    await new AdjuntoRepository().Delete(idadjunto);
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

