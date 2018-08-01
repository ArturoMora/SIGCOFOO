using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AreaActividadAdicionalRepository : IDisposable
    {

        private CR_Context _db;
        public AreaActividadAdicionalRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<AreaActividadAdicional>> GetAll()
        {
            try
            {
                var entities = await _db.AreaActividadAdicional.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AreaActividadAdicional> Get(int id)
        {
            try
            {
                var entities = await _db.AreaActividadAdicional.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AreaActividadAdicionalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<AreaActividadAdicional> Create(AreaActividadAdicional model)
        {
            try
            {

                var result =   _db.AreaActividadAdicional.Add(model);
                await _db.SaveChangesAsync();
                return (result);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AreaActividadAdicional model)
        {
            try
            {
                var _model = await _db.AreaActividadAdicional.FirstOrDefaultAsync(e => e.AreaActividadAdicionalId == model.AreaActividadAdicionalId);
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

        public async Task UpdateEstado(AreaActividadAdicional model)
        {
            try
            {
                var _model = await _db.AreaActividadAdicional.FirstOrDefaultAsync(e => e.AreaActividadAdicionalId == model.AreaActividadAdicionalId);
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
                var _model = await _db.AreaActividadAdicional.FirstOrDefaultAsync(e => e.AreaActividadAdicionalId == id);
                if (_model != null)
                {
                    _db.AreaActividadAdicional.Remove(_model);
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

