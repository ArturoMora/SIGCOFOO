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
    public class PersonalProyectoRepository : IDisposable
    {
        //----------- AYUDA:
        // PersonalProyectoRepository: nombre de clase (y tipicamente el constructor)
        // GEN_Context.- tu Contexto : DbContext
        // PersonalProyecto.- es el modelo
        // dbSetPersonalProyectos.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetPersonalProyectos =Categories                                  )
        // PersonalProyectoId.-  es el ID del modelo (ID de la tabla)


        private GEN_Context _db;
        public PersonalProyectoRepository()
        {
            _db = new GEN_Context();
        }
        public PersonalProyectoRepository(GEN_Context context)
        {
            _db = context;
        }

        //public async Task<IEnumerable<PersonalProyecto>> OtrosMetodos(){ ... }

        public async Task<IEnumerable<PersonalProyecto>> GetByClaveEmpEstadoFlujo(string clave, DateTime yearsBack, List<int> estados)
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.AsNoTracking()
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .Where(e => e.ClavePersona.Equals(clave) && estados.Contains(e.EstadoFlujoId) && (e.FechaInicio > yearsBack || e.Proyecto.FechaInicio > yearsBack) && !e.Proyecto.SubPrograma.Contains("87"))
                                        .OrderByDescending(e => e.FechaInicio)
                                        
                                        .ToListAsync();

                List<string> claves = result.Select(x => x.Proyecto.SubPrograma).ToList();
                var subprogramasRes = await _db.bdSetSubProgramaProyecto
                    .Where(x => claves.Contains(x.Clave))
                    .AsNoTracking()
                    .ToListAsync();

                if (subprogramasRes.Count() > 0)
                {
                    foreach (var item in result)
                    {
                        item.Proyecto.subprogramaProyecto = subprogramasRes.Where(y => y.Clave.Equals(item.Proyecto.SubPrograma)).Select(x => x.Descripcion).First();
                    }
                }

                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<PersonalProyecto>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetPersonalProyectos.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PersonalProyecto>> GetForCV(string id)
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.Where(e => e.ClavePersona.Equals(id))
                    .Where(e=>e.EstadoFlujoId==3)
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();

                List<string> claves = result.Select(x => x.Proyecto.SubPrograma).ToList();
                var subprogramasRes = await _db.bdSetSubProgramaProyecto
                    .Where(x => claves.Contains(x.Clave))
                    .AsNoTracking()
                    .ToListAsync();

                if (subprogramasRes.Count() > 0)
                {
                    foreach (var item in result)
                    {
                        if(item.Proyecto.SubPrograma!=null)
                        item.Proyecto.subprogramaProyecto = subprogramasRes.Where(y => y.Clave.Equals(item.Proyecto.SubPrograma.Trim())).Select(x => x.Descripcion).First();
                    }
                }
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
                public async Task<IEnumerable<PersonalProyecto>> PersonalProyecto_GetByClave(string numEmpleado, string numProyecto)
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.Where(e => e.ClavePersona.Equals(numEmpleado) && e.ProyectoId.Equals(numProyecto))
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<PersonalProyecto>> GetByClave(string clave)
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.Where(e => e.ClavePersona.Equals(clave))
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PersonalProyecto>> GetByEstado()
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.Where(e => e.EstadoFlujoId == 2)
                                                        .Include(e => e.Proyecto)
                                                        .Include(e => e.EstadoFlujo)
                                                        .Include(e => e.Adjunto)
                                                        .AsNoTracking()
                                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PersonalProyecto> GetById(int id)
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.Where(e => e.PersonalProyectoId == id)
                                        .Include(e => e.Proyecto)
                                        .Include(e => e.EstadoFlujo)
                                        .Include(e => e.Adjunto)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        

        public async Task<IEnumerable<PersonalProyecto>> GetProyPersonas(String id)
        {
            try
            {
                var entities = await _db.dbSetPersonalProyectos                    
                    .Where(x => x.ProyectoId == id)
                    .Select(x => x).AsNoTracking().ToListAsync();
                if (entities != null && entities.Count>0)
                {
                    PersonasRepository personasRepo = new PersonasRepository();                        
                    foreach (var item in entities)
                    {
                        String clavePersona = item.ClavePersona;
                        var persona = await personasRepo.GetByClaveWithoutStatus(clavePersona);
                        item.persona = persona;
                    }
                    
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<PersonalProyecto>> GetPersonasPorProyecto(String id)
        {
            try
            {
                var entities = await _db.dbSetPersonalProyectos
                    .Where(x => x.ProyectoId == id && x.EstadoFlujoId==3)
                    .Select(x => x).AsNoTracking().ToListAsync();
                if (entities != null && entities.Count > 0)
                {
                    PersonasRepository personasRepo = new PersonasRepository();
                    foreach (var item in entities)
                    {
                        String clavePersona = item.ClavePersona;
                        var persona = await personasRepo.GetByClaveWithoutStatus(clavePersona);
                        item.persona = persona;
                    }

                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<PersonalProyecto> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetPersonalProyectos.AsNoTracking()
                    .Include(e => e.Proyecto)
                    .Include(e => e.EstadoFlujo)
                    .Include(e => e.Adjunto)
                    .FirstOrDefaultAsync(e => e.PersonalProyectoId == id); 
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(PersonalProyecto model)
        {
            try
            {
                 string origen = ConfigurationManager.AppSettings["OrigenDatos"];
                model.Origen = origen;
                _db.dbSetPersonalProyectos.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(PersonalProyecto model)
        {
            try
            {
                string origen = ConfigurationManager.AppSettings["OrigenDatos"];
                model.Origen = origen;
                var _model = await _db.dbSetPersonalProyectos.FirstOrDefaultAsync(e => e.PersonalProyectoId == model.PersonalProyectoId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();

                    if (model.EstadoFlujoId==3 && model.Participacion.Equals("Jefe de Proyecto"))
                    {
                        Proyecto proyecto = await _db.dbSetProyectoGEN.FirstOrDefaultAsync(e => e.ProyectoId == model.ProyectoId);
                        Personas persona = await _db.dbSetPersonas.FirstOrDefaultAsync(e=>e.ClavePersona==model.ClavePersona);
                        if (proyecto != null)
                        {
                            proyecto.NumjefeProyecto = model.ClavePersona;
                            proyecto.NombreJefeProyecto = persona.NombreCompleto;
                            _db.Entry(proyecto).CurrentValues.SetValues(proyecto);
                            await _db.SaveChangesAsync();
                        }
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(PersonalProyecto Obj)
        {
            try
            {
                var result = await _db.dbSetPersonalProyectos.FirstOrDefaultAsync(e => e.PersonalProyectoId == Obj.PersonalProyectoId);
                if (result != null)
                {
                    result.EstadoFlujoId = Obj.EstadoFlujoId;
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
                var _model = await _db.dbSetPersonalProyectos.FirstOrDefaultAsync(e => e.PersonalProyectoId == id);
                if (_model != null)
                {
                    _db.dbSetPersonalProyectos.Remove(_model);
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
