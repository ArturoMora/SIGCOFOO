using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class CategoriaSitioRepository : IDisposable
    {
        private CP_Context _db;
        public CategoriaSitioRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetCategoriaSitios.Where(e=>e.Estado==true).AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{CatSitioId = obj.CatSitioId
                                                       ,NombreCategoria = obj.NombreCategoria
                                                       ,Descripcion=obj.Descripcion
                                                       ,Estado=obj.Estado
                                                       
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
                var entities = await _db.DbSetCategoriaSitios.AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        CatSitioId = obj.CatSitioId
                                                       ,
                        NombreCategoria = obj.NombreCategoria
                                                       ,
                        Descripcion = obj.Descripcion
                                                       ,
                        Estado = obj.Estado

                    };
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
                var entities = await _db.DbSetCategoriaSitios.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.CatSitioId == id);
                Object lista = new Object();
                lista = new{CatSitioId = entities.CatSitioId
                                                       ,NombreCategoria = entities.NombreCategoria
                                                       ,Descripcion= entities.Descripcion
                                                       ,Estado= entities.Estado
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



        public async Task Create(CategoriaSitio model)
        {
            try
            {

                _db.DbSetCategoriaSitios.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CategoriaSitio model)
        {
            try
            {
                var _model = await _db.DbSetCategoriaSitios.FirstOrDefaultAsync(e => e.CatSitioId == model.CatSitioId);
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

        public async Task UpdateEstado(CategoriaSitio model)
        {
            try
            {
                var _model = await _db.DbSetCategoriaSitios.FirstOrDefaultAsync(e => e.CatSitioId == model.CatSitioId);
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
                var _model = await _db.DbSetCategoriaSitios.FirstOrDefaultAsync(e => e.CatSitioId == id);
                if (_model != null)
                {
                    _db.DbSetCategoriaSitios.Remove(_model);
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
