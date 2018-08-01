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
    public class TipoBecaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public TipoBecaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todos las becas
        public async Task<IEnumerable<TipoBeca>> GetAll()
        {
            try
            {
                var TipoBeca = await _ctx.TipoBeca.Where(e=>e.Estado==1).OrderBy(x=>x.Secuencia).AsNoTracking().ToListAsync();
                return TipoBeca;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<TipoBeca>> GetAllAdmin()
        {
            try
            {
                var TipoBeca = await _ctx.TipoBeca.AsNoTracking().OrderBy(x => x.Secuencia).ToListAsync();
                return TipoBeca;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener TipoBeca por Id
        public async Task<TipoBeca> GetById(int TipoBecaId)
        {
            try
            {
                var TipoBeca = await _ctx.TipoBeca.Where(e => e.TipoBecaId == TipoBecaId).OrderBy(x => x.Descripcion).AsNoTracking().FirstOrDefaultAsync();
                return TipoBeca;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear TipoBeca
        public async Task Create(TipoBeca TipoBeca)
        {
            try
            {
                _ctx.TipoBeca.Add(TipoBeca);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar TipoBeca
        public async Task Update(TipoBeca TipoBeca)
        {
            try
            {
                var _TipoBeca = await _ctx.TipoBeca.FirstOrDefaultAsync(e => e.TipoBecaId == TipoBeca.TipoBecaId);
                if (_TipoBeca != null)
                {
                    _TipoBeca.Descripcion = TipoBeca.Descripcion;
                    _TipoBeca.DescripcionCorta = TipoBeca.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Actualizar TipoBeca
        public async Task UpdateEstado(TipoBeca TipoBeca)
        {
            try
            {
                var _TipoBeca = await _ctx.TipoBeca.FirstOrDefaultAsync(e => e.TipoBecaId == TipoBeca.TipoBecaId);
                if (_TipoBeca != null)
                {
                    _TipoBeca.Estado = TipoBeca.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar TipoBeca
        public async Task Delete(int TipoBecaId)
        {
            try
            {
                var _TipoBeca = await _ctx.TipoBeca.FirstOrDefaultAsync(e => e.TipoBecaId == TipoBecaId);
                if (_TipoBeca != null)
                {
                    _ctx.TipoBeca.Remove(_TipoBeca);
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
