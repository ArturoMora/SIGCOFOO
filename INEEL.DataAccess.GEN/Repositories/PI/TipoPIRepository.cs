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
    public class TipoPIRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public TipoPIRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<TipoPI>> GetAll()
        {
            try
            {
                var result = await _ctx.TipoPI.AsNoTracking().OrderBy(x=>x.Descripcion).ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
