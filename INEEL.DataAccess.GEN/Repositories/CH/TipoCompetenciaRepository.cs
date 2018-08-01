using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class TipoCompetenciaRepository : IDisposable
    {
        //----------- AYUDA:
        // TipoCompetenciaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // TipoCompetencia.- es el modelo
        // tipoCompetencia.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: tipoCompetencia =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private SIGCOCHContext _db;
        public TipoCompetenciaRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<TipoCompetencia>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<TipoCompetencia>> GetAll()
        {
            try
            {
                var entities = await _db.tipoCompetencia.Where(e =>e.estado == 1).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoCompetencia>> GetAllSinFiltro()
        {
            try
            {
                var entities = await _db.tipoCompetencia.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoCompetencia> Get(int id)
        {
            try
            {
                var entities = await _db.tipoCompetencia.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoCompetenciaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TipoCompetencia model)
        {
            try
            {

                _db.tipoCompetencia.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoCompetencia model)
        {
            try
            {
                var _model = await _db.tipoCompetencia.FirstOrDefaultAsync(e => e.TipoCompetenciaId == model.TipoCompetenciaId);
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
                var _model = await _db.tipoCompetencia.FirstOrDefaultAsync(e => e.TipoCompetenciaId == id);
                if (_model != null)
                {
                    _db.tipoCompetencia.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoCompetencia obj)
        {
            try
            {
                var _obj = await _db.tipoCompetencia.FirstOrDefaultAsync(e => e.TipoCompetenciaId == obj.TipoCompetenciaId);
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
