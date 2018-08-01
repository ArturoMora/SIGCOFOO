using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class TipoCursoRepository : IDisposable
    {
        //----------- AYUDA:
        // TipoCursoRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // TipoCurso.- es el modelo
        // dbSetCAT_TipoCurso.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_TipoCurso =Categories                                  )
        // TipoCursoId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public TipoCursoRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<TipoCurso>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<TipoCurso>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoCurso.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoCurso> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoCurso.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoCursoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoCurso model)
        {
            try
            {

                _db.dbSetCAT_TipoCurso.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoCurso model)
        {
            try
            {
                var _model = await _db.dbSetCAT_TipoCurso.FirstOrDefaultAsync(e => e.TipoCursoId == model.TipoCursoId);
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

        public async Task UpdateEstado(TipoCurso model)
        {
            try
            {
                var _model = await _db.dbSetCAT_TipoCurso.FirstOrDefaultAsync(e => e.TipoCursoId == model.TipoCursoId);
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
                var _model = await _db.dbSetCAT_TipoCurso.FirstOrDefaultAsync(e => e.TipoCursoId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_TipoCurso.Remove(_model);
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
