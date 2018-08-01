using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class MiembrosGERepository
    {
        private GI_Context dbGI;
        private EvaluadorIdeaRepository evalRepo;
        private GEN_Context _db;

        public MiembrosGERepository()
        {
            dbGI = new GI_Context();
            evalRepo = new EvaluadorIdeaRepository();
            _db = new GEN_Context();
        }

        public async Task<IEnumerable<MiembrosGI>> GetById(int id)
        {
            try
            {
                var entities = await dbGI.DbSetMiembrosGI.AsNoTracking()
                    .Where(x=>x.Activo==true)
                    .Where(x => x.ComiteGIId == id).ToListAsync();

                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<string> getCorreos(int id)
        {
            try
            {
                var entities = await dbGI.DbSetMiembrosGI.AsNoTracking()
                    .Where(x => x.Activo == true)
                    .Where(x => x.ComiteGIId == id).ToListAsync();

                List<String> claves = entities.Select(e => e.ClavePersona).ToList();

                var fechaActual = DateTime.Now;
                var correos = await _db.dbSetPersonas.AsNoTracking()
                    .Where(x => claves.Contains(x.ClavePersona) && x.Estado == 1 &&
                    x.FechaEfectiva == _db.dbSetPersonas.Where(
                            p => p.FechaEfectiva <= fechaActual
                            && p.ClavePersona == x.ClavePersona
                            ).Max(e => e.FechaEfectiva))
                    .Select(y => new{correoP = y.Correo}).ToListAsync();

                string joined = string.Join(", ", correos.Select(z => z.correoP));




                return joined;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task agregarevaluadores(List<MiembrosGI> miembros, int IdeaInnovadoraId)
        {
            try
            {
                List<EvaluadoresIdea> EvaluadoresIdea = new List<Models.GI.EvaluadoresIdea>();
                foreach (var item in miembros)
                {
                    EvaluadoresIdea eva = new Models.GI.EvaluadoresIdea();
                    eva.IdeaInnovadoraId = IdeaInnovadoraId;
                    eva.MiembrosGIId = item.Id;
                    eva.ClavePersona = item.ClavePersona;
                    EvaluadoresIdea.Add(eva);
                }
                //validarq no exista y solo actualizar...
                var entities = await evalRepo.GetByIdExist(IdeaInnovadoraId);
                if (entities != null)
                {
                    await evalRepo.Update(EvaluadoresIdea);
                }
                else
                {
                    
                    await evalRepo.Create(EvaluadoresIdea);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task NotificarAsignacionEvalFI(List<MiembrosGI> miembros, int ProductoGIId)
        {
            try
            {
                List<ProductoGIEvaluadores> EvaluadoresFI = new List<Models.GI.ProductoGIEvaluadores>();
                foreach (var item in miembros)
                {
                    ProductoGIEvaluadores eva = new Models.GI.ProductoGIEvaluadores();
                    eva.ProductoGIId = ProductoGIId;
                    eva.MiembrosGIId = item.Id;
                    eva.MiembrosGI = null;
                    eva.ClavePersona = item.ClavePersona;
                    EvaluadoresFI.Add(eva);
                }
                //validarq no exista y solo actualizar...
                var entities = await evalRepo.GetByIdExistFI(ProductoGIId);
                if (entities != null)
                {
                    await evalRepo.UpdateFI(EvaluadoresFI);
                }
                else
                {

                    await evalRepo.CreateFI(EvaluadoresFI);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
