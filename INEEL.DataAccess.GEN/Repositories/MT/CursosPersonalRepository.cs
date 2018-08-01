using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.MT.Models;
//using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class CursosPersonalRepository : IDisposable
    {
        private MT_Context _db;
        GEN_Context _dbGen;

        public CursosPersonalRepository()
        {
            _db = new MT_Context();
            _dbGen = new GEN_Context();
        }

        public async Task<IEnumerable<CursosPersonal>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetCursosPersonal.AsNoTracking()
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.TipoCurso)
                                        .Include(e=>e.EstadoFlujo)
                                        .Include(e => e.AutoresCursosPersonal)
                                        .Include(e => e.AdjuntoCursosPersonal)
                                        .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutoresCursosPersonal>> GetByClave(string clave)
        {
            try
            {
                List<AutoresCursosPersonal> list = new List<AutoresCursosPersonal>();
                var entities = await _db.dbSetAutoresCursosPersonal.Where(e => e.Autor_ClavePersona == clave)
                                        .Include(e=>e.CursosPersonal)
                                        .Include(e => e.CursosPersonal.Proyecto)
                                        .Include(e => e.CursosPersonal.TipoCurso)
                                        .Include(e => e.CursosPersonal.EstadoFlujo)
                                         .AsNoTracking()
                                        .ToListAsync();
                //foreach (var acp in entities)
                //{
                //    var id = acp.CursosPersonal.ProyectoId;
                //    var idcurso = acp.CursosPersonal.TipoCursoId;

                //    acp.CursosPersonal.TipoCurso = await GetTipoCurso(idcurso);
                //    acp.CursosPersonal.Proyecto = await GetByIdProyecto(id);
                //    list.Add(acp);
                //}
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<TipoCurso> GetTipoCurso(int id)
        {
            try
            {
                var entities = await _db.dbSetCAT_TipoCurso.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.TipoCursoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Proyecto> GetByIdProyecto(string proyectoId)
        {
            try
            {
                var proyecto = await _dbGen.dbSetProyectoGEN.AsNoTracking().FirstOrDefaultAsync(e => e.ProyectoId == proyectoId);
                return proyecto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public CursosPersonal Get_(int id)
        {
            try
            {
                var entities = _db.dbSetCursosPersonal
                    // .Include(x=> x.FK)
                    .FirstOrDefault(e => e.CursosPersonalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<CursosPersonal> GetById(int id)
        {
            try
            {
                var entities = await _db.dbSetCursosPersonal
                                        .Include(e => e.Proyecto)
                                        .Include(e=>e.TipoCurso)
                                        .Include(e=>e.AdjuntoCursosPersonal)
                                        .Include(e => e.AutoresCursosPersonal)
                                        .Include("AdjuntoCursosPersonal.Adjunto")
                                        .Include(e=>e.EstadoFlujo)
                                        .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.CursosPersonalId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(CursosPersonal model)
        {
            try
            {

                _db.dbSetCursosPersonal.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CursosPersonal model)
        {
            try
            {
                var _model = await _db.dbSetCursosPersonal
                    .FirstOrDefaultAsync(e => e.CursosPersonalId == model.CursosPersonalId);
                if (_model != null)
                {
                    foreach (var adjuntoCursosPersonal in model.AdjuntoCursosPersonal)
                    {
                        if (adjuntoCursosPersonal.Adjunto!= null )
                        {
                            try
                            {
                                if (adjuntoCursosPersonal.Adjunto.AdjuntoId < 1) //NUEVO ADJUNTO
                            {
                               
                                    _dbGen.dbSetAdjuntos.Add(adjuntoCursosPersonal.Adjunto);
                                    await _dbGen.SaveChangesAsync(); //guardar el adjunto

                                    adjuntoCursosPersonal.AdjuntoId = adjuntoCursosPersonal.Adjunto.AdjuntoId;
                                    adjuntoCursosPersonal.CursosPersonalId = model.CursosPersonalId;
                                    //guardar nuevo adjuntoCursosPersonal
                                    _db.dbSetAdjuntoCursosPersonal.Add(adjuntoCursosPersonal);
                                    await _db.SaveChangesAsync(); //guardar el adjunto                              
                                }
                                else //adjunto existente: actualizar el adjunto
                                {
                                    var _modelAdjunto = await _dbGen.dbSetAdjuntos.FirstOrDefaultAsync(e => e.AdjuntoId == adjuntoCursosPersonal.Adjunto.AdjuntoId);
                                    _dbGen.Entry(_modelAdjunto).CurrentValues.SetValues(adjuntoCursosPersonal.Adjunto);
                                    await _dbGen.SaveChangesAsync();
                                }
                            }
                            catch (Exception e)
                            {
                                throw new Exception(e.Message, e);
                            }
                        }
                    }
                    foreach (var autoresCursosPersonal in model.AutoresCursosPersonal)
                    {
                            try
                            {
                                if (autoresCursosPersonal.AutoresCursosPersonalId < 1) //NUEVO Autor
                                {
                                    autoresCursosPersonal.Autor_ClavePersona = autoresCursosPersonal.Autor_ClavePersona;
                                    autoresCursosPersonal.Autor_Nombre = autoresCursosPersonal.Autor_Nombre;
                                    autoresCursosPersonal.CursosPersonalId = model.CursosPersonalId;
                                autoresCursosPersonal.AutoresCursosPersonalId = autoresCursosPersonal.AutoresCursosPersonalId;
                                //guardar nuevo adjuntoCursosPersonal
                                _db.dbSetAutoresCursosPersonal.Add(autoresCursosPersonal);
                                    await _db.SaveChangesAsync(); //guardar el adjunto                              
                                }
                                else //adjunto existente: actualizar el adjunto
                                {
                                    var _modelAutores = await _db.dbSetAutoresCursosPersonal.FirstOrDefaultAsync(e => e.AutoresCursosPersonalId == autoresCursosPersonal.AutoresCursosPersonalId);
                                    _db.Entry(_modelAutores).CurrentValues.SetValues(autoresCursosPersonal);
                                    await _db.SaveChangesAsync();
                                }
                            }
                            catch (Exception e)
                            {
                                throw new Exception(e.Message, e);
                            }
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

        public async Task UpdateEstado(CursosPersonal model)
        {
            try
            {
                var _model = await _db.dbSetCursosPersonal.FirstOrDefaultAsync(e => e.CursosPersonalId == model.CursosPersonalId);
                if (_model != null)
                {
                    _model.EstadoActivoId = model.EstadoActivoId;
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task DeleteAdjuntoCursosPersonal(int Id)
        {   
            try
            {
                var _adjuntoBe = await _db.dbSetAdjuntoCursosPersonal.FirstOrDefaultAsync(e => e.AdjuntoCursosPersonalId == Id);
               var identificador = _adjuntoBe.AdjuntoId;
                
                if (_adjuntoBe != null)
                {
                    //_adjuntoBe.CursosPersonal=null;
                    _db.dbSetAdjuntoCursosPersonal.Remove(_adjuntoBe);
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

        public async Task DeleteAutorCursosPersonal(int Id)
        {
            try
            {
                var _adjuntoBe = await _db.dbSetAutoresCursosPersonal.FirstOrDefaultAsync(e => e.AutoresCursosPersonalId == Id);

                if (_adjuntoBe != null)
                {
                    _db.dbSetAutoresCursosPersonal.Remove(_adjuntoBe);
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
                var _model = await _db.dbSetCursosPersonal
                    .Include(x=>x.AdjuntoCursosPersonal)
                    .FirstOrDefaultAsync(e => e.CursosPersonalId == id);
                long idAdjunto = -1;
                List<AdjuntoCursosPersonal> adjuntos = new List<AdjuntoCursosPersonal>();
                if (_model != null)
                {
                    adjuntos = _model.AdjuntoCursosPersonal.ToList();
                    _db.dbSetCursosPersonal.Remove(_model); //ELIMINAN AL BECARIO
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
    }
}
