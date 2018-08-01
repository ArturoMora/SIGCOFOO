using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AreaInvestigacionRepository : IDisposable
    {

        private CR_Context _db;
        public AreaInvestigacionRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<AreaInvestigacion>> GetAll()
        {
            try
            {
                var entities = await _db.AreaInvestigacion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AreaInvestigacion> Get(int id)
        {
            try
            {
                var entities = await _db.AreaInvestigacion.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AreaInvestigacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AreaInvestigacion model)
        {
            try
            {

                _db.AreaInvestigacion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AreaInvestigacion model)
        {
            try
            {
                var _model = await _db.AreaInvestigacion.FirstOrDefaultAsync(e => e.AreaInvestigacionId == model.AreaInvestigacionId);
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

        public async Task UpdateEstado(AreaInvestigacion model)
        {
            try
            {
                var _model = await _db.AreaInvestigacion.FirstOrDefaultAsync(e => e.AreaInvestigacionId == model.AreaInvestigacionId);
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
                var _model = await _db.AreaInvestigacion.FirstOrDefaultAsync(e => e.AreaInvestigacionId == id);
                if (_model != null)
                {
                    _db.AreaInvestigacion.Remove(_model);
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

