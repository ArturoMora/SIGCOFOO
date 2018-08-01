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
    public class MapasRutaRepository : IDisposable
    {

        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        GEN_Context _genContext;
        NuevoOCRepository repo;
        public MapasRutaRepository()
        {
            _db = new CP_Context();
            repo = new NuevoOCRepository();
            _genContext = new GEN_Context();
            _adjuntoRepo = new AdjuntoRepository();
        }


        public async Task<Object[]> GetAllByComunidad(int idCP)
        {
            try
            {
                var entities = await _db.DbSetMapasRutas
                    .Include(e => e.Comunidad)
                    .Where(x => x.idCP == idCP)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        nombreComunidad = obj.Comunidad.Descripcion
                                                       ,
                        misionComunidad = obj.Comunidad.Mision
                                                       ,
                        fechaAltaComunidad = obj.Comunidad.FechaAlta
                                                       ,
                        idCategoria = obj.Comunidad.idCategoria
                                                       ,
                        idCP = obj.idCP
                                                       ,
                        personaAutoriza = obj.PersonaAutoriza
                                                       ,
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        mapaId = obj.MapaId
                                                       ,
                        nombreMapa = obj.Nombre
                                                       ,
                        descripcionMapa = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estatus = obj.Estatus
                    };
                }

                return lista;

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
                var entities = await _db.DbSetMapasRutas
                    .Include(e => e.Comunidad)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        nombreComunidad = obj.Comunidad.Descripcion
                                                       ,
                        misionComunidad = obj.Comunidad.Mision
                                                       ,
                        fechaAltaComunidad = obj.Comunidad.FechaAlta
                                                       ,
                        idCategoria = obj.Comunidad.idCategoria
                                                       ,
                        idCP = obj.idCP
                                                       ,
                        personaAutoriza = obj.PersonaAutoriza
                                                       ,
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        mapaId = obj.MapaId
                                                       ,
                        nombreMapa = obj.Nombre
                                                       ,
                        descripcionMapa = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estatus = obj.Estatus
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> CountMapasRuta()
        {
            try
            {
                var entities = await _db.DbSetMapasRutas
                    .AsNoTracking().CountAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Object[]> GetAllConsulta()
        {
            try
            {
                var entities = await _db.DbSetMapasRutas
                    .Include(e => e.Comunidad)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                AutoresCPRepository autor = new AutoresCPRepository();
                Autores a = new Autores();
                foreach (var obj in entities)
                {
                    a.ContenidoId = obj.MapaId;
                    a.idOC = 1;
                    lista[entities.IndexOf(obj)] = new
                    {
                        nombreComunidad = obj.Comunidad.Descripcion
                                                       ,
                        misionComunidad = obj.Comunidad.Mision
                                                       ,
                        fechaAltaComunidad = obj.Comunidad.FechaAlta
                                                       ,
                        idCategoria = obj.Comunidad.idCategoria
                                                       ,
                        idCP = obj.idCP
                                                       ,
                        personaAutoriza = obj.PersonaAutoriza
                                                       ,
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        mapaId = obj.MapaId
                                                       ,
                        nombreMapa = obj.Nombre
                                                       ,
                        descripcionMapa = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estatus = obj.Estatus
                                                       ,
                        obj.AdjuntoId
                                                       ,
                        autores = await autor.GetByOC(a)
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetAllConsultaPorOC(MapasRuta parametros)
        {
            try
            {

                var entities = (from mp in _db.DbSetMapasRutas select mp).Include(e => e.Comunidad);

                AutoresCPRepository autoresOC = new AutoresCPRepository();
                Autores a = new Autores();
                if (entities != null)
                {

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        entities = entities.Where(e => (DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion)
                                                        && DbFunctions.TruncateTime(e.FechaRegistro) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombreComunidad)) //busqueda por el nombre de la comunidad
                    {
                        ComunidadesRepository comunidad = new ComunidadesRepository();
                        var listaComunidades = await comunidad.GetPKComunidadesByCollateLatin1(parametros.nombreComunidad);
                        entities = entities.Where(e => listaComunidades.Contains(e.idCP));
                    }
                    if (!String.IsNullOrEmpty(parametros.Nombre)) //busqueda por nombre del EA
                    {
                        var listaArte = await GetPKMapaByCollateLatin1(parametros.Nombre);
                        entities = entities.Where(e => listaArte.Contains(e.MapaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.PalabrasClave))  //busqueda por palabras clave
                    {
                        var listaPalabras = await GetPKPalabrasClaveByCollateLatin1(parametros.PalabrasClave);
                        entities = entities.Where(e => listaPalabras.Contains(e.MapaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombrePersona))  //busqueda por autores del OC
                    {

                        List<int> listaIds = await autoresOC.GetPKAutoresByCollateLatin1(parametros.nombrePersona, 1);
                        entities = entities.Where(e => listaIds.Contains(e.MapaId));
                    }

                    foreach (var ent in entities)
                    {

                        ent.personas = await autoresOC.GetByOC(ent.MapaId, 1);
                    }
                }

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los estados del arte que coincidan con la colacion
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPKMapaByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT MapaId FROM CP.tab_MapasRuta where Nombre collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Nombre collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de las palabras claves de los registros que coincidan con la colacion buscada
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPKPalabrasClaveByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT MapaId FROM CP.tab_MapasRuta where PalabrasClave collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and PalabrasClave collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
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
                var entities = await _db.DbSetMapasRutas
                    .Include(e => e.Comunidad)
                    .Include(e => e.Adjunto)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.MapaId == id);
                Object lista = new Object();
                lista = new
                {
                    nombreComunidad = entities.Comunidad.Descripcion
                                                       ,
                    misionComunidad = entities.Comunidad.Mision
                                                       ,
                    fechaAltaComunidad = entities.Comunidad.FechaAlta
                                                       ,
                    idCategoria = entities.Comunidad.idCategoria
                                                       ,
                    idCP = entities.idCP
                                                       ,
                    adjunto = entities.Adjunto
                                                       ,
                    adjuntoId = entities.AdjuntoId
                                                       ,
                    personaAutoriza = entities.PersonaAutoriza
                                                       ,
                    palabrasClave = entities.PalabrasClave
                                                       ,
                    mapaId = entities.MapaId
                                                       ,
                    nombreMapa = entities.Nombre
                                                       ,
                    descripcionMapa = entities.Descripcion
                                                       ,
                    tipoAcceso = entities.TipoAcceso
                                                       ,
                    fechaRegistro = entities.FechaRegistro
                                                       ,
                    estatus = entities.Estatus
                };
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
                var entities = await _db.DbSetMapasRutas
                    .Where(e => e.idCP == id)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        idCP = obj.idCP
                                                       ,
                        personaAutoriza = obj.PersonaAutoriza
                                                       ,
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        mapaId = obj.MapaId
                                                       ,
                        nombreMapa = obj.Nombre
                                                       ,
                        descripcionMapa = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estatus = obj.Estatus
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(MapasRuta model)
        {
            try
            {
                if (model.claveAutores != null)
                {
                    var mapa = _db.DbSetMapasRutas.Add(model);
                    await _db.SaveChangesAsync();

                    var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                    if (model.Estatus.Equals("Aprobado") && estatusComunidad)
                    {
                        //Solo se pueden hacer operaciones si la comunidad esta activa
                        await repo.Create("CP", "MapasRuta", model.Nombre, "indexCP.html#/detallesMapaRuta/" + mapa.MapaId, Convert.ToString(mapa.MapaId));
                    }

                    Autores autor = new Autores();
                    foreach (var clave in model.claveAutores)
                    {
                        autor.clave = clave;
                        autor.ContenidoId = mapa.MapaId;
                        autor.idOC = 1;
                        autor.FechaRegistro = DateTime.Now;
                        _db.DbSetAutores.Add(autor);
                        await _db.SaveChangesAsync();
                    }


                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(MapasRuta model)
        {
            try
            {
                var _model = await _db.DbSetMapasRutas.FirstOrDefaultAsync(e => e.MapaId == model.MapaId);
                if (_model != null)
                {
                    //Cuando se elimina el adjunto en modo edicion
                    if (model.AdjuntoId != null)
                    {
                        int id = Convert.ToInt32(model.AdjuntoId);
                        model.AdjuntoId = null;
                        _db.Entry(_model).CurrentValues.SetValues(model);
                        await _db.SaveChangesAsync();
                        await _adjuntoRepo.Delete(id);
                    }
                    //Cuando se agrega un nuevo archivo
                    if (model.Adjunto != null && model.AdjuntoId == null)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.AdjuntoId = key.AdjuntoId;
                        model.Adjunto.AdjuntoId = key.AdjuntoId;

                    }
                    if (model.claveAutores != null)
                    {
                        var autoresRegistro = await _db.DbSetAutores.Where(e => e.idOC == 1 && e.ContenidoId == model.MapaId).AsNoTracking().ToListAsync();
                        //Eliminacion de autores
                        AutoresCPRepository autoresRepo = new AutoresCPRepository();
                        foreach (var c in autoresRegistro)
                        {
                            await autoresRepo.Delete(c.AutorId);
                        }

                        Autores autor = new Autores();
                        foreach (var clave in model.claveAutores)
                        {
                            autor.clave = clave;
                            autor.ContenidoId = model.MapaId;
                            autor.idOC = 1;
                            autor.FechaRegistro = DateTime.Now;
                            _db.DbSetAutores.Add(autor);
                            await _db.SaveChangesAsync();
                        }

                    }

                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();

                    await cambiaEstadoPublicacion(_model);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task cambiaEstadoPublicacion(MapasRuta model)
        {
            try
            {
                var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(model.Nombre)).FirstOrDefaultAsync();
                var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                if (estatusComunidad)  //Solo se pueden hacer operaciones si la comunidad esta activa
                {
                    if (infoAgregada != null && !model.Estatus.Equals("Aprobado"))
                    {
                        infoAgregada.nuevo = false;
                        await _genContext.SaveChangesAsync();
                    }
                    else if (infoAgregada != null && model.Estatus.Equals("Aprobado"))
                    {
                        infoAgregada.nuevo = true;
                        await _genContext.SaveChangesAsync();

                    }
                    else
                    {
                        await repo.Create("CP", "MapasRuta", model.Nombre, "indexCP.html#/detallesMapaRuta/" + model.MapaId, Convert.ToString(model.MapaId));
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task DeleteOCWithAutores(int id)
        {
            try
            {
                AutoresCPRepository autor = new AutoresCPRepository();
                var _model = await _db.DbSetMapasRutas.FirstOrDefaultAsync(e => e.MapaId == id);
                if (_model != null)
                {
                    var idadjunto = _model.AdjuntoId;
                    //Removemos los autores aociados a ese OC
                    await autor.DeleteAllAutoresByOC(1, _model.MapaId);

                    var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }

                    //Removemos el OC
                    _db.DbSetMapasRutas.Remove(_model);
                    await _db.SaveChangesAsync();

                    //Removemos el adjunto asociado
                    if (idadjunto != null)
                    {
                        AdjuntoRepository adjuntoRepository = new AdjuntoRepository();
                        await adjuntoRepository.Delete(idadjunto);
                    }


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
                var _model = await _db.DbSetMapasRutas.FirstOrDefaultAsync(e => e.MapaId == id);
                if (_model != null)
                {
                    _db.DbSetMapasRutas.Remove(_model);
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
