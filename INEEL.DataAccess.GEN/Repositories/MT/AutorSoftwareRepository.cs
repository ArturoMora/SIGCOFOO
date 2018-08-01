using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class AutorSoftwareRepository : IDisposable
    {
        //----------- AYUDA:
        // AutorSoftwareRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // AutorSoftware.- es el modelo
        // dbSetAutorSoftware.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetAutorSoftware =Categories                                  )
        // AutorSoftwareId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public AutorSoftwareRepository()
        {
            _db = new MT_Context();
        }
        public AutorSoftwareRepository(MT_Context db)
        {
            _db = db;
        }

        //public async Task<IEnumerable<AutorSoftware>> OtrosMetodos(){ ... }

        
        public async Task<IEnumerable<String>> GetClavesAutorBySoftwarsIdCollection(List<int> sotfwarsId)
        {
            try
            {
                var entities = await _db.dbSetAutorSoftware.AsNoTracking()
                    .Where(x=> sotfwarsId.Contains(x.SoftwarePersonalId))
                    .Select(x=>x.ClaveAutor)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorSoftware>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetAutorSoftware.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
            public async Task<IEnumerable<AutorSoftware>> GetByClaveEmpleado(string id)
        {
            try
            {
                var entities = await _db.dbSetAutorSoftware.AsNoTracking()
                     .Include(x => x.SoftwarePersonal.TipoSoftware)
                     .Where(e => e.ClaveAutor == id)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<AutorSoftware> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetAutorSoftware.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.AutorSoftwareId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AutorSoftware model)
        {
            try
            {

                _db.dbSetAutorSoftware.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task UpdateEstado(AutorSoftware model)
        {
            try
            {
                var _model = await _db.dbSetAutorSoftware.FirstOrDefaultAsync(e => e.AutorSoftwareId == model.AutorSoftwareId);
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
                var _model = await _db.dbSetAutorSoftware.FirstOrDefaultAsync(e => e.AutorSoftwareId == id);
                if (_model != null)
                {
                    _db.dbSetAutorSoftware.Remove(_model);
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
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
