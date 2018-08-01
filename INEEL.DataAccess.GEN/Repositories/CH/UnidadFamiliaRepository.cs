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
    public  class UnidadFamiliaRepository : IDisposable
    {

        private SIGCOCHContext _db;
        public UnidadFamiliaRepository()
        {
            _db = new SIGCOCHContext();
        }
        
        public async Task<IEnumerable<FamiliaUnidad>> GetAll()
        {
            try
            {
                var entities = await _db.familiaUnidad.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<FamiliaUnidad>> GetByFamilia(int id)
        {
            try
            {
                var entities = await _db.familiaUnidad
                    .Where(e => e.FamiliaPuestosId == id)                 
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<FamiliaUnidad>> GetByPeriodo(string id)
        {
            try
            {
                var entities = await _db.familiaUnidad
                    .Where(e => e.periodo == id)                  
                    .Include(e => e.tipoarea)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FamiliaUnidad>> GetByPeriodoSinDuplicados(string id)
        {
            try
            {
                var entities = await _db.familiaUnidad
                    .Where(e => e.periodo == id)
                    .Include(e => e.tipoarea)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<FamiliaUnidad>> GetByUnidad(BusquedaNivel param)
        {
            try
            {
                var entities = await _db.familiaUnidad
                  
                    .Where(e => e.periodo == param.periodo)
                    .Where(e => e.unidad == param.claveUnidad)
                    .Include(e => e.familia)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FamiliaUnidad> Get(int id)
        {
            try
            {
                var entities = await _db.familiaUnidad.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.FamiliaUnidadId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(FamiliaUnidad model)
        {
            try
            {

                _db.familiaUnidad.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(FamiliaUnidad model)
        {
            try
            {
                var _model = await _db.familiaUnidad.FirstOrDefaultAsync(e => e.FamiliaUnidadId == model.FamiliaUnidadId);
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
                var _model = await _db.familiaUnidad.FirstOrDefaultAsync(e => e.FamiliaUnidadId == id);
                if (_model != null)
                {
                    _db.familiaUnidad.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(FamiliaUnidad obj)
        {
            try
            {
                var _obj = await _db.familiaUnidad.FirstOrDefaultAsync(e => e.FamiliaUnidadId == obj.FamiliaUnidadId);
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
