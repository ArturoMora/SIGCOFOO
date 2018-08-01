using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AdjuntoCursosRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AdjuntoCursosRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AdjuntoCursos>> GetById(int clave)
        {
            try
            {
                var result = await _ctx.AdjuntoCursos.Where(e => e.CursoInternoId.Equals(clave))
                                        .Include(e => e.Modulo)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AdjuntoCursos> Create(AdjuntoCursos Obj)
        {
            try
            {
                if (Obj.nombre.Length>100)
                {
                    Obj.nombre = Obj.nombre.Substring(0,100);
                }
                var result = _ctx.AdjuntoCursos.Add(Obj);
                await _ctx.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AdjuntoCursos> GetAsync(long id)
        {

            try
            {
                var entities = await _ctx.AdjuntoCursos
                    .FirstOrDefaultAsync(e => e.AdjuntoCursosId == id);
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public AdjuntoCursos Get(long id)
        {

            try
            {
                var entities = _ctx.AdjuntoCursos
                    .FirstOrDefault(e => e.AdjuntoCursosId == id);
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(List<AdjuntoCursos> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AdjuntoCursosId > 0)
                    {
                        if (model.nombre.Equals("eliminar"))
                        {
                            await this.Delete(Convert.ToInt32(model.AdjuntoCursosId));
                        }
                    }

                    else
                    {
                        model.Modulo = null;
                        await this.Create(model);
                    }
                }

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
                var result = await _ctx.AdjuntoCursos.FirstOrDefaultAsync(e => e.AdjuntoCursosId == id);
                if (result != null)
                {
                    _ctx.AdjuntoCursos.Remove(result);
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
