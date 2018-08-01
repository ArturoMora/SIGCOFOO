using System;
using System.Linq;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class TipoLineamientoRepository : IDisposable
    {
        private CP_Context _db;
        public TipoLineamientoRepository()
        {
            _db = new CP_Context();
        }

        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetTipoLineamientos.Where(e => e.Estado == true).AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{TipoLineamientoId  = obj.TipoLineamientoId
                                                       ,Nombre = obj.Nombre
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
                var entities = await _db.DbSetTipoLineamientos.AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        TipoLineamientoId = obj.TipoLineamientoId
                                                       ,
                        Nombre = obj.Nombre
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
                var entities = await _db.DbSetTipoLineamientos.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TipoLineamientoId == id);
                Object lista = new Object();
                lista = new{TipoLineamientoId  = entities.TipoLineamientoId
                                                       ,Nombre = entities.Nombre
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



        public async Task Create(TipoLineamiento model)
        {
            try
            {

                _db.DbSetTipoLineamientos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoLineamiento model)
        {
            try
            {
                var _model = await _db.DbSetTipoLineamientos.FirstOrDefaultAsync(e => e.TipoLineamientoId == model.TipoLineamientoId);
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

        public async Task UpdateEstado(TipoLineamiento model)
        {
            try
            {
                var _model = await _db.DbSetTipoLineamientos.FirstOrDefaultAsync(e => e.TipoLineamientoId == model.TipoLineamientoId);
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
                var _model = await _db.DbSetTipoLineamientos.FirstOrDefaultAsync(e => e.TipoLineamientoId == id);
                if (_model != null)
                {
                    _db.DbSetTipoLineamientos.Remove(_model);
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
