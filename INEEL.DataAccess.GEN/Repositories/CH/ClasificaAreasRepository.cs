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
   public  class ClasificaAreasRepository : IDisposable
    {
        private SIGCOCHContext _db;
        public ClasificaAreasRepository()
        {
            _db = new SIGCOCHContext();
        }

        //public async Task<IEnumerable<EstadoEvaluacion>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<ClasificacionAreas>> GetAll()
        {
            try
            {
                var entities = await _db.clasificacionAreas.AsNoTracking().OrderBy(x=>x.nombreArea).ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ClasificacionAreas> Get(int id)
        {
            try
            {
                var entities = await _db.clasificacionAreas.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<ClasificacionAreas>>  GetByPeriodo(int id)
        {
            try
            {
                var entities = await _db.clasificacionAreas
                     .Where(e => e.periodoId == id)
                     .Include(e => e.tipoarea)
                     .OrderByDescending(e => e.nombreArea)
                     .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<ClasificacionAreas>> GetByTipoArea(BusquedaNivel param)
        {
            try
            {

                
                var entities = await _db.clasificacionAreas
                         .Where(e => e.periodoId == param.periodoId)
                         .Where(e => e.TipoAreaId == param.areaId)
                         .Include(e => e.tipoarea)
                         .OrderByDescending(e => e.nombreArea)
                         .AsNoTracking().ToListAsync();
              
                return entities;
               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(ClasificacionAreas model)
        {
            try
            {

                _db.clasificacionAreas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ClasificacionAreas model)
        {
            try
            {
                var _model = await _db.clasificacionAreas.FirstOrDefaultAsync(e => e.id == model.id);
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
                var _model = await _db.clasificacionAreas.FirstOrDefaultAsync(e => e.id == id);
                if (_model != null)
                {
                    _db.clasificacionAreas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(ClasificacionAreas obj)
        {
            try
            {
                var _obj = await _db.clasificacionAreas.FirstOrDefaultAsync(e => e.id == obj.id);
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

