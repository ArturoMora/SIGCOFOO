using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CH.Models;
using System.Data.Entity;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.GEN.Util;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class BecarioInternoRepository : IDisposable
    {
        public void Dispose() { _ctx.Dispose(); }
        SIGCOCHContext _ctx;
        GEN_Context _db;

        public BecarioInternoRepository()
        {
            _ctx = new SIGCOCHContext();
            _db = new GEN_Context();
            _ctx.Database.Log = Escribe.Write;
        }
        public BecarioInternoRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        public async Task<IEnumerable<BecarioInterno>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.BecarioInterno.Where(e => e.ClavePersona.Equals(id))
                    .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.BecaInterna)
                                        .Include(e => e.Carrera)
                                        .Include(e => e.Institucion)
                                        .Include(e => e.Pais)
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

        public async Task<IEnumerable<BecarioInterno>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.BecarioInterno.Where(e => e.ClavePersona.Equals(clave) && e.EstadoFlujoId==3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.BecaInterna)
                                        .Include(e => e.Carrera)
                                        .Include(e => e.Institucion)
                                        .Include(e => e.Pais)
                                        .Include(e => e.Adjunto)
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

        public async Task<IEnumerable<BecarioInterno>> GetByEstado()
        {
            try
            {
                var result = await _ctx.BecarioInterno.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.BecaInterna)
                                                        .Include(e => e.Carrera)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.Pais)
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

        public async Task<BecarioInterno> GetById(int id)
        {
            try
            {
                var result = await _ctx.BecarioInterno.Where(e => e.BecarioInternoId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.BecaInterna)
                                        .Include(e => e.Carrera)
                                        .Include(e => e.Institucion)
                                        .Include(e => e.Institucion.Pais)
                                        .Include(e => e.Pais)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();

                if (result.ClavePersona != null)
                {
                    PersonasRepository personarepo = new PersonasRepository();
                    var persona = await personarepo.GetByClave(result.ClavePersona);
                    result.Persona = persona;
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(BecarioInterno BI)
        {
            try
            {
                if (await ValidarDuplicados(BI))
                {
                    throw new ApplicationException("Ya existe un registro con ese nombre. Intente cambiar el tipo de beca o las fecha de inicio o término");
                }
                _ctx.BecarioInterno.Add(BI);
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
                var result = await _ctx.BecarioInterno.FirstOrDefaultAsync(e => e.BecarioInternoId == id);
                if (result != null)
                {
                    _ctx.BecarioInterno.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BecarioInterno BI)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.BecarioInterno.FirstOrDefaultAsync(e => e.BecarioInternoId == BI.BecarioInternoId);
                if (result != null)
                {
                    if (await ValidarDuplicados(BI))
                    {
                        throw new ApplicationException("Ya existe un registro con ese nombre. Intente cambiar el tipo de beca o las fecha de inicio o término");
                    }
                    if (BI.Adjunto != null)
                    {
                        Adjunto key = await new AdjuntoRepository().CreateAd(BI.Adjunto);
                        BI.AdjuntoId = key.AdjuntoId;
                    }
                    _ctx.Entry(result).CurrentValues.SetValues(BI);
                    await _ctx.SaveChangesAsync();

                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(BI.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(BecarioInterno BI)
        {
            try
            {
                var result = await _ctx.BecarioInterno.FirstOrDefaultAsync(e => e.BecarioInternoId == BI.BecarioInternoId);
                if (result != null)
                {
                    result.EstadoFlujoId = BI.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> getData(DataServerSide ss)
        {
            try
            {
                //Consulta que devuelve un objeto IQueryable , para mas informacion : https://stackoverflow.com/questions/1578778/using-iqueryable-with-linq/1578809#1578809
                var data = (from a in _ctx.BecarioInterno.AsNoTracking().Include(e => e.EstadoFlujo).Include(e => e.BecaInterna).Include(e => e.Institucion)
                            select a);
            

                if (!String.IsNullOrEmpty(ss.Tipo)) //Filtrado por estado flujo
                {
                    data = data.Where(x => x.EstadoFlujoId == 3);

                }

                ss.recordsTotal = data.Count();

                if (!String.IsNullOrEmpty(ss.Becario)) //busqueda por clave de empleado (becario)
                {
                    data = data.Where(x => x.ClavePersona.Contains(ss.Becario));
                }

                if (!string.IsNullOrEmpty(ss.Institucion))  //busqueda por institucion
                {
                    var id = Convert.ToInt32(ss.Institucion);
                    data = data.Where(x => x.InstitucionID == id);
                }

                if (ss.TipoBeca != 0)  //Tipo de beca interna
                {
                    data = data.Where(x => x.BecaInternaId == ss.TipoBeca);
                }

                if (!String.IsNullOrEmpty(ss.busquedaFecha))  //busqueda por fecha
                {
                    var fechaInicio = Convert.ToDateTime(ss.NuevaFechaInicio);
                    var fechaTermino = Convert.ToDateTime(ss.NuevaFechaTermino);
                    data = data.Where(x => (DbFunctions.TruncateTime(x.FechaInicioBeca) >= DbFunctions.TruncateTime(fechaInicio)
                                                    && DbFunctions.TruncateTime(x.FechaTerminoBeca) <= DbFunctions.TruncateTime(fechaTermino)));
                }

                //caja
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    var beca = await GetPorBecaTipo(ss.searchValue);
                    var institucion = await GetPorInstitucion(ss.searchValue);
                    var estados = await GetPorEstadoRegistroBusquedaColacion(ss.searchValue);
                    PersonasRepository p = new PersonasRepository();
                    var clavesPersonas = await p.GetAllClavesByLikeNombreLatin1(ss.searchValue);

                    data = data.Where(e => e.FechaInicioBeca.ToString().Contains(ss.searchValue)
                    || e.FechaTerminoBeca.ToString().Contains(ss.searchValue)
                    || beca.Contains(e.BecaInternaId)
                    || institucion.Contains(e.InstitucionID)
                    || estados.Contains(e.EstadoFlujoId)
                    || e.ClavePersona.Contains(ss.searchValue)
                    || clavesPersonas.Contains(e.ClavePersona));
                }

                /**Esta solucion se implenta porque los registros se querian ordenar por el nombre de la persona */
                /**La coleccion de becarios internos no contiene una llave foranea, por lo que desde el inicio no se pueden traer los nombres de las personas */
                /**El objeto IQueryable (la coleccion)  no permite joins entre multiples contextos, por lo que tampoco se puede obtener de manera inicial los nombres*/
                /**La unica manera fue crear multiples objetos que fueran filtrando  la informacion de poco a poco */
                var claves = data.Select(x => x.ClavePersona).ToList();
                var Personas = await _db.dbSetPersonas.Where(x => claves.Contains(x.ClavePersona)).AsNoTracking().ToListAsync();

                //Primero obtenemos los nombres y los agregamos a la coleccion (nota: a un objeto de tipo Iqueryable no se le pueden agregar mas objetos o propiedades, ya que es de solo lectura hasta el momento)
                var tempCollection = data.ToList();
                foreach (var item in tempCollection)
                {
                    var perso = Personas.Find(x => x.ClavePersona == item.ClavePersona);
                    if (perso != null)
                    {
                        item.NombrePersona = perso.NombreCompleto;
                    }
                }

                //Aplicamos el ordenamiento
                IEnumerable<BecarioInterno> lista = new List<BecarioInterno>();
                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    lista = tempCollection.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);  //Ordenamiento con dynamic linq
                    
                }
                //Retornamos datos
                ss.recordsFiltered = lista.Count();
                var entities = lista.Skip(ss.skip).Take(ss.pageSize);


                //NOTA: En caso de que las condiciones del ordenamiento cambien descomentar el siguiente codigo, es mas optimo que el de arriba

                // if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                // {
                //     lista = tempCollection.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                    
                // }

                // var claves = data.Select(x => x.ClavePersona).ToList();
                // var Personas = await _db.dbSetPersonas.Where(x => claves.Contains(x.ClavePersona)).AsNoTracking().ToListAsync();

                // foreach (var item in entities)
                // {
                //    var perso = Personas.Find(x => x.ClavePersona == item.ClavePersona);
                //    if (perso != null)
                //    {
                //        item.NombrePersona = perso.NombreCompleto;
                //    }
                // }

                // ss.recordsFiltered = data.Count();
                // var entities = data.Skip(ss.skip).Take(ss.pageSize);


                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los ids de becarios que coincidan con el asesor buscado [usando collate]
        /// </summary>
        /// <param name="likeNombre">nombre del becario a buscar</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetPorEstadoRegistroBusquedaColacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT EstadoFlujoId FROM GEN.cat_EstadoFlujo where Descripcion collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 53);
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
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

                var query = "SELECT BecarioInternoId FROM CH.tab_BecarioInterno where FechaInicioBeca >  convert(date,'" + inicio + "',103) and FechaTerminoBeca <  convert(date,'" + termino + "',103)";
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene los ids de los tipos de becas que coincidan con el asesor buscado [usando collate]
        /// </summary>
        /// <param name="likeNombre">nombre del tipo de beca por la cual filtrar la informacion</param>
        /// <returns>List<int></returns>
        public async Task<List<int>> GetPorBecaTipo(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT BecaInternaId FROM CH.cat_BecasInternas where Descripcion collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 52);
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
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
                var query = "SELECT InstitucionID FROM CH.cat_Instituciones where Descripcion collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Descripcion collate Latin1_General_CI_AI LIKE '%";
                }
                query = query.Substring(0, query.Length - 52);
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de becarios internos
        /// </summary>
        /// <param name="model"><BecarioInterno>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(BecarioInterno model)
        {
            try
            {
                var registros = await _ctx.BecarioInterno.Where(e => e.ClavePersona == model.ClavePersona
                         && e.BecaInternaId == model.BecaInternaId
                         && DbFunctions.TruncateTime(e.FechaInicioBeca) == DbFunctions.TruncateTime(model.FechaInicioBeca)
                         && DbFunctions.TruncateTime(e.FechaTerminoBeca) == DbFunctions.TruncateTime(model.FechaTerminoBeca)
                         && e.BecarioInternoId != model.BecarioInternoId)
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
