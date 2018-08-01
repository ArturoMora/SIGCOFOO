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
    public class AutorIIEPonenciaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AutorIIEPonenciaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AutorIIEPonencia>> GetByPonencia(int id)
        {
            try
            {
                var result = await _ctx.AutorIIEPonencia.Where(e => e.PonenciaId.Equals(id))
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

        public async Task<IEnumerable<AutorIIEPonencia>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.AutorIIEPonencia.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorIIEPonencia> Create(AutorIIEPonencia Obj)
        {
            try
            {
                var result = _ctx.AutorIIEPonencia.Add(Obj);
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
                var result = await _ctx.AutorIIEPonencia.FirstOrDefaultAsync(e => e.AutorIIEPonenciaId == id);
                if (result != null)
                {
                    _ctx.AutorIIEPonencia.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateAll(List<AutorIIEPonencia> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AutorIIEPonenciaId > 0)
                    {
                        if (model.NombreCompleto.Equals("eliminar"))
                        {
                            await this.Delete(model.AutorIIEPonenciaId);
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
