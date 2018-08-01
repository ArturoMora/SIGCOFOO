using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class SNIRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public SNIRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public SNIRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }

        public async Task<IEnumerable<SNI>> GetForCV(string id)
        {
            try
            {
                var sni = await _ctx.SNI.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.NivelSNI)
                                        .Include(e => e.AreaSNI)
                                        .AsNoTracking()
                                        .ToListAsync();
                return sni;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<SNI>> GetByClaveEmpEstadoFlujo(string clave, DateTime yearsBack, List<int> estados)
        {
            try
            {
                var sni = await _ctx.SNI.Where(e => e.ClavePersona.Equals(clave) && estados.Contains(e.EstadoFlujoId) )
                //&& DbFunctions.TruncateTime(e.fechaInicioNombramiento) > DbFunctions.TruncateTime(yearsBack))
                                        //.Include(e => e.Adjunto)
                                        //.Include(e => e.EstadoFlujo)
                                        .Include(e => e.NivelSNI)
                                        .Include(e => e.AreaSNI)                                        
                                        .OrderByDescending(e=>e.fechaInicioNombramiento)
                                        .AsNoTracking()
                                        .ToListAsync();
                return sni;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        ///// Obtener un SNI GET()
        public async Task<IEnumerable<SNI>> GetByClave(string clave)
        {
            try
            {
                var sni = await _ctx.SNI.Where(e=>e.ClavePersona.Equals(clave))
                                        .Include(e=>e.Adjunto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.NivelSNI)
                                        .Include(e => e.AreaSNI)
                                        .AsNoTracking()
                                        .ToListAsync();

                foreach (var item in sni)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return sni;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<SNI>> GetByEstado()
        {
            try
            {
                var SNI = await _ctx.SNI.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return SNI;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(SNI sni)
        {
            try
            {
                _ctx.SNI.Add(sni);
                await _ctx.SaveChangesAsync();
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
                var _sni = await _ctx.SNI.FirstOrDefaultAsync(e => e.SNIId == id);
                if (_sni != null)
                {
                    _ctx.SNI.Remove(_sni);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SNI> GetById(int id)
        {
            try
            {
                var sni = await _ctx.SNI.Where(e => e.SNIId == id)
                                        .Include(e => e.Adjunto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.NivelSNI)
                                        .Include(e => e.AreaSNI)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return sni;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task Update(SNI sni)
        {
            try
            {
                var _sni = await _ctx.SNI.FirstOrDefaultAsync(e => e.SNIId == sni.SNIId);
                if (_sni != null)
                {
                    if (sni.Adjunto != null)
                    {
                        //Eliminar archivo
                        if (sni.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(sni.Adjunto.AdjuntoId);
                            _sni.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();

                            await new  AdjuntoRepository().Delete(id);
                        }
                        ///Agregar archivo al editar
                        if (sni.Adjunto.AdjuntoId == 0)
                        {
                            if (_sni.AdjuntoId!=null)
                            {
                                var id = _sni.AdjuntoId;
                                _sni.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();

                                await new AdjuntoRepository().Delete(id);
                            }
                            Adjunto key = await new AdjuntoRepository().CreateAd(sni.Adjunto);
                            sni.AdjuntoId = key.AdjuntoId;
                            sni.Adjunto.AdjuntoId = key.AdjuntoId;
                            
                        }
                    }
                    _ctx.Entry(_sni).CurrentValues.SetValues(sni);

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateSolicitud(SNI sni)
        {
            try
            {
                var _sni = await _ctx.SNI.FirstOrDefaultAsync(e => e.SNIId == sni.SNIId);
                if (_sni != null)
                {
                    _sni.fechaValidacion = sni.fechaValidacion;
                    _sni.EstadoFlujoId = sni.EstadoFlujoId;
                    _sni.fechaIngreso = sni.fechaIngreso;
                    _sni.numeroCVU = sni.numeroCVU;
                    _sni.fechaInicioNombramiento = sni.fechaInicioNombramiento;
                    _sni.fechaTerminoNombramiento = sni.fechaTerminoNombramiento;
                    _sni.NivelSNIId = sni.NivelSNIId;
                    _sni.AreaSNIId = sni.AreaSNIId;
                    _sni.numeroExpediente = sni.numeroExpediente;

                    await _ctx.SaveChangesAsync();



                    PersonasRepository prep = new PersonasRepository();
                    Personas p = await prep.GetByClave(sni.ClavePersona);
                    p.ultimaActualizacion = DateTime.Now;
                    await prep.Update(p);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(SNI sni)
        {
            try
            {
                var _sni = await _ctx.SNI.FirstOrDefaultAsync(e => e.SNIId == sni.SNIId);
                if (_sni != null)
                {
                    _sni.EstadoFlujoId = sni.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de SNI
        /// </summary>
        /// <param name="model"><SNI>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(SNI model)
        {
            try
            {
                // var data= await GetDALikeTituloNuevo(model.TituloPublicacion);
                var registros = await _ctx.SNI.Where(e => e.ClavePersona == model.ClavePersona
                         && e.NivelSNIId == model.NivelSNIId 
                         && DbFunctions.TruncateTime(e.fechaInicioNombramiento) == DbFunctions.TruncateTime(model.fechaInicioNombramiento)
                         && DbFunctions.TruncateTime(e.fechaTerminoNombramiento) == DbFunctions.TruncateTime(model.fechaTerminoNombramiento)
                         && e.SNIId!= model.SNIId).AsNoTracking().CountAsync();
                if (registros > 0)
                {
                    return true;
                }
                return false;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
