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
    public class SolicitudCPRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public SolicitudCPRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todo
        public async Task<IEnumerable<SolicitudCP>> GetAll()
        {
            try
            {
                var Solicitud = await _ctx.SolicitudCP.Where(e => e.EstadoFlujoId == 2)
                                                    .Include(e => e.TipoInformacion)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar estado
        public async Task UpdateEstado(SolicitudCP Solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.SolicitudCP.FirstOrDefaultAsync(e => e.SolicitudCPId == Solicitud.SolicitudCPId);
                if (_Solicitud != null)
                {
                    _Solicitud.EstadoFlujoId = Solicitud.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //Crear
        public async Task Create(SolicitudCP Solicitud)
        {
            try
            {
                _ctx.SolicitudCP.Add(Solicitud);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<SolicitudCP> UpdateCreate(SolicitudCP Solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.SolicitudCP.FirstOrDefaultAsync(e => e.TipoInformacionId == Solicitud.TipoInformacionId && e.ClavePersona == Solicitud.ClavePersona && e.InformacionId == Solicitud.InformacionId);
                if (_Solicitud != null)
                {
                    _Solicitud.TipoInformacionId = Solicitud.TipoInformacionId;
                    _Solicitud.InformacionId = Solicitud.InformacionId;
                    _Solicitud.FechaSolicitud = Solicitud.FechaSolicitud;
                    _Solicitud.EstadoFlujoId = Solicitud.EstadoFlujoId;
                    _Solicitud.ClavePersona = Solicitud.ClavePersona;
                    await _ctx.SaveChangesAsync();
                    return (_Solicitud);
                }
                else
                {
                    try
                    {
                        _ctx.SolicitudCP.Add(Solicitud);
                        await _ctx.SaveChangesAsync();
                        return (_Solicitud);

                    }
                    catch (Exception e)
                    {
                        throw new Exception(e.Message, e);
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
