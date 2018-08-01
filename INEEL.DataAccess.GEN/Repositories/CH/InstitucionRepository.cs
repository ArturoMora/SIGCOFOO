using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class InstitucionRepository : IDisposable { public void Dispose(){ _Context.Dispose();}
        //inicializar contexto
        SIGCOCHContext _Context;
        public InstitucionRepository()
        {
            _Context = new SIGCOCHContext();
        }

        //GET
        public async Task<IEnumerable<Institucion>> GetAll()
        {
            try
            {
                var instituciones = await _Context.Instituciones.Where(e=>e.Estado=="1").Include(e=>e.Pais).AsNoTracking().OrderBy(x=>x.Descripcion).ToListAsync();
                return instituciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Institucion>> GetAllAdmin()
        {
            try
            {
                var instituciones = await _Context.Instituciones.Include(e => e.Pais).AsNoTracking().OrderBy(x => x.Descripcion).ToListAsync();
                return instituciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        //GET ONE
        public async Task<Institucion> GetById(int institucionID)
        {
            try
            {
                var institucion = await _Context.Instituciones.Include(e=>e.Pais).AsNoTracking().FirstOrDefaultAsync(i => i.InstitucionID == institucionID);
                return institucion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Add Ins
        public async Task Create(Institucion institucion)
        {
            try
            {
                _Context.Instituciones.Add(institucion);
                await _Context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Add Ins
        public async Task<Institucion> CreateFromModal(Institucion institucion)
        {
            try
            {
                _Context.Instituciones.Add(institucion);
                await _Context.SaveChangesAsync();
                return institucion;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Update insti
        public async Task Update(Institucion institucion)
        {
            try
            {
                var _institucion = await _Context.Instituciones.FirstOrDefaultAsync(i => i.InstitucionID == institucion.InstitucionID);
                if (_institucion != null)
                {
                    _institucion.Descripcion = institucion.Descripcion;
                    _institucion.DescripcionCorta = institucion.DescripcionCorta;
                    _institucion.PaisID = institucion.PaisID;

                    await _Context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Update insti
        public async Task UpdateEstado(Institucion institucion)
        {
            try
            {
                var _institucion = await _Context.Instituciones.FirstOrDefaultAsync(i => i.InstitucionID == institucion.InstitucionID);
                if (_institucion != null)
                {
                    _institucion.Estado = institucion.Estado;

                    await _Context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //elimiar institucion
        public async Task Delete(int id)
        {
            try
            {
                var _institucion = await _Context.Instituciones.FirstOrDefaultAsync(i => i.InstitucionID == id);
                if (_institucion != null)
                {
                    _Context.Instituciones.Remove(_institucion);
                    await _Context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
