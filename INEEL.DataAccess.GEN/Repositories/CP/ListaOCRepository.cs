using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class ListaOCRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CP 
        /// </summary>
        private CP_Context _db;

        public ListaOCRepository()
        {
            _db = new CP_Context();
        }


        public async Task<IEnumerable<ListaOC>> GetAll()
        {
            try
            {
                var entities = await _db.DbSetListaOC.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<ListaOC> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetListaOC.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ListaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(ListaOC model)
        {
            try
            {

                _db.DbSetListaOC.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(ListaOC model)
        {
            try
            {
                var _model = await _db.DbSetListaOC.FirstOrDefaultAsync(e => e.ListaId == model.ListaId);
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

        public async Task UpdateEstado(ListaOC model)
        {
            try
            {
                var _model = await _db.DbSetListaOC.FirstOrDefaultAsync(e => e.ListaId == model.ListaId);
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
                var _model = await _db.DbSetListaOC.FirstOrDefaultAsync(e => e.ListaId == id);
                if (_model != null)
                {
                    _db.DbSetListaOC.Remove(_model);
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
