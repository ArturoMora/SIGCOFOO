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
    public class NivelCursoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public NivelCursoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos nivel curso
        public async Task<IEnumerable<NivelCurso>> GetAll()
        {
            try
            {
                var NivelCurso = await _ctx.NivelCurso.Where(e=>e.Estado==1).AsNoTracking().ToListAsync();
                return NivelCurso;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<NivelCurso>> GetAllAdmin()
        {
            try
            {
                var NivelCurso = await _ctx.NivelCurso.AsNoTracking().ToListAsync();
                return NivelCurso;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener nivel curso por Id
        public async Task<NivelCurso> GetById(int NivelCursoId)
        {
            try
            {
                var _NivelCursoId = await _ctx.NivelCurso.Where(e => e.NivelCursoId == NivelCursoId).AsNoTracking().FirstOrDefaultAsync();
                return _NivelCursoId;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear  nivel curso
        public async Task Create(NivelCurso NivelCurso)
        {
            try
            {
                _ctx.NivelCurso.Add(NivelCurso);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar nivel curso
        public async Task Update(NivelCurso NivelCurso)
        {
            try
            {
                var _NivelCurso = await _ctx.NivelCurso.FirstOrDefaultAsync(e => e.NivelCursoId == NivelCurso.NivelCursoId);
                if (_NivelCurso != null)
                {
                    _NivelCurso.Descripcion = NivelCurso.Descripcion;
                    _NivelCurso.DescripcionCorta = NivelCurso.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar nivel curso
        public async Task UpdateEstado(NivelCurso NivelCurso)
        {
            try
            {
                var _NivelCurso = await _ctx.NivelCurso.FirstOrDefaultAsync(e => e.NivelCursoId == NivelCurso.NivelCursoId);
                if (_NivelCurso != null)
                {
                    _NivelCurso.Estado = NivelCurso.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar nivel curso
        public async Task Delete(int NivelCursoId)
        {
            try
            {
                var _NivelCurso = await _ctx.NivelCurso.FirstOrDefaultAsync(e => e.NivelCursoId == NivelCursoId);
                if (_NivelCurso != null)
                {
                    _ctx.NivelCurso.Remove(_NivelCurso);
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
