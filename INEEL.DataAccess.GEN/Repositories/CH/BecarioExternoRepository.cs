using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.GEN;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class BecarioExternoRepository : IDisposable
    {
        SIGCOCHContext _db;
        GEN_Context _dbGen;
        GEN_Context _gen;
        //int LongitudClave = 5; //Longitud de Clave_Persona

        public BecarioExternoRepository()
        {
            _db = new SIGCOCHContext();
            _dbGen = new GEN_Context();
            _gen = new GEN_Context();
        }
        public BecarioExternoRepository(SIGCOCHContext context)
        {
            _db = context;
        }

        public async Task<int> counInternoANDExternoByStatus(int estadoFlujo)
        {
            try
            {
                                                //_db.BecarioExterno
                var externo = await (from t in _db.BecarioDirigido
                               .Where(f => f.EstadoFlujoId == estadoFlujo)
                              select t).CountAsync();
                var interno = await (from t in _db.BecarioInterno
                         .Where(f => f.EstadoFlujoId == estadoFlujo)
                              select t).CountAsync();
                return interno + externo;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> GetAll()
        {
            try
            {
                var entities = await _db.BecarioExterno.AsNoTracking()
                                        //.Include(e => e.Asesor)
                                        //.Include(e => e.Becario)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoBeca)
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.Institucion)
                                        .Include(e => e.AdjuntoBecarioExterno)
                                        .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public BecarioExterno Get_(int id)
        {
            try
            {
                var entities = _db.BecarioExterno
                    // .Include(x=> x.FK)
                    .FirstOrDefault(e => e.BecarioExternoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<BecarioExterno> GetById(int id)
        {
            try
            {
                var entities = await _db.BecarioExterno
                                        //.Include(e => e.Asesor)
                                        //.Include(e => e.Becario)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoBeca)
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.Institucion)
                                        .Include(e=>e.AdjuntoBecarioExterno)
                                        .Include("AdjuntoBecarioExterno.Adjunto")
                                        .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.BecarioExternoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> GetForCV(string id)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e => e.Becario_ClavePersona == id
                    &&e.EstadoFlujoId==3 || (e.EstadoFlujoId == 11) || (e.EstadoFlujoId == 12) || (e.EstadoFlujoId == 13))
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> GetByClaveBecario(string clave)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e=> e.Becario_ClavePersona==clave)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();

                foreach (var item in entities)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> GetByClaveAsesor(string clave)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e => e.Asesor_ClavePersona == clave)
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> getData(DataServerSide ss)
        {
            try
            {
                var v = (from a in _db.BecarioExterno.Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                        .Include(e => e.TipoBeca)
                        .Include(e => e.Proyecto)
                        .Include(e => e.Institucion)
                         select a);

                List<string> clavesP = new List<string>(v.Select(x => x.Becario_ClavePersona));

                List<Personas> Personas = await _gen.dbSetPersonas.Where(x => clavesP.Contains(x.ClavePersona))
                    .AsNoTracking().ToListAsync();

                ss.recordsTotal = v.Count();
                //search
                if (!string.IsNullOrEmpty(ss.Autor))
                {
                    v = v.Where(e => e.Asesor_ClavePersona.Contains(ss.Autor)
                    && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13));


                }
                if (!string.IsNullOrEmpty(ss.Becario))
                {
                    v = v.Where(e => e.Becario_ClavePersona.Contains(ss.Becario)
                    && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13));
                }
                if (!string.IsNullOrEmpty(ss.Titulo))
                {
                    var pal = ss.Titulo.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e => (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                    && e.Titulo.Contains(p)
                            //||e.Proyecto.Nombre.Contains(p)
                            //|| e.Descripcion.Contains(p))
                            );
                    }
                }
                if (!string.IsNullOrEmpty(ss.Institucion))
                {
                    v = v.Where(e => e.InstitucionID.ToString().Contains(ss.Institucion)
                    && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                    );
                }
                if (!string.IsNullOrEmpty(ss.proyectoId))
                {
                    v = v.Where(e => e.ProyectoId.ToString().Contains(ss.proyectoId)
                    && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                    );
                }
                if (!string.IsNullOrEmpty(ss.Tipo))
                {
                    v = v.Where(e => e.TipoBecaId.ToString().Contains(ss.Tipo)
                    && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                    );
                }

                //var fecTer = ss.FechaFin.AddHours(23);

                //if (ss.FechaFin > ss.FechaInicio)
                //{
                //    v = v.Where(e => (DbFunctions.TruncateTime(e.FechaInicio) > DbFunctions.TruncateTime(ss.FechaInicio)) && (DbFunctions.TruncateTime(ss.FechaFin) < DbFunctions.TruncateTime(e.FechaTermino)));
                //}

                if (!string.IsNullOrEmpty(ss.NuevaFechaInicio) || !string.IsNullOrEmpty(ss.NuevaFechaTermino) )
                {

                    var listaDA = await GetPorfecha(ss.NuevaFechaInicio, ss.NuevaFechaTermino);
                    v = v.Where(e => listaDA.Contains(e.BecarioExternoId));

                }


                //caja
                if (!string.IsNullOrEmpty(ss.searchValue))
                {
                    //var pal = ss.searchValue.Split(' ');
                    //foreach (var pa in pal)
                    //{
                    var p = ss.searchValue.ToLower();
                    v = v.Where(e => e.Proyecto.Nombre.Contains(p)
                    //|| e.ProyectoId.ToString().Contains(p)
                    || e.FechaInicio.ToString().Contains(p)
                    || e.FechaTermino.ToString().Contains(p)
                    || e.Titulo.Contains(p)
                    || e.Becario_Nombre.Contains(p)
                    || e.Institucion.Descripcion.Contains(p)
                    || e.Asesor_Nombre.Contains(p)
                    || e.TipoBeca.Descripcion.Contains(p)
        && (e.EstadoFlujoId == 3 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                    );
                    //}

                }

                //sort
                if (!(string.IsNullOrEmpty(ss.sortColumn) && string.IsNullOrEmpty(ss.sortColumnDir)))
                {
                    //for make sort simpler we will add Syste.Linq.Dynamic reference
                    v = v.OrderBy(ss.sortColumn + " " + ss.sortColumnDir);
                }

                ss.recordsFiltered = v.Count();
                var entities = await v.Skip(ss.skip).Take(ss.pageSize).AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {
                    var perso = Personas.Find(x => x.ClavePersona == item.Becario_ClavePersona);
                    if (perso != null)
                    {
                        item.Becario_Nombre = perso.NombreCompleto;
                    }
                }

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(BecarioExterno model)
        {
            try
            {

                _db.BecarioExterno.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(BecarioExterno model)
        {
            try
            {
                var _model = await _db.BecarioExterno
                    .FirstOrDefaultAsync(e => e.BecarioExternoId == model.BecarioExternoId);

                if (model.EstadoFlujoId == 1 && _model.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("BecarioExterno", _model.BecarioExternoId + "");
                }
                if (_model != null)
                {
                    foreach (var adjuntoBecarioExterno in model.AdjuntoBecarioExterno)
                    {
                        if (adjuntoBecarioExterno.Adjunto!= null )
                        {
                            try
                            {
                                if (adjuntoBecarioExterno.Adjunto.AdjuntoId < 1) //NUEVO ADJUNTO
                            {

                                    _dbGen.dbSetAdjuntos.Add(adjuntoBecarioExterno.Adjunto);
                                    await _dbGen.SaveChangesAsync(); //guardar el adjunto

                                    adjuntoBecarioExterno.AdjuntoId = adjuntoBecarioExterno.Adjunto.AdjuntoId;
                                    adjuntoBecarioExterno.BecarioExternoId = model.BecarioExternoId;
                                    //guardar nuevo adjuntoBecarioExterno
                                    _db.AdjuntoBecarioExterno.Add(adjuntoBecarioExterno);
                                    await _db.SaveChangesAsync(); //guardar el adjunto
                                    _dbGen = new GEN_Context();
                                }
                                else //adjunto existente: actualizar el adjunto
                                {
                                    if (adjuntoBecarioExterno.Adjunto.nombre.Equals("eliminar"))
                                    {

                                        var _adjuntoBe = await _db.AdjuntoBecarioExterno.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoBecarioExterno.Adjunto.AdjuntoId);
                                        if (_adjuntoBe != null)
                                        {
                                            _db.AdjuntoBecarioExterno.Remove(_adjuntoBe);
                                            await _db.SaveChangesAsync();
                                        }
                                    }
                                    else
                                    {

                                        var _modelAdjunto = await _dbGen.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoBecarioExterno.Adjunto.AdjuntoId);
                                        _dbGen.Entry(_modelAdjunto).CurrentValues.SetValues(adjuntoBecarioExterno.Adjunto);
                                        await _dbGen.SaveChangesAsync();
                                    }
                                    //if (model.EstadoFlujoId == 3)
                                    //{
                                    //    await new NuevoOCRepository().Create(
                                    //    new NuevoOC("CH",
                                    //               "IBE",
                                    //    model.Titulo,
                                    //    "indexMT.html#/InformeBecariooDetails/" + model.BecarioExternoId
                                    //        ));
                                    //}
                                    
                                }
                            }
                            catch (Exception e)
                            {
                                throw new Exception(e.Message, e);
                            }
                        }
                    }

                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();


                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(model.Asesor_ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);

                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(BecarioExterno model)
        {
            try
            {
                var _model = await _db.BecarioExterno.FirstOrDefaultAsync(e => e.BecarioExternoId == model.BecarioExternoId);
                if (_model != null)
                {
                    _model.EstadoActivoId = model.EstadoActivoId;
                    await _db.SaveChangesAsync();
                }
                try
                {
                    List<String> cambios = new List<string>();
                    cambios.Add("se modifica el estado ");
                    BitacoraSISTEMA.InsertaMovCRUD(
                       String.Concat("BecarioExterno_",_model.BecarioExternoId),
                       String.Concat("El registro con el becario ", _model.Becario_Nombre),
                        cambios,
                        null, Movimiento.edit); // Insertamos en la bitácora de movimientos.
                }
                catch (Exception e) { }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task DeleteAdjuntoBecarioExterno(int Id)
        {

            try
            {
                var _adjuntoBe = await _db.AdjuntoBecarioExterno.FirstOrDefaultAsync(e => e.AdjuntoBecarioExternoId == Id);
               var identificador = _adjuntoBe.AdjuntoId;

                if (_adjuntoBe != null)
                {
                    //_adjuntoBe.BecarioExterno=null;
                    _db.AdjuntoBecarioExterno.Remove(_adjuntoBe);
                    await _db.SaveChangesAsync();



                    //eliminando adjuntoBe procedemos  ELIMININAR EL ADJUNTO
                    try
                    {
                        var _adjuno = await _dbGen.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId== identificador);

                        if (_adjuno != null)
                        {
                            _dbGen.dbSetAdjuntos.Remove(_adjuno);
                            await _dbGen.SaveChangesAsync();
                            //eliminando adjuntoBe procedemos  ELIMININAR EL ADJUNTO

                        }
                    }
                    catch (Exception e)
                    {
                       // throw new Exception(e.Message, e);
                    }



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
                var _model = await _db.BecarioExterno
                    .Include(x=>x.AdjuntoBecarioExterno)
                    .FirstOrDefaultAsync(e => e.BecarioExternoId == id);
                long idAdjunto = -1;
                List<AdjuntoBecarioExterno> adjuntos = new List<AdjuntoBecarioExterno>();
                if (_model != null)
                {
                    adjuntos = _model.AdjuntoBecarioExterno.ToList();
                    _db.BecarioExterno.Remove(_model); //ELIMINAN AL BECARIO
                    await _db.SaveChangesAsync();
                    foreach (var fil in adjuntos) //SE RECORREN TODOS LOS ADJUNTOS
                    {

                        try
                        {
                            var _modelF = await _dbGen.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == fil.AdjuntoId);
                            _dbGen.dbSetAdjuntos.Remove(_modelF); //SE ELIMINA CADA DJUNTO
                            await _dbGen.SaveChangesAsync();

                        }
                        catch(Exception e) { }
                    }
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
            _dbGen.Dispose();
        }

        public async Task<IEnumerable<BecarioExterno>> GetByAsesor(string clave)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e => e.Asesor_ClavePersona == clave && e.EstadoFlujoId == 3 || ((e.EstadoFlujoId == 11) || (e.EstadoFlujoId == 12) || (e.EstadoFlujoId == 13)))
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> GetByTitulo(string id)
        {
            try
            {
                var v = (from a in _db.BecarioExterno
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                         select a);
                if (!String.IsNullOrEmpty(id))
                {
                    var pal = id.Split(' ');
                    foreach (var pa in pal)
                    {
                        var p = pa.ToLower();
                        v = v.Where(e => e.Titulo.ToLower().Contains(p) && e.EstadoFlujoId == 3 || (e.EstadoFlujoId == 11) || (e.EstadoFlujoId == 12) || (e.EstadoFlujoId == 13));
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

        public async Task<IEnumerable<BecarioExterno>> GetByInstitucion(int Institucion)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e => e.InstitucionID == Institucion && e.EstadoFlujoId == 3 || (e.EstadoFlujoId == 11) || (e.EstadoFlujoId == 12) || (e.EstadoFlujoId == 13))
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        




        public async Task<IEnumerable<BecarioExterno>> GetByProyecto(string Proyecto)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e => e.ProyectoId==Proyecto && e.EstadoFlujoId == 3 || (e.EstadoFlujoId == 11) || (e.EstadoFlujoId == 12) || (e.EstadoFlujoId == 13))
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecarioExterno>> GetByTipo(int Tipo)
        {
            try
            {
                var entities = await _db.BecarioExterno.Where(e => e.TipoBecaId == Tipo && e.EstadoFlujoId == 3 || (e.EstadoFlujoId == 11) || (e.EstadoFlujoId == 12) || (e.EstadoFlujoId == 13))
                                                        .Include(e => e.Institucion)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoBeca)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.Institucion)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BecarioExterno> GetExistente(BecarioExterno Obj)
        {
            try
            {
                var result = await _db.BecarioExterno.Where(e => e.Becario_ClavePersona == Obj.Becario_ClavePersona && e.TipoBecaId == Obj.TipoBecaId && e.Asesor_ClavePersona == Obj.Asesor_ClavePersona)
                                                                                                //.Include(e => e.EstadoFlujo)
                                                                                                //.Include(e => e.TipoBeca)
                                                                                                //.Include(e => e.Proyecto)
                                                                                                //.Include(e => e.UnidadOrganizacional)
                                                                                                //.Include(e => e.Adjunto)
                                                                                                .Include(e => e.Institucion)
                                        .Include(e => e.AdjuntoBecarioExterno)
                                        .Include("AdjuntoBecarioExterno.Adjunto")
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<int>> GetPorfecha(string inicio, string termino)
        {
            try
            {
                var query = "SELECT BecarioExternoId FROM CH.tab_BecarioExterno where FechaInicio >  convert(date,'" + inicio + "',103) and FechaTermino <  convert(date,'" + termino + "',103)";
                var resultados = await _db.Database.SqlQuery<int>(query).ToListAsync();
                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de becarios externos
        /// </summary>
        /// <param name="model"><BecarioExterno>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(BecarioExterno model)
        {
            try
            {
                var registros = await _db.BecarioExterno.Where(e => e.Becario_ClavePersona == model.Becario_ClavePersona && e.TipoBecaId == model.TipoBecaId
                         && DbFunctions.TruncateTime(e.FechaInicio) == DbFunctions.TruncateTime(model.FechaInicio) 
                         && DbFunctions.TruncateTime(e.FechaTermino)== DbFunctions.TruncateTime(model.FechaTermino) 
                         && e.BecarioExternoId!= model.BecarioExternoId)
                         .AsNoTracking().CountAsync();
                if (registros > 0)
                {
                    return true;
                }
                return false;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

    }
}
