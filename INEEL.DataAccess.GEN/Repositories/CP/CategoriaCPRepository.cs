using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using System.Linq.Dynamic;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class CategoriaCPRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CP 
        /// </summary>
        private CP_Context _db;
        public CategoriaCPRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetCategorias.Where(e => e.Estado == true).AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{Nombre = obj.Nombre
                                                       ,Descripcion = obj.Descripcion
                                                       ,Estado=obj.Estado
                                                       ,CatCPId=obj.CatCPId
                    };
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object[]> GetAllCatalogo()
        {
            try
            {
                var entities = await _db.DbSetCategorias.AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        Nombre = obj.Nombre
                                                       ,
                        Descripcion = obj.Descripcion
                                                       ,
                        Estado = obj.Estado
                                                       ,
                        CatCPId = obj.CatCPId
                    };
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetAllActivas()
        {
            try
            {

              
               

                var entities = await _db.DbSetCategorias.Where(e => e.Estado == true).AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {

                    if (obj.Estado == true)
                    {

                        lista[entities.IndexOf(obj)] = new
                        {
                            Nombre = obj.Nombre
                                                           ,
                            Descripcion = obj.Descripcion
                                                           ,
                            Estado = obj.Estado
                                                           ,
                            CatCPId = obj.CatCPId
                        };
                    }


                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetById(int id)
        {
            try
            {
                var entities = await _db.DbSetCategorias.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.CatCPId == id);
                Object lista = new Object();
                lista = new{Nombre = entities.Nombre
                                                       ,Descripcion = entities.Descripcion
                                                       ,Estado= entities.Estado
                                                       ,CatCPId= entities.CatCPId
                                                       ,entities.FechaRegistro
                                                       ,entities.Autor
                            };

                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }






        public async Task Create(CategoriaCP model)
        {
            try
            {

                _db.DbSetCategorias.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CategoriaCP model)
        {
            try
            {
                var _model = await _db.DbSetCategorias.FirstOrDefaultAsync(e => e.CatCPId == model.CatCPId);
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

        public async Task UpdateEstado(CategoriaCP model)
        {
            try
            {
                var _model = await _db.DbSetCategorias.FirstOrDefaultAsync(e => e.CatCPId == model.CatCPId);
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
                var _model = await _db.DbSetCategorias.FirstOrDefaultAsync(e => e.CatCPId == id);
                if (_model != null)
                {
                    _db.DbSetCategorias.Remove(_model);
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
