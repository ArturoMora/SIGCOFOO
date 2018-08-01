using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using System.Linq;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class TipoDocumentoRepository : IDisposable
    {

        private CP_Context _db;
        public TipoDocumentoRepository()
        {
            _db = new CP_Context();
        }

        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetTipoDocumentos.Where(e => e.Estado == true).AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{Nombre = obj.Nombre
                                                       ,Descripcion = obj.Descripcion
                                                       ,TipoDocumentoId =obj.TipoDocumentoId
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
                var entities = await _db.DbSetTipoDocumentos.AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        Nombre = obj.Nombre
                                                       ,
                        Descripcion = obj.Descripcion
                                                       ,
                        TipoDocumentoId = obj.TipoDocumentoId
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

        public async Task<Object[]> GetByEstado()
        {
            try
            {
                var entities = await _db.DbSetTipoDocumentos.Where(e => e.Estado == true).AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        Nombre = obj.Nombre
                                                       ,
                        Descripcion = obj.Descripcion
                                                       ,
                        TipoDocumentoId = obj.TipoDocumentoId
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
                var entities = await _db.DbSetTipoDocumentos.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TipoDocumentoId  == id);
               Object lista = new Object();
                lista = new{                            Nombre = entities.Nombre
                                                       ,Descripcion = entities.Descripcion
                                                       ,TipoDocumentoId = entities.TipoDocumentoId
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



        public async Task Create(TipoDocumento model)
        {
            try
            {

                _db.DbSetTipoDocumentos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(TipoDocumento model)
        {
            try
            {
                var _model = await _db.DbSetTipoDocumentos.FirstOrDefaultAsync(e => e.TipoDocumentoId  == model.TipoDocumentoId );
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

        public async Task UpdateEstado(TipoDocumento model)
        {
            try
            {
                var _model = await _db.DbSetTipoDocumentos.FirstOrDefaultAsync(e => e.TipoDocumentoId == model.TipoDocumentoId);
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
                var _model = await _db.DbSetTipoDocumentos.FirstOrDefaultAsync(e => e.TipoDocumentoId  == id);
                if (_model != null)
                {
                    _db.DbSetTipoDocumentos.Remove(_model);
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
