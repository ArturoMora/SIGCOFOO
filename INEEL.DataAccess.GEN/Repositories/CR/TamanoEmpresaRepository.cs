using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class TamanoEmpresaRepository : IDisposable
    {
        private CR_Context _db;
        public TamanoEmpresaRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<TamanoEmpresa>> GetAll()
        {
            try
            {
                var entities = await _db.TamanoEmpresa.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TamanoEmpresa>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.TamanoEmpresa.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TamanoEmpresa> Get(int id)
        {
            try
            {
                var entities = await _db.TamanoEmpresa.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TamanoEmpresaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(TamanoEmpresa model)
        {
            try
            {

                _db.TamanoEmpresa.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TamanoEmpresa model)
        {
            try
            {
                var _model = await _db.TamanoEmpresa.FirstOrDefaultAsync(e => e.TamanoEmpresaId == model.TamanoEmpresaId);
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
                var _model = await _db.TamanoEmpresa.FirstOrDefaultAsync(e => e.TamanoEmpresaId == id);
                if (_model != null)
                {
                    _db.TamanoEmpresa.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(TamanoEmpresa model)
        {
            try
            {
                var _model = await _db.TamanoEmpresa.FirstOrDefaultAsync(e => e.TamanoEmpresaId == model.TamanoEmpresaId);
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
        
        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}

