using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class LineaDesarrolloTecnologicoRepository : IDisposable
    {

        private CR_Context _db;
        public LineaDesarrolloTecnologicoRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<LineaDesarrolloTecnologico>> GetAll()
        {
            try
            {
                var entities = await _db.LineaDesarrolloTecnologico.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<LineaDesarrolloTecnologico>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.LineaDesarrolloTecnologico.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LineaDesarrolloTecnologico> Get(int id)
        {
            try
            {
                var entities = await _db.LineaDesarrolloTecnologico.AsNoTracking()

                    .FirstOrDefaultAsync(e => e.LineaDesarrolloTecnologicoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(LineaDesarrolloTecnologico model)
        {
            try
            {

                _db.LineaDesarrolloTecnologico.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LineaDesarrolloTecnologico model)
        {
            try
            {
                var _model = await _db.LineaDesarrolloTecnologico.FirstOrDefaultAsync(e => e.LineaDesarrolloTecnologicoId == model.LineaDesarrolloTecnologicoId);
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

        public async Task UpdateEstado(LineaDesarrolloTecnologico model)
        {
            try
            {
                var _model = await _db.LineaDesarrolloTecnologico.FirstOrDefaultAsync(e => e.LineaDesarrolloTecnologicoId == model.LineaDesarrolloTecnologicoId);
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
                var _model = await _db.LineaDesarrolloTecnologico.FirstOrDefaultAsync(e => e.LineaDesarrolloTecnologicoId == id);
                if (_model != null)
                {
                    _db.LineaDesarrolloTecnologico.Remove(_model);
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
