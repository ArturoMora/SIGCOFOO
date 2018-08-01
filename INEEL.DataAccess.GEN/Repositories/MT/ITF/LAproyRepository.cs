using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models.ITF;
using System.Linq;
using System.Linq.Dynamic;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Diagnostics;

namespace INEEL.DataAccess.GEN.Repositories.MT.ITF
{
    public class LAproyRepository : IDisposable
    {
        //----------- AYUDA:
        // LAproyRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // LAproy.- es el modelo
        // dbSetLAproys.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetLAproys =Categories                                  )
        // LAproyId.-  es el ID del modelo (ID de la tabla)
                            
                              
        private MT_Context _db;
        public LAproyRepository()
        {
            _db = new MT_Context();
        }                             

        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _db.dbSetInformeTFs
                               .Where(f => f.LAproyId !=null && f.EstadoITFFlujoId==4)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //public async Task<IEnumerable<LAproy>> OtrosMetodos(){ ... }
        public async Task<IEnumerable<InformeTecnicoFinal>> getData(DataServerSide ss, int EstadoITFFlujoId)
        {
            //EstadoITFFlujoId 4 is pubicado
            try
            {
                               
                var v = (from a in
                             _db.dbSetInformeTFs
                             .Include(x => x.Proyecto.Empresa)
                             .Include(x => x.Proyecto.UnidadOrganizacionalEmpresas)
                             .Include(x=>x.LActe)
                             .Include(x=>x.LAcap)
                             .Include(x=>x.LAproy)
                             .Where(x=>x.EstadoITFFlujoId>= EstadoITFFlujoId
                             && (x.LAproyId!=null && x.LAproyId>0))
                         select a);
                ss.recordsTotal = v.Count();
                //search  


                List<datosCliente> clientes = new List<datosCliente>();



                foreach (var obj in v)
                {

                    if (obj.Proyecto != null)
                    {

                        if (obj.Proyecto.Empresa != null)
                        {
                            string a = obj.Proyecto.Empresa.NombreEmpresa;


                            if (obj.Proyecto.UnidadOrganizacionalEmpresas != null) {
                                a = a + " " + obj.Proyecto.UnidadOrganizacionalEmpresas.NombreUnidad;
                            }

                            a = a.ToLower();

                            string caduax = "";

                            caduax = a.Replace("á", "a");
                            caduax = caduax.Replace("é", "e");
                            caduax = caduax.Replace("í", "i");
                            caduax = caduax.Replace("ó", "o");
                            caduax = caduax.Replace("ú", "u");
                            caduax = caduax.Replace("\r\n", " ");

                            datosCliente itemCliente = new datosCliente(obj.LAproyId.ToString(), caduax);

                            clientes.Add(itemCliente);

                        }
                    }

                }


                    if (!string.IsNullOrEmpty(ss.ClaveUnidad))
                {
                    UORepository uo = new UORepository();
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
                if (!String.IsNullOrEmpty(ss.searchValue))
                {
                   

                    var listaPalabrasClave = await GetPalabrasClave(ss.searchValue);
                    var proyecto = await GetJefeProyectoProyectoID(ss.searchValue);


                        List<int?> idSeleccionados = new List<int?>();

                        foreach (var elemento in clientes)
                    {

                        string cadenabusqueda = elemento.nombreDato;



                            if (cadenabusqueda.IndexOf(ss.searchValue) >0) {
                                int valor = int.Parse(elemento.idDato);
                                idSeleccionados.Add(valor);
                            }
                 
                       
                     }
                                       
                    v = v.Where(e =>listaPalabrasClave.Contains(e.LAproyId) || proyecto.Contains(e.LAproyId) || idSeleccionados.Contains(e.LAproyId)  );
                }

                if (!String.IsNullOrEmpty(ss.palabras))
                {
                    var pal = ss.palabras.Split(' ');
                    //foreach (var p in pal)
                    //  {

                    var listaPalabrasClave = await GetPalabrasClave(ss.palabras);
                    var listaInsumos = await GetInsumos(ss.palabras);
                    var listaEquipo = await GetEquipo(ss.palabras);
                    var listaGestion = await GetGestion(ss.palabras);
                    var listaCumplimiento = await GetCumplimiento(ss.palabras);


                    v = v.Where(e => listaPalabrasClave.Contains(e.LAproyId)|| listaInsumos.Contains(e.LAproyId)|| listaEquipo.Contains(e.LAproyId) || listaGestion.Contains(e.LAproyId) || listaCumplimiento.Contains(e.LAproyId));
                    //}
                }
                if (!String.IsNullOrEmpty(ss.proyectoId))
                {
                    v = v.Where(e => e.Proyecto.ProyectoId.Equals(ss.proyectoId));
                }
                if (!String.IsNullOrEmpty(ss.EmpresaId))
                {
                    v = v.Where(e => e.Proyecto.EmpresaId.ToString().Equals(ss.EmpresaId));
                }
                if (!String.IsNullOrEmpty(ss.NumjefeProyecto))
                {
                    v = v.Where(e => e.Proyecto.NumjefeProyecto.Equals(ss.NumjefeProyecto));
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


        
        public async Task<List<int?>> GetInsumos(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT LAproyId FROM MT.ITFLeccionesAprendidasProy where Insumos collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Insumos collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int?>> GetEquipo(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT LAproyId FROM MT.ITFLeccionesAprendidasProy where Equipo collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Equipo collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int?>> GetGestion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT LAproyId FROM MT.ITFLeccionesAprendidasProy where Gestion collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Gestion collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int?>> GetPalabrasClave(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT LAproyId FROM MT.ITFLeccionesAprendidasProy where Clave collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Clave collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int?>> GetCumplimiento(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT LAproyId FROM MT.ITFLeccionesAprendidasProy where Cumplimiento collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Cumplimiento collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int?>> GetJefeProyectoProyectoID(String likeNombre)
        {
            try
            {

                string query = " SELECT LAproyId FROM MT.InformeTecnicoFinal as itf left JOIN GEN.Proyectos as p ON  itf.ProyectoId = p.ProyectoId WHERE  p.ProyectoId LIKE '%" + likeNombre + "%' or p.NumjefeProyecto collate  Latin1_General_CI_AI like '%" + likeNombre + "%' or  p.NombreJefeProyecto  collate  Latin1_General_CI_AI like '%" + likeNombre + "%'  or  p.Nombre collate  Latin1_General_CI_AI  like '%" + likeNombre + "%'";
                var resultados = await _db.Database.SqlQuery<int?>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //public async Task<List<int?>> GetClientes(String likeNombre)
        //{
        //    try
        //    {

        //        string query = " SELECT LAproyId FROM MT.InformeTecnicoFinal as itf left JOIN GEN.Proyectos as p ON  itf.ProyectoId = p.ProyectoId WHERE  p.ProyectoId LIKE '%" + likeNombre + "%' or p.NumjefeProyecto collate  Latin1_General_CI_AI like '%" + likeNombre + "%' or  p.NombreJefeProyecto  collate  Latin1_General_CI_AI like '%" + likeNombre + "%'  or  p.Nombre collate  Latin1_General_CI_AI  like '%" + likeNombre + "%'";
        //        var resultados = await _db.Database.SqlQuery<int?>(query).ToListAsync();
        //        return resultados;

        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}



        public async Task<IEnumerable<LAproy>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetLAproys.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<LAproy> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetLAproys.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.LAproyId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(LAproy model)
        {
            try
            {

                _db.dbSetLAproys.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(LAproy model)
        {
            try
            {
                var _model = await _db.dbSetLAproys.FirstOrDefaultAsync(e => e.LAproyId == model.LAproyId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.dbSetLAproys.FirstOrDefaultAsync(e => e.LAproyId == id);
                if (_model != null)
                {
                    _db.dbSetLAproys.Remove(_model);
                    await _db.SaveChangesAsync();
                }
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

        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<LAproy>> GetWord(string Palabra)
        {
            try
            {
                //var entities = await _db.dbSetLAproys
                //    .AsNoTracking()
                //    .Where(e => e.Insumos.Contains(Palabra)
                //    || e.Equipo.Contains(Palabra)
                //    || e.Gestion.Contains(Palabra)
                //    || e.Cumplimiento.Contains(Palabra))
                //    .ToListAsync();
                var v = (from a in _db.dbSetLAproys select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                        e.Insumos.Contains(p)
                    || e.Equipo.ToLower().Contains(p)
                    || e.Gestion.ToLower().Contains(p)
                    || e.Cumplimiento.ToLower().Contains(p));
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





    }



    public class datosCliente {


        public string idDato { get; set;}
        public string nombreDato { get; set;}

        public datosCliente() {
        }


        public datosCliente(string a, string b) {
            idDato = a;
            nombreDato = b;
        }
    }


}
