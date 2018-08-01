using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class PublicacionRepository : IDisposable
    {
        public void Dispose() { _ctx.Dispose(); }
        SIGCOCHContext _ctx;
        private List<Publicacion> entities;

        public PublicacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public PublicacionRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _ctx.Publicacion
                               .Where(f => f.EstadoFlujoId == estadoFlujo) //TODO checar otros atributos de estado, como eliminado logico
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetPublicacionesForDetailsBusqueda(busquedaAv parametro) //GetPonenciasForDetailsBusqueda
        {
            try
            {
                List<int> listaIds = new List<int>();
                var listaPreliminar = parametro.FieldD.Split(',').ToList();
                listaPreliminar.Remove("");
                listaIds = listaPreliminar.Select(int.Parse).ToList();

                var resultados = await _ctx.Publicacion.Where(e => listaIds.Contains(e.PublicacionId)).AsNoTracking()
                                                .Select(x => new
                                                {
                                                    id = x.PublicacionId,
                                                    Nombre = x.TituloPublicacion
                                                }).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        // public async Task<List<int>> GetPublicacionesLikeLatin1(String likeNombre)
        // {
        //     try
        //     {
        //         var resultados = await _ctx.Database.SqlQuery<int>
        //         ("SELECT PublicacionId FROM CH.tab_Publicacion where TituloPublicacion collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
        //         return resultados;
        //     }
        //     catch (Exception e)
        //     {
        //         throw new Exception(e.Message, e);
        //     }
        // }

        public async Task<List<int>> GetPublicacionesLikeLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PublicacionId FROM CH.tab_Publicacion where TituloPublicacion collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and TituloPublicacion collate Latin1_General_CI_AI LIKE ";
                }
                query = query.Substring(0, query.Length - 56);
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Publicacion>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.Publicacion.Where(e => e.ClavePersona.Equals(id) && e.EstadoActivoId == 1)
                    .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Revista)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.EstadoPublicacion)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Publicacion>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.Publicacion.Where(e => e.ClavePersona.Equals(clave) && e.EstadoActivoId == 1)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Revista)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.EstadoPublicacion)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Publicacion>> GetByEstado()
        {
            try
            {
                var result = await _ctx.Publicacion.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.Revista)
                                                        .Include(e => e.Ambito)
                                                        .Include(e => e.NivelPublicacion)
                                                        .Include(e => e.EstadoPublicacion)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Publicacion>> GetByIdColaboracion(IEnumerable<AutorIIEPublicacion> colaboracionPublicacion)
        {
            try
            {
                List<Publicacion> Publicacion = new List<Publicacion>();
                foreach (var x in colaboracionPublicacion)
                {
                    var local = await _ctx.Publicacion.Where(e => e.PublicacionId == x.PublicacionId)
                                            .Where(e => e.EstadoFlujoId == 3)
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e => e.Revista)
                                            .Include(e => e.Ambito)
                                            .Include(e => e.NivelPublicacion)
                                            .Include(e => e.EstadoPublicacion)
                                            .Include(e => e.Adjunto)
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync();
                    Publicacion.Add(local);

                }
                return Publicacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);

            }
        }

        public async Task<IEnumerable<Publicacion>> GetByIdColaboracion_NuevoFlujo(IEnumerable<AutorIIEPublicacion> colaboracionPublicacion)
        {
            try
            {
                List<Publicacion> Publicacion = new List<Publicacion>();
                foreach (var x in colaboracionPublicacion)
                {
                    var local = await _ctx.Publicacion.Where(e => e.PublicacionId == x.PublicacionId)
                                            .Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 8 || e.EstadoFlujoId == 2)
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e => e.Revista)
                                            .Include(e => e.Ambito)
                                            .Include(e => e.NivelPublicacion)
                                            .Include(e => e.EstadoPublicacion)
                                            .Include(e => e.Adjunto)
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync();
                    Publicacion.Add(local);

                }
                return Publicacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);

            }
        }


        public async Task<IEnumerable<Publicacion>> GetByPublicacionesByProyecto(string id)
        {
            try
            {
                var proyectos = await _ctx.Publicacion.Where(e => e.ProyectoId == id && e.EstadoFlujoId == 3)
                    .Include(e => e.Revista)
                    .Include(e => e.EstadoPublicacion)
                    .AsNoTracking().ToListAsync();


                return proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Publicacion> GetById(int id)
        {
            try
            {
                var result = await _ctx.Publicacion.Where(e => e.PublicacionId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Revista)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.EstadoPublicacion)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.Proyecto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Publicacion> Create(Publicacion Obj)
        {
            try
            {
                // if(await ValidarDuplicados(Obj))
                // {
                //     throw new ApplicationException("Intente cambiar la revista asociada, la fecha de publicación o el número de páginas");
                // }
                var result = _ctx.Publicacion.Add(Obj);
                await _ctx.SaveChangesAsync();
                return (result);
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
                var result = await _ctx.Publicacion.FirstOrDefaultAsync(e => e.PublicacionId == id);
                if (result != null)
                {
                    _ctx.Publicacion.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Publicacion Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.Publicacion.FirstOrDefaultAsync(e => e.PublicacionId == Obj.PublicacionId);
                // if(await ValidarDuplicados(Obj))
                // {
                //     throw new ApplicationException("Intente cambiar la revista asociada, la fecha de publicación o el número de páginas");
                // }
                if (Obj.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("ArtículoCH", result.PublicacionId + "");
                }
                if (result != null)
                {

                    if (Obj.Adjunto != null)
                    {
                        AdjuntoRepository _adjuntoRepo = new AdjuntoRepository();
                        if (Obj.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(Obj.Adjunto.AdjuntoId);
                            Obj.AdjuntoId = null;
                            _ctx.Entry(result).CurrentValues.SetValues(Obj);
                            await _ctx.SaveChangesAsync();
                            await _adjuntoRepo.Delete(id);

                        }
                        ///Agregar archivo al editar
                        if (Obj.Adjunto.AdjuntoId == 0)
                        {
                            if (result.AdjuntoId != null)
                            {
                                var id = result.AdjuntoId;
                                Obj.AdjuntoId = null;
                                _ctx.Entry(result).CurrentValues.SetValues(Obj);
                                await _ctx.SaveChangesAsync();
                                await _adjuntoRepo.Delete(id);
                            }
                            Adjunto key = await _adjuntoRepo.CreateAd(Obj.Adjunto);
                            Obj.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }

                    _ctx.Entry(result).CurrentValues.SetValues(Obj);

                    await _ctx.SaveChangesAsync();
                }

                //if (Obj.EstadoFlujoId == 3)
                //{
                //    await new NuevoOCRepository().Create(
                //    new NuevoOC("MT",
                //               "ARTÍCULO",
                //    Obj.TituloPublicacion,
                //    "indexMT.html#/PublicacionDetails/" + Obj.PublicacionId
                //        ));
                //}


                PersonasRepository prep = new PersonasRepository();
                Personas p = await prep.GetByClave(Obj.ClavePersona);
                p.ultimaActualizacion = DateTime.Now;
                await prep.Update(p);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Publicacion Obj)
        {
            try
            {
                var result = await _ctx.Publicacion.FirstOrDefaultAsync(e => e.PublicacionId == Obj.PublicacionId);
                if (result != null)
                {
                    result.EstadoFlujoId = Obj.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstadoActivo(Publicacion Obj)
        {
            try
            {
                var result = await _ctx.Publicacion.FirstOrDefaultAsync(e => e.PublicacionId == Obj.PublicacionId);
                if (result != null)
                {
                    result.EstadoActivoId = Obj.EstadoActivoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Publicacion>> GetAll()
        {
            try
            {
                var entities = await _ctx.Publicacion
                    .Include(e => e.EstadoFlujo)
                    .AsNoTracking()
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetPKAutorExternoByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PublicacionId FROM CH.tab_AutorPublicacionExt where Nombre collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Nombre collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Publicacion>> getData(DataServerSide ss)
        {
            List<Publicacion> ListPublicacion = new List<Publicacion>();
            try
            {
                var v = (from a in
                             _ctx.Publicacion.Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                                        .Include(e => e.Revista)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.EstadoPublicacion)
                                        .OrderByDescending(e => e.FechaPublicacion)

                         select a);

                ss.recordsTotal = v.Count();



                if (!String.IsNullOrEmpty(ss.Titulo)) //busqueda por titulo
                {
                    var listaDA = await GetDALikeTituloNuevo(ss.Titulo);
                    v = v.Where(e => listaDA.Contains(e.PublicacionId));
                }

                if (!String.IsNullOrEmpty(ss.porContenido))
                {
                    v = v.Where(e => e.RevistaId.ToString().Equals(ss.porContenido));
                }

                if (!string.IsNullOrEmpty(ss.Autor)) //Autor externo
                {
                    var AutoresE = await GetPKAutorExternoByCollateLatin1(ss.Autor);
                    v = v.Where(e => AutoresE.Contains(e.PublicacionId));
                }

                if (!string.IsNullOrEmpty(ss.Becario)) //Tomado como autor interno
                {
                    var entiti = await _ctx.AutorIIEPublicacion
                    .Where(e => e.ClavePersona.ToString().Contains(ss.Becario)
                    && (e.Publicacion.EstadoFlujoId == 3 || e.Publicacion.EstadoFlujoId == 11 || e.Publicacion.EstadoFlujoId == 12 || e.Publicacion.EstadoFlujoId == 13))
                    .Include(e => e.Publicacion)
                    .AsNoTracking().ToListAsync();
                    if (entiti.Count == 0)
                    {
                        var reg = new AutorIIEPublicacion();
                        reg.PublicacionId = -1;
                        v = v.Where(e => e.PublicacionId == reg.PublicacionId
                        && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                         );
                    }
                    else
                    {
                        HashSet<String> claves = null;
                        var registros = entiti.Select(x => x.PublicacionId.ToString()).ToList();
                        claves = new HashSet<String>(registros);


                        v = v.Where(e =>
                        claves.Contains(e.PublicacionId.ToString())
                        && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                        );
                    }
                }



                if (!string.IsNullOrEmpty(ss.searchValue))
                {

                    var p = ss.searchValue.ToLower();

                    var listaDA = await GetDALikeTituloNuevo(ss.searchValue);
                    var listaDR = await GetDALikeRevista(ss.searchValue);

                    v = v.Where(e => listaDA.Contains(e.PublicacionId) || listaDR.Contains(e.RevistaId) || e.FechaPublicacion.ToString().Contains(p));


                }


                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {

                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }
                ss.recordsFiltered = v.Count();
                entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                return entities.OrderByDescending(e => e.FechaPublicacion);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }




        public async Task<List<int>> GetDALikeTituloLatin1(String likeNombre)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<int>
                ("SELECT PublicacionId FROM CH.tab_Publicacion where TituloPublicacion collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetDALikeTituloNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PublicacionId FROM  CH.tab_Publicacion where TituloPublicacion collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and TituloPublicacion collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetDALikePalabrasClaveLatin1(String likeNombre)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<int>
                ("SELECT PublicacionId FROM CH.tab_Publicacion where PalabrasClave collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetDALikePalabrasClaveNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PublicacionId FROM  CH.tab_Publicacion where PalabrasClave collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and PalabrasClave collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<List<int>> GetDALikeRevista(String likeNombre)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<int>
                ("SELECT RevistaId FROM CH.cat_Revistas where RevistaNombre collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan publicaciones repetidas
        /// </summary>
        /// <param name="model"><Publicacion>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(Publicacion model)
        {
            try
            {
                // var data= await GetDALikeTituloNuevo(model.TituloPublicacion);
                var registros = await _ctx.Publicacion.Where(e => e.ClavePersona == model.ClavePersona && e.RevistaId == model.RevistaId
                         && DbFunctions.TruncateTime(e.FechaPublicacion) == DbFunctions.TruncateTime(model.FechaPublicacion)
                         && e.Paginas == model.Paginas && e.PublicacionId != model.PublicacionId)
                        .AsNoTracking().CountAsync();
                if (registros > 0)
                {
                    return true;
                }
                return false;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }




    }
}
