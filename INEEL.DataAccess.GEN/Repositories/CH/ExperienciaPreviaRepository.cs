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
    public class ExperienciaPreviaRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public ExperienciaPreviaRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        //Obtener todas las experiencias previas
        public async Task<IEnumerable<ExperienciaPrevia>> GetAll()
        {
            try
            {
                var ExPre = await _ctx.ExperienciaPrevia.AsNoTracking().ToListAsync();
                return ExPre;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Obtener experiencias previas por Id
        public async Task<ExperienciaPrevia> GetById(string ClaveEmpleado)
        {
            try
            {
                var ExPre = await _ctx.ExperienciaPrevia.Where(e => e.ClaveEmpleado == ClaveEmpleado).AsNoTracking().FirstOrDefaultAsync();
                return ExPre;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Crear experiencia previa
        public async Task Create(ExperienciaPrevia ExperienciaPrevia)
        {
            try
            {
                _ctx.ExperienciaPrevia.Add(ExperienciaPrevia);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar experiencia previa
        public async Task Update(ExperienciaPrevia ExperienciaPrevia)
        {
            try
            {
                var _ExperienciaPrevia = await _ctx.ExperienciaPrevia.FirstOrDefaultAsync(e => e.ClaveEmpleado == ExperienciaPrevia.ClaveEmpleado);
                if (_ExperienciaPrevia != null)
                {
                    _ExperienciaPrevia.Fecha = ExperienciaPrevia.Fecha;
                    _ExperienciaPrevia.DuracionPuesto = ExperienciaPrevia.DuracionPuesto;


                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Eliminar experiencia previa
        public async Task Delete(string ClaveEmpleado)
        {
            try
            {
                var _ExperienciaPrevia = await _ctx.ExperienciaPrevia.FirstOrDefaultAsync(e => e.ClaveEmpleado == ClaveEmpleado);
                if (_ExperienciaPrevia != null)
                {
                    _ctx.ExperienciaPrevia.Remove(_ExperienciaPrevia);
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
