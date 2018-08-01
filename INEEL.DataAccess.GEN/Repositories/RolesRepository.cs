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
    public class RolesRepository : IDisposable
    {
        
        private GEN_Context _db;
        public RolesRepository()
        {
            _db = new GEN_Context();
        }

       

        public async Task<IEnumerable<Roles>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetRoles.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Roles> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetRoles.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.RolId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        
        public async Task Create(Roles model)
        {
            try
            {

                var resultados = await _db.Database.SqlQuery<String>("SELECT Descripcion FROM GEN.cat_Roles where Descripcion collate Latin1_General_CI_AI = '" + model.Descripcion + "'").CountAsync();

                if (resultados > 0)
                {
                    throw new Exception("El rol que desea agregar ya existe");
                }
                else
                {
                    _db.dbSetRoles.Add(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task CreateFuncionesRol(Roles model)
        {
            try
            {
                foreach (var f in model.Funciones)
                {
                    try
                    {
                        FuncionesRol fr = new FuncionesRol();

                        fr.IdRol = model.RolId;
                        fr.IdFuncion = f.IdFuncion;
                        fr.Estado = 1;

                        _db.dbSetFuncionesRol.Add(fr);
                        await _db.SaveChangesAsync();
                    }
                    catch (Exception e)
                    {

                    }                    
                }
                
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Roles model)
        {
            try
            {
                var resultados = await _db.Database.SqlQuery<String>("SELECT Descripcion FROM GEN.cat_Roles where Descripcion collate Latin1_General_CI_AI = '" + model.Descripcion + "'").CountAsync();

                if (resultados > 0)
                {
                    throw new Exception("El rol que desea modificar ya existe");
                }
                else
                {

                    var _model = await _db.dbSetRoles.FirstOrDefaultAsync(e => e.RolId == model.RolId);
                    if (_model != null)
                    {
                        _db.Entry(_model).CurrentValues.SetValues(model);
                        await _db.SaveChangesAsync();
                    }
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
                var _model = await _db.dbSetRoles.FirstOrDefaultAsync(e => e.RolId == id);
                if (_model != null)
                {
                    _db.dbSetRoles.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Roles obj)
        {
            try
            {
                var _obj = await _db.dbSetRoles.FirstOrDefaultAsync(e => e.RolId == obj.RolId);
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
