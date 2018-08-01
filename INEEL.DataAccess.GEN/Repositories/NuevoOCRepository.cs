using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class NuevoOCRepository : IDisposable
    {

        private GEN_Context _db;
        public NuevoOCRepository()
        {
            _db = new GEN_Context();
            _db.Database.Log = Escribe.Write;
        }
        public NuevoOCRepository(GEN_Context gen)
        {
            _db = gen;
        }

        
            
        public async Task<IEnumerable<OcIntranet>> GetTop(String server, int cantTop)
        {
            try
            {
                ModulosRepository modulos = new ModulosRepository(_db);
                var mods= await modulos.GetAll();
                List<OcIntranet> ocs = new List<OcIntranet>();
                foreach (var m in mods)
                {
                    var idModulo = m.ModuloId;
                    var result= await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x => x.ModuloId == idModulo)
                    .Include(x => x.Ocs)
                    .OrderByDescending(x => x.FechaRegistro)
                    .Select(x=> new OcIntranet
                         {
                        Fecha = x.FechaRegistro,
                        TipoOC = x.Ocs.Nombre,
                        Nombre =x.descripcion,                            
                        Liga= String.Concat(server,x.liga),
                            })
                    .Take(cantTop)
                    .ToListAsync();
                    ocs.AddRange(result);
                }
                return ocs;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<NuevoOC>> getOCtopRaw(int cantTop)
        {
            try
            {
                ModulosRepository modulos = new ModulosRepository(_db);
                var mods = await modulos.GetAll();
                                        
                    var result = await _db.dbSetNuevoOC
                    .Include(x => x.Ocs)
                    .OrderByDescending(x => x.FechaRegistro)
                    .Take(cantTop)
                    .ToListAsync();                                    
                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Obtiene todos los nuevos OCs creados por un modulo en especifico
        /// </summary>
        /// <param name="idModulo">El modulo por el cual buscar los ocs</param>
        /// <param name="canTop">El limite de registros a mostrar</param>
        /// <returns></returns>
        public async Task<IEnumerable<NuevoOC>> GetTopByMODULO(String idModulo, int cantTop)
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x => x.ModuloId == idModulo)
                    .Include(x => x.Ocs.OCsRolesBlackList)
                    .OrderByDescending(x => x.FechaRegistro)
                    .Take(cantTop)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<OcIntranet>> GetByOC(DateTime fecha, String server)
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x =>  fecha < x.FechaRegistro)
                    .OrderByDescending(x => x.FechaRegistro)
                                        .Select(x => new OcIntranet
                                        {
                                            Fecha = x.FechaRegistro,
                                            TipoOC = x.Ocs.Nombre,
                                            Nombre = x.descripcion,
                                            Modulo = x.ModuloId,
                                            Liga = String.Concat(server, x.liga),
                                        })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<OcIntranet>> GetByMODULO(String idModulo, DateTime fecha, String server)
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x => x.ModuloId == idModulo && fecha < x.FechaRegistro)
                    .OrderByDescending(x => x.FechaRegistro)
                                        .Select(x => new OcIntranet
                                        {
                                            Fecha = x.FechaRegistro,
                                            TipoOC = x.Ocs.Nombre,
                                            Nombre = x.descripcion,
                                            Liga = String.Concat(server, x.liga),
                                        })
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetByOCCount(DateTime fecha)
        {
            try
            {
                //var idOcs = await _db.dbSetOcs.AsNoTracking().Select(x => x.OcsId).ToListAsync();
                //var consulta = await _db.dbSetNuevoOC.AsNoTracking()
                //    .Where(x => fecha < x.FechaRegistro).ToListAsync();

                var query =await  _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x=> fecha <x.FechaRegistro)
                    .Include(x => x.Ocs)
                   .GroupBy(p => p.Ocs.Nombre )
                   .Select(g => new { tipoOC = g.Key, count = g.Count() }).ToListAsync();

                return query;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> GetByMODULOCount(String idModulo, DateTime fecha, String server)
        {
            try
            {
                var consulta =  _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x => x.ModuloId == idModulo && fecha < x.FechaRegistro);

                var r = await consulta.CountAsync();
                return r;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<NuevoOC>> GetAllOfDateMODULO(DateTime time, String idModulo)
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x => x.FechaRegistro >= time && x.ModuloId== idModulo)
                    .Include(x => x.Ocs.OCsRolesBlackList)                    
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<NuevoOC>> GetAllOfDate(DateTime time)
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x=> x.FechaRegistro>= time)
                    .Include(x=>x.Ocs)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<Ocs>> GetCATOcsWithModulo()
        {
            try
            {
                var entities = await _db.dbSetOcs.AsNoTracking()
                    .Include(x => x.OCsRolesBlackList)
                    .Include(x=>x.Modulo)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Ocs>> GetCATOcs()
        {
            try
            {
                var entities = await _db.dbSetOcs.AsNoTracking()
                    .Include(x=>x.OCsRolesBlackList)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task UpdateSetFalseInNuevo()
        {
            try
            {
               var rows= await _db.dbSetNuevoOC
                .Where(x => x.nuevo == true)
                .ToListAsync();

                rows.ForEach(r => r.nuevo = false);

                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<NuevoOC>> GetAllNewsWithOCs()
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    .Where(x=>x.nuevo==true)
                    .Include(x=>x.Ocs)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<NuevoOC>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<NuevoOC> Get(long id)
        {
            try
            {
                var entities = await _db.dbSetNuevoOC.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.NuevoOCId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        /// <summary>
        /// Crea un nuevo registro de OC
        /// </summary>
        /// <params>NuevoOC object</params>
        /// <returns></returns>
        public async Task Create(NuevoOC model)
        {
            try
            {
                var previo = 0;
                try
                {
                    var cant = await _db.dbSetNuevoOC.AsNoTracking()
                          .Where(x => x.liga.Equals(model.liga))
                             .GroupBy(p => p.liga)
                              .Select(g => new { liga = g.Key, count = g.Count() })
                              .FirstOrDefaultAsync();
                    if (cant != null)
                    {
                        previo = cant.count;
                    }
                    if (previo > 0)
                    {
                        return;
                    }
                    
                    
                }
                catch (Exception e1) { }
                _db.dbSetNuevoOC.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un registro de ocs para mostrarse en el panel principal de cada modulo
        /// </summary>
        /// <param name="modulo">modulo en el cual se va a registrar la notificacion</param>
        /// <param name="idOC">Id del registro</param>
        /// <param name="nombreOC">Nombre del registro</param>
        /// <param name="url">Url del detalle del registro</param>
        /// <returns></returns>
        public async Task Create(string modulo ,string idOC, string nombreOC, string url)
        {
            try
            {
                NuevoOC model = new NuevoOC(modulo, idOC, nombreOC, url);

                var previo = 0;
                try
                {
                    var cant = await _db.dbSetNuevoOC.AsNoTracking()
                          .Where(x => x.liga.Equals(model.liga))
                             .GroupBy(p => p.liga)
                              .Select(g => new { liga = g.Key, count = g.Count() })
                              .FirstOrDefaultAsync();
                    if (cant != null)
                    {
                        previo = cant.count;
                    }
                    if (previo > 0)
                    {
                        return;
                    }
                    
                    
                }
                catch (Exception x) {

                }
                _db.dbSetNuevoOC.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un registro 
        /// </summary>
        /// <param name="modulo">modulo en el cual se va a registrar la notificacion</param>
        /// <param name="idOC">Id del registro</param>
        /// <param name="nombreOC">Nombre del registro</param>
        /// <param name="url">Url del detalle del registro</param>
        /// <param name="idExterno">Opcional: un identificador para relacionar los registros</param>
        /// <returns></returns>
        public async Task Create(string modulo ,string idOC, string nombreOC, string url, string idExterno)
        {
            try
            {
                NuevoOC model = new NuevoOC(modulo, idOC, nombreOC, url, idExterno);

                var previo = 0;
                try
                {
                    var cant = await _db.dbSetNuevoOC.AsNoTracking()
                          .Where(x => x.liga.Equals(model.liga))
                             .GroupBy(p => p.liga)
                              .Select(g => new { liga = g.Key, count = g.Count() })
                              .FirstOrDefaultAsync();
                    if (cant != null)
                    {
                        previo = cant.count;
                    }
                    if (previo > 0)
                    {
                        return;
                    }
                    
                    
                }
                catch (Exception x) {

                }
                _db.dbSetNuevoOC.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(NuevoOC model)
        {
            try
            {
                var _model = await _db.dbSetNuevoOC.FirstOrDefaultAsync(e => e.NuevoOCId == model.NuevoOCId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.dbSetNuevoOC.FirstOrDefaultAsync(e => e.NuevoOCId == id);
                if (_model != null)
                {
                    _db.dbSetNuevoOC.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteId(string id,string OcsId)
        {
            try
            {
                var _model = await _db.dbSetNuevoOC.Where(x=> x.IdExterno == OcsId && x.OcsId==id).FirstOrDefaultAsync();
                if (_model != null)
                {
                    _db.dbSetNuevoOC.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
