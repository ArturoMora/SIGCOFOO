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
    public class NivelPublicacionRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public NivelPublicacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos los niveles de publicacion
        public async Task<IEnumerable<NivelPublicacion>> GetAll()
        {
            try
            {
                var NivelPublicacion = await _ctx.NivelPublicacion.Where(e=>e.Estado==1).AsNoTracking().ToListAsync();
                return NivelPublicacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<NivelPublicacion>> GetAllAdmin()
        {
            try
            {
                var NivelPublicacion = await _ctx.NivelPublicacion.AsNoTracking().ToListAsync();
                return NivelPublicacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener nivel de publicacion por Id
        public async Task<NivelPublicacion> GetById(int NivelPublicacionId)
        {
            try
            {
                var NivelPublicacion = await _ctx.NivelPublicacion.Where(e => e.NivelPublicacionId == NivelPublicacionId).AsNoTracking().FirstOrDefaultAsync();
                return NivelPublicacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear nivel de publicacion
        public async Task Create(NivelPublicacion NivelPublicacion)
        {
            try
            {
                _ctx.NivelPublicacion.Add(NivelPublicacion);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar nivel de publicacion
        public async Task Update(NivelPublicacion NivelPublicacion)
        {
            try
            {
                var _NivelPublicacion = await _ctx.NivelPublicacion.FirstOrDefaultAsync(e => e.NivelPublicacionId == NivelPublicacion.NivelPublicacionId);
                if (_NivelPublicacion != null)
                {
                    _NivelPublicacion.Descripcion = NivelPublicacion.Descripcion;
                    _NivelPublicacion.DescripcionCorta = NivelPublicacion.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar nivel de publicacion
        public async Task UpdateEstado(NivelPublicacion NivelPublicacion)
        {
            try
            {
                var _NivelPublicacion = await _ctx.NivelPublicacion.FirstOrDefaultAsync(e => e.NivelPublicacionId == NivelPublicacion.NivelPublicacionId);
                if (_NivelPublicacion != null)
                {
                    _NivelPublicacion.Estado = NivelPublicacion.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar Nivel Publicacion
        public async Task Delete(int NivelPublicacionId)
        {
            try
            {
                var _NivelPublicacion = await _ctx.NivelPublicacion.FirstOrDefaultAsync(e => e.NivelPublicacionId == NivelPublicacionId);
                if (_NivelPublicacion != null)
                {
                    _ctx.NivelPublicacion.Remove(_NivelPublicacion);
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
