using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ContactoPerfilRepository : IDisposable { public void Dispose(){_db.Dispose();}
        CR_Context _db;

        public ContactoPerfilRepository()
        {
            _db = new CR_Context();
        }



        public async Task<IEnumerable<ContactoPerfil>> Get(int Id)
        {
            try
            {
                var _contactoPerfil = await _db.ContactoPerfil
                    .Include(g => g.GradoAcademico)
                    .Include(c => c.Carrera)
                    .Include(i => i.Institucion)
                    .Include(p => p.Pais)
                    .AsNoTracking().Where (x=> x.ContactoId == Id).ToListAsync();

                return _contactoPerfil;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ContactoPerfil> GetPerfilContacto(int id)
        {
            try
            {
                var _perfilContacto = await _db.ContactoPerfil
                    .Include(g => g.GradoAcademico)
                    .Include(c => c.Carrera)
                    .Include(i => i.Institucion)
                    .Include(p => p.Pais)
                    .AsNoTracking().FirstOrDefaultAsync(p => p.ContactoPerfilId == id);
                return _perfilContacto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(ContactoPerfil contactoPerfil)
        {
            try
            {
                _db.ContactoPerfil.Add(contactoPerfil);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ContactoPerfil contactoPerfil)
        {
            try
            {
                var _contactoPerfil = await _db.ContactoPerfil
                    .FirstOrDefaultAsync
                    (c => c.ContactoPerfilId == contactoPerfil.ContactoPerfilId);

                if (_contactoPerfil != null)
                {
                    _db.Entry(_contactoPerfil).CurrentValues.SetValues(contactoPerfil);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(ContactoPerfil contactoPerfil)
        {
            try
            {
                var _contactoPerfil = await _db.ContactoPerfil.FirstOrDefaultAsync(c => c.ContactoId == contactoPerfil.ContactoId);
                if (_contactoPerfil != null)
                {
                    //_contactoPerfil.Estado = contactoPerfil.Estado; NECESITO REALIZAR UNA MIGRACION, ESPERARE UN POCO 
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int Id)
        {
            try
            {
                var _contactoPerfil = await _db.ContactoPerfil.FirstOrDefaultAsync(c => c.ContactoPerfilId == Id);
                if (_contactoPerfil != null)
                {
                    _db.ContactoPerfil.Remove(_contactoPerfil);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
