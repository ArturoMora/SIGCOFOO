using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class ProyFuturoRepository : IDisposable
    {
        //----------- AYUDA:
        // ProyFuturoRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // ProyFuturo.- es el modelo
        // dbSetProyFuturos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetProyFuturos =Categories                                  )
        // ProyFuturoId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public ProyFuturoRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<ProyFuturo>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<ProyFuturo>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetProyFuturos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ProyFuturo> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetProyFuturos.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.ProyFuturoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ProyFuturo model)
        {
            try
            {

                _db.dbSetProyFuturos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ProyFuturo model)
        {
            try
            {
                var _model = await _db.dbSetProyFuturos.FirstOrDefaultAsync(e => e.ProyFuturoId == model.ProyFuturoId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.dbSetProyFuturos.FirstOrDefaultAsync(e => e.ProyFuturoId == id);
                if (_model != null)
                {
                    _db.dbSetProyFuturos.Remove(_model);
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
