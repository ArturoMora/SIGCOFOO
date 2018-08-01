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
    public class EstadoPublicacionRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public EstadoPublicacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos los estados de publicacion
        public async Task<IEnumerable<EstadoPublicacion>> GetAll()
        {
            try
            {
                var EP = await _ctx.EstadoPublicacion.Where(e=>e.Estado==1).AsNoTracking().ToListAsync();
                return EP;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<EstadoPublicacion>> GetAllAdmin()
        {
            try
            {
                var EP = await _ctx.EstadoPublicacion.AsNoTracking().ToListAsync();
                return EP;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener Estado Publicacion por Id
        public async Task<EstadoPublicacion> GetById(int EstadoPublicacionId)
        {
            try
            {
                var EP = await _ctx.EstadoPublicacion.Where(e => e.EstadoPublicacionId== EstadoPublicacionId).AsNoTracking().FirstOrDefaultAsync();
                return EP;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear Estado de Publicacion
        public async Task Create(EstadoPublicacion EstadoPublicacion)
        {
            try
            {
                _ctx.EstadoPublicacion.Add(EstadoPublicacion);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Estado de Publicacion
        public async Task Update(EstadoPublicacion EstadoPublicacion)
        {
            try
            {
                var _EP = await _ctx.EstadoPublicacion.FirstOrDefaultAsync(e => e.EstadoPublicacionId == EstadoPublicacion.EstadoPublicacionId);
                if (_EP != null)
                {
                    _EP.Descripcion = EstadoPublicacion.Descripcion;
                    _EP.DescripcionCorta = EstadoPublicacion.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Estado de Publicacion
        public async Task UpdateEstado(EstadoPublicacion EstadoPublicacion)
        {
            try
            {
                var _EP = await _ctx.EstadoPublicacion.FirstOrDefaultAsync(e => e.EstadoPublicacionId == EstadoPublicacion.EstadoPublicacionId);
                if (_EP != null)
                {
                    _EP.Estado = EstadoPublicacion.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar Estado de Publicacion
        public async Task Delete(int EstadoPublicacionId)
        {
            try
            {
                var _EP = await _ctx.EstadoPublicacion.FirstOrDefaultAsync(e => e.EstadoPublicacionId == EstadoPublicacionId);
                if (_EP != null)
                {
                    _ctx.EstadoPublicacion.Remove(_EP);
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
