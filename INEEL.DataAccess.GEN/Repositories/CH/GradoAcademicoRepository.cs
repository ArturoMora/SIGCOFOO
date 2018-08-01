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
    public class GradoAcademicoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase GradoAcademicoRepository
        /// </summary>
        public GradoAcademicoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de los  grados Academicos registrados en la base de datos.
        /// Catalogo de grados de Academicos  CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<GradoAcademico>> GetAll()
        {
            try
            {
                var GradoAcademico = await _ctx.GradoAcademico.Where(e=>e.Estado==1).AsNoTracking().OrderBy(x=>x.Secuencia).ToListAsync();
                return GradoAcademico;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<GradoAcademico>> GetAllTesis()
        {
            try
            {
                var GradoAcademico = await _ctx.GradoAcademico.Where(e => e.Estado == 1 && (e.GradoAcademicoId==1 || e.GradoAcademicoId == 2 || e.GradoAcademicoId == 3)).AsNoTracking().OrderBy(x => x.GradoAcademicoId).ToListAsync();
                return GradoAcademico;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<GradoAcademico>> GetAllAdmin()
        {
            try
            {
                var GradoAcademico = await _ctx.GradoAcademico.AsNoTracking().OrderBy(x => x.Secuencia).ToListAsync();
                return GradoAcademico;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene un Academico en especifico, el filtro es el id del campo requerido. 
        ///  Catalogo de GradoAcademico CH
        /// </summary>
        /// <param name="GradoAcademicoId"> Id del campo requerido</param>
        /// <returns></returns>
        public async Task<GradoAcademico> GetById(int GradoAcademicoId)
        {
            try
            {
                var GradoAcademico = await _ctx.GradoAcademico.AsNoTracking().FirstOrDefaultAsync(e => e.GradoAcademicoId == GradoAcademicoId);
                return GradoAcademico;
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
        /// <param name="GradoAcademico">Objeto tipo GradoAcademico</param>
        /// <returns></returns>
        public async Task Create(GradoAcademico GradoAcademico)
        {
            try
            {
                _ctx.GradoAcademico.Add(GradoAcademico);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto GradoAcademico. 
        /// Catalogo de GradoAcademico CH
        /// </summary>
        /// <param name="GradoAcademico"></param>
        /// <returns></returns>
        public async Task Update(GradoAcademico GradoAcademico)
        {
            try
            {
                var _GradoAcademico = await _ctx.GradoAcademico.FirstOrDefaultAsync(e => e.GradoAcademicoId == GradoAcademico.GradoAcademicoId);
                if (_GradoAcademico != null)
                {
                    _GradoAcademico.Descripcion = GradoAcademico.Descripcion;
                    _GradoAcademico.DescripcionCorta = GradoAcademico.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(GradoAcademico GradoAcademico)
        {
            try
            {
                var _GradoAcademico = await _ctx.GradoAcademico.FirstOrDefaultAsync(e => e.GradoAcademicoId == GradoAcademico.GradoAcademicoId);
                if (_GradoAcademico != null)
                {
                    _GradoAcademico.Estado = GradoAcademico.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Elimina un registro del catalogo de GradoAcademico. 
        /// Catalogo de GradoAcademico CH
        /// </summary>
        /// <param name="GradoAcademicoId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(int GradoAcademicoId)
        {
            try
            {
                var _GradoAcademico = await _ctx.GradoAcademico.FirstOrDefaultAsync(e => e.GradoAcademicoId == GradoAcademicoId);
                if (_GradoAcademico != null)
                {
                    _ctx.GradoAcademico.Remove(_GradoAcademico);
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
