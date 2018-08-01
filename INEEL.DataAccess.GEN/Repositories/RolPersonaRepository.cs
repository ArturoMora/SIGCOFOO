using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class RolPersonaRepository : IDisposable
    {
        
        private GEN_Context _db;

        public RolPersonaRepository() 
        {
            _db = new GEN_Context();
        }
               
        public async Task<IEnumerable<RolPersona>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetRolPersona.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RolPersona>> GetAllByIdRolCH(String AdministradorCH)
        {
            try
            {
                //Obtener Administradores de CH
                string ToCH = AdministradorCH; // ConfigurationManager.AppSettings["AdministradorCH"];
                int id = Convert.ToInt32(ToCH);
                var entities = await _db.dbSetRolPersona.Where(e=>e.IdRol==id && e.Estado==1).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<RolPersona> GetAdminCH()
        {
            try
            {
                               
                var entities = await _db.dbSetRolPersona.Where(e => e.IdRol == 1 && e.Estado == 1).AsNoTracking().FirstOrDefaultAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RolPersona>> GetAllByIdRolCR(String AdministradorCR)
        {
            try
            {
                //los mismo de arriba XD
                string ToCH = AdministradorCR;
                int id = Convert.ToInt32(ToCH);
                var entities = await _db.dbSetRolPersona.Where(e => e.IdRol == id && e.Estado == 1).AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RolPersona> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetRolPersona.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.RolPersonaId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RolPersona> GetByClavePersona(string ClavePersona)
        {
            try
            {
                var entities = await _db.dbSetRolPersona.Where(e => e.ClavePersona == ClavePersona).AsNoTracking().FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(RolPersona model)
        {
            try
            {
                _db.dbSetRolPersona.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task CreateEspecialista(RolPersona model)
        {
            try
            {
                model.IdRol = 1025;

                _db.dbSetRolPersona.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RolPersona model)
        {
            try
            {
                var _model = await _db.dbSetRolPersona.FirstOrDefaultAsync(e => e.RolPersonaId == model.RolPersonaId);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.dbSetRolPersona.FirstOrDefaultAsync(e => e.RolPersonaId == id);
                if (_model != null)
                {
                    _db.dbSetRolPersona.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(RolPersona obj)
        {
            try
            {
                var _obj = await _db.dbSetRolPersona.FirstOrDefaultAsync(e => e.RolPersonaId == obj.RolPersonaId);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;

                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RolPersona>> GetByRol(int idrol)
        {
            try
            {
                var entities = await _db.dbSetRolPersona
                     .Where(e => e.IdRol == idrol)
                     .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    item.persona = await _db.dbSetPersonas
                           .Where(x => x.ClavePersona == item.ClavePersona)
                           .Where(x => x.Estado == 1)
                           .AsNoTracking()
                           .FirstOrDefaultAsync();
                }


                    return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RolPersona>> GetPersonasByIdRol()
        {
            try
            {
                var entities = await _db.dbSetRolPersona
                    .Where(e => e.IdRol == 1025)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    item.persona = await _db.dbSetPersonas
                           .Where(x => x.ClavePersona == item.ClavePersona)
                           .Where(x => x.Estado == 1)
                           .AsNoTracking()
                           .FirstOrDefaultAsync();
                }


                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RolPersona>> GetPersonasByIdRolByTrue()
        {
            try
            {
                var entities = await _db.dbSetRolPersona
                    .Where(e => e.IdRol == 1025)
                    .Where(es => es.Estado == 1)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    item.persona = await _db.dbSetPersonas
                           .Where(x => x.ClavePersona == item.ClavePersona)
                           .Where(x => x.Estado == 1)
                           .AsNoTracking()
                           .FirstOrDefaultAsync();
                }


                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RolPersona>> GetPersonasByUnidad(string ClaveUnidad)
        {
            try
            {
                var entities = await _db.dbSetRolPersona
                    .Where(e => e.IdRol == 8)
                    .Where(es => es.Estado == 1)
                    .AsNoTracking().ToListAsync();

                foreach (var item in entities)
                {

                    item.persona = await _db.dbSetPersonas
                           .Where(x => x.Estado == 1)
                           .Where(x => x.ClaveUnidad == ClaveUnidad)
                           .AsNoTracking()
                           .FirstOrDefaultAsync();
                }


                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RolPersona> GetByRolForsolicitud(int id)
        {
            try
            {
                var entities = await _db.dbSetRolPersona
                     .Where(e => e.IdRol == id)
                     .AsNoTracking().FirstOrDefaultAsync();

                return entities;

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
