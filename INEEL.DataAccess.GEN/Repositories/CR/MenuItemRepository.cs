using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class MenuItemRepository : IDisposable
    {
        private CR_Context _db;
        public MenuItemRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<MenuItem>> GetAll()
        {
            try
            {

                var entities = await _db.MenuItem.AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<MenuItem> GetById(int id)
        {
            try
            {
                var entities = await _db.MenuItem.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.MenuItemId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<MenuItem>> GetByParent(int id)
        {
            try
            {
                // Para traernos los elementos que sean raiz se manda un cero
                if (id==0)
                {
                    var entities = await _db.MenuItem
                        .Where(e => e.ParentMenuItemId == null)
                        .AsNoTracking().ToListAsync();
                    return entities;

                }
                else
                {
                    var entities = await _db.MenuItem
                        .Where(e => e.ParentMenuItemId == id)
                        .AsNoTracking().ToListAsync();
                    return entities;

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(MenuItem model)
        {
            try
            {

                _db.MenuItem.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MenuItem model)
        {
            try
            {
                var _model = await _db.MenuItem.FirstOrDefaultAsync(e => e.MenuItemId == model.MenuItemId);
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
                var _model = await _db.MenuItem.FirstOrDefaultAsync(e => e.MenuItemId == id);
                if (_model != null)
                {
                    _db.MenuItem.Remove(_model);
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