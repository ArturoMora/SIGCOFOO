using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class CalifResultadosFinancierosRepository : IDisposable
    {
        //----------- AYUDA:
        // CalifResultadosFinancierosRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // CalifResultadosFinancieros.- es el modelo
        // dbSetCAT_CalifResultadosFinancieros.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_CalifResultadosFinancieros =Categories                                  )
        // CalifResultadosFinancierosId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        public CalifResultadosFinancierosRepository()
        {
            _db = new MT_Context();
        }

        //public async Task<IEnumerable<CalifResultadosFinancieros>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CalifResultadosFinancieros>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCAT_CalifResultadosFinancieros.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CalifResultadosFinancieros> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_CalifResultadosFinancieros.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CalifResultadosFinancierosId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(CalifResultadosFinancieros model)
        {
            try
            {

                _db.dbSetCAT_CalifResultadosFinancieros.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CalifResultadosFinancieros model)
        {
            try
            {
                var _model = await _db.dbSetCAT_CalifResultadosFinancieros.FirstOrDefaultAsync(e => e.CalifResultadosFinancierosId == model.CalifResultadosFinancierosId);
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
        public async Task UpdateEstado(CalifResultadosFinancieros model)
        {
            try
            {
                var _model = await _db.dbSetCAT_CalifResultadosFinancieros.FirstOrDefaultAsync(e => e.CalifResultadosFinancierosId == model.CalifResultadosFinancierosId);
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
                var _model = await _db.dbSetCAT_CalifResultadosFinancieros.FirstOrDefaultAsync(e => e.CalifResultadosFinancierosId == id);
                if (_model != null)
                {
                    _db.dbSetCAT_CalifResultadosFinancieros.Remove(_model);
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
