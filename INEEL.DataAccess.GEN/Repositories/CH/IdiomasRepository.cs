using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using System.Linq.Dynamic;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class IdiomasRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase IdiomasRepository
        /// </summary>
        public IdiomasRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public IdiomasRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }
        /// <summary>
        /// Obtiene la lista de todos los registros de la tabla tab_idioma
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Idiomas>> GetAll()
        {
            try
            {
                var idiomas = await _ctx.Idiomas.AsNoTracking().ToListAsync();
                return idiomas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Idiomas>> GetForCV(string id)
        {
            try
            {
                var idiomas = await _ctx.Idiomas.Where(e => e.ClavePersona.Equals(id))
                                                .Where(e => e.EstadoFlujoId == 3)
                                                .Include(e => e.EstadoFlujo)
                                                .Include(e => e.Idioma)
                                                .Include(e => e.Certificacion)
                                                .Include(e => e.Adjunto)
                                                .AsNoTracking()
                                                .ToListAsync();
                return idiomas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene unas lista de los idiomas registrados en tab_idiomas por empleado
        /// </summary>
        /// <param name="claveempleado"> clave del empleado para consultar los idiomas que ha registrado</param>
        /// <returns>lista de idiomas por empleado</returns>
        public async Task<IEnumerable<Idiomas>> GetByClaveEmpleado(string claveempleado)
        {
            try
            {
                var idiomas = await _ctx.Idiomas.Where(e => e.ClavePersona.Equals(claveempleado))
                                                .Include(e => e.EstadoFlujo)
                                                .Include(e => e.Idioma)
                                                .Include(e => e.Certificacion)
                                                .Include(e => e.Adjunto)
                                                .AsNoTracking()
                                                .ToListAsync();
                foreach (var item in idiomas)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return idiomas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Idiomas> GetById(int idiomaid)
        {
            try
            {
                var idiomas = await _ctx.Idiomas.Where(e => e.IdiomasId == idiomaid)
                                                .Include(e => e.EstadoFlujo)
                                                .Include(e => e.Idioma)
                                                .Include(e => e.Certificacion)
                                                .Include(e => e.Adjunto)
                                                .AsNoTracking()
                                                .FirstOrDefaultAsync();
                return idiomas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un nuevo registro de idiomas por empleado
        /// </summary>
        /// <param name="idioma">objeto tipo idiomas</param>
        /// <returns></returns>
        public async Task Create(Idiomas idioma)
        {
            try
            {
                _ctx.Idiomas.Add(idioma);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza un registro de la tabla de idiomas
        /// </summary>
        /// <param name="idioma">objeto de tipo Idiomas con los nuevos datos</param>
        /// <returns></returns>
        public async Task Update(Idiomas idioma)
        {
            try
            {
                var _idioma = await _ctx.Idiomas.FirstOrDefaultAsync(e => e.IdiomasId == idioma.IdiomasId);
                if (_idioma != null)
                {
                    if (idioma.Adjunto != null)
                    {
                        //Eliminar archivo
                        if (idioma.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(idioma.Adjunto.AdjuntoId);
                            _idioma.AdjuntoId = null;
                            idioma.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();

                            await new AdjuntoRepository().Delete(id);
                            
                        }
                        ///Agregar archivo al editar
                        if (idioma.Adjunto.AdjuntoId == 0)
                        {
                            if (_idioma.AdjuntoId != null)
                            {
                                var id = _idioma.AdjuntoId;
                                _idioma.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();

                                await new AdjuntoRepository().Delete(id);
                            }
                            Adjunto key = await new AdjuntoRepository().CreateAd(idioma.Adjunto);
                            idioma.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }

                    _ctx.Entry(_idioma).CurrentValues.SetValues(idioma);

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateSolicitud(Idiomas idioma)
        {
            try
            {
                var _idioma = await _ctx.Idiomas.FirstOrDefaultAsync(e => e.IdiomasId == idioma.IdiomasId);
                if (_idioma != null)
                {

                    _idioma.FechaValidacion = idioma.FechaValidacion;
                    _idioma.EstadoFlujoId = idioma.EstadoFlujoId;
                    _idioma.IdiomaId = idioma.IdiomaId;
                    _idioma.PorcentajeGradoDominio = idioma.PorcentajeGradoDominio;
                    _idioma.PorcentajeConversacion = idioma.PorcentajeConversacion;
                    _idioma.PorcentajeEscritura = idioma.PorcentajeEscritura;
                    _idioma.PorcentajeLectura = idioma.PorcentajeLectura;
                    _idioma.FechaAcreditacion = idioma.FechaAcreditacion;
                    _idioma.Puntuacion = idioma.Puntuacion;
                    _idioma.CertificacionId = idioma.CertificacionId;

                    await _ctx.SaveChangesAsync();

                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(idioma.ClavePersona);
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
        /// Elimina un registro de la tabla de idiomas 
        /// </summary>
        /// <param name="idiomasid">Id del registro a eliminar</param>
        /// <returns></returns>
        public async Task Delete(int idiomasid)
        {
            try
            {
                var _idiomas = await _ctx.Idiomas.FirstOrDefaultAsync(e => e.IdiomasId == idiomasid);
                if (_idiomas != null)
                {
                    _ctx.Idiomas.Remove(_idiomas);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Idiomas Idiomas)
        {
            try
            {
                var _Idiomas = await _ctx.Idiomas.FirstOrDefaultAsync(e => e.IdiomasId == Idiomas.IdiomasId);
                if (_Idiomas != null)
                {
                    _Idiomas.EstadoFlujoId = Idiomas.EstadoFlujoId;

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
