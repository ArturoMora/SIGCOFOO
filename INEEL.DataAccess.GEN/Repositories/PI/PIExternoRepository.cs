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
    public class PIExternoRepository : IDisposable
    {
        PI_Context _ctx;
        public void Dispose()
        {
            _ctx.Dispose();
        }
        public PIExternoRepository()
        {
            _ctx = new PI_Context();
        }

        public async Task<IEnumerable<PIExterno>> GetForCV(string id)
        {
            try
            {
                var result = await _ctx.PIExterno.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoPI)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PIExterno>> GetByClave(string clave)
        {
            try
            {
                var result = await _ctx.PIExterno.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e=>e.TipoPI)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PIExterno>> GetByEstado()
        {
            try
            {
                var result = await _ctx.PIExterno.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.TipoPI)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PIExterno>> GetByIdColaboracion(IEnumerable<AutoresIndustrialInt> colaboracion)
        {
            List<PIExterno> PIExterno = new List<PIExterno>();
            foreach (var x in colaboracion)
            {
                var local = await _ctx.PIExterno.Where(e => e.PIExternoId == x.PIExternoId)
                                        .Where(e => e.EstadoFlujoId == 3)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.TipoPI)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                PIExterno.Add(local);

            }
            return PIExterno;
        }

        public async Task<PIExterno> GetById(int id)
        {
            try
            {
                var result = await _ctx.PIExterno.Where(e => e.PIExternoId == id)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.TipoPI)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PIExterno> Create(PIExterno Obj)
        {
            try
            {
                var result = _ctx.PIExterno.Add(Obj);
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
                var result = await _ctx.PIExterno.FirstOrDefaultAsync(e => e.PIExternoId == id);
                if (result != null)
                {
                    _ctx.PIExterno.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PIExterno Obj)// UpdateSolicitud
        {
            try
            {
                var result = await _ctx.PIExterno.FirstOrDefaultAsync(e => e.PIExternoId == Obj.PIExternoId);

                if (Obj.EstadoFlujoId == 1 && result.EstadoFlujoId == 3)
                {
                    await new NuevoOCRepository().DeleteId("PI", result.PIExternoId + "");
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

        public async Task UpdateEstado(PIExterno Obj)
        {
            try
            {
                var result = await _ctx.PIExterno.FirstOrDefaultAsync(e => e.PIExternoId == Obj.PIExternoId);
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
