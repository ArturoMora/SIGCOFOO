using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class NoticiasRepository : IDisposable
    {

        private CP_Context _db;
        public NoticiasRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetNoticias.Include(e => e.Comunidad).AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{NoticiaId = obj.NoticiaId
                                                       ,Nombre = obj.Nombre
                                                       ,Descripcion=obj.Descripcion
                                                       ,Estado=obj.Estado
                                                       ,idComunidad =obj.idComunidad
                                                       
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
                var entities = await _db.DbSetNoticias.Include(e => e.Comunidad).AsNoTracking()
                    .FirstOrDefaultAsync(e => e.NoticiaId  == id);
                 Object lista = new Object();
                lista = new{NoticiaId = entities.NoticiaId
                                                       ,Nombre = entities.Nombre
                                                       ,Descripcion= entities.Descripcion
                                                       ,Estado= entities.Estado
                                                       ,idComunidad = entities.idComunidad
                            };
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Object[]> GetBycomunidad(int id)
        {
            try
            {
                var entities = await _db.DbSetNoticias.Include(e => e.Comunidad).Where(e=>e.idComunidad==id).AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{NoticiaId = obj.NoticiaId
                                                       ,Nombre = obj.Nombre
                                                       ,Descripcion=obj.Descripcion
                                                       ,Estado=obj.Estado
                                                       ,idComunidad =obj.idComunidad
                                                       ,obj.FechaRegistro
                                                       
                    };
                }
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Noticia model)
        {
            try
            {

                _db.DbSetNoticias.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Noticia model)
        {
            try
            {
                var _model = await _db.DbSetNoticias.FirstOrDefaultAsync(e => e.NoticiaId  == model.NoticiaId );
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
                var _model = await _db.DbSetNoticias.FirstOrDefaultAsync(e => e.NoticiaId  == id);
                if (_model != null)
                {
                    _db.DbSetNoticias.Remove(_model);
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
