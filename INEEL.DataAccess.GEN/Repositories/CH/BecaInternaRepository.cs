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
    public class BecaInternaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;

        public BecaInternaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todas las becas
        public async Task<IEnumerable<BecaInterna>> GetAll()
        {
            try
            {
                var BecasInternas = await _ctx.BecaInterna.Where(e=>e.Estado==1).AsNoTracking()
                    .OrderBy(x=>x.Descripcion)
                    .ToListAsync();
                return BecasInternas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BecaInterna>> GetAllAdmin()
        {
            try
            {
                var BecasInternas = await _ctx.BecaInterna.AsNoTracking()
                    .OrderBy(x => x.Descripcion)
                    .ToListAsync();
                return BecasInternas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener beca interna por Id
        public async Task<BecaInterna> GetById(int becaInternaId)
        {
            try
            {
                var BecasInternas = await _ctx.BecaInterna.Where(e => e.BecaInternaId == becaInternaId).AsNoTracking().FirstOrDefaultAsync();
                return BecasInternas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear Beca interna
        public async Task Create(BecaInterna BecaInterna)
        {
            try
            {
                _ctx.BecaInterna.Add(BecaInterna);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Beca interna
        public async Task Update(BecaInterna BecaInterna)
        {
            try
            {
                var _BecaInterna = await _ctx.BecaInterna.FirstOrDefaultAsync(e => e.BecaInternaId == BecaInterna.BecaInternaId);
                if (_BecaInterna != null)
                {
                    _BecaInterna.Descripcion = BecaInterna.Descripcion;
                    _BecaInterna.DescripcionCorta = BecaInterna.DescripcionCorta;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar Beca interna
        public async Task UpdateEstado(BecaInterna BecaInterna)
        {
            try
            {
                var _BecaInterna = await _ctx.BecaInterna.FirstOrDefaultAsync(e => e.BecaInternaId == BecaInterna.BecaInternaId);
                if (_BecaInterna != null)
                {
                    _BecaInterna.Estado = BecaInterna.Estado;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar Beca interna
        public async Task Delete(int BecaInternaId)
        {
            try
            {
                var _BecaInterna = await _ctx.BecaInterna.FirstOrDefaultAsync(e => e.BecaInternaId == BecaInternaId);
                if (_BecaInterna != null)
                {
                    _ctx.BecaInterna.Remove(_BecaInterna);
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
