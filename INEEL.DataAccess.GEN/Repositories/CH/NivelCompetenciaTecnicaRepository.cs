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
    public class NivelCompetenciaTecnicaRepository : IDisposable
    {
        //----------- AYUDA:
        // NivelCompetenciaTecnicaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // NivelCompetenciaTecnica.- es el modelo
        // nivelCompetenciaTecnica.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: nivelCompetenciaTecnica =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public NivelCompetenciaTecnicaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<NivelCompetenciaTecnica>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<NivelCompetenciaTecnica>> GetAll()
        {
            try
            {
                var entities = await _db.nivelCompetenciaTecnica.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<NivelCompetenciaTecnica>> GetByPeriodo(int idPeriodo)
        {
            try
            {
                var entities = await _db.nivelCompetenciaTecnica
                    .Where(e => e.periodoId == idPeriodo)
                    .Where(e => e.Estado == 1)
                    .Include(e => e.area)
                    .Include(e => e.periodo)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<NivelCompetenciaTecnica>> GetByPeriodoAndArea(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.nivelCompetenciaTecnica
                    .Where(e => e.periodoId == param.idNivel)
                     .Where(e => e.areaId == param.idCategoria)
                    .Where(e => e.Estado == 1)
                    .Include(e => e.area)
                    .Include(e => e.periodo)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<NivelCompetenciaTecnica> Get(int id)
        {
            try
            {
                var entities = await _db.nivelCompetenciaTecnica.AsNoTracking()
                    .Include(e => e.area)
                    .Include(e => e.periodo)
                    .FirstOrDefaultAsync(e => e.NivelCompetenciaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(NivelCompetenciaTecnica model)
        {
            try
            {

                _db.nivelCompetenciaTecnica.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(NivelCompetenciaTecnica model)
        {
            try
            {
                var _model = await _db.nivelCompetenciaTecnica.FirstOrDefaultAsync(e => e.NivelCompetenciaId == model.NivelCompetenciaId);
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
                var _model = await _db.nivelCompetenciaTecnica.FirstOrDefaultAsync(e => e.NivelCompetenciaId == id);
                if (_model != null)
                {
                    _db.nivelCompetenciaTecnica.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(NivelCompetenciaTecnica obj)
        {
            try
            {
                var _obj = await _db.nivelCompetenciaTecnica.FirstOrDefaultAsync(e => e.NivelCompetenciaId == obj.NivelCompetenciaId);
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
