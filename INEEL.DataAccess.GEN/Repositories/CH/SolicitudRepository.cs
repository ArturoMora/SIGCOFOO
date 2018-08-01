using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class SolicitudRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        GEN_Context _GEN;

        public SolicitudRepository()
        {
            _ctx = new SIGCOCHContext();
            _GEN = new GEN_Context();
            _ctx.Database.Log = Escribe.Write;
        }
        
            public async Task<Solicitud> GetSolicitudByAttrs(int estadoFlujoId, int tipoInformacionId, string informacionId)
        {
            try
            {
                
                var Solicitud = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == estadoFlujoId &&
                e.TipoInformacionId == tipoInformacionId && e.InformacionId.Equals(informacionId))                                                    
                                                    .OrderByDescending(e => e.FechaSolicitud)
                                                    .AsNoTracking()                                                    
                                                    .FirstOrDefaultAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Solicitud>> getAllsolicitudesITF()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud/*.Where(e => e.EstadoFlujoId == 2 )*/
                                                    .Where(e => e.TipoInformacionId ==21)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task<int> GetAllCount(String personaID)
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => (e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
                //&& (e.ClavePersonaAut == null || e.ClavePersonaAut.Equals(personaID))
                )
                                                    .Where(e => e.TipoInformacionId != 18)
                                                    .Where(e => e.TipoInformacionId != 21)
                                                    .AsNoTracking()
                                                    .CountAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener todo
        public async Task<IEnumerable<Solicitud>> GetAll()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
                                                    .Where(e => e.TipoInformacionId != 18)
                                                    .Where(e => e.TipoInformacionId != 21)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Solicitudes pendientes admin ch
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> GetPendientesAdministradorCH()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => (e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11) && (e.tipoPersonal_Id=="INV" || e.tipoPersonal_Id=="MAN"))
                                                    .Where(e => e.TipoInformacionId != 18)
                                                    .Where(e => e.TipoInformacionId != 21)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Solicitudes pendientes admin sindicalizados
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> GetPendientesAdministradorSindicalizados()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => (e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11) && (e.tipoPersonal_Id=="SIN" || e.tipoPersonal_Id=="ADM") )
                                                    .Where(e => e.TipoInformacionId != 18)
                                                    .Where(e => e.TipoInformacionId != 21)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Solicitud>> GetAllAceptadas()
        {
            try
            {
                var entities = await _ctx.Solicitud.AsNoTracking()
                    .Where(x => x.EstadoFlujoId == 3 || x.EstadoFlujoId == 13)
                    .Include(e => e.TipoInformacion)
                    .Include(e => e.EstadoFlujo)
                     .OrderByDescending(e => e.FechaSolicitud)
                    .ToListAsync();
                entities = entities.Distinct(new ComparerIdInformacionTipo()).ToList();
                return entities;


            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Solicitud>> GetAllRechazadas()
        {
            try
            {

                var Solicitud = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == 1 || e.EstadoFlujoId == 12)
                                               .Distinct()
                                               .OrderBy(e => e.TipoInformacionId).ThenBy(e => e.InformacionId).ThenBy(e => e.FechaSolicitud)
                                               .Include(e => e.TipoInformacion)
                                               .Include(e => e.EstadoFlujo)
                                               .AsNoTracking()
                                               .ToListAsync();
                return Solicitud;
                //return Solicitud;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /****NOTA****/
        /**Debido a que los metodos ya tienen tiempo y no se sabe con certeza si la modificiacion o eliminacion de alguno afectaria al sistema, estos se sobrecargan dependiendo de las necesidades*/

        /// <summary>
        /// Comparacion de solicitudes aceptadas por el administrador CH /sindicalizado y centro posgrado
        /// </summary>
        /// <param name="resultadosBitacoras">ICollection de solicitudes bitacora</param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> getbyId(IEnumerable<BitacoraSolicitudes> resultadosBitacoras)
        {

            var listaSolicitudes = resultadosBitacoras.Select(x => x.SolicitudId);
            var resultados = await _ctx.Solicitud.Where(e => listaSolicitudes.Contains(e.SolicitudId) && e.TipoInformacionId != 21)  //Que no sean itfs
                                          .Include(e => e.TipoInformacion)
                                          .Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
            return resultados;
        }

        /// <summary>
        /// @Override / Solicitudes aceptadas por un rol de administrador en especifico
        /// </summary>
        /// <param name="resultadosBitacoras">ICollection de solicitudes bitacora</param>
        /// <param name="rol">Rol por el que se desea filtrar las solicitudes</param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> getbyId(IEnumerable<BitacoraSolicitudes> resultadosBitacoras, string rol)
        {
            List<String> listaFunciones = new List<String>();
            if (rol != null && rol == "1026")
            {
                listaFunciones.Add("SIN");
                listaFunciones.Add("ADM");
            }
            if (rol != null && rol == "1")
            {
                listaFunciones.Add("INV");
                listaFunciones.Add("MAN");
            }
            var listaSolicitudes = resultadosBitacoras.Select(x => x.SolicitudId);
            var resultados = await _ctx.Solicitud.Where(e => listaSolicitudes.Contains(e.SolicitudId) && e.TipoInformacionId != 21 
                                                && e.TipoInformacionId!=18 && listaFunciones.Contains(e.tipoPersonal_Id) && e.EstadoFlujoId==3)  //Que no sean itfs
                                          .Include(e => e.TipoInformacion)
                                          .Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
            return resultados;
        }

        /// <summary>
        /// @Override / Solicitudes rechazadas por un rol de administrador en especifico y excluyendo un estado de flujo en especifico
        /// </summary>
        /// <param name="resultadosBitacoras">ICollection</param>
        /// <param name="rol">Rol del administrador en especifico</param>
        /// <param name="flujo">Flujo de las solicitudes, el cual no se desea que se incluya en las solicitudes</param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> getbyId(IEnumerable<BitacoraSolicitudes> resultadosBitacoras, string rol, int flujo)
        {
            List<String> listaFunciones = new List<String>();
            if (rol != null && rol == "1026")
            {
                listaFunciones.Add("SIN");
                listaFunciones.Add("ADM");
            }
            if (rol != null && rol == "1")
            {
                listaFunciones.Add("INV");
                listaFunciones.Add("MAN");
            }
            var listaSolicitudes = resultadosBitacoras.Select(x => x.SolicitudId);
            var resultados = await _ctx.Solicitud.Where(e => listaSolicitudes.Contains(e.SolicitudId)
                                            && e.TipoInformacionId != 21 && e.TipoInformacionId!=18             
                                            && listaFunciones.Contains(e.tipoPersonal_Id) && e.EstadoFlujoId!=flujo)  //Que no sean itfs ni solicitudes de posgrado
                                          .Include(e => e.TipoInformacion)
                                          .Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
            return resultados;
        }

        /// <summary>
        /// @Override / Solicitudes rechazadas por un estado flujo en especifico
        /// </summary>
        /// <param name="resultadosBitacoras"></param>
        /// <param name="flujo">Estado del flujo de las solicitudes por el cual filtrar</param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> getbyId(IEnumerable<BitacoraSolicitudes> resultadosBitacoras,  int flujo)
        {
            var listaSolicitudes = resultadosBitacoras.Select(x => x.SolicitudId);
            var resultados = await _ctx.Solicitud.Where(e => listaSolicitudes.Contains(e.SolicitudId) && e.TipoInformacionId != 21 && e.EstadoFlujoId!=flujo)  //Que no sean itfs
                                          .Include(e => e.TipoInformacion)
                                          .Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
            return resultados;
        }

        /// <summary>
        ///  Solicitudes aceptadas por el gerente de una division
        /// </summary>
        /// <param name="resultadosBitacoras"></param>
        /// <param name="claveUnidad"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> getbyIdUnidad(IEnumerable<BitacoraSolicitudes> resultadosBitacoras, string claveUnidad)
        {
            /**PROPUESTA**/
            var listaSolicitudes = resultadosBitacoras.Select(x => x.SolicitudId);
            var resultado = await _ctx.Solicitud.Where(e => listaSolicitudes.Contains(e.SolicitudId) && e.ClaveUnidadAut == claveUnidad
                                                && e.EstadoFlujoId == 3 && e.TipoInformacionId != 21)  //Aceptadas que no sean de MT
                                           .Include(e => e.TipoInformacion)
                                           .Include(e => e.EstadoFlujo).AsNoTracking().ToListAsync();
            return resultado;
        }

        /// <summary>
        /// Solicitudes rechazadas por unidad
        /// </summary>
        /// <param name="resultadosBitacoras"></param>
        /// <param name="claveUnidad"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> getRechazadasbyIdUnidad(IEnumerable<BitacoraSolicitudes> resultadosBitacoras, string claveUnidad)
        {
            List<Solicitud> Soli = new List<Solicitud>();
            foreach (var item in resultadosBitacoras)
            {
                var Sol = await _ctx.Solicitud.Where(e => e.SolicitudId == item.SolicitudId 
                                                        && e.ClaveUnidadAut == claveUnidad && e.EstadoFlujoId != 3 
                                                        && e.EstadoFlujoId!=8 && e.TipoInformacionId!=21)
                                               .Include(e => e.TipoInformacion)
                                               .Include(e => e.EstadoFlujo).AsNoTracking().FirstOrDefaultAsync();
                if (Sol != null)
                {
                    Soli.Add(Sol);
                }
            }
            return Soli;
        }

        public async Task<IEnumerable<Solicitud>> GetAllTodas()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Include(e => e.TipoInformacion)
                                                    .Distinct()
                                                    .OrderBy(e => e.TipoInformacionId).ThenBy(e => e.InformacionId).ThenBy(e => e.FechaSolicitud)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Solicitud>> GetByInfo(int id, string id2)
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => e.TipoInformacionId == id)
                                                    .Where(e => e.InformacionId.Equals(id2))
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Hace un tipo de join para validar que las solicitudes sean rechazadas efectivamente
        /// </summary>
        /// <param name="solicitudes"></param>
        /// <returns></returns>
        public async Task<IEnumerable<Solicitud>> validarEstadoRechazadas(IEnumerable<Solicitud> solicitudes)
        {
            try
            {
                /**PROPUESTA**/

                List<Solicitud> result = new List<Solicitud>();
                foreach (var item in solicitudes)
                {
                    var obj = await _ctx.Solicitud.Where(e => e.SolicitudId == item.SolicitudId && e.TipoInformacionId != 21)
                        .Include(e => e.TipoInformacion).Include(e => e.EstadoFlujo).AsNoTracking().FirstOrDefaultAsync();
                    if (obj != null)
                    {
                        result.Add(obj);
                    }
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Solicitud>> GetAllGerente()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => e.EstadoFlujoId == 8 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12
                                    || e.EstadoFlujoId == 13 && e.TipoInformacionId != 18)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Solicitudes pendientes del gerente de X unidad
        private IQueryable<Solicitud> GetAllGerenteByClaveConsult(string claveunidad)
        {
            try
            {
                var Solicitud = _ctx.Solicitud.Where(e => e.EstadoFlujoId == 8 || e.EstadoFlujoId == 11 || e.EstadoFlujoId == 12
                                    || e.EstadoFlujoId == 13) //18: centro posgrado, 21: ITF
                                    .Where(e=> e.TipoInformacionId!=18)
                                    .Where(e=> e.TipoInformacionId!=21)
                                    .Where(x => x.ClaveUnidadAut == claveunidad)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking();


               
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<int> GetAllGerenteByClaveCount(string claveunidad)
        {
            try
            {
                var Solicitud = await this.GetAllGerenteByClaveConsult(claveunidad).CountAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Solicitudes pendientes gerente de X unidad
        public async Task<IEnumerable<Solicitud>> GetAllGerenteByClave(string claveunidad)
        {
            try
            {
                var Solicitud =await  this.GetAllGerenteByClaveConsult(claveunidad).ToListAsync();
                return Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Solicitud>> GetAllCursosCP()
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => e.TipoInformacionId == 18)
                    .Where(e => e.EstadoFlujoId == 2 || e.EstadoFlujoId == 11)
                                                    .Include(e => e.TipoInformacion)
                                                    .Include(e => e.EstadoFlujo)
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
        public async Task UpdateEstado(Solicitud Solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.Solicitud.FirstOrDefaultAsync(e => e.SolicitudId == Solicitud.SolicitudId);
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

        public async Task<Solicitud> UpdateEstadoActualizacion(Solicitud solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.Solicitud.FirstOrDefaultAsync(e => e.SolicitudId == solicitud.SolicitudId);
                if (_Solicitud != null)
                {
                    _Solicitud.titulo = solicitud.titulo;
                    _Solicitud.EstadoFlujoId = solicitud.EstadoFlujoId;
                    _Solicitud.FechaSolicitud = DateTime.Now;

                    await _ctx.SaveChangesAsync();
                    return (_Solicitud);
                }
                return _Solicitud;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Solicitud> existe(int tipoInformacionId, string informacionId)
        {
            try
            {
                var Solicitud = await _ctx.Solicitud.Where(e => e.TipoInformacionId == tipoInformacionId)
                                                    .Where(e => e.InformacionId.Equals(informacionId))
                                                    .Include(e => e.EstadoFlujo)
                                                    .AsNoTracking()
                                                    .FirstOrDefaultAsync();

                return (Solicitud);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        //Crear
        public async Task<Solicitud> Create(Solicitud Solicitud)
        {
            try
            {
                Solicitud.tipoPersonal_Id = "Sin definir";
                PersonasRepository repo = new PersonasRepository();
                var person = await repo.GetById(Solicitud.ClavePersona);
                if (person != null)
                {
                    Solicitud.tipoPersonal_Id = person.TipoPersonalId;
                }

                var result = _ctx.Solicitud.Add(Solicitud);
                await _ctx.SaveChangesAsync();
                return (Solicitud);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Solicitud> UpdateCreate(Solicitud Solicitud)
        {
            try
            {
                var _Solicitud = await _ctx.Solicitud.FirstOrDefaultAsync(e => e.TipoInformacionId == Solicitud.TipoInformacionId && e.ClavePersona == Solicitud.ClavePersona && e.InformacionId == Solicitud.InformacionId);
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

                        _ctx.Solicitud.Add(Solicitud);
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

        public async Task<Solicitud> getpublicacion(string id)
        {
            var solicitud = await _ctx.Solicitud.Where(e => e.TipoInformacionId == 11)
                .Where(e => e.InformacionId.Equals(id)).AsNoTracking().FirstOrDefaultAsync();
            return solicitud;
        }

        public async Task<Solicitud> getponencia(string id)
        {
            var solicitud = await _ctx.Solicitud.Where(e => e.TipoInformacionId == 12)
                .Where(e => e.InformacionId.Equals(id)).AsNoTracking().FirstOrDefaultAsync();
            return solicitud;
        }

        public async Task<Solicitud> getcapitulo(string id)
        {
            var solicitud = await _ctx.Solicitud.Where(e => e.TipoInformacionId == 19)
                .Where(e => e.InformacionId.Equals(id)).AsNoTracking().FirstOrDefaultAsync();
            return solicitud;
        }

        public async Task<Solicitud> GetPermiso(Solicitud Solicitud)
        {
            try
            {

                var entities = await _ctx.Solicitud.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ClavePersona == Solicitud.ClavePersona &&
                                              e.TipoInformacionId == Solicitud.TipoInformacionId &&
                                              e.InformacionId.Equals(Solicitud.InformacionId));
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Solicitud> GetById(int Id)
        {
            try
            {

                var entities = await _ctx.Solicitud.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.SolicitudId == Id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async  Task<BitacoraSolicitudes> GetUltimaFechaBitacora(int id)
        {
            try
            {




                var fechaActual = DateTime.Now;
                var entities = await (from bitacora in _GEN.BitacoraSolicitudes
                                      where bitacora.FechaMovimiento == _GEN.BitacoraSolicitudes.Where(
                                                                    p => p.FechaMovimiento <= fechaActual
                                                                    && p.SolicitudId == bitacora.SolicitudId
                                                                    ).Max(e => e.FechaMovimiento)
                                      select bitacora)
                                      .Where(x => x.SolicitudId == id)
                                      .FirstOrDefaultAsync();

                return entities;            
              
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



    }
}



