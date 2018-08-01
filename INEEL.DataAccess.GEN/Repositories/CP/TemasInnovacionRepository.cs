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
    public class TemasInnovacionRepository : IDisposable
    {

        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        GEN_Context _genContext;
        NuevoOCRepository repo;
        public TemasInnovacionRepository()
        {
            _db = new CP_Context();
            _genContext = new GEN_Context();
            _adjuntoRepo = new AdjuntoRepository();
            repo = new NuevoOCRepository();
        }


        public async Task<Object[]> GetAllByComunidad(int idCP)
        {
            try
            {
                var entities = await _db.DbSetTemasInnovacion
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
                        temaId = obj.TemaId
                                                       ,
                        nombreTema = obj.Nombre
                                                       ,
                        descripcionTema = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estado = obj.Estado
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
                var entities = await _db.DbSetTemasInnovacion
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
                        temaId = obj.TemaId
                                                       ,
                        nombreTema = obj.Nombre
                                                       ,
                        descripcionTema = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estado = obj.Estado
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
                var entities = await _db.DbSetTemasInnovacion
                    .Include(e => e.Comunidad)
                    .Include(e => e.Adjunto)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.TemaId == id);
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
                    adjunto = entities.Adjunto
                                                       ,
                    adjuntoId = entities.AdjuntoId
                                                       ,
                    idCP = entities.idCP
                                                       ,
                    personaAutoriza = entities.PersonaAutoriza
                                                       ,
                    palabrasClave = entities.PalabrasClave
                                                       ,
                    temaId = entities.TemaId
                                                       ,
                    nombreTema = entities.Nombre
                                                       ,
                    descripcionTema = entities.Descripcion
                                                       ,
                    tipoAcceso = entities.TipoAcceso
                                                       ,
                    fechaRegistro = entities.FechaRegistro
                                                       ,
                    estado = entities.Estado
                };
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> CountTemasInnovacion()
        {
            try
            {
                var entities = await _db.DbSetTemasInnovacion
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
                var entities = await _db.DbSetTemasInnovacion
                    .Include(e => e.Comunidad)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                AutoresCPRepository autor = new AutoresCPRepository();
                Autores a = new Autores();
                foreach (var obj in entities)
                {
                    a.ContenidoId = obj.TemaId;
                    a.idOC = 6;
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
                        obj.AdjuntoId
                                                       ,
                        personaAutoriza = obj.PersonaAutoriza
                                                       ,
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        temaId = obj.TemaId
                                                       ,
                        nombreTema = obj.Nombre
                                                       ,
                        descripcionTema = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estado = obj.Estado
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


        public async Task<Object> GetAllConsultaPorOC(TemasInnovacion parametros)
        {
            try
            {
                var entities = (from ti in _db.DbSetTemasInnovacion select ti).Include(e => e.Comunidad);
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
                        var listaArte = await GetPKTemasByCollateLatin1(parametros.Nombre);
                        entities = entities.Where(e => listaArte.Contains(e.TemaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.PalabrasClave))  //busqueda por palabras clave
                    {
                        var listaPalabras = await GetPKPalabrasClaveByCollateLatin1(parametros.PalabrasClave);
                        entities = entities.Where(e => listaPalabras.Contains(e.TemaId));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombrePersona))  //busqueda por autores del OC
                    {
                        List<int> listaIds = await autoresOC.GetPKAutoresByCollateLatin1(parametros.nombrePersona, 6);
                        entities = entities.Where(e => listaIds.Contains(e.TemaId));
                    }

                    foreach (var estado in entities)
                    {
                        estado.personas = await autoresOC.GetByOC(estado.TemaId, 6);
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
        /// Obtener todas las claves de los registros que coincidan con la colacion
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPKTemasByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TemaId FROM CP.tab_TemasInnovacion where Nombre collate Latin1_General_CI_AI LIKE ";
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
                var query = "SELECT TemaId FROM CP.tab_TemasInnovacion where PalabrasClave collate Latin1_General_CI_AI LIKE ";
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


        public async Task<Object[]> GetByComunidad(int id)
        {
            try
            {
                var entities = await _db.DbSetTemasInnovacion
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
                        temaId = obj.TemaId
                                                       ,
                        nombreTema = obj.Nombre
                                                       ,
                        descripcionTema = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estado = obj.Estado
                    };
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(TemasInnovacion model)
        {
            try
            {
                if (model.claveAutores != null)
                {
                    var tema = _db.DbSetTemasInnovacion.Add(model);
                    await _db.SaveChangesAsync();

                    //Creacion de la notificacion de nuevo OC
                    var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                    if (model.Estado.Equals("Aprobado") && estatusComunidad)
                    {
                        //Solo se pueden hacer operaciones si la comunidad esta activa
                        await repo.Create("CP", "TemasInnovacion", tema.Nombre, "indexCP.html#/detallesTemas/" + tema.TemaId, Convert.ToString(model.TemaId) );
                    }

                    Autores autor = new Autores();
                    foreach (var clave in model.claveAutores)
                    {
                        autor.clave = clave;
                        autor.ContenidoId = tema.TemaId;
                        autor.idOC = 6;
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



        public async Task Update(TemasInnovacion model)
        {
            try
            {
                var _model = await _db.DbSetTemasInnovacion.FirstOrDefaultAsync(e => e.TemaId == model.TemaId);
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
                        var autoresRegistro = await _db.DbSetAutores.Where(e => e.idOC == 6 && e.ContenidoId == model.TemaId).AsNoTracking().ToListAsync();
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
                            autor.ContenidoId = model.TemaId;
                            autor.idOC = 6;
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

        public async Task cambiaEstadoPublicacion(TemasInnovacion model)
        {
            try
            {
                var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(model.Nombre)).FirstOrDefaultAsync();
                var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                if (estatusComunidad)  //Solo se pueden hacer operaciones si la comunidad esta activa
                {
                    if (infoAgregada != null && !model.Estado.Equals("Aprobado"))
                    {
                        infoAgregada.nuevo = false;
                        await _genContext.SaveChangesAsync();
                    }
                    else if (infoAgregada != null && model.Estado.Equals("Aprobado"))
                    {
                        infoAgregada.nuevo = true;
                        await _genContext.SaveChangesAsync();

                    }
                    else
                    {
                        await repo.Create("CP", "TemasInnovacion", model.Nombre, "indexCP.html#/detallesTemas/" + model.TemaId, Convert.ToString(model.TemaId) );
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
                var _model = await _db.DbSetTemasInnovacion.FirstOrDefaultAsync(e => e.TemaId == id);
                if (_model != null)
                {
                    var idadjunto = _model.AdjuntoId;
                    //Removemos los autores aociados a ese OC
                    await autor.DeleteAllAutoresByOC(1, _model.TemaId);

                    var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    

                    //Removemos el OC
                    _db.DbSetTemasInnovacion.Remove(_model);
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
                var _model = await _db.DbSetTemasInnovacion.FirstOrDefaultAsync(e => e.TemaId == id);
                if (_model != null)
                {
                    _db.DbSetTemasInnovacion.Remove(_model);
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
