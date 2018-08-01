using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.MT.Models;
using INEEL.DataAccess.GEN.Contexts;

namespace INEEL.DataAccess.GEN.Repositories.MT
{
    public class AutorExternoCapituloRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        private MT_Context _ctx;
        public AutorExternoCapituloRepository()
        {
            _ctx = new MT_Context();
        }

        public async Task<IEnumerable<AutorExternoCapitulo>> GetByCapitulos(int id)
        {
            try
            {
                var result = await _ctx.dbSetAutorExternoCapitulo.Where(e => e.CapitulosId.Equals(id))
                                        .Include(e => e.Capitulos)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorExternoCapitulo> Create(AutorExternoCapitulo Obj)
        {
            try
            {
                var result = _ctx.dbSetAutorExternoCapitulo.Add(Obj);
                await _ctx.SaveChangesAsync();

                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var result = await _ctx.dbSetAutorExternoCapitulo.FirstOrDefaultAsync(e => e.AutorExternoCapituloId == id);
                if (result != null)
                {
                    _ctx.dbSetAutorExternoCapitulo.Remove(result);
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
