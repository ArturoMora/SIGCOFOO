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
    public class InformeAnualRepository : IDisposable
    {
        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        GEN_Context _genContext;
        NuevoOCRepository repo;
        public InformeAnualRepository()
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
                var entities = await _db.DbSetInformeAnual
                    .Include(e => e.Comunidad)
                    .Include(e => e.LineaDesarrolloTecnologico)
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
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        informeId = obj.InformeId
                                                       ,
                        nombreInforme = obj.Nombre
                                                       ,
                        anio = obj.AnioCorrespondiente
                                                       ,
                        obj.LineaDesarrolloTecnologico
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        tipoAcceso = obj.TipoAcceso
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
                var entities = await _db.DbSetInformeAnual
                    .Include(e => e.Comunidad)
                    .Include(e => e.LineaDesarrolloTecnologico)
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
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        informeId = obj.InformeId
                                                       ,
                        nombreInforme = obj.Nombre
                                                       ,
                        anio = obj.AnioCorrespondiente
                                                       ,
                        obj.LineaDesarrolloTecnologico
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        tipoAcceso = obj.TipoAcceso
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
                var entities = await _db.DbSetInformeAnual
                    .Include(e => e.Comunidad)
                    .Include(e => e.Adjunto)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.InformeId == id);
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
                    palabrasClave = entities.PalabrasClave
                                                       ,
                    informeId = entities.InformeId
                                                       ,
                    nombreInforme = entities.Nombre
                                                       ,
                    anios = entities.AnioCorrespondiente
                                                       ,
                    entities.LineaDesarrolloTecnologico
                                                       ,
                    fechaRegistro = entities.FechaRegistro
                                                       ,
                    tipoAcceso = entities.TipoAcceso
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

        public async Task<int> CountInformesAnuales()
        {
            try
            {
                var entities = await _db.DbSetInformeAnual
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
                var entities = await _db.DbSetInformeAnual
                    .Include(e => e.Comunidad)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                AutoresCPRepository autor = new AutoresCPRepository();
                Autores a = new Autores();
                foreach (var obj in entities)
                {
                    a.ContenidoId = obj.InformeId;
                    a.idOC = 4;
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
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        informeId = obj.InformeId
                                                       ,
                        nombreInforme = obj.Nombre
                                                       ,
                        anio = obj.AnioCorrespondiente
                                                       ,
                        obj.LineaDesarrolloTecnologico
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        tipoAcceso = obj.TipoAcceso
                                                       ,
                        estado = obj.Estado
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

        public async Task<Object> GetAllConsultaPorOC(InformeAnual parametros)
        {
            try
            {
                var entities = (from ia in _db.DbSetInformeAnual select ia).Include(e => e.Comunidad).Include(e => e.LineaDesarrolloTecnologico);
                AutoresCPRepository autoresOC = new AutoresCPRepository();
                Autores a = new Autores();
                if (entities != null)
                {
                    //busqueda por periodo
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
                        var listaArte = await GetPKInformeByCollateLatin1(parametros.Nombre);
                        entities = entities.Where(e => listaArte.Contains(e.InformeId));
                    }
                    if (!String.IsNullOrEmpty(parametros.PalabrasClave))  //busqueda por palabras clave
                    {
                        var listaPalabras = await GetPKPalabrasClaveByCollateLatin1(parametros.PalabrasClave);
                        entities = entities.Where(e => listaPalabras.Contains(e.InformeId));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombrePersona))  //busqueda por autores del OC
                    {
                        List<int> listaIds = await autoresOC.GetPKAutoresByCollateLatin1(parametros.nombrePersona, 4);
                        entities = entities.Where(e => listaIds.Contains(e.InformeId));
                    }
                    if (parametros.idLineaInv != 0 && parametros.idLineaInv != null)  //busqueda por linea de investigacion
                    {
                        entities = entities.Where(e => e.idLineaInv == parametros.idLineaInv);
                    }

                    foreach (var estado in entities)
                    {

                        estado.personas = await autoresOC.GetByOC(estado.InformeId, 4);
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
        public async Task<List<int>> GetPKInformeByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeId FROM CP.tab_InformeAnual where Nombre collate Latin1_General_CI_AI LIKE ";
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
                var query = "SELECT InformeId FROM CP.tab_InformeAnual where PalabrasClave collate Latin1_General_CI_AI LIKE ";
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


        public async Task<Object[]> GetByConsulta(int id)
        {
            try
            {
                var entities = await _db.DbSetInformeAnual
                    .Where(e => e.idCP == id)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .AsNoTracking().ToListAsync();
                Object[] lista = new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new
                    {
                        idCP = obj.idCP
                                                       ,
                        palabrasClave = obj.PalabrasClave
                                                       ,
                        informeId = obj.InformeId
                                                       ,
                        nombreInforme = obj.Nombre
                                                       ,
                        anio = obj.AnioCorrespondiente
                                                       ,
                        obj.LineaDesarrolloTecnologico
                                                       ,
                        fechaRegistro = obj.FechaRegistro
                                                       ,
                        tipoAcceso = obj.TipoAcceso
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


        public async Task Create(InformeAnual model)
        {
            try
            {
                if (model.claveAutores != null)
                {
                    var informe = _db.DbSetInformeAnual.Add(model);
                    await _db.SaveChangesAsync();

                    //Creacion de la notificacion de nuevo OC
                    var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                    if (model.Estado.Equals("Aprobado") && estatusComunidad)
                    {
                        //Solo se pueden hacer operaciones si la comunidad esta activa
                        await repo.Create("CP", "InformesAnuales", informe.Nombre, "indexCP.html#/detallesinformeAnual/" + informe.InformeId, Convert.ToString(informe.InformeId));
                    }


                    Autores autor = new Autores();
                    foreach (var clave in model.claveAutores)
                    {
                        autor.clave = clave;
                        autor.ContenidoId = informe.InformeId;
                        autor.idOC = 4;
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

        public async Task Update(InformeAnual model)
        {
            try
            {
                var _model = await _db.DbSetInformeAnual.FirstOrDefaultAsync(e => e.InformeId == model.InformeId);
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
                        var autoresRegistro = await _db.DbSetAutores.Where(e => e.idOC == 4 && e.ContenidoId == model.InformeId).AsNoTracking().ToListAsync();
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
                            autor.ContenidoId = model.InformeId;
                            autor.idOC = 4;
                            autor.FechaRegistro = DateTime.Now;
                            _db.DbSetAutores.Add(autor);
                            await _db.SaveChangesAsync();
                        }

                    }


                    await cambiaEstadoPublicacion(model);

                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task cambiaEstadoPublicacion(InformeAnual model)
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
                        await repo.Create("CP", "InformesAnuales", model.Nombre, "indexCP.html#/detallesinformeAnual/" + model.InformeId, Convert.ToString(model.InformeId));
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
                var _model = await _db.DbSetInformeAnual.FirstOrDefaultAsync(e => e.InformeId == id);
                if (_model != null)
                {
                    var idadjunto = _model.AdjuntoId;
                    //Removemos los autores aociados a ese OC
                    await autor.DeleteAllAutoresByOC(4, _model.InformeId);

                    var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }
                    
                    //Removemos el OC
                    _db.DbSetInformeAnual.Remove(_model);
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
                var _model = await _db.DbSetInformeAnual.FirstOrDefaultAsync(e => e.InformeId == id);
                if (_model != null)
                {
                    _db.DbSetInformeAnual.Remove(_model);
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
