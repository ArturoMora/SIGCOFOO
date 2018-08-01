using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class NaturalezaInteraccionRepository : IDisposable
    {

        private CR_Context _db;
        public NaturalezaInteraccionRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<NaturalezaInteraccion>> GetAll()
        {
            try
            {
                var entities = await _db.NaturalezaInteracion.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //NaturalezaInteraccion con estado en true
        public async Task<IEnumerable<NaturalezaInteraccion>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.NaturalezaInteracion.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<NaturalezaInteraccion> Get(int id)
        {
            try
            {
                var entities = await _db.NaturalezaInteracion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.NaturalezaInteraccionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(NaturalezaInteraccion model)
        {
            try
            {

                _db.NaturalezaInteracion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(NaturalezaInteraccion model)
        {
            try
            {
                var _model = await _db.NaturalezaInteracion.FirstOrDefaultAsync(e => e.NaturalezaInteraccionId == model.NaturalezaInteraccionId);
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

        public async Task UpdateEstado(NaturalezaInteraccion model)
        {
            try
            {
                var _model = await _db.NaturalezaInteracion.FirstOrDefaultAsync(e => e.NaturalezaInteraccionId == model.NaturalezaInteraccionId);
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
                var _model = await _db.NaturalezaInteracion.FirstOrDefaultAsync(e => e.NaturalezaInteraccionId == id);
                if (_model != null)
                {
                    _db.NaturalezaInteracion.Remove(_model);
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

