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
    public class AutoresIntPIPatrimonioRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        PI_Context _ctx;
        public AutoresIntPIPatrimonioRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<AutoresIntPIPatrimonio>> GetByColaboracionRequisicion(string clave)
        {
            try
            {
                var result = await _ctx.AutoresIntPIPatrimonio.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.RequisicionesPI)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutoresIntPIPatrimonio>> GetByColaboracion(int id)
        {
            try
            {
                var result = await _ctx.AutoresIntPIPatrimonio.Where(e => e.RequisicionesPIId.Equals(id))
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
