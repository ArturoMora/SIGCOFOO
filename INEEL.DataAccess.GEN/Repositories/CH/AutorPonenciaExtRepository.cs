using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AutorPonenciaExtRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AutorPonenciaExtRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AutorPonenciaExt>> GetByPonencia(int id)
        {
            try
            {
                var result = await _ctx.AutorPonenciaExt.Where(e => e.PonenciaId.Equals(id))
                                        .Include(e => e.Ponencia)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorPonenciaExt> Create(AutorPonenciaExt Obj)
        {
            try
            {
                var result = _ctx.AutorPonenciaExt.Add(Obj);
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
                var result = await _ctx.AutorPonenciaExt.FirstOrDefaultAsync(e => e.AutorPonenciaExtId == id);
                if (result != null)
                {
                    _ctx.AutorPonenciaExt.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateAll(List<AutorPonenciaExt> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AutorPonenciaExtId > 0)
                    {
                        if (model.Nombre.Equals("eliminar"))
                        {
                            await this.Delete(model.AutorPonenciaExtId);
                        }
                    }

                    else
                    {
                        model.Ponencia = null;
                        await this.Create(model);
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
