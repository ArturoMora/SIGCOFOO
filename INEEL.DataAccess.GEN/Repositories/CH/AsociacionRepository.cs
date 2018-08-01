using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AsociacionRepository :IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase AsociacionRepository
        /// </summary>
        public AsociacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de todos los registros de la tabla tab_Asociacion
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Asociacion>> GetAll()
        {
            try
            {
                var Asociacion = await _ctx.Asociacion.Where(e=>e.Estado==1).AsNoTracking()
                    .OrderBy(x=>x.Descripcion)
                    .ToListAsync();
                return Asociacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Asociacion>> GetAllAdmin()
        {
            try
            {
                var Asociacion = await _ctx.Asociacion.AsNoTracking().OrderBy(x => x.Descripcion).ToListAsync();
                return Asociacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene un elemento del catalogo Asociacion 
        /// </summary>
        /// <param name="Id">identificador del elemento a obtener</param>
        /// <returns></returns>
        public async Task<Asociacion> GetById(int id)
        {
            try
            {
                var Asociacion = await _ctx.Asociacion.AsNoTracking().FirstOrDefaultAsync(p => p.AsociacionId == id);
                return Asociacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Crea un nuevo registro de Asociacion
        /// </summary>
        /// <param name="Asociacion">objeto tipo Asociacion</param>
        /// <returns></returns>
        public async Task Create(Asociacion asociacion)
        {
            try
            {
                _ctx.Asociacion.Add(asociacion);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza un registro de la tabla de Asociacion
        /// </summary>
        /// <param name="Asociacion">objeto de tipo Asociacion con los nuevos datos</param>
        /// <returns></returns>
        public async Task Update(Asociacion asociacion)
        {
            try
            {
                var _Asociacion = await _ctx.Asociacion.FirstOrDefaultAsync(e => e.AsociacionId == asociacion.AsociacionId);
                if (_Asociacion != null)
                {

                    _Asociacion.Descripcion = asociacion.Descripcion;
                    _Asociacion.DescripcionCorta = asociacion.DescripcionCorta;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Asociacion asociacion)
        {
            try
            {
                var _Asociacion = await _ctx.Asociacion.FirstOrDefaultAsync(e => e.AsociacionId == asociacion.AsociacionId);
                if (_Asociacion != null)
                {
                    _Asociacion.Estado = asociacion.Estado;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Elimina un registro de la tabla de Asociacion 
        /// </summary>
        /// <param name="Asociacionid">Id del registro a eliminar</param>
        /// <returns></returns>
        public async Task Delete(int Asociacionid)
        {
            try
            {
                var _Asociacion = await _ctx.Asociacion.FirstOrDefaultAsync(e => e.AsociacionId == Asociacionid);
                if (_Asociacion != null)
                {
                    _ctx.Asociacion.Remove(_Asociacion);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Valida que no existan asociaciones repetidas
        /// </summary>
        /// <param name="model"><Publicacion>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(Asociaciones model)
        {
            try
            {
                // var data= await GetDALikeTituloNuevo(model.TituloPublicacion);
                var registros = await _ctx.Asociaciones.Where(e => e.ClavePersona == model.ClavePersona && e.AsociacionId== model.AsociacionId
                         && DbFunctions.TruncateTime(e.FechaInicio) == DbFunctions.TruncateTime(model.FechaInicio)
                         && DbFunctions.TruncateTime(e.FechaTermino) == DbFunctions.TruncateTime(model.FechaTermino)
                         && e.AsociacionesId != model.AsociacionesId)
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


        public void Dispose()
        {
            ((IDisposable)_ctx).Dispose();
        }

    }
}
