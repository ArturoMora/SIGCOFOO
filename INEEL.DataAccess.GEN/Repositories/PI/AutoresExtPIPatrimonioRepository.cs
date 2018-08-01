using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.PI;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class AutoresExtPIPatrimonioRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public AutoresExtPIPatrimonioRepository()
        {
            _ctx = new PI_Context();
        }
        public async Task<IEnumerable<AutoresExtPIPatrimonio>> GetByColaboracion(int id)
        {
            try
            {
                var result = await _ctx.AutoresExtPIPatrimonio.Where(e => e.RequisicionesPIId.Equals(id))
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
