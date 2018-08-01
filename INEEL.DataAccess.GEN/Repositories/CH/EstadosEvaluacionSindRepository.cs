using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EstadosEvaluacionSindRepository : IDisposable
    {
        private SIGCOCHContext _db;
        public EstadosEvaluacionSindRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<EstadoEvaluacionSind>> GetAll()
        {
            try
            {
                var entities = await _db.estadoSind.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<EstadoEvaluacionSind> Get(int id)
        {
            try
            {
                var entities = await _db.estadoSind.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(EstadoEvaluacionSind model)
        {
            try
            {

                _db.estadoSind.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(EstadoEvaluacionSind model)
        {
            try
            {
                var _model = await _db.estadoSind.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.estadoSind.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.estadoSind.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(EstadoEvaluacionSind obj)
        {
            try
            {
                var _obj = await _db.estadoSind.FirstOrDefaultAsync(e => e.id == obj.id);
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
