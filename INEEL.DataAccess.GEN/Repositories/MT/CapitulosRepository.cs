using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class CapitulosRepository : IDisposable
    {
        //----------- AYUDA:
        // CapitulosRepository: nombre de clase (y tipicamente el constructor)
        // MT_Context.- tu Contexto : DbContext
        // Capitulos.- es el modelo
        // dbSetCAT_Capitulos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetCAT_Capitulos =Categories                                  )
        // CapitulosId.-  es el ID del modelo (ID de la tabla)


        private MT_Context _db;
        GEN_Context _dbGen;
        public CapitulosRepository()
        {
            _db = new MT_Context();
            _dbGen = new GEN_Context();
            _db.Database.Log = Escribe.Write;
        }

        //public async Task<IEnumerable<Capitulos>> OtrosMetodos(){ ... }
        public async Task<int> countByStatus(int estadoFlujo)
        {
            try
            {
                return await (from t in _db.dbSetCapitulos
                               .Where(f => f.EstadoFlujoId == estadoFlujo) //TODO checar otros atributos de estado, como eliminado logico
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Capitulos>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCapitulos.AsNoTracking()
                    //.Include(e=>e.AdjuntoCapitulos)
                    //.Include(e=>e.AutorExternoCapitulo)
                    //.Include(e=>e.AutorInternoCapitulo)
                    //.Include(e=>e.EditoresCapitulo)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Capitulos> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetCapitulos.AsNoTracking()
                    //.Include(e => e.Adjunto)
                    //.Include("AdjuntoCapitulos.Adjunto")
                    .Include(e => e.AutorExternoCapitulo)
                    .Include(e => e.AutorInternoCapitulo)
                    .Include(e => e.EditoresCapitulo)
                    .Include(e => e.EstadoFlujo)
                    .Include(e=>e.Adjunto)
                    .FirstOrDefaultAsync(e => e.CapitulosId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<Capitulos> Create(Capitulos model)
        {
            try
            {
                var result = _db.dbSetCapitulos.Add(model);
                await _db.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Capitulos model)
        {
            try
            {
                var _model = await _db.dbSetCapitulos.FirstOrDefaultAsync(e => e.CapitulosId == model.CapitulosId);
                if (_model != null)
                {
                    foreach (var item in model.EditoresCapitulo)
                    {
                        if (item.EditoresCapituloId == 0)
                        {
                            var result = _db.dbSetEditoresCapitulo.Add(item);
                            await _db.SaveChangesAsync();
                        }
                        else
                        {
                            if (item.Editor_Nombre.Equals("eliminar"))
                            {
                                var result = await _db.dbSetEditoresCapitulo.FirstOrDefaultAsync(e => e.EditoresCapituloId == item.EditoresCapituloId);
                                if (result != null)
                                {
                                    _db.dbSetEditoresCapitulo.Remove(result);
                                    await _db.SaveChangesAsync();
                                }
                            }
                        }
                    }

                    foreach (var item in model.AutorExternoCapitulo)
                    {
                        if (item.AutorExternoCapituloId == 0)
                        {
                            var result = _db.dbSetAutorExternoCapitulo.Add(item);
                            await _db.SaveChangesAsync();
                        }
                        else
                        {
                            if (item.Nombre.Equals("eliminar"))
                            {
                                var result = await _db.dbSetAutorExternoCapitulo.FirstOrDefaultAsync(e => e.AutorExternoCapituloId == item.AutorExternoCapituloId);
                                if (result != null)
                                {
                                    _db.dbSetAutorExternoCapitulo.Remove(result);
                                    await _db.SaveChangesAsync();
                                }
                            }
                        }
                    }

                    foreach (var item in model.AutorInternoCapitulo)
                    {
                        if (item.AutorInternoCapituloId == 0)
                        {
                            var result = _db.dbSetAutorInternoCapitulo.Add(item);
                            await _db.SaveChangesAsync();
                        }
                        else
                        {
                            if (item.NombreCompleto.Equals("eliminar"))
                            {
                                var result = await _db.dbSetAutorInternoCapitulo.FirstOrDefaultAsync(e => e.AutorInternoCapituloId == item.AutorInternoCapituloId);
                                if (result != null)
                                {
                                    _db.dbSetAutorInternoCapitulo.Remove(result);
                                    await _db.SaveChangesAsync();
                                }
                            }
                        }
                    }


                    if (model.Adjunto != null)
                    {
                        try
                        {

                            AdjuntoRepository adjuntoRepo = new AdjuntoRepository();

                            if (_model.AdjuntoId != null)  //Elimina el adjunto anterior (el que esta en la base de datos)
                            {
                                var id = _model.AdjuntoId;
                                _model.AdjuntoId = null;
                                
                                await _db.SaveChangesAsync();
                                await adjuntoRepo.Delete(id);
                                await _dbGen.SaveChangesAsync();

                            }

                            var adjunto = await adjuntoRepo.CreateAd(model.Adjunto);
                            model.AdjuntoId = adjunto.AdjuntoId;
                            //await _dbGen.SaveChangesAsync();

                            if (model.EstadoFlujoId == 3)
                            {
                                await new NuevoOCRepository().Create(
                                new NuevoOC("MT", "CAPITULO", model.TituloCapitulo,
                                "indexMT.html#/CapituloDetails/" + model.CapitulosId
                                    ));
                            }

                            
                        }
                        catch (Exception e)
                        {
                            throw new Exception(e.Message, e);
                        }

                    }
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();


                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(model.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Capitulos model)
        {
            try
            {
                var _model = await _db.dbSetCapitulos.FirstOrDefaultAsync(e => e.CapitulosId == model.CapitulosId);
                if (_model != null)
                {
                    _model.EstadoFlujoId = model.EstadoFlujoId;
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
                var _model = await _db.dbSetCapitulos.FirstOrDefaultAsync(e => e.CapitulosId == id);
                if (_model != null)
                {
                    _db.dbSetCapitulos.Remove(_model);
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
        public async Task<IEnumerable<Capitulos>> GetByIdColaboracion(IEnumerable<AutorInternoCapitulo> colaboracionPonencia)
        {
            try
            {
                var CapitulosId=  colaboracionPonencia.Select(x => x.CapitulosId).ToList();

                List<Capitulos> Capitulos = new List<Capitulos>();

                Capitulos = await _db.dbSetCapitulos.Where(x => CapitulosId.Contains(x.CapitulosId))
                    .Where(x => x.EstadoFlujoId == 3).Include(x=>x.EstadoFlujo)
                    .ToListAsync();

                return Capitulos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);

            }
        }
        public async Task<IEnumerable<AutorInternoCapitulo>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _db.dbSetAutorInternoCapitulo.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Capitulos>> GetByClave(string clave)
        {
            try
            {
                var result = await _db.dbSetCapitulos.Where(e => e.ClavePersona.Equals(clave) && e.EstadoActivoId == 1)
                                        .Include(e => e.EstadoFlujo)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Capitulos>> GetByClaveAutor(string id)
        {
            List<Capitulos> ListCursoInterno = new List<Capitulos>();
            try
            {
                var v = (from a in
                            _db.dbSetCapitulos
                                        .Include(e => e.EstadoFlujo)
                         select a);

                var entiti = await _db.dbSetAutorInternoCapitulo
                    .Where(e => e.ClavePersona.ToString().Equals(id.ToString()))
                    .AsNoTracking()
                    .ToListAsync();
                if (entiti.Count() > 0)
                {
                    HashSet<String> claves = null;
                    var registros = entiti.Select(x => x.CapitulosId.ToString()).ToList();
                    claves = new HashSet<String>(registros);
                    v = v.Where(e =>
                    claves.Contains(e.CapitulosId.ToString()));
                }
                else
                {
                    //id = 0;
                    v = v.Where(e => e.CapitulosId == -1);
                }

                foreach (var item in v)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return v;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Capitulos>> GetByClaveAutorWithCoAutores(string id)
        {
            try
            {

                //Primero obtenemos la lista de capitulos registrados por el usuario buscado
                List<Capitulos> lista= new List<Capitulos>();
                var cursos= await _db.dbSetCapitulos.Where(e=> e.ClavePersona==id).Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
                lista.AddRange(cursos);

                //Despues obtenemos la lista de capitulos registrados por el usuario como CO-AUTOR
                var primaryKeysCursos= cursos.Select(x=> x.CapitulosId);
                var listaCoAutores= await _db.dbSetAutorInternoCapitulo.AsNoTracking().Where(e=> e.ClavePersona==id && !primaryKeysCursos.Contains(e.CapitulosId)).Select(x=> x.CapitulosId).ToListAsync();
                var cursosCoautores= await _db.dbSetCapitulos.Where(e=> listaCoAutores.Contains(e.CapitulosId) && (e.EstadoFlujoId==3 || e.EstadoFlujoId==8 || e.EstadoFlujoId==2) )
                                            .Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
                lista.AddRange(cursosCoautores);

                foreach (var item in lista)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return lista;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        private object AsNoTracking()
        {
            throw new NotImplementedException();
        }


        public async Task<IEnumerable<Capitulos>> getData(DataServerSide ss)
        {
            List<Capitulos> ListCursoInterno = new List<Capitulos>();
            try
            {
                var v = (from a in _db.dbSetCapitulos.Where(e => e.EstadoFlujoId == 3)    select a);

                ss.recordsTotal = v.Count();
            
                if (!String.IsNullOrEmpty(ss.Titulo)) //busqueda por titulo
                {
                    var listaDA = await GetDALikeTituloLibroNuevo(ss.Titulo);
                    v = v.Where(e => listaDA.Contains(e.CapitulosId));
                }
                
                if (!String.IsNullOrEmpty(ss.Capitulo)) //busqueda por titulo
                {
                    var listaDA = await GetDALikeTituloCapituloNuevo(ss.Capitulo);
                    v = v.Where(e => listaDA.Contains(e.CapitulosId));
                }
                               
                //País
                if (!string.IsNullOrEmpty(ss.Tipo))
                {
                    v = v.Where(e => e.Pais.ToString().Equals(ss.Tipo) );
                }

                if (!string.IsNullOrEmpty(ss.Autor)) //Autor externo
                {                  
                    var AutoresE = await GetPKAutorExternoByCollateLatin1(ss.Autor);                  
                    v = v.Where(e => AutoresE.Contains(e.CapitulosId));                
                }

                if (!string.IsNullOrEmpty(ss.Becario)) //Tomado como autor interno
                {
                    var entiti = await _db.dbSetAutorInternoCapitulo
                    .Where(e => e.ClavePersona.ToString().Contains(ss.Becario))
                    .Include(e => e.Capitulos)
                    .AsNoTracking().ToListAsync();
                    if (entiti.Count == 0)
                    {
                        var reg = new AutorInternoCapitulo();
                        reg.CapitulosId = -1;
                        v = v.Where(e => e.CapitulosId == reg.CapitulosId
                       
                         );
                    }
                    else
                    {
                        HashSet<String> claves = null;
                        var registros = entiti.Select(x => x.CapitulosId.ToString()).ToList();                  
                        claves = new HashSet<String>(registros);                  
                        v = v.Where(e => claves.Contains(e.CapitulosId.ToString()) );
                    }
                }


                //caja
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    var p = ss.searchValue.ToLower();

                    var listaDA = await GetDALikeTituloLibroNuevo(ss.searchValue);
                    var listaDC = await GetDALikeTituloCapituloNuevo(ss.searchValue);
                    var listaDE = await GetDALikeEditorialNuevo(ss.searchValue);

                    v = v.Where(e =>  listaDA.Contains(e.CapitulosId) || e.Year.ToString().Contains(p) || listaDC.Contains(e.CapitulosId) || listaDE.Contains(e.CapitulosId));
                }

                      
                if (!String.IsNullOrEmpty(ss.Editorial)) 
                {
                    var listaDA = await GetDALikeEditorialNuevo(ss.Editorial);
                    v = v.Where(e => listaDA.Contains(e.CapitulosId));
                }


                if (!String.IsNullOrEmpty(ss.Editor)) //busqueda por titulo
                {
                    var listaDA = await GetDALikeEditor(ss.Editor);
                    v = v.Where(e => listaDA.Contains(e.CapitulosId));
                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference                                             
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }
                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();
                return entities.OrderByDescending(e=> e.Year);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }





        public async Task<List<int>> GetDALikeEditor(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CapitulosId FROM  MT.EditoresCapitulo where Editor_Nombre collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Editor_Nombre collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<List<int>> GetDALikeTituloLibroNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CapitulosId FROM  MT.Capitulos where TituloLibro collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and TituloLibro collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

   
        public async Task<List<int>> GetDALikeTituloCapituloNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CapitulosId FROM  MT.Capitulos where TituloCapitulo collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and TituloCapitulo collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
       
        public async Task<List<int>> GetDALikeEditorialNuevo(string likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CapitulosId FROM  MT.Capitulos where Editorial collate  Latin1_General_CI_AI LIKE ";

                foreach (var palabra in palabras)
                {
                    query = query + " '%" + palabra + "%' and Editorial collate Latin1_General_CI_AI LIKE ";
                }

                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetPKAutorExternoByCollateLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT CapitulosId FROM MT.AutorExternoCapitulo where Nombre collate Latin1_General_CI_AI LIKE ";
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


    }
}
