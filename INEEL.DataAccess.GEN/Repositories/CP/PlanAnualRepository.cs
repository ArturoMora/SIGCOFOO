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
    public class PlanAnualRepository : IDisposable
    {

        AdjuntoRepository _adjuntoRepo;
        private CP_Context _db;
        GEN_Context _genContext;
        NuevoOCRepository repo;
        public PlanAnualRepository()
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
                var entities = await _db.DbSetPlanAnual
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
                        planId = obj.PlanId
                                                       ,
                        nombrePlan = obj.Nombre
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
                var entities = await _db.DbSetPlanAnual
                    .Include(e => e.Comunidad)
                    .Include(e=>e.LineaDesarrolloTecnologico)
                    .AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{nombreComunidad = obj.Comunidad.Descripcion
                                                       ,misionComunidad = obj.Comunidad.Mision
                                                       ,fechaAltaComunidad=obj.Comunidad.FechaAlta
                                                       ,idCategoria=obj.Comunidad.idCategoria
                                                       ,idCP=obj.idCP
                                                       ,palabrasClave=obj.PalabrasClave
                                                       ,planId=obj.PlanId
                                                       ,nombrePlan=obj.Nombre
                                                       ,anio=obj.AnioCorrespondiente
                                                       ,obj.LineaDesarrolloTecnologico
                                                       ,fechaRegistro=obj.FechaRegistro
                                                       ,tipoAcceso = obj.TipoAcceso
                                                       ,estado=obj.Estado
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
                var entities = await _db.DbSetPlanAnual
                    .Include(e => e.Comunidad)
                    .Include(e => e.Adjunto)
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.PlanId == id);
                Object lista = new Object();
                lista = new{nombreComunidad = entities.Comunidad.Descripcion
                                                       ,misionComunidad = entities.Comunidad.Mision
                                                       ,fechaAltaComunidad=entities.Comunidad.FechaAlta
                                                       ,idCategoria=entities.Comunidad.idCategoria
                                                       ,adjunto=entities.Adjunto
                                                       ,adjuntoId=entities.AdjuntoId
                                                       ,idCP=entities.idCP
                                                       ,palabrasClave=entities.PalabrasClave
                                                       ,planId=entities.PlanId
                                                       ,nombrePlan=entities.Nombre
                                                       ,anios=entities.AnioCorrespondiente
                                                       ,entities.LineaDesarrolloTecnologico
                                                       ,fechaRegistro= entities.FechaRegistro
                                                       ,tipoAcceso = entities.TipoAcceso
                                                       ,estado= entities.Estado
                            };
                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<int> CountPlanAnual()
        {
            try
            {
                var entities = await _db.DbSetPlanAnual
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
                var entities = await _db.DbSetPlanAnual
                    .Include(e => e.Comunidad)
                    .Include(e=>e.LineaDesarrolloTecnologico)
                    .AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                AutoresCPRepository autor = new AutoresCPRepository();
                Autores a = new Autores();
                foreach (var obj in entities)
                {
                    a.ContenidoId = obj.PlanId;
                    a.idOC = 5;
                    lista[entities.IndexOf(obj)] = new{nombreComunidad = obj.Comunidad.Descripcion
                                                       ,misionComunidad = obj.Comunidad.Mision
                                                       ,fechaAltaComunidad=obj.Comunidad.FechaAlta
                                                       ,idCategoria=obj.Comunidad.idCategoria
                                                       ,idCP=obj.idCP
                                                       ,palabrasClave=obj.PalabrasClave
                                                       ,planId=obj.PlanId
                                                       ,obj.AdjuntoId
                                                       ,nombrePlan=obj.Nombre
                                                       ,anio=obj.AnioCorrespondiente
                                                       ,obj.LineaDesarrolloTecnologico
                                                       ,fechaRegistro=obj.FechaRegistro
                                                       ,tipoAcceso = obj.TipoAcceso
                                                       ,estado=obj.Estado
                                                       ,autores= await autor.GetByOC(a)
                    };
                }
         
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetAllConsultaPorOC(PlanAnual parametros)
        {
            try
            {
                var entities = (from pa in _db.DbSetPlanAnual select pa).Include(e=>e.Comunidad).Include(e=>e.LineaDesarrolloTecnologico);

                AutoresCPRepository autoresOC = new AutoresCPRepository();
                Autores a = new Autores();

                if (entities != null)
                {
                    
                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        entities = entities.Where(e => ( DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion) 
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
                        var listaArte = await GetPKPlanByCollateLatin1(parametros.Nombre);
                        entities = entities.Where(e => listaArte.Contains(e.PlanId));
                    }
                    if (!String.IsNullOrEmpty(parametros.PalabrasClave))  //busqueda por palabras clave
                    {
                        var listaPalabras = await GetPKPalabrasClaveByCollateLatin1(parametros.PalabrasClave);
                        entities = entities.Where(e => listaPalabras.Contains(e.PlanId));
                    }
                    if (!String.IsNullOrEmpty(parametros.nombrePersona))  //busqueda por autores del OC
                    {
                        List<int> listaIds = await autoresOC.GetPKAutoresByCollateLatin1(parametros.nombrePersona, 5); //el numero viene de la lista de oc de cp en la bd
                        entities = entities.Where(e => listaIds.Contains(e.PlanId));
                    }
                    if (parametros.idLineaInv != 0 && parametros.idLineaInv != null)  //busqueda por linea de investigacion
                    {
                        entities = entities.Where(e => e.idLineaInv == parametros.idLineaInv);
                    }

                    foreach (var estado in entities)
                    {

                        estado.personas = await autoresOC.GetByOC(estado.PlanId, 5);
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
        public async Task<List<int>> GetPKPlanByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PlanId FROM CP.tab_PlanAnual where Nombre collate Latin1_General_CI_AI LIKE ";
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
                var query = "SELECT PlanId FROM CP.tab_PlanAnual where PalabrasClave collate Latin1_General_CI_AI LIKE ";
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
                var entities = await _db.DbSetPlanAnual
                    .Where(e=>e.idCP==id)
                    .Include(e=>e.LineaDesarrolloTecnologico)
                    .AsNoTracking().ToListAsync();
                Object [] lista =new Object[entities.Count];
                foreach (var obj in entities)
                {
                    lista[entities.IndexOf(obj)] = new{idCP=obj.idCP
                                                       ,palabrasClave=obj.PalabrasClave
                                                       ,planId=obj.PlanId
                                                       ,nombrePlan=obj.Nombre
                                                       ,anio=obj.AnioCorrespondiente
                                                       ,obj.LineaDesarrolloTecnologico
                                                       ,fechaRegistro=obj.FechaRegistro
                                                       ,tipoAcceso = obj.TipoAcceso
                                                       ,estado=obj.Estado
                    };
                }
         
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(PlanAnual model)
        {
            try
            {
                if (model.claveAutores != null)
                {
                    var plan = _db.DbSetPlanAnual.Add(model);
                    await _db.SaveChangesAsync();

                    var estatusComunidad = await _db.DbSetComunidades.Where(e => e.ComunidadId == model.idCP).AsNoTracking().Select(x => x.Estado).FirstOrDefaultAsync();
                    if(model.Estado.Equals("Aprobado") && estatusComunidad){
                        //Los parametros son: moduloid, id del oc (en este caso son strings), descripcion, liga del detalle del oc
                        await repo.Create("CP", "PlanesAnuales", plan.Nombre, "indexCP.html#/detallesPlanAnual/" + plan.PlanId , Convert.ToString(plan.PlanId));
                    }


                    Autores autor = new Autores();
                    foreach (var clave in model.claveAutores)
                    {
                        autor.clave = clave;
                        autor.ContenidoId = plan.PlanId;
                        autor.idOC = 5;
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

        public async Task Update(PlanAnual model)
        {
            try
            {
                var _model = await _db.DbSetPlanAnual.FirstOrDefaultAsync(e => e.PlanId == model.PlanId);
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
                        var autoresRegistro = await _db.DbSetAutores.Where(e => e.idOC == 5 && e.ContenidoId == model.PlanId).AsNoTracking().ToListAsync();
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
                            autor.ContenidoId = model.PlanId;
                            autor.idOC = 5;
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

        public async Task cambiaEstadoPublicacion(PlanAnual model)
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
                        await repo.Create("CP", "PlanesAnuales", model.Nombre, "indexCP.html#/detallesPlanAnual/" + model.PlanId, Convert.ToString(model.PlanId));
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
                AutoresCPRepository autor= new AutoresCPRepository();
                var _model = await _db.DbSetPlanAnual.FirstOrDefaultAsync(e => e.PlanId == id);
                if (_model != null)
                {
                    var idadjunto=_model.AdjuntoId;
                    //Removemos los autores aociados a ese OC
                    await autor.DeleteAllAutoresByOC(5,_model.PlanId);

                    var infoAgregada = await _genContext.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.Nombre)).FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }

                    //Removemos el OC
                    _db.DbSetPlanAnual.Remove(_model);
                    await _db.SaveChangesAsync();

                    //Removemos el adjunto asociado
                    if(idadjunto!=null){
                        AdjuntoRepository adjuntoRepository= new AdjuntoRepository();
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
                var _model = await _db.DbSetPlanAnual.FirstOrDefaultAsync(e => e.PlanId == id);
                if (_model != null)
                {
                    _db.DbSetPlanAnual.Remove(_model);
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
