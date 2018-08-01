using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CategoriasCompetenciasSindRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public CategoriasCompetenciasSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<CategoriasCompetenciasSind>> GetAll()
        {
            try
            {
                var entities = await _db.categoriasCompetenciasSin.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<CategoriasCompetenciasSind> Get(int id)
        {
            try
            {
                var entities = await _db.categoriasCompetenciasSin.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.CategoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CategoriasCompetenciasSind>> GetCategoryFam(int id)
        {
            try
            {
                var entities = await _db.categoriasCompetenciasSin
                    .Where(e => e.FamiliaId == id)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(CategoriasCompetenciasSind model)
        {
            try
            {

                _db.categoriasCompetenciasSin.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CategoriasCompetenciasSind model)
        {
            try
            {
                var _model = await _db.categoriasCompetenciasSin.FirstOrDefaultAsync(e => e.CategoriaId == model.CategoriaId);
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
                var _model = await _db.categoriasCompetenciasSin.FirstOrDefaultAsync(e => e.CategoriaId == id);
                if (_model != null)
                {
                    _db.categoriasCompetenciasSin.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(CategoriasCompetenciasSind obj)
        {
            try
            {
                var _obj = await _db.categoriasCompetenciasSin.FirstOrDefaultAsync(e => e.CategoriaId == obj.CategoriaId);
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
