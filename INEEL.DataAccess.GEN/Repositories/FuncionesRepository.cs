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
    public class FuncionesRepository : IDisposable
    {

        private GEN_Context _db; 

        public FuncionesRepository()
        {
            _db = new GEN_Context();
        }

        public async Task<IEnumerable<Funcion>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetFuncion
                    .Include(e => e.FuncionPadre)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Funcion> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetFuncion.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.FuncionesId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Funcion>> GetFunByModulo(string id)
        {
            try
            {
                var entities = await _db.dbSetFuncion
                    .Where(e => e.IdModulo == id)
                    .OrderBy(e => e.Secuencia)
                    .Include(e => e.FuncionPadre)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public IEnumerable<Funcion> GetFunByModuloRol(RolModulo_Model obj)
        {
            try
            {
                /*
                var entities = _db.dbSetFuncion.
                              Where(e => e.Estado == 1 && e.IdModulo == obj.modulo && !_db.dbSetFuncionesRol
                              .Select(f => f.IdFuncion)
                              .Contains(e.FuncionesId)
                              );
                              */

                var entities = from c in _db.dbSetFuncion where !(from o in _db.dbSetFuncionesRol where o.IdRol == obj.rol select o.IdFuncion).Contains(c.FuncionesId)  && c.Estado == 1 && c.IdModulo == obj.modulo select c;
                
               int enumeracion =  entities.Count();

                if (enumeracion == 0) {

                               entities =   _db.dbSetFuncion
                              .Where(e => e.Estado == 1 && e.IdModulo == obj.modulo)  ;
                }

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Funcion>> GetFuncionPadre(string id)
        {
            try
            {
                var entities = await _db.dbSetFuncion
                    .Where(e => e.IdModulo == id)
                    .Where(e => e.Estado == 1)
                    .Where(e => e.Nivel == 0)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Funcion> GetByModulo(string id)
        {
            try
            {
                var entities = await _db.dbSetFuncion.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.IdModulo == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Funcion model)
        {
            try
            {

                _db.dbSetFuncion.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Funcion model)
        {
            try
            {
                var _model = await _db.dbSetFuncion.FirstOrDefaultAsync(e => e.FuncionesId == model.FuncionesId);
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
                var _model = await _db.dbSetFuncion.FirstOrDefaultAsync(e => e.FuncionesId == id);
                if (_model != null)
                {
                    _db.dbSetFuncion.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Funcion obj)
        {
            try
            {
                var _obj = await _db.dbSetFuncion.FirstOrDefaultAsync(e => e.FuncionesId == obj.FuncionesId);
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



        public async Task<IEnumerable<Funcion>> GetFunByModuloWithParent(string id)
        {
            try
            {


                if (id != "")
                {

                    var funciones = await _db.dbSetFuncion
                        .Where(e => e.IdModulo == id)
                        .Where(e => e.Estado == 1)
                        .OrderBy(e => e.Secuencia)
                        .AsNoTracking().ToListAsync();

                    foreach (var item in funciones)
                    {

                        item.nombreFuncionPadre = _db.dbSetFuncion
                              .Where(e => e.IdPadre == item.IdPadre)
                              .Select(e => e.Nombre)
                              .FirstOrDefault() ?? string.Empty;
                    }

                    return funciones;
                }
                else
                {
                    var entities = await _db.dbSetFuncion
                   .Where(e => e.Estado == 1)
                   .AsNoTracking().ToListAsync();
                    return entities;
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
