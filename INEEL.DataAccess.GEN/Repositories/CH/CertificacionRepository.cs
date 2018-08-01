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
    public class CertificacionRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        /// <summary>
        /// contexto para la conexión de CH. 
        /// </summary>
        SIGCOCHContext _ctx;

        /// <summary>
        /// Contrucctor de la clase CertificacionRepository
        /// </summary>
        public CertificacionRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        /// <summary>
        /// Obtiene la lista de todos los registros de la tabla tab_Certificacion
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Certificacion>> GetAll()
        {
            try
            {
                var Certificacion = await _ctx.Certificacion.Where(e=>e.Estado==1).AsNoTracking().OrderBy(x=>x.Descripcion).ToListAsync();
                return Certificacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Certificacion>> GetAllCertificacion(int id)
        {
            try
            {

                List<Certificacion> Cert = new List<Certificacion>();

                Cert = await _ctx.Certificacion.Where(e => e.Estado == 1 && e.IdiomaId==id).AsNoTracking().ToListAsync();

                Certificacion AuxiliarDatosTecnicas  = await _ctx.Certificacion.Where(e => e.Estado == 1 && e.IdiomaId == 13).AsNoTracking().FirstOrDefaultAsync();

                Cert.Add(AuxiliarDatosTecnicas);
                return Cert;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Certificacion>> GetAllAdmin()
        {
            try
            {
                var Certificacion = await _ctx.Certificacion.AsNoTracking().OrderBy(x => x.Descripcion).ToListAsync();
                return Certificacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene un elemento del catalogo Certificacion 
        /// </summary>
        /// <param name="Id">identificador del elemento a obtener</param>
        /// <returns></returns>
        public async Task<Certificacion> GetById(int Id)
        {
            try
            {
                var Certificacion = await _ctx.Certificacion
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync(p => p.CertificacionId == Id);
                return Certificacion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Crea un nuevo registro de Certificacion
        /// </summary>
        /// <param name="Certificacion">objeto tipo Certificacion</param>
        /// <returns></returns>
        public async Task Create(Certificacion Certificacion)
        {
            try
            {
                _ctx.Certificacion.Add(Certificacion);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Actualiza un registro de la tabla de Certificacion
        /// </summary>
        /// <param name="Certificacion">objeto de tipo Certificacion con los nuevos datos</param>
        /// <returns></returns>
        public async Task Update(Certificacion Certificacion)
        {
            try
            {
                var _Certificacion = await _ctx.Certificacion
                                           .FirstOrDefaultAsync(e => e.CertificacionId == Certificacion.CertificacionId);
                if (_Certificacion != null)
                {

                    _ctx.Entry(_Certificacion).CurrentValues.SetValues(Certificacion);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateEstado(Certificacion Certificacion)
        {
            try
            {
                var _Certificacion = await _ctx.Certificacion
                                           .FirstOrDefaultAsync(e => e.CertificacionId == Certificacion.CertificacionId);
                if (_Certificacion != null)
                {

                    _Certificacion.Estado = Certificacion.Estado;
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Elimina un registro de la tabla de Certificacion 
        /// </summary>
        /// <param name="Certificacionid">Id del registro a eliminar</param>
        /// <returns></returns>
        public async Task Delete(int Certificacionid)
        {
            try
            {
                var _Certificacion = await _ctx.Certificacion
                                            .FirstOrDefaultAsync(e => e.CertificacionId == Certificacionid);
                if (_Certificacion != null)
                {
                    _ctx.Certificacion.Remove(_Certificacion);
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
