using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class EstadoFlujoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        GEN_Context _ctx;

        /// <summary>
        /// Contrucctor de la clase EstadoFlujoRepository
        /// </summary>
        public EstadoFlujoRepository()
        {
            _ctx = new GEN_Context();
        }

        /// <summary>
        /// Obtiene la lista de los  flujos registrados en la base de datos.
        /// Catalogo de estados de flujo  CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<EstadoFlujo>> GetAll()
        {
            try
            {
                var estadoflujo = await _ctx.EstadoFlujo.AsNoTracking().ToListAsync();
                return estadoflujo;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene un flujo en especifico, el filtro es el id del campo requerido. 
        ///  Catalogo de campos CH
        /// </summary>
        /// <param name="estadoflujoId"> Id del campo requerido</param>
        /// <returns></returns>
        public async Task<EstadoFlujo> GetById(int estadoflujoId)
        {
            try
            {
                var estadoflujo = await _ctx.EstadoFlujo.AsNoTracking().FirstOrDefaultAsync(e => e.EstadoFlujoId == estadoflujoId);
                return estadoflujo;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo  de flujo al catalogo de estado del flujo. 
        /// Catalogo de EstadosFlujo CH
        /// </summary>
        /// <param name="EstadoFlujo">Objeto tipo EstadoFlujo</param>
        /// <returns></returns>
        public async Task Create(EstadoFlujo EstadoFlujo)
        {
            try
            {
                _ctx.EstadoFlujo.Add(EstadoFlujo);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto EstadoFlujo. 
        /// Catalogo de EstadoFlujo CH
        /// </summary>
        /// <param name="estadoFlujo"></param>
        /// <returns></returns>
        public async Task Update(EstadoFlujo estadoFlujo)
        {
            try
            {
                var _estadoflujo = await _ctx.EstadoFlujo.FirstOrDefaultAsync(e => e.EstadoFlujoId == estadoFlujo.EstadoFlujoId);
                if (_estadoflujo != null)
                {
                    //_estadoflujo.FechaEfectiva = estadoFlujo.FechaEfectiva;
                    _estadoflujo.Descripcion = estadoFlujo.Descripcion;
                    _estadoflujo.DescripcionCorta = estadoFlujo.DescripcionCorta;
                    _estadoflujo.Estado = estadoFlujo.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Elimina un registro del catalogo de EstadoFlujo. 
        /// Catalogo de EstadoFlujo CH
        /// </summary>
        /// <param name="estadoFlujoId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(int estadoFlujoId)
        {
            try
            {
                var _estadoflujo = await _ctx.EstadoFlujo.FirstOrDefaultAsync(e => e.EstadoFlujoId == estadoFlujoId);
                if (_estadoflujo != null)
                {
                    _ctx.EstadoFlujo.Remove(_estadoflujo);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
