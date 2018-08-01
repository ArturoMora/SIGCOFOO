using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class EdadPromedioHistoricoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        GEN_Context _ctx;
        public EdadPromedioHistoricoRepository()
        {
            _ctx = new GEN_Context();
        }

        public async Task<IEnumerable<EdadPromedioHistorico>> GetAll()
        {
            try
            {
                var result = await _ctx.EdadPromedioHistorico.AsNoTracking().ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
