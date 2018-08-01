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
    public class ModulosRepository : IDisposable
    {
        private GEN_Context _db;

        public ModulosRepository()
        {
            _db = new GEN_Context();
        }
        public ModulosRepository(GEN_Context ctx)
        {
            _db = ctx;
        }
        public async Task<IEnumerable<Object>> GetAllWithStatus(int status)
        {
            try
            {
                var entities = await (from modulo in _db.dbSetModulos
                                      where modulo.Estado == status orderby modulo.Secuencia ascending
                                      select new
                                      {
                                          ModuloId = modulo.ModuloId,
                                          Descripcion = modulo.Descripcion,
                                          Url =modulo.Url,
                                          UrlImagen = modulo.UrlImagen
                                      }).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Modulo>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetModulos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Modulo> GetById(string id)
        {
            try
            {
                var entities = await _db.dbSetModulos.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.ModuloId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Modulo model)
        {
            try
            {

                _db.dbSetModulos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Modulo model)
        {
            try
            {
                var _model = await _db.dbSetModulos.FirstOrDefaultAsync(e => e.ModuloId == model.ModuloId);
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
                var _model = await _db.dbSetModulos.FirstOrDefaultAsync(e => e.ModuloId == id);
                if (_model != null)
                {
                    _db.dbSetModulos.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Modulo obj)
        {
            try
            {
                var _obj = await _db.dbSetModulos.FirstOrDefaultAsync(e => e.ModuloId == obj.ModuloId);
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
