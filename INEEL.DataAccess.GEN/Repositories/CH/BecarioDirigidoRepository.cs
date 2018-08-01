using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class BecarioDirigidoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        GEN_Context _gen;
        TesisDirigidaRepository _tesisdirigida;

        public BecarioDirigidoRepository()
        {
            _ctx = new SIGCOCHContext();
            _tesisdirigida = new TesisDirigidaRepository();
            _gen = new GEN_Context();
        }

        public BecarioDirigidoRepository(SIGCOCHContext context)
        {
            _ctx = context;
            _tesisdirigida = new TesisDirigidaRepository();
            _gen = new GEN_Context();
        }

        public async Task<IEnumerable<BecarioDirigido>> GetByClaveEmpEstadoFlujo(string clave, DateTime yearsBack, List<int> estados)
        {
            try
            {
                var result = await _ctx.BecarioDirigido
                    .Where(e => e.ClavePersona.Equals(clave) && estados.Contains(e.EstadoFlujoId) )
                                        .OrderByDescending(e => e.FechaInicio)
                                        //.Include(e=>e.EstadoFlujo)
                                        .Include(e=>e.TipoBeca)
                                        .Include(e=>e.Proyecto)                                        
                                        //.Include(e=>e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();
                foreach (var item in result)
                {
                    item.UnidadOrganizacional = unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      );
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<BecarioDirigido>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.BecarioDirigido.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoBeca)
                                        .Include(e => e.Proyecto)
                                        //.Include(e => e.UnidadOrganizacional)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x=> claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();
                foreach (var item in result)
                {
                    item.UnidadOrganizacional= unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      );
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioDirigido>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.BecarioDirigido.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e=>e.EstadoFlujo)
                                        .Include(e=>e.TipoBeca)
                                        .Include(e=>e.Proyecto)
                                        //.Include(e=>e.UnidadOrganizacional)
                                        .Include(e=>e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();
                foreach (var item in result)
                {
                    item.UnidadOrganizacional = unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      );
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

        public async Task<IEnumerable<BecarioDirigido>> GetByEstado()
        {
            try
            {
                var result = await _ctx.BecarioDirigido.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        //.Include(e => e.UnidadOrganizacional)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .ToListAsync();

                List<String> claveUniddes = new List<string>(result.Select(x => x.ClaveUnidad));
                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => claveUniddes.Contains(x.ClaveUnidad))
                         .AsNoTracking().ToListAsync();
                foreach (var item in result)
                {
                    item.UnidadOrganizacional = unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      );
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BecarioDirigido> GetById(int id)
        {
            try
            {
                var result = await _ctx.BecarioDirigido.Where(e => e.BecarioDirigidoId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoBeca)
                                        .Include(e => e.Proyecto)
                                        //.Include(e => e.UnidadOrganizacional)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();


                var unidades = await _gen.dbSetUnidadOrganizacional
                         .Where(x => x.ClaveUnidad==result.ClaveUnidad && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                         .AsNoTracking().FirstOrDefaultAsync();
                result.UnidadOrganizacional = unidades;

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task Create(BecarioDirigido Obj)
        {
            try
            {
                _ctx.BecarioDirigido.Add(Obj);
                await _ctx.SaveChangesAsync();
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
                var result = await _ctx.BecarioDirigido.FirstOrDefaultAsync(e => e.BecarioDirigidoId == id);
                if (result != null)
                {
                    //(Se comenta el siguiente código para que no se actualice la tabla de tesis dirigida, que tal si la cargo al mismo tiempo?, se tiene que analizar mejor la solución)
                    //if (result.TesisDirigidaId != null)
                    //{
                    //    await _tesisdirigida.Delete(result.TesisDirigidaId);
                    //    _ctx.BecarioDirigido.Remove(result);
                    //    await _ctx.SaveChangesAsync();
                    //}else
                    //{
                    _ctx.BecarioDirigido.Remove(result);
                        await _ctx.SaveChangesAsync();
                    //}

                    
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BecarioDirigido Obj)// UpdateSolicitud
        {
            try
            {

                //Crear tesis dirigida 
                //int tesisdirigidaId = 0;
                //(Se comenta el siguiente código para que no se actualice la tabla de tesis dirigida, que tal si la cargo al mismo tiempo?, se tiene que analizar mejor la solución)
                //if(Obj.EstadoFlujoId==3 && (Obj.TipoBecaId==1 || Obj.TipoBecaId == 2 || Obj.TipoBecaId == 3) && Obj.TesisDirigidaId==null)
                //{
                //    TesisDirigida td = new TesisDirigida();
                //    td.AdjuntoId = Obj.AdjuntoId;
                //    td.Autor = Obj.NombreBecario;
                //    td.BecarioDirigidoId = Obj.BecarioDirigidoId;
                //    td.ClavePersona = Obj.ClavePersona;
                //    td.EstadoFlujoId = 3;
                //    td.FechaInicio = Obj.FechaInicio;
                //    td.FechaTermino = Obj.FechaTermino;
                //    td.GradoAcademicoId = Obj.TipoBecaId;
                //    td.PalabrasClave = "";
                //    td.Titulo = Obj.NombreEstancia;
                //    td.FechaValidacion = Obj.FechaValidacion;

                //    tesisdirigidaId = await _tesisdirigida.CreateByBecarioDirigido(td);
                //}

                //if (Obj.EstadoFlujoId==1 && (Obj.TipoBecaId == 1 || Obj.TipoBecaId == 2 || Obj.TipoBecaId == 3) && Obj.TesisDirigidaId != null)
                //{
                //    await _tesisdirigida.UpdateEstadoByBecario(Obj.TesisDirigidaId,2);
                //}
                //if (Obj.EstadoFlujoId == 1 && (Obj.TipoBecaId != 1 && Obj.TipoBecaId != 2 && Obj.TipoBecaId != 3) && Obj.TesisDirigidaId != null)
                //{
                //    await _tesisdirigida.UpdateEstadoByBecario(Obj.TesisDirigidaId, 2);
                //}
                //if (Obj.EstadoFlujoId == 3 && (Obj.TipoBecaId == 1 || Obj.TipoBecaId == 2 || Obj.TipoBecaId == 3) && Obj.TesisDirigidaId != null)
                //{
                //    await _tesisdirigida.UpdateByBecario(Obj, 3);
                //}
                //if (Obj.TesisDirigidaId!=null && (Obj.TipoBecaId!=1 && Obj.TipoBecaId!=2 && Obj.TipoBecaId!=3) && Obj.EstadoFlujoId == 3)
                //{
                //    await _tesisdirigida.Delete(Obj.TesisDirigidaId);
                //}
                ////////////////////////////////////////////////
                var result = await _ctx.BecarioDirigido.FirstOrDefaultAsync(e => e.BecarioDirigidoId == Obj.BecarioDirigidoId);
                if (Obj.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("BecarioDirigido", result.BecarioDirigidoId + "");
                }
                if (result != null)
                {
                    //if (Obj.EstadoFlujoId == 3 && (Obj.TipoBecaId == 1 || Obj.TipoBecaId == 2 || Obj.TipoBecaId == 3) && Obj.TesisDirigidaId == null)
                    //{
                    //    Obj.TesisDirigidaId = tesisdirigidaId;
                    //}
                    //if (Obj.TesisDirigidaId != null && (Obj.TipoBecaId != 1 && Obj.TipoBecaId != 2 && Obj.TipoBecaId != 3) && Obj.EstadoFlujoId == 3)
                    //{
                        Obj.TesisDirigidaId = null;
                    //}
                        _ctx.Entry(result).CurrentValues.SetValues(Obj);

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(BecarioDirigido Obj)
        {
            try
            {
                var result = await _ctx.BecarioDirigido.FirstOrDefaultAsync(e => e.BecarioDirigidoId == Obj.BecarioDirigidoId);
                if (result != null)
                {
                    result.EstadoFlujoId = Obj.EstadoFlujoId;

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

        public async Task<BecarioDirigido> GetExistente(BecarioDirigido Obj)
        {
            try
            {
                var result = await _ctx.BecarioDirigido.Where(e => e.NumeroBecario==Obj.NumeroBecario && e.TipoBecaId==Obj.TipoBecaId && e.ClavePersona==Obj.ClavePersona)
                                        //.Include(e => e.EstadoFlujo)
                                        //.Include(e => e.TipoBeca)
                                        //.Include(e => e.Proyecto)
                                        //.Include(e => e.UnidadOrganizacional)
                                        //.Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }




        public async Task<List<int>> GetTituloBec(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioDirigidoId FROM CH.tab_BecarioDirigido where NombreEstancia collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  NombreEstancia collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<BecarioDirigido>> getData(DataServerSide ss)
        {
            try
            {
                //var Interno = await _ctx.BecarioInterno.Where(x => x.BecarioDirigidoId!=null).Select(x => x.BecarioDirigidoId).ToListAsync();
                var v = (from a in _ctx.BecarioDirigido.Where(e => e.EstadoFlujoId == 3)
                        .Include(e => e.TipoBeca)
                        .Include(e => e.Proyecto)
                        //.Where(e=> !Interno.Contains(e.BecarioDirigidoId))

                         select a);

                List<string> clavesP = new List<string>(v.Select(x => x.NumeroBecario));

                List<Personas> Personas = await _gen.dbSetPersonas.Where(x => clavesP.Contains(x.ClavePersona))
                    .AsNoTracking().ToListAsync();
              

                ss.recordsTotal = v.Count();
                //search
                if (!string.IsNullOrEmpty(ss.Autor))
                {
                    v = v.Where(e => e.ClavePersona.Contains(ss.Autor));


                }
                if (!string.IsNullOrEmpty(ss.Becario))
                {
                    v = v.Where(e => e.NumeroBecario.Contains(ss.Becario));
                }


                if (!String.IsNullOrEmpty(ss.Titulo))
                {

                    var listaDA0 = await GetTituloBec(ss.Titulo);
                    v = v.Where(e => e.EstadoFlujoId == 3 && listaDA0.Contains(e.BecarioDirigidoId)
                            
                    );

                }


                //if (!string.IsNullOrEmpty(ss.Titulo))
                //{
                //    var pal = ss.Titulo.Split(' ');
                //    foreach (var pa in pal)
                //    {
                //        var p = pa.ToLower();
                //        v = v.Where(e => (e.EstadoFlujoId == 3 && e.NombreEstancia.Contains(p))
                //            //||e.Proyecto.Nombre.Contains(p)
                //            //|| e.Descripcion.Contains(p))
                //            );
                //    }
                //}

                if (!string.IsNullOrEmpty(ss.proyectoId))
                {
                    v = v.Where(e => e.ProyectoId.ToString().Contains(ss.proyectoId));
                }
                if (!string.IsNullOrEmpty(ss.Tipo))
                {
                    v = v.Where(e => e.TipoBecaId.ToString().Contains(ss.Tipo) );
                }

                //var fecTer = ss.FechaFin.AddHours(23);

                //if (ss.FechaFin > ss.FechaInicio)
                //{
                //    v = v.Where(e => (ss.FechaInicio <= e.FechaInicio) && (e.FechaTermino <= fecTer) );
                //}

                if (!string.IsNullOrEmpty(ss.NuevaFechaInicio) || !string.IsNullOrEmpty(ss.NuevaFechaTermino))
                {

                    var listaDA = await GetPorfecha(ss.NuevaFechaInicio, ss.NuevaFechaTermino);
                    v = v.Where(e => listaDA.Contains(e.BecarioDirigidoId));

                }

                //caja
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    //var pal = ss.searchValue.Split(' ');
                    //foreach (var pa in pal)
                    //{
                    var p = ss.searchValue.ToLower();


                   // PersonasRepository rp = new PersonasRepository();
                   // var clavesPer = await rp.GetAllClavesByLikeNombreLatin1(ss.searchValue);
                    var beca = await GetPorBecaTipo(ss.searchValue);
                    var institucion = await GetPorInstitucion(ss.searchValue);
                    var nombre = await GetPorBecario(ss.searchValue);
                    var estancia = await GetPorEstancia(ss.searchValue);

                    v = v.Where(e => nombre.Contains(e.BecarioDirigidoId)

                    || e.FechaInicio.ToString().Contains(p)
                    || e.FechaTermino.ToString().Contains(p)
                    || e.NombreEstancia.Contains(p)
                    || estancia.Contains(e.BecarioDirigidoId) 

                    || institucion.Contains(e.BecarioDirigidoId)
                    || beca.Contains(e.TipoBecaId) );
                    //}

                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                
                return entities;
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
                var query = "SELECT BecarioDirigidoId FROM CH.tab_BecarioDirigido where FechaInicio >  convert(date,'" + inicio + "',103) and FechaTermino <  convert(date,'" + termino + "',103)";
                var resultados = await _ctx.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetPorBecaTipo(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TipoBecaId FROM CH.cat_TipoBecas where Descripcion collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Descripcion collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetPorInstitucion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioDirigidoId FROM CH.tab_BecarioDirigido where OtorganteBeca collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  OtorganteBeca collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetPorBecario(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioDirigidoId FROM CH.tab_BecarioDirigido where NombreBecario collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  NombreBecario collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetPorEstancia(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecarioDirigidoId FROM CH.tab_BecarioDirigido where NombreEstancia collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  NombreEstancia collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _ctx.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de becarios dirigidos
        /// </summary>
        /// <param name="model"><BecarioDirigido>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(BecarioDirigido model)
        {
            try
            {
                var registros = await _ctx.BecarioDirigido.Where(e => e.ClavePersona == model.ClavePersona 
                            && e.TipoBecaId == model.TipoBecaId
                            && e.NumeroBecario == model.NumeroBecario
                            && e.BecarioDirigidoId!= model.BecarioDirigidoId).AsNoTracking().CountAsync();
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
