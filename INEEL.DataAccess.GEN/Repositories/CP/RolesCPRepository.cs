using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class RolesCPRepository : IDisposable
    {
        private CP_Context _db;
        public RolesCPRepository()
        {
            _db = new CP_Context();
        }


        public async Task<IEnumerable<RolesCP>> GetAll()
        {
            try
            {
                var entities = await _db.DbSetRoles.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RolesCP> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetRoles.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.RolId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(RolesCP model)
        {
            try
            {

                _db.DbSetRoles.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RolesCP model)
        {
            try
            {
                var _model = await _db.DbSetRoles.FirstOrDefaultAsync(e => e.RolId == model.RolId);
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

        //public async Task UpdateEstado(RolesCP model)
        //{
        //    try
        //    {
        //        var _model = await _db.DbSetRoles.FirstOrDefaultAsync(e => e.RolId == model.RolId);
        //        if (_model != null)
        //        {
        //            _model.Estado = model.Estado;
        //            await _db.SaveChangesAsync();
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.DbSetRoles.FirstOrDefaultAsync(e => e.RolId == id);
                if (_model != null)
                {
                    _db.DbSetRoles.Remove(_model);
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
