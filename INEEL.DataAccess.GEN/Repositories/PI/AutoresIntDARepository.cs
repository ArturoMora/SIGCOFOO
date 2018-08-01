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
   public class AutoresIntDARepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public AutoresIntDARepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<AutoresIntDA>> GetByDAExterno(int id)
        {
            try
            {
                var result = await _ctx.AutoresIntDA.Where(e => e.DAExternoId.Equals(id))
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

        public async Task<IEnumerable<AutoresIntDA>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.AutoresIntDA.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutoresIntDA> Create(AutoresIntDA Obj)
        {
            try
            {
                var result = _ctx.AutoresIntDA.Add(Obj);
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
                var result = await _ctx.AutoresIntDA.FirstOrDefaultAsync(e => e.AutoresIntDAId == id);
                if (result != null)
                {
                    _ctx.AutoresIntDA.Remove(result);
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
