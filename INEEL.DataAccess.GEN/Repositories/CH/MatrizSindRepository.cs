using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class MatrizSindRepository :IDisposable
    {
        private SIGCOCHContext _db;
        public MatrizSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<MatrizCompetenciasSind>> GetAll()
        {
            try
            {
                var entities = await _db.matrizCompetenciasSin.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<MatrizCompetenciasSind> Get(int id)
        {
            try
            {
                var entities = await _db.matrizCompetenciasSin.AsNoTracking()
                    .Include(x=> x.categorias)
                    .Include(x => x.categorias.FamiliaPuestos)
                    .Include(x => x.relaciones)
                    .Include(x => x.relaciones.competenciasSind)
                    .Include(x => x.relaciones.niveles)
                    .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<MatrizCompetenciasSind>> GetCompetencias(int id)
        {
            try
            {
                var entities = await _db.matrizCompetenciasSin.AsNoTracking()
                    .Where(x => x.idCategoria == id)
                    .Include(x => x.categorias.FamiliaPuestos)
                    .Include(x => x.relaciones.competenciasSind)
                    .Include(x => x.relaciones.niveles)
                    .Include(x => x.relaciones.relacioncomportamiento.comportamientos)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(MatrizCompetenciasSind model)
        {
            try
            {

                _db.matrizCompetenciasSin.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MatrizCompetenciasSind model)
        {
            try
            {
                var _model = await _db.matrizCompetenciasSin.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.matrizCompetenciasSin.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.matrizCompetenciasSin.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(MatrizCompetenciasSind obj)
        {
            try
            {
                var _obj = await _db.matrizCompetenciasSin.FirstOrDefaultAsync(e => e.id == obj.id);
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
