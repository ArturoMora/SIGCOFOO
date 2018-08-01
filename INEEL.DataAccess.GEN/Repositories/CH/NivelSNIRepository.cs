using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;


namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class NivelSNIRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        //inicializar el contexto
        SIGCOCHContext _ctx;
        public NivelSNIRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //GET
        public async Task<IEnumerable<NivelSNI>> GetAll()
        {
            try
            {
                var niveles = await _ctx.NivelSNI.Where(e=>e.Estado=="1").AsNoTracking().ToListAsync();
                return niveles;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }
        public async Task<IEnumerable<NivelSNI>> GetAllAdmin()
        {
            try
            {
                var niveles = await _ctx.NivelSNI.AsNoTracking().ToListAsync();
                return niveles;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        //Obtener nivel curso por Id
        public async Task<NivelSNI> GetById(int NivelSNIId)
        {
            try
            {
                var _NivelCursoId = await _ctx.NivelSNI.Where(e=>e.NivelSNIId == NivelSNIId).AsNoTracking().FirstOrDefaultAsync();
                return _NivelCursoId;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear  nivel curso
        public async Task Create(NivelSNI NivelSNI)
        {
            try
            {
                _ctx.NivelSNI.Add(NivelSNI);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar nivel curso
        public async Task Update(NivelSNI NivelSNI)
        {
            try
            {
                var _NivelSNI = await _ctx.NivelSNI.FirstOrDefaultAsync(e => e.NivelSNIId == NivelSNI.NivelSNIId);
                if (_NivelSNI != null)
                {
                    _NivelSNI.descripcion = NivelSNI.descripcion;
                    _NivelSNI.descripcionCorta = NivelSNI.descripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar nivel curso
        public async Task UpdateEstado(NivelSNI NivelSNI)
        {
            try
            {
                var _NivelSNI = await _ctx.NivelSNI.FirstOrDefaultAsync(e => e.NivelSNIId == NivelSNI.NivelSNIId);
                if (_NivelSNI != null)
                {
                    _NivelSNI.Estado = NivelSNI.Estado;

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
