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
    public class AreaSNIRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        //inicializar el contexto
        SIGCOCHContext _ctx;
        public AreaSNIRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        //Obtener todas las areas
        public async Task<IEnumerable<AreaSNI>> GetAll()
        {
            try
            {
                var areas = await _ctx.AreaSNi.Where(e=>e.estado==1).AsNoTracking()
                    .OrderBy(x=>x.descripcion)
                    .ToListAsync();
                return areas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AreaSNI>> GetAllAdmin()
        {
            try
            {
                var areas = await _ctx.AreaSNi.AsNoTracking()
                    .OrderBy(x => x.descripcion)
                    .ToListAsync();
                return areas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener un ambito por id
        public async Task<AreaSNI> GetById(int areaId)
        {
            try
            {
                var area = await _ctx.AreaSNi.Where(e => e.AreaSNIId == areaId).AsNoTracking().FirstOrDefaultAsync();
                return area;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar area
        public async Task Update(AreaSNI area)
        {
            try
            {
                var _area = await _ctx.AreaSNi.FirstOrDefaultAsync(e => e.AreaSNIId == area.AreaSNIId);
                if (_area != null)
                {
                    _area.descripcion = area.descripcion;
                    _area.descripcionCorta = area.descripcionCorta;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar area
        public async Task UpdateEstado(AreaSNI area)
        {
            try
            {
                var _area = await _ctx.AreaSNi.FirstOrDefaultAsync(e => e.AreaSNIId == area.AreaSNIId);
                if (_area != null)
                {
                    _area.estado = area.estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear area
        public async Task Create(AreaSNI area)
        {
            try
            {
                _ctx.AreaSNi.Add(area);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
