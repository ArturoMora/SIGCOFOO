using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Repositories.MT.ITF;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class SoftwarePersonalRepository : IDisposable
    {
        //----------- AYUDA:
        // SoftwarePersonalRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // SoftwarePersonal.- es el modelo
        // dbSetSoftwarePersonal.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetSoftwarePersonal =Categories                                  )
        // SoftwarePersonalId.-  es el ID del modelo (ID de la tabla)

                              
        private MT_Context _db;


      


        public SoftwarePersonalRepository()
        {
            _db = new MT_Context();
        }
        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _db.dbSetSoftwarePersonal
                                    .Where(f => f.EstadoFlujoId == estadoFlujo) //TODO checar otros atributos de estado, como eliminado logico
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }                                                   
        public async Task<IEnumerable<SoftwarePersonal>> getData(DataServerSide ss)
        {
            UORepository uo = new UORepository();
            try
            {
               
                var v = (from a in
                             _db.dbSetSoftwarePersonal             
                             .Include(x=>x.Proyecto)
                             .Include(x=>x.TipoSoftware)
                             .Include(x=>x.Autores)
                             .Include(x=> x.DerechosAutor)
                             .Where(x => x.EstadoFlujoId ==3)
                         select a);
                ss.recordsTotal = v.Count();
                


                if (!string.IsNullOrEmpty(ss.ClaveUnidad))
                {

                    //var uni = await uo.GetByIdWithChildren(ss.ClaveUnidad);
                    //HashSet<String> clavesUnidad = null;
                    //if (uni.tipoO < 3)
                    //{
                    //    var unidades = uni.Children.Select(x => x.ClaveUnidad).ToList();
                    //    clavesUnidad = new HashSet<String>(unidades);
                    //}
                    //else
                    //{
                    //    clavesUnidad = new HashSet<String>();
                    //    clavesUnidad.Add(ss.ClaveUnidad);
                    //}

                    v = v.Where(x => x.GerenciaClave == ss.ClaveUnidad);

                    //v = v.Where(e => clavesUnidad.Contains(e.Proyecto.UnidadOrganizacionalId));
                }

                                
                if (!String.IsNullOrEmpty(ss.Titulo)) //busqueda por titulo
                {
                    var listaDA = await GetPKTitulo(ss.Titulo);
                    v = v.Where(e => listaDA.Contains(e.SoftwarePersonalId));
                }


                if (!String.IsNullOrEmpty(ss.proyectoId))
                {
                    var listaDA = await GetDALikeProyecto(ss.proyectoId);
                    v = v.Where(e => listaDA.Contains(e.SoftwarePersonalId));
                }

                //if (!String.IsNullOrEmpty(ss.DerechoAutor))
                //{
                //    var listaDA = await GetPKDerechoAutor(ss.DerechoAutor);
                //    v = v.Where(e => listaDA.Contains(e.SoftwarePersonalId));
                //}

                if (ss.DerechosAutorId != null)
                {
                    v = v.Where(x => x.DerechosAutorId == ss.DerechosAutorId);
                }

                if (!String.IsNullOrEmpty(ss.Tipo))
                {
                    v = v.Where(e => e.TipoSoftwareId.ToString().Equals(ss.Tipo));
                }

                if (!String.IsNullOrEmpty(ss.Autor))
                {
                    var listaDA = await GetPKAutor(ss.Autor);
                    v = v.Where(e => listaDA.Contains(e.SoftwarePersonalId));
                }

                if (!String.IsNullOrEmpty(ss.searchValue))
                {

                    PersonasRepository rp = new PersonasRepository();
                    var clavesPer = await rp.GetAllClavesByLikeNombreLatin1(ss.searchValue);
                    
                    //var autor= await 
                    var softwares = await _db.dbSetAutorSoftware.AsNoTracking()
                    .Where(x => clavesPer.Contains(x.ClaveAutor) )
                    .Select(x => x.SoftwarePersonalId)
                    .ToListAsync();

                    var listaUnidades = await uo.GetPorNombreUnidad(ss.searchValue);
                    var titulo        = await GetPKTitulo(ss.searchValue);
                    var tipoSoftware  = await GetPKTipoSoftware(ss.searchValue);
                    var proyecto      = await GetProyectos(ss.searchValue);
                    var proyecto2   = await GetProyectos2(ss.searchValue);
                    var listaDA = await GetDerechosAutorByCollate(ss.searchValue);
                    //var listaAutor = await GetProyectos(ss.searchValue);


                    v = v.Where(e => titulo.Contains(e.SoftwarePersonalId)
                             || listaDA.Contains(e.DerechosAutorId)
                             || softwares.Contains(e.SoftwarePersonalId)
                             || listaUnidades.Contains(e.GerenciaClave)
                             || proyecto.Contains(e.ProyectoId)
                              || proyecto2.Contains(e.ProyectoId)
                             || tipoSoftware.Contains(e.TipoSoftwareId)
                             

                    );
                }
                

                    //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }
                                
                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                if (entities != null && entities.Count > 0)
                {
                    AutorSoftwareRepository aut = new AutorSoftwareRepository(_db);
                    var listaSW = entities.Select(x => x.SoftwarePersonalId).ToList();
                    var clavesAutores = await aut.GetClavesAutorBySoftwarsIdCollection(listaSW);

                    HashSet<String> clavesEmpleado = new HashSet<string>(clavesAutores);


                    PersonasRepository p = new PersonasRepository();
                    var personas = await p.GetAllCollectionMAXTodos(clavesEmpleado);
                    List<Personas> pers = personas.ToList();
                    
                    //var unidadesOrgs = (await uo.GetAllCollectionMAX(entities.Where(x => x.Proyecto != null).Select(x => x.Proyecto.UnidadOrganizacionalId).ToList())).ToList();
                    foreach (var e in entities)
                    {
                        foreach (var a in e.Autores)
                        {
                            try
                            {
                                string cad = a.ClaveAutor.Trim();
                                a.ClaveAutor = a.ClaveAutor.Trim();
                                a.NombreCompleto = pers.Find(x => x.ClavePersona == cad).NombreCompleto;
                            }
                            catch (Exception ex) { }
                        }


                        if (e.GerenciaClave != null)
                            e.NombreUnidadOrganizacional = await uo.GetNameById(e.GerenciaClave);
                    }
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int?>> GetDerechosAutorByCollate(string likeNombre)
        {
            try
            {
                PI_Context picontext = new PI_Context();
                var palabras = likeNombre.Split(' ');
                var query = "SELECT DerechosAutorId FROM PI.tab_DerechosAutor where Titulo collate Latin1_General_CI_AI LIKE '%";
                foreach (var palabra in palabras)
                {
                    query += palabra + "%' and Titulo collate Latin1_General_CI_AI LIKE '%";
                }
                var subconsulta = query.Substring(0, query.Length - 47);
                var resultados = await picontext.Database.SqlQuery<int?>(subconsulta).ToListAsync();
                return resultados;
            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<SoftwarePersonal>> GetAllByUsurio(string id)
        {
            try
            {
                var SoftwarePersonalIds = await _db.dbSetAutorSoftware.AsNoTracking()
                        .Include(x => x.SoftwarePersonal.TipoSoftware)
                        .Where(e => e.ClaveAutor == id)
                        .Select(x=> x.SoftwarePersonal.SoftwarePersonalId)
                       .ToListAsync();


                var entities = await _db.dbSetSoftwarePersonal.AsNoTracking()
                    .Include(x=>x.TipoSoftware)
                    .Include(x=>x.Proyecto)
                    .Include(x=>x.EstadoFlujo)
                    //.Include(x=>x.Autores)
                    .Where(x=> SoftwarePersonalIds.Contains(x.SoftwarePersonalId))
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SoftwarePersonal>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetSoftwarePersonal.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SoftwarePersonal>> GetAllByStado(Boolean estado)
        {
            try
            {
                var entities = await _db.dbSetSoftwarePersonal.AsNoTracking()
                    .Where(x=>x.Estado== estado)
                    .Include(x=>x.Autores)                    
                    .Include(x=>x.AdjuntoCodigoFuente)                    
                    .Include(x=>x.AdjuntoManualTecnico)                    
                    .Include(x=>x.AdjuntoManualUsuario)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public SoftwarePersonal Get_(long id)
        {
            try
            {
                var entities = _db.dbSetSoftwarePersonal
                    // .Include(x=> x.FK)
                    .FirstOrDefault(e => e.SoftwarePersonalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }       
        public async Task<SoftwarePersonal> GetByIdDetails(long id)
        {
            try
            {
                var entities = await _db.dbSetSoftwarePersonal.AsNoTracking()
                    .Include(x=> x.Proyecto)
                    .Include(x=> x.TipoSoftware)
                    .Include(x=> x.Autores)
                    .Include(x=> x.AdjuntoManualTecnico)
                    .Include(x=> x.AdjuntoManualUsuario)
                    .Include(x=> x.AdjuntoCodigoFuente)
                    .Include(x=> x.TipoAccesoCat)
                    .Include(x=> x.EstadoFlujo)
                    .Include(x=> x.DerechosAutor)
                    .FirstOrDefaultAsync(e => e.SoftwarePersonalId == id);
                PersonasRepository p = new PersonasRepository();
                foreach (var x in entities.Autores)
                {
                    var per=await p.GetByClaveWithoutStatus(x.ClaveAutor);
                    if(per!=null)
                        x.NombreCompleto = per.NombreCompleto;
                }

                
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<SoftwarePersonal> GetById(long id)
        {
            try
            {
                var entities = await _db.dbSetSoftwarePersonal.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.SoftwarePersonalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(SoftwarePersonal model)
        {
            try
            {

                _db.dbSetSoftwarePersonal.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task<long> CreateAdjuntoSwMT(Adjunto model)
        {
            try
            {
                model.ModuloId = "MT";
                _db.dbSetAdjuntoOfMT.Add(model);
                await _db.SaveChangesAsync();
                return model.AdjuntoId;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(SoftwarePersonal model)
        {
            try
            {
                model.TipoAccesoCat = null;
                model.TipoSoftware = null;
                var _model = await _db.dbSetSoftwarePersonal.Where(x => x.SoftwarePersonalId == model.SoftwarePersonalId).FirstOrDefaultAsync();
                try
                {
                    if (model.ManualUsuario == null)
                    {
                        if (_model.ManualUsuario != null)
                        {
                            var id = _model.ManualUsuario;
                            _model.ManualUsuario = null;
                            await _db.SaveChangesAsync();

                            await new AdjuntoRepository().Delete(id);
                        }
                        var idManuUsuario = await CreateAdjuntoSwMT(model.AdjuntoManualUsuario);
                        model.ManualUsuario = idManuUsuario;
                    }
                    else { 

                        _db.dbSetAdjuntoOfMT.Attach(model.AdjuntoManualUsuario);
                        _db.Entry(model.AdjuntoManualUsuario).State = EntityState.Modified;
                        await _db.SaveChangesAsync();
                    }
                }
                catch (Exception ex) {
                    _db = new MT_Context();
                }
                try
                {
                    if (model.ManualTecnico == null)
                    {
                        if (_model.ManualTecnico != null)
                        {
                            var id = _model.ManualTecnico;
                            _model.ManualTecnico = null;
                            await _db.SaveChangesAsync();

                            await new AdjuntoRepository().Delete(id);
                        }
                        var idManuTecnico = await CreateAdjuntoSwMT(model.AdjuntoManualTecnico);
                        model.ManualTecnico = idManuTecnico;
                    }
                    else
                    {
                        _db.dbSetAdjuntoOfMT.Attach(model.AdjuntoManualTecnico);
                        _db.Entry(model.AdjuntoManualTecnico).State = EntityState.Modified;
                        await _db.SaveChangesAsync();
                    }
                }
                catch (Exception ex) { _db = new MT_Context(); }
                try
                {
                    if (model.CodigoFuente == null)
                    {
                        if (_model.CodigoFuente != null)
                        {
                            var id = _model.CodigoFuente;
                            _model.CodigoFuente = null;
                            await _db.SaveChangesAsync();

                            await new AdjuntoRepository().Delete(id);
                        }
                        var idcodFuente = await CreateAdjuntoSwMT(model.AdjuntoCodigoFuente);
                        model.CodigoFuente = idcodFuente;
                    }
                    else
                    {
                        _db.dbSetAdjuntoOfMT.Attach(model.AdjuntoCodigoFuente);
                        _db.Entry(model.AdjuntoCodigoFuente).State = EntityState.Modified;
                        await _db.SaveChangesAsync();
                    }
                }
                catch (Exception ex) { _db = new MT_Context(); }

                foreach (var a in model.Autores)
                {
                    if (a.AutorSoftwareId < 1) {
                        try
                        {
                            a.SoftwarePersonalId = model.SoftwarePersonalId;
                            _db.dbSetAutorSoftware.Add(a);
                            await _db.SaveChangesAsync();
                        }
                        catch(Exception ex1)
                        {
                            _db = new MT_Context();
                        }
                    }
                }
            
                
                if ( model!=null)
                {
                    _db.dbSetSoftwarePersonal.Attach(_model);
                    _db.Entry(model).State = EntityState.Detached;
                    _db.Entry(_model).CurrentValues.SetValues(model);

                    //_db.Entry(_model).State = EntityState.Detached;
                    //_db.dbSetSoftwarePersonal.Attach(model);
                    //_db.Entry(model).State = EntityState.Modified;

                    await _db.SaveChangesAsync();
                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task DeleteAutor(long id)
        {
            try
            {
                var _model = await _db.dbSetAutorSoftware.FirstOrDefaultAsync(e => e.AutorSoftwareId == id);
                if (_model != null)
                {
                    _db.dbSetAutorSoftware.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.dbSetSoftwarePersonal.FirstOrDefaultAsync(e => e.SoftwarePersonalId == id);
                if (_model != null)
                {
                    _db.dbSetSoftwarePersonal.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateEstado(SoftwarePersonal TD)
        {
            try
            {
                var result = await _db.dbSetSoftwarePersonal.FirstOrDefaultAsync(e => e.SoftwarePersonalId == TD.SoftwarePersonalId);
                if (result != null)
                {
                    result.EstadoFlujoId = TD.EstadoFlujoId;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }     
        public async Task<List<int>> GetPKTitulo(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT SoftwarePersonalId FROM MT.SoftwarePersonal where Nombre collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Nombre collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetPKComentarios(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT SoftwarePersonalId FROM MT.SoftwarePersonal where Comentarios collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Comentarios collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetPKPlataforma(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT SoftwarePersonalId FROM MT.SoftwarePersonal where PlataformaDesarrollo collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  PlataformaDesarrollo collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetPKDescripcionFuncional(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT SoftwarePersonalId FROM MT.SoftwarePersonal where DescripcionFuncional collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  DescripcionFuncional collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetPKDerechoAutor(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT SoftwarePersonalId FROM MT.SoftwarePersonal where DerechoAutor collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  DerechoAutor collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetDALikeProyecto(String likeNombre)
        {
            try
            {
                var resultados = await _db.Database.SqlQuery<int>
                ("SELECT SoftwarePersonalId FROM MT.SoftwarePersonal where ProyectoId collate  Latin1_General_CI_AI LIKE '%" + likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<int>> GetPKAutor(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT SoftwarePersonalId FROM MT.AutorSoftware where ClaveAutor collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  ClaveAutor collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<List<int?>> GetPKTipoSoftware(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT TipoSoftwareId FROM MT.cat_TipoSoftware where Nombre collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and  Nombre collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int?>(query + "'%%'").ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<List<string>> GetProyectos(String likeNombre)
        {
            try
            {
               
                var palabras = likeNombre.Split(' ');
                var query = "SELECT DISTINCT S.ProyectoId FROM MT.SoftwarePersonal AS S , GEN.Proyectos AS P WHERE S.ProyectoId = P.ProyectoId AND " ;
               


                foreach (var palabra in palabras)
                {
                    query = query +  " P.Nombre collate  Latin1_General_CI_AI LIKE " + "'%" + palabra + "%' and  P.Nombre collate  Latin1_General_CI_AI LIKE  ";
                   

                }

                query = query + "'%%'" ;


              

                var resultados = await _db.Database.SqlQuery<string>(query).ToListAsync();
                return resultados;

           

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<List<string>> GetProyectos2(String likeNombre)
        {
            try
            {

                var palabras = likeNombre.Split(' ');
                var query = "SELECT DISTINCT S.ProyectoId FROM MT.SoftwarePersonal AS S WHERE  ";
                


                foreach (var palabra in palabras)
                {
                    query = query + " s.ProyectoId  LIKE "  + "'%" + palabra + "%' and  s.ProyectoId  LIKE  ";
                   

                }

                query = query + "'%%'" ;




                var resultados = await _db.Database.SqlQuery<string>(query).ToListAsync();
                return resultados;



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
