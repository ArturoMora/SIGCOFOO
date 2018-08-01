using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class OCSuscripcionesRepository : IDisposable
    {

        private GEN_Context _db;
        public OCSuscripcionesRepository()
        {
            _db = new GEN_Context();
        }
        public OCSuscripcionesRepository(GEN_Context gen)
        {
            _db = gen;
        }

        //public async Task<IEnumerable<OCSuscripciones>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<OCSuscripciones>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        /// <summary>
        /// Recupera todos los empleados de la colleccion HashSet, con estado =1, tomando de referencia la fecha actual para la fecha efectiva
        /// </summary>
        public async Task<IEnumerable<Personas>> PersonasGetAllCollectionMAX(HashSet<String> clavesEmpleado)
        {
            try
            {
                PersonasRepository p = new PersonasRepository(_db);
                return await p.GetAllCollectionMAX(clavesEmpleado);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<OCSuscripciones>> GetAllByEmpleado(OCSuscripciones model)
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                    .Where(e => e.ClaveEmpleado == model.ClaveEmpleado)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<OCSuscripciones> GetRowSuscripcionByEmpleadoANDocId(String claveEmpleado, String ocId)
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                    .Where(e => e.ClaveEmpleado == claveEmpleado && e.OcsId==ocId)
                    .FirstOrDefaultAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<String>> GetOcsIdByEmpleadoANDsuscrito(String claveEmpleado)
        {
            try
            {
                var entities = await  (from model in _db.dbSetOCSuscripciones
                 where model.ClaveEmpleado == claveEmpleado && model.suscrito == true
                                       select model.OcsId).ToListAsync();

                //var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                //    .Where(e => e.ClaveEmpleado == claveEmpleado
                //    && e.suscrito == true)
                //    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<OCSuscripciones>> GetAllByEmpleadoANDsuscrito(String claveEmpleado)
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                    .Where(e => e.ClaveEmpleado == claveEmpleado
                    && e.suscrito==true)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<OCSuscripciones>> GetAllEmpleadosANDsuscritoWithOc()
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                    .Where(e => e.suscrito == true)
                    .Include(x=>x.Ocs)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<OCSuscripciones>> GetAllEmpleadosANDsuscrito()
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                    .Where(e => e.suscrito == true)
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
                NuevoOCRepository r = new NuevoOCRepository(_db);
                return await r.GetCATOcsWithModulo();
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
                NuevoOCRepository r = new NuevoOCRepository(_db);
                return await r.GetCATOcs();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        

        public async Task<OCSuscripciones> Get(OCSuscripciones model)
        {
            try
            {
                var entities = await _db.dbSetOCSuscripciones.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => 
                                            e.ClaveEmpleado == model.ClaveEmpleado && 
                                            e.OcsId         == model.OcsId);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(OCSuscripciones model)
        {
            try
            {

                _db.dbSetOCSuscripciones.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(OCSuscripciones model)
        {
            try
            {
                var _model = await _db.dbSetOCSuscripciones.FirstOrDefaultAsync(
                    e =>
                                            e.ClaveEmpleado == model.ClaveEmpleado &&
                                            e.OcsId == model.OcsId);
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

        public async Task Delete(OCSuscripciones model)
        {
            try
            {
                var _model = await _db.dbSetOCSuscripciones.FirstOrDefaultAsync(
                    e =>
                                            e.ClaveEmpleado == model.ClaveEmpleado &&
                                            e.OcsId == model.OcsId);
                if (_model != null)
                {
                    _db.dbSetOCSuscripciones.Remove(_model);
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
