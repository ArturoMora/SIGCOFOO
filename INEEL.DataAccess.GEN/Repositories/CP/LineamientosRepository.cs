using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CP
{
    public class LineamientosRepository : IDisposable
    {
        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        GEN_Context _genContext;
        public LineamientosRepository()
        {
            _db = new CP_Context();
            _genContext = new GEN_Context();
            _adjuntoRepo = new AdjuntoRepository();
        }

        public async Task<int> CountLineamientosComunidades()
        {
            try
            {
                var entities = await _db.DbSetLineamientos
                    .AsNoTracking().CountAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetLineamientos
                    .Include(e => e.Adjunto)
                    .Include(e => e.TipoLineamiento)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                ComentariosLCPRepository comentarios = new ComentariosLCPRepository();
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        LineamientoId = obj.LineamientoId
                                                        ,
                        Nombre = obj.Nombre
                                                        ,
                        obj.FechaRegistro
                                                        ,
                        NombreAdjunto = obj.NombreAdjunto
                                                        ,
                        AdjuntoId = obj.AdjuntoId
                                                        ,
                        Adjunto = obj.Adjunto
                                                        ,
                        IdTipoLineamiento = obj.IdTipoLineamiento
                                                        ,
                        NombreTipoLineamiento = obj.TipoLineamiento.Nombre
                                                        ,
                        Comentarios = await comentarios.GetByLineamiento(obj.LineamientoId)

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
                var entities = await _db.DbSetLineamientos
                    .Include(e => e.Adjunto)
                    .Include(e => e.TipoLineamiento)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.LineamientoId == id);
                Object lista = new Object();
                ComentariosLCPRepository comentarios = new ComentariosLCPRepository();
                lista = new
                {
                    LineamientoId = entities.LineamientoId
                                                        ,
                    Nombre = entities.Nombre
                                                        ,
                    entities.FechaRegistro
                                                        ,
                    NombreAdjunto = entities.NombreAdjunto
                                                        ,
                    AdjuntoId = entities.AdjuntoId
                                                        ,
                    Adjunto = entities.Adjunto
                                                        ,
                    IdTipoLineamiento = entities.IdTipoLineamiento
                                                        ,
                    NombreTipoLineamiento = entities.TipoLineamiento.Nombre
                                                        ,
                    Comentarios = await comentarios.GetByLineamiento(entities.LineamientoId)
                };
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un lineamiento
        /// </summary>
        /// <param name="Lineamientos">objeto con los datos para crear</param>
        public async Task Create(Lineamientos model)
        {
            try
            {

                var registro = _db.DbSetLineamientos.Add(model);
                await _db.SaveChangesAsync();
                NuevoOCRepository ocrepo = new NuevoOCRepository();
                //Los parametros son: moduloid, id del oc (en este caso son strings), descripcion, liga del detalle del oc
                NuevoOC nuevoOC = new NuevoOC("CP", "LineamientosCP", registro.Nombre, "indexCP.html#/consultaLineamientos/");
                await ocrepo.Create(nuevoOC);
                

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un lineamiento y devuelve el objeto creado
        /// </summary>
        /// <returns>Lineamiento</returns>
        public async Task<Lineamientos> ReturnCreatedLineamiento(Lineamientos model)
        {
            try
            {

                _db.DbSetLineamientos.Add(model);
                await _db.SaveChangesAsync();
                NuevoOCRepository ocrepo = new NuevoOCRepository();
                //Los parametros son: moduloid, id del oc (en este caso son strings), descripcion, liga del detalle del oc
                NuevoOC nuevoOC = new NuevoOC("CP", "LineamientosCP", model.Nombre, "indexCP.html#/consultaLineamientos/");
                await ocrepo.Create(nuevoOC);
                return model;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Lineamientos model)
        {
            try
            {
                var _model = await _db.DbSetLineamientos.FirstOrDefaultAsync(e => e.LineamientoId == model.LineamientoId);
                if (_model != null)
                {

                    if (model.Adjunto != null)
                    {
                        if (_model.AdjuntoId != null)
                        {
                            var id = _model.AdjuntoId;
                            _model.AdjuntoId = null;
                            await _db.SaveChangesAsync();

                            await _adjuntoRepo.Delete(id);
                        }

                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.AdjuntoId = key.AdjuntoId;
                    }
                    else
                    {
                        model.AdjuntoId = null;
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
                var _model = await _db.DbSetLineamientos.FirstOrDefaultAsync(e => e.LineamientoId == id);
                if (_model != null)
                {
                    if (_model.AdjuntoId != null)
                    {
                        var idadjunto = _model.AdjuntoId;
                        _model.AdjuntoId = null;
                        await _db.SaveChangesAsync();
                        await new AdjuntoRepository().Delete(idadjunto);
                    }

                    var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        _genContext.dbSetNuevoOC.Remove(infoAgregada);    
                        await _genContext.SaveChangesAsync();
                    }
                    _db.DbSetLineamientos.Remove(_model);
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
