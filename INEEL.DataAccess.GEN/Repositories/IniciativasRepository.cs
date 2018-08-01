using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{

    public class IniciativasRepository : IDisposable
    {
        GEN_Context _ctx;

        public IniciativasRepository()
        {
            _ctx = new GEN_Context();
        }

        public async Task<IEnumerable<Iniciativas>> GetAll()
        {
            try
            {
                var Iniciativas = await _ctx.dbSetIniciativa.AsNoTracking().ToListAsync();
                return Iniciativas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Iniciativas>> GetByNumJefe(string numJefe)
        {
            try
            {
                var Iniciativas = await _ctx.dbSetIniciativa.Where(e => e.ClaveEmpIniciativa == numJefe).Select(x => x).AsNoTracking().ToListAsync();                    
                return Iniciativas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Iniciativas> GetById(string IniciativasId)
        {
            try
            {
                var Iniciativas = await _ctx.dbSetIniciativa.AsNoTracking().FirstOrDefaultAsync(e => e.FolioId == IniciativasId);
                return Iniciativas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(Iniciativas Iniciativas)
        {
            try
            {
                _ctx.dbSetIniciativa.Add(Iniciativas);
                await _ctx.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(string IniciativasId)
        {
            try
            {
                var _Iniciativas = await _ctx.dbSetIniciativa.FirstOrDefaultAsync(e => e.FolioId == IniciativasId);
                if (_Iniciativas != null)
                {
                    _ctx.dbSetIniciativa.Remove(_Iniciativas);
                    await _ctx.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Iniciativas>> GetIniciativas(String id, String nombre)
        {
            try
            {
                if (!String.IsNullOrEmpty(id))
                {
                    id = id.ToLower();
                    var entities = await _ctx.dbSetIniciativa.AsNoTracking()
                    .Where(x => x.FolioId.ToLower() == id)
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombre))
                {
                    nombre = nombre.ToLower();
                    var entities = await _ctx.dbSetIniciativa.AsNoTracking()
                    .Where(x => x.Titulo.ToLower().Contains(nombre))
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

        public async Task<IEnumerable<Iniciativas>> GetIniciativas(String like)
        {
            try
            {
                if (!String.IsNullOrEmpty(like))
                {                    
                    var entities = await _ctx.dbSetIniciativa
                    .Where(x => x.FolioId.ToLower().Contains(like)  || x.Titulo.ToLower().Contains(like))
                    .OrderBy(x=>x.FolioId)
                    .Skip(0).Take(20)
                    .AsNoTracking()
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

        //MARCO MALDONADO
        public async Task<IEnumerable<Iniciativas>> getIniciativasEmpresa()
        {
            try
            {
                var _iniciativas = await _ctx.dbSetIniciativa
                    .AsNoTracking()
                    .Where(p => p.ContactoId == null
                        && p.EmpresaId == null
                        && String.IsNullOrEmpty(p.ClaveUnidadEmpresa)
                        && p.EstadoIniciativa == "Aceptada")
                    .ToListAsync();

                return _iniciativas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task AsignarIniciativa(Iniciativas iniciativa)
        {
            try
            {
                var _iniciativaEmpresa = await _ctx.dbSetIniciativa
                    .FirstOrDefaultAsync(c => c.FolioId == iniciativa.FolioId);

                if (_iniciativaEmpresa != null)
                {
                    _ctx.Entry(_iniciativaEmpresa).CurrentValues.SetValues(iniciativa);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Iniciativas>> GetIniciativasAsociadas(int Id)
        {
            try
            {
                var _iniciativasAsociadas = await _ctx.dbSetIniciativa
                    .AsNoTracking()
                    .Include(c => c.Contacto)
                    .Where(p => p.EmpresaId == Id)
                    .ToListAsync();

                return _iniciativasAsociadas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetIniciativasAsociadasUnidadesEmpresa(string Id)
        {
            try
            {
                var _iniciativasAsociadas = await _ctx.dbSetIniciativa
                    .AsNoTracking()
                    .Include(c => c.Contacto)
                    .Where(p => p.ClaveUnidadEmpresa == Id)
                    .Select(x=> new{
                        x.FolioId,
                        x.Titulo,
                        x.Fecha,
                        x.Contacto,
                        x.Costos,
                        x.Estado
                    })
                    .ToListAsync();

                return _iniciativasAsociadas;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Iniciativas> GetAsignado(string Id)
        {
            try
            {
                var _iniciativa = await _ctx.dbSetIniciativa
                    .Include(e => e.Empresa)
                    .Include(c => c.Contacto)
                    .Include(u => u.UnidadOrganizacionalEmpresas)
                    .AsNoTracking().FirstOrDefaultAsync(p => p.FolioId == Id);

                return _iniciativa;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Iniciativas iniciativa)
        {
            try
            {
                var _iniciativaEmpresa = await _ctx.dbSetIniciativa
                    .FirstOrDefaultAsync(c => c.FolioId == iniciativa.FolioId);

                if (_iniciativaEmpresa != null)
                {
                    _ctx.Entry(_iniciativaEmpresa).CurrentValues.SetValues(iniciativa);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(Iniciativas iniciativa)
        {
            try
            {

                var _iniciativaEmpresa = await _ctx.dbSetIniciativa
                    .FirstOrDefaultAsync(c => c.FolioId == iniciativa.FolioId);

                iniciativa.EmpresaId = null;
                iniciativa.ContactoId = null;
                iniciativa.ClaveUnidadEmpresa = null;


                if (_iniciativaEmpresa != null)
                {
                    _ctx.Entry(_iniciativaEmpresa).CurrentValues.SetValues(iniciativa);
                    await _ctx.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            ((IDisposable)_ctx).Dispose();
        }
    }
}
