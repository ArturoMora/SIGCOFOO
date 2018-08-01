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
    public class AutoresIndustrialExtRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public AutoresIndustrialExtRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<AutoresIndustrialExt>> GetByPIExterno(int id)
        {
            try
            {
                var result = await _ctx.AutoresIndustrialExt.Where(e => e.PIExternoId.Equals(id))
                                        .Include(e => e.PIExterno)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutoresIndustrialExt> Create(AutoresIndustrialExt Obj)
        {
            try
            {
                var result = _ctx.AutoresIndustrialExt.Add(Obj);
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
                var result = await _ctx.AutoresIndustrialExt.FirstOrDefaultAsync(e => e.AutoresIndustrialExtId == id);
                if (result != null)
                {
                    _ctx.AutoresIndustrialExt.Remove(result);
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
