using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class FamiliasSindRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public FamiliasSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<FamiliaPuestosSind>> GetAll()
        {
            try
            {
                var entities = await _db.familiasPuestosSind.Where(e => e.estado == 1).OrderBy(e =>e.NombreFamilia).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FamiliaPuestosSind> Get(int id)
        {
            try
            {
                var entities = await _db.familiasPuestosSind.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.FamiliaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(FamiliaPuestosSind model)
        {
            try
            {

                _db.familiasPuestosSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(FamiliaPuestosSind model)
        {
            try
            {
                var _model = await _db.familiasPuestosSind.FirstOrDefaultAsync(e => e.FamiliaId == model.FamiliaId);
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
                var _model = await _db.familiasPuestosSind.FirstOrDefaultAsync(e => e.FamiliaId == id);
                if (_model != null)
                {
                    _db.familiasPuestosSind.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(FamiliaPuestosSind obj)
        {
            try
            {
                var _obj = await _db.familiasPuestosSind.FirstOrDefaultAsync(e => e.FamiliaId == obj.FamiliaId);
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
