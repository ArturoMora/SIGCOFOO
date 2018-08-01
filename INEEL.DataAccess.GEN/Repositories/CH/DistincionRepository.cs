using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class DistincionRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public DistincionRepository()
        {
            _ctx = new SIGCOCHContext();
        }
        public DistincionRepository(SIGCOCHContext context)
        {
            _ctx = context;
        }


        public async Task<IEnumerable<Distincion>> GetForCV(string id)
        {
            try
            {
                var distincion = await _ctx.Distincion.Where(e => e.ClavePersona.Equals(id))
                                                        .Where(e=>e.EstadoFlujoId==3)
                                                            .Include(e => e.EstadoFlujo)
                                                            .Include(e => e.Adjunto)
                                                            .AsNoTracking()
                                                            .ToListAsync();
                return distincion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener por clave
        public async Task<IEnumerable<Distincion>> GetByClaveEmpleado(string clave)
        {
            try
            {
                var distincion = await _ctx.Distincion.Where(e=>e.ClavePersona.Equals(clave))
                                                            .Include(e => e.EstadoFlujo)
                                                            .Include(e => e.Adjunto)
                                                            .AsNoTracking()
                                                            .ToListAsync();
                foreach (var item in distincion)
                {
                    if (item.EstadoFlujoId == 2)
                    {
                        item.EstadoFlujo.Descripcion += " Admin CH";
                    }
                }
                return distincion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Distincion>> GetByEstado()
        {
            try
            {
                var dis = await _ctx.Distincion.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return dis;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Crear distincion
        public async Task Create(Distincion dis)
        {
            try
            {
                _ctx.Distincion.Add(dis);
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
                var _distincion = await _ctx.Distincion.FirstOrDefaultAsync(e => e.DistincionId == id);
                if (_distincion != null)
                {
                    _ctx.Distincion.Remove(_distincion);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Distincion> getById(int id)
        {
            try
            {
                var distincion = await _ctx.Distincion
                    .Include(e => e.Adjunto).AsNoTracking().FirstOrDefaultAsync(e => e.DistincionId == id);
                return distincion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task Update(Distincion dis)
        {
            try
            {
                var _dis = await _ctx.Distincion.FirstOrDefaultAsync(e => e.DistincionId == dis.DistincionId);
                if (_dis != null)
                {
                    if (dis.Adjunto != null)
                    {
                        //Eliminar archivo
                        if (dis.Adjunto.nombre == "eliminar")
                        {
                            int id = Convert.ToInt32(dis.Adjunto.AdjuntoId);
                            _dis.AdjuntoId = null;
                            await _ctx.SaveChangesAsync();
                            
                            await new AdjuntoRepository().Delete(id);
                        }
                        ///Agregar archivo al editar
                        if (dis.Adjunto.AdjuntoId == 0)
                        {
                            if (_dis.AdjuntoId != null)
                            {
                                var id = _dis.AdjuntoId;
                                _dis.AdjuntoId = null;
                                await _ctx.SaveChangesAsync();

                                await new AdjuntoRepository().Delete(id);
                            }
                            var key = await new AdjuntoRepository().CreateAd(dis.Adjunto);
                            dis.AdjuntoId = key.AdjuntoId;
                            dis.Adjunto.AdjuntoId = key.AdjuntoId;
                        }
                    }
                    _ctx.Entry(_dis).CurrentValues.SetValues(dis);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateSolicitud(Distincion dis)
        {
            try
            {
                var _dis = await _ctx.Distincion.FirstOrDefaultAsync(e => e.DistincionId == dis.DistincionId);
                if (_dis != null)
                {
                    _dis.EstadoFlujoId = dis.EstadoFlujoId;
                    _dis.FechaValidacion = dis.FechaValidacion;
                    _dis.Reconocimiento = dis.Reconocimiento;
                    _dis.Aprobado = dis.Aprobado;
                    _dis.FechaDistincion = dis.FechaDistincion;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Distincion Distincion)
        {
            try
            {
                var _sni = await _ctx.Distincion.FirstOrDefaultAsync(e => e.DistincionId == Distincion.DistincionId);
                if (_sni != null)
                {
                    _sni.EstadoFlujoId = Distincion.EstadoFlujoId;

                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Valida que no existan registros de distinciones
        /// </summary>
        /// <param name="model"><Distincion>model</param>
        /// <returns>Boolean</returns>
        public async Task<Boolean> ValidarDuplicados(Distincion model)
        {
            try
            {
                var registros = await _ctx.Distincion.Where(e => e.ClavePersona == model.ClavePersona 
                         && DbFunctions.TruncateTime(e.FechaDistincion) == DbFunctions.TruncateTime(model.FechaDistincion)
                         && e.DistincionId!= model.DistincionId).AsNoTracking().CountAsync();
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
