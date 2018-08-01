using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class UORepository : IDisposable
    {

        private GEN_Context _db;

        public UORepository()
        {
            _db = new GEN_Context();
        }
        public UORepository(GEN_Context _dbInstance)
        {
            _db = _dbInstance;
        }
        public async Task<UnidadOrganizacional> UnidadByFecha(DateTime fechaReferencia, String idUnidad)
        {
            try
            {

                var unidad = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => x.ClaveUnidad == idUnidad && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaReferencia
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                    .FirstOrDefaultAsync();
                if (unidad != null)
                {
                    var persona = new PersonasRepository(_db);
                    unidad.Responsable = await persona.GetByClave(unidad.ClaveResponsable);
                }

                return unidad;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<UnidadOrganizacional> UnidadActualWithoutStatus(string idUnidad)
        {
            try
            {
                var fechaActual = DateTime.Now;
                var unidad = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => x.ClaveUnidad == idUnidad && x.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                        p => p.FechaEfectiva <= fechaActual
                        && p.ClaveUnidad == x.ClaveUnidad
                        ).Max(e => e.FechaEfectiva))
                    //.OrderByDescending(e => e.FechaEfectiva)
                    .FirstOrDefaultAsync();
                return unidad;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //TODO: de ejemplo, esto no considera fecha efectiva
        public async Task<List<UnidadOrganizacional>> GetAllByCollectionUnidadId(List<String> unidadesId)
        {
            try
            {
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => unidadesId.Contains(x.ClaveUnidad))
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Regresa una lista de Unidades organizaciones de acuerdo a una lista de clavesUnidad, considerando la fecha actual.
        /// <summary>
        public async Task<List<UnidadOrganizacional>> GetAllByCollectionCR(List<String> unidadesId)
        {
            try
            {//.Where(x => x.ClaveUnidad.Equals(id)
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => unidadesId.Contains(x.ClaveUnidad) //)
                                    && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private IQueryable<UnidadOrganizacional> GetAllUniques(DateTime fecha)
        {
            try
            {
                var entities = _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(x => x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                    .Where(f => f.FechaEfectiva <= fecha
                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                    .Max(f => f.FechaEfectiva)
                      );
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// recupera los responsables de Gerencias activas considerando fecha efectiva
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Personas>> PersonasResponsablesByGetAllUniques()
        {
            try
            {
                var responsablesID = await this.GetAllUniques(DateTime.Now)
                    .Where(x => x.Estado == 1 && x.tipoO == 3)
                    .Select(x => x.ClaveResponsable).ToListAsync();
                PersonasRepository pDB = new PersonasRepository(_db);
                var responsables = await pDB.GetAllCollectionWithoutStatus(responsablesID);
                return responsables;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<UnidadOrganizacional>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<UnidadOrganizacional>> GetAllnodes(String id)
        {
            try
            {
                List<UnidadOrganizacional> entities = null;
                if (String.IsNullOrEmpty(id))
                {
                    entities = await _db.dbSetUnidadOrganizacional
                    //.Include(x => x.Children)
                    .Where(x => String.IsNullOrEmpty(x.padre)
                            && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva))
                    .AsNoTracking().ToListAsync();
                }
                else
                {
                    entities = await _db.dbSetUnidadOrganizacional
                                      //.Include(x => x.Children)
                                      .Where(x => x.ClaveUnidad.Equals(id)
                                      && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva)
                                      )
                                      .AsNoTracking().ToListAsync();
                }
                try
                {
                    foreach (var item in entities)
                    {
                        item.Children = await _db.dbSetUnidadOrganizacional
                             .Where(x => x.padre == item.ClaveUnidad)
                             .Where(x => x.Estado == 1)
                             .OrderByDescending(e => e.FechaEfectiva)
                             .AsNoTracking()
                            .ToListAsync();

                    }
                }
                catch (Exception e) { }
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task<IEnumerable<UnidadOrganizacional>> GetAllnodesFechaEfectiva(String id, DateTime fecha)
        {
            try
            {
                List<UnidadOrganizacional> entities = null;
                if (String.IsNullOrEmpty(id))
                {
                    entities = await _db.dbSetUnidadOrganizacional
                    //.Include(x => x.Children)
                    .Where(x => String.IsNullOrEmpty(x.padre)
                                && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva))
                    .AsNoTracking().ToListAsync();
                }
                else
                {
                    entities = await _db.dbSetUnidadOrganizacional
                                      .Where(x => x.ClaveUnidad.Equals(id)
                                            && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= fecha
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva))
                                      .AsNoTracking().ToListAsync();
                }
                try
                {
                    foreach (var item in entities)
                    {
                        item.Children = await _db.dbSetUnidadOrganizacional
                           .Where(x => x.padre == item.ClaveUnidad)
                           .Where(x => x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                        .Where(f => f.FechaEfectiva <= fecha
                                                              && f.ClaveUnidad == x.ClaveUnidad)
                                                        .Max(f => f.FechaEfectiva)
                           )
                           .Where(x => x.Estado == 1)
                           .OrderByDescending(e => e.NombreUnidad)
                           .AsNoTracking()
                          .ToListAsync();

                    }
                }
                catch (Exception e) { }
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<UnidadOrganizacional>> GetAllnodesPorFecha(string id, DateTime fecha)
        {
            try
            {
                List<UnidadOrganizacional> entities = null;
                if (String.IsNullOrEmpty(id))
                {
                    entities = await _db.dbSetUnidadOrganizacional
                    //.Include(x => x.Children)
                    .Where(x => String.IsNullOrEmpty(x.padre)
                                && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva))
                    .AsNoTracking().ToListAsync();
                }
                else
                {
                    entities = await _db.dbSetUnidadOrganizacional
                                      .Where(x => x.ClaveUnidad.Equals(id)
                                            && x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= fecha
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva))
                                      .AsNoTracking().ToListAsync();
                }
                try
                {
                    foreach (var item in entities)
                    {
                        item.Children = await _db.dbSetUnidadOrganizacional
                           .Where(x => x.padre == item.ClaveUnidad)
                           .Where(x => x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                        .Where(f => f.FechaEfectiva <= fecha
                                                              && f.ClaveUnidad == x.ClaveUnidad)
                                                        .Max(f => f.FechaEfectiva)
                           )
                           .Where(x=>x.Estado==1)
                           .OrderByDescending(e => e.NombreUnidad)
                           .AsNoTracking()
                          .ToListAsync();

                    }
                }
                catch (Exception e) { }
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<UnidadOrganizacional>> GetAllnodesPorFechaEfectiva(DateTime fecha)
        {
            try
            {
                List<UnidadOrganizacional> entities = null;

                entities = await _db.dbSetUnidadOrganizacional
                .Where(x => x.FechaEfectiva == _db.dbSetUnidadOrganizacional
                                                                .Where(f => f.FechaEfectiva <= fecha
                                                                && f.ClaveUnidad == x.ClaveUnidad)
                                                                .Max(f => f.FechaEfectiva)
                    //&& x.ClaveUnidad != "90"
                    //&& x.ClaveUnidad != "70"
                    //&& x.ClaveUnidad != "01"
                    && x.Estado == 1
                    && x.padre != "90"
                    && x.padre != "70"
                          )
                .AsNoTracking().ToListAsync();
                var personas = (from uo in entities
                                select uo.ClaveResponsable).ToList();

                var responsables = await (from persona in _db.dbSetPersonas //Investigadores
                                          where persona.FechaEfectiva == _db.dbSetPersonas.Where(
                                                                                      p => p.FechaEfectiva <= fecha
                                                                                      && p.ClavePersona == persona.ClavePersona
                                                                                      ).Max(e => e.FechaEfectiva)
                                          && personas.Contains(persona.ClavePersona)
                                          select persona).AsNoTracking().ToListAsync();
                foreach (var ou in entities)
                {
                    var respon = responsables.Find(e => e.ClavePersona == ou.ClaveResponsable);
                    ou.Responsable = respon;
                }
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<UnidadOrganizacional>> getGerenciasforDivicion(string claveUnidad)
        {
            try
            {
                var result = await _db.dbSetUnidadOrganizacional
                    .Where(e => e.padre.Equals(claveUnidad) && e.Estado == 1)
                    .AsNoTracking().ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<UnidadOrganizacional> GetAllDivicion(string id)
        {
            try
            {
                var result = await _db.dbSetUnidadOrganizacional.Where(e => e.ClaveResponsable.Equals(id) && e.Estado == 1 && e.padre.Equals("01"))
                    .AsNoTracking().FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// No incluye Dirección o unidad cuspide (donde padre==null)
        /// </summary>
        public async Task<List<SelectModel>> GetUnidadesSelectByNameLyke(string nameLike)
        {
            try
            {
                //var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()                    
                //    .FirstOrDefaultAsync(e => e.ClaveUnidad == id);//se comenta por no considera fechaEfe
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.NombreUnidad.Contains(nameLike) && e.padre != null)
                    .Select(e => e.ClaveUnidad)
                    .ToListAsync();
                HashSet<String> claves = new HashSet<String>(entities);


                List<SelectModel> list = new List<SelectModel>();
                foreach (var id in claves)
                {
                    list.Add(new SelectModel(id, await GetAllSTRNamesById(id)));
                }

                return list;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<List<string>> GetClavesByLikeNombre(string nameLike)
        {
            try
            {
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.NombreUnidad.Contains(nameLike) && e.padre != null)
                    .Select(e => e.ClaveUnidad)
                    .ToListAsync();
                if (entities == null)
                {
                    entities = new List<String>();
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<string>> GetPorNombreUnidad(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ClaveUnidad FROM GEN.cat_UnidadOrganizacional AS P where P.NombreUnidad collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  P.NombreUnidad collate Latin1_General_CI_AI LIKE";
                }
                query = query.Substring(0, query.Length - 53);
                var resultados = await _db.Database.SqlQuery<string>(query + "and P.FechaEfectiva = (SELECT MAX(FechaEfectiva) FROM GEN.cat_UnidadOrganizacional where P.ClaveUnidad = ClaveUnidad)").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<String> GetAllSTRNamesById(string id)
        {
            try
            {
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.ClaveUnidad == id)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .Select(e => e.NombreUnidad)
                    .ToListAsync();
                if (entities == null)
                {
                    return "";
                }

                HashSet<String> nombres = new HashSet<String>(entities);
                var r = string.Join("<br/>", nombres.ToArray());
                return r;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<ICollection<UnidadOrganizacional>> GetAllCollectionMAX(List<String> collection)
        {
            //pendiente de validar resultados de este metodo
            try
            {
                var fechaActual = DateTime.Now;
                if (collection == null || collection.Count == 0)
                {
                    return null;
                }
                var entities = await (from row in _db.dbSetUnidadOrganizacional
                                      where row.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClaveUnidad == row.ClaveUnidad
                                                                    ).Max(e => e.FechaEfectiva)

                                      select row)
                                      .Where(x => collection.Contains(x.ClaveUnidad))
                                      .ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<ICollection<UnidadOrganizacional>> GetAllCollectionMAX(HashSet<String> collection)
        {
            //pendiente de validar resultados de este metodo
            try
            {
                var fechaActual = DateTime.Now;
                if (collection == null || collection.Count == 0)
                {
                    return null;
                }
                var entities = await (from row in _db.dbSetUnidadOrganizacional
                                      where row.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClaveUnidad == row.ClaveUnidad
                                                                    ).Max(e => e.FechaEfectiva)

                                      select row)
                                      .Where(x => collection.Contains(x.ClaveUnidad))
                                      .ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<String> GetNameById(string claveUnidad)
        {
            try
            {
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.ClaveUnidad == claveUnidad)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .Select(x => x.NombreUnidad)
                    .FirstOrDefaultAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //retorna la actual de acuerdo a fecha efectiva
        public async Task<UnidadOrganizacional> GetById(string claveUnidad)
        {
            try
            {
                //var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()                    
                //    .FirstOrDefaultAsync(e => e.ClaveUnidad == id);//se comenta por no considera fechaEfe
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.ClaveUnidad == claveUnidad)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .FirstOrDefaultAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<UnidadOrganizacional> GetByIdWithChildren(string claveUnidad)
        {
            try
            {
                //var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()                    
                //    .FirstOrDefaultAsync(e => e.ClaveUnidad == id);//se comenta por no considera fechaEfe
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.ClaveUnidad == claveUnidad)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .FirstOrDefaultAsync();
                try
                {
                    entities.Children = await _db.dbSetUnidadOrganizacional
                         .Where(x => x.padre == entities.ClaveUnidad)
                         .Where(x => x.Estado == 1)
                         .OrderByDescending(e => e.FechaEfectiva)
                         .AsNoTracking()
                        .ToListAsync();


                }
                catch (Exception e) { }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<UnidadOrganizacional> GetByIdWithFather(string claveUnidad)
        {
            try
            {
                var entities = await _db.dbSetUnidadOrganizacional.AsNoTracking()
                    .Where(e => e.ClaveUnidad == claveUnidad)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .FirstOrDefaultAsync();

                entities.ClaveUnidadPadre = await _db.dbSetUnidadOrganizacional
                    .Where(x => x.ClaveUnidad == entities.padre && x.Estado == 1)
                    .OrderByDescending(e => e.FechaEfectiva)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(UnidadOrganizacional model)
        {
            try
            {

                _db.dbSetUnidadOrganizacional.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(UnidadOrganizacional model)
        {
            try
            {
                var _model = await _db.dbSetUnidadOrganizacional.FirstOrDefaultAsync(e => e.ClaveUnidad == model.ClaveUnidad);
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
                var _model = await _db.dbSetUnidadOrganizacional.FirstOrDefaultAsync(e => e.ClaveUnidad == id);
                if (_model != null)
                {
                    _db.dbSetUnidadOrganizacional.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(UnidadOrganizacional obj)
        {
            try
            {
                var _obj = await _db.dbSetUnidadOrganizacional.FirstOrDefaultAsync(e => e.ClaveUnidad == obj.ClaveUnidad);
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

        public async Task<IEnumerable<UnidadOrganizacional>> GetUnidades(List<string> clavesUnidad)
        {
            try
            {
                var fechaActual = DateTime.Now;

                var _unidades = await _db.dbSetUnidadOrganizacional
                    .Where(e => clavesUnidad.Contains(e.ClaveUnidad) && e.FechaEfectiva == _db.dbSetUnidadOrganizacional.Where(
                                                                    p => p.FechaEfectiva <= fechaActual
                                                                    && p.ClaveUnidad == e.ClaveUnidad
                                                                    ).Max(f => e.FechaEfectiva))
                    .AsNoTracking().ToListAsync();
                return _unidades;
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
