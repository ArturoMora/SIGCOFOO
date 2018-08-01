using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class ResultadosMetasRepository : IDisposable
    {

        private CP_Context _db;
        public ResultadosMetasRepository()
        {
            _db = new CP_Context();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {

                var entities = await _db.DbSetResultados
                    .Include(e => e.Metas)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{obj.ResultadoId
                                                       ,obj.ResultadoEsperado
                                                       ,obj.FechaEsperada
                                                       ,obj.idMeta
                                                       ,obj.Metas.Meta
                                                       ,obj.Metas.EstadoMeta
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
                var entities = await _db.DbSetResultados.Include(e => e.Metas).AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ResultadoId == id);
                Object resultado = new Object();
                resultado = new{entities.ResultadoId
                                                       ,entities.ResultadoEsperado
                                                       ,entities.FechaEsperada
                                                       ,entities.idMeta
                                                       ,entities.Metas.Meta
                                                       ,entities.Metas.EstadoMeta
                    };
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object[]> GetByComunidad(int id)
        {
            try
            {

                var entities = await _db.DbSetResultados
                    .Include(e => e.Metas)
                    .Where(e => e.Metas.idCP == id)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        obj.ResultadoId
                                                       ,
                        obj.ResultadoEsperado
                                                       ,
                        obj.FechaEsperada
                                                       ,
                        obj.idMeta
                                                       ,
                        obj.Metas.Meta
                                                       ,
                        obj.Metas.EstadoMeta
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public async Task<Object[]> GetByMeta(int id)
        //{
        //    try
        //    {

        //        var entities = await _db.DbSetResultados
        //            .Include(e => e.Metas)
        //            .Where(e => e.idMeta == id)
        //            .AsNoTracking().ToListAsync();
        //        Object[] lista = new Object[entities.Count];
        //        foreach (var obj in entities)
        //        {
        //            lista[entities.IndexOf(obj)] = new
        //            {
        //                obj.ResultadoId
        //                                               ,
        //                obj.ResultadoEsperado
        //                                               ,
        //                obj.FechaEsperada
        //                                               ,
        //                obj.idMeta
        //                                               ,
        //                obj.Metas.Meta
        //                                               ,
        //                obj.Metas.EstadoMeta
        //            };
        //        }

        //        return lista;

        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}


        public async Task<Object[]> GetByMeta(int id)
        {
            try
            {
                List<int> resultadosTerminados = new List<int>();
                resultadosTerminados = await _db.DbSetAvance.Where(e => e.Descripcion.Equals("100"))
                            .Select(e => e.idResultado)
                            .ToListAsync();

                var entities = await _db.DbSetResultados
                    .Include(e => e.Metas)
                    .Where(e => !resultadosTerminados.Contains(e.ResultadoId) && e.idMeta == id)
                    .AsNoTracking().ToListAsync();
                

                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    
                    lista[entities.IndexOf(obj)] = new
                    {                                   obj.ResultadoId
                                                       ,obj.ResultadoEsperado
                                                       ,obj.FechaEsperada
                                                       ,obj.idMeta
                                                       ,obj.Metas.Meta
                                                       ,obj.Metas.EstadoMeta
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Resultado model)
        {
            try
            {

                _db.DbSetResultados.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Resultado model)
        {
            try
            {
                var _model = await _db.DbSetResultados.FirstOrDefaultAsync(e => e.ResultadoId == model.ResultadoId);
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
                var _model = await _db.DbSetResultados.FirstOrDefaultAsync(e => e.ResultadoId == id);
                if (_model != null)
                {
                    _db.DbSetResultados.Remove(_model);
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
