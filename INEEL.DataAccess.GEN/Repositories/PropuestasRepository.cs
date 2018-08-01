using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{

    /// <summary>
    /// Clase PropuestasRepository, repositorio para el catalogo de Propuestass.
    /// </summary>
    public class PropuestasRepository : IDisposable
    {
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        GEN_Context _ctx;

        /// <summary>
        /// Contrucctor de la clase PropuestasRepository
        /// </summary>
        public PropuestasRepository()
        {
            _ctx = new GEN_Context();
        }

        /// <summary>
        /// Obtiene la lista de los Propuestass registrados en la base de datos.
        /// Catalogo de Propuestass CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Propuestas>> GetAll()
        {
            try
            {
                var propuestas = await _ctx.dbSetPropuesta.AsNoTracking().ToListAsync();
                return propuestas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene la lista de los Propuestass registrados en la base de datos con el numJefe especifico.
        /// Catalogo de Propuestass CH
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Propuestas>> GetByNumJefe(string numJefe)
        {
            try
            {
                var Propuestas = await _ctx.dbSetPropuesta.Where(e => e.ClaveEmpPropuesta == numJefe).Select(x => x).AsNoTracking().ToListAsync();                    
                return Propuestas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtiene un Propuestas en especifico, el filtro es el id del Propuestas requerido. 
        ///  Catalogo de Propuestass CH
        /// </summary>
        /// <param name="PropuestasId"> Id del Propuestas requerido</param>
        /// <returns>Propuestas</returns>
        public async Task<Propuestas> GetById(string PropuestasId)
        {
            try
            {
                var Propuestas = await _ctx.dbSetPropuesta.AsNoTracking().FirstOrDefaultAsync(e => e.PropuestaId == PropuestasId);
                return Propuestas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Agrega un objeto tipo Propuestas al catalogo de Propuestass. 
        /// Catalogo de Propuestass CH
        /// </summary>
        /// <param name="Propuestas">Objeto tipo Propuestas</param>
        /// <returns></returns>
        public async Task Create(Propuestas Propuestas)
        {
            try
            {
                _ctx.dbSetPropuesta.Add(Propuestas);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Elimina un registro del catalogo de Propuestass. 
        /// Catalogo de poyectos CH
        /// </summary>
        /// <param name="PropuestasId">filtro par eliminar el registro</param>
        /// <returns></returns>
        public async Task Delete(string PropuestasId)
        {
            try
            {
                var _Propuestas = await _ctx.dbSetPropuesta.FirstOrDefaultAsync(e => e.PropuestaId == PropuestasId);
                if (_Propuestas != null)
                {
                    _ctx.dbSetPropuesta.Remove(_Propuestas);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Propuestas>> GetPropuestas(String id, String nombrePropuesta)
        {
            try
            {
                if (!String.IsNullOrEmpty(id))
                {
                    id = id.ToLower();
                    var entities = await _ctx.dbSetPropuesta.AsNoTracking()
                    .Where(x => x.PropuestaId.ToLower() == id)
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombrePropuesta))
                {
                    nombrePropuesta = nombrePropuesta.ToLower();
                    var entities = await _ctx.dbSetPropuesta.AsNoTracking()
                    .Where(x => x.Titulo.ToLower().Contains(nombrePropuesta))
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Propuestas>> GetPropuestas(String like)
        {
            try
            {
                if (!String.IsNullOrEmpty(like))
                {                    
                    var entities = await _ctx.dbSetPropuesta
                    .Where(x => x.PropuestaId.ToLower().Contains(like)  || x.Titulo.ToLower().Contains(like))
                    .OrderBy(x=>x.PropuestaId)
                    .Skip(0).Take(20)
                    .AsNoTracking()
                    .ToListAsync();
                    return entities;
                }                
                else return null;

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
