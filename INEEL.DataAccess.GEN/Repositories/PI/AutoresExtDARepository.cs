using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.PI.Models;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class AutoresExtDARepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public AutoresExtDARepository()
        {
            _ctx = new PI_Context();
        }
        public async Task<IEnumerable<AutoresExtDA>> GetByDAExterno(int id)
        {
            try
            {
                var result = await _ctx.AutoresExtDA.Where(e => e.DAExternoId.Equals(id))
                                        .Include(e => e.DAExterno)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutoresExtDA> Create(AutoresExtDA Obj)
        {
            try
            {
                var result = _ctx.AutoresExtDA.Add(Obj);
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
                var result = await _ctx.AutoresExtDA.FirstOrDefaultAsync(e => e.AutoresExtDAId == id);
                if (result != null)
                {
                    _ctx.AutoresExtDA.Remove(result);
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
