using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class NivelCompetenciaRepository : IDisposable
    {
        //----------- AYUDA:
        // NivelCompetenciaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // NivelesCompetencias.- es el modelo
        // FooDbSet.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: FooDbSet =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public NivelCompetenciaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<NivelesCompetencias>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<NivelesCompetencias>> GetAll()
        {
            try
            {
                var entities = await _db.nivelCompetencias.Where(e => e.Estado == 1 ).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<NivelesCompetencias> Get(int id)
        {
            try
            {
                var entities = await _db.nivelCompetencias.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.NivelCompetenciaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(NivelesCompetencias model)
        {
            try
            {

                _db.nivelCompetencias.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(NivelesCompetencias model)
        {
            try
            {
                var _model = await _db.nivelCompetencias.FirstOrDefaultAsync(e => e.NivelCompetenciaId == model.NivelCompetenciaId);
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
                var _model = await _db.nivelCompetencias.FirstOrDefaultAsync(e => e.NivelCompetenciaId == id);
                if (_model != null)
                {
                    _db.nivelCompetencias.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(NivelesCompetencias obj)
        {
            try
            {
                var _obj = await _db.nivelCompetencias.FirstOrDefaultAsync(e => e.NivelCompetenciaId == obj.NivelCompetenciaId);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;
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
