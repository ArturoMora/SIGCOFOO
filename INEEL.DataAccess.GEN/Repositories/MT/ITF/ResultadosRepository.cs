using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class ResultadosRepository : IDisposable
    {
        //----------- AYUDA:
        // ResultadosRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // Resultados.- es el modelo
        // dbSetResultados.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetResultados =Categories                                  )
        // ResultadosId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public ResultadosRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<Resultados>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Resultados>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetResultados.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Resultados> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetResultados.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.ResultadosId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Resultados model)
        {
            try
            {

                _db.dbSetResultados.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Resultados model)
        {
            try
            {
                var _model = await _db.dbSetResultados.FirstOrDefaultAsync(e => e.ResultadosId == model.ResultadosId);
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
                var _model = await _db.dbSetResultados.FirstOrDefaultAsync(e => e.ResultadosId == id);
                if (_model != null)
                {
                    _db.dbSetResultados.Remove(_model);
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
