using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class AutoresEstudioMercadoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        CR_Context _ctx;
        public AutoresEstudioMercadoRepository()
        {
            _ctx = new CR_Context();
        }

        public async Task Create(List<AutoresEstudioMercado> Lista)
        {
            try
            {
                foreach (var item in Lista)
                {
                    _ctx.AutoresEstudioMercado.Add(item);
                    await _ctx.SaveChangesAsync();
                }
               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task CreateUser(AutoresEstudioMercado obj)
        {
            try
            {
                    _ctx.AutoresEstudioMercado.Add(obj);
                    await _ctx.SaveChangesAsync();
                

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutoresEstudioMercado>> GetById(int id)
        {
            try
            {
                var result = await _ctx.AutoresEstudioMercado.Where(e => e.EstudiosMercadoId == id)
                    .AsNoTracking().ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteAutor(int id)
        {
            try
            {
                var result = await _ctx.AutoresEstudioMercado.FirstOrDefaultAsync(e => e.AutoresEstudioMercadoId == id);
                if (result != null)
                {
                    _ctx.AutoresEstudioMercado.Remove(result);
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
