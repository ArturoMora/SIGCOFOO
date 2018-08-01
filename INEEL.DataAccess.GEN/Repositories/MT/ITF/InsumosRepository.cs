using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.MT.Models.ITF;
using System.Linq;
using System.Linq.Dynamic;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class InsumosRepository : IDisposable
    {
        //----------- AYUDA:
        // InsumosRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // Insumos.- es el modelo
        // dbSetInsumos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          ::dbSetResultadosE =Categories                                  )
        // InsumosId.-  es el ID del modelo (ID de la tabla)


        MT_Context _db;
        GEN_Context _dbGen;

        public InsumosRepository()
        {
            _db = new MT_Context();
            _dbGen = new GEN_Context();
        }

        //public async Task<IEnumerable<Insumos>> OtrosMetodos(){ ... }
        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _db.dbSetInsumos
                              .Include(x => x.InformeTecnicoFinal)
                               .Where(f => f.InformeTecnicoFinal.EstadoITFFlujoId == estadoFlujo)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Insumos>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetInsumos.AsNoTracking()
                    //.Where(e => e.NombreIns.Contains(searchText))
                    //.Where(e => e.NombreIns.Contains(searchText))
                    .Include(e => e.AdjuntoITFInsumo)
                    .Include("AdjuntoITFInsumo.Adjunto")
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Insumos>> getData(DataServerSide ss)
        {
            try
            {
                int EstadoITFFlujoId = 4;
                var v = (from a in
                             _db.dbSetInsumos
                             .Include(x => x.InformeTecnicoFinal.Proyecto)
                             .Include(x => x.TipoAcceso)
                             .Include(x => x.TipoInsumo)
                             .Where(x => x.InformeTecnicoFinal.EstadoITFFlujoId == EstadoITFFlujoId)
                         select a);
                ss.recordsTotal = v.Count();


                //search  
                if (!string.IsNullOrEmpty(ss.ClaveUnidad))
                {
                    UORepository uo = new UORepository(_dbGen);
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

                    v = v.Where(e => clavesUnidad.Contains(e.InformeTecnicoFinal.Proyecto.UnidadOrganizacionalId));
                }



                //BUSCAR POR 
                if (!String.IsNullOrEmpty(ss.palabras))
                {

                    var listaDA0 = await GetPKInsumo(ss.palabras);
                    var listaDA2 = await GetPKInsumoUbicacion(ss.palabras);
                    var listaDA3 = await GetPKInsumoResponsable(ss.palabras);
                   

                    
                        v = v.Where(e =>
                                   listaDA0.Contains(e.InsumosId)
                                || listaDA2.Contains(e.InsumosId)
                                || listaDA3.Contains(e.InsumosId)
                        );
                   
                }


                if (!String.IsNullOrEmpty(ss.searchValue))
                {
                    var p = ss.searchValue;


                    var listaDA0 = await GetPKInsumo(ss.searchValue);
                    var listaDA2 = await GetPKInsumoUbicacion(ss.searchValue);
                    var listaDA3 = await GetPKInsumoResponsable(ss.searchValue);
                    var tipoInsumo = await GetTipoInsumo(ss.searchValue);




                    v = v.Where(e => listaDA0.Contains(e.InsumosId)
                            || listaDA3.Contains(e.InsumosId)
                            || listaDA2.Contains(e.InsumosId)
                            
                            || tipoInsumo.Contains(e.TipoIns)
                    );

                }



                if (!String.IsNullOrEmpty(ss.proyectoId))
                {
                    var listaDA0 = await GetDAProyecto(ss.proyectoId);
                    v = v.Where(e => listaDA0.Contains(e.InformeTecnicoFinalId));
                }


                //TIPO DE INSUMO
                if (!String.IsNullOrEmpty(ss.Tipo))
                {
                    var listaDA0 = await GetTipoInsumoID(ss.Tipo);
                    v = v.Where(e => listaDA0.Contains(e.TipoIns));
                }


                if (!String.IsNullOrEmpty(ss.NumjefeProyecto))
                {
                    var listaDA0 = await GetJefeProyecto(ss.NumjefeProyecto);

                    v = v.Where(e => listaDA0.Contains(e.InformeTecnicoFinalId));
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
        public async Task<Insumos> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetInsumos
                    .Include(e => e.AdjuntoITFInsumo)
                    .Include("AdjuntoITFInsumo.Adjunto")
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.InsumosId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(Insumos model)
        {
            try
            {

                _db.dbSetInsumos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(Insumos model)
        {
            try
            {
                var _model = await _db.dbSetInsumos.FirstOrDefaultAsync(e => e.InsumosId == model.InsumosId);
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
                var _model = await _db.dbSetInsumos.FirstOrDefaultAsync(e => e.InsumosId == id);
                if (_model != null)
                {
                    _db.dbSetInsumos.Remove(_model);
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
        public async Task<Insumos> GetInsumo(int id)
        {
            try
            {
                var entities = await _db.dbSetInsumos
                    .Include(e => e.InformeTecnicoFinal.Proyecto)
                    .Include(e => e.AdjuntoITFInsumo)
                    .Include(e => e.TipoInsumo)
                    .Include("AdjuntoITFInsumo.Adjunto")
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.InsumosId == id);

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<Insumos>> GetWord(string Palabra)
        {
            try
            {
                //Como buscar el tipo Privado???
                //if (Palabra.Equals("privado"))
                //{
                //    e => e.UbicacionResIns.Contains(Palabra)
                //}
                //var entities = await _db.dbSetInsumos
                //    .AsNoTracking()
                //    .Where(e => e.NombreIns.Contains(Palabra)
                //    || e.DescripcionIns.Contains(Palabra)
                //    || e.ResponsableIns.Contains(Palabra)
                //    || e.UbicacionResIns.Contains(Palabra))
                //    .Include(e => e.AdjuntoITFInsumo)
                //    .Include("AdjuntoITFInsumo.Adjunto")
                //    .ToListAsync();


                var buscar = await _db.dbSetAdjuntoITFInsumos
                    .AsNoTracking()
                    .ToListAsync();
                var v = (from a in _db.dbSetInsumos
                    .Include(e => e.InformeTecnicoFinal.Proyecto)
                    .Include(e => e.AdjuntoITFInsumo)
                    .Include("AdjuntoITFInsumo.Adjunto")
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                        e.NombreIns.ToLower().Contains(p)
                    || e.DescripcionIns.ToLower().Contains(p)
                    || e.TipoInsumo.DescripcionInsumo.ToLower().Contains(p)
                    || e.ResponsableIns.ToLower().Contains(p)
                    || e.UbicacionResIns.ToLower().Contains(p));
                    }
                }
                var entities = await v.AsNoTracking().ToListAsync();

                if (buscar != null)
                {
                    foreach (var adjuntar in buscar)
                    {
                        var model = await _dbGen.dbSetAdjuntos
                             .Where(f => f.AdjuntoId == adjuntar.AdjuntoId
                             && f.nombre.Contains(Palabra))
                            .ToListAsync();
                        if (model.Count != 0)
                        {
                            var entiti = await _db.dbSetAdjuntosITF
                                .FirstOrDefaultAsync(g => g.AdjuntoId == adjuntar.AdjuntoId);
                            var nuevo = await _db.dbSetInsumos
                                .Include(e => e.AdjuntoITFInsumo)
                                .Include("AdjuntoITFInsumo.Adjunto")
                                .AsNoTracking()
                                .FirstOrDefaultAsync(e => e.InsumosId == adjuntar.InsumosId);
                            entities.Add(nuevo);
                        }
                    }
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<Insumos>> GetJefe(string Palabra)
        {
            try
            {
                var v = (from a in _db.dbSetInsumos
                    .Include(e => e.InformeTecnicoFinal.Proyecto)
                    .Include(e => e.AdjuntoITFInsumo)
                    .Include("AdjuntoITFInsumo.Adjunto")
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                        e.InformeTecnicoFinal.Proyecto.NombreJefeProyecto.ToLower().Contains(p));
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
        //Para Back-End pero como encontrar el nombre de adjunto? y dentro de archivos?
        public async Task<IEnumerable<Insumos>> GetProy(string Palabra)
        {
            try
            {
                var v = (from a in _db.dbSetInsumos
                    .Include(e => e.InformeTecnicoFinal.Proyecto)
                    .Include(e => e.AdjuntoITFInsumo)
                    .Include("AdjuntoITFInsumo.Adjunto")
                         select a);

                if (!String.IsNullOrEmpty(Palabra))
                {
                    var pal = Palabra.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e =>
                        e.InformeTecnicoFinal.ProyectoId.Contains(p));
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




        public async Task<List<int>> GetDALikePalabrasClave(String likeNombre)
        {
            try
            {
                var resultados = await _db.Database.SqlQuery<int>
                ("SELECT InsumosId FROM MT.ITFInsumos where NombreIns collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetPKInsumo(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InsumosId FROM MT.ITFInsumos where NombreIns collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  NombreIns collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


       
        public async Task<List<int>> GetPKInsumoDesc(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InsumosId FROM MT.ITFInsumos where DescripcionIns collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  DescripcionIns collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


       
        public async Task<List<int>> GetPKInsumoUbicacion(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InsumosId FROM MT.ITFInsumos where UbicacionResIns collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  UbicacionResIns collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
               

        public async Task<List<int>> GetPKInsumoResponsable(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT InsumosId FROM MT.ITFInsumos where ResponsableIns collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  ResponsableIns collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<string>> GetDAProyecto(String likeNombre)
        {
            try
            {
                var resultados = await _db.Database.SqlQuery<string>
                ("SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal where ProyectoId collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<string>> GetJefeProyecto(String likeNombre)
        {
            try
            {
                var resultados = await _db.Database.SqlQuery<string>
                (" SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal as itf left JOIN GEN.Proyectos as p ON  itf.ProyectoId = p.ProyectoId WHERE p.NumjefeProyecto collate  Latin1_General_CI_AI LIKE '" + likeNombre + "'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<string>> GetJefeProyectoProyectoID(String likeNombre)
        {
            try
            {

                string query = " SELECT InformeTecnicoFinalId FROM MT.InformeTecnicoFinal as itf left JOIN GEN.Proyectos as p ON  itf.ProyectoId = p.ProyectoId WHERE  p.ProyectoId LIKE '%" + likeNombre + "%' or p.NumjefeProyecto collate  Latin1_General_CI_AI like '%" + likeNombre + "%' or  p.NombreJefeProyecto  collate  Latin1_General_CI_AI like '%" + likeNombre + "%'  or  p.Nombre collate  Latin1_General_CI_AI  like '%" + likeNombre + "%'";
                var resultados = await _db.Database.SqlQuery<string>(query).ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int>> GetTipoInsumo(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TipoInsumoId FROM MT.TipoInsumo where DescripcionInsumo collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  DescripcionInsumo collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }




        public async Task<List<int>> GetTipoInsumoID(String likeNombre)
        {
            try
            {
               
                var query = "SELECT TipoInsumoId FROM MT.TipoInsumo where TipoInsumoId = " + likeNombre;
               
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }
}
