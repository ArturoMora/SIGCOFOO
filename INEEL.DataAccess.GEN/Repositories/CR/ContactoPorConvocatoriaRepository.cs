using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ContactoPorConvocatoriaRepository : IDisposable
    {

        private CR_Context _db;
        public ContactoPorConvocatoriaRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<ContactoPorConvocatoria>> GetAll()
        {
            try
            {
                var entities = await _db.ContactoPorConvocatoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<ContactoPorConvocatoria>> GetAllFKs()
        {
            try
            {
                var entities = await _db.ContactoPorConvocatoria
                    .AsNoTracking()
                    .Include(e => e.Contacto)
                    .Include(e => e.Convocatoria)
                    .ToListAsync(); 
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ContactoPorConvocatoria> Get(int id)
        {
            try
            {
                var entities = await _db.ContactoPorConvocatoria.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ContactoPorConvocatoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ContactoPorConvocatoria model)
        {
            try
            {

                _db.ContactoPorConvocatoria.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ContactoPorConvocatoria model)
        {
            try
            {
                var _model = await _db.ContactoPorConvocatoria.FirstOrDefaultAsync(e => e.ContactoPorConvocatoriaId == model.ContactoPorConvocatoriaId);
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

        public async Task UpdateEstado(ContactoPorConvocatoria model)
        {
            try
            {
                var _model = await _db.ContactoPorConvocatoria.FirstOrDefaultAsync(e => e.ContactoPorConvocatoriaId == model.ContactoPorConvocatoriaId);
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
                var _model = await _db.ContactoPorConvocatoria.FirstOrDefaultAsync(e => e.ContactoPorConvocatoriaId == id);
                if (_model != null)
                {
                    _db.ContactoPorConvocatoria.Remove(_model);
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

