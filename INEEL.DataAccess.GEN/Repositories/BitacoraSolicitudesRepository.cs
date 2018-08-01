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

        public class BitacoraSolicitudesRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        GEN_Context _ctx;

        public BitacoraSolicitudesRepository()
        {
            _ctx = new GEN_Context();
        }

        public async Task<IEnumerable<BitacoraSolicitudes>> GetById(int id)
        {
            try
            {
                var result = await _ctx.BitacoraSolicitudes.Where(e => e.SolicitudId == id)
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
        public async Task<BitacoraSolicitudes> GetLastBySolicitudId(int SolicitudId)
        {
            try
            {
                var result = await _ctx.BitacoraSolicitudes.Where(e => e.SolicitudId == SolicitudId)
                                                .Include(e => e.EstadoFlujo)
                                                 .OrderByDescending(e => e.FechaMovimiento)
                                                .AsNoTracking()
                                                .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<BitacoraSolicitudes> Create(BitacoraSolicitudes Obj)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Obj.FechaMovimiento = hoy;
                var result = _ctx.BitacoraSolicitudes.Add(Obj);
                await _ctx.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Solicitudes aceptadas por X rol
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<IEnumerable<BitacoraSolicitudes>> GetByRol(int id)
        {
            try
            {
                var result = await _ctx.BitacoraSolicitudes.Where(e => e.idRol == id)
                                                .Where(e=>e.EstadoFlujoId==3 ||e.EstadoFlujoId == 13)
                                                .Include(e => e.EstadoFlujo)
                                                .OrderBy(e => e.SolicitudId)
                                                .Distinct()
                                                .AsNoTracking()
                                                .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Get solicitudes rechazadas por rol
        /// </summary>
        /// <param name="id">rol del usuario</param>
        /// <returns></returns>
        public async Task<IEnumerable<BitacoraSolicitudes>> GetByRolRechazadas(int id)
        {
            try
            {
                var result = await _ctx.BitacoraSolicitudes.Where(e => e.idRol == id && (e.EstadoFlujoId == 2 || e.EstadoFlujoId == 12)
                                                            && e.Descripcion.Contains("Rechazado:") )
                                                            .Include(e => e.EstadoFlujo)
                                                            .OrderBy(e => e.SolicitudId)
                                                            .Distinct()
                                                            .AsNoTracking()
                                                            .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<BitacoraSolicitudes>> GetByRolRechazadasGerente(int id)
        {
            try
            {
                var result = await _ctx.BitacoraSolicitudes.Where(e => e.idRol == id)
                                                .Where(e => e.EstadoFlujoId == 8 ||e.EstadoFlujoId == 12)
                                                .Where(e => e.Descripcion.Contains("Rechazado:"))
                                                .Include(e => e.EstadoFlujo)
                                                .OrderBy(e => e.SolicitudId)
                                                .Distinct()
                                                .AsNoTracking()
                                                .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BitacoraSolicitudes>> GetByRolGerente(int id)
        {
            try
            {
                var result = await _ctx.BitacoraSolicitudes.Where(e => e.idRol == id)
                                                .Where(e => e.EstadoFlujoId == 8|| e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                                                .Where(e=>e.Descripcion.Contains("Aprobado:"))
                                                .Include(e => e.EstadoFlujo)
                                                .OrderBy(e => e.SolicitudId)
                                                .Distinct()
                                                .AsNoTracking()
                                                .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> validarRechazoAdmin(Solicitud solicitudResult)
        {
            var bitaresult = await _ctx.BitacoraSolicitudes.Where(e => e.SolicitudId == solicitudResult.SolicitudId)
                .Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 12).Where(e => e.idRol == 1).Where(e => e.Descripcion.Contains("Rechazado: "))
                .AsNoTracking().FirstOrDefaultAsync();
            if (bitaresult != null)
            {
                return 1;
            }else
            {
                return 0;
            }
        }
    }
}
