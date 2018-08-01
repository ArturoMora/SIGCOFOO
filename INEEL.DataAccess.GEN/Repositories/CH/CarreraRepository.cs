using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CarreraRepository : IDisposable
    {

        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase DisciplinasRepository
        /// </summary>
        public CarreraRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de las carreras registradas en la base de datos.
        /// Catalogo de carreras CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Carrera>> GetAll()
        {
            try
            {
                var carreras = await _ctx.Carrera.Where(e=>e.Estado==1).Include(e=>e.Disciplina).AsNoTracking().OrderBy(x=>x.Descripcion).ToListAsync();
                return carreras;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Carrera>> GetAllAdmin()
        {
            try
            {
                var carreras = await _ctx.Carrera.Include(e => e.Disciplina).AsNoTracking().OrderBy(x => x.Descripcion).ToListAsync();
                return carreras;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene una carrera en especifico, el filtro es el id de la carrera. 
        ///  Catalogo de carreras CH
        /// </summary>
        /// <param name="carraraId"> Id de la carrera requerida</param>
        /// <returns></returns>
        public async Task<Carrera> GetById(int carreraId)
        {
            try
            {
                var carrera = await _ctx.Carrera.AsNoTracking().FirstOrDefaultAsync(e => e.CarreraId == carreraId);
                return carrera;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo carrera al catalogo de carreras. 
        /// Catalogo de carreras CH
        /// </summary>
        /// <param name="carrera">Objeto tipo carrera</param>
        /// <returns></returns>
        public async Task Create(Carrera carrera)
        {
            try
            {
                _ctx.Carrera.Add(carrera);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza la información del objeto carrera. 
        /// Catalogo de carreras CH
        /// </summary>
        /// <param name="carrera"></param>
        /// <returns></returns>
        public async Task Update(Carrera carrera)
        {
            try
            {
                var _carrera = await _ctx.Carrera.FirstOrDefaultAsync(e => e.CarreraId == carrera.CarreraId);
                if (_carrera != null)
                {
                    _carrera.Descripcion = carrera.Descripcion;
                    _carrera.DescripcionCorta = carrera.DescripcionCorta;
                    _carrera.DisciplinaId = carrera.DisciplinaId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Carrera carrera)
        {
            try
            {
                var _carrera = await _ctx.Carrera.FirstOrDefaultAsync(e => e.CarreraId == carrera.CarreraId);
                if (_carrera != null)
                {
                    _carrera.Estado = carrera.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Elimina un registro del catalogo de carreras. 
        /// Catalogo de carreras CH
        /// </summary>
        /// <param name="carreraId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(int carreraId)
        {
            try
            {
                var _carrera = await _ctx.Carrera.FirstOrDefaultAsync(e => e.CarreraId == carreraId);
                if (_carrera != null)
                {
                    _ctx.Carrera.Remove(_carrera);
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
