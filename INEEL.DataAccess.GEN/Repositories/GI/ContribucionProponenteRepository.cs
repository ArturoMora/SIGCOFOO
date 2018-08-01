using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ContribucionProponenteRepository
    {
        GI_Context _ctx;

        public ContribucionProponenteRepository()
        {
            _ctx = new GI_Context();
        }

        public async Task<IEnumerable<ContribucionProponente>> GetAll()
        {
            try
            {
                var Obj = await _ctx.DbSetContribucionProponente.AsNoTracking()
                                                        .ToListAsync();
                return Obj;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
