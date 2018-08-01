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
    public class CompetenciasTecnicasRepository : IDisposable
    {
        //----------- AYUDA:
        // CompetenciasTecnicasRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // ComptenciasTecnicas.- es el modelo
        // comptenciasTecnicas.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: comptenciasTecnicas =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public CompetenciasTecnicasRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<ComptenciasTecnicas>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CompetenciasTecnicas>> GetAll()
        {
            try
            {
                var entities = await _db.comptenciasTecnicas
                    .Include(e => e.periodo)
                    .Include(e => e.area)
                    .Include(e => e.niveltecnica)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<CompetenciasTecnicas>> GetByPeriodo(int id)
        {
            try
            {
                var entities = await _db.comptenciasTecnicas
                    .Include(e => e.periodo)
                    .Include(e => e.area)
                    .Include(e => e.niveltecnica)
                    .Where(e => e.periodoId == id)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CompetenciasTecnicas>> GetByPeriodoArea(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.comptenciasTecnicas
                    .Include(e => e.periodo)
                    .Include(e => e.area)
                    .Include(e => e.niveltecnica)
                    .Where(e => e.periodoId == param.periodoId && e.nivelId == param.nivelId && e.areaId == param.areaId) 
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<CompetenciasTecnicas> Get(int id)
        {
            try
            {
                var entities = await _db.comptenciasTecnicas.AsNoTracking()
                    .Include(e => e.periodo)
                    .Include(e => e.area)
                    .Include(e => e.niveltecnica)
                    .FirstOrDefaultAsync(e => e.CompetenciaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(CompetenciasTecnicas model)
        {
            try
            {

                _db.comptenciasTecnicas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CompetenciasTecnicas model)
        {
            try
            {
                var _model = await _db.comptenciasTecnicas.FirstOrDefaultAsync(e => e.CompetenciaId == model.CompetenciaId);
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
                var _model = await _db.comptenciasTecnicas.FirstOrDefaultAsync(e => e.CompetenciaId == id);
                if (_model != null)
                {
                    _db.comptenciasTecnicas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(CompetenciasTecnicas obj)
        {
            try
            {
                var _obj = await _db.comptenciasTecnicas.FirstOrDefaultAsync(e => e.CompetenciaId == obj.CompetenciaId);
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
