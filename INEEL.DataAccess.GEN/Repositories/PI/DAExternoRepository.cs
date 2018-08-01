using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.PI.Models;
using INEEL.DataAccess.GEN.Contexts;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Repositories.PI
{
    public class DAExternoRepository: IDisposable
    {
        PI_Context _ctx;
        //private object Ponencia;
        public void Dispose()
        {
            _ctx.Dispose();
        }
        public DAExternoRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<DAExterno>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.DAExterno.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.RamaDA)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<DAExterno>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.DAExterno.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e=>e.RamaDA)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<DAExterno>> GetByEstado()
        {
            try
            {
                var result = await _ctx.DAExterno.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e=>e.RamaDA)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<DAExterno>> GetByIdColaboracion(IEnumerable<AutoresIntDA> colaboracionDAExterno)
        {
            List<DAExterno> DAExterno = new List<DAExterno>();
            foreach (var x in colaboracionDAExterno)
            {
                var local = await _ctx.DAExterno.Where(e => e.DAExternoId == x.DAExternoId)
                                        .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e=>e.Adjunto)
                                        .Include(e=>e.RamaDA)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                DAExterno.Add(local);

            }
            return DAExterno;
        }

        public async Task<DAExterno> GetById(int id)
        {
            try
            {
                var result = await _ctx.DAExterno.Where(e => e.DAExternoId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.RamaDA)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<DAExterno> Create(DAExterno Obj)
        {
            try
            {
                var result = _ctx.DAExterno.Add(Obj);
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
                var result = await _ctx.DAExterno.FirstOrDefaultAsync(e => e.DAExternoId == id);
                if (result != null)
                {
                    _ctx.DAExterno.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(DAExterno Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.DAExterno.FirstOrDefaultAsync(e => e.DAExternoId == Obj.DAExternoId);
                if (Obj.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("DA", result.DAExternoId + "");
                }
                if (result != null)
                {
                    _ctx.Entry(result).CurrentValues.SetValues(Obj);

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(DAExterno Obj)
        {
            try
            {
                var result = await _ctx.DAExterno.FirstOrDefaultAsync(e => e.DAExternoId == Obj.DAExternoId);
                if (result != null)
                {
                    result.EstadoFlujoId = Obj.EstadoFlujoId;

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
