using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.MT;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class LibrosRepository : IDisposable
    {
        //----------- AYUDA:
        // LibrosRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // Libros.- es el modelo
        // dbSetLibros.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetLibros =Categories                                  )
        // LibrosId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public LibrosRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<Libros>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Libros>> GetAllFull()
        {
            try
            {
                var entities = await _db.dbSetLibros.AsNoTracking()
                    //.Include(x=>x.AutoresINEEL)
                    //.Include(x=>x.Descriptores)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Libros>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetLibros.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Libros> Get(string id)
        {
            try
            {
                var entities = await _db.dbSetLibros.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.LibrosId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Libros model)
        {
            try
            {

                _db.dbSetLibros.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Libros model)
        {
            try
            {
                var _model = await _db.dbSetLibros.FirstOrDefaultAsync(e => e.LibrosId == model.LibrosId);
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

        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.dbSetLibros.FirstOrDefaultAsync(e => e.LibrosId == id);
                if (_model != null)
                {
                    _db.dbSetLibros.Remove(_model);
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
