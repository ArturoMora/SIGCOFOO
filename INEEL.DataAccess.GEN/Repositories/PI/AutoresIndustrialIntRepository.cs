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
    public class AutoresIndustrialIntRepository : IDisposable { public void Dispose(){_ctx.Dispose();}

        PI_Context _ctx;
        public AutoresIndustrialIntRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<AutoresIndustrialInt>> GetByPIExterno(int id)
        {
            try
            {
                var result = await _ctx.AutoresIndustrialInt.Where(e => e.PIExternoId.Equals(id))
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

        public async Task<IEnumerable<AutoresIndustrialInt>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.AutoresIndustrialInt.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutoresIndustrialInt> Create(AutoresIndustrialInt Obj)
        {
            try
            {
                var result = _ctx.AutoresIndustrialInt.Add(Obj);
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
                var result = await _ctx.AutoresIndustrialInt.FirstOrDefaultAsync(e => e.AutoresIndustrialIntId == id);
                if (result != null)
                {
                    _ctx.AutoresIndustrialInt.Remove(result);
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
