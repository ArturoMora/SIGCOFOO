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
    public class AutorPublicacionExtRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AutorPublicacionExtRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AutorPublicacionExt>> GetByPublicacion(int id)
        {
            try
            {
                var result = await _ctx.AutorPublicacionExt.Where(e => e.PublicacionId.Equals(id))
                                        .Include(e => e.Publicacion)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorPublicacionExt> Create(AutorPublicacionExt Obj)
        {
            try
            {
                var result = _ctx.AutorPublicacionExt.Add(Obj);
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
                var result = await _ctx.AutorPublicacionExt.FirstOrDefaultAsync(e => e.AutorPublicacionExtId == id);
                if (result != null)
                {
                    _ctx.AutorPublicacionExt.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateAll(List<AutorPublicacionExt> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AutorPublicacionExtId > 0)
                    {
                        if (model.Nombre.Equals("eliminar"))
                        {
                            await this.Delete(model.AutorPublicacionExtId);
                        }
                    }

                    else
                    {
                        model.Publicacion = null;
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
