using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CalificacionCompetenciasRepository : IDisposable
    {
        //----------- AYUDA:
        // CalificacionCompetenciasRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // FooEntity.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        SIGCOCHContext _db;
        public CalificacionCompetenciasRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<FooEntity>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CalificacionCompetencias>> GetAll()
        {
            try
            {
                var entities = await _db.calificacion.AsNoTracking().OrderBy(x => x.calificacion).ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CalificacionCompetencias> Get(int id)
        {
            try
            {
                var entities = await _db.calificacion.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CalificacionId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task Create(CalificacionCompetencias model)
        {
            try
            {

                _db.calificacion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CalificacionCompetencias model)
        {
            try
            {
                var _model = await _db.calificacion.FirstOrDefaultAsync(e => e.calificacion == model.calificacion);
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
                var _model = await _db.calificacion.FirstOrDefaultAsync(e => e.CalificacionId == id);
                if (_model != null)
                {
                    _db.calificacion.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(CalificacionCompetencias obj)
        {
            try
            {
                var _obj = await _db.calificacion.FirstOrDefaultAsync(e => e.CalificacionId == obj.CalificacionId);
                if (_obj != null)
                {
                    _obj.estado = obj.estado;
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
