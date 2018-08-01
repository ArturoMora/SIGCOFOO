using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class PersonaPartIntRepository : IDisposable
    {

        private CR_Context _db;
        private GEN_Context _dbGEN;

        public PersonaPartIntRepository()
        {
            _db = new CR_Context();
            _dbGEN = new GEN_Context();
        }


        public async Task<IEnumerable<PersonaPartInt>> GetAll()
        {
            try
            {
                var entities = await _db.PersonaPartInt.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<PersonaPartInt>> GetAllFKs()
        {
            try
            {
                var entities = await _db.PersonaPartInt
                    .AsNoTracking()
                    .Include("Contacto.Empresa")
                    //.Include(e => e.Contacto)
                    .Include(e => e.NaturalezaInteraccion)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<PersonaPartInt> Get(int id)
        {
            try
            {
                var entities = await _db.PersonaPartInt.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.PersonaPartIntId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PersonaPartInt> GetFKById(int id)
        {
            try
            {
                var entities = await _db.PersonaPartInt
                     .AsNoTracking()
                    .Include("Contacto.Empresa")
                    .Include("Contacto.Estados")
                    .Include("Contacto.Municipios")

                    //.Include(e => e.Contacto)
                    .Include(e => e.NaturalezaInteraccion)
                    .FirstOrDefaultAsync(e => e.PersonaPartIntId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(PersonaPartInt model)
        {
            try
            {

                _db.PersonaPartInt.Add(model);
                await _db.SaveChangesAsync();

                var _contacto = await _db.Contacto.FirstOrDefaultAsync(e => e.ContactoId == model.ContactoId);
                if (_contacto != null)
                {
                    // await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "PARTINTPERSC", _contacto.NombreCompleto, "IndexCR.html#/detallesPersonaPartIntC/" + model.PersonaPartIntId));
                    await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "PARTINTPERS", _contacto.NombreCompleto, "IndexCR.html#/detallesPersonaPartInt/" + model.PersonaPartIntId));
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PersonaPartInt model)
        {
            try
            {
                var _model = await _db.PersonaPartInt.FirstOrDefaultAsync(e => e.PersonaPartIntId == model.PersonaPartIntId);
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

        public async Task UpdateEstado(PersonaPartInt model)
        {
            try
            {
                var _model = await _db.PersonaPartInt.FirstOrDefaultAsync(e => e.PersonaPartIntId == model.PersonaPartIntId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

                    var infoAgregada = await _dbGEN.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Contacto.NombreCompleto) && e.OcsId == "PARTINTPERS").FirstOrDefaultAsync();
                    if (infoAgregada != null && model.Estado == false)
                    {
                        NuevoOCRepository repo = new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    else
                    {
                        var _contacto = await _db.Contacto.FirstOrDefaultAsync(e => e.ContactoId == model.ContactoId);
                        if (_contacto != null)
                        {
                            await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "PARTINTPERS", _contacto.NombreCompleto, "IndexCR.html#/detallesPersonaPartInt/" + model.PersonaPartIntId));
                        }
                    }
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
                var _model = await _db.PersonaPartInt.Include(e => e.Contacto).FirstOrDefaultAsync(e => e.PersonaPartIntId == id);
                if (_model != null)
                {
                    var infoAgregada = await _dbGEN.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Contacto.NombreCompleto) && e.OcsId == "PARTINTPERS").FirstOrDefaultAsync();
                    if (infoAgregada != null)
                    {
                        NuevoOCRepository repo = new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    _db.PersonaPartInt.Remove(_model);
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

