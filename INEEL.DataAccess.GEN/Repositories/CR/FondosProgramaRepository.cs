using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Data.Entity;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class FondosProgramaRepository : IDisposable
    {
        private CR_Context _db;
        private GEN_Context _dbGEN;
        public FondosProgramaRepository()
        {
            _db = new CR_Context();
            _dbGEN = new GEN_Context();
        }
        public FondosProgramaRepository(CR_Context _dbfp)
        {
            _db = _dbfp;
        }

        public async Task<IEnumerable<FondoPrograma>> GetAll()
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FondoPrograma>> GetAllPP()
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking().Include(e => e.ProyectoPorFondo)
                    .Include(f => f.PropuestaPorFondo)
                    .ToListAsync();

                return entities.Where(e => e.ProyectoPorFondo.Count >= 1 || e.PropuestaPorFondo.Count >= 1);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task EliminaPPFondo(FondoPrograma model)
        {
            try
            {
                if (model.propuestasAnteriores.Length > 0)
                {
                    foreach (var item in model.propuestasAnteriores)
                    {
                        var propuesta = await _db.PropuestaPorFondo.FirstOrDefaultAsync(e => e.PropuestaId == item && e.FondoId == model.FondoProgramaId);
                        if (propuesta != null)
                        {
                            _db.PropuestaPorFondo.Remove(propuesta);
                            await _db.SaveChangesAsync();
                        }
                    }
                }

                if (model.proyectosAnteriores.Length > 0)
                {
                    foreach (var item in model.proyectosAnteriores)
                    {
                        var proyecto = await _db.ProyectoPorFondo.FirstOrDefaultAsync(e => e.ProyectoId == item);
                        if (proyecto != null)
                        {
                            _db.ProyectoPorFondo.Remove(proyecto);
                            await _db.SaveChangesAsync();
                        }
                    }
                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetListaNombreFondosPrograma()
        {
            try
            {
                var entity = await _db.FondoPrograma.Where(e => e.Estado == true)
                    .Select(x => new
                    {
                        NombreFP = x.NombreFP,
                        idFondo = x.FondoProgramaId
                    })
                    .AsNoTracking().ToListAsync();

                return entity;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todos los fondos programa por parametros
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetConsultaParametrizadaFondo(FondoPrograma parametros)
        {
            try
            {
                var fondos = (from fp in _db.FondoPrograma.Include(e => e.Empresa).AsNoTracking()
                              select fp);

                ///Si la coleccion esta vacia retornaremos null
                if (fondos != null)
                {
                    //busqueda por fechas

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        fondos = fondos.Where(e => (DbFunctions.TruncateTime(e.FechaRegistro) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion)
                                                    && DbFunctions.TruncateTime(e.FechaRegistro) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreFP)) //busqueda por nombre del FP
                    {
                        var listaNombres = await GetFondosLikeNombreLatin1(parametros.NombreFP);
                        fondos = fondos.Where(e => listaNombres.Contains(e.FondoProgramaId));
                    }

                    if (parametros.FuenteFinanciamientoId != 0 && parametros.FuenteFinanciamientoId != null)  //Busqueda por fuente de financiamiento
                    {
                        fondos = fondos.Where(e => e.FuenteFinanciamientoId == parametros.FuenteFinanciamientoId);
                    }

                    if (parametros.EmpresaId != 0 && parametros.EmpresaId != null)  //Busqueda por empresa
                    {
                        fondos = fondos.Where(e => e.EmpresaId == parametros.EmpresaId);
                    }

                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParamsCR> datos = fondos.Select(x => new BusquedaParamsCR //Es una clase no mapeada que contiene caracteristicas 
                                                                                           //que nos permiten albergar SOLO los datos necesarios
                    {
                        FondoProgramaId = x.FondoProgramaId, //Rescatamos los parametros que se requieren para el front
                        NombreFP = x.NombreFP,
                        NombreEmpresa = x.Empresa.NombreEmpresa,
                        TematicaPorFondoPrograma = x.TematicaPorFondoPrograma,
                        numConvocatorias = x.Convocatoria.Count(),
                        Estado = x.Estado,
                    }).ToList();

                    var listaFKTematicas = await (from t in _db.TematicaPorFondoPrograma
                                                  select new
                                                  {
                                                      TematicaId = t.TematicaId,
                                                      FondoProgramaId = t.FondoProgramaId
                                                  }).AsNoTracking().ToListAsync();

                    foreach (var c in datos)
                    {
                        //obtenemos los fks de las tematicas asociadas al fondo programa de la iteracion actual
                        var fks = listaFKTematicas.Where(e => e.FondoProgramaId == c.FondoProgramaId).Select(e => e.TematicaId);

                        //Obtenemos el nombre de las tematicas del cat_Tematica
                        c.listaNombretematicas = await (from tematica in _db.Tematica
                                                        where fks.Contains(tematica.TematicaId)
                                                        select tematica.Nombre).AsNoTracking().ToListAsync();
                    }

                    return datos; //retornamos los datos, y al hacer esto ya no pasamos por el siguiente return (el de abajo)
                }

                return null; //por default, en caso de que no tengamos datos desde el inicio retornamos null

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todas las claves de los fondos
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetFondosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT FondoProgramaId FROM CR.tab_FondoPrograma where NombreFP collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and NombreFP collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FondoPrograma> ValidaDuplicidad(int id)
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking()
                    .Include(e => e.PropuestaPorFondo)
                    .Include(f => f.ProyectoPorFondo)
                    .Include("FuenteFinanciamiento")
                    .Where(e => e.PropuestaPorFondo.Count == 0 && e.ProyectoPorFondo.Count == 0).FirstOrDefaultAsync(e => e.FondoProgramaId == id);

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<FondoPrograma> GetPP(int id)
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking()
                    .Include("PropuestaPorFondo.Propuestas")
                    .Include("ProyectoPorFondo.Proyecto")
                    .Include(e => e.Empresa)
                    .Include(e => e.FuenteFinanciamiento)
                    .Include(e => e.SitioWebFondoPrograma)
                    .Include("TematicaPorFondoPrograma.Tematica")
                    .AsNoTracking().FirstOrDefaultAsync(e => e.FondoProgramaId == id);

                UORepository unidad = new UORepository(_dbGEN);
                PersonasRepository persona = new PersonasRepository(_dbGEN);
                foreach (PropuestaPorFondo objeto in entities.PropuestaPorFondo)
                {
                    objeto.Propuestas.UnidadOrganizacional = await unidad.UnidadActualWithoutStatus(objeto.Propuestas.UnidadOrganizacionalId);
                    objeto.Propuestas.Personas = await persona.GetById(objeto.Propuestas.ClaveEmpPropuesta);
                }

                foreach (ProyectoPorFondo objeto in entities.ProyectoPorFondo)
                {
                    objeto.Proyecto.UnidadOrganizacional = await unidad.UnidadActualWithoutStatus(objeto.Proyecto.UnidadOrganizacionalId);
                }

                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<FondoPrograma>> GetAllFKs()
        {
            try
            {
                var entities = await _db.FondoPrograma
                    .AsNoTracking()
                    .Include(e => e.Empresa)
                    .Include(e => e.FuenteFinanciamiento)
                    .Include(e => e.SitioWebFondoPrograma)
                    //.Include(e => e.TematicaPorFondoPrograma)
                    .Include("TematicaPorFondoPrograma.Tematica")
                    .Include(e => e.Convocatoria)
                    .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Fuentes de financiamiento con estado en true
        public async Task<IEnumerable<FondoPrograma>> GetAllByEstado()
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking().ToListAsync();
                return entities.Where(e => e.Estado == true);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Fuentes de financiamiento con estado en true
        public async Task<IEnumerable<FondoPrograma>> GetAllByFuente(int id)
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking().ToListAsync();
                return entities.Where(e => e.FuenteFinanciamientoId == id);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<FondosFinanciamientoSIGPROY>> GetAllByFuenteSIGPROY(int id)
        {
            try
            {
                List<FondosFinanciamientoSIGPROY> fondosS = new List<FondosFinanciamientoSIGPROY>();
                ConvocatoriaRepository cv = new ConvocatoriaRepository();

                var entities = await _db.FondoPrograma
                    .AsNoTracking()
                    .Select(x => new FondosFinanciamientoSIGPROY
                    {
                        FondoProgramaId = x.FondoProgramaId,
                        NombreFP = x.NombreFP,
                        EstadoFP = x.Estado,
                        FuenteFinanciamientoId = x.FuenteFinanciamientoId
                    })
                    .Where(x => x.FuenteFinanciamientoId == id && x.EstadoFP==true)
                    .ToListAsync();
                fondosS.AddRange(entities);

                foreach (FondosFinanciamientoSIGPROY fps in fondosS)
                {
                    var fondoId = (int)fps.FondoProgramaId;
                    fps.ConvocatoriasSIGPROY = await cv.GetAllByFondoSIGPROY(fondoId);
                }

                return fondosS;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FondoPrograma> Get(int id)
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.FondoProgramaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FondoPrograma> GetFuente(int id)
        {
            try
            {
                var entities = await _db.FondoPrograma.AsNoTracking().Include("FuenteFinanciamiento").FirstOrDefaultAsync(e => e.FondoProgramaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<FondoPrograma> GetFKById(int id)
        {
            try
            {
                var entities = await _db.FondoPrograma
                     .AsNoTracking()
                     .Include(e => e.Empresa)
                     .Include(e => e.FuenteFinanciamiento)
                     .Include(e => e.SitioWebFondoPrograma)
                     .Include(e => e.Convocatoria)
                     //.Include("Convocatoria.ContactoPorConvocatoria.Contacto")
                     .Include("TematicaPorFondoPrograma.Tematica")
                     .FirstOrDefaultAsync(e => e.FondoProgramaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetProyectosByFondo(int id)
        {
            try
            {
                var fksproyectos = await _db.ProyectoPorFondo.Where(e => e.FondoId == id && e.Estado == true)
                                                            .Select(x => x.ProyectoId)
                                                            .Distinct().AsNoTracking().ToListAsync();
                if (fksproyectos.Count > 0)
                {
                    var proyectos = await _dbGEN.dbSetProyectoGEN.Where(e => fksproyectos.Contains(e.ProyectoId))
                                                                .Select(x => new
                                                                {
                                                                    x.ProyectoId,
                                                                    x.Nombre,
                                                                    x.NumjefeProyecto,
                                                                    x.NombreJefeProyecto
                                                                }).AsNoTracking().ToListAsync();
                    return proyectos;                                                                
                }
                
                return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> CountFondosByEmpresa(int id){
            try{
                var fondos= await _db.FondoPrograma.Where(e=> e.EmpresaId==id && e.Estado==true).Distinct().AsNoTracking().CountAsync();
                return fondos;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Object> GetFondosByProyecto(string id)
        {
            try
            {
                var fksproyectos = await _db.ProyectoPorFondo.Where(e => e.ProyectoId == id && e.Estado == true).AsNoTracking()
                                                            .Select(x => x.FondoId)
                                                            .Distinct().ToListAsync();

                
                if (fksproyectos.Count > 0)
                {
                    var fondos = await _db.FondoPrograma.Where(e => fksproyectos.Contains(e.FondoProgramaId)).AsNoTracking()
                                                        .Select(x => new
                                                        {
                                                            x.FondoProgramaId,
                                                            x.NombreFP,
                                                            x.Descripcion,
                                                            x.FechaRegistro
                                                        }).ToListAsync();
                    return fondos;
                }

                return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetFondosByEmpresa(int id)
        {
            try
            {
                var fondos= await _db.FondoPrograma.Where(e=> e.EmpresaId== id)
                                             .Select(x=> new{
                                                 x.FondoProgramaId,
                                                 x.NombreFP,
                                                 x.Descripcion,
                                                 x.FechaRegistro
                                             })
                                             .AsNoTracking().ToListAsync();
                return fondos;                                             
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Create(FondoPrograma model)
        {
            try
            {

                _db.FondoPrograma.Add(model);
                await _db.SaveChangesAsync();
                if (model.seleccion.Length >= 0)
                {
                    await ConsultaIdFondoPrograma(model);

                }

                if (model.sitiosWeb.Length >= 0)
                {
                    await InsertaSitioWebFondoPrograma(model);

                }


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(FondoPrograma model)
        {
            try
            {

                var _model = await _db.FondoPrograma.FirstOrDefaultAsync(e => e.FondoProgramaId == model.FondoProgramaId);
                if (_model != null)
                {
                    //if (model.sitiosWebAntDel.Length > 0)
                    //{
                    //    //Elimina los sitios web que tenia dados de alta y elimino al actualizar
                    //    await EliminaSitioWebFondoPrograma(model);

                    //}

                    //if (model.sitiosWebNuevos.Length > 0)
                    //{
                    //    await InsertaSitioWebFondoProgramaUpdate(model);
                    //}

                    if (model.areasNuevos.Length > 0)
                    {
                        await InsertaAreTematicaFondoUpdate(model);
                    }

                    if (model.areasAntDel.Length > 0)
                    {
                        await EliminaAreasFondo(model);
                    }


                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(FondoPrograma model)
        {
            try
            {
                var _model = await _db.FondoPrograma.FirstOrDefaultAsync(e => e.FondoProgramaId == model.FondoProgramaId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
                var _model = await _db.FondoPrograma.FirstOrDefaultAsync(e => e.FondoProgramaId == id);
                if (_model != null)
                {
                    _db.FondoPrograma.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task DeleteFondoWithFKS(int id)
        {
            try
            {
                var _model = await _db.FondoPrograma.FirstOrDefaultAsync(e => e.FondoProgramaId == id);
                if (_model != null)
                {

                    //buscamos y eliminamos los registros que tengan dependencia con el fondo a eliminar
                    var _tematicas = await _db.TematicaPorFondoPrograma.Where(e => e.FondoProgramaId == id).ToListAsync();
                    if (_tematicas.Count > 0)
                    {
                        _db.TematicaPorFondoPrograma.RemoveRange(_tematicas);
                    }

                    var _sitios = await _db.SitioWebFondoPrograma.Where(e => e.FondoProgramaId == id).ToListAsync();
                    if (_sitios.Count > 0)
                    {
                        _db.SitioWebFondoPrograma.RemoveRange(_sitios);
                    }

                    var _proyectos = await _db.ProyectoPorFondo.Where(e => e.FondoId == id).ToListAsync();
                    if (_proyectos.Count > 0)
                    {
                        _db.ProyectoPorFondo.RemoveRange(_proyectos);
                    }

                    var _propuestas = await _db.PropuestaPorFondo.Where(e => e.FondoId == id).ToListAsync();
                    if (_propuestas.Count > 0)
                    {
                        _db.PropuestaPorFondo.RemoveRange(_propuestas);
                    }

                    //En teoria ya no hay convocatorias asociadas (debido a que la interfaz te obliga a eliminarlas manualmente antes),
                    // asi que por ende las siguientes lineas quedan como comentario

                    // var _convocatorias= await _db.Convocatoria.Where(e=> e.FondoProgramaId==id).ToListAsync();
                    // if( _convocatorias.Count>0){
                    //     _db.Convocatoria.RemoveRange(_convocatorias);
                    // }

                    //Finalmente se elimina el fondo (hasta ahora solo han sido eliminados de la memoria del servidor)
                    _db.FondoPrograma.Remove(_model);
                    await _db.SaveChangesAsync(); //Se guardan los cambios en la base de datos
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public void Dispose()
        {
            _db.Dispose();
        }

        private async Task EliminaSitioWebFondoPrograma(FondoPrograma model)
        {
            try
            {
                foreach (var item in model.sitiosWebAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    SitioWebFondoPrograma objSitioWebFondoPrograma = new SitioWebFondoPrograma();

                    var _model = await _db.SitioWebFondoPrograma.FirstOrDefaultAsync(e => e.SitioWebFondoProgramaId == item);
                    if (_model != null)
                    {
                        _db.SitioWebFondoPrograma.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                    //var entities = _db.SitioWebFondoPrograma.Remove(objSitioWebFondoPrograma);
                    //await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaAreasFondo(FondoPrograma model)
        {
            try
            {
                foreach (var item in model.areasAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    TematicaPorFondoPrograma obj = new TematicaPorFondoPrograma();

                    var _model = await _db.TematicaPorFondoPrograma.FirstOrDefaultAsync(e => e.TematicaPorFondoProgramaId == item);
                    if (_model != null)
                    {
                        _db.TematicaPorFondoPrograma.Remove(_model);
                        await _db.SaveChangesAsync();
                    }


                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        private async Task ConsultaIdFondoPrograma(FondoPrograma model)
        {
            try
            {
                foreach (var item in model.seleccion)
                {
                    TematicaPorFondoPrograma objTema = new TematicaPorFondoPrograma();

                    //objTema.FondoProgramaId = item.FondoProgramaId;
                    objTema.FondoProgramaId = model.FondoProgramaId;
                    objTema.TematicaId = item;
                    objTema.Autor = model.Autor;
                    objTema.FechaRegistro = model.FechaRegistro;
                    objTema.Estado = true;

                    var entities = _db.TematicaPorFondoPrograma.Add(objTema);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaSitioWebFondoPrograma(FondoPrograma model)
        {
            try
            {
                foreach (var item in model.sitiosWeb)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    SitioWebFondoPrograma objSitioWebFondoPrograma = new SitioWebFondoPrograma();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    objSitioWebFondoPrograma.FondoProgramaId = model.FondoProgramaId;
                    objSitioWebFondoPrograma.Url = item;
                    objSitioWebFondoPrograma.Descripcion = "Url de " + model.NombreFP;
                    objSitioWebFondoPrograma.FechaRegistro = model.FechaRegistro;
                    objSitioWebFondoPrograma.Autor = model.Autor;
                    objSitioWebFondoPrograma.Estado = true;

                    var entities = _db.SitioWebFondoPrograma.Add(objSitioWebFondoPrograma);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaSitioWebFondoProgramaUpdate(FondoPrograma model)
        {
            try
            {
                foreach (var item in model.sitiosWebNuevos)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    SitioWebFondoPrograma objSitioWebFondoPrograma = new SitioWebFondoPrograma();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    objSitioWebFondoPrograma.FondoProgramaId = model.FondoProgramaId;
                    objSitioWebFondoPrograma.Url = item;
                    objSitioWebFondoPrograma.Descripcion = "Url de " + model.NombreFP;
                    objSitioWebFondoPrograma.FechaRegistro = model.FechaRegistro;
                    objSitioWebFondoPrograma.Autor = model.Autor;
                    objSitioWebFondoPrograma.Estado = true;

                    var entities = _db.SitioWebFondoPrograma.Add(objSitioWebFondoPrograma);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaAreTematicaFondoUpdate(FondoPrograma model)
        {
            try
            {
                foreach (var item in model.areasNuevos)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    TematicaPorFondoPrograma obj = new TematicaPorFondoPrograma();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    obj.FondoProgramaId = model.FondoProgramaId;
                    obj.TematicaId = item;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Autor = model.Autor;
                    obj.Estado = true;

                    var entities = _db.TematicaPorFondoPrograma.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //private void InsertaRelacionPorEmpresa(FondoPrograma model)
        //{
        //    try
        //    {
        //        TipoRelacion objTipoRelacion = new TipoRelacion();

        //        var entitiesTP = _db.TipoRelacion
        //          .AsNoTracking()
        //          .FirstOrDefaultAsync(e => e.Nombre.ToLower() == "patrocinador");

        //        RelacionPorEmpresa objRelacionPorEmpresa = new RelacionPorEmpresa();

        //        objTipoRelacion.FondoProgramaId = model.FondoProgramaId;
        //            objTema.TematicaId = item;
        //            objTema.Autor = model.Autor;
        //            objTema.FechaRegistro = model.FechaRegistro;
        //            objTema.Estado = true;

        //            var entities = _db.TematicaPorFondoPrograma.Add(objTema);
        //            _db.SaveChangesAsync();

        //    }
        //    catch (Exception e)
        //    {

        //        throw new Exception(e.Message, e);
        //    }
        //}
    }
}

