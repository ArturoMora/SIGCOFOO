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
    public class CompetenciasRepository : IDisposable
    {
        //----------- AYUDA:
        // CompetenciasRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // Competencias.- es el modelo
        // competencias.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: competencias =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public CompetenciasRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<Competencias>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<Competencias>> GetAll()
        {
            try
            {
                var entities = await _db.competencias
                     .Where(e => e.Estado == 1)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Competencias> Get(int id)
        {
            try
            {
                var entities = await _db.competencias.AsNoTracking()
                    .Include(x => x.periodo)
                    .FirstOrDefaultAsync(e => e.CompetenciaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Competencias>> GetByPeriod(int id)
        {
            try
            {
                var entities = await _db.competencias
                    .Where(e => e.periodoId == id)
                    .Where(e => e.Estado == 1 )
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Competencias model)
        {
            try
            {

                _db.competencias.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Competencias model)
        {
            try
            {
                var _model = await _db.competencias.FirstOrDefaultAsync(e => e.CompetenciaId == model.CompetenciaId);
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
                var _model = await _db.competencias.FirstOrDefaultAsync(e => e.CompetenciaId == id);
                if (_model != null)
                {
                    _db.competencias.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Competencias obj)
        {
            try
            {
                var _obj = await _db.competencias.FirstOrDefaultAsync(e => e.CompetenciaId == obj.CompetenciaId);
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
