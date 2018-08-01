using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.GEN.Repositories
{

        public class BitacoraSolicitudesAccesoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        GEN_Context _ctx;

        public BitacoraSolicitudesAccesoRepository()
        {
            _ctx = new GEN_Context();
        }
        //public async Task<IEnumerable<BitacoraSolicitudesAcceso>> GetByIds(int id)
        //{
        //    try
        //    {
              
        //        var Solicitud = await _ctx.dbSetBitacoraSolicitudesAcceso.Where(e => e.EstadoFlujoId == id)
        //                            .Where(e => e.InformacionId == id2)
        //                            .Include(e => e.TipoInformacion)
        //                            .Include(e => e.EstadoFlujo)
        //                            .AsNoTracking()
        //                            .ToListAsync();
        //        return Solicitud;
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}
        public async Task<IEnumerable<BitacoraSolicitudesAcceso>> GetBySolicitudAccesoId(int id)
        {
            try
            {
                var result = await _ctx.dbSetBitacoraSolicitudesAcceso.Where(e => e.SolicitudAccesoId == id)
                                                .Include(e => e.EstadoFlujo)
                                                .AsNoTracking()
                                                .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //public async Task<BitacoraSolicitudesAcceso> GetLastBySolicitudAccesoId(int SolicitudAccesoId)
        //{
        //    try
        //    {
        //        var result = await _ctx.dbSetBitacoraSolicitudesAcceso.Where(e => e.SolicitudAccesoId == SolicitudAccesoId)
        //                                        .Include(e => e.EstadoFlujo)
        //                                         .OrderByDescending(e => e.FechaMovimiento)
        //                                        .AsNoTracking()
        //                                        .FirstOrDefaultAsync();
        //        return result;
        //    }
        //    catch (Exception e)
        //    {
        //        throw new Exception(e.Message, e);
        //    }
        //}

        public async Task<BitacoraSolicitudesAcceso> Create(BitacoraSolicitudesAcceso Obj)
        {
            try
            {


                var result = _ctx.dbSetBitacoraSolicitudesAcceso.Add(Obj);
                await _ctx.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        
    }
}
