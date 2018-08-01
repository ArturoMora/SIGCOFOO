using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class SegmentoMercadoRepository : IDisposable
    {

        private CR_Context _db;
        public SegmentoMercadoRepository()
        {
            _db = new CR_Context();
        }

        public SegmentoMercadoRepository(CR_Context _dbInstance)
        {
            _db = _dbInstance;
        }

        public async Task<IEnumerable<SegmentoMercado>> GetAll()
        {
            try
            {
                var entities = await _db.SegmentoMercado.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetSegmentosForSelect()
        {
            try
            {
                var entities = await _db.SegmentoMercado.Where(e => e.Estado == true).AsNoTracking().Select(x => new
                {
                    id = x.SegmentoMercadoId,
                    nombre = x.NomSegMerc
                }).ToListAsync();

                return entities;

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SegmentoMercado>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.SegmentoMercado.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SegmentoMercado> Get(int id)
        {
            try
            {
                var entities = await _db.SegmentoMercado.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.SegmentoMercadoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(SegmentoMercado model)
        {
            try
            {

                _db.SegmentoMercado.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(SegmentoMercado model)
        {
            try
            {
                var _model = await _db.SegmentoMercado.FirstOrDefaultAsync(e => e.SegmentoMercadoId == model.SegmentoMercadoId);
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

        public async Task UpdateEstado(SegmentoMercado model)
        {
            try
            {
                var _model = await _db.SegmentoMercado.FirstOrDefaultAsync(e => e.SegmentoMercadoId == model.SegmentoMercadoId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
                var _model = await _db.SegmentoMercado.FirstOrDefaultAsync(e => e.SegmentoMercadoId == id);
                if (_model != null)
                {
                    _db.SegmentoMercado.Remove(_model);
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
            _db.Dispose();
        }
    }
}

