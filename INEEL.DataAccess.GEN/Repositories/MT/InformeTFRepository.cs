using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories;

using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.MT.Models.ITF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.MT.ITF;
using System.Globalization;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class InformeTFRepository : IDisposable
    {
        //----------- AYUDA:
        // InformeTFRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // InformeTecnicoFinal.- es el modelo
        // dbSetInformeTFs.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetInformeTFs =Categories                                  )
        // InformeTecnicoFinalId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        private GEN_Context _dbGen;
        public InformeTFRepository()
        {
            _dbGen = new GEN_Context();
            _db = new MT_Context();
            _db.Database.Log = Escribe.Write;
        }
        //Obtener "todos"  con ServerSide by ACH
        public async Task setUnidad(InformeTecnicoFinal itf)
        {
            var proyecto = (from t in _dbGen.dbSetProyectoGEN
                              .Where(x => x.ProyectoId == itf.ProyectoId)
                            select t).FirstOrDefault();
            if (proyecto != null)
            {
                itf.ClaveUnidadOrganizacional = proyecto.UnidadOrganizacionalId;
                var unidadObj = await _dbGen.dbSetUnidadOrganizacional.Where(x => x.ClaveUnidad == proyecto.UnidadOrganizacionalId).FirstOrDefaultAsync();
                if (unidadObj != null)
                {
                    itf.ClaveUnidadPadre = unidadObj.padre;
                }
            }

        }
        public async Task<IEnumerable<InformeTecnicoFinal>> getData(DataServerSide ss)
        {
            try
            {
                int estadoFlujo = -1;
                try
                {
                    estadoFlujo = Int32.Parse(ss.EstadoFlujoId);
                }
                catch (Exception e) { }


                var v = (from a in
                             _db.dbSetInformeTFs.Include(e => e.Proyecto)
                             .Include(f => f.ITFgeneral.AdjuntoITF)
                             .Include(f => f.EstadoITFFlujo)
                             .Include(f => f.ProyFuturo)
                             .Include(f => f.AutoresITF)
                             .Where(f => f.EstadoITFFlujoId == estadoFlujo)
                         select a);


                ss.recordsTotal = v.Count();
               
                if (!String.IsNullOrEmpty(ss.proyectoId))
                {
                    v = v.Where(x => x.ProyectoId == ss.proyectoId);                
                }

                if (!string.IsNullOrEmpty(ss.NumjefeProyecto))
                {
                    v = v.Where(e => e.Proyecto.NumjefeProyecto == ss.NumjefeProyecto);                 
                }
                
                if (!String.IsNullOrEmpty(ss.Titulo)) //busqueda por titulo
                {
                    var listaDA = await GetDALikeTituloITF(ss.Titulo, " LIKE ");
                   

                    v = v.Where(e => listaDA.Contains(e.InformeTecnicoFinalId));
                }


                if (!String.IsNullOrEmpty(ss.resumen)) //busqueda por titulo
                {
                  
                    var resumen = await GetDALikeResumenITFAND(ss.resumen, "LIKE");

                    v = v.Where(e => resumen.Contains(e.ITFgeneralId));
                }

                if (!string.IsNullOrEmpty(ss.Anno))
                {
                    v = v.Where(e => e.AnioElaboracion.ToString().Trim().Equals(ss.Anno.Trim()));
                }

                if (!string.IsNullOrEmpty(ss.Autor))
                {
                    var autores = await this.getAllByInformeTecnicoFinalIdsByIdAutor(ss.Autor);
                    v = v.Where(e => autores.Contains(e.InformeTecnicoFinalId));
                }

                if (!string.IsNullOrEmpty(ss.ClaveUnidad))
                {
                    UORepository uo = new UORepository(_dbGen);
                    var uni = await uo.GetByIdWithChildren(ss.ClaveUnidad);
                    HashSet<String> clavesUnidad = null;
                    if (uni.tipoO < 3)
                    {
                        var unidades = uni.Children.Select(x => x.ClaveUnidad).ToList();
                        clavesUnidad = new HashSet<String>(unidades);
                        var x2 = await uo.GetAllCollectionMAX(clavesUnidad);
                    }
                    else
                    {
                        clavesUnidad = new HashSet<String>();
                        clavesUnidad.Add(ss.ClaveUnidad);
                    }

                    v = v.Where(e => clavesUnidad.Contains(e.Proyecto.UnidadOrganizacionalId));
                }
                                
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    var titulo = await GetDALikeTituloITF(ss.searchValue, "LIKE");
                    var resumen = await GetDALikeResumenITFAND(ss.searchValue, "LIKE");
                    var proyecto = await GetProyectos(ss.searchValue);  
                                    
                    v = v.Where(e => titulo.Contains(e.InformeTecnicoFinalId) || resumen.Contains(e.ITFgeneralId) || proyecto.Contains(e.ProyectoId));
                }
                
                if (!String.IsNullOrEmpty(ss.porContenido))
                {

                    var adjuntos = await GetDALikeVocabularioAdjunto(ss.porContenido);
                    var ITFgeneralId = (from a in _db.dbSetAdjuntosITF.Where(x => adjuntos.Contains(x.AdjuntoId)) select a.ITFgeneralId);
                    
                    v = v.Where(e => ITFgeneralId.Contains(e.ITFgeneralId));                   
                }
                               
                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                return entities.OrderByDescending(e => e.FechaPublicacion);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        } //FIN GET DATA








      

        public async Task<List<string>> GetDALikeTituloITF(string likeNombre, string como)
        {
            try
            {
            var palabras = likeNombre.Split(' ');
            var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal where Titulo collate  Latin1_General_CI_AI " + como + " ";

            foreach (var palabra in palabras)
            {
                query = query + " '%" + palabra + "%' and Titulo collate Latin1_General_CI_AI " + como + " ";
            } 

            var resultados = await _db.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
            return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<List<string>> GetDALikeResumenITF(string likeNombre, string como)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ITFgeneralId FROM  MT.InformeTFgeneral WHERE  Resumen collate  Latin1_General_CI_AI " + como  + " ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' or Resumen collate Latin1_General_CI_AI " + como + " ";
                }

                var resultados = await _db.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<string>> GetDALikeResumenITFAND(string likeNombre, string como)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ITFgeneralId FROM  MT.InformeTFgeneral WHERE  Resumen collate  Latin1_General_CI_AI " + como + " ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' AND Resumen collate Latin1_General_CI_AI " + como + " ";
                }

                var resultados = await _db.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<string>> GetDALikeNoInventarioTF(string likeNombre, string como)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal where NumInventario collate  Latin1_General_CI_AI " + como + " ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' or NumInventario collate Latin1_General_CI_AI " + como + " ";
                }

                var resultados = await _db.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<List<string>> GetDALikeNoInformeITF(string likeNombre, string como)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal where NumInforme collate  Latin1_General_CI_AI " + como + " ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' or NumInforme collate Latin1_General_CI_AI " + como + " ";
                }

                var resultados = await _db.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<List<string>> GetDALikeClasificacionITF(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal where ClasificacionSignatura collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and ClasificacionSignatura collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<List<int>> GetDALikeSatisfaccionITF(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal AS ITF, MT.ITFSatisfaccionCliente AS ITFSC  WHERE ITF.SatisCteId == ITFSC.SatisCteId AND Justificacion collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Justificacion collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetDALikeResultadoITF(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal AS ITF, MT.ITFResultados AS ITFR  WHERE ITF.ITFResultados == ITFR.ITFResultados AND Descripcion collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<List<int>> GetDALikeFuturoITF(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal AS ITF, ITFProyFuturo AS ITFF  WHERE ITF.ITFResultados == ITFF.ProyFuturoId AND Descripcion collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<long?>> GetDALikeVocabularioAdjunto(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT distinct AdjuntoId FROM GEN.VocabularioDocumento WHERE VocabularioId  collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and VocabularioId collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<long?>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<List<string>> GetProyectos(String likeNombre)
        {
            try
            {
                string query = " SELECT ProyectoId FROM  GEN.Proyectos   WHERE Nombre collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%' or NombreJefeProyecto collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%' OR ProyectoId collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%' OR NumjefeProyecto collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%'";
                var resultados = await _db.Database.SqlQuery<string>
                (query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<int> countITFbyStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _db.dbSetInformeTFs
                               .Where(f => f.EstadoITFFlujoId == estadoFlujo)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SolicitudAccesoITF> GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante(String InformeTecnicoFinalId, String ClaveSolicitante)
        {
            return await new SolicitudAccesoITFRepository(_db).GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante(InformeTecnicoFinalId, ClaveSolicitante);
        }
        public async Task<SolicitudAccesoITF> GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_stadoFlujo(String InformeTecnicoFinalId, String ClaveSolicitante, int estadoFlujo)
        {
            return await new SolicitudAccesoITFRepository(_db).GetSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_stadoFlujo(InformeTecnicoFinalId, ClaveSolicitante, estadoFlujo);
        }
        public async Task<SolicitudAccesoITF> GetSolicitudAccesoITFByInformeTecnicoFinalId(String InformeTecnicoFinalId)
        {
            return await new SolicitudAccesoITFRepository(_db).GetSolicitudAccesoITFByInformeTecnicoFinalId(InformeTecnicoFinalId);
        }
        public async Task UpdateSolicitudAccesoITFByInformeTecnicoFinalId(SolicitudAccesoITF model)
        {
            await new SolicitudAccesoITFRepository(_db).Update(model);
        }

        public async Task CreateSolicitudAccesoITF(SolicitudAccesoITF model)
        {
            await new SolicitudAccesoITFRepository(_db).CreateSolicitudAccesoITF(model);
        }
        public async Task<IEnumerable<InformeTecnicoFinal>> GetITfsByNumJefe(string numJefe)
        {
            try
            {
                var proyectos = await _db.dbSetInformeTFs
                    .Include(e => e.Proyecto)
                    .Include(e => e.ITFgeneral)
                    .Where(x => x.Proyecto.NumjefeProyecto == numJefe).Select(x => x).AsNoTracking().ToListAsync();
                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Personas>> getJefeAndResponsableUnidad_ByPRoyecto(Proyecto proyecto)
        {
            //id del ITF
            try
            {
                var unidad = await new UORepository().GetById(proyecto.UnidadOrganizacionalId);
                String claveResponsable = unidad.ClaveResponsable;
                Personas responsableUnidad = await new PersonasRepositorySupport(_dbGen).GetByClave(claveResponsable);
                Personas jefeProy = await new PersonasRepositorySupport(_dbGen).GetByClave(proyecto.NumjefeProyecto);
                List<Personas> pers = new List<Personas>();
                pers.Add(responsableUnidad);
                pers.Add(jefeProy);
                return pers;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Personas> getPersonaResponsableByProyecto(Proyecto proyecto)
        {
            //id del ITF
            try
            {
                var unidad = await new UORepository().GetById(proyecto.UnidadOrganizacionalId);
                String claveResponsable = unidad.ClaveResponsable;
                Personas empleado = await new PersonasRepository().GetByClave(claveResponsable);
                return empleado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<String> getClavePersonaResponsableByClaveUnidad(String ClaveUnidad)
        {
            //id del ITF
            try
            {
                var unidad = await new UORepository().GetById(ClaveUnidad);
                return unidad.ClaveResponsable;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<long> CountITFrevisionByResponsable(String id)
        {
            try
            {
                //colocar la logica para 
                //var entities = await _db.dbSetInformeTFs.AsNoTracking().ToListAsync();
                var count = (from e in _db.dbSetInformeTFs
                             where e.EstadoITFFlujoId == 4
                             select e.InformeTecnicoFinalId);
                var result = await count.LongCountAsync();
                return result;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<String>> getInformeTecnicoFinalIdAll()
        {
            try
            {
                //colocar la logica para 
                //var entities = await _db.dbSetInformeTFs.AsNoTracking().ToListAsync();
                var r = (from e in _db.dbSetInformeTFs
                         select e.InformeTecnicoFinalId);
                var result = await r.ToListAsync();
                return result;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<InformeTecnicoFinal>> getAllByClaveEmpleado(string claveEmpleado)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .Include(x => x.EstadoITFFlujo)
                    .Include(x => x.ITFgeneral)
                    .Include(x => x.Proyecto)
                    .Where(x => x.Proyecto.NumjefeProyecto == claveEmpleado && x.Eliminado != true)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<InformeTecnicoFinal>> getAllBySinFKs()
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<InformeTecnicoFinal>> getAllByProyecto(string proyectoId)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .Where(x => x.ProyectoId == proyectoId)
                    .Include(x => x.EstadoITFFlujo)
                    .Include(x => x.ITFgeneral)
                    .Where(x => x.Eliminado != true)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<int> CountNumeroProyectoConITF(string proyectoId)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .Where(x => x.ProyectoId == proyectoId)
                    .ToListAsync();
                if (entities == null)
                {
                    return 0;
                }
                return entities.Count();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<InformeTecnicoFinal>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public InformeTecnicoFinal Get_(string id)
        {
            try
            {
                var entities = _db.dbSetInformeTFs
                    // .Include(x=> x.FK)
                    .FirstOrDefault(e => e.InformeTecnicoFinalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SolicitudRevisionITF> GetRevisionITFByIDITF(string id)
        {
            try
            {
                var entities = await _db.dbSetSolicitudRevisionITF.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudRevisionITF> GetSolicitudRevisionITF(string idITF, int EstadoSolicitudId)
        {
            try
            {
                //var entities = await _db.dbSetSolicitudRevisionITF.AsNoTracking()                    
                //    .Where(e => e.InformeTecnicoFinalId == idITF && e.EstadoSolicitudId == EstadoSolicitudId)
                //    .OrderByDescending(e => e.FechaSolicitud)                    
                //    .FirstOrDefaultAsync();
                var entities = await _db.dbSetSolicitudRevisionITF
                   .Where(e => e.InformeTecnicoFinalId == idITF)
                   .OrderByDescending(e => e.FechaSolicitud)
                   .AsNoTracking()
                   .FirstOrDefaultAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<InformeTecnicoFinal> Get(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Actualiza el EstadoITFFlujoId del ITF </summary>
        public async Task<Boolean> updateClasificacionSignatura(String idITF, String clasificacion, string numInforme, string numInventario)
        {
            try
            {

                // InformeTecnicoFinal old = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == idITF);
                InformeTecnicoFinal model = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == idITF);
                if (model != null)
                {
                    model.ClasificacionSignatura = clasificacion;
                    model.NumInforme = numInforme;
                    model.NumInventario = numInventario; //TODO: pendiente

                    //_db.Entry(old).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }


                return true;
            }
            catch (Exception e)
            {
                //throw new Exception(e.Message, e);
                return false;
            }
        }
        /// <summary>
        /// adicional a estadoFlujo, Actualiza fecha autorizacion o publicacion </summary>
        public async Task<Boolean> updateEstadoFlujo(String idITF, int idEstadoFlujo)
        {
            try
            {
                InformeTecnicoFinal model = await _db.dbSetInformeTFs
              .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == idITF);

                model.EstadoITFFlujoId = idEstadoFlujo;
                if (model != null)
                {
                    if (idEstadoFlujo.Equals(EstadoITFFlujoIds.Publicado))
                    {
                        model.FechaPublicacion = DateTime.Now;
                    }
                    if (idEstadoFlujo.Equals(EstadoITFFlujoIds.Autorizado))
                    {
                        model.FechaAutorizacion = DateTime.Now;
                    }
                    //_db.Entry(old).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

                if (idEstadoFlujo == EstadoITFFlujoIds.Publicado)
                {
                    try
                    {
                        InformeTecnicoFinal itf = await this.GetIncludeProject(idITF);
                        await new NuevoOCRepository(_dbGen).Create(
                            new NuevoOC("MT",
                                       "ITF",
                            itf.Proyecto.Nombre,
                            "indexMT.html#/ITFdetalles/" + itf.InformeTecnicoFinalId + "/false/99/infoGral"
                            ));
                    }
                    catch (Exception eIn)
                    {
                        Escribe.Write("Error------------------------------------------------:");
                        Escribe.Write(eIn);
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SolicitudRevisionITF>> SolicitudRevisionITF_ByAdminMT(String usuarioId)
        {
            try
            {
                //posiblemente pendiente validar si el usuarioId cuenta con un rol de Admin MT    
                var solicitudes = await _db.dbSetSolicitudRevisionITF
                    .Include(x => x.InformeTecnicoFinal.Proyecto)
                    .AsNoTracking()
                    .Where(e => (e.InformeTecnicoFinal.EstadoITFFlujoId == 2 && e.EstadoSolicitudId == EstadoSolicitudIds.Pendiente))
                  .ToListAsync();
                return solicitudes;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<InformeTecnicoFinal>> SolicitudRevisionITF_GetByResponsableUO(String ClaveResponsableUO)
        {
            try
            {
                var entities = await _dbGen.dbSetUnidadOrganizacional.AsNoTracking()
                   .Where(e => e.ClaveResponsable == ClaveResponsableUO)
                   .OrderByDescending(e => e.FechaEfectiva)
                   .FirstOrDefaultAsync();
                if (entities == null)
                {
                    throw new Exception("actualmente no es responsable de alguna Unidad Organizacional");
                }
                var claveUnidad = entities.ClaveUnidad;
                var solicitudes = await _db.dbSetInformeTFs
                    .Include(x => x.Proyecto)
                    .AsNoTracking()
                    .Where(e => e.Proyecto.UnidadOrganizacionalId.Equals(claveUnidad) && e.EstadoITFFlujoId == 1)
                  .ToListAsync();
                return solicitudes;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<Personas>> getAllAutoresByInformeTecnicoFinalId(string id)
        {
            try
            {
                var entities = await _db.dbSetAutorITF.AsNoTracking().
                    Where(x => x.InformeTecnicoFinalId == id)
                    .Select(x => x.ClaveAutor)
                    .ToListAsync();
                var autores = await _dbGen.dbSetPersonas.AsNoTracking()
                    .Where(x => entities.Contains(x.ClavePersona))
                    .ToListAsync();

                autores = autores.Distinct(new ComparerPersonasId()).ToList();
                return autores;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<String>> getAllByInformeTecnicoFinalIdsByIdAutor(string idAutor)
        {
            try
            {
                var entities = await _db.dbSetAutorITF.AsNoTracking().
                    Where(x => x.ClaveAutor == idAutor)
                    .Select(x => x.InformeTecnicoFinalId)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<InformeTecnicoFinal> GetIncludeProject(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .Include(x => x.Proyecto)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<InformeTecnicoFinal> GetByID_Collections(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                     .Include(x => x.listaInsumos)
                     .Include(x => x.Proyecto)
                     // .Include("Evaluaciones.PersonalProyecto.persona")
                     .Include("Evaluaciones.PersonalProyecto")
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                if (entities != null)
                {
                    var evaluaciones = entities.Evaluaciones.FirstOrDefault();
                    if (evaluaciones != null)
                    {
                        String clavePersona = evaluaciones.PersonalProyecto.ClavePersona;
                        var persona = await new PersonasRepository().GetByClaveWithoutStatus(clavePersona);
                        evaluaciones.PersonalProyecto.persona = persona;
                        var list = new List<Evaluaciones>();
                        list.Add(evaluaciones);
                        entities.Evaluaciones = list;
                    }
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<InformeTecnicoFinal> GetFKs(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs

                    .Include("ITFgeneral.AdjuntoITF.Adjunto")
                    .Include(e => e.ITFgeneral.TipoAcceso)
                    .Include(e => e.SatisCte.CalificacionCliente)
                    .Include("SatisCte.Adjunto") //PersonalProyecto
                    .Include(e => e.Proyecto)
                    .Include(e => e.Resultados)
                    .Include(e => e.ProyFuturo)

                    .Include(e => e.LAcap)
                    .Include(e => e.LActe)
                    .Include(e => e.LAproy)
                    .Include(e => e.EstadoITFFlujo)

                    .Include(e => e.ResultadosE.CalifResultadosFinancieros)
                    .Include("listaInsumos.TipoAcceso")
                    .Include("listaInsumos.AdjuntoITFInsumo.Adjunto") //AdjuntoITFInsumo
                                                                      //.Include("Evaluaciones.PersonalProyecto.empleado") //PersonalProyecto
                                                                      //.Include("Evaluaciones.PersonalProyecto") //PersonalProyecto
                                                                      //.Include("Evaluaciones.PersonalProyecto.persona") //PersonalProyecto
                    .Include("Evaluaciones.PersonalProyecto") //PersonalProyecto
                 

                    .AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                if (entities != null && entities.Evaluaciones != null)
                {
                    //var evaluaciones= entities.Evaluaciones.FirstOrDefault();
                    var list = new List<Evaluaciones>();
                    foreach (var evaluaciones in entities.Evaluaciones)
                    {
                        if (evaluaciones != null)
                        {
                            String clavePersona = evaluaciones.PersonalProyecto.ClavePersona;
                            var persona = await new PersonasRepository().GetByClaveWithoutStatus(clavePersona);
                            evaluaciones.PersonalProyecto.persona = persona;
                            list.Add(evaluaciones);
                        }
                    }
                    entities.Evaluaciones = list;
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SolicitudRevisionITF> GetSolicitudRevisionITF_cvePersona_EstadoSolicitudId(SolicitudRevisionITF model)
        {
            try
            {
                var result = await _db.dbSetSolicitudRevisionITF.AsNoTracking()
                    .FirstOrDefaultAsync(
                    e => e.InformeTecnicoFinalId == model.InformeTecnicoFinalId
                    && e.ClavePersonaSolicitante == model.ClavePersonaSolicitante
                    && e.EstadoSolicitudId == model.EstadoSolicitudId
                    );
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Boolean> CreateSolicitudRevisionITF(SolicitudRevisionITF model)
        {
            try
            {
                _db.dbSetSolicitudRevisionITF.Add(model);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Boolean> CreateAll(List<InformeTecnicoFinal> lista)
        {
            var saveOK = true;
            try
            {
                if (lista != null)
                {
                    var ids = lista.Select(x => x.InformeTecnicoFinalId).ToList();
                    var existentesIds = await _db.dbSetInformeTFs
                        .Where(x => ids.Contains(x.InformeTecnicoFinalId))
                        .Select(x => x.InformeTecnicoFinalId).ToListAsync();
                    lista = lista.Where(x => !existentesIds.Contains(x.InformeTecnicoFinalId)).ToList();
                }
                if (lista != null)
                    foreach (var model in lista)
                    {
                        try
                        {
                            _db.dbSetInformeTFs.Add(model);
                            await _db.SaveChangesAsync();
                        }
                        catch (Exception e)
                        {
                            saveOK = false;
                            _db = new MT_Context();
                        }


                    }



            }
            catch (Exception e)
            {
                //throw new Exception(e.Message, e);
                return false;
            }
            if (saveOK)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        //cuenta los itfs de un empleado sin considerar estadoflujo ni eliminado
        public async Task<int> CountITFByProyecto(string proyectoId)
        {
            try
            {
                    return await (from t in _db.dbSetInformeTFs
                .Where(f => f.ProyectoId.Equals(proyectoId))
                                  select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(InformeTecnicoFinal model)
        {
            try
            {
                /*if (model.ITFgeneral != null)
                {
                    model.ITFgeneral.ITFgeneralId = model.InformeTecnicoFinalId;
                    model.ITFgeneralId = model.ITFgeneral.ITFgeneralId;
                }*/
                _db.dbSetInformeTFs.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Boolean> UpdateSolicitudRevisionITF(SolicitudRevisionITF model)
        {
            try
            {
                var _model = await _db.dbSetSolicitudRevisionITF.FirstOrDefaultAsync(e => e.SolicitudRevisionITFId == model.SolicitudRevisionITFId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                    return true;
                }
                else { return false; }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(InformeTecnicoFinal model)
        {
            try
            {
                var _model = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == model.InformeTecnicoFinalId);
                if (_model != null)
                {
                    if (model.ITFgeneral != null)
                    {

                    
                        if (model.ITFgeneral.ITFgeneralId == null)
                        {
                            model.ITFgeneral.ITFgeneralId = model.InformeTecnicoFinalId;

                            _db.dbSetITFgeneral.Add(model.ITFgeneral);
                            try { 
                                await _db.SaveChangesAsync();
                                model.ITFgeneralId = model.ITFgeneral.ITFgeneralId;
                            }
                            catch (Exception err) {
                                _db = new MT_Context();
                                //necesario para que _model exista en el contexto
                                _model = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == model.InformeTecnicoFinalId);
                            }
                        }
                        else
                        {//actualizar ITFgeneral
                            var _modelGral = await _db.dbSetITFgeneral.FirstOrDefaultAsync(e => e.ITFgeneralId == model.ITFgeneral.ITFgeneralId);
                            if (_modelGral != null)
                            {
                                _db.Entry(_modelGral).CurrentValues.SetValues(model.ITFgeneral);
                                await _db.SaveChangesAsync();
                                try
                                {
                                    foreach (var adjunto in model.ITFgeneral.AdjuntoITF)
                                    {
                                        if (adjunto.AdjuntoITFId < 1)
                                        {
                                            adjunto.ITFgeneralId = model.ITFgeneral.ITFgeneralId;
                                            _db.dbSetAdjuntosITF.Add(adjunto);
                                            await _db.SaveChangesAsync();
                                        }
                                    }
                                }
                                catch (Exception e)
                                {

                                }
                            }
                        }
                    }
                    if (model.ResultadosE != null)
                    {
                        if (model.ResultadosE.ResultadosEId < 1)
                        {
                            _db.dbSetResultadosE.Add(model.ResultadosE);
                            await _db.SaveChangesAsync();
                            model.ResultadosEId = model.ResultadosE.ResultadosEId;
                        }
                        else
                        {//actualizar ResultadosE
                            var _modelResultE = await _db.dbSetResultadosE.FirstOrDefaultAsync(e => e.ResultadosEId == model.ResultadosE.ResultadosEId);
                            if (_modelResultE != null)
                            {
                                _db.Entry(_modelResultE).CurrentValues.SetValues(model.ResultadosE);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }
                    if (model.SatisCte != null)
                    {
                        if (model.SatisCte.SatisCteId < 1)
                        {
                            _db.dbSetSatisCtes.Add(model.SatisCte);
                            await _db.SaveChangesAsync();
                            model.SatisCteId = model.SatisCte.SatisCteId;
                        }
                        else
                        {//actualizar SatisCte
                            var _modelSatisCte = await _db.dbSetSatisCtes.FirstOrDefaultAsync(e => e.SatisCteId == model.SatisCte.SatisCteId);
                            if (_modelSatisCte != null)
                            {
                                //if(_model.SatisCte.AdjuntoId != null)
                                //{
                                //    var id = _model.SatisCte.AdjuntoId;
                                //    _model.SatisCte.AdjuntoId = null;
                                //    await _db.SaveChangesAsync();
                                //    await new AdjuntoRepository().Delete(id);
                                   
                                //}
                                
                                _db.Entry(_modelSatisCte).CurrentValues.SetValues(model.SatisCte);
                                await _db.SaveChangesAsync();
                            }
                        }

                    }
                    if (model.Resultados != null)
                    {
                        if (model.Resultados.ResultadosId < 1)
                        {
                            _db.dbSetResultados.Add(model.Resultados);
                            await _db.SaveChangesAsync();
                            model.ResultadosId = model.Resultados.ResultadosId;
                        }
                        else
                        {//actualizar Resultados
                            var _modelResultados = await _db.dbSetResultados.FirstOrDefaultAsync(e => e.ResultadosId == model.Resultados.ResultadosId);
                            if (_modelResultados != null)
                            {
                                _db.Entry(_modelResultados).CurrentValues.SetValues(model.Resultados);
                                await _db.SaveChangesAsync();
                            }
                        }

                    }
                    if (model.ProyFuturo != null)
                    {
                        if (model.ProyFuturo.ProyFuturoId < 1)
                        {
                            _db.dbSetProyFuturos.Add(model.ProyFuturo);
                            await _db.SaveChangesAsync();
                            model.ProyFuturoId = model.ProyFuturo.ProyFuturoId;
                        }
                        else
                        {//actualizar ProyFuturo
                            var _modelProyFuturo = await _db.dbSetProyFuturos.FirstOrDefaultAsync(e => e.ProyFuturoId == model.ProyFuturo.ProyFuturoId);
                            if (_modelProyFuturo != null)
                            {
                                _db.Entry(_modelProyFuturo).CurrentValues.SetValues(model.ProyFuturo);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }
                    //#region evaluaciones
                    if (model.Evaluaciones != null)
                    {
                        foreach (var eva in model.Evaluaciones)
                        {
                            if (eva.EvaluacionesId < 1) //nueva evaluación
                            {
                                _db.dbSetEvaluaciones.Add(eva);
                                await _db.SaveChangesAsync();
                            }
                            else //evaluación existente
                            {
                                var _modelEva = await _db.dbSetEvaluaciones.FirstOrDefaultAsync(e => e.EvaluacionesId == eva.EvaluacionesId);
                                if (_modelEva != null)
                                {
                                    _db.Entry(_modelEva).CurrentValues.SetValues(eva);
                                    await _db.SaveChangesAsync();
                                }
                            }

                        }
                    }
                    //#endregion evaluaciones

                    if (model.LAcap != null) //capacidad
                    {
                        if (model.LAcap.LAcapId < 1)
                        {
                            _db.dbSetLAcaps.Add(model.LAcap);
                            await _db.SaveChangesAsync();
                            model.LAcapId = model.LAcap.LAcapId;
                        }
                        else
                        {//actualizar LAcap
                            var _modelLAcap = await _db.dbSetLAcaps.FirstOrDefaultAsync(e => e.LAcapId == model.LAcap.LAcapId);
                            if (_modelLAcap != null)
                            {
                                _db.Entry(_modelLAcap).CurrentValues.SetValues(model.LAcap);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }

                    if (model.LActe != null) //Relacion con el cliente
                    {
                        if (model.LActe.LActeId < 1)
                        {
                            _db.dbSetLActes.Add(model.LActe);
                            await _db.SaveChangesAsync();
                            model.LActeId = model.LActe.LActeId;
                        }
                        else
                        {//actualizar LActe
                            var _modelLActe = await _db.dbSetLActes.FirstOrDefaultAsync(e => e.LActeId == model.LActe.LActeId);
                            if (_modelLActe != null)
                            {
                                _db.Entry(_modelLActe).CurrentValues.SetValues(model.LActe);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }

                    if (model.LAproy != null) //Desarrollo del proyecto
                    {
                        if (model.LAproy.LAproyId < 1)
                        {
                            _db.dbSetLAproys.Add(model.LAproy);
                            await _db.SaveChangesAsync();
                            model.LAproyId = model.LAproy.LAproyId;
                        }
                        else
                        {//actualizar LAproy
                            var _modelLAproy = await _db.dbSetLAproys.FirstOrDefaultAsync(e => e.LAproyId == model.LAproy.LAproyId);
                            if (_modelLAproy != null)
                            {
                                _db.Entry(_modelLAproy).CurrentValues.SetValues(model.LAproy);
                                await _db.SaveChangesAsync();
                            }
                        }
                    }

                    //#region Insumos
                    if (model.listaInsumos != null && model.listaInsumos.Count > 0)
                    {
                        foreach (var insu in model.listaInsumos)
                        {
                            if (insu.InsumosId < 1) //nuevo insumo
                            {
                                insu.InformeTecnicoFinalId = model.InformeTecnicoFinalId;
                                //ver de que manera se actualiza InsumosId
                                _db.dbSetInsumos.Add(insu);
                                await _db.SaveChangesAsync();
                            }
                            else //insumo existente
                            {
                                var _modelInsu = await _db.dbSetInsumos.FirstOrDefaultAsync(e => e.InsumosId == insu.InsumosId);
                                if (_modelInsu != null)
                                {
                                    _modelInsu.InformeTecnicoFinalId = model.InformeTecnicoFinalId;
                                    _db.Entry(_modelInsu).CurrentValues.SetValues(insu);
                                    await _db.SaveChangesAsync();
                                }
                            }

                        }
                    }

                    if (model.Adjunto != null)
                    {
                        if (_model.AdjuntoId != null)
                        {
                            var id = _model.AdjuntoId;
                            _model.AdjuntoId = null;
                            await _db.SaveChangesAsync();

                            await new AdjuntoRepository().Delete(id);
                        }

                        var adjunto = await new AdjuntoRepository().CreateAd(model.Adjunto);
                        model.AdjuntoId = adjunto.AdjuntoId;
                    }
                    //#endregion Insumos

                    //Actualizar ITF
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<long> CountAdjuntoITFByRutaCompleta(string ruta)
        {
            try
            {
                var count = (from e in _dbGen.dbSetAdjuntos
                             where e.RutaCompleta.Equals(ruta)
                             select e.RutaCompleta);
                var result = await count.LongCountAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task DeleteAdjuntoITF(int id)
        {
            try
            {
                var _model = await _db.dbSetAdjuntosITF.FirstOrDefaultAsync(x => x.AdjuntoITFId == id);
                if (_model != null)
                {
                    _db.dbSetAdjuntosITF.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task DeleteAutor(string id)
        {
            try
            {
                var _model = await _db.dbSetAutorITF.FirstOrDefaultAsync(e => e.AutorITFId == id);
                if (_model != null)
                {
                    _db.dbSetAutorITF.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task AddAutor(AutorITF model)
        {
            try
            {
                var existe = await _db.dbSetAutorITF.AsNoTracking()
                    .Where(x => x.AutorITFId.Equals(model.AutorITFId)).FirstOrDefaultAsync();
                if (existe == null)
                {

                    _db.dbSetAutorITF.Add(model);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    model.Estado = true;
                    await this.UpdateAutorITF(model);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateAutorITF(AutorITF model)
        {
            try
            {
                var _model = await _db.dbSetAutorITF.FirstOrDefaultAsync(e => e.AutorITFId == model.AutorITFId);
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
        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                if (_model != null)
                {
                    _db.dbSetInformeTFs.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task AddAdjuntoPrincipal(InformeTecnicoFinal Obj)
        {
            try
            {
                var result = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == Obj.InformeTecnicoFinalId);
                if (result != null)
                {
                    AdjuntoRepository adj = new AdjuntoRepository(_dbGen);
                    await adj.Create(Obj.Adjunto);

                    result.AdjuntoId = Obj.Adjunto.AdjuntoId;
                    await _dbGen.SaveChangesAsync();
                    Obj.AdjuntoId = result.AdjuntoId;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task AddAdjuntoCalidad(SatisCte Obj)
        {
            try
            {
                var result = await _db.dbSetSatisCtes.FirstOrDefaultAsync(e => e.SatisCteId == Obj.SatisCteId);
                if (result != null)
                {
                    AdjuntoRepository adj = new AdjuntoRepository(_dbGen);
                    await adj.Create(Obj.Adjunto);

                    result.AdjuntoId = Obj.Adjunto.AdjuntoId;
                    await _dbGen.SaveChangesAsync();
                    Obj.AdjuntoId = result.AdjuntoId;
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(InformeTecnicoFinal Obj)
        {
            try
            {
                var result = await _db.dbSetInformeTFs.FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == Obj.InformeTecnicoFinalId);
                if (result != null)
                {
                    result.Eliminado = Obj.Eliminado;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<InformeTecnicoFinal> GetLA(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .Include(e => e.LAcap)
                    .Include(e => e.LAproy)
                    .Include(e => e.LActe)
                    .Include(e => e.Proyecto)
                    .FirstOrDefaultAsync(e => e.InformeTecnicoFinalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Get lecciones aprendidas publicadas 
        public async Task<ICollection<InformeTecnicoFinal>> GetLASinProyecto(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.AsNoTracking()
                    .Include(e => e.LAcap)
                    .Include(e => e.LAproy)
                    .Include(e => e.LActe)
                    .Where(e=>e.ProyectoId==id && e.EstadoITFFlujoId== 4)
                    .OrderByDescending(e=>e.FechaAutorizacion)
                    .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetInsumosPublicosPorProyecto(string id)
        {
            try
            {
                var entities = await _db.dbSetInformeTFs.Where(e => e.ProyectoId == id && e.EstadoITFFlujoId == 4)
                    .Include(x => x.listaInsumos)
                    .Select(x=> x.listaInsumos)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message,e);
            }
        }


        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<InformeTecnicoFinal>> GetPal(string Palabra)
        {
            try
            {
                var v = (from a in _db.dbSetInformeTFs
                    .Include(e => e.LAcap)
                    .Include(e => e.LAproy)
                    .Include(e => e.LActe)
                    .Include(e => e.Proyecto)
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                       e.LAcap.Instalaciones.ToLower().Contains(p)
                    || e.LAcap.Servicios.ToLower().Contains(p)
                    || e.LAproy.Insumos.ToLower().Contains(p)
                    || e.LAproy.Equipo.ToLower().Contains(p)
                    || e.LAproy.Gestion.ToLower().Contains(p)
                    || e.LAproy.Cumplimiento.ToLower().Contains(p)
                    || e.LActe.Negociacion.ToLower().Contains(p)
                    || e.LActe.Desarrollo.ToLower().Contains(p)
                    || e.LActe.Cierre.ToLower().Contains(p)
                    || e.Proyecto.Nombre.ToLower().Contains(p));
                    }
                }
                var entities = await v.AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<InformeTecnicoFinal>> GetProy(string Palabra)
        {
            try
            {
                var v = (from a in _db.dbSetInformeTFs
                    .Include(e => e.LAcap)
                    .Include(e => e.LAproy)
                    .Include(e => e.LActe)
                    .Include(e => e.Proyecto)
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    v = v.Where(e => e.LAproyId > 0);
                    v = v.Where(e => e.LAcapId > 0);
                    v = v.Where(e => e.LActeId > 0);

                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                       e.Proyecto.ProyectoId.ToLower().Contains(p));
                    }
                }
                var entities = await v.AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<InformeTecnicoFinal>> GetJefe(string Palabra)
        {
            try
            {
                var v = (from a in _db.dbSetInformeTFs
                    .Include(e => e.LAcap)
                    .Include(e => e.LAproy)
                    .Include(e => e.LActe)
                    .Include(e => e.Proyecto)
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    v = v.Where(e => e.LAproyId > 0);
                    v = v.Where(e => e.LAcapId > 0);
                    v = v.Where(e => e.LActeId > 0);

                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                     e.Proyecto.NombreJefeProyecto.ToLower().Contains(p));
                    }
                }
                var entities = await v.AsNoTracking().ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
            _dbGen.Dispose();
        }
    }
}
