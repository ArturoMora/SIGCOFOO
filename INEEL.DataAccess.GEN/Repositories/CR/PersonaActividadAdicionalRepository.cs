using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class PersonaActividadAdicionalRepository : IDisposable
    {

        private CR_Context _db;
        public PersonaActividadAdicionalRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<PersonalActividadAdicional>> GetAll()
        {
            try
            {
                var entities = await _db.PersonalActividadAdicional.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PersonalActividadAdicional> Get(int id)
        {
            try
            {
                var entities = await _db.PersonalActividadAdicional.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.PersonalActividadAdicionalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<PersonalActividadAdicional> Create(PersonalActividadAdicional model)
        {
            try
            {

                var result =   _db.PersonalActividadAdicional.Add(model);
                await _db.SaveChangesAsync();
                return (result);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PersonalActividadAdicional model)
        {
            try
            {
                var _model = await _db.PersonalActividadAdicional.FirstOrDefaultAsync(e => e.PersonalActividadAdicionalId == model.PersonalActividadAdicionalId);
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

        public async Task UpdateEstado(PersonalActividadAdicional model)
        {
            try
            {
                var _model = await _db.PersonalActividadAdicional.FirstOrDefaultAsync(e => e.PersonalActividadAdicionalId == model.PersonalActividadAdicionalId);
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
                var _model = await _db.PersonalActividadAdicional.FirstOrDefaultAsync(e => e.PersonalActividadAdicionalId == id);
                if (_model != null)
                {
                    _db.PersonalActividadAdicional.Remove(_model);
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

