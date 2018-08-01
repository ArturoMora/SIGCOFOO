using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ClientesRepository : IDisposable
    {
        public void Dispose()
        {
            ((IDisposable)_cr).Dispose();
            ((IDisposable)_gen).Dispose();
            ((IDisposable)subprogramas).Dispose();
        }

        CR_Context _cr;
        GEN_Context _gen;
        SubprogramaProyectosVentas subprogramas;  //subprogramas de ventas

        public ClientesRepository()
        {
            _cr = new CR_Context();
            _gen = new GEN_Context();
            subprogramas = new SubprogramaProyectosVentas();
        }

        /// <summary>
        /// Obtiene proyectos vigentes con unidad organizacional y empresa respectivos 
        /// </summary>
        /// <returns>IEnumerable<Proyecto></returns>
        public async Task<IEnumerable<Proyecto>> GetProyectosVigentes()
        {
            DateTime hoy = DateTime.Now;
            UORepository uo = new UORepository(_gen);
            EmpresasRepository empresasrepo = new EmpresasRepository(_cr);

            var proyectos = await _gen.dbSetProyectoGEN
                .Where(e => e.FechaFin > hoy && subprogramas.subprogramas.Contains(e.SubPrograma))
                .Include(e => e.UnidadOrganizacionalEmpresas)
                .AsNoTracking().ToListAsync();
            var listaunidadesid = proyectos.Select(e => e.UnidadOrganizacionalId).ToList();

            var listaempresasid = proyectos
                .Where(e => e.EmpresaId != null)
                .Select(e => e.EmpresaId).ToList();

            IEnumerable<Empresa> empresas = await empresasrepo.GetEmpresas();

            IEnumerable<UnidadOrganizacional> unidadorganizacional = await uo.GetAllCollectionMAX(listaunidadesid);
            foreach (var proyecto in proyectos)
            {
                if (proyecto.UnidadOrganizacionalId != null)
                    proyecto.UnidadOrganizacional = unidadorganizacional.Where(e => e.ClaveUnidad == proyecto.UnidadOrganizacionalId).FirstOrDefault();
                if (proyecto.EmpresaId != null)
                    proyecto.Empresa = empresas.Where(e => e.EmpresaId == proyecto.EmpresaId).FirstOrDefault();
            }


            return proyectos.OrderByDescending(e => e.FechaInicio);
        }


        /// <summary>
        /// Obtiene proyectos (vigentes/no vigentes) con unidad organizacional y empresa respectivos 
        /// </summary>
        /// <returns>IEnumerable<Object></returns>
        public async Task<IEnumerable<Object>> GetConsultaParametrizadaClientes(Proyecto parametros)
        {
            try
            {
                var proyectos = _gen.dbSetProyectoGEN.Where(e => e.EmpresaId != null && e.EmpresaId != 57 && subprogramas.subprogramas.Contains(e.SubPrograma)).AsNoTracking();  //Proyectos que no sean del ineel y que tengan asociada una empresa, perteneciendo a los subprogramas de venta
                if (proyectos != null)
                {

                    if (parametros.EmpresaId != null)  //busqueda por empresa
                    {
                        proyectos = proyectos.Where(e => e.EmpresaId == parametros.EmpresaId);
                    }

                    if (!String.IsNullOrEmpty(parametros.ClaveUnidadEmpresa))  //busqueda por unidad organizacional de empresa
                    {
                        proyectos = proyectos.Where(e => e.ClaveUnidadEmpresa.Equals(parametros.ClaveUnidadEmpresa));
                    }
                    if (!String.IsNullOrEmpty(parametros.ProyectoId))  //busqueda por proyecto
                    {
                        proyectos = proyectos.Where(e => e.ProyectoId == parametros.ProyectoId);
                    }
                    if (parametros.ProgramasActivos == 1) //busqueda por proyectos activos
                    {
                        proyectos = proyectos.Where(e => e.Estado == true);
                    }
                    if (parametros.ProgramasActivos == 2) //busqueda por proyectos inactivos
                    {
                        proyectos = proyectos.Where(e => e.Estado == false);
                    }
                    if (!String.IsNullOrEmpty(parametros.UnidadOrganizacionalId)) //busqueda por unidad organizacional
                    {
                        proyectos = proyectos.Where(e => e.UnidadOrganizacionalId != "0" && e.UnidadOrganizacionalId == parametros.UnidadOrganizacionalId);
                    }


                    //lista de empresas resultante de los proyectos
                    var listaFKEmpresas = proyectos.Where(e => e.EmpresaId != null).Distinct().Select(e => e.EmpresaId).ToList();
                    var listaEmpresas = _cr.Empresa.Where(e => listaFKEmpresas.Contains(e.EmpresaId)).Select(x => new
                    {
                        x.EmpresaId,
                        Nombre = x.NombreEmpresa
                    }).AsNoTracking().ToList();

                    //lista de unidades organizacionales de las empresas
                    var listaFKSUnidadesEmpresas = proyectos.Where(e => e.ClaveUnidadEmpresa != null).Distinct().Select(x => x.ClaveUnidadEmpresa).ToList();
                    var listaUnidadesEmpresas = _cr.UnidadOrganizacionalEmpresas.Where(e => listaFKSUnidadesEmpresas.Contains(e.ClaveUnidad)).Select(x => new
                    {
                        x.ClaveUnidad,
                        x.NombreUnidad,
                        x.Descripcion
                    }).AsNoTracking().ToList();

                    //lista de unidades organizacionales resultantes de los proyectos
                    var listaFKUnidades = proyectos.Where(e => e.UnidadOrganizacionalId != null && e.UnidadOrganizacionalId != "0").Select(e => e.UnidadOrganizacionalId).ToList();
                    var listaUnidades = await _gen.dbSetUnidadOrganizacional.AsNoTracking()
                        .Where(x => listaFKUnidades.Contains(x.ClaveUnidad)
                                        && x.FechaEfectiva == _gen.dbSetUnidadOrganizacional
                                                                        .Where(f => f.FechaEfectiva <= DateTime.Now
                                                                        && f.ClaveUnidad == x.ClaveUnidad)
                                                                        .Max(f => f.FechaEfectiva)
                                          ).Select(x => new
                                          {
                                              ClaveUnidad = x.ClaveUnidad,
                                              NombreUnidad = x.NombreUnidad
                                          })
                        .ToListAsync();

                    var datos = proyectos.ToList();

                    foreach (var p in datos)
                    {
                        if (p.UnidadOrganizacionalId != null)
                        {
                            p.NombreUnidad = listaUnidades.Where(e => e.ClaveUnidad == p.UnidadOrganizacionalId).Select(e => e.NombreUnidad).FirstOrDefault();
                        }

                        if (p.ClaveUnidadEmpresa != null)
                        {
                            var unidad = listaUnidadesEmpresas.Where(e => e.ClaveUnidad.Equals(p.ClaveUnidadEmpresa)).FirstOrDefault();
                            if (unidad.Descripcion != null)
                            {
                                var index = unidad.Descripcion.IndexOf('\u005C');  //Normalmente las descripciones vienen con el nombre de la empresa, asi que eliminamos eso como tal
                                if (index > -1)                                    //Ejemplo: CFE/Direccion de administracion/otros     
                                {
                                    p.NombreUnidadEmpresa = unidad.Descripcion.Substring(++index, unidad.Descripcion.Length - index);
                                }
                            }
                            else
                            {
                                p.NombreUnidadEmpresa = unidad.NombreUnidad;
                            }
                            //p.NombreUnidadEmpresa = listaUnidadesEmpresas.Where(e => e.ClaveUnidad.Equals(p.ClaveUnidadEmpresa)).Select(e => e.NombreUnidad).FirstOrDefault();
                        }

                        if (p.EmpresaId != null)
                        {
                            p.NombreEmpresa = listaEmpresas.Where(e => e.EmpresaId == p.EmpresaId).Select(e => e.Nombre).FirstOrDefault();
                        }



                    }

                    return datos;

                }

                return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener todas las claves de los convocatorias
        /// </summary>
        /// <returns></returns>
        public async Task<List<string>> GetProyectosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ProyectoId FROM GEN.Proyectos where Nombre collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and Nombre collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _gen.Database.SqlQuery<string>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<object>> GetEmpresasRelacionadas()
        {
            try
            {
                var listaFKEmpresasRelacionadas = await _gen.dbSetProyectoGEN.Where(e => e.EmpresaId != null).AsNoTracking().Select(e => e.EmpresaId).ToListAsync();
                EmpresasRepository repo = new EmpresasRepository();
                var resultados = await repo.GetEmpresasByCollectionFKs(listaFKEmpresasRelacionadas);
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<object>> GetClientesProyectosVigentes()  //Ya no se usa
        {

            var clientes = await (from proyecto in _gen.dbSetProyectoGEN
                                  where proyecto.Estado == true && proyecto.EmpresaId != null
                                  && proyecto.EmpresaId != 57
                                  && subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                  group proyecto by proyecto.Empresa into proyectos
                                  select new
                                  {
                                      EmpresaId = proyectos.Key != null ? proyectos.Key.EmpresaId : 0,
                                      NombreEmpresa = proyectos.Key.NombreEmpresa,
                                      NoProyectos = proyectos.Count()
                                  }).AsNoTracking().ToListAsync();

            return clientes;
        }

        /// <summary>
        /// Obtiene el listado de clientes que tienen proyectos(de subprogramas de ventas) vigentes
        /// </summary>
        /// <returns>object</returns>
        public async Task<IEnumerable<Object>> GetProyectosClientesVigentes()
        {
            try
            {
                //Agrupamiento por empresa y unidad de empresa 
                var proyectos = await (from proyecto in _gen.dbSetProyectoGEN
                                       where subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                            && proyecto.Estado == true && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null
                                       group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                       select new ProyectosClientes //Es una clase que unicamente se utiliza para crear una lista de proyectos, como tal no esta mapeada a la bd
                                       {
                                           NoProyectos = proyectgroup.Count(),
                                           NombreUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion == null ? proyectgroup.Key.UnidadOrganizacionalEmpresas.NombreUnidad : proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion,
                                           EmpresaId = proyectgroup.Key.Empresa.EmpresaId == null ? 0 : proyectgroup.Key.Empresa.EmpresaId,
                                           NombreEmpresa = proyectgroup.Key.Empresa.NombreEmpresa,
                                           ClaveUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad.Trim(),
                                           CopiaNombreUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion == null ? null : proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion
                                       }).AsNoTracking().ToListAsync();

                
                List<ProyectosClientes> lista = new List<ProyectosClientes>();
                lista.AddRange(proyectos);
                

                foreach (var elemen in lista)
                {
                    if (elemen.NombreUnidad != null)
                    {
                        var index = elemen.NombreUnidad.IndexOf('\u005C');
                        if (index > -1)
                        {
                            index++;
                            var tex = elemen.NombreUnidad.Substring(index, elemen.NombreUnidad.Length - index);
                            elemen.NombreUnidad = tex;
                        }
                    }

                }

                return lista.OrderBy(e => e.NombreEmpresa).ThenBy(f => f.NombreUnidad);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        
        /// <summary>
        /// Obtiene el listado de clientes que tienen proyectos(de subprogramas de ventas) vigentes/no vigentes
        /// </summary>
        /// <returns>object</returns>
        public async Task<IEnumerable<Object>> GetClientesWithUnidadesForModal()
        {
            try
            {

                var proyectos = await (from proyecto in _gen.dbSetProyectoGEN
                                       where subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                            && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null

                                       group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                       select new ProyectosClientes
                                       {
                                           EmpresaId = proyectgroup.Key.Empresa.EmpresaId,
                                           NombreEmpresa = proyectgroup.Key.Empresa.NombreEmpresa,
                                           ClaveUnidadEmpresa = proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad == null ? null : proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad,
                                           NombreUnidadEmpresa = proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion == null ? proyectgroup.Key.UnidadOrganizacionalEmpresas.NombreUnidad : proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion,
                                       }
                                       ).AsNoTracking().ToListAsync();



                List<ProyectosClientes> lista = new List<ProyectosClientes>();  //Clase no mapeada en la bd
                lista.AddRange(proyectos);

                if (lista != null)
                {

                    foreach (var elemen in lista)
                    {
                        if (elemen.NombreUnidadEmpresa != null)
                        {
                            var index = elemen.NombreUnidadEmpresa.IndexOf('\u005C');
                            if (index > -1)
                            {
                                var tex = elemen.NombreUnidadEmpresa.Substring(++index, elemen.NombreUnidadEmpresa.Length - index);
                                elemen.NombreUnidadEmpresa = tex;
                            }
                        }

                    }
                    
                }

                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene el listado de clientes que tienen proyectos(de subprogramas de ventas) no vigentes
        /// </summary>
        /// <returns>object</returns>
        public async Task<IEnumerable<Object>> GetProyectosClientesHistoricos()
        {
            try
            {
                //Agrupamiento de proyectos por [empresa,clave de unidad] teniendo en cuenta inclusive a las unidades que estan como campos nulos
                var clientesVigentes = await (from proyecto in _gen.dbSetProyectoGEN
                                              where subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                                   && proyecto.Estado == true && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null

                                              group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                              select proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad.Trim()
                                     ).AsNoTracking().ToListAsync();

                
                //Obtendra una lista de clientes inactivos, lo agrupamos con referencia de la tabla de proyectos porque contiene la mayoria de datos que se necesitan para contabilizar clientes
                var proyectos = (from proyecto in _gen.dbSetProyectoGEN
                                 where (subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                      && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null)
                                      && (!clientesVigentes.Contains(proyecto.ClaveUnidadEmpresa))  //Con esta condición se está eliminando todos los proyectos que NO contengan clave de unidad de empresa 
                                                                                                    //Por lo que posteriormente se tiene que agregar al resultado final los registros de clientes que NO tengan clave de unidad pero si registros de proyectos historicos
                                                                                                    //Se hizo de esta manera porque existen registros de clientes que tienen proyectos activos/inactivos, por lo que este metodo solo debe devolver clientes sin NINGUN proyecto vigente
                                 group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                 select new ProyectosClientes //Es una clase que unicamente se utiliza para crear una lista de proyectos, como tal no esta mapeada a la bd
                                 {
                                     NoProyectos = proyectgroup.Count(),
                                     NombreUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion == null ? proyectgroup.Key.UnidadOrganizacionalEmpresas.NombreUnidad : proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion,
                                     EmpresaId = proyectgroup.Key.Empresa.EmpresaId,
                                     NombreEmpresa = proyectgroup.Key.Empresa.NombreEmpresa,
                                     ClaveUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad.Trim(),
                                     CopiaNombreUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion == null ? null : proyectgroup.Key.UnidadOrganizacionalEmpresas.Descripcion
                                 }).AsNoTracking();


                //En referencia a proyectos, extraemos una lista de clientes que tengan proyectos inactivos 
                var clientesSinUnidades = await _gen.dbSetProyectoGEN.Where(x => (subprogramas.subprogramas.Contains(x.SubPrograma) && x.Estado == false
                                                                                        && x.EmpresaId != 57) && (x.EmpresaId != null && x.ClaveUnidadEmpresa == null))
                                                                                       .Include(e=> e.Empresa)
                                                                                       .AsNoTracking()
                                                                                       .Select(z => new
                                                                                       {
                                                                                           z.EmpresaId,
                                                                                           z.Empresa.NombreEmpresa
                                                                                       }
                                                                                       ).Distinct().ToListAsync();

                //Agregamos la coleccion inicial en otra lista, para asi poder modificar sus campos posteriormente
                List<ProyectosClientes> lista = new List<ProyectosClientes>();
                lista.AddRange(proyectos.ToList());
                
                //De la lista de "clientesSinUnidades" Verificamos que realmente los clientes NO tengan ningun proyecto activo
                foreach (var c in clientesSinUnidades.Select(x=> x.EmpresaId))
                {
                    var vigente = await EsClienteVigente(Convert.ToInt32(c));
                    if (!vigente)
                    {
                        ProyectosClientes p = new ProyectosClientes();
                        p.EmpresaId = Convert.ToInt32(c);
                        p.NombreEmpresa = clientesSinUnidades.Where(x => x.EmpresaId == c).Select(x => x.NombreEmpresa).FirstOrDefault();
                        p.NoProyectos= await _gen.dbSetProyectoGEN.Where(x => x.EmpresaId==c)
                                                                  .AsNoTracking()
                                                                  .Select(z => z.EmpresaId).CountAsync();
                        lista.Add(p);
                    }
                }


                //Varios registros vienen con el prefijo de la empresa, es decir "CFE/Hidraulica/Planeacion/Comercializacion", con la siguiente funcion la parte de "CFE/" se elimina
                foreach (var elemen in lista)
                {
                    if (elemen.NombreUnidad != null)
                    {
                        var index = elemen.NombreUnidad.IndexOf('\u005C');
                        if (index > -1)
                        {
                            index++;
                            var tex = elemen.NombreUnidad.Substring(index, elemen.NombreUnidad.Length - index);
                            elemen.NombreUnidad = tex;
                        }
                    }
                    //else
                    //{
                    //    elemen.NombreUnidad = "A No disponible";
                    //}

                }

                return lista.OrderBy(e => e.NombreEmpresa).ThenBy(f => f.NombreUnidad);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene el numero de clientes que tienen proyectos(de subprogramas de ventas) vigentes
        /// </summary>
        /// <returns>int numero</returns>
        public async Task<int> CountProyectosClientesVigentes()
        {
            try
            {
                //Agrupamiento por empresa y unidad de empresa 
                var proyectos = await (from proyecto in _gen.dbSetProyectoGEN
                                       where subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                            && proyecto.Estado == true && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null

                                       group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                       select proyectgroup
                                       ).AsNoTracking().CountAsync();



                return proyectos;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene el numero de clientes que tienen proyectos(de subprogramas de ventas) no vigentes
        /// </summary>
        /// <returns>int numero</returns>
        public async Task<int> CountProyectosClientesHistoricos()
        {
            try
            {
                //Agrupamiento de proyectos por [empresa,clave de unidad] teniendo en cuenta inclusive a las unidades que estan como campos nulos
                var clientesVigentes = await (from proyecto in _gen.dbSetProyectoGEN
                                              where subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                                   && proyecto.Estado == true && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null

                                              group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                              select proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad.Trim()
                                     ).AsNoTracking().ToListAsync();


                //Obtendra una lista de clientes inactivos, lo agrupamos con referencia de la tabla de proyectos porque contiene la mayoria de datos que se necesitan para contabilizar clientes
                var proyectos = await (from proyecto in _gen.dbSetProyectoGEN
                                 where (subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                      && proyecto.EmpresaId != 57 && proyecto.EmpresaId != null)
                                      && (!clientesVigentes.Contains(proyecto.ClaveUnidadEmpresa))  //Con esta condición se está eliminando todos los proyectos que NO contengan clave de unidad de empresa 
                                                                                                    //Por lo que posteriormente se tiene que agregar al resultado final los registros de clientes que NO tengan clave de unidad pero si registros de proyectos historicos
                                                                                                    //Se hizo de esta manera porque existen registros de clientes que tienen proyectos activos/inactivos, por lo que este metodo solo debe devolver clientes sin NINGUN proyecto vigente
                                 group proyecto by new { proyecto.Empresa, proyecto.UnidadOrganizacionalEmpresas } into proyectgroup
                                 select new ProyectosClientes //Es una clase que unicamente se utiliza para crear una lista de proyectos, como tal no esta mapeada a la bd
                                 {
                                     EmpresaId = proyectgroup.Key.Empresa.EmpresaId,
                                     ClaveUnidad = proyectgroup.Key.UnidadOrganizacionalEmpresas.ClaveUnidad.Trim(),
                                 }).AsNoTracking().CountAsync();


                //En referencia a proyectos, extraemos una lista de clientes que tengan proyectos inactivos 
                var clientesSinUnidades = await _gen.dbSetProyectoGEN.Where(x => (subprogramas.subprogramas.Contains(x.SubPrograma) && x.Estado == false
                                                                                        && x.EmpresaId != 57) && (x.EmpresaId != null && x.ClaveUnidadEmpresa == null))
                                                                                       .Include(e => e.Empresa)
                                                                                       .AsNoTracking()
                                                                                       .Select(z => new
                                                                                       {
                                                                                           z.EmpresaId,
                                                                                           z.Empresa.NombreEmpresa
                                                                                       }
                                                                                       ).Distinct().ToListAsync();


                //De la lista de "clientesSinUnidades" Verificamos que realmente los clientes NO tengan ningun proyecto activo
                foreach (var c in clientesSinUnidades.Select(x => x.EmpresaId))
                {
                    var vigente = await EsClienteVigente(Convert.ToInt32(c));
                    if (!vigente)
                    {
                        ++proyectos;
                    }
                }

                return proyectos;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> EsClienteVigente(int id)
        {
            try
            {
                var numeroRegistros = await _gen.dbSetProyectoGEN.Where(x => x.EmpresaId==id && x.Estado == true).AsNoTracking().CountAsync();
                if (numeroRegistros > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
                    

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Object> GetClientesActualesPotenciales()
        {
            DateTime hoy = DateTime.Now;
            var clientesactuales = await (from proyecto in _gen.dbSetProyectoGEN
                                          where proyecto.FechaFin >= hoy && proyecto.EmpresaId != null
                                          && subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                          group proyecto by proyecto.Empresa into proyectos
                                          select proyectos.Key.NombreEmpresa)
                                          .AsNoTracking().ToListAsync();


            var clientespotenciales = await (from proyecto in _gen.dbSetProyectoGEN
                                             where proyecto.FechaFin < hoy && proyecto.EmpresaId != null
                                             && subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                             group proyecto by proyecto.Empresa into proyectos
                                             select proyectos.Key.NombreEmpresa)
                                             .AsNoTracking().ToListAsync();


            var clientes = new { actuales = clientesactuales.Count(), potenciales = clientespotenciales.Where(e => !clientesactuales.Contains(e)).Count() };

            return clientes;
        }

        public async Task<Object> GetPropuestasONIniciativas()
        {

            DateTime hoy = DateTime.Now;
            var clientesvigentes = await (from proyecto in _gen.dbSetProyectoGEN
                                          where proyecto.FechaFin > hoy && proyecto.EmpresaId != null
                                          && subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                          group proyecto by proyecto.Empresa into groupempresa
                                          select groupempresa.Key).AsNoTracking().ToListAsync();

            var propuestas = (from cliente in clientesvigentes
                              join propuesta in _gen.dbSetPropuesta on cliente.EmpresaId equals propuesta.EmpresaId
                              group propuesta by cliente into grouppropuestas
                              select new
                              {
                                  NombreEmpresa = grouppropuestas.Key.NombreEmpresa,
                                  NoPropuestas = grouppropuestas.Count()

                              });

            var ONS = (from cliente in clientesvigentes
                       join oportunidad in _cr.OportunidadNegocio on cliente.EmpresaId equals oportunidad.empresaId
                       group oportunidad by cliente into oportunidades
                       select new
                       {
                           NombreEmpresa = oportunidades.Key.NombreEmpresa,
                           NoONS = oportunidades.Count()

                       }).ToList();

            var iniciativas = (from cliente in clientesvigentes
                               join iniciativa in _gen.dbSetIniciativa on cliente.EmpresaId equals iniciativa.EmpresaId
                               group iniciativa by cliente into grupoiniciativas
                               select new
                               {
                                   NombreEmpresa = grupoiniciativas.Key.NombreEmpresa,
                                   Iniciativas = grupoiniciativas.Count()

                               }).ToList();


            return new { Propuestas = propuestas, OportunidadesNegocio = ONS, Iniciativas = iniciativas };
        }


        public async Task<Object> GetPropuestasONIniciativasPotenciales()
        {

            DateTime hoy = DateTime.Now;

            var clientes = await (from proyecto in _gen.dbSetProyectoGEN
                                  where proyecto.FechaFin > hoy && proyecto.EmpresaId != null
                                  && subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                  group proyecto by proyecto.Empresa into groupempresa
                                  select groupempresa.Key.NombreEmpresa).AsNoTracking().ToListAsync();

            var clientespotenciales = await (from proyecto in _gen.dbSetProyectoGEN
                                             where proyecto.FechaFin < hoy && proyecto.EmpresaId != null
                                             && subprogramas.subprogramas.Contains(proyecto.SubPrograma)
                                             && !clientes.Contains(proyecto.Empresa.NombreEmpresa)
                                             group proyecto by proyecto.Empresa into groupempresa
                                             select groupempresa.Key).AsNoTracking().ToListAsync();

            var propuestas = (from cliente in clientespotenciales
                              join propuesta in _gen.dbSetPropuesta on cliente.EmpresaId equals propuesta.EmpresaId
                              group propuesta by cliente into grouppropuestas
                              select new
                              {
                                  NombreEmpresa = grouppropuestas.Key.NombreEmpresa,
                                  NoPropuestas = grouppropuestas.Count()

                              }).ToList();

            var ONS = (from cliente in clientespotenciales
                       join oportunidad in _cr.OportunidadNegocio on cliente.EmpresaId equals oportunidad.empresaId
                       group oportunidad by cliente into oportunidades
                       select new
                       {
                           NombreEmpresa = oportunidades.Key.NombreEmpresa,
                           NoONS = oportunidades.Count()

                       }).ToList();

            var iniciativas = (from cliente in clientespotenciales
                               join iniciativa in _gen.dbSetIniciativa on cliente.EmpresaId equals iniciativa.EmpresaId
                               group iniciativa by cliente into grupoiniciativas
                               select new
                               {
                                   NombreEmpresa = grupoiniciativas.Key.NombreEmpresa,
                                   Iniciativas = grupoiniciativas.Count()

                               }).ToList();


            return new { Propuestas = propuestas, OportunidadesNegocio = ONS, Iniciativas = iniciativas };
        }

        public Object GetClienteEsAliado(int id)
        {
            try
            {
                DateTime hoy = new DateTime();
                var aliadoid = (from convenio in _cr.Convenio
                                join aliado in _cr.Aliado on convenio.AliadoId equals aliado.AliadoId
                                where aliado.EmpresaId == id && convenio.FechaTermino > hoy
                                      && convenio.TipoConvenioId != 14
                                select new { AliadoId = aliado.AliadoId }).FirstOrDefault();
                return aliadoid;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene todos los proyectos con unidad organizacional y empresas respectivas 
        /// </summary>
        /// <returns>Object[]</returns>
        public async Task<Object[]> GetTotalProyectos()
        {
            try
            {
                UORepository uo = new UORepository(_gen);
                EmpresasRepository emp = new EmpresasRepository(_cr);

                var proyectos = await _gen.dbSetProyectoGEN.Where(e => e.EmpresaId != null && subprogramas.subprogramas.Contains(e.SubPrograma)).AsNoTracking().ToListAsync();
                var unidadesId = proyectos.Select(e => e.UnidadOrganizacionalId).ToList();
                Object[] lista = new Object[proyectos.Count];

                IEnumerable<UnidadOrganizacional> unidadOrganizacional = await uo.GetAllCollectionMAX(unidadesId);
                IEnumerable<Empresa> empresas = await emp.GetEmpresas();

                foreach (var item in proyectos)
                {
                    lista[proyectos.IndexOf(item)] = new
                    {
                        cliente = empresas.Where(e => e.EmpresaId == item.EmpresaId).Select(e => e.NombreEmpresa).FirstOrDefault(),
                        proyectoID = item.ProyectoId,
                        nombre = item.Nombre,
                        monto = item.Costo,
                        fInicio = item.FechaInicio,
                        fFinal = item.FechaFin,
                        gerencia = unidadOrganizacional.Where(e => e.ClaveUnidad == item.UnidadOrganizacionalId).Select(e => e.NombreUnidad).FirstOrDefault()
                    };
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtiene lista de propuestas 
        /// </summary>
        /// <returns>IEnumerable<Propuestas></returns>
        public async Task<IEnumerable<Propuestas>> GetPropuestas(int anio)
        {
            DateTime anioconsulta = new DateTime(anio, 1, 1);
            DateTime fechafin = anioconsulta.AddYears(1);
            UORepository uo = new UORepository(_gen);

            List<int?> empresasenproyectos = _gen.dbSetProyectoGEN
                .Where(e => e.EmpresaId != null && subprogramas.subprogramas.Contains(e.SubPrograma))
                .Select(e => e.EmpresaId).Distinct().Distinct().ToList();

            var propuestas = await _gen.dbSetPropuesta.Include(e => e.Empresa)
                .Where(e => (e.Fecha > anioconsulta && e.Fecha < fechafin) && empresasenproyectos.Contains(e.EmpresaId))
                .AsNoTracking().ToListAsync();
            var listaunidadesid = propuestas.Select(e => e.UnidadOrganizacionalId).ToList();
            IEnumerable<UnidadOrganizacional> unidadorganizacional = await uo.GetAllCollectionMAX(listaunidadesid);
            foreach (var propuesta in propuestas)
            {
                if (propuesta.UnidadOrganizacionalId != null)
                    propuesta.UnidadOrganizacional = unidadorganizacional
                        .Where(e => e.ClaveUnidad == propuesta.UnidadOrganizacionalId)
                        .FirstOrDefault();
            }

            return propuestas;
        }

        /// <summary>
        /// Obtiene lista de iniciativas
        /// </summary>
        /// <param name="anio"></param>
        /// <returns>IEnumerable<Iniciativas></returns>
        public async Task<IEnumerable<Iniciativas>> GetIniciativas(int anio)
        {
            DateTime anioconsulta = new DateTime(anio, 1, 1);
            DateTime fechafin = anioconsulta.AddYears(1);
            UORepository uo = new UORepository(_gen);

            List<int?> empresasenproyectos = _gen.dbSetProyectoGEN
                .Where(e => e.EmpresaId != null && subprogramas.subprogramas.Contains(e.SubPrograma))
                .Select(e => e.EmpresaId).Distinct().Distinct().ToList();

            var iniciativas = await _gen.dbSetIniciativa
                .Where(e => e.Fecha > anioconsulta
                        && e.Fecha < fechafin
                        && empresasenproyectos.Contains(e.EmpresaId)
                )
                .AsNoTracking().ToListAsync();
            var listaunidadesid = iniciativas.Select(e => e.UnidadOrganizacionalId).ToList();
            var listaempresaid = iniciativas.Select(e => e.EmpresaId);
            IEnumerable<UnidadOrganizacional> unidadorganizacional = await uo.GetAllCollectionMAX(listaunidadesid);
            IEnumerable<Empresa> empresas = await new EmpresasRepository(_cr).GetEmpresasByTrue();
            foreach (var iniciativa in iniciativas)
            {
                if (iniciativa.UnidadOrganizacionalId != null)
                    iniciativa.UnidadOrganizacional = unidadorganizacional
                        .Where(e => e.ClaveUnidad == iniciativa.UnidadOrganizacionalId)
                        .FirstOrDefault();
                if (iniciativa.EmpresaId != null)
                    iniciativa.Empresa = empresas
                        .Where(e => e.EmpresaId == iniciativa.EmpresaId)
                        .FirstOrDefault();
            }

            return iniciativas;
        }

        /// <summary>
        /// obtiene una lista de Oportunidades de negocio 
        /// </summary>
        /// <param name="anio"></param>
        /// <returns></returns>
        public async Task<IEnumerable<OportunidadNegocio>> GetON(int anio)
        {
            DateTime anioconsulta = new DateTime(anio, 1, 1);
            DateTime fechafin = anioconsulta.AddYears(1);
            PersonasRepository personarepo = new PersonasRepository(_gen);

            List<int?> empresasenproyectos = _gen.dbSetProyectoGEN
                .Where(e => e.EmpresaId != null && subprogramas.subprogramas.Contains(e.SubPrograma))
                .Select(e => e.EmpresaId).Distinct().Distinct().ToList();

            var ons = await _cr.OportunidadNegocio
                .Where(e => e.Fecha > anioconsulta
                        && e.Fecha < fechafin
                        && empresasenproyectos.Contains(e.empresaId)
                        )
                .AsNoTracking().ToListAsync();
            HashSet<string> listaclavepersona = new HashSet<string>(ons.Select(e => e.Investigador).ToList());
            var listaempresaid = ons.Select(e => e.empresaId);
            var clavesUnidades = ons.Select(e => e.ClaveUnidad).Distinct().ToList();
            IEnumerable<Personas> personas = await personarepo.GetAllCollectionWithoutStatus(listaclavepersona);
            IEnumerable<Empresa> empresas = await new EmpresasRepository(_cr).GetEmpresasByTrue();
            var unidades = await new UORepository().GetAllCollectionMAX(clavesUnidades);
            foreach (var oportunidad in ons)
            {
                if (oportunidad.Investigador != null)
                    oportunidad.NombreInvestigador = personas
                        .Where(e => e.ClaveUnidad == oportunidad.Investigador)
                        .Select(e => e.NombreCompleto).FirstOrDefault();
                if (oportunidad.empresaId != null)
                    oportunidad.Empresa = empresas
                        .Where(e => e.EmpresaId == oportunidad.empresaId)
                        .FirstOrDefault();
                if (oportunidad.ClaveUnidad != null)
                {
                    oportunidad.NombreUnidad = unidades.Where(e => e.ClaveUnidad == oportunidad.ClaveUnidad).Select(x => x.NombreUnidad).FirstOrDefault();
                }
            }

            return ons;
        }

        /// <summary>
        /// Obtiene una lista de Años para consultar las propuestas 
        /// </summary>
        /// <returns>List<string></returns>
        public async Task<List<string>> GetAniosdePropuestas()
        {
            var anios = await _gen.dbSetPropuesta
                .Select(e => e.Fecha.Year.ToString()).Distinct().AsNoTracking().ToListAsync();
            anios.Reverse();
            return anios;
        }

        /// <summary>
        /// Obtiene una lista de  años para consultar las propuestas 
        /// </summary>
        /// <returns><List<string></returns>
        public async Task<List<string>> GetAniosdeIniciativas()
        {
            var anios = await _gen.dbSetIniciativa
                .Select(e => e.Fecha.Year.ToString()).Distinct().AsNoTracking().ToListAsync();
            anios.Reverse();
            return anios;
        }


        /// <summary>
        /// Obtiene una lista de años para consultar oportunidades de negocio 
        /// </summary>
        /// <returns><List<string></returns>
        public async Task<List<string>> GetAniosdeON()
        {
            var anios = await _cr.OportunidadNegocio
                .Select(e => e.Fecha.Year.ToString()).Distinct().AsNoTracking().ToListAsync();
            anios.Reverse();
            return anios;
        }

        public async Task<IEnumerable<Iniciativas>> GetProspectosIniciativas()
        {
            //DateTime anioconsulta = new DateTime(anio, 1, 1);
            //DateTime fechafin = anioconsulta.AddYears(1);
            UORepository uo = new UORepository(_gen);

            List<int?> empresasenproyectos = _gen.dbSetProyectoGEN
                .Where(e => e.EmpresaId != null && subprogramas.subprogramas.Contains(e.SubPrograma))
                .Select(e => e.EmpresaId).Distinct().Distinct().ToList();

            var iniciativas = await _gen.dbSetIniciativa
                .Where(e => !empresasenproyectos.Contains(e.EmpresaId))
                .AsNoTracking().ToListAsync();
            var listaunidadesid = iniciativas.Select(e => e.UnidadOrganizacionalId).ToList();
            var listaempresaid = iniciativas.Select(e => e.EmpresaId);
            IEnumerable<UnidadOrganizacional> unidadorganizacional = await uo.GetAllCollectionMAX(listaunidadesid);
            IEnumerable<Empresa> empresas = await new EmpresasRepository(_cr).GetEmpresasByTrue();
            foreach (var iniciativa in iniciativas)
            {
                if (iniciativa.UnidadOrganizacionalId != null)
                    iniciativa.UnidadOrganizacional = unidadorganizacional
                        .Where(e => e.ClaveUnidad == iniciativa.UnidadOrganizacionalId)
                        .FirstOrDefault();
                if (iniciativa.EmpresaId != null)
                    iniciativa.Empresa = empresas
                        .Where(e => e.EmpresaId == iniciativa.EmpresaId)
                        .FirstOrDefault();
            }

            return iniciativas;
        }

        public async Task<IEnumerable<OportunidadNegocio>> GetProspectosON()
        {
            //DateTime anioconsulta = new DateTime(anio, 1, 1);
            //DateTime fechafin = anioconsulta.AddYears(1);
            PersonasRepository personarepo = new PersonasRepository(_gen);

            List<int?> empresasenproyectos = _gen.dbSetProyectoGEN
                .Where(e => e.EmpresaId != null && subprogramas.subprogramas.Contains(e.SubPrograma))
                .Select(e => e.EmpresaId).Distinct().Distinct().ToList();

            var ons = await _cr.OportunidadNegocio
                .Where(e => !empresasenproyectos.Contains(e.empresaId))
                .AsNoTracking().ToListAsync();
            HashSet<string> listaclavepersona = new HashSet<string>(ons.Select(e => e.Investigador).ToList());
            var listaempresaid = ons.Select(e => e.empresaId);
            IEnumerable<Personas> personas = await personarepo.GetAllCollectionWithoutStatus(listaclavepersona);
            IEnumerable<Empresa> empresas = await new EmpresasRepository(_cr).GetEmpresasByTrue();
            foreach (var oportunidad in ons)
            {
                if (oportunidad.Investigador != null)
                    oportunidad.NombreInvestigador = personas
                        .Where(e => e.ClavePersona == oportunidad.Investigador)
                        .Select(e => e.NombreCompleto).FirstOrDefault();
                if (oportunidad.empresaId != null)
                    oportunidad.Empresa = empresas
                        .Where(e => e.EmpresaId == oportunidad.empresaId)
                        .FirstOrDefault();
            }

            return ons;
        }
    }
}
