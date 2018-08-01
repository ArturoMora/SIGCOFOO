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
    public class PonenciaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        private List<Ponencia> entities;
        public PonenciaRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public PonenciaRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _ctx.Ponencia
                               .Where(f => f.EstadoFlujoId== estadoFlujo) //TODO checar otros atributos de estado, como eliminado logico
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Ponencia>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.Ponencia.Where(e => e.ClavePersona.Equals(id) && e.EstadoActivoId == 1)
                    .Where(e=>e.EstadoFlujoId==3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.congreso)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.EstadoPonencia)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetPonenciasForDetailsBusqueda(busquedaAv parametro){
            try{
                List<int>listaIds= new List<int>();
                var listaPreliminar= parametro.FieldD.Split(',').ToList();
                listaPreliminar.Remove("");
                listaIds= listaPreliminar.Select(int.Parse).ToList();
                
                var resultados= await _ctx.Ponencia.Where(e=> listaIds.Contains(e.PonenciaId)).AsNoTracking()
                .Select(x=> new {
                    id=x.PonenciaId,
                    Nombre=x.TituloPonencia,
                })
                .ToListAsync();
                
                return resultados;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }


        public async Task<List<int>> GetPonenciasLikeLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PonenciaId FROM CH.tab_Ponencia where TituloPonencia collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and TituloPonencia collate Latin1_General_CI_AI LIKE ";
                }
                query = query.Substring(0, query.Length - 53);
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Ponencia>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.Ponencia.Where(e => e.ClavePersona.Equals(clave) && e.EstadoActivoId == 1)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.congreso)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.EstadoPonencia)
                                        .Include(e => e.Pais)
                                        .AsNoTracking()
                                        .ToListAsync();
                                       
                foreach (var item in result)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }

                   

                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Ponencia>> GetByIdColaboracion(IEnumerable<AutorIIEPonencia> colaboracionPonencia)
        {
            try
            {
                List<Ponencia> Ponencia = new List<Ponencia>();
                foreach (var x in colaboracionPonencia)
                {
                    var local = await _ctx.Ponencia.Where(e => e.PonenciaId == x.PonenciaId)
                                            .Where(e => e.EstadoFlujoId == 3)
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e => e.congreso)
                                            .Include(e => e.Ambito)
                                            .Include(e => e.Pais)
                                            .Include(e => e.NivelPublicacion)
                                            .Include(e => e.Adjunto)
                                            .Include(e => e.EstadoPonencia)
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync();
                        Ponencia.Add(local);

                }
                return Ponencia;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
                
            }
        }


        public async Task<IEnumerable<Ponencia>> GetByIdColaboracion_NuevoFlujo(IEnumerable<AutorIIEPonencia> colaboracionPonencia)
        {
            try
            {
                List<Ponencia> Ponencia = new List<Ponencia>();
                foreach (var x in colaboracionPonencia)
                {
                    var local = await _ctx.Ponencia.Where(e => e.PonenciaId == x.PonenciaId)
                                            .Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 8 || e.EstadoFlujoId == 2)
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e => e.congreso)
                                            .Include(e => e.Ambito)
                                            .Include(e => e.Pais)
                                            .Include(e => e.NivelPublicacion)
                                            .Include(e => e.Adjunto)
                                            .Include(e => e.EstadoPonencia)
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync();
                    Ponencia.Add(local);

                }
                return Ponencia;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);

            }
        }


        public async Task<IEnumerable<Ponencia>> GetByEstado()
        {
            try
            {
                var result = await _ctx.Ponencia.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.congreso)
                                                        .Include(e => e.Ambito)
                                                        .Include(e => e.NivelPublicacion)
                                                        .Include(e => e.Adjunto)
                                                        .Include(e => e.EstadoPonencia)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task<Ponencia> GetById(int id)
        {
            try
            {
                var result = await _ctx.Ponencia.Where(e => e.PonenciaId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.congreso)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.EstadoPonencia)
                                        .Include(e => e.Pais)
                                        .Include(x=>x.Proyecto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetByProyecto(string id)
        {
            try
            {
                var result = await _ctx.Ponencia.Where(e => e.ProyectoId== id && e.EstadoFlujoId==3)
                                        .Include(e => e.congreso)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.Pais)
                                        .Select(x=> new {
                                            PonenciaId= x.PonenciaId,
                                            TituloPonencia=x.TituloPonencia,
                                            NombreCongreso=x.congreso.NombreCongreso,
                                            Ambito=x.Ambito.Descripcion,
                                            NombrePais= x.Pais.Descripcion,
                                            Year=x.year
                                        })
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Ponencia> Create(Ponencia Obj)
        {
            try
            {
                var result = _ctx.Ponencia.Add(Obj);
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
                var result = await _ctx.Ponencia.FirstOrDefaultAsync(e => e.PonenciaId == id);
                if (result != null)
                {
                    _ctx.Ponencia.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Ponencia Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.Ponencia.FirstOrDefaultAsync(e => e.PonenciaId == Obj.PonenciaId);
                if (Obj.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("PonenciaCH", result.PonenciaId + "");
                }
                if (result != null)
                {
                    if (Obj.Adjunto != null)
                    {
                        //Eliminar archivo
                        if (Obj.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(Obj.Adjunto.AdjuntoId);
                            result.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();
                            await new AdjuntoRepository().Delete(id);
                            
                        }
                        ///Agregar archivo al editar
                        if (Obj.Adjunto.AdjuntoId == 0)
                        {
                            if (result.AdjuntoId != null)
                            {
                                var id = result.AdjuntoId;
                                result.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();
                                await new AdjuntoRepository().Delete(id);
                            }
                            Adjunto key = await new AdjuntoRepository().CreateAd(Obj.Adjunto);
                            Obj.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }

                    _ctx.Entry(result).CurrentValues.SetValues(Obj);

                    await _ctx.SaveChangesAsync();
                }

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

        public async Task UpdateEstado(Ponencia Obj)
        {
            try
            {
                var result = await _ctx.Ponencia.FirstOrDefaultAsync(e => e.PonenciaId == Obj.PonenciaId);
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

        public async Task UpdateEstadoActivo(Ponencia Obj)
        {
            try
            {
                var result = await _ctx.Ponencia.FirstOrDefaultAsync(e => e.PonenciaId == Obj.PonenciaId);
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

        public async Task<IEnumerable<Ponencia>> GetAll()
        {
            try
            {
                var entities = await _ctx.Ponencia
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

        public async Task<IEnumerable<Ponencia>> getData(DataServerSide ss)
        {
            List<Ponencia> ListCursoInterno = new List<Ponencia>();
            try
            {
                var v = (from a in
                             _ctx.Ponencia.Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.congreso)
                                        .Include(e => e.Ambito)
                                        .Include(e => e.NivelPublicacion)
                                        .Include(e => e.EstadoPonencia)
                                        .Include(e=>e.Pais)
                         select a);

                ss.recordsTotal = v.Count();




                if (!String.IsNullOrEmpty(ss.Titulo)) //busqueda por titulo
                {
                    var listaDA = await GetDALikeTituloPonenciaNuevo(ss.Titulo);
                    v = v.Where(e => listaDA.Contains(e.PonenciaId));
                }
                
               
                //Lugar del congreso  
                if (!string.IsNullOrEmpty(ss.Tipo))
                {
                        v = v.Where(e =>
                            e.PaisID.ToString().Equals(ss.Tipo)
                            && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                            );

                }

                
                if (!String.IsNullOrEmpty(ss.Autor)) //busqueda por titulo
                {
                    var listaDA = await GetPKAutorExternoByCollateLatin1(ss.Autor);
                    v = v.Where(e => listaDA.Contains(e.PonenciaId) && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13) );
                }


              

                if (!string.IsNullOrEmpty(ss.Becario)) //Tomado como autor interno
                {
                    var entiti = await _ctx.AutorIIEPonencia
                    .Where(e => e.ClavePersona.ToString().Contains(ss.Becario)
                    && (e.Ponencia.EstadoFlujoId == 3 || e.Ponencia.EstadoFlujoId == 11 || e.Ponencia.EstadoFlujoId == 12 || e.Ponencia.EstadoFlujoId == 13))
                    .Include(e => e.Ponencia)
                    .AsNoTracking().ToListAsync();
                    if (entiti.Count == 0)
                    {
                        var reg = new AutorIIEPonencia();
                        reg.PonenciaId = -1;
                        v = v.Where(e => e.PonenciaId == reg.PonenciaId
                        && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                         );
                    }
                    else
                    {
                        HashSet<String> claves = null;
                        var registros = entiti.Select(x => x.PonenciaId.ToString()).ToList();
                        claves = new HashSet<String>(registros);
                        v = v.Where(e => claves.Contains(e.PonenciaId.ToString())
                        && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                        );
                    }
                }


                //caja
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    //var pal = ss.searchValue.Split(' ');
                    //foreach (var pa in pal)
                    //{

                    var listaDA = await GetDALikeTituloPonenciaNuevo(ss.searchValue);
                    var listaPais = await GetDALikePaises(ss.searchValue);
                    var listaCongresos = await GetDALikeCongresos(ss.searchValue);

                    var p = ss.searchValue.ToLower();
                    v = v.Where(e =>
                    listaDA.Contains(e.PonenciaId)
                    || e.FechaInicio.ToString().Contains(p)
                    || listaCongresos.Contains(e.CongresoId)
                    ||listaPais.Contains(e.PaisID)
                    
                    
                    );
                    //}

                }
                

                if (!string.IsNullOrEmpty(ss.NuevaFechaInicio) || !string.IsNullOrEmpty(ss.NuevaFechaTermino))
                {

                    //var listaDA = await GetPorfecha(ss.NuevaFechaInicio, ss.NuevaFechaTermino);
                    //v = v.Where(e => listaDA.Contains(e.PonenciaId));
                    var fechaInicio = Convert.ToDateTime(ss.NuevaFechaInicio);
                    var fechaFin = Convert.ToDateTime(ss.NuevaFechaTermino);
                    v = v.Where(e => (DbFunctions.TruncateTime(e.FechaInicio) >= DbFunctions.TruncateTime(fechaInicio)
                                                    && DbFunctions.TruncateTime(e.FechaInicio) <= DbFunctions.TruncateTime(fechaFin)));


                }


                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }
                ss.recordsFiltered = v.Count();
                entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                return entities.OrderByDescending(e => e.FechaInicio);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


      

        public async Task<List<int>> GetDALikeTituloPonenciaNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PonenciaId FROM  CH.tab_Ponencia where TituloPonencia collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and TituloPonencia collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetDALikeEspecialidadPonenciaLatin1(String likeNombre)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<int>
                ("SELECT PonenciaId FROM CH.tab_Ponencia where Especialidad collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetDALikePalabrasClavePonenciaLatin1(String likeNombre)
        {
            try
            {
                var resultados = await _ctx.Database.SqlQuery<int>
                ("SELECT PonenciaId FROM CH.tab_Ponencia where PalabrasClave collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetPorfecha(string inicio, string termino)
        {
            try
            {

                var query = "SELECT PonenciaId FROM CH.tab_Ponencia where FechaInicio >  convert(date,'" + inicio + "',103) and FechaInicio <  convert(date,'" + termino + "',103)";
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
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
                var query = "SELECT PonenciaId FROM CH.tab_AutorPonenciaExt where Nombre collate Latin1_General_CI_AI LIKE ";
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


        public async Task<List<int?>> GetDALikePaises(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT PaisID FROM  CH.cat_Pais where Descripcion collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _ctx.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int?>> GetDALikeCongresos(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CongresoId FROM  CH.cat_Congresos where NombreCongreso collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and NombreCongreso collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _ctx.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
