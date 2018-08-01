using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.PI.Models;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class AutorInternoCursoInternoRepository : IDisposable { public void Dispose(){_ctx.Dispose();}
        SIGCOCHContext _ctx;
        public AutorInternoCursoInternoRepository()
        {
            _ctx = new SIGCOCHContext();
        }

        public async Task<IEnumerable<AutorInternoCursoInterno>> GetByObj(int id)
        {
            try
            {
                var result = await _ctx.AutorInternoCursoInterno.Where(e => e.CursoInternoId.Equals(id))
                                        .Include(e => e.CursoInterno)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorInternoCursoInterno>> GetAllColaboracion(string clave)
        {
            try
            {
                var result = await _ctx.AutorInternoCursoInterno.Where(e => e.ClavePersona == clave).AsNoTracking()
                                                 .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorInternoCursoInterno> Create(AutorInternoCursoInterno Obj)
        {
            try
            {
                var result = _ctx.AutorInternoCursoInterno.Add(Obj);
                await _ctx.SaveChangesAsync();

                return (result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AutorExternoCursoInterno> CreateExt(AutorExternoCursoInterno Obj)
        {
            try
            {
                var result = _ctx.AutorExternoCursoInterno.Add(Obj);
                await _ctx.SaveChangesAsync();

                return (result);
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
                var result = await _ctx.AutorInternoCursoInterno.FirstOrDefaultAsync(e => e.AutorInternoCursoInternoId == id);
                if (result != null)
                {
                    _ctx.AutorInternoCursoInterno.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteExt(int id)
        {
            try
            {
                var result = await _ctx.AutorExternoCursoInterno.FirstOrDefaultAsync(e => e.AutorExternoCursoInternoId == id);
                if (result != null)
                {
                    _ctx.AutorExternoCursoInterno.Remove(result);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorInternoCursoInterno>> GetAutor(string id)
        {
            try
            {
                var result = await _ctx.AutorInternoCursoInterno.Where(e => e.ClavePersona.Equals(id)&&(e.CursoInterno.EstadoFlujoId==3|| e.CursoInterno.EstadoFlujoId == 11 || e.CursoInterno.EstadoFlujoId == 12 || e.CursoInterno.EstadoFlujoId == 13))
                                        .Include(e => e.CursoInterno)
                                        .Include(e => e.CursoInterno.TipoCurso)
                                        .Include(e => e.CursoInterno.Proyecto)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorExternoCursoInterno>> GetExtById(int id)
        {
            try
            {
                var result = await _ctx.AutorExternoCursoInterno.Where(e => e.CursoInternoId.Equals(id))
                                        .Include(e => e.CursoInterno)
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<AutorInternoCursoInterno>> GetById(int id)
        {
            try
            {
                var result = await _ctx.AutorInternoCursoInterno.Where(e => e.CursoInternoId == id)
                                        .Include(e => e.CursoInterno.EstadoFlujo)
                                        .Include(e => e.CursoInterno.Adjunto)
                                        .Include(e => e.CursoInterno.Proyecto)
                                        .Include(e => e.CursoInterno.TipoCurso)
                                        //.Include("CursoInterno.Adjunto.Adjunto")
                                        .AsNoTracking()
                                        .ToListAsync();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateAll(List<AutorExternoCursoInterno> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AutorExternoCursoInternoId > 0)
                    {
                        if (model.NombreCompleto.Equals("eliminar"))
                        {
                            await this.DeleteExt(model.AutorExternoCursoInternoId);
                        }
                    }

                    else
                    {
                        model.CursoInterno = null;
                        await this.CreateExt(model);
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateAllInt(List<AutorInternoCursoInterno> Obj)
        {
            try
            {
                foreach (var model in Obj)
                {

                    if (model.AutorInternoCursoInternoId > 0)
                    {
                        if (model.NombreCompleto.Equals("eliminar"))
                        {
                            await this.Delete(model.AutorInternoCursoInternoId);
                        }
                    }

                    else
                    {
                        model.CursoInterno = null;
                        await this.Create(model);
                    }
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }

    
}
