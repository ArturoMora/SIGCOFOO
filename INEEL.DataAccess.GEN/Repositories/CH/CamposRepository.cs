using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    /// <summary>
    /// Clase CamposRepository, repositorio para el catalogo de Campos, Modulo CH
    /// </summary>
    public class CamposRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase CamposRepository
        /// </summary>
        public CamposRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de los campos registrados en la base de datos.
        /// Catalogo de campos CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Campo>> GetAll()
        {
            try
            {
                var employees = await _ctx.Campo.Where(e=>e.Estado==1).AsNoTracking().OrderBy(x=>x.Descripcion).ToListAsync();
                return employees;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Campo>> GetAllAdmin()
        {
            try
            {
                var employees = await _ctx.Campo.AsNoTracking().OrderBy(x => x.Descripcion).ToListAsync();
                return employees;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene un campo en especifico, el filtro es el id del campo requerido. 
        ///  Catalogo de campos CH
        /// </summary>
        /// <param name="campoId"> Id del campo requerido</param>
        /// <returns></returns>
        public async Task<Campo> GetById(int campoId)
        {
            try
            {
                var employee = await _ctx.Campo.AsNoTracking().FirstOrDefaultAsync(e => e.CampoId == campoId);
                return employee;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo campo al catalogo de campos. 
        /// Catalogo de campos CH
        /// </summary>
        /// <param name="campo">Objeto tipo Campo</param>
        /// <returns></returns>
        public async Task Create(Campo campo)
        {
            try
            {
                _ctx.Campo.Add(campo);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto campo. 
        /// Catalogo de campos CH
        /// </summary>
        /// <param name="campo"></param>
        /// <returns></returns>
        public async Task Update(Campo campo)
        {
            try
            {
                var _campo = await _ctx.Campo.FirstOrDefaultAsync(e => e.CampoId == campo.CampoId);
                if (_campo != null)
                {
                    _campo.Descripcion = campo.Descripcion;
                    _campo.DescripcionCorta = campo.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar estado
        public async Task UpdateEstado(Campo campo)
        {
            try
            {
                var _campo = await _ctx.Campo.FirstOrDefaultAsync(e => e.CampoId == campo.CampoId);
                if (_campo != null)
                {
                    _campo.Estado = campo.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Elimina un registro del catalogo de campos. 
        /// Catalogo de campos CH
        /// </summary>
        /// <param name="campoId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(int campoId)
        {
            try
            {
                var _campo = await _ctx.Campo.FirstOrDefaultAsync(e => e.CampoId == campoId);
                if (_campo != null)
                {
                    _ctx.Campo.Remove(_campo);
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
