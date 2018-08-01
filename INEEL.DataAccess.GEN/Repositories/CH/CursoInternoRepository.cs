using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CursoInternoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        GEN_Context _dtx;
        SIGCOCHContext _ctx;
        MT_Context _mtctx;
        public CursoInternoRepository()
        {
            _ctx = new SIGCOCHContext();
            _dtx = new GEN_Context();
            _mtctx = new MT_Context();
            _ctx.Database.Log = Escribe.Write;
        }

        public CursoInternoRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }
        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _ctx.CursoInterno
                               .Where(f => f.EstadoFlujoId == estadoFlujo) //TODO checar otros atributos de estado, como eliminado logico
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetCursosForDetailsBusqueda (busquedaAv parametro){
            try{
                List<int>listaIds= new List<int>();
                var listaPreliminar= parametro.FieldD.Split(',').ToList();
                listaPreliminar.Remove("");
                listaIds= listaPreliminar.Select(int.Parse).ToList();

                var resultados= await _ctx.CursoInterno.Where(e=> listaIds.Contains(e.CursoInternoId)).AsNoTracking()
                .Select(x=> new {
                    id=x.CursoInternoId,
                    Nombre=x.Titulo,
                    Descripcion= x.Descripcion
                })
                .ToListAsync();

                return resultados;

            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }


        public async Task<List<int>> GetCursosLikeLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CursoInternoId FROM CH.tab_CursoInterno where Titulo collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Titulo collate Latin1_General_CI_AI LIKE ";
                }
                query = query.Substring(0, query.Length - 45);
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CursoInterno>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.CursoInterno.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.TipoCurso)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CursoInterno>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.CursoInterno.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .Include(e=>e.Proyecto)
                                        .Include(e => e.TipoCurso)
                                        .AsNoTracking()
                                        .ToListAsync();

                foreach (var item in result)
                {
                    if (item.EstadoFlujoId == 2 && item.PerteneceCP==false)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                    if (item.EstadoFlujoId == 2 && item.PerteneceCP == true)
                    {
                        item.EstadoFlujo.Descripcion += " Admin Centro de Posgrado";
                    }
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CursoInterno>> GetByClaveAutorWithCoAutores(string clave)
        {
            try
            {
                //Primero obtenemos la lista de capitulos registrados por el usuario buscado
                List<CursoInterno> listaCursos= new List<CursoInterno>();
                var cursos = await _ctx.CursoInterno.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoCurso)
                                        .AsNoTracking()
                                        .ToListAsync();

                listaCursos.AddRange(cursos);

                //Despues obtenemos la lista de capitulos registrados por el usuario como CO-AUTOR
                var primaryKeysCursos= cursos.Select(x=> x.CursoInternoId);
                var listaCoAutores= await _ctx.AutorInternoCursoInterno.AsNoTracking()
                                    .Where(e=> e.ClavePersona==clave && !primaryKeysCursos.Contains(e.CursoInternoId)).Select(x=> x.CursoInternoId).ToListAsync(); 
                var cursosCoautores= await _ctx.CursoInterno
                                        .Where(e=> listaCoAutores.Contains(e.CursoInternoId) && (e.EstadoFlujoId==3 || e.EstadoFlujoId==8 || e.EstadoFlujoId==2) )
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoCurso)
                                        .AsNoTracking().ToListAsync();

                listaCursos.AddRange(cursosCoautores);

                foreach (var item in listaCursos)
                {
                    if (item.EstadoFlujoId == 2 && item.PerteneceCP==false)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                    if (item.EstadoFlujoId == 2 && item.PerteneceCP == true)
                    {
                        item.EstadoFlujo.Descripcion += " Admin Centro de Posgrado";
                    }
                }

                return listaCursos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CursoInterno>> getData(DataServerSide ss)
        {
            List<CursoInterno> ListCursoInterno = new List<CursoInterno>();
            try
            {
                var v = (from a in
                             _ctx.CursoInterno.Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                             .Include(e => e.Proyecto)
                             .Include(e => e.TipoCurso)
                         select a);

                ss.recordsTotal = v.Count();

                //search        
                if (!string.IsNullOrEmpty(ss.Titulo))
                {

                    if (!String.IsNullOrEmpty(ss.Titulo)) //busqueda por titulo
                    {
                        var listaDA = await GetDALikeNombreNuevo(ss.Titulo);
                        v = v.Where(e => listaDA.Contains(e.CursoInternoId));
                    }

                }
                if (!string.IsNullOrEmpty(ss.ClaveUnidad))
                {                   
                    UORepository uo = new UORepository(_dtx);
                    var uni = await uo.GetByIdWithChildren(ss.ClaveUnidad);
                    HashSet<String> clavesUnidad = null;
                    if (uni.tipoO < 3)
                    {
                        var unidades = uni.Children.Select(x => x.ClaveUnidad).ToList();
                        clavesUnidad = new HashSet<String>(unidades);
                       
                    }
                    else
                    {
                        clavesUnidad = new HashSet<String>();
                        clavesUnidad.Add(ss.ClaveUnidad);
                    }

                    v = v.Where(e => 
                    clavesUnidad.Contains(e.Proyecto.UnidadOrganizacionalId)     );
                }

                if (!string.IsNullOrEmpty(ss.proyectoId))
                {
                    v = v.Where(e => e.ProyectoId.ToString().Contains(ss.proyectoId));
                }
                if (!string.IsNullOrEmpty(ss.Tipo))
                {
                    v = v.Where(e => e.TipoCursoId.ToString().Contains(ss.Tipo));
                }
                if (!string.IsNullOrEmpty(ss.Autor))
                {
                    //var entiti = await _ctx.AutorInternoCursoInterno.Include(e => e.CursoInterno).AsNoTracking()
                    //.FirstOrDefaultAsync(e => e.ClavePersona.ToString() == ss.Autor
                    //&& (e.CursoInterno.EstadoFlujoId == 3 || e.CursoInterno.EstadoFlujoId == 11 || e.CursoInterno.EstadoFlujoId == 12 || e.CursoInterno.EstadoFlujoId == 13));
                    var entiti = await _ctx.AutorInternoCursoInterno
                    .Where(e => e.ClavePersona.ToString().Contains(ss.Autor)
                    && (e.CursoInterno.EstadoFlujoId == 3 || e.CursoInterno.EstadoFlujoId == 11 || e.CursoInterno.EstadoFlujoId == 12 || e.CursoInterno.EstadoFlujoId == 13))
                    .Include(e => e.CursoInterno)
                    .AsNoTracking().ToListAsync();
                    if (entiti.Count==0)
                    {
                        var reg = new AutorInternoCursoInterno();
                        reg.CursoInternoId = -1;
                        v = v.Where(e =>
                        e.CursoInternoId ==reg.CursoInternoId
                            && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                             );
                    }
                    else
                    {
                        HashSet<String> claves = null;
                        var registros = entiti.Select(x => x.CursoInternoId.ToString()).ToList();
                        claves = new HashSet<String>(registros);
                        v = v.Where(e =>
                        claves.Contains(e.CursoInternoId.ToString())
                        && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                        );
                    }
                }

                if (!string.IsNullOrEmpty(ss.NuevaFechaInicio) && !string.IsNullOrEmpty(ss.NuevaFechaTermino))
                {

                    var fechaInicio = Convert.ToDateTime(ss.NuevaFechaInicio);
                    var fechaFin = Convert.ToDateTime(ss.NuevaFechaTermino);
                    v = v.Where(e => (DbFunctions.TruncateTime(e.FechaCurso) >= DbFunctions.TruncateTime(fechaInicio)
                                                    && DbFunctions.TruncateTime(e.FechaTermino) <= DbFunctions.TruncateTime(fechaFin)));
                }

                //caja
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    
                        var p = ss.searchValue.ToLower();

                        var listaDA = await GetDALikeNombreNuevo(ss.searchValue);
                        var listaDT = await GetPorTipo(ss.searchValue);


                    v = v.Where(e =>
                        e.FechaCurso.ToString().Contains(p) ||e.Proyecto.Nombre.Contains(p)  || listaDA.Contains(e.CursoInternoId) || listaDT.Contains(e.TipoCursoId) );
                   
                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                return entities.OrderByDescending( e => e.FechaCurso);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<CursoInterno>> GetByIdColaboracion(IEnumerable<AutorInternoCursoInterno> colaboracion)
        {
            try
            {
                List<CursoInterno> CursoInterno = new List<CursoInterno>();
                foreach (var x in colaboracion)
                {
                    var local = await _ctx.CursoInterno.Where(e => e.CursoInternoId == x.CursoInternoId)
                                            .Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                                            .Include(e => e.EstadoFlujo)
                                            .Include(e => e.Adjunto)
                                            .Include(e => e.Proyecto)
                                            .Include(e => e.TipoCurso)
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync();
                    CursoInterno.Add(local);

                }
                return CursoInterno;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);

            }
        }
        public async Task<IEnumerable<CursoInterno>> GetByEstado()
        {
            try
            {
                var result = await _ctx.CursoInterno.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.Adjunto)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.TipoCurso)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<CursoInterno> GetById(int id)
        {
            try
            {
                var result = await _ctx.CursoInterno.Where(e => e.CursoInternoId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.TipoCurso)
                                        .Include(e=>e.SitioWebCurso)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }       
        public async Task<CursoInterno> Create(CursoInterno Obj)
        {
            try
            {
                var result = _ctx.CursoInterno.Add(Obj);
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
                var result = await _ctx.CursoInterno.FirstOrDefaultAsync(e => e.CursoInternoId == id);
                if (result != null)
                {
                    _ctx.CursoInterno.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(CursoInterno Obj)// UpdateSolicitud
        {
            try
            {
                DateTime localDate = DateTime.Now;
                var result = await _ctx.CursoInterno.FirstOrDefaultAsync(e => e.CursoInternoId == Obj.CursoInternoId);
                if (Obj.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("CursoCH", result.CursoInternoId + "");
                }
                if (result != null)
                {
                    foreach (var item in Obj.SitioWebCurso)
                    {
                        if (item.SitioWebCursoInternoId == 0)
                        {
                            item.CursoInterno = null;
                            item.FechaRegistro = localDate;
                            _ctx.SitioWebCurso.Add(item);
                            await _ctx.SaveChangesAsync();
                        }
                        else
                        {
                            if (item.Url.Equals("eliminar"))
                            {
                                var result2 = await _ctx.SitioWebCurso.FirstOrDefaultAsync(e => e.SitioWebCursoInternoId == item.SitioWebCursoInternoId);
                                if (result2 != null)
                                {
                                    _ctx.SitioWebCurso.Remove(result2);
                                    await _ctx.SaveChangesAsync();
                                }
                            }
                        }
                    }


                    _ctx.Entry(result).CurrentValues.SetValues(Obj);
                    //if (Obj.EstadoFlujoId == 3)
                    //{
                    //    await new NuevoOCRepository().Create(
                    //    new NuevoOC("MT",
                    //               "CURSO",
                    //    Obj.Titulo,
                    //    "indexMT.html#/BuscarCursosDetails/" + Obj.CursoInternoId
                    //        ));
                    //}
                    await _ctx.SaveChangesAsync();


                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(Obj.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateEstado(CursoInterno Obj)
        {
            try
            {
                var result = await _ctx.CursoInterno.FirstOrDefaultAsync(e => e.CursoInternoId == Obj.CursoInternoId);
                if (result != null)
                {
                    result.EstadoFlujoId = Obj.EstadoFlujoId;
                    result.PerteneceCP = Obj.PerteneceCP;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<CursoInterno>> GetTitulo(string id)
        {
            try
            {
                var v = (from a in _ctx.CursoInterno
                                    .Include(e => e.TipoCurso)
                                    .Include(e => e.Proyecto)
                         select a);
                if (!String.IsNullOrEmpty(id))
                {
                    var pal = id.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e => e.Titulo.ToLower().Contains(p) && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12||e.EstadoFlujoId == 13));
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
        public async Task<IEnumerable<CursoInterno>> GetProy(string id)
        {
            try
            {
                var result = await _ctx.CursoInterno.Where(e => e.ProyectoId.Equals(id) && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13))
                                        .Include(e => e.TipoCurso)
                                        .Include(e => e.Proyecto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<CursoInterno>> GetFecIni(DateTime fecha)
        {
            try
            {
                var dia = fecha.Day;
                var mes = fecha.Month;
                var anio = fecha.Year;
                var result = await _ctx.CursoInterno.Where(e => e.FechaCurso.Day == dia &&
                                    e.FechaCurso.Month == mes &&
                                    e.FechaCurso.Year == anio &&
                                    (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13))
                                    .Include(e => e.TipoCurso)
                                    .Include(e => e.Proyecto)
                                    .AsNoTracking()
                                    .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<CursoInterno>> GetTipo(int id)
        {
            try
            {
                var result = await _ctx.CursoInterno.Where(e => e.TipoCursoId == id && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13))
                                        .Include(e => e.TipoCurso)
                                        .Include(e => e.Proyecto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        /// <summary>
        /// Obtener todos las claves de autores (del instituto) para reporte
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetDALikeNombreLatin1(String likeNombre)
        {
            try
            {

                var resultados = await _ctx.Database.SqlQuery<int>
                ("SELECT CursoInternoId FROM CH.tab_CursoInterno where Titulo collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetDALikeNombreNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CursoInternoId FROM  CH.tab_CursoInterno where Titulo collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Titulo collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
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

                var query = "SELECT CursoInternoId FROM CH.tab_CursoInterno where FechaCurso >  convert(date,'" + inicio + "',103) and FechaTermino <  convert(date,'" + termino + "',103)";
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetPorTipo(string likeNombre)
        {
            try
            {
               
                var query = "SELECT TipoCursoId FROM  MT.cat_TipoCurso where Descripcion collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'";
                
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }

    
}
