using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ActividadAdicionalRepository : IDisposable
    {

        private CR_Context _db;
        public ActividadAdicionalRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ActividadAdicional>> GetAll()
        {
            try
            {
                var entities = await _db.ActividadAdicional.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ActividadAdicional> Get(int id)
        {
            try
            {
                var entities = await _db.ActividadAdicional.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ActividadAdicionalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ActividadAdicional model)
        {
            try
            {

                _db.ActividadAdicional.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ActividadAdicional model)
        {
            try
            {
                var _model = await _db.ActividadAdicional.FirstOrDefaultAsync(e => e.ActividadAdicionalId == model.ActividadAdicionalId);
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

        public async Task UpdateEstado(ActividadAdicional model)
        {
            try
            {
                var _model = await _db.ActividadAdicional.FirstOrDefaultAsync(e => e.ActividadAdicionalId == model.ActividadAdicionalId);
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
                var _model = await _db.ActividadAdicional.FirstOrDefaultAsync(e => e.ActividadAdicionalId == id);
                if (_model != null)
                {
                    _db.ActividadAdicional.Remove(_model);
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

