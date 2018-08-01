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
    public class EstadoArteRepository : IDisposable
    {

        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        GEN_Context _genContext;
        NuevoOCRepository repo;

        public EstadoArteRepository()
        {
            _db = new CP_Context();
            repo = new NuevoOCRepository();
            _genContext = new GEN_Context();
            _adjuntoRepo = new AdjuntoRepository();
        }


        public async Task<Object[]> GetAll()
        {
            try
            {
                var entities = await _db.DbSetEstadoArte
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
                        arteId = obj.EstadoArteId
                                                       ,
                        nombreArte = obj.Nombre
                                                       ,
                        descripcionArte = obj.Descripcion
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
                var entities = await _db.DbSetEstadoArte
                    .Include(e => e.Comunidad)
                    .Include(e => e.Adjunto)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.EstadoArteId == id);
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
                    adjuntoId = entities.adjuntoId
                                                       ,
                    idCP = entities.idCP
                                                       ,
                    personaAutoriza = entities.PersonaAutoriza
                                                       ,
                    palabrasClave = entities.PalabrasClave
                                                       ,
                    arteId = entities.EstadoArteId
                                                       ,
                    nombreArte = entities.Nombre
                                                       ,
                    descripcionArte = entities.Descripcion
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

        public async Task<int> CountEstadoArte()
        {
            try
            {
                var entities = await _db.DbSetEstadoArte
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
                var entities = await _db.DbSetEstadoArte
                    .Include(e => e.Comunidad)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                AutoresCPRepository autor = new AutoresCPRepository();
                Autores a = new Autores();
                foreach (var obj in entities)
                {
                    a.ContenidoId = obj.EstadoArteId;
                    a.idOC = 2;
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
                        arteId = obj.EstadoArteId
                                                       ,
                        nombreArte = obj.Nombre
                                                       ,
                        descripcionArte = obj.Descripcion
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        estado = obj.Estado
                                                       ,
                        obj.adjuntoId
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


        public async Task<Object> GetAllConsultaPorOC(EstadoArte parametros)
        {
            try
            {
                var estadoArte = (from ea in _db.DbSetEstadoArte select ea).Include(e => e.Comunidad);
                AutoresCPRepository autoresOC = new AutoresCPRepository();
                Autores a = new Autores();

                if (estadoArte != null)
                {

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        estadoArte = estadoArte.Where(e => (DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion) && DbFunctions.TruncateTime(e.FechaRegistro) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombreComunidad)) //busqueda por el nombre de la comunidad
                    {
                        var listaComunidades = await GetPKComunidadesByCollateLatin1(parametros.nombreComunidad);
                        estadoArte = estadoArte.Where(e => listaComunidades.Contains(e.idCP));
                    }
                    if (!String.IsNullOrEmpty(parametros.Nombre)) //busqueda por nombre del EA
                    {
                        var listaArte = await GetPKEstadoArteByCollateLatin1(parametros.Nombre);
                        estadoArte = estadoArte.Where(e => listaArte.Contains(e.EstadoArteId));
                    }
                    if (!String.IsNullOrEmpty(parametros.PalabrasClave))  //busqueda por palabras clave
                    {
                        var listaPalabras = await GetPKPalabrasClaveByCollateLatin1(parametros.PalabrasClave);
                        estadoArte = estadoArte.Where(e => listaPalabras.Contains(e.EstadoArteId));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombrePersona))  //busqueda por autores del OC
                    {

                        List<int> listaIds = await autoresOC.GetPKAutoresByCollateLatin1(parametros.nombrePersona, 2);
                        estadoArte = estadoArte.Where(e => listaIds.Contains(e.EstadoArteId));
                    }


                    foreach (var estado in estadoArte)
                    {

                        estado.personas = await autoresOC.GetByOC(estado.EstadoArteId, 2);
                    }


                }

                return estadoArte;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todas las claves de las comunidades que coincidan con la colacion
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPKComunidadesByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ComunidadId FROM CP.tab_Comunidades where Descripcion collate  Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE";
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
        /// Obtener todas las claves de los estados del arte que coincidan con la colacion
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetPKEstadoArteByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT EstadoArteId FROM CP.tab_EstadoArte where Nombre collate Latin1_General_CI_AI LIKE ";
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
                var query = "SELECT EstadoArteId FROM CP.tab_EstadoArte where PalabrasClave collate Latin1_General_CI_AI LIKE ";
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
                var entities = await _db.DbSetEstadoArte
                    .Where(e => e.idCP == id)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        arteId = obj.EstadoArteId
                                                       ,
                        nombreArte = obj.Nombre
                                                       ,
                        descripcionArte = obj.Descripcion
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

        public async Task Create(EstadoArte model)
        {
            try
            {
                if (model.claveAutores != null)
                {
                    var arte = _db.DbSetEstadoArte.Add(model);
                    await _db.SaveChangesAsync();

                    //Creacion de la notificacion de nuevo OC
                    var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                    if (model.Estado.Equals("Aprobado") && estatusComunidad)
                    {
                        await repo.Create("CP", "EstadoArte", arte.Nombre, "indexCP.html#/detallesEstadoArte/" + arte.EstadoArteId, Convert.ToString(arte.EstadoArteId));
                    }

                    Autores autor = new Autores();
                    foreach (var clave in model.claveAutores)
                    {
                        autor.clave = clave;
                        autor.ContenidoId = arte.EstadoArteId;
                        autor.idOC = 2;
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

        public async Task Update(EstadoArte model)
        {
            try
            {
                var _model = await _db.DbSetEstadoArte.FirstOrDefaultAsync(e => e.EstadoArteId == model.EstadoArteId);
                if (_model != null)
                {
                    //Cuando se elimina el adjunto en modo edicion
                    if (model.adjuntoId != null)
                    {
                        int id = Convert.ToInt32(model.adjuntoId);
                        model.adjuntoId = null;
                        _db.Entry(_model).CurrentValues.SetValues(model);
                        await _db.SaveChangesAsync();
                        await _adjuntoRepo.Delete(id);
                    }
                    //Cuando se agrega un nuevo archivo
                    if (model.Adjunto != null && model.adjuntoId == null)
                    {
                        Adjunto key = await _adjuntoRepo.CreateAd(model.Adjunto);
                        model.adjuntoId = key.AdjuntoId;
                        model.Adjunto.AdjuntoId = key.AdjuntoId;

                    }
                    //Actualizacion de autores al registro
                    if (model.claveAutores != null)
                    {
                        var autoresRegistro = await _db.DbSetAutores.Where(e => e.idOC == 2 && e.ContenidoId == model.EstadoArteId).AsNoTracking().ToListAsync();
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
                            autor.ContenidoId = model.EstadoArteId;
                            autor.idOC = 2;
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

        public async Task cambiaEstadoPublicacion(EstadoArte model)
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
                        await repo.Create("CP", "EstadoArte", model.Nombre, "indexCP.html#/detallesEstadoArte/" + model.EstadoArteId, Convert.ToString(model.EstadoArteId));
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
                var _model = await _db.DbSetEstadoArte.FirstOrDefaultAsync(e => e.EstadoArteId == id);
                if (_model != null)
                {
                    var idadjunto = _model.adjuntoId;
                    //Removemos los autores aociados a ese OC
                    await autor.DeleteAllAutoresByOC(2, _model.EstadoArteId);

                    var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }

                    //Removemos el OC
                    _db.DbSetEstadoArte.Remove(_model);
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
                var _model = await _db.DbSetEstadoArte.FirstOrDefaultAsync(e => e.EstadoArteId == id);
                if (_model != null)
                {
                    _db.DbSetEstadoArte.Remove(_model);
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
