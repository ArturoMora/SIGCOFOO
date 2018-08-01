using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class AvancesRepository : IDisposable
    {

        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        public AvancesRepository()
        {
            _db = new CP_Context();
            _adjuntoRepo=new AdjuntoRepository();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetAvance
                    .Include(e=>e.Adjunto)
                    .Include(e=>e.Resultado)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];  
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.AvanceId
                                                        ,obj.idResultado
                                                        ,obj.Resultado.ResultadoEsperado
                                                        ,obj.Resultado.FechaEsperada
                                                        ,obj.Resultado.ResultadoId
                                                        ,obj.AdjuntoId
                                                        ,obj.Adjunto
                                                        ,obj.Comentario
                                                        
                    };
                }
                return lista;

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
                var entities = await _db.DbSetAvance.Include("Resultado.Metas").Include(e=>e.Adjunto).Include(e=>e.AvanceMiembros)
                    .Where(e=>e.Resultado.Metas.idCP==id).OrderByDescending(e=>e.FechaRegistro)
                    .AsNoTracking().ToListAsync();
                Object [] lista=new Object[entities.Count];
                AvanceMiembrosRepository avance = new AvanceMiembrosRepository();
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new {obj.AvanceId
                                                        ,obj.idResultado
                                                        ,obj.Descripcion  
                                                        ,resultado= new { obj.Resultado.ResultadoEsperado, obj.Resultado.FechaEsperada, obj.Resultado.ResultadoId,obj.Resultado.Metas.Metaid,obj.Resultado.Metas.Meta }
                                                        ,obj.AdjuntoId
                                                        ,obj.Adjunto
                                                        ,obj.Comentario
                                                        ,obj.FechaRegistro
                                                        ,AvanceMiembros=await avance.GetByAvance(obj.AvanceId)
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
                var entities = await _db.DbSetAvance.Include(e => e.AvanceMiembros)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AvanceId == id);
                Object resultado = new Object();
                resultado = new {entities.AvanceId
                                                        ,entities.idResultado
                                                        ,entities.Resultado.ResultadoEsperado
                                                        ,entities.Resultado.FechaEsperada
                                                        ,entities.Resultado.ResultadoId
                                                        ,entities.AdjuntoId
                                                        ,entities.Adjunto
                                                        ,entities.Comentario
                    };
                
                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Avance> Create(Avance model)
        {
            try
            {
                _db.DbSetAvance.Add(model);
                await _db.SaveChangesAsync();
                if (model.avances!=null)
                {
                    AvanceMiembrosRepository av = new AvanceMiembrosRepository();
                    foreach (var c in model.avances)
                    {
                        c.AvanceId = model.AvanceId;
                        c.FechaRegistro=DateTime.Now;;
                        await av.Create(c);
                    }
                   
                    
                }
                return model;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Avance model)
        {
            try
            {
                var _model = await _db.DbSetAvance.FirstOrDefaultAsync(e => e.AvanceId == model.AvanceId);
                if (_model != null)
                {

                    if (model.AdjuntoId != null)
                    {
                        int id = Convert.ToInt32(model.AdjuntoId);
                        model.AdjuntoId = null;
                        _db.Entry(_model).CurrentValues.SetValues(model);
                        await _db.SaveChangesAsync();
                        await _adjuntoRepo.Delete(id);
                    }
                    if (model.Adjunto != null && model.AdjuntoId == null)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.AdjuntoId = key.AdjuntoId;
                        model.Adjunto.AdjuntoId = key.AdjuntoId;

                    }
                    if (model.avances != null)
                    {
                        //Se eliminan los anteriores para crear un nuevo registro de los agregados
                        var Autores = await _db.DbSetAvanceMiembros.Where(e => e.AvanceId == model.AvanceId).
                            Select(x=>x.AvanceMiembroId).ToListAsync();
                        AvanceMiembrosRepository av = new AvanceMiembrosRepository();
                        foreach (var aut in Autores)
                        {
                            await av.Delete(aut);
                        }
                        
                        //Ahora se crean los nuevos autores
                        foreach (var c in model.avances)
                        {
                            c.AvanceId = model.AvanceId;
                            c.FechaRegistro = DateTime.Now; ;
                            await av.Create(c);
                        }


                    }

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
                var _model = await _db.DbSetAvance.FirstOrDefaultAsync(e => e.AvanceId == id);
                if (_model != null)
                {
                    _db.DbSetAvance.Remove(_model);
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
