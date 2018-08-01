using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Data.Entity;
using INEEL.DataAccess.CR.Models;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProyectosEmpresaRepository : IDisposable
    {
        public void Dispose() { _dbGen.Dispose(); }
        GEN_Context _dbGen;
        CR_Context _db;

        public ProyectosEmpresaRepository()
        {
            _dbGen = new GEN_Context();
            _db = new CR_Context();
        }



        public async Task<IEnumerable<Proyecto>> getAll()
        {
            try
            {
                var _proyectos = await _dbGen.dbSetProyectoGEN
                    .AsNoTracking()
                    .Where(p => p.ContactoId == null
                        && p.EmpresaId == null
                        && String.IsNullOrEmpty(p.ClaveUnidadEmpresa))
                    .ToListAsync();

                return _proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Proyecto>> getAllTecnicos()
        {
            /***** DESCRIPCION DE LOS SUBPROGRAMAS DE PROYECTOS TECNICOS ***/
            /*
                61 DESARROLLO DE INFRAESTRUCTURA TECNOLÓGICA
                63 DESARROLLO DE APLICACIONES TECNOLÓGICAS POR CONTRATO
                65 PROYECTOS CONTRATADOS POR LA SECRETARÍA DE ENERGÍA.
                67 PROYECTOS ACORDADOS CON  C F E 
                68 PROYECTOS INTERNOS


            NOTA: Se omiten los proyectos administrativos o internos 
            como apoyo a la gerencia, capacidad disponible, vacaciones, etc.
     
            */

            try
            {
                var _proyectos = await _dbGen.dbSetProyectoGEN
                    .AsNoTracking()
                    .Where(p => p.ContactoId == null
                        && p.EmpresaId == null
                        && p.SubPrograma == "61"
                        || p.SubPrograma == "63"
                        || p.SubPrograma == "65"
                        || p.SubPrograma == "67"
                        || p.SubPrograma == "68"
                        && String.IsNullOrEmpty(p.ClaveUnidadEmpresa))
                    .ToListAsync();
                return _proyectos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Proyecto>> getAllTecnicosServerSide(DataServerSide ss)
        {
            /***** DESCRIPCION DE LOS SUBPROGRAMAS DE PROYECTOS TECNICOS ***/
            /*
                61 DESARROLLO DE INFRAESTRUCTURA TECNOLÓGICA
                63 DESARROLLO DE APLICACIONES TECNOLÓGICAS POR CONTRATO
                65 PROYECTOS CONTRATADOS POR LA SECRETARÍA DE ENERGÍA.
                67 PROYECTOS ACORDADOS CON  C F E 
                68 PROYECTOS INTERNOS


            NOTA: Se omiten los proyectos administrativos o internos 
            como apoyo a la gerencia, capacidad disponible, vacaciones, etc.
     
            */

            try
            {



                var v = (from a in
                        _dbGen.dbSetProyectoGEN
                        .Where(p => p.EmpresaId == null && (p.SubPrograma == "61"
                            || p.SubPrograma == "63"
                            || p.SubPrograma == "65"
                            || p.SubPrograma == "67"
                            || p.SubPrograma == "68")
                            )
                         select a).AsNoTracking();

                ss.recordsTotal = v.Count();

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }
                if (!String.IsNullOrEmpty(ss.searchValue))
                {
                    var listafks = await GetProyectosLikeNombreLatin1(ss.searchValue);
                    var listafksautores = await GetProyectosByJefeProyectoLatin1(ss.searchValue);
                    v = v.Where(e => listafks.Contains(e.ProyectoId) || e.ProyectoId == ss.searchValue || listafksautores.Contains(e.ProyectoId));
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

        /// <summary>
        /// Obtener todas las claves de los proyectos buscados por nombre
        /// </summary>
        /// <returns></returns>
        public async Task<List<string>> GetProyectosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                StringBuilder sql = new StringBuilder();
                foreach (var palabra in palabras)
                {
                    sql.Append(" Nombre collate Latin1_General_CI_AI LIKE '%" + palabra + "%' AND ");
                }
                var query = sql.ToString().Substring(0, sql.ToString().Length - 4);
                var resultados = await _dbGen.Database.SqlQuery<string>("SELECT ProyectoId FROM GEN.Proyectos where " + query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los proyectos buscados por jefe de proyecto
        /// </summary>
        /// <returns></returns>
        public async Task<List<string>> GetProyectosByJefeProyectoLatin1(String likeNombre)
        {
            try
            {
                var resultados = await _dbGen.Database.SqlQuery<string>("SELECT ProyectoId FROM GEN.Proyectos where NombreJefeProyecto collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%' ").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Proyecto> Get(string Id)
        {
            try
            {
                var _proyecto = await _dbGen.dbSetProyectoGEN
                    .AsNoTracking().FirstOrDefaultAsync(p => p.ProyectoId == Id);

                return _proyecto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> CountProyectosVigentes(int id){
            try{
                var proyectos= await _dbGen.dbSetProyectoGEN.Where(e=> e.EmpresaId==id && e.Estado==true).AsNoTracking().CountAsync();
                return proyectos;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<int> CountProyectosHistoricos(int id){
            try{
                var proyectos= await _dbGen.dbSetProyectoGEN.Where(e=> e.EmpresaId==id && e.Estado==false).AsNoTracking().CountAsync();
                return proyectos;

            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Proyecto> GetAsginado(string Id)
        {
            try
            {
                var _proyecto = await _dbGen.dbSetProyectoGEN
                    .Include(e => e.Empresa)
                    .Include(c => c.Contacto)
                    .Include(u => u.UnidadOrganizacionalEmpresas)
                    .AsNoTracking().FirstOrDefaultAsync(p => p.ProyectoId == Id);

                return _proyecto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task AsignarProyecto(Proyecto proyecto)
        {
            try
            {
                var _proyectoEmpresa = await _dbGen.dbSetProyectoGEN
                    .FirstOrDefaultAsync(c => c.ProyectoId == proyecto.ProyectoId);

                if (_proyectoEmpresa != null)
                {
                    _dbGen.Entry(_proyectoEmpresa).CurrentValues.SetValues(proyecto);
                    await _dbGen.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Proyecto>> GetProyectosAsociados(int Id)
        {
            try
            {
                var _proyectosAsociados = await _dbGen.dbSetProyectoGEN
                    .AsNoTracking()
                    .Include(c => c.Contacto)
                    .Where(p => p.EmpresaId == Id)
                    .OrderBy(e => e.FechaInicio)
                    .ToListAsync();

                return _proyectosAsociados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetProyectosNoVigentes(int id){
            try{
                var entities= await _dbGen.dbSetProyectoGEN
                                    .Where(e=> e.EmpresaId== id && e.Estado==false)
                                    .Select(x=> new {
                                        x.ProyectoId,
                                        x.Nombre,
                                        x.NombreJefeProyecto,
                                        x.EmpresaId,
                                        x.FacturacionPlaneada,
                                        x.FacturacionReal
                                    })
                                    .AsNoTracking().ToListAsync();
                return entities;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<IEnumerable<Object>> GetProyectosAsociadosUnidadesEmpresas(string Id)
        {
            try
            {
                var _proyectosAsociados = await _dbGen.dbSetProyectoGEN
                        .AsNoTracking()
                        .Include(c => c.Contacto)
                        .Where(p => p.ClaveUnidadEmpresa == Id)
                        .Select(x => new
                        {
                            x.ProyectoId,
                            x.Nombre,
                            x.Contacto,
                            x.Costo,
                            x.FacturacionReal,
                            x.FacturacionPlaneada,
                            x.FechaInicio,
                            x.FechaFin,
                            x.NombreJefeProyecto,
                            x.NumjefeProyecto
                        })
                        .OrderBy(e => e.FechaInicio)
                        .ToListAsync();

                return _proyectosAsociados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetProyectosAsociadosInactivosUnidadesEmpresas(string Id)
        {
            try
            {
                var _proyectosAsociados = await _dbGen.dbSetProyectoGEN
                        .AsNoTracking()
                        .Include(c => c.Contacto)
                        .Where(p => p.ClaveUnidadEmpresa == Id && p.Estado==false)
                        .Select(x => new
                        {
                            x.ProyectoId,
                            x.Nombre,
                            x.Contacto,
                            x.Costo,
                            x.FacturacionReal,
                            x.FacturacionPlaneada,
                            x.FechaInicio,
                            x.FechaFin,
                            x.NombreJefeProyecto,
                            x.NumjefeProyecto
                        })
                        .OrderBy(e => e.FechaInicio)
                        .ToListAsync();

                return _proyectosAsociados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene todos los proyectos asociados de una empresa
        /// </summary>
        /// <returns>Object[]</returns>
        /// <param name="id">id de la empresa</param>
        public async Task<Object[]> GetProyectosAsociadosVigentes(int id)
        {
            try
            {
                DateTime fechaActual = DateTime.Now;
                var entities = await _dbGen.dbSetProyectoGEN.AsNoTracking().Include(c => c.Contacto)
                    .Where(e => e.EmpresaId == id && e.Estado==true).OrderByDescending(e => e.FechaInicio).ToListAsync();
                Object[] lista = new Object[entities.Count];

                foreach (var obj in entities)
                {
                    var nombreContacto = "Dato no disponible";
                    if (obj.Contacto != null)
                    {
                        nombreContacto = obj.Contacto.NombreCompleto;
                    }
                    lista[entities.IndexOf(obj)] = new
                    {
                        numeroProyecto = obj.ProyectoId,
                        nombre = obj.Nombre,
                        nombreContacto = nombreContacto,
                        monto = obj.Costo,
                        fechaInicio = obj.FechaInicio,
                        fechaFinal = obj.FechaFin,
                        obj.NumjefeProyecto,
                        obj.NombreJefeProyecto
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
        /// Obtiene todos los proyectos vigentes de una empresa
        /// </summary>
        /// <returns>Object</returns>
        /// <param name="id">id de la empresa buscada</param>
        public async Task<Object> GetProyectosVigentesEmpresa(int id){
            try{
                var entities= await _dbGen.dbSetProyectoGEN
                                .Where(e=> e.EmpresaId== id && e.Estado==true)
                                .Select(x=> new{
                                    x.Nombre,
                                    x.ProyectoId,
                                    x.FacturacionPlaneada,
                                    x.FacturacionReal,
                                    x.NombreJefeProyecto,
                                    x.EmpresaId
                                })
                                .AsNoTracking().ToListAsync();
                return entities;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        /// <summary>
        /// Obtiene todos los proyectos asociados de una empresa
        /// </summary>
        /// <returns>Object[]</returns>
        /// <param name="id">id de la empresa</param>
        public async Task<IEnumerable<Object>> GetProyectosAsociadosVigentesUnidadesEmpresas(string id)
        {
            try
            {
                var entities = await _dbGen.dbSetProyectoGEN.AsNoTracking().Include(c => c.Contacto)
                    .Where(e => e.ClaveUnidadEmpresa == id && e.Estado == true)
                    .Select(x => new
                    {
                        x.ProyectoId,
                        x.Nombre,
                        x.Contacto,
                        x.Costo,
                        x.FacturacionReal,
                        x.FacturacionPlaneada,
                        x.FechaInicio,
                        x.FechaFin,
                        x.NombreJefeProyecto,
                        x.NumjefeProyecto
                    })
                    .OrderByDescending(e => e.FechaInicio).ToListAsync();

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Proyecto proyecto)
        {
            try
            {
                var _proyectoEmpresa = await _dbGen.dbSetProyectoGEN
                    .FirstOrDefaultAsync(c => c.ProyectoId == proyecto.ProyectoId);

                if (_proyectoEmpresa != null)
                {
                    _dbGen.Entry(_proyectoEmpresa).CurrentValues.SetValues(proyecto);
                    await _dbGen.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(Proyecto proyecto)
        {
            try
            {

                var _proyectoEmpresa = await _dbGen.dbSetProyectoGEN
                    .FirstOrDefaultAsync(c => c.ProyectoId == proyecto.ProyectoId);

                proyecto.EmpresaId = null;
                proyecto.ContactoId = null;
                proyecto.ClaveUnidadEmpresa = null;


                if (_proyectoEmpresa != null)
                {
                    _dbGen.Entry(_proyectoEmpresa).CurrentValues.SetValues(proyecto);
                    await _dbGen.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
