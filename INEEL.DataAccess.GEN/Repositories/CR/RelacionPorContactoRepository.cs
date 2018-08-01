using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class RelacionPorContactoRepository : IDisposable
    {

        private CR_Context _db;
        public RelacionPorContactoRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<RelacionPorContacto>> GetAll()
        {
            try
            {
                var entities = await _db.RelacionPorContacto.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RelacionPorContacto> Get(int id)
        {
            try
            {
                var entities = await _db.RelacionPorContacto.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.RelacionPorContactoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(RelacionPorContacto model)
        {
            try
            {

                _db.RelacionPorContacto.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RelacionPorContacto model)
        {
            try
            {
                var _model = await _db.RelacionPorContacto.FirstOrDefaultAsync(e => e.RelacionPorContactoId == model.RelacionPorContactoId);
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

        public async Task UpdateEstado(RelacionPorContacto model)
        {
            try
            {
                var _model = await _db.RelacionPorContacto.FirstOrDefaultAsync(e => e.RelacionPorContactoId == model.RelacionPorContactoId);
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
                var _model = await _db.RelacionPorContacto.FirstOrDefaultAsync(e => e.RelacionPorContactoId == id);
                if (_model != null)
                {
                    _db.RelacionPorContacto.Remove(_model);
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

