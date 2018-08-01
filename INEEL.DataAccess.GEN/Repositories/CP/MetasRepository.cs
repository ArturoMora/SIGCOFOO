using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class MetasRepository : IDisposable
    {

        private CP_Context _db;
        public MetasRepository()
        {
            _db = new CP_Context();
        }

        

        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetMetas.Include(e=>e.Comunidad).AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{Metaid = obj.Metaid
                                                       ,Meta =obj.Meta 
                                                       ,EstadoMeta =obj.EstadoMeta
                                                       ,idCP=obj.idCP
                                                       ,nombreComunidad=obj.Comunidad.Descripcion
                                                       
                    };
                }
         
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetByComunidad(int idComunidad)
        {
            try
            {
                var entities = await _db.DbSetMetas.Where(e => e.idCP == idComunidad).Include(e => e.Comunidad).AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        Metaid = obj.Metaid,
                        Meta = obj.Meta,
                        EstadoMeta = obj.EstadoMeta,
                        idCP = obj.idCP,
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetWithResultadosByComunidad(int idComunidad)
        {
            try
            {
                var entities = await _db.DbSetMetas.Where(e => e.idCP == idComunidad).Include(e => e.Comunidad).AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                ResultadosMetasRepository result= new ResultadosMetasRepository();
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        Metaid = obj.Metaid,
                        Meta = obj.Meta,
                        EstadoMeta = obj.EstadoMeta,
                        idCP = obj.idCP,
                        resultados= await result.GetByMeta(obj.Metaid)
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
                var entities = await _db.DbSetMetas.Include(e => e.Comunidad).AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Metaid == id);
                 Object lista = new Object();
                lista = new
                {
                    Metaid = entities.Metaid
                                                       ,
                    Meta = entities.Meta
                                                       ,
                    EstadoMeta = entities.EstadoMeta
                                                       ,
                    idCP = entities.idCP
                                                       ,
                    nombreComunidad = entities.Comunidad.Descripcion
                };
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Metas model)
        {
            try
            {

                _db.DbSetMetas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Metas model)
        {
            try
            {
                var _model = await _db.DbSetMetas.FirstOrDefaultAsync(e => e.Metaid == model.Metaid);
                if (_model != null)
                {
                    model.FechaRegistro=DateTime.Now;
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
                //NOTA: Al eliminar una meta tambien se eliminan sus resultados, es una eliminacion en cascada en automatico desde la BD
                var _model = await _db.DbSetMetas.FirstOrDefaultAsync(e => e.Metaid == id);
                if (_model != null)
                {
                    _db.DbSetMetas.Remove(_model);
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
