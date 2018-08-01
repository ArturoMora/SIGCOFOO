using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.CH.Models;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class SitiosCursosRepository
    {
        SIGCOCHContext _ctx;
        public SitiosCursosRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<SitioWebCurso>> GetById(int clave)
        {
            try
            {
                var result = await _ctx.SitioWebCurso.Where(e => e.CursoInternoId.Equals(clave))
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SitioWebCurso> Create(SitioWebCurso Obj)
        {
            try
            {
                var result = _ctx.SitioWebCurso.Add(Obj);
                await _ctx.SaveChangesAsync();
                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<SitioWebCurso> GetAsync(long id)
        {

            try
            {
                var entities = await _ctx.SitioWebCurso
                    .FirstOrDefaultAsync(e => e.SitioWebCursoInternoId == id);
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public SitioWebCurso Get(long id)
        {

            try
            {
                var entities = _ctx.SitioWebCurso
                    .FirstOrDefault(e => e.SitioWebCursoInternoId == id);
                return entities;

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
                var result = await _ctx.SitioWebCurso.FirstOrDefaultAsync(e => e.SitioWebCursoInternoId == id);
                if (result != null)
                {
                    _ctx.SitioWebCurso.Remove(result);
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
