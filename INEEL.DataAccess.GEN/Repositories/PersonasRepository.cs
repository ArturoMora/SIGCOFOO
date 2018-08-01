using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using System.Data.SqlClient;
using System.IO;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Repositories.CH;
using System.Globalization;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class EmpleadoCount
    {
        public string ClaveEmpleado { get; set; }
        public int Total { get; set; }
    }
    public class PersonasRepository : IDisposable
    {

        private GEN_Context _db;

        public PersonasRepository()
        {
            _db = new GEN_Context();
            _db.Database.Log = Escribe.Write;
        }

        public PersonasRepository(GEN_Context ctx)
        {
            _db = ctx;
            //_db.Database.Log = Escribe.Write;
        }
        private IQueryable<EmpleadoCount> getSQLCounts(List<int> aptitudesList, int umbral)
        {
            var counts = (from personAp in _db.bdSetAptitudesEmpleado
                          where aptitudesList.Contains(personAp.AptitudesCatId)
                          group personAp by personAp.ClaveEmpleado into grp
                          where grp.Count() >= umbral
                          select new EmpleadoCount { ClaveEmpleado = grp.Key, Total = grp.Count() });
            return counts;
        }
        private List<int> StringSplitToListInt(String aptitudes)
        {
            var listAptitudes = aptitudes.Split(',');
            List<int> aptitudesList = new List<int>();
            foreach (var a in listAptitudes)
            {
                aptitudesList.Add(int.Parse(a));
            }
            return aptitudesList;
        }
        private IQueryable<Personas> getByAptitudes(String aptitudes, IQueryable<EmpleadoCount> empCounts)
        {

            List<int> aptitudesList = this.StringSplitToListInt(aptitudes);
            var counts = empCounts;
            var aptEmple = counts.ToList();

            var personasId = aptEmple.Select(r => r.ClaveEmpleado).ToList();


            var fechaActual = DateTime.Now;
            var v = (from persona in _db.dbSetPersonas.Include(x => x.TipoPersonal)
                     where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                          p => p.FechaEfectiva <= fechaActual
                                                                          && p.ClavePersona == persona.ClavePersona
                                                                          ).Max(e => e.FechaEfectiva)
                    && personasId.Contains(persona.ClavePersona)
                     select persona);
            return v;
        }

        public async Task<IEnumerable<object>> GetDataFirst(DataServerSide ss)
        {
            try
            {
                var fechaActual = DateTime.Now;

                var v = (from persona in _db.dbSetPersonas.Include(x => x.TipoPersonal)
                         where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                              p => p.FechaEfectiva <= fechaActual
                                                                              && p.ClavePersona == persona.ClavePersona
                                                                              ).Max(e => e.FechaEfectiva)
                         select persona);
                ss.recordsTotal = v.Count();
                if (!String.IsNullOrEmpty(ss.Aptitudes))
                {
                    var listaAptitudes = this.StringSplitToListInt(ss.Aptitudes);
                    v = this.getByAptitudes(ss.Aptitudes, this.getSQLCounts(listaAptitudes, listaAptitudes.Count));
                }


                //fin TODO: pendientes:
                var unidades = new List<UnidadOrganizacional>();
                var idEmpleados = new List<String>();
                UORepository uo = new UORepository();
                TipoPersonalRepository tipoPersonal = new TipoPersonalRepository();
                if (!string.IsNullOrEmpty(ss.palabras))
                {
                    idEmpleados = await GetAllClavesByLikeNombreLatin1(ss.palabras);
                    var idTiposPer = await tipoPersonal.GetIdsByDescription(ss.palabras);

                    var pal = ss.palabras.Split(' ');
                    var clavesUnidades = await uo.GetClavesByLikeNombre(ss.palabras);
                    if (clavesUnidades != null && clavesUnidades.Count > 0)
                    {
                        unidades = new List<UnidadOrganizacional>(await uo.GetAllCollectionMAX(clavesUnidades));
                    }
                    foreach (var p in pal)
                    {
                        var personasOfExtension = await _db.DetallePersonas.AsNoTracking()
                            .Where(x => x.Extension.Contains(p))
                            .Select(x => x.ClaveEmpleado).ToListAsync();

                        v = v.Where(e =>
                        e.ClavePersona.Contains(p)
                        || idEmpleados.Contains(e.ClavePersona)
                        || personasOfExtension.Contains(e.ClavePersona)
                        || e.Correo.Contains(p)
                        || clavesUnidades.Contains(e.ClaveUnidad)
                        || idTiposPer.Contains(e.TipoPersonalId)
                        );
                    }
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.AsNoTracking().ToListAsync();
                List<Object> result = new List<object>();
                if (entities != null)
                {
                    var claves = entities.Select(e => e.ClaveUnidad).ToList<string>();
                    var listaEmpleados = entities.Select(e => e.ClavePersona).ToList<string>();
                    var listaUnid = await uo.GetAllCollectionMAX(claves);

                    if (listaUnid != null && listaUnid.Count > 0)
                    {
                        unidades = new List<UnidadOrganizacional>(listaUnid);
                        var detalles = await _db.DetallePersonas.AsNoTracking()
                            .Where(x => listaEmpleados.Contains(x.ClaveEmpleado)).ToListAsync();

                        foreach (var x in entities)
                        {
                            try
                            {
                                x.nombreUnidad = unidades.Find(e => e.ClaveUnidad == x.ClaveUnidad).NombreUnidad;
                                var person = new DetallePersona();
                                person = detalles.Find(e => e.ClaveEmpleado == x.ClavePersona);
                                x.DetallePersona = person;
                                result.Add(new
                                {
                                    clavePersona = x.ClavePersona,
                                    nombreCompleto = x.NombreCompleto,
                                    nombreUnidad = x.nombreUnidad,
                                    correo = x.Correo,
                                    extension = x.DetallePersona.Extension,
                                    tipoPersonal = x.TipoPersonal.Descripcion,
                                    estado = x.Estado
                                });
                            }
                            catch (Exception e)
                            {

                            }

                        }
                    }

                }
                //ss.palabras = null;


                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Personas>> getData(DataServerSide ss)
        {
            try
            {
                var fechaActual = DateTime.Now;

                var v = (from persona in _db.dbSetPersonas.Include(x => x.TipoPersonal)
                         where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                              p => p.FechaEfectiva <= fechaActual
                                                                              && p.ClavePersona == persona.ClavePersona
                                                                              ).Max(e => e.FechaEfectiva)
                         select persona);
                ss.recordsTotal = v.Count();
                if (!String.IsNullOrEmpty(ss.Aptitudes))
                {
                    var listaAptitudes = this.StringSplitToListInt(ss.Aptitudes);
                    v = this.getByAptitudes(ss.Aptitudes, this.getSQLCounts(listaAptitudes, listaAptitudes.Count));
                }


                //fin TODO: pendientes:
                var unidades = new List<UnidadOrganizacional>();
                var idEmpleados = new List<String>();
                UORepository uo = new UORepository();
                if (!string.IsNullOrEmpty(ss.palabras))
                {
                    idEmpleados = await GetAllClavesByLikeNombreLatin1(ss.palabras);

                    var pal = ss.palabras.Split(' ');
                    var clavesUnidades = await uo.GetClavesByLikeNombre(ss.palabras);
                    if (clavesUnidades != null && clavesUnidades.Count > 0)
                    {
                        unidades = new List<UnidadOrganizacional>(await uo.GetAllCollectionMAX(clavesUnidades));
                    }
                    foreach (var p in pal)
                    {
                        var personasOfExtension = await _db.DetallePersonas.AsNoTracking()
                            .Where(x => x.Extension.Contains(p))
                            .Select(x => x.ClaveEmpleado).ToListAsync();

                        v = v.Where(e =>
                        e.ClavePersona.Contains(p)
                        || idEmpleados.Contains(e.ClavePersona)
                        || personasOfExtension.Contains(e.ClavePersona)
                        || e.Correo.Contains(p)
                        || clavesUnidades.Contains(e.ClaveUnidad)
                        );
                    }
                }
                if (!string.IsNullOrEmpty(ss.searchValue))
                {

                    var clavesUnidades = await uo.GetClavesByLikeNombre(ss.searchValue);
                    if (clavesUnidades != null && clavesUnidades.Count > 0 && unidades.Count < 1)
                    {
                        unidades = new List<UnidadOrganizacional>(await uo.GetAllCollectionMAX(clavesUnidades));
                    }
                    idEmpleados = await GetAllClavesByLikeNombreLatin1(ss.searchValue);

                    var personasOfExtension = await _db.DetallePersonas.AsNoTracking()
                        .Where(x => x.Extension.Contains(ss.searchValue))
                        .Select(x => x.ClaveEmpleado).ToListAsync();
                    if (personasOfExtension == null)
                    {
                        personasOfExtension = new List<string>();
                    }
                    v = v.Where(e =>
                    e.ClavePersona.Contains(ss.searchValue)
                    || idEmpleados.Contains(e.ClavePersona)
                    || personasOfExtension.Contains(e.ClavePersona)
                    || e.Correo.Contains(ss.searchValue)
                    //|| e.Extension.Contains(ss.searchValue)
                    || clavesUnidades.Contains(e.ClaveUnidad)
                    );
                }
                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                if (entities != null)
                {
                    var claves = entities.Select(e => e.ClaveUnidad).ToList<string>();
                    var listaEmpleados = entities.Select(e => e.ClavePersona).ToList<string>();
                    var listaUnid = await uo.GetAllCollectionMAX(claves);

                    if (listaUnid != null && listaUnid.Count > 0)
                    {
                        unidades = new List<UnidadOrganizacional>(listaUnid);
                        var detalles = await _db.DetallePersonas.AsNoTracking()
                            .Where(x => listaEmpleados.Contains(x.ClaveEmpleado)).ToListAsync();

                        foreach (var x in entities)
                        {
                            try
                            {
                                x.nombreUnidad = unidades.Find(e => e.ClaveUnidad == x.ClaveUnidad).NombreUnidad;
                                var person = new DetallePersona();
                                person = detalles.Find(e => e.ClaveEmpleado == x.ClavePersona);
                                x.DetallePersona = person;
                            }
                            catch (Exception e)
                            {

                            }
                        }
                    }

                }
                //ss.palabras = null;
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Recupera todos los empleados que cumplan con por lo menos el 50% de las aptitudes
        /// </summary>
        public async Task<IEnumerable<Object>> GetDataByAptitudes(String aptitudes)
        {
            try
            {
                List<int> aptitudesList = this.StringSplitToListInt(aptitudes);
                int cantidad = aptitudesList.Count;
                var EmpleadosCount = this.getSQLCounts(aptitudesList, aptitudesList.Count / 2);
                var fechaActual = DateTime.Now;
                var personas = await this.getByAptitudes(aptitudes, EmpleadosCount).ToListAsync();
                var conteo = await EmpleadosCount.ToListAsync();
                List<Object> result = new List<object>();
                foreach (var x in conteo)
                {
                    String nombre = "";
                    String clave = "";
                    double porcent = 0.0;
                    Personas p = personas.Find(r => r.ClavePersona == x.ClaveEmpleado);
                    if (p != null)
                    {
                        nombre = p.NombreCompleto;
                        clave = p.ClavePersona;
                        porcent = (100.0 * x.Total) / (cantidad * 1.0);
                    }
                    result.Add(new { Total = x.Total, name = nombre, clave = clave, porcentaje = porcent });
                }
                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Recupera todos los empleados con estado =1, tomando de referencia la fecha actual para la fecha efectiva
        /// </summary>
        public async Task<IEnumerable<Personas>> GetAllMAX()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas //Investigadores
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                                  p => p.FechaEfectiva <= fechaActual
                                                                                  && p.ClavePersona == persona.ClavePersona
                                                                                  ).Max(e => e.FechaEfectiva)
                                      && persona.Estado == 1
                                      select persona).ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Contabiliza todos los empleados con estado =1, tomando de referencia la fecha actual para la fecha efectiva
        /// </summary>
        public async Task<int> ContabilizaNoEmpleados()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas //Investigadores
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                                  p => p.FechaEfectiva <= fechaActual
                                                                                  && p.ClavePersona == persona.ClavePersona
                                                                                  ).Max(e => e.FechaEfectiva)
                                      && persona.Estado == 1
                                      select persona).CountAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Recupera todos los empleados con estado =1, tomando de referencia la fecha actual para la fecha efectiva y la ultima fecha de actualización
        /// </summary>
        public async Task<List<Personas>> GetAllActualizado(DateTime fechaInicio, DateTime fechaTermino)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas //Investigadores
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                                  p => p.FechaEfectiva <= fechaActual
                                                                                  && p.ClavePersona == persona.ClavePersona
                                                                                  ).Max(e => e.FechaEfectiva)
                                      && persona.Estado == 1
                                      select persona)
                                      .Where(x => x.ultimaActualizacion >= fechaInicio && x.ultimaActualizacion < fechaActual)
                                      .ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Recupera todos los empleados de la colleccion HashSet, con estado =1, tomando de referencia la fecha actual para la fecha efectiva
        /// </summary>
        public async Task<IEnumerable<Personas>> GetAllCollectionMAX(HashSet<String> clavesEmpleado)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClavePersona == persona.ClavePersona
                                                                    ).Max(e => e.FechaEfectiva)
                                      && persona.Estado == 1
                                      select persona)
                                      .Where(x => clavesEmpleado.Contains(x.ClavePersona))
                                      .ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Personas>> GetAllCollectionMAXTodos(HashSet<String> clavesEmpleado)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClavePersona == persona.ClavePersona
                                                                    ).Max(e => e.FechaEfectiva)

                                      select persona)
                                      .Where(x => clavesEmpleado.Contains(x.ClavePersona))
                                      .ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Recupera todos los empleados de la colleccion HashSet, recupera personas sin repetir, rescatando el ultimo por fecha efectiva
        /// </summary>
        public async Task<List<Personas>> GetAllCollectionWithoutStatus(HashSet<String> clavesEmpleado)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClavePersona == persona.ClavePersona
                                                                    ).Max(e => e.FechaEfectiva)
                                      select persona)
                                      .Where(x => clavesEmpleado.Contains(x.ClavePersona))
                                      .ToListAsync();


                entities = entities.Distinct(new ComparerPersonasId()).ToList();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Recupera todos los empleados de la colleccion List, recupera personas sin repetir, rescatando el ultimo por fecha efectiva
        /// </summary>
        public async Task<List<Personas>> GetAllCollectionWithoutStatus(List<String> clavesEmpleado)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await (from persona in _db.dbSetPersonas
                                      where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClavePersona == persona.ClavePersona
                                                                    ).Max(e => e.FechaEfectiva)
                                      select persona)
                                      .Where(x => clavesEmpleado.Contains(x.ClavePersona))
                                      .ToListAsync();


                entities = entities.Distinct(new ComparerPersonasId()).ToList();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Personas>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetPersonas.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<String>> GetAllClavesByLikeNombre(String likeNombre)
        {
            try
            {
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => String.Concat(x.Nombre, " ", x.ApellidoPaterno, " ", x.ApellidoMaterno).Contains(likeNombre))
                    .Select(x => x.ClavePersona)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<String>> GetAllClavesByLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var tokens = likeNombre.Split(' ');
                StringBuilder sql = new StringBuilder();
                foreach (var p in tokens)
                {
                    sql.Append(" Concat(Nombre, ' ', ApellidoPaterno, ' ', ApellidoMaterno)  collate  Latin1_General_CI_AI LIKE '%" + p + "%' AND ");
                }
                var query = sql.ToString().Substring(0, sql.ToString().Length - 4);

                var resultados = await _db.Database.SqlQuery<String>
               ("SELECT DISTINCT ClavePersona FROM GEN.cat_Personas where " + query).ToListAsync(); //WHERE ClavePersona like '%"+likeNombre+"%'"
                if (resultados == null)
                {
                    resultados = new List<string>();
                }
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<String>> GetAllPersonasActivasByLikeNombreLatin1(String likeNombre, String whereCondition)
        {
            try
            {
                var x1 = StringComparer.CurrentCulture;
                var x2 = StringComparer.CurrentCultureIgnoreCase;

                var resultados = await _db.Database.SqlQuery<String>
               ("SELECT * FROM GEN.cat_Personas where Concat(Nombre, ' ', ApellidoPaterno, ' ', ApellidoMaterno) collate  Latin1_General_CI_AI LIKE '%@param1%' " + whereCondition).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Personas> GetByRUP(string RUP)
        {
            try
            {
                var rup = await _db.dbSetPersonas.Where(e => e.ClavePersona == RUP).AsNoTracking().FirstOrDefaultAsync();
                return rup;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Personas>> GetUsersByClaveUnidad(string id)
        {
            try
            {
                List<Personas> Lista = new List<Personas>();
                UnidadOrganizacional d = new UnidadOrganizacional();
                DateTime fecha = DateTime.Now;
                //var personas = await _db.dbSetPersonas.GroupBy(e => e.ClavePersona).Select(x=>x.FirstOrDefault()).AsNoTracking().ToListAsync();
                var resultado = await _db.dbSetPersonas
                   .GroupBy(x => x.ClavePersona)
                   .Select(grupo => grupo.OrderByDescending(x => x.FechaEfectiva).FirstOrDefault())
                   .Where(x => x.ClaveUnidad == id && x.Estado == 1)
                   .Include(x => x.Categoria)
                    .AsNoTracking()
                   .ToListAsync();
                foreach (var item in resultado)
                {
                    item.UnidadOrganizacional = (from unidad in _db.dbSetUnidadOrganizacional
                                                 where unidad.ClaveUnidad == item.ClaveUnidad
                                                 orderby unidad.FechaEfectiva descending
                                                 select unidad)
                                                            .FirstOrDefault();
                }
                return resultado;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Personas>> GetUsersByClaveUnidadPadre(string id)
        {
            try
            {

                var unidadesHijas =
                    await _db.dbSetUnidadOrganizacional.Where(e => e.padre == id && e.Estado == 1).OrderByDescending(e => e.FechaEfectiva).Select(e => e.ClaveUnidad).AsNoTracking().ToListAsync();

                var resultado = await _db.dbSetPersonas
                   .GroupBy(x => x.ClavePersona)
                   .Select(grupo => grupo.OrderByDescending(x => x.FechaEfectiva).FirstOrDefault())
                   .Where(x => x.ClaveUnidad == id && x.Estado == 1 || (x.Estado == 1 && x.TipoPersonalId == "MAN" && unidadesHijas.Contains(x.ClaveUnidad)))
                   .Include(x => x.Categoria)
                    .AsNoTracking()
                   .ToListAsync();
                foreach (var item in resultado)
                {
                    item.UnidadOrganizacional = (from unidad in _db.dbSetUnidadOrganizacional
                                                 where unidad.ClaveUnidad == item.ClaveUnidad
                                                 orderby unidad.FechaEfectiva descending
                                                 select unidad)
                                                            .FirstOrDefault();
                }
                return resultado;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Personas>> GetAllUsersEjecutivo()
        {
            try
            {
                var resultado = await _db.dbSetPersonas
                     .GroupBy(x => x.ClavePersona)
                     .Select(grupo => grupo.OrderByDescending(x => x.FechaEfectiva).FirstOrDefault())
                     .Where(x => x.Estado == 1)
                     .Include(x => x.Categoria)
                      .AsNoTracking()
                     .ToListAsync();

                List<string> clavesUnidades = new List<string>(resultado.Select(x => x.ClaveUnidad).ToList());
                List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                    .Where(x => clavesUnidades.Contains(x.ClaveUnidad))
                    .GroupBy(x => x.ClaveUnidad)
                    .Select(grupo => grupo.OrderByDescending(x => x.FechaEfectiva).FirstOrDefault())
                    .AsNoTracking()
                    .ToListAsync();

                foreach (var item in resultado)
                {
                    item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                    //item.UnidadOrganizacional = (from unidad in _db.dbSetUnidadOrganizacional
                    //                             where unidad.ClaveUnidad == item.ClaveUnidad
                    //                             orderby unidad.FechaEfectiva descending
                    //                             select unidad)
                    //                                        .FirstOrDefault();
                }
                return resultado;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllForModal()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await _db.dbSetPersonas.AsNoTracking()
                .Where(x =>
                x.FechaEfectiva == (from persona in _db.dbSetPersonas
                                    where persona.ClavePersona == x.ClavePersona
                                    && persona.FechaEfectiva <= fechaActual
                                    select persona).Max(e => e.FechaEfectiva))
                .Select(x => new
                {
                    ClavePersona = x.ClavePersona,
                    NombreCompleto = String.Concat(x.Nombre, " ", x.ApellidoPaterno, " ", x.ApellidoMaterno),
                    ClaveUnidad = x.ClaveUnidad,
                    TipoContratoId = x.TipoContratoId,
                    Estado = x.Estado
                })
                .ToListAsync();
                //entities = entities.Distinct(new ComparerPersonasId()).ToList();
                return entities;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllForModalActivos()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.Estado == 1)
                .Where(x =>
                x.FechaEfectiva == (from persona in _db.dbSetPersonas
                                    where persona.ClavePersona == x.ClavePersona
                                    && persona.FechaEfectiva <= fechaActual
                                    select persona).Max(e => e.FechaEfectiva))
                .Select(x => new
                {
                    ClavePersona = x.ClavePersona,
                    NombreCompleto = String.Concat(x.Nombre, " ", x.ApellidoPaterno, " ", x.ApellidoMaterno),
                    ClaveUnidad = x.ClaveUnidad,
                    TipoContratoId = x.TipoContratoId,
                    Estado = x.Estado
                })
                .ToListAsync();
                //entities = entities.Distinct(new ComparerPersonasId()).ToList();
                return entities;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Personas>> GetPersonas(String id, String nombreCompleto)
        {
            try
            {
                if (!String.IsNullOrEmpty(id))
                {
                    id = id.ToLower();
                    var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona.ToLower().Contains(id))
                    .Where(x => x.Estado == 1)
                    .ToListAsync();
                    entities = entities.Distinct(new ComparerPersonasId()).ToList();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombreCompleto))
                {

                    var Claves = await GetAllClavesByLikeNombreLatin1(nombreCompleto);
                    var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.Estado == 1 && Claves.Contains(x.ClavePersona))
                    .OrderByDescending(e => e.FechaEfectiva)
                    .ToListAsync();
                    entities = entities.Distinct(new ComparerPersonasId()).ToList();

                    return entities;
                }
                else return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Personas>> GetPersonasActivas(String id, String nombreCompleto)
        {
            try
            {
                if (!String.IsNullOrEmpty(id))
                {
                    id = id.ToLower();
                    var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona.ToLower().Contains(id))
                    .Where(x => x.Estado == 1)
                    .Where(x =>
                    x.FechaEfectiva == (from persona in _db.dbSetPersonas
                                        where persona.ClavePersona == x.ClavePersona
                                        && persona.FechaEfectiva <= DateTime.Now
                                        select persona).Max(e => e.FechaEfectiva))
                    .ToListAsync();
                    entities = entities.Distinct(new ComparerPersonasId()).ToList();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombreCompleto))
                {

                    var Claves = await GetAllClavesByLikeNombreLatin1(nombreCompleto);
                    var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.Estado == 1 && Claves.Contains(x.ClavePersona))
                    .Where(x =>
                    x.FechaEfectiva == (from persona in _db.dbSetPersonas
                                        where persona.ClavePersona == x.ClavePersona
                                        && persona.FechaEfectiva <= DateTime.Now
                                        select persona).Max(e => e.FechaEfectiva))
                    .OrderByDescending(e => e.FechaEfectiva)
                    .ToListAsync();
                    entities = entities.Distinct(new ComparerPersonasId()).ToList();

                    return entities;
                }
                else return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Personas>> GetPersonasEspecialista(string unidad, int especialista)
        {
            try
            {
                var clavesEspecialistas = await (from rows in _db.dbSetRolPersona
                                                 where rows.IdRol == especialista
                                                 select rows.ClavePersona).ToListAsync();

                var entities = await _db.dbSetPersonas.AsNoTracking()
                  .Where(x => x.Estado == 1 && x.ClaveUnidad == unidad && !clavesEspecialistas.Contains(x.ClavePersona)
                  && x.FechaEfectiva == (from persona in _db.dbSetPersonas
                                         where persona.ClavePersona == x.ClavePersona
                                         && persona.FechaEfectiva <= DateTime.Now
                                         select persona).Max(e => e.FechaEfectiva))
                  .OrderByDescending(e => e.FechaEfectiva)
                  .ToListAsync();

                entities = entities.Distinct(new ComparerPersonasId()).ToList();


                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Roles> GetFullRolByID(int idRol, string modulo, int rolbase)
        {
            try
            {
                var tabRoles = await _db.dbSetRoles.AsNoTracking()
                    .Where(e => e.Estado == 1)
                    .FirstOrDefaultAsync(e => e.RolId == idRol);

                var funcionesbase = await _db.dbSetRoles.AsNoTracking()
                    .Where(e => e.Estado == 1)
                    .FirstOrDefaultAsync(e => e.RolId == rolbase);

                tabRoles.Funciones = await _db.dbSetFuncionesRol
                    .Where(e => e.Estado == 1
                    && e.Funcion.Estado == 1
                    && e.Funcion.IdModulo == modulo
                    && e.IdRol == idRol)
                    .Include(e => e.Funcion.Children)
                    .AsNoTracking()
                    .ToListAsync();
                funcionesbase.Funciones = await _db.dbSetFuncionesRol
                   .Where(e => e.Estado == 1
                   && e.Funcion.Estado == 1
                   && e.Funcion.IdModulo == modulo
                   && e.IdRol == rolbase)
                   .Include(e => e.Funcion.Children)
                   .AsNoTracking()
                   .ToListAsync();


                if (idRol != rolbase)
                    tabRoles.Funciones.AddRange(funcionesbase.Funciones);
                tabRoles.Funciones = tabRoles.Funciones.OrderBy(e => e.Funcion.Secuencia).ThenBy(x => x.Funcion.Nombre)
                    .GroupBy(e => e.IdFuncion)
                    .Select(e => e.First()).ToList();

                return tabRoles;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public async Task<IEnumerable<EdadPromedio>> GetPersonasEdadPromedio(string id)
        //{
        //    try
        //    {
        //        string[] fecha = id.Split('-');
        //        id = fecha[1]+"/" + fecha[0] +"/"+ fecha[2];
        //        List<EdadPromedio> Result = new List<EdadPromedio>();
        //        int anio = Convert.ToInt32(fecha[2]);
        //        DateTime Termino;
        //        for (int i = 2006; i <= anio; i++)
        //        {
        //            if (i== anio) {

        //                Termino = Convert.ToDateTime(id);
        //            }
        //            else
        //            {

        //                Termino = Convert.ToDateTime("31/12/" + i);
        //            }


        //                var personas = await _db.dbSetPersonas
        //                    .Where(e =>e.FechaEfectiva <= Termino)
        //                    .AsNoTracking().ToListAsync();



        //                List<CatInvestigadores> lista = new List<CatInvestigadores>();
        //                foreach (var item in personas)
        //                {
        //                    lista.Add(new CatInvestigadores
        //                    {
        //                        Persona = item,
        //                        Fecha=Convert.ToDateTime(id)
        //                    });
        //                }
        //                decimal edad = lista.Sum(e => e.Edad) / lista.Count;
        //                edad = Math.Round(edad, 2);
        //                Result.Add(new EdadPromedio {
        //                    x = i,
        //                    y = edad,
        //                    indexLabel = "" + edad
        //                });


        //        }
        //        return Result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}
        public async Task<Personas> GetByRU(string ru, int rolbase)
        {
            try
            {
                var clavepersona = _db.dbSetAcceso.Where(e => e.UserName == ru)
                    .Select(e => e.ClavePersona)
                    .FirstOrDefault();
                var persona = new Personas();

                if (!(clavepersona == null || clavepersona == string.Empty))
                {
                    DateTime fecha = DateTime.Now;
                    persona = await _db.dbSetPersonas
                          .Where(e => e.ClavePersona.Equals(clavepersona)
                          && e.FechaEfectiva == _db.dbSetPersonas.Where(
                              p => p.FechaEfectiva <= fecha
                              && p.ClavePersona == clavepersona
                              ).Max(f => f.FechaEfectiva)
                          && e.Estado == 1)
                          .Include(e => e.Categoria)
                          .Include(e => e.TipoPersonal)
                          .AsNoTracking()
                          .FirstOrDefaultAsync();
                    if (persona != null)
                    {

                        //Obetener la unidad organizacional a la que pertenece
                        persona.UnidadOrganizacional = (from unidad in _db.dbSetUnidadOrganizacional
                                                        where unidad.ClaveUnidad == persona.ClaveUnidad
                                                        && unidad.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                                    .Where(e => e.FechaEfectiva <= fecha
                                                                                    && e.ClaveUnidad == persona.ClaveUnidad)
                                                                                    .Max(f => f.FechaEfectiva)
                                                        select unidad)
                                                        .FirstOrDefault();
                        // obtenr lista de roles activos 
                        persona.Roles = (from rol in _db.dbSetRolPersona
                                         where rol.ClavePersona.Equals(clavepersona)
                                         where rol.Estado == 1
                                                && rol.Rol.Estado == 1
                                         select rol).Include("Rol").ToList();

                        if (persona.Roles.Count == 0)
                        {
                            var rolinvestigador = (from rol in _db.dbSetRolPersona
                                                   where rol.IdRol == rolbase
                                                   && rol.Estado == 1
                                                   select rol).Include("Rol").FirstOrDefault();
                            rolinvestigador.ClavePersona = persona.ClavePersona;

                            persona.Roles.Add(rolinvestigador);
                        }

                        //eliminar el rol base 
                        if (persona.Roles.Count > 1)
                            persona.Roles = persona.Roles
                                 .Where(e => e.Rol.RolId != rolbase).ToList();
                    }


                }

                return persona;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene los datos del empleado considerando la fecha efectiva, con estado igual a 1</summary>
        public async Task<Personas> GetByClave(string clave)
        {
            return await new PersonasRepositorySupport(_db).GetByClave(clave);

        }

        public async Task<Personas> GetByClaveFechaEfectiva(string clave)
        {
            return await new PersonasRepositorySupport(_db).GetByClaveFechaEfectiva(clave);

        }



        public async Task<String> getImagePathByIdAdjunto(long clave)
        {
            try
            {
                AdjuntoRepository repo = new AdjuntoRepository();
                var adjunto = await repo.GetAsync(clave);
                if (adjunto == null)
                {
                    return null;
                }
                return adjunto.RutaCompleta;
            }
            catch (Exception e) { /*throw new Exception("not found");*/ return null; }
        }


        public async Task<CatInvestigadores> GetByClaveGestionFichaUno(string clave)
        {
            Personas resultado = await _db.dbSetPersonas
                   .Where(x => x.ClavePersona == clave)
                   .OrderByDescending(e => e.FechaEfectiva)
                   .Include(x => x.Categoria)
                   .AsNoTracking()
                   .FirstOrDefaultAsync();

            UnidadOrganizacional UO = await _db.dbSetUnidadOrganizacional
                .Where(x => x.ClaveUnidad == resultado.ClaveUnidad)
                .OrderByDescending(e => e.FechaEfectiva)
                .AsNoTracking().FirstOrDefaultAsync();

            resultado.UnidadOrganizacional = UO;

            CatInvestigadores aux = new CatInvestigadores();
            aux.Persona = resultado;
            DateTime thisDay = DateTime.Today;
            aux.Fecha = thisDay;

            return aux;

        }

        public async Task<IEnumerable<CatInvestigadores>> GetByClaveGestionFicha(string clave)
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();
            List<Personas> resultado = await _db.dbSetPersonas
                   .Where(x => x.ClavePersona.Contains(clave) && x.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == x.ClavePersona
                        ).Max(e => e.FechaEfectiva))
                   .Include(x => x.Categoria)
                   .AsNoTracking()
                   .ToListAsync();


            List<String> UnidadId = new List<string>(resultado.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       //.Where(x => UnidadId.Contains(x.ClaveUnidad))
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in resultado)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }
            return Lista;

        }

        public async Task<IEnumerable<CatInvestigadores>> GetByClaveGestionFichaPersonalInvestigador(string clave)
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();
            List<Personas> resultado = await _db.dbSetPersonas
                   .Where(x => x.ClavePersona.Contains(clave) && x.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == x.ClavePersona
                        ).Max(e => e.FechaEfectiva) && (x.TipoPersonalId != null && (x.TipoPersonalId.Equals("INV") || x.TipoPersonalId.Equals("MAN"))))
                   .Include(x => x.Categoria)
                   .AsNoTracking()
                   .ToListAsync();


            List<String> UnidadId = new List<string>(resultado.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       //.Where(x => UnidadId.Contains(x.ClaveUnidad))
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in resultado)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }
            return Lista;

        }

        public async Task<IEnumerable<CatInvestigadores>> GetByClaveGestionFichaPersonalSindicalizado(string clave)
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();
            List<Personas> resultado = await _db.dbSetPersonas
                   .Where(x => x.ClavePersona.Contains(clave) && x.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == x.ClavePersona
                        ).Max(e => e.FechaEfectiva) && (x.TipoPersonalId != null && (x.TipoPersonalId.Equals("ADM") || x.TipoPersonalId.Equals("SIN")))
                        )
                   .Include(x => x.Categoria)
                   .AsNoTracking()
                   .ToListAsync();


            List<String> UnidadId = new List<string>(resultado.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       //.Where(x => UnidadId.Contains(x.ClaveUnidad))
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in resultado)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }
            return Lista;

        }

        public async Task<IEnumerable<CatInvestigadores>> GetByNombreGestionFichaPersonalInvestigador(string nombre)
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();

            List<Personas> resultado = await _db.dbSetPersonas
                   .Where(x => x.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == x.ClavePersona
                        ).Max(e => e.FechaEfectiva) && (x.TipoPersonalId != null && (x.TipoPersonalId.Equals("INV") || x.TipoPersonalId.Equals("MAN"))))
                   .Include(x => x.Categoria)
                   .AsNoTracking()
                   .ToListAsync();
            //List<Personas> resultado = await _db.dbSetPersonas
            //     .GroupBy(x => x.ClavePersona)
            //     .Select(x => x.Where(f => f.FechaEfectiva == _db.dbSetPersonas.Where(
            //                                            p => p.FechaEfectiva <= fechaActual
            //                                            && p.ClavePersona == f.ClavePersona
            //                                            ).Max(e => e.FechaEfectiva)
            //            && (f.TipoPersonalId != null && (f.TipoPersonalId.Equals("INV") || f.TipoPersonalId.Equals("MAN")))
            //            ).FirstOrDefault()
            //     )
            //     .Include(x => x.Categoria)
            //         //.Select(x => x.OrderByDescending(y => y.FechaEfectiva).FirstOrDefault())
            //         .AsNoTracking().ToListAsync();

            List<Personas> aux = new List<Personas>();
            var cadena = nombre.ToLower();
            if (cadena.Contains('á')) { cadena = cadena.Replace('á', 'a'); }
            if (cadena.Contains('é')) { cadena = cadena.Replace('é', 'e'); }
            if (cadena.Contains('í')) { cadena = cadena.Replace('í', 'i'); }
            if (cadena.Contains('ó')) { cadena = cadena.Replace('ó', 'o'); }
            if (cadena.Contains('ú')) { cadena = cadena.Replace('ú', 'u'); }
            foreach (var item in resultado)
            {
                var nombreAux = item.NombreCompleto.ToLower();
                if (nombreAux.Contains('á')) { nombreAux = nombreAux.Replace('á', 'a'); }
                if (nombreAux.Contains('é')) { nombreAux = nombreAux.Replace('é', 'e'); }
                if (nombreAux.Contains('í')) { nombreAux = nombreAux.Replace('í', 'i'); }
                if (nombreAux.Contains('ó')) { nombreAux = nombreAux.Replace('ó', 'o'); }
                if (nombreAux.Contains('ú')) { nombreAux = nombreAux.Replace('ú', 'u'); }

                if (nombreAux.Contains(cadena))
                {
                    aux.Add(item);
                }
            }

            List<String> UnidadId = new List<string>(aux.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       //.Where(x => UnidadId.Contains(x.ClaveUnidad))
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in aux)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }


            return Lista;
        }


        public async Task<IEnumerable<CatInvestigadores>> GetByNombreGestionFichaPersonalSindicalizado(string nombre)
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();

            List<Personas> resultado = await _db.dbSetPersonas
                   .Where(x => x.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == x.ClavePersona
                        ).Max(e => e.FechaEfectiva) && (x.TipoPersonalId != null && (x.TipoPersonalId.Equals("SIN") || x.TipoPersonalId.Equals("ADM"))))
                   .Include(x => x.Categoria)
                   .AsNoTracking()
                   .ToListAsync();
            // List<Personas> resultado = await _db.dbSetPersonas
            //      .GroupBy(x => x.ClavePersona)
            //      .Select(x => x.Where(f => f.FechaEfectiva == _db.dbSetPersonas.Where(
            //                                             p => p.FechaEfectiva <= fechaActual
            //                                             && p.ClavePersona == f.ClavePersona
            //                                             ).Max(e => e.FechaEfectiva)
            //             && (f.TipoPersonalId != null && (f.TipoPersonalId.Equals("SIN") || f.TipoPersonalId.Equals("ADM")))
            //             ).FirstOrDefault()
            //      )
            //      .Include(x => x.Categoria)
            //          //.Select(x => x.OrderByDescending(y => y.FechaEfectiva).FirstOrDefault())
            //          .AsNoTracking().ToListAsync();

            List<Personas> aux = new List<Personas>();
            var cadena = nombre.ToLower();
            if (cadena.Contains('á')) { cadena = cadena.Replace('á', 'a'); }
            if (cadena.Contains('é')) { cadena = cadena.Replace('é', 'e'); }
            if (cadena.Contains('í')) { cadena = cadena.Replace('í', 'i'); }
            if (cadena.Contains('ó')) { cadena = cadena.Replace('ó', 'o'); }
            if (cadena.Contains('ú')) { cadena = cadena.Replace('ú', 'u'); }
            foreach (var item in resultado)
            {
                var nombreAux = item.NombreCompleto.ToLower();
                if (nombreAux.Contains('á')) { nombreAux = nombreAux.Replace('á', 'a'); }
                if (nombreAux.Contains('é')) { nombreAux = nombreAux.Replace('é', 'e'); }
                if (nombreAux.Contains('í')) { nombreAux = nombreAux.Replace('í', 'i'); }
                if (nombreAux.Contains('ó')) { nombreAux = nombreAux.Replace('ó', 'o'); }
                if (nombreAux.Contains('ú')) { nombreAux = nombreAux.Replace('ú', 'u'); }

                if (nombreAux.Contains(cadena))
                {
                    aux.Add(item);
                }
            }

            List<String> UnidadId = new List<string>(aux.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       //.Where(x => UnidadId.Contains(x.ClaveUnidad))
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in aux)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }


            return Lista;
        }

        public async Task<IEnumerable<CatInvestigadores>> GetByNombreGestionFicha(string clave)
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();

            List<Personas> resultado = await _db.dbSetPersonas
                 .GroupBy(x => x.ClavePersona)
                 .Select(x => x.Where(f => f.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == f.ClavePersona
                        ).Max(e => e.FechaEfectiva)).FirstOrDefault()
                 )
                 .Include(x => x.Categoria)
                     //.Select(x => x.OrderByDescending(y => y.FechaEfectiva).FirstOrDefault())
                     .AsNoTracking().ToListAsync();

            List<Personas> aux = new List<Personas>();
            var cadena = clave.ToLower();
            if (cadena.Contains('á')) { cadena = cadena.Replace('á', 'a'); }
            if (cadena.Contains('é')) { cadena = cadena.Replace('é', 'e'); }
            if (cadena.Contains('í')) { cadena = cadena.Replace('í', 'i'); }
            if (cadena.Contains('ó')) { cadena = cadena.Replace('ó', 'o'); }
            if (cadena.Contains('ú')) { cadena = cadena.Replace('ú', 'u'); }
            foreach (var item in resultado)
            {
                var nombreAux = item.NombreCompleto.ToLower();
                if (nombreAux.Contains('á')) { nombreAux = nombreAux.Replace('á', 'a'); }
                if (nombreAux.Contains('é')) { nombreAux = nombreAux.Replace('é', 'e'); }
                if (nombreAux.Contains('í')) { nombreAux = nombreAux.Replace('í', 'i'); }
                if (nombreAux.Contains('ó')) { nombreAux = nombreAux.Replace('ó', 'o'); }
                if (nombreAux.Contains('ú')) { nombreAux = nombreAux.Replace('ú', 'u'); }

                if (nombreAux.Contains(cadena))
                {
                    aux.Add(item);
                }
            }

            List<String> UnidadId = new List<string>(aux.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       //.Where(x => UnidadId.Contains(x.ClaveUnidad))
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in aux)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }


            return Lista;
        }

        public async Task<IEnumerable<CatInvestigadores>> GetAllGestionFicha()
        {
            var fechaActual = DateTime.Now;
            List<CatInvestigadores> Lista = new List<CatInvestigadores>();

            List<Personas> resultado = await _db.dbSetPersonas
                 .GroupBy(x => x.ClavePersona)
                    .Select(x => x.Where(f => f.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == f.ClavePersona
                        ).Max(e => e.FechaEfectiva)).FirstOrDefault()
                 )
                     .AsNoTracking().ToListAsync();

            List<String> UnidadId = new List<string>(resultado.Select(x => x.ClaveUnidad));

            List<UnidadOrganizacional> Unidades = await _db.dbSetUnidadOrganizacional
                       .Where(x => UnidadId.Contains(x.ClaveUnidad) && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                       .AsNoTracking().ToListAsync();
            foreach (var item in resultado)
            {
                item.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == item.ClaveUnidad);
                CatInvestigadores catAux = new CatInvestigadores();
                catAux.Persona = item;
                DateTime thisDay = DateTime.Today;
                catAux.Fecha = thisDay;
                Lista.Add(catAux);
            }
            return Lista;
        }
        /// <summary>
        /// Obtiene los datos del empleado considerando la fecha efectiva, SIN CONSIDERAR EL ESTADO</summary>
        public async Task<Personas> GetByClaveWithoutStatus(string clave)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona == clave && x.FechaEfectiva == _db.dbSetPersonas.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClavePersona == x.ClavePersona
                        ).Max(e => e.FechaEfectiva))
                    //.OrderByDescending(e => e.FechaEfectiva)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene los datos del empleado considerando la fecha efectiva, SIN CONSIDERAR EL ESTADO</summary>
        public async Task<Personas> GetResponsableByClaveUnidadWithoutStatus(string idUnidad)
        {
            try
            {
                var unidad = await new UORepository(_db).UnidadActualWithoutStatus(idUnidad);
                if (unidad == null)
                    return null;

                var responsable = await this.GetByClaveWithoutStatus(unidad.ClaveResponsable);
                return responsable;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene los datos del empleado considerando la fecha efectiva, SIN CONSIDERAR EL ESTADO</summary>
        public async Task<Personas> GetResponsableByClaveUnidadWithoutStatus(UnidadOrganizacional unidad)
        {
            try
            {
                if (unidad == null)
                    return null;

                var responsable = await this.GetByClaveWithoutStatus(unidad.ClaveResponsable);
                return responsable;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene los datos de la UnidadOrganizacional considerando la fecha efectiva, SIN CONSIDERAR EL ESTADO</summary>
        public async Task<UnidadOrganizacional> GetUnidadOrgByClaveWithoutStatus(string idUnidad)
        {
            try
            {
                var unidad = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => x.ClaveUnidad == idUnidad)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .FirstOrDefaultAsync();
                return unidad;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Personas>> GetByArea(string clavearea)
        {
            try
            {
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClaveUnidad == clavearea)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Personas> GetById(string id)
        {
            try
            {
                var fechaActual = DateTime.Now;
                //var entities = await _db.dbSetPersonas.AsNoTracking()
                //    .FirstOrDefaultAsync(e => e.ClavePersona == id);
                var entitie = await (from persona in _db.dbSetPersonas //Investigadores
                                     where persona.ClavePersona == id && persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                                 p => p.FechaEfectiva <= fechaActual
                                                                                 && p.ClavePersona == persona.ClavePersona
                                                                                 ).Max(e => e.FechaEfectiva)
                                     select persona).FirstOrDefaultAsync();

                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Personas> GetByIdFichaPersonal(string clavepersona)
        {
            try
            {
                string clave = new string('0', 5 - (clavepersona.Length)) + clavepersona;
                clavepersona = clave;
                var entities = await _db.dbSetPersonas
                    .Where(e => e.ClavePersona.Equals(clavepersona))
                          .OrderByDescending(e => e.FechaEfectiva)
                          .Include(e => e.Categoria)
                          .Include(e => e.TipoPersonal)
                          .AsNoTracking()
                          .FirstOrDefaultAsync();

                //Obetener la unidad organizacional a la que pertenece
                entities.UnidadOrganizacional = (from unidad in _db.dbSetUnidadOrganizacional
                                                 where unidad.ClaveUnidad == entities.ClaveUnidad
                                                 orderby unidad.FechaEfectiva descending
                                                 select unidad)
                                                .FirstOrDefault();
                //obtener la unidad organizacional padre
                entities.UnidadOrganizacional.ClaveUnidadPadre = (from unidad in _db.dbSetUnidadOrganizacional
                                                                  where unidad.ClaveUnidad == entities.UnidadOrganizacional.padre
                                                                  orderby unidad.FechaEfectiva descending
                                                                  select unidad)
                                                .FirstOrDefault();
                // obtener los detalles de la persona 
                entities.DetallePersona = await _db.DetallePersonas
                    .Where(e => e.ClaveEmpleado == entities.ClavePersona)
                    .Include(e => e.Adjunto)
                    .FirstOrDefaultAsync();

                //se agrega ruta de imagen
                if (entities.DetallePersona != null && entities.DetallePersona.Adjunto != null)
                {
                    try
                    {
                        var archivo = entities.DetallePersona.Adjunto.RutaCompleta;

                        Byte[] bytes = File.ReadAllBytes(archivo);
                        String file = Convert.ToBase64String(bytes);
                        entities.Adjunto64 = file;
                    }
                    catch (Exception e)
                    {
                        entities.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
                    }

                }
                else { entities.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg=="; }


                //if (entities.Estado == 0) {

                //    TimeSpan dif = entities.FechaEfectiva - entities.FechaIngreso;
                //    decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                //    entities.Antiguedad = ret;
                //}



                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Personas model)
        {
            try
            {
                _db.dbSetPersonas.Add(model);
                await _db.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Personas model)
        {
            try
            {
                var _model = await _db.dbSetPersonas
                    .Where(x => x.ClavePersona == model.ClavePersona && model.FechaEfectiva == x.FechaEfectiva)
                    .FirstOrDefaultAsync();
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
        public async Task<string> ObtenerFotobyIdAdjunto(long idAdjunto)
        {
            try
            {
                String file = string.Empty;

                if (true)
                {
                    var _adjunto = await _db.dbSetAdjuntos
                       .Where(x => x.AdjuntoId == idAdjunto)
                       .FirstOrDefaultAsync();

                    var archivo = _adjunto.RutaCompleta;

                    Byte[] bytes = File.ReadAllBytes(archivo);
                    file = Convert.ToBase64String(bytes);
                }

                return file;
            }
            catch (Exception e)
            {
                return null;
            }

        }
        public async Task<string> ObtenerFotobyclavepersona(string clavepersona)
        {
            try
            {
                String file = string.Empty;
                var persona = await _db.DetallePersonas
                    .Where(e => e.ClaveEmpleado == clavepersona)
                          .AsNoTracking()
                          .FirstOrDefaultAsync();

                if (persona.AdjuntoId != null)
                {
                    var _adjunto = await _db.dbSetAdjuntos
                       .Where(x => x.AdjuntoId == persona.AdjuntoId)
                       .FirstOrDefaultAsync();

                    var archivo = _adjunto.RutaCompleta;

                    Byte[] bytes = File.ReadAllBytes(archivo);
                    file = Convert.ToBase64String(bytes);
                }
                else
                {
                    file = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
                }
                return file;
            }
            catch (Exception e)
            {
                return "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
            }

        }


        public async Task<Personas> EliminaFoto(Personas model)
        {
            try
            {
                var _personadetalle = await _db.DetallePersonas
                    .Where(x => x.ClaveEmpleado == model.ClavePersona)
                    .Include(e => e.Adjunto)
                    .FirstOrDefaultAsync();
                if (_personadetalle != null)
                {
                    _personadetalle.AdjuntoId = null;
                    await _db.SaveChangesAsync();
                }
                model.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";

                return model;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Personas> GuardarFoto(Personas model)
        {
            try
            {
                var _personadetalle = await _db.DetallePersonas
                    .Where(x => x.ClaveEmpleado == model.ClavePersona)
                    .Include(e => e.Adjunto)
                    .FirstOrDefaultAsync();

                if (_personadetalle != null && _personadetalle.AdjuntoId != null)
                {

                    var _adjunto = await _db.dbSetAdjuntos
                   .Where(x => x.AdjuntoId == _personadetalle.AdjuntoId)
                   .FirstOrDefaultAsync();
                    model.DetallePersona.Adjunto.AdjuntoId = _adjunto.AdjuntoId;

                    _db.Entry(_adjunto).CurrentValues.SetValues(model.DetallePersona.Adjunto);
                    await _db.SaveChangesAsync();
                }
                else
                {
                    model.DetallePersona.ClaveEmpleado = model.ClavePersona;
                    if (_personadetalle == null)
                    {
                        _db.DetallePersonas.Add(model.DetallePersona);
                    }
                    else
                    {
                        _personadetalle.Adjunto = model.DetallePersona.Adjunto;
                    }
                    await _db.SaveChangesAsync();
                }

                var archivo = model.DetallePersona.Adjunto.RutaCompleta;

                Byte[] bytes = File.ReadAllBytes(archivo);
                String file = Convert.ToBase64String(bytes);
                model.Adjunto64 = file;
                return model;

            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task Delete(string id)
        {
            try
            {
                var _model = await _db.dbSetPersonas.FirstOrDefaultAsync(e => e.ClavePersona == id);
                if (_model != null)
                {
                    _db.dbSetPersonas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Personas obj)
        {
            try
            {
                var _obj = await _db.dbSetPersonas.FirstOrDefaultAsync(e => e.ClavePersona == obj.ClavePersona);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task updateUserExperience(Personas obj)
        {
            try
            {
                var _obj = await _db.dbSetPersonas.FirstOrDefaultAsync(e => e.ClavePersona == obj.ClavePersona && e.FechaEfectiva == obj.FechaEfectiva);
                if (_obj != null)
                {
                    _obj.ExperienciaPrevia = obj.ExperienciaPrevia;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>  
        /// Recupera una lista de claves de persona que pertenecen a la Red de contactos, dado la lista de sub programas.
        /// Se consulta en partiticipación por proyecto y la lista incluye al mismo usurio dada la clavePersona
        /// </summary>  
        /// <returns></returns>  
        public async Task<IEnumerable<String>> getRed(String clavePersona, List<String> subprogramas)
        {


            try
            {
                var ProyectosIdPP = await _db.dbSetPersonalProyectos.AsNoTracking()
                     .Where(x => x.ClavePersona.Equals(clavePersona) && subprogramas.Contains(x.Proyecto.SubPrograma))
                     .Select(x => x.ProyectoId).ToListAsync();
                var personasId = await _db.dbSetPersonalProyectos.AsNoTracking()
                    .Where(x => ProyectosIdPP.Contains(x.ProyectoId))
                    .Select(x => x.ClavePersona)
                    .ToListAsync();

                personasId = new List<String>(new HashSet<String>(personasId));

                return personasId;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }




        }

        /// <summary>  
        /// Recupera una lista de PERSONAS que pertenecen a la Red de contactos, dado la lista de sub programas.
        /// Se consulta en partiticipación por proyecto y la lista incluye al mismo usurio dada la clavePersona
        /// </summary>  
        /// <returns></returns>  
        public async Task<IEnumerable<Personas>> getRedPersonas(String clavePersona, List<String> subprogramas)
        {
            try
            {
                var personasId = await this.getRed(clavePersona, subprogramas);
                var personas = await this.GetAllCollectionMAX(new HashSet<string>(personasId));

                return personas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<object>> MovimientosPersonal(MovimientosPersonal modelo)
        {
            try
            {
                var fechaInicio = modelo.fechaInicio.Day + "/" + modelo.fechaInicio.Month + "/" + modelo.fechaInicio.Year;
                var fechaTermino = modelo.fechaTermino.Day + "/" + modelo.fechaTermino.Month + "/" + modelo.fechaTermino.Year;
                var query = "Select replace(clave,' ','') as clave, nombre, fecha, claveDepartamento, nombreDepartamento, claveCategoria, claveNomina, accionHR, motivoHR, estado from BDI.MovimientosPersonal where fecha between '" + fechaInicio + "' and '" + fechaTermino + "'";

                var datosEnBruto = await _db.Database.SqlQuery<MovimientosPersonal>(query).ToListAsync();
                var datosRefinados = (from p in datosEnBruto
                                      group p by p.estado into grupo
                                      select new
                                      {
                                          tipoMovimiento = grupo.Key,
                                          cantidadMovimientos = grupo.Count(),
                                          registros = grupo.ToList()
                                      }).ToList();
                return datosRefinados.OrderByDescending(e => e.cantidadMovimientos);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<IEnumerable<object>> busqueda_avanzada(busquedaAv modelo)
        {
            try
            {
                SqlParameter param1 = new SqlParameter("@consulta", modelo.criterio);  //Busqueda inicial
                SqlParameter param2 = new SqlParameter("@clave", modelo.opciones.Trim());  //Campos de filtrado
                var SQLString = "EXEC [dbo].[SIGCO3_BUSQUEDA_AVANZADA] @consulta, @clave";

                var datosEnBruto = await _db.Database.SqlQuery<busquedaAv>(SQLString, param1, param2).ToListAsync();

                var datosFinales = (from p in datosEnBruto
                                    group p by p.FieldA into NuevoGrupo
                                    select new
                                    {
                                        ClavePersona = NuevoGrupo.Key,
                                        Objeto = NuevoGrupo.ToList()

                                    }).ToList();

                ExtractoProfesionalRepository extractoProfesional = new ExtractoProfesionalRepository();
                List<object> lista = new List<object>();

                foreach (var obj in datosFinales)
                {
                    Personas datosPersona = await GetByClaveSinEstatus(obj.ClavePersona);
                    if (datosPersona != null)
                    {
                        UnidadOrganizacional unidad = await new UORepository(_db).UnidadActualWithoutStatus(datosPersona.ClaveUnidad);

                        var objeto = new
                        {
                            clavePersona = obj.ClavePersona,
                            ocs = obj.Objeto,
                            datosPersona,
                            nombreGerencia = unidad.NombreUnidad,


                        };
                        lista.Add(objeto);
                    }

                }

                return lista;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<ICollection<busquedaAv>> GetClavesPersonalByFechaEfectiva()
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.Estado == 1 && x.FechaEfectiva ==
                            _db.dbSetPersonas.Where(
                                p => p.FechaEfectiva <= fechaActual
                                && p.ClavePersona == x.ClavePersona
                                ).Max(e => e.FechaEfectiva))
                    .Select(x => new busquedaAv
                    {
                        FieldA = x.ClavePersona,
                    })
                    .Distinct()
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Personas> GetByClaveSinEstatus(string clave)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona == clave)
                    .OrderByDescending(x => x.FechaEfectiva)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public async Task<Object> GetGerenteByClaveUnidad(string id)
        {
            try
            {
                var clave = await _db.dbSetUnidadOrganizacional.Where(e => e.ClaveUnidad == id)
                                                                .OrderByDescending(e => e.FechaEfectiva)
                                                                .Select(x => x.ClaveResponsable)
                                                                .FirstOrDefaultAsync();

                var entities = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => x.ClavePersona == clave && x.Estado == 1)
                    .OrderByDescending(x => x.FechaEfectiva)
                    .FirstOrDefaultAsync();

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
        }



    }
}
