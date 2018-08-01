using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ServicioPorCompetidorRepository : IDisposable
    {

        private CR_Context _db;
        public ServicioPorCompetidorRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ServicioPorCompetidor>> GetAll()
        {
            try
            {
                var entities = await _db.ServicioPorCompetidor.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<ServicioPorCompetidor>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.ServicioPorCompetidor.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ServicioPorCompetidor> Get(int id)
        {
            try
            {
                var entities = await _db.ServicioPorCompetidor.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ServicioPorCompetidorId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ServicioPorCompetidor model)
        {
            try
            {

                _db.ServicioPorCompetidor.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ServicioPorCompetidor model)
        {
            try
            {
                var _model = await _db.ServicioPorCompetidor.FirstOrDefaultAsync(e => e.ServicioPorCompetidorId == model.ServicioPorCompetidorId);
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

        public async Task UpdateEstado(ServicioPorCompetidor model)
        {
            try
            {
                var _model = await _db.ServicioPorCompetidor.FirstOrDefaultAsync(e => e.ServicioPorCompetidorId == model.ServicioPorCompetidorId);
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
                var _model = await _db.ServicioPorCompetidor.FirstOrDefaultAsync(e => e.ServicioPorCompetidorId == id);
                if (_model != null)
                {
                    _db.ServicioPorCompetidor.Remove(_model);
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

