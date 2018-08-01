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
    public class AutorIIEPublicacionRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AutorIIEPublicacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AutorIIEPublicacion>> GetByPublicacion(int id)
        {
            try
            {
                var result = await _ctx.AutorIIEPublicacion.Where(e => e.PublicacionId.Equals(id))
                                        .Include(e=>e.Publicacion)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorIIEPublicacion>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.AutorIIEPublicacion.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorIIEPublicacion> Create(AutorIIEPublicacion Obj)
        {
            try
            {
                var result = _ctx.AutorIIEPublicacion.Add(Obj);
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
                var result = await _ctx.AutorIIEPublicacion.FirstOrDefaultAsync(e => e.AutorIIEPublicacionId == id);
                if (result != null)
                {
                    _ctx.AutorIIEPublicacion.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        
        public async Task UpdateAll(List<AutorIIEPublicacion> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AutorIIEPublicacionId > 0)
                    {
                        if (model.ClavePersona.Equals("eliminar"))
                        {
                            await this.Delete(model.AutorIIEPublicacionId);
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
