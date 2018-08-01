using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AdjuntoPorCompetidorRepository : IDisposable
    {

        private CR_Context _db;
        public AdjuntoPorCompetidorRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<AdjuntoPorCompetidor>> GetAll()
        {
            try
            {
                var entities = await _db.AdjuntoPorCompetidor.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AdjuntoPorCompetidor> Get(int id)
        {
            try
            {
                var entities = await _db.AdjuntoPorCompetidor.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AdjuntoPorCompetidorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AdjuntoPorCompetidor model)
        {
            try
            {

                _db.AdjuntoPorCompetidor.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AdjuntoPorCompetidor model)
        {
            try
            {
                var _model = await _db.AdjuntoPorCompetidor.FirstOrDefaultAsync(e => e.AdjuntoPorCompetidorId == model.AdjuntoPorCompetidorId);
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

        public async Task UpdateEstado(AdjuntoPorCompetidor model)
        {
            try
            {
                var _model = await _db.AdjuntoPorCompetidor.FirstOrDefaultAsync(e => e.AdjuntoPorCompetidorId == model.AdjuntoPorCompetidorId);
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
                var _model = await _db.AdjuntoPorCompetidor.FirstOrDefaultAsync(e => e.AdjuntoPorCompetidorId == id);
                if (_model != null)
                {
                    _db.AdjuntoPorCompetidor.Remove(_model);
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

