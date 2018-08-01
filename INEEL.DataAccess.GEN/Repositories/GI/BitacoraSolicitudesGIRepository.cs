using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class BitacoraSolicitudesGIRepository : IDisposable
    {
        public void Dispose() { _ctx.Dispose(); }
        GI_Context _ctx;

        public BitacoraSolicitudesGIRepository()
        {
            _ctx = new GI_Context();
        }

        public async Task<IEnumerable<BitacoraSolicitudesGI>> GetById(int id)
        {
            try
            {
                var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.SolicitudId == id)
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

        public async Task<IEnumerable<BitacoraSolicitudesGI>> GetByIdAprobadoAntes(int id)
        {
            try
            {
                var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.SolicitudId == id)
                    .Where(e=>e.Descripcion.Equals("Aprobada la propuesta"))
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
        public async Task<BitacoraSolicitudesGI> GetLastBySolicitudId(int SolicitudId)
        {
            try
            {
                var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.SolicitudId == SolicitudId)
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

        public async Task<BitacoraSolicitudesGI> Create(BitacoraSolicitudesGI Obj)
        {
            try
            {
                DateTime hoy = DateTime.Now;
                Obj.FechaMovimiento = hoy;
                var result = _ctx.DbSetBitacoraSolicitudesGI.Add(Obj);
                await _ctx.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<Object> GetJustificacionSolicitud(BitacoraSolicitudesGI model)
        {
            try
            {
                var entitie = await _ctx.DbSetBitacoraSolicitudesGI
                            .Where(e => e.Descripcion.Contains(model.estadoOC) && e.Descripcion.Contains(model.nombreOC) && e.EstadoFlujoId == model.EstadoFlujoId && e.SolicitudId ==
                                        (_ctx.DbSetSolicitudGI
                                            .Where(x => x.InformacionId == model.informacionId && x.TipoInformacionId == model.tipoInformacionOC)
                                            .Select(x => x.SolicitudId)
                                            .FirstOrDefault())
                             )
                            .OrderByDescending(e => e.FechaMovimiento).FirstOrDefaultAsync();
                return entitie;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /**Pendientes por verificar su eliminacion**/
        public async Task<IEnumerable<BitacoraSolicitudesGI>> GetByRol(int id)
        {
            try
            {
                throw new Exception("CORREGIR CONSULTA");
                
                //var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.IdRol == id)
                //                                .Where(e => e.EstadoFlujoId == 3 || e.EstadoFlujoId == 13)
                //                                .Include(e => e.EstadoFlujo)
                //                                .OrderBy(e => e.SolicitudId)
                //                                .Distinct()
                //                                .AsNoTracking()
                //                                .ToListAsync();
                //return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<BitacoraSolicitudesGI>> GetByRolRechazadas(int id)
        {
            try
            {
                throw new Exception("CORREGIR CONSULTA");
                //var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.IdRol == id &&
                //                                (e.EstadoFlujoId == 2 || e.EstadoFlujoId == 12) &&
                //                                e.Descripcion.Contains("Rechazado"))
                //                                .Include(e => e.EstadoFlujo)
                //                                .OrderBy(e => e.SolicitudId)
                //                                .Distinct()
                //                                .AsNoTracking()
                //                                .ToListAsync();
                //return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BitacoraSolicitudesGI>> GetByRolRechazadasGerente(int id)
        {
            try
            {
                throw new Exception("CORREGIR CONSULTA");
                //var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.IdRol == id)
                //                                .Where(e => e.EstadoFlujoId == 8 || e.EstadoFlujoId == 12)
                //                                .Where(e => e.Descripcion.Contains("Rechazado:"))
                //                                .Include(e => e.EstadoFlujo)
                //                                .OrderBy(e => e.SolicitudId)
                //                                .Distinct()
                //                                .AsNoTracking()
                //                                .ToListAsync();
                //return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<BitacoraSolicitudesGI>> GetByRolGerente(int id)
        {
            try
            {
                throw new Exception("CORREGIR CONSULTA");
                //var result = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.IdRol == id)
                //                                .Where(e => e.EstadoFlujoId == 8 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12 || e.EstadoFlujoId == 13)
                //                                .Where(e => e.Descripcion.Contains("Aprobado:"))
                //                                .Include(e => e.EstadoFlujo)
                //                                .OrderBy(e => e.SolicitudId)
                //                                .Distinct()
                //                                .AsNoTracking()
                //                                .ToListAsync();
                //return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> validarRechazoAdmin(SolicitudGI solicitudResult)
        {
            throw new Exception("CORREGIR CONSULTA");
            //var bitaresult = await _ctx.DbSetBitacoraSolicitudesGI.Where(e => e.SolicitudId == solicitudResult.SolicitudId)
            //    .Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 12).Where(e => e.IdRol == 1).Where(e => e.Descripcion.Contains("Rechazado: "))
            //    .AsNoTracking().FirstOrDefaultAsync();
            //if (bitaresult != null)
            //{
            //    return 1;
            //}
            //else
            //{
            //    return 0;
            //}
        }
    }
}
