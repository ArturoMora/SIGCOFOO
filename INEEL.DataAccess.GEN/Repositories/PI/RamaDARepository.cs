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
    public class RamaDARepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public RamaDARepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<RamaDA>> GetAll()
        {
            try
            {
                var Asociacion = await _ctx.RamaDA.AsNoTracking().ToListAsync();
                return Asociacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
