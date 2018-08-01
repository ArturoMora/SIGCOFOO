using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AsociacionesRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase IdiomasRepository
        /// </summary>
        public AsociacionesRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public AsociacionesRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        /// <summary>
        /// Obtiene la lista de todos los registros de la tabla asociaciones
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Asociaciones>> GetAll()
        {
            try
            {
                var asociaciones = await _ctx.Asociaciones.AsNoTracking().ToListAsync();
                return asociaciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Asociaciones>> GetForCV(string id)
        {
            try
            {
                var asociaciones = await _ctx.Asociaciones.Where(e => e.ClavePersona.Equals(id))
                                                .Where(e=>e.EstadoFlujoId==3)
                                                .Include(e => e.Adjunto)
                                                .Include(e => e.EstadoFlujo)
                                                .Include(e => e.Asociacion)
                                                .AsNoTracking()
                                                .ToListAsync();
                return asociaciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene la lista de las asociaciones registradas por empleado
        /// </summary>
        /// <param name="claveempleado"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Asociaciones>> GetByClaveEmpleado(string claveempleado)
        {
            try
            {
                var asociaciones = await _ctx.Asociaciones.Where(e => e.ClavePersona.Equals(claveempleado))
                                                .Include(e=>e.Adjunto)
                                                .Include(e => e.EstadoFlujo)
                                                .Include(e => e.Asociacion)
                                                .AsNoTracking()
                                                .ToListAsync();
                foreach (var item in asociaciones)
                {
                        if (item.EstadoFlujoId == 2)
                        {
                            item.EstadoFlujo.Descripcion += " Admin CH";
                        }
                }
                return asociaciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Asociaciones> GetById(int id)
        {
            try
            {
                var asociaciones = await _ctx.Asociaciones.Where(e => e.AsociacionesId.Equals(id))
                                                .Include(e => e.Adjunto)
                                                .Include(e => e.EstadoFlujo)
                                                .Include(e => e.Asociacion)
                                                .AsNoTracking()
                                                .FirstOrDefaultAsync();
                return asociaciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un nuevo registro de asociacion
        /// </summary>
        /// <param name="asociaciones">objeto de tipo asociaciones </param>
        /// <returns></returns>
        public async Task Create(Asociaciones asociaciones)
        {
            try
            {
                _ctx.Asociaciones.Add(asociaciones);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza un registro de la tabla asociaciones 
        /// </summary>
        /// <param name="asociaciones">objeto de tipo asociaciones que contiene los datos para actualizar </param>
        /// <returns></returns>
        public async Task Update(Asociaciones asociaciones)
        {
            try
            {
                var _asociaciones = await _ctx.Asociaciones.FirstOrDefaultAsync(e => e.AsociacionesId == asociaciones.AsociacionesId);
                if (_asociaciones != null)
                {
                    if (asociaciones.Adjunto != null)
                    {
                        AdjuntoRepository _adjuntoRepo = new AdjuntoRepository();
                        //Eliminar archivo
                        if (asociaciones.Adjunto.nombre == "eliminar")
                        {
                            var id = asociaciones.Adjunto.AdjuntoId;
                            _asociaciones.AdjuntoId = null;
                            asociaciones.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();
                            
                            await _adjuntoRepo.Delete(id);
                            //formacionacademica.Adjunto = null;
                            //await _faRepo.Update(formacionacademica);
                            
                        }
                        ///Agregar archivo al editar
                        if (asociaciones.Adjunto.AdjuntoId == 0)
                        {
                            if (_asociaciones.AdjuntoId!=null)
                            {
                                var id = _asociaciones.AdjuntoId;
                                _asociaciones.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();

                                await _adjuntoRepo.Delete(id);
                                
                            }
                            Adjunto key = await _adjuntoRepo.CreateAd(asociaciones.Adjunto);
                            asociaciones.AdjuntoId = key.AdjuntoId;
                        }
                    }
                    _ctx.Entry(_asociaciones).CurrentValues.SetValues(asociaciones);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Asociaciones Asociaciones)
        {
            try
            {
                var _Asociaciones = await _ctx.Asociaciones.FirstOrDefaultAsync(e => e.AsociacionesId == Asociaciones.AsociacionesId);
                if (_Asociaciones != null)
                {
                    _Asociaciones.EstadoFlujoId = Asociaciones.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateSolicitud(Asociaciones Asociaciones)
        {
            try
            {
                var _Asociaciones = await _ctx.Asociaciones.FirstOrDefaultAsync(e => e.AsociacionesId == Asociaciones.AsociacionesId);
                if (_Asociaciones != null)
                {
                    _ctx.Entry(_Asociaciones).CurrentValues.SetValues(Asociaciones);
                    await _ctx.SaveChangesAsync();

                
                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(Asociaciones.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);



                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Elimina un registro de la tabla asociaciones
        /// </summary>
        /// <param name="asociacionesid"></param>
        /// <returns></returns>
        public async Task Delete(int asociacionesid)
        {
            try
            {
                var _asociaciones = await _ctx.Asociaciones.FirstOrDefaultAsync(e => e.AsociacionesId == asociacionesid);
                if (_asociaciones != null)
                {
                    _ctx.Asociaciones.Remove(_asociaciones);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            ((IDisposable)_ctx).Dispose();
        }
    }
}
