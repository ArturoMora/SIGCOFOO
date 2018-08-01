using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class AutoresIdeaRepository
    {

        private GI_Context dbGI;
   
        public AutoresIdeaRepository()
        {
            dbGI = new GI_Context();
         
        }
        public AutoresIdeaRepository(GI_Context db)
        {
            dbGI = db;
        }
        public async Task<IEnumerable<AutoresIdea>> GetAll()
        {
            try
            {
                var entities = await dbGI.DbSetAutoresIdea.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<AutoresIdea> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetAutoresIdea.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutoresIdea> getProponentePrincipalById(int ideaInnovadoraId)
        {
            try
            {
                var entities = await dbGI.DbSetAutoresIdea.AsNoTracking()
                    .Where(x=>x.IdeaInnovadoraId==ideaInnovadoraId)
                    .Where(x=>x.ContribucionProponenteId==0)
                    .FirstOrDefaultAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }





        public async Task Create(AutoresIdea model)
        {
            try
            {

                dbGI.DbSetAutoresIdea.Add(model);
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task CreateAllSetIdeaInnovadoraId(List<AutoresIdea> listaAutores, int IdeaInnovadoraId)
        {
            try
            {
                foreach (var a in listaAutores)
                {
                    a.IdeaInnovadoraId = IdeaInnovadoraId;
                    dbGI.DbSetAutoresIdea.Add(a);
                }              
                await dbGI.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

       

        public async Task Update(AutoresIdea model)
        {
            try
            {
                var _model = await dbGI.DbSetAutoresIdea.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    dbGI.Entry(_model).CurrentValues.SetValues(model);
                    await dbGI.SaveChangesAsync();
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
                var _model = await dbGI.DbSetAutoresIdea.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    dbGI.DbSetAutoresIdea.Remove(_model);
                    await dbGI.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            dbGI.Dispose(); //ayudar al recolector de basura
        }


        public async Task<IEnumerable<Object>> GetProponentesByIdeaId(int id)
        {
            try
            {
                var entities = await dbGI.DbSetAutoresIdea.AsNoTracking()
                    .Include(x=>x.ContribucionProponente)
                    .Where(x=>x.IdeaInnovadoraId==id)
                    .ToListAsync();

                var fechaActual = DateTime.Now;
                var result = from proponente in dbGI.DbSetAutoresIdea

                             join contribucion in dbGI.DbSetContribucionProponente
                             on proponente.ContribucionProponenteId equals contribucion.Id
                             where (proponente.IdeaInnovadoraId == id)

                             from Persona in dbGI.DbSetPersonas
                             where Persona.FechaEfectiva == dbGI.DbSetPersonas.Where(
                                                         p => p.FechaEfectiva <= fechaActual
                                                         && p.ClavePersona == proponente.ClavePersona
                                                         ).Max(e => e.FechaEfectiva)
                             where Persona.ClavePersona.Equals(proponente.ClavePersona)

                             select new { Id = proponente.Id, ClavePersona = proponente.ClavePersona,
                                 Persona = String.Concat(Persona.Nombre," ", Persona.ApellidoPaterno, " ", Persona.ApellidoMaterno),
                                 IdeaInnovadoraId =proponente.IdeaInnovadoraId,ContribucionProponente=contribucion,
                             ContribucionProponenteId=proponente.ContribucionProponenteId
                             };



                return await result.ToListAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
