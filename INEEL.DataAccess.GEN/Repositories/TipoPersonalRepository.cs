using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class TipoPersonalRepository : IDisposable
    {

        private GEN_Context _db;
        public TipoPersonalRepository()
        {
            _db = new GEN_Context(); 
        }
        
        public async Task<IEnumerable<String>> GetIdsByDescription(string tipoStr)
        {
            try
            {
                var entities = await _db.dbSetTipoPersona.AsNoTracking()
                    .Where(x=> x.Descripcion.Contains(tipoStr))
                    .Select(x=> x.TipoPersonaId)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<TipoPersonal>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetTipoPersona.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoPersonal> GetById(string id)
        {
            try
            {
                var entities = await _db.dbSetTipoPersona.AsNoTracking()
                   
                    .FirstOrDefaultAsync(e => e.TipoPersonaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        
        public async Task Create(TipoPersonal model)
        {
            try
            {
                _db.dbSetTipoPersona.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoPersonal model)
        {
            try
            {
                var _model = await _db.dbSetTipoPersona.FirstOrDefaultAsync(e => e.TipoPersonaId == model.TipoPersonaId);
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

        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.dbSetTipoPersona.FirstOrDefaultAsync(e => e.TipoPersonaId == id);
                if (_model != null)
                {
                    _db.dbSetTipoPersona.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TipoPersonal obj)
        {
            try
            {
                var _obj = await _db.dbSetTipoPersona.FirstOrDefaultAsync(e => e.TipoPersonaId == obj.TipoPersonaId);
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
