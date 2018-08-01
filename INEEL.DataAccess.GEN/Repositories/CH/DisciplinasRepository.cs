using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class DisciplinasRepository : IDisposable 
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase DisciplinasRepository
        /// </summary>
        public DisciplinasRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de las disciplinas registradas en la base de datos.
        /// Catalogo de disciplinas CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Disciplina>> GetAll()
        {
            try
            {
                var disciplinas = await _ctx.Disciplina.Include(p => p.Campo).AsNoTracking().ToListAsync();
                return disciplinas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Disciplina>> GetAllAdmin()
        {
            try
            {
                var disciplinas = await _ctx.Disciplina.Where(e=>e.Estado==1).Include(p => p.Campo).AsNoTracking().ToListAsync();
                return disciplinas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene una disciplina en especifico, el filtro es el id de la disciplina. 
        ///  Catalogo de disciplinas CH
        /// </summary>
        /// <param name="disciplinaId"> Id de la disciplina requerida</param>
        /// <returns></returns>
        public async Task<Disciplina> GetById(int disciplinaId)
        {
            try
            {
                var disciplina = await _ctx.Disciplina.AsNoTracking().FirstOrDefaultAsync(e => e.DisciplinaId == disciplinaId);
                return disciplina;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo disciplina al catalogo de disciplinas. 
        /// Catalogo de disciplinas CH
        /// </summary>
        /// <param name="disciplina">Objeto tipo disciplina</param>
        /// <returns></returns>
        public async Task Create(Disciplina disciplina)
        {
            try
            {
                _ctx.Disciplina.Add(disciplina);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto disciplina. 
        /// Catalogo de disciplinas CH
        /// </summary>
        /// <param name="disciplina"></param>
        /// <returns></returns>
        public async Task UpdateDisciplina(Disciplina disciplina)
        {
            try
            {
                var _disciplina = await _ctx.Disciplina.FirstOrDefaultAsync(e => e.DisciplinaId == disciplina.DisciplinaId);
                if (_disciplina != null)
                {
                    _disciplina.Descripcion = disciplina.Descripcion;
                    _disciplina.DescripcionCorta = disciplina.DescripcionCorta;
                    _disciplina.CampoId = disciplina.CampoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Disciplina disciplina)
        {
            try
            {
                var _disciplina = await _ctx.Disciplina.FirstOrDefaultAsync(e => e.DisciplinaId == disciplina.DisciplinaId);
                if (_disciplina != null)
                {
                    _disciplina.Estado = disciplina.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Elimina un registro del catalogo de disciplinas. 
        /// Catalogo de disciplinas CH
        /// </summary>
        /// <param name="disciplinaId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task DeleteDisciplina(int disciplinaId)
        {
            try
            {
                var _disciplina = await _ctx.Disciplina.FirstOrDefaultAsync(e => e.DisciplinaId == disciplinaId);
                if (_disciplina != null)
                {
                    _ctx.Disciplina.Remove(_disciplina);
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
