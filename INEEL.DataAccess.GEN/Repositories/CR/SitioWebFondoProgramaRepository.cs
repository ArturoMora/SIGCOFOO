using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class SitioWebFondoProgramaRepository : IDisposable
    {
        private CR_Context _db;
        public SitioWebFondoProgramaRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<SitioWebFondoPrograma>> GetAll()
        {
            try
            {
                var entities = await _db.SitioWebFondoPrograma.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SitioWebFondoPrograma> Get(int id)
        {
            try
            {
                var entities = await _db.SitioWebFondoPrograma.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.SitioWebFondoProgramaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<SitioWebFondoPrograma> Create(SitioWebFondoPrograma model)
        {
            try
            {

                var result = _db.SitioWebFondoPrograma.Add(model);
                await _db.SaveChangesAsync();
                return (result);
                              
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(SitioWebFondoPrograma model)
        {
            try
            {
                var _model = await _db.SitioWebFondoPrograma.FirstOrDefaultAsync(e => e.SitioWebFondoProgramaId == model.SitioWebFondoProgramaId);
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

        public async Task UpdateEstado(SitioWebFondoPrograma model)
        {
            try
            {
                var _model = await _db.SitioWebFondoPrograma.FirstOrDefaultAsync(e => e.SitioWebFondoProgramaId == model.SitioWebFondoProgramaId);
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
                var _model = await _db.SitioWebFondoPrograma.FirstOrDefaultAsync(e => e.SitioWebFondoProgramaId == id);
                if (_model != null)
                {
                    _db.SitioWebFondoPrograma.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> PreCreate(SitioWebFondoPrograma model)
        {
            var entities = await _db.SitioWebFondoPrograma.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Url == model.Url);
            if (entities == null)
            {
                return true;
            }
            return false;
        }
        public void Dispose()
        {
            _db.Dispose();
        }
    }
}

