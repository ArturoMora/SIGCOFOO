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
    public class FuncionesRolRepository : IDisposable
    {
       
        private GEN_Context _db;

        public FuncionesRolRepository() 
        {
            _db = new GEN_Context();
        }       

        public async Task<IEnumerable<FuncionesRol>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetFuncionesRol.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FuncionesRol>> GetByRol(int idrol)
        {
            try
            {
                var entities = await _db.dbSetFuncionesRol
                    .Where(e => e.IdRol == idrol )
                    .Include(e => e.Funcion)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<FuncionesRol> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetFuncionesRol.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.FuncionesRolId == id);
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
                
                foreach (var f in model.Funciones)
                {
                    try
                    {
                        FuncionesRol fr = new FuncionesRol();

                        fr.IdRol = f.IdRol;
                        fr.IdFuncion = f.IdFuncion;
                        fr.Estado = 1;

                        if (f.IdRol != 0 && f.IdFuncion != 0)
                        {

                            _db.dbSetFuncionesRol.Add(fr);
                            await _db.SaveChangesAsync();
                        }
                    }
                    catch (Exception e)
                    {
                        throw new Exception(e.Message, e);
                    }


                }                              
                
                    
                
               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

         
        }

        public async Task Update(FuncionesRol model)
        {
            try
            {
                var _model = await _db.dbSetFuncionesRol.FirstOrDefaultAsync(e => e.FuncionesRolId == model.FuncionesRolId);
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
                var _model = await _db.dbSetFuncionesRol.FirstOrDefaultAsync(e => e.FuncionesRolId == id);
                if (_model != null)
                {
                    _db.dbSetFuncionesRol.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(FuncionesRol obj)
        {
            try
            {
                var _obj = await _db.dbSetFuncionesRol.FirstOrDefaultAsync(e => e.FuncionesRolId == obj.FuncionesRolId);
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
