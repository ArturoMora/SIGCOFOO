using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using System.Linq.Dynamic;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class CapacitacionycertificadoRepository : IDisposable
    {
        SIGCOCHContext _ctx;

        public CapacitacionycertificadoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<CapacitacionYcertificacion> GetById(int id)
        {
            try
            {
                var result = await _ctx.dbSetCapacitacionYcertificacion.Where(e => e.CapacitacionYcertificacionId == id)
                    .Include(x=>x.Adjunto)
                    .Include(x=>x.EstadoFlujo)
                                                .AsNoTracking()
                                                .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(CapacitacionYcertificacion obj)
        {
            try
            {
                _ctx.dbSetCapacitacionYcertificacion.Add(obj);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(CapacitacionYcertificacion obj)
        {
            try
            {
                var _obj = await _ctx.dbSetCapacitacionYcertificacion.FirstOrDefaultAsync(e => e.CapacitacionYcertificacionId == obj.CapacitacionYcertificacionId);
                if (_obj != null)
                {

                    _ctx.Entry(_obj).CurrentValues.SetValues(obj);

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateSolicitud(CapacitacionYcertificacion idioma)
        {
            try
            {
                var _idioma = await _ctx.Idiomas.FirstOrDefaultAsync(e => e.IdiomasId == idioma.IdiomasId);
                if (_idioma != null)
                {

                    _idioma.FechaValidacion = idioma.FechaValidacion;
                    _idioma.EstadoFlujoId = idioma.EstadoFlujoId;
                    _idioma.IdiomaId = idioma.IdiomaId;
                    _idioma.PorcentajeGradoDominio = idioma.PorcentajeGradoDominio;
                    _idioma.PorcentajeConversacion = idioma.PorcentajeConversacion;
                    _idioma.PorcentajeEscritura = idioma.PorcentajeEscritura;
                    _idioma.PorcentajeLectura = idioma.PorcentajeLectura;
                    _idioma.FechaAcreditacion = idioma.FechaAcreditacion;
                    _idioma.Puntuacion = idioma.Puntuacion;
                    _idioma.CertificacionId = idioma.CertificacionId;

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
