using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class AutorITFRepository : IDisposable
    {
        //----------- AYUDA:
        // AutorITFRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // AutorITF.- es el modelo
        // dbSetAutorITF.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetAutorITF =Categories                                  )
        // AutorITFId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public AutorITFRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<AutorITF>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<AutorITF>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetAutorITF.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorITF> Get(String id)
        {
            try
            {
                var entities = await _db.dbSetAutorITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.AutorITFId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AutorITF model)
        {
            try
            {

                _db.dbSetAutorITF.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AutorITF model)
        {
            try
            {
                var _model = await _db.dbSetAutorITF.FirstOrDefaultAsync(e => e.AutorITFId == model.AutorITFId);
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

        public async Task Delete(String id)
        {
            try
            {
                var _model = await _db.dbSetAutorITF.FirstOrDefaultAsync(e => e.AutorITFId == id);
                if (_model != null)
                {
                    _db.dbSetAutorITF.Remove(_model);
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
