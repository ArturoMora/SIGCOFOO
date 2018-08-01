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
    public class EstadoAcademicoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase EstadoAcademicoRepository
        /// </summary>
        public EstadoAcademicoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de los  Estados Academicos registrados en la base de datos.
        /// Catalogo de estados de Academicos  CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<EstadoAcademico>> GetAll()
        {
            try
            {
                var estadoAcademico = await _ctx.EstadoAcademico.AsNoTracking().ToListAsync();
                return estadoAcademico;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene un Academico en especifico, el filtro es el id del campo requerido. 
        ///  Catalogo de EstadoAcademico CH
        /// </summary>
        /// <param name="estadoAcademicoId"> Id del campo requerido</param>
        /// <returns></returns>
        public async Task<EstadoAcademico> GetById(int estadoAcademicoId)
        {
            try
            {
                var estadoAcademico = await _ctx.EstadoAcademico.AsNoTracking().FirstOrDefaultAsync(e => e.EstadoAcademicoId == estadoAcademicoId);
                return estadoAcademico;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo  de Academico al catalogo de estado del Academico. 
        /// Catalogo de EstadosAcademico CH
        /// </summary>
        /// <param name="EstadoAcademico">Objeto tipo EstadoAcademico</param>
        /// <returns></returns>
        public async Task Create(EstadoAcademico EstadoAcademico)
        {
            try
            {
                _ctx.EstadoAcademico.Add(EstadoAcademico);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto EstadoAcademico. 
        /// Catalogo de EstadoAcademico CH
        /// </summary>
        /// <param name="estadoAcademico"></param>
        /// <returns></returns>
        public async Task Update(EstadoAcademico estadoAcademico)
        {
            try
            {
                var _estadoAcademico = await _ctx.EstadoAcademico.FirstOrDefaultAsync(e => e.EstadoAcademicoId == estadoAcademico.EstadoAcademicoId);
                if (_estadoAcademico != null)
                {
                    _estadoAcademico.Descripcion = estadoAcademico.Descripcion;
                    _estadoAcademico.DescripcionCorta = estadoAcademico.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(EstadoAcademico estadoAcademico)
        {
            try
            {
                var _estadoAcademico = await _ctx.EstadoAcademico.FirstOrDefaultAsync(e => e.EstadoAcademicoId == estadoAcademico.EstadoAcademicoId);
                if (_estadoAcademico != null)
                {
                    _estadoAcademico.Estado = estadoAcademico.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Elimina un registro del catalogo de EstadoAcademico. 
        /// Catalogo de EstadoAcademico CH
        /// </summary>
        /// <param name="estadoAcademicoId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(int estadoAcademicoId)
        {
            try
            {
                var _estadoAcademico = await _ctx.EstadoAcademico.FirstOrDefaultAsync(e => e.EstadoAcademicoId == estadoAcademicoId);
                if (_estadoAcademico != null)
                {
                    _ctx.EstadoAcademico.Remove(_estadoAcademico);
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
