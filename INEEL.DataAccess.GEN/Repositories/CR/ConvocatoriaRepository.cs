using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ConvocatoriaRepository : IDisposable
    {

        private CR_Context _db;

        private GEN_Context _dbGEN;

        public ConvocatoriaRepository()
        {
            _db = new CR_Context();
            _dbGEN = new GEN_Context();
        }


        public async Task<IEnumerable<Convocatoria>> GetAll()
        {
            try
            {
                var entities = await _db.Convocatoria.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Tematica>> GetTematicasNotSelect(int Fondo)
        {
            try
            {
                var tematicasSelect = await (from TematicaPorFondoPrograma in _db.TematicaPorFondoPrograma
                                             where TematicaPorFondoPrograma.FondoProgramaId == Fondo
                                             select TematicaPorFondoPrograma.TematicaId).ToListAsync();

                var notIntematicasSelect = await (from Tematica in _db.Tematica
                                                  where !tematicasSelect.Contains(Tematica.TematicaId)
                                                  select Tematica).AsNoTracking().ToListAsync();

                return notIntematicasSelect;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Convocatoria>> GetAllFKs()
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include("PropuestaPorConvocatoria.Propuestas")
                     .Include("ProyectoPorConvocatoria.Proyecto")
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    .Include(e => e.FondoPrograma)
                    .Include(e => e.TipoFuenteFinanciamiento)
                    .ToListAsync(); //este no va para uno
                //para uno cambiar el tipo de task (en la definicion del metodo)
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Convocatoria>> GetAllFKsPP()
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include("PropuestaPorConvocatoria.Propuestas")
                     .Include("ProyectoPorConvocatoria.Proyecto")
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    .Include(e => e.FondoPrograma)
                    .ToListAsync(); //este no va para uno
                //para uno cambiar el tipo de task (en la definicion del metodo)
                return entities.Where(e => e.PropuestaPorConvocatoria.Count > 0 || e.ProyectoPorConvocatoria.Count > 0);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Convocatoria>> GetAllFKsByEstado()
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    //.Include(e => e.ContactoPorConvocatoria)
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include(e => e.PropuestaPorConvocatoria)
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    //.Include(e => e.AdjuntoPorConvocatoria)
                    .Include(e => e.FondoPrograma)
                    //.FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id); //para uno
                    .ToListAsync(); //este no va para uno
                return entities.Where(e => e.Estado == true);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Convocatoria>> GetVigentes()
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Include(e => e.TipoFuenteFinanciamiento)
                    .Include(e => e.FondoPrograma.FuenteFinanciamiento)
                    .ToListAsync();
                return entities.Where(e => e.Estado == true && e.FechaTermino > DateTime.Now);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Convocatoria>> GetInternacionales()
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    //.Include(e => e.ContactoPorConvocatoria)
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include(e => e.PropuestaPorConvocatoria)
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    //.Include(e => e.AdjuntoPorConvocatoria)
                    .Include(e => e.FondoPrograma)
                    //.FirstOrDefaultAsync(e => e.FuenteFinanciamientoId == id); //para uno
                    .ToListAsync(); //este no va para uno
                return entities.Where(e => e.Estado == true);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Convocatoria>> GetAllByFondo(int id)
        {
            try
            {
                var entities = await _db.Convocatoria.AsNoTracking().ToListAsync();

                //if (id != 0)
                //{
                return entities.Where(e => e.FondoProgramaId == id);
                //}

                //return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Convocatoria>> GetConvocatoriasModal(int id, String nombreConvocatoria)
        {
            try
            {
                if (id != 0)
                {
                    var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include(e => e.PropuestaPorConvocatoria)
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    .Include("FondoPrograma.FuenteFinanciamiento")
                    .Include("FondoPrograma.FuenteFinanciamiento")
                   .Include("FondoPrograma.Empresa")
                   .Include("FondoPrograma.TematicaPorFondoPrograma.Tematica")

                    .ToListAsync();
                    return entities.Where(e => e.Estado == true);
                }
                else if (!String.IsNullOrEmpty(nombreConvocatoria))
                {
                    nombreConvocatoria = nombreConvocatoria.ToLower();
                    var entities = await _db.Convocatoria.AsNoTracking()
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include(e => e.PropuestaPorConvocatoria)
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                   .Include("FondoPrograma.FuenteFinanciamiento")
                   .Include("FondoPrograma.FuenteFinanciamiento")
                   .Include("FondoPrograma.Empresa")
                   .Include("FondoPrograma.TematicaPorFondoPrograma.Tematica")
                    .Where(x => String.Concat(x.NombreConvocatoria).ToLower()
                                .Contains(nombreConvocatoria))
                    .Where(x => x.Estado == true) //&& (x.FechaTermino >= DateTime.Today)
                    .ToListAsync();
                    return entities;
                }
                else return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Convocatoria> GetFKById(int id)
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    .Include("Paises.Pais")
                    .Include("TipoFuenteFinanciamiento")
                    .Include("PropuestaPorConvocatoria.Propuestas")
                    .Include("ProyectoPorConvocatoria.Proyecto")
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    .Include("FondoPrograma.FuenteFinanciamiento")
                    .Include("FondoPrograma.Empresa")
                    .Include("FondoPrograma.TematicaPorFondoPrograma.Tematica")

                    .FirstOrDefaultAsync(e => e.ConvocatoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //hacer esto reduce el performance de las consultas  (O_O)!!!  
        public async Task<Convocatoria> GetFKByIdWithGerencia(int id)
        {
            try
            {
                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Include(e => e.SitioWebPorConvocatoria)
                    .Include("ContactoPorConvocatoria.Contacto")
                    //.Include(e => e.PropuestaPorConvocatoria)
                    .Include("PropuestaPorConvocatoria.Propuestas")
                    .Include("ProyectoPorConvocatoria.Proyecto")
                    .Include("AdjuntoPorConvocatoria.Adjunto")
                    .Include("FondoPrograma.FuenteFinanciamiento")
                    .Include("FondoPrograma.Empresa")
                    .Include("FondoPrograma.TematicaPorFondoPrograma.Tematica")

                    .FirstOrDefaultAsync(e => e.ConvocatoriaId == id);

                UORepository uo = new UORepository(_dbGEN);
                foreach (ProyectoPorConvocatoria ppc in entities.ProyectoPorConvocatoria)
                {
                    var unidadId = ppc.Proyecto.UnidadOrganizacionalId;
                    ppc.Proyecto.UnidadOrganizacional = await uo.UnidadActualWithoutStatus(unidadId);
                }

                UORepository uo2 = new UORepository(_dbGEN);
                PersonasRepository per = new PersonasRepository(_dbGEN);
                foreach (PropuestaPorConvocatoria prpc in entities.PropuestaPorConvocatoria)
                {
                    var unidadId2 = prpc.Propuestas.UnidadOrganizacionalId;
                    prpc.Propuestas.UnidadOrganizacional = await uo2.UnidadActualWithoutStatus(unidadId2);

                    var personaId = prpc.Propuestas.ClaveEmpPropuesta;
                    prpc.Propuestas.Personas = await per.GetById(personaId);
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetNombresTipoConvocatoria()
        {
            try
            {
                var tipos = await _db.TipoFuenteFinanciamiento.Where(e => e.Estado == true)
                    .Select(x => new
                    {
                        Nombre = x.Nombre,
                        idTipo = x.TipoFuenteFinanciamientoId
                    })
                    .AsNoTracking().ToListAsync();

                return tipos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetConsultaParametrizadaConvocatoria(Convocatoria parametros)
        {
            try
            {
                var convocatorias = (from conv in _db.Convocatoria.AsNoTracking()
                                     .Include(e => e.TipoFuenteFinanciamiento)
                                     .Include(e => e.FondoPrograma)
                                     select conv);

                if (convocatorias != null)
                {

                    if (!String.IsNullOrEmpty(parametros.busquedaFecha))  //busqueda por fecha
                    {
                        convocatorias = convocatorias.Where(e => (DbFunctions.TruncateTime(e.FechaTermino) >= DbFunctions.TruncateTime(parametros.fechaInicioComparacion)
                                                                && DbFunctions.TruncateTime(e.FechaTermino) <= DbFunctions.TruncateTime(parametros.fechaFinalComparacion)));
                    }
                    if (!String.IsNullOrEmpty(parametros.NombreConvocatoria)) //busqueda por nombre de la convocatoria
                    {
                        var listaNombres = await GetConvocatoriasLikeNombreLatin1(parametros.NombreConvocatoria);
                        convocatorias = convocatorias.Where(e => listaNombres.Contains(e.ConvocatoriaId));
                    }

                    if (parametros.TipoFuenteFinanciamientoId != 0 && parametros.TipoFuenteFinanciamientoId != null)  //Busqueda por tipo de convocatoria
                    {
                        convocatorias = convocatorias.Where(e => e.TipoFuenteFinanciamientoId == parametros.TipoFuenteFinanciamientoId);
                    }

                    if (parametros.FondoProgramaId != 0)  //Busqueda por fondo programa
                    {
                        convocatorias = convocatorias.Where(e => e.FondoProgramaId == parametros.FondoProgramaId);
                    }

                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParamsCR> datos = convocatorias.Select(x => new BusquedaParamsCR //Es una clase no mapeada que contiene caracteristicas 
                                                                                                  //que nos permiten albergar SOLO los datos necesarios
                    {
                        ConvocatoriaId = x.ConvocatoriaId, //Rescatamos los parametros que se requieren para el front
                        NombreConvocatoria = x.NombreConvocatoria,
                        TipoFuenteFinanciamiento = x.TipoFuenteFinanciamiento.Nombre,
                        FechaTermino = x.FechaTermino,
                        NombreFP = x.FondoPrograma.NombreFP,
                        Estado = x.Estado,
                    }).ToList();

                    var listaFK = await (from t in _db.ContactoPorConvocatoria
                                         select new
                                         {
                                             ConvocatoriaId = t.ConvocatoriaId,
                                             ContactoId = t.ContactoId
                                         }).AsNoTracking().ToListAsync();

                    foreach (var c in datos)
                    {
                        //obtenemos los fks de los contactos asociadas a la convocatoria
                        var fks = listaFK.Where(e => e.ConvocatoriaId == c.ConvocatoriaId).Select(e => e.ContactoId);

                        //Obtenemos la lista de nombres de los contactos
                        c.listaNombreContactos = await (from contacto in _db.Contacto
                                                        where fks.Contains(contacto.ContactoId)
                                                        select string.Concat(contacto.NombreContacto," ", contacto.ApellidoPaterno," ", contacto.ApellidoMaterno)).AsNoTracking().ToListAsync();
                    }

                    return datos; //retornamos los datos, y al hacer esto ya no pasamos por el siguiente return (el de abajo)
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
        public async Task<List<int>> GetConvocatoriasLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var palabras = likeNombre.Split(' ');
                var query = "SELECT ConvocatoriaId FROM CR.tab_Convocatoria where NombreConvocatoria collate Latin1_General_CI_AI LIKE ";
                foreach (var palabra in palabras)
                {
                    query = query + "'%" + palabra + "%' and NombreConvocatoria collate Latin1_General_CI_AI LIKE";
                }
                var resultados = await _db.Database.SqlQuery<int>(query + "'%%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Convocatoria> Get(int id)
        {
            try
            {
                var entities = await _db.Convocatoria.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ConvocatoriaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<ConvocatoriasSIGPROY>> GetAllByFondoSIGPROY(int id)
        {
            try
            {
                List<ConvocatoriasSIGPROY> convS = new List<ConvocatoriasSIGPROY>();
                ConvocatoriaRepository cv = new ConvocatoriaRepository();

                var entities = await _db.Convocatoria
                    .AsNoTracking()
                    .Select(x => new ConvocatoriasSIGPROY
                    {
                        ConvocatoriaId = x.ConvocatoriaId,
                        NombreConvocatoria = x.NombreConvocatoria,
                        EstadoConvoc = x.Estado,
                        FondoProgramaId = x.FondoProgramaId
                    })
                    .Where(x => x.FondoProgramaId == id && x.EstadoConvoc==true)
                    .ToListAsync();
                convS.AddRange(entities);

                return convS;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Convocatoria model)
        {
            try
            {

                _db.Convocatoria.Add(model);
                await _db.SaveChangesAsync();
                if (model.contactos.Length >= 0)
                {
                    await insertaContactosPorConvocatoria(model);

                }
                if (model.sitiosWeb.Length >= 0)
                {
                    await InsertaSitioWeb(model);

                }

                await new NuevoOCRepository(_dbGEN).Create(new NuevoOC("CR", "CONVOCATORIA", model.NombreConvocatoria, "IndexCR.html#/detallesConvocatoria/" + model.ConvocatoriaId));


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CreateAsociacion(Convocatoria model)
        {
            try
            {

                //_db.Convocatoria.Add(model);
                //await _db.SaveChangesAsync();
                if (model.proyectosE.Length >= 0)
                {
                    await insertaProyectosPorConvocatoria(model);
                }
                if (model.propuestasE.Length >= 0)
                {
                    await InsertaPropuestasPorConvocatoria(model);
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaProyectosPorConvocatoria(Convocatoria model)
        {
            try
            {
                foreach (var item in model.proyectosE)
                {
                    ProyectoPorConvocatoria obj = new ProyectoPorConvocatoria();
                    obj.ConvocatoriaId = model.ConvocatoriaId;
                    obj.ProyectoId = item;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Estado = true;

                    var entities = _db.ProyectoPorConvocatoria.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaPropuestasPorConvocatoria(Convocatoria model)
        {
            try
            {
                foreach (var item in model.propuestasE)
                {
                    PropuestaPorConvocatoria obj = new PropuestaPorConvocatoria();
                    obj.ConvocatoriaId = model.ConvocatoriaId;
                    obj.PropuestaId = item;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Estado = true;

                    var entities = _db.PropuestaPorConvocatoria.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateLecciones(Convocatoria model)
        {
            try
            {
                var _model = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == model.ConvocatoriaId);
                var _modelM = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == model.ConvocatoriaId);
                if (_model != null)
                {
                    _modelM.LeccionesAprendidas = model.LeccionesAprendidas;
                    _db.Entry(_model).CurrentValues.SetValues(_modelM);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Update(Convocatoria model)
        {
            try
            {
                var _model = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == model.ConvocatoriaId);

                await ActualizaPaisesPorConvocatoria(model);
                if (_model != null)
                {   //Ligas URL
                    if (model.sitiosWebAntDel.Length > 0)
                    {
                        //Elimina los sitios web que tenia dados de alta y elimino al actualizar
                        await EliminaSitioWeb(model);
                    }

                    if (model.sitiosWebNuevos.Length > 0)
                    {
                        await InsertaSitioWebUpdate(model);
                    }

                    //Contactos
                    if (model.contactosAntDel.Length > 0)
                    {
                        //Elimina los sitios web que tenia dados de alta y elimino al actualizar
                        await EliminaContacto(model);

                    }

                    if (model.contactosNuevos.Length > 0)
                    {
                        await InsertaContactoUpdate(model);
                    }
                    //Adjuntos
                    if (model.adjuntosAntDel.Length > 0)
                    {
                        //Elimina los sitios web que tenia dados de alta y elimino al actualizar
                        await EliminaAdjuntoAnt(model);

                    }
                    if (model.adjuntosNuevosRuta.Length > 0)
                    {
                        //Inserta los sitios web que tenia dados de alta y elimino al actualizar
                        await insertaAdjunto(model);

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

        public async Task ActualizaPaisesPorConvocatoria(Convocatoria model)
        {
            var listapaises = await _db.PaisesPorConvocatoria.Where(e => e.ConvocatoriaId == model.ConvocatoriaId).ToListAsync();

            foreach (var pais in listapaises)
            {
                var _pais = await _db.PaisesPorConvocatoria.FirstOrDefaultAsync(e => e.PaisesPorConvocatoriaID == pais.PaisesPorConvocatoriaID);
                if (_pais != null)
                {
                    _db.PaisesPorConvocatoria.Remove(_pais);
                }
            }

            foreach (var item in model.Paises)
            {
                item.ConvocatoriaId = model.ConvocatoriaId;
                _db.PaisesPorConvocatoria.Add(item);
            }
            await _db.SaveChangesAsync();
        }

        public async Task UpdatePPConvocatoria(Convocatoria model)
        {
            try
            {
                var _model = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == model.ConvocatoriaId);
                if (_model != null)
                {   //Ligas URL

                    //Propuestas
                    if (model.propuestasAntDel.Length > 0)
                    {
                        //Elimina las propuestas que tenia dadas de alta 
                        await EliminaPropuestaPorConv(model);
                    }

                    if (model.propuestasNuevos.Length > 0)
                    {
                        await InsertaPropuestaUpdate(model);
                    }

                    //Propuestas
                    if (model.proyectosAntDel.Length > 0)
                    {
                        //Elimina las propuestas que tenia dadas de alta 
                        await EliminaProyectoPorConv(model);
                    }

                    if (model.proyectosNuevos.Length > 0)
                    {
                        await InsertaProyectoUpdate(model);
                    }

                    await UpdateLecciones(model);
                    //_db.Entry(_model).CurrentValues.SetValues(model);
                    //await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Convocatoria model)
        {
            try
            {
                var _model = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == model.ConvocatoriaId);
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


        public async Task DeleteConvocatoriaWithFKS(int id)
        {
            try
            {
                var _model = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == id);
                if (_model != null)
                {
                    ///buscamos y eliminamos los registros asociados a la convocatoria

                    var _sitio = await _db.SitioWebPorConvocatoria.Where(e=> e.ConvocatoriaId == id).ToListAsync();
                    if( _sitio.Count >0 ){
                        _db.SitioWebPorConvocatoria.RemoveRange(_sitio);
                    }

                    var _proyecto = await _db.ProyectoPorConvocatoria.Where(e=> e.ConvocatoriaId ==id).ToListAsync();
                    if( _proyecto.Count >0){
                        _db.ProyectoPorConvocatoria.RemoveRange(_proyecto);
                    }

                    var _propuesta = await _db.PropuestaPorConvocatoria.Where(e=> e.ConvocatoriaId==id).ToListAsync();
                    if( _propuesta.Count>0){
                        _db.PropuestaPorConvocatoria.RemoveRange(_propuesta);
                    }

                    var _pais = await _db.PaisesPorConvocatoria.Where(e=>e.ConvocatoriaId==id).ToListAsync();
                    if( _pais.Count>0){
                        _db.PaisesPorConvocatoria.RemoveRange(_pais);
                    }

                    var _contacto = await _db.ContactoPorConvocatoria.Where(e=> e.ConvocatoriaId==id).ToListAsync();
                    if( _contacto.Count>0){
                        _db.ContactoPorConvocatoria.RemoveRange(_contacto);
                    }

                    var _adjunto = await _db.AdjuntoPorConvocatoria.Where(e=> e.ConvocatoriaId==id).ToListAsync();
                    if( _adjunto.Count>0){
                        var idsadjuntos = _adjunto.Select(x => x.AdjuntoId).ToList();
                        _db.AdjuntoPorConvocatoria.RemoveRange(_adjunto);
                        await _db.SaveChangesAsync();

                        await new AdjuntoRepository().DeleteByCollectionIds(idsadjuntos);
                    }

                    var infoAgregada = await _dbGEN.dbSetNuevoOC.Where(e => e.descripcion.Equals(_model.NombreConvocatoria) && e.OcsId=="CONVOCATORIA").FirstOrDefaultAsync();
                    if(infoAgregada!=null){
                        NuevoOCRepository repo= new NuevoOCRepository();
                        await repo.Delete(infoAgregada.NuevoOCId);
                    }

                    //Finalmente se quita la convocatoria
                    _db.Convocatoria.Remove(_model);
                    await _db.SaveChangesAsync(); //se guardan cambios en la bd
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
                var _model = await _db.Convocatoria.FirstOrDefaultAsync(e => e.ConvocatoriaId == id);
                if (_model != null)
                {
                    _db.Convocatoria.Remove(_model);
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
            _db.Dispose();
        }

        private async Task insertaContactosPorConvocatoria(Convocatoria model)
        {
            try
            {
                foreach (var item in model.contactos)
                {
                    ContactoPorConvocatoria obj = new ContactoPorConvocatoria();
                    obj.ConvocatoriaId = model.ConvocatoriaId;
                    obj.ContactoId = item;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Estado = true;

                    var entities = _db.ContactoPorConvocatoria.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaSitioWeb(Convocatoria model)
        {
            try
            {
                foreach (var item in model.sitiosWeb)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    SitioWebPorConvocatoria objSitioWeb = new SitioWebPorConvocatoria();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    objSitioWeb.ConvocatoriaId = model.ConvocatoriaId;
                    objSitioWeb.Url = item;
                    objSitioWeb.Descripcion = "Url de " + model.NombreConvocatoria;
                    objSitioWeb.FechaRegistro = model.FechaRegistro;
                    objSitioWeb.Autor = model.Autor;
                    objSitioWeb.Estado = true;

                    var entities = _db.SitioWebPorConvocatoria.Add(objSitioWeb);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaSitioWebUpdate(Convocatoria model)
        {
            try
            {
                foreach (var item in model.sitiosWebNuevos)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    SitioWebPorConvocatoria objSitioWeb = new SitioWebPorConvocatoria();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    objSitioWeb.ConvocatoriaId = model.ConvocatoriaId;
                    objSitioWeb.Url = item;
                    objSitioWeb.Descripcion = "Url de " + model.NombreConvocatoria;
                    objSitioWeb.FechaRegistro = model.FechaRegistro;
                    objSitioWeb.Autor = model.Autor;
                    objSitioWeb.Estado = true;

                    var entities = _db.SitioWebPorConvocatoria.Add(objSitioWeb);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaPropuestaUpdate(Convocatoria model)
        {
            try
            {
                foreach (var item in model.propuestasNuevos)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    PropuestaPorConvocatoria obj = new PropuestaPorConvocatoria();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    obj.ConvocatoriaId = model.ConvocatoriaId;
                    obj.PropuestaId = item;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Autor = model.Autor;
                    obj.EdoProp = "Registrado";
                    obj.Estado = true;

                    var entities = _db.PropuestaPorConvocatoria.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task InsertaProyectoUpdate(Convocatoria model)
        {
            try
            {
                foreach (var item in model.proyectosNuevos)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    ProyectoPorConvocatoria obj = new ProyectoPorConvocatoria();

                    //Agrega los datos de la tabla de acuerdo a lo que trae el modelo
                    obj.ConvocatoriaId = model.ConvocatoriaId;
                    obj.ProyectoId = item;
                    obj.FechaRegistro = DateTime.Now;
                    obj.Autor = model.Autor;
                    obj.EdoProyecto = "Registrado";
                    obj.Estado = true;

                    var entities = _db.ProyectoPorConvocatoria.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjunto(Convocatoria model)
        {
            try
            {
                foreach (var item in model.adjuntosNuevosNombre)
                {
                    Adjunto obj = new Adjunto();
                    foreach (var item2 in model.adjuntosNuevosRuta)
                    {

                        obj.RutaCompleta = item2;
                        obj.nombre = item;
                        obj.ModuloId = "CR";
                        var entities = _dbGEN.dbSetAdjuntos.Add(obj);
                        await _dbGEN.SaveChangesAsync();
                        var adjuntoId = entities.AdjuntoId;
                        await insertaAdjuntoPorConvocatoria(model, adjuntoId);
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task insertaAdjuntoPorConvocatoria(Convocatoria model, long IdAdjunto)
        {
            try
            {
                AdjuntoPorConvocatoria obj = new AdjuntoPorConvocatoria();
                obj.Autor = model.Autor;
                obj.FechaRegistro = model.FechaRegistro;
                obj.Estado = true;
                obj.AdjuntoId = IdAdjunto;
                obj.ConvocatoriaId = model.ConvocatoriaId;

                var entities = _db.AdjuntoPorConvocatoria.Add(obj);
                await _db.SaveChangesAsync();


            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        private async Task EliminaSitioWeb(Convocatoria model)
        {
            try
            {
                foreach (var item in model.sitiosWebAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    SitioWebPorConvocatoria objSitioWeb = new SitioWebPorConvocatoria();

                    var _model = await _db.SitioWebPorConvocatoria.FirstOrDefaultAsync(e => e.SitioWebPorConvocatoriaId == item);
                    if (_model != null)
                    {
                        _db.SitioWebPorConvocatoria.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaPropuestaPorConv(Convocatoria model)
        {
            try
            {
                foreach (var item in model.propuestasAntDel)
                {
                    var _model = await _db.PropuestaPorConvocatoria.FirstOrDefaultAsync(e => e.PropuestaPorConvocatoriaId == item);
                    if (_model != null)
                    {
                        _db.PropuestaPorConvocatoria.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaProyectoPorConv(Convocatoria model)
        {
            try
            {
                foreach (var item in model.proyectosAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    var _model = await _db.ProyectoPorConvocatoria.FirstOrDefaultAsync(e => e.ProyectoPorConvocatoriaId == item);
                    if (_model != null)
                    {
                        _db.ProyectoPorConvocatoria.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
        //Contactos
        private async Task InsertaContactoUpdate(Convocatoria model)
        {
            try
            {
                foreach (var item in model.contactosNuevos)
                {
                    ContactoPorConvocatoria obj = new ContactoPorConvocatoria();
                    obj.ConvocatoriaId = model.ConvocatoriaId;
                    obj.ContactoId = item;
                    obj.Autor = model.Autor;
                    obj.FechaRegistro = model.FechaRegistro;
                    obj.Estado = true;

                    var entities = _db.ContactoPorConvocatoria.Add(obj);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task EliminaContacto(Convocatoria model)
        {
            try
            {
                foreach (var item in model.contactosAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    ContactoPorConvocatoria objSitioWeb = new ContactoPorConvocatoria();

                    var _model = await _db.ContactoPorConvocatoria.FirstOrDefaultAsync(e => e.ContactoPorConvocatoriaId == item);
                    if (_model != null)
                    {
                        _db.ContactoPorConvocatoria.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaAdjuntoAnt(Convocatoria model)
        {
            try
            {
                foreach (var item in model.adjuntosAntDel)
                {
                    //Crea el objeto de la tabla en la que se desea agregar el registro
                    AdjuntoPorConvocatoria objSitioWeb = new AdjuntoPorConvocatoria();

                    var _model = await _db.AdjuntoPorConvocatoria.FirstOrDefaultAsync(e => e.AdjuntoPorConvocatoriaId == item);
                    if (_model != null)
                    {
                        _db.AdjuntoPorConvocatoria.Remove(_model);
                        await _db.SaveChangesAsync();
                    }

                }
                if (model.adjuntosIdAntDel.Length > 0)
                {
                    await EliminaIdAdjuntoAnt(model);
                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }

        private async Task EliminaIdAdjuntoAnt(Convocatoria model)
        {
            try
            {
                foreach (var item in model.adjuntosIdAntDel)
                {
                    var _model = await _dbGEN.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == item);
                    if (_model != null)
                    {
                        _dbGEN.dbSetAdjuntos.Remove(_model);
                        await _dbGEN.SaveChangesAsync();
                    }

                }
            }
            catch (Exception e)
            {

                throw new Exception(e.Message, e);
            }
        }
    }
}
