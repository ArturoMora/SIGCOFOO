using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ServicioRepository : IDisposable
    {
        private CR_Context _db;
        public ServicioRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<Servicio>> GetAll()
        {
            try
            {
                var entities = await _db.Servicio.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Servicio> Get(int id)
        {
            try
            {
                var entities = await _db.Servicio.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ServicioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Servicio>> GetServiciosModal(int id, String nombre)
        {
            try
            {
                if (id != 0)
                {
                    var entities = await _db.Servicio.AsNoTracking()
                    .Where(x => x.ServicioId == id)
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombre))
                {
                    nombre = nombre.ToLower();
                    var entities = await _db.Servicio.AsNoTracking()
                    .Where(x => String.Concat(x.NomServ).ToLower()
                                .Contains(nombre))
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else return null;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetServiciosModalCompetidores(){
            try{
                var servicios= await _db.Servicio.AsNoTracking()
                .Select(x=> new{
                    x.DescServ,
                    x.ServicioId,
                    x.NomServ

                }).ToListAsync();

                return servicios;

            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<IEnumerable<Object>> GetServiciosByEmpresa(int id){
            try{
                var servicios= await (from empresa in _db.Empresa where empresa.EmpresaId== id
                                      join competidor in _db.Competidor on empresa.EmpresaId equals competidor.EmpresaId
                                      join servicioCompetidor in _db.ServicioPorCompetidor on competidor.CompetidorId equals servicioCompetidor.CompetidorId
                                      join servicio in _db.Servicio on servicioCompetidor.ServicioId equals servicio.ServicioId
                                      select new{
                                          servicio.ServicioId,
                                          servicio.NomServ,
                                          servicio.DescServ,
                                          servicio.FechaRegistro,
                                          competidor.TipoCompetidor
                                      }).AsNoTracking().ToListAsync();

                return servicios;

            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Servicio> Create(Servicio model)
        {
            try
            {
                Servicio servicioCreado = new Servicio();
                _db.Servicio.Add(model);
                await _db.SaveChangesAsync();
                servicioCreado = model;
                return servicioCreado;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Servicio model)
        {
            try
            {
                var _model = await _db.Servicio.FirstOrDefaultAsync(e => e.ServicioId == model.ServicioId);
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

        public async Task UpdateEstado(Servicio model)
        {
            try
            {
                var _model = await _db.Servicio.FirstOrDefaultAsync(e => e.ServicioId == model.ServicioId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
                var _model = await _db.Servicio.FirstOrDefaultAsync(e => e.ServicioId == id);
                if (_model != null)
                {
                    _db.Servicio.Remove(_model);
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

