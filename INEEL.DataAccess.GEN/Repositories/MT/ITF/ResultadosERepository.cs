using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class ResultadosERepository : IDisposable
    {
        //----------- AYUDA:
        // ResultadosERepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // ResultadosE.- es el modelo
        // dbSetResultadosE.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetResultadosE =Categories                                  )
        // ResultadosEId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public ResultadosERepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<ResultadosE>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<ResultadosE>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetResultadosE.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ResultadosE> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetResultadosE.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.ResultadosEId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ResultadosE model)
        {
            try
            {

                _db.dbSetResultadosE.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ResultadosE model)
        {
            try
            {
                var _model = await _db.dbSetResultadosE.FirstOrDefaultAsync(e => e.ResultadosEId == model.ResultadosEId);
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
                var _model = await _db.dbSetResultadosE.FirstOrDefaultAsync(e => e.ResultadosEId == id);
                if (_model != null)
                {
                    _db.dbSetResultadosE.Remove(_model);
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
