using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{

    public class PropuestaRepository : IDisposable
    {
        GEN_Context _ctx;

        public PropuestaRepository()
        {
            _ctx = new GEN_Context();
        }

        public async Task<IEnumerable<Propuestas>> GetAll()
        {
            try
            {
                var propuesta = await _ctx.dbSetPropuesta.AsNoTracking().ToListAsync();
                return propuesta;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Object>> GetAllForModal()
        {
            try
            {
                var propuesta = await _ctx.dbSetPropuesta.AsNoTracking()
                    .Include(x => x.Empresa)
                    .Select(x => new
                    {
                        x.PropuestaId,
                        x.Titulo,
                        x.ClaveEmpPropuesta,
                        x.UnidadOrganizacionalId,
                        x.EmpresaId,
                        Empresa = x.Empresa.NombreEmpresa,
                        nombrePersona =  _ctx.dbSetPersonas
                                    .Where(y => y.ClavePersona == x.ClaveEmpPropuesta && y.Estado == 1 &&
                                        y.FechaEfectiva ==
                                             _ctx.dbSetPersonas.Where(p => p.FechaEfectiva <= DateTime.Now && p.ClavePersona == y.ClavePersona)
                                                                .Max(e => e.FechaEfectiva)
                                    )
                                    .Select(y=> y.Nombre + " "+ y.ApellidoPaterno+" "+y.ApellidoMaterno)
                                    .FirstOrDefault()
                    }).ToListAsync();

            return propuesta;
        }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
    }
}

public async Task<Propuestas> GetById(string propuestaId)
{
    try
    {
        var propuesta = await _ctx.dbSetPropuesta.AsNoTracking().FirstOrDefaultAsync(e => e.PropuestaId == propuestaId);
        return propuesta;
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task Create(Propuestas propuesta)
{
    try
    {
        _ctx.dbSetPropuesta.Add(propuesta);
        await _ctx.SaveChangesAsync();
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task Delete(string propuestaId)
{
    try
    {
        var _propuesta = await _ctx.dbSetPropuesta.FirstOrDefaultAsync(e => e.PropuestaId == propuestaId);
        if (_propuesta != null)
        {
            _ctx.dbSetPropuesta.Remove(_propuesta);
            await _ctx.SaveChangesAsync();
        }

    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task<IEnumerable<Propuestas>> GetPropuestas(String id, String nombre)
{
    try
    {
        if (!String.IsNullOrEmpty(id))
        {
            id = id.ToLower();
            var entities = await _ctx.dbSetPropuesta.AsNoTracking()
            .Where(x => x.PropuestaId.ToLower() == id)
            .Where(x => x.Estado == true)
            .ToListAsync();
            return entities;
        }
        else if (!String.IsNullOrEmpty(nombre))
        {
            nombre = nombre.ToLower();
            var entities = await _ctx.dbSetPropuesta.AsNoTracking()
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

public async Task<IEnumerable<Propuestas>> GetPropuestas(String like)
{
    try
    {
        if (!String.IsNullOrEmpty(like))
        {
            var entities = await _ctx.dbSetPropuesta
            .Where(x => x.PropuestaId.ToLower().Contains(like) || x.Titulo.ToLower().Contains(like))
            .OrderBy(x => x.PropuestaId)
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
public async Task<IEnumerable<Propuestas>> getPropuestasEmpresa()
{
    try
    {
        var _propuestas = await _ctx.dbSetPropuesta
            .AsNoTracking()
            .Where(p => p.ContactoId == null
                && p.EmpresaId == null
                && String.IsNullOrEmpty(p.ClaveUnidadEmpresa))
            .ToListAsync();

        return _propuestas;
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task AsignarPropuesta(Propuestas propuestas)
{
    try
    {
        var _propuestaEmpresa = await _ctx.dbSetPropuesta
            .FirstOrDefaultAsync(c => c.PropuestaId == propuestas.PropuestaId);

        if (_propuestaEmpresa != null)
        {
            _ctx.Entry(_propuestaEmpresa).CurrentValues.SetValues(propuestas);
            await _ctx.SaveChangesAsync();
        }
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task<IEnumerable<Propuestas>> GetPropuestasAsociados(int Id)
{
    try
    {
        var _propuestasAsociadas = await _ctx.dbSetPropuesta
            .AsNoTracking()
            .Include(c => c.Contacto)
            .Where(p => p.EmpresaId == Id)
            .OrderByDescending(e => e.Fecha)
            .ToListAsync();

        return _propuestasAsociadas;
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task<IEnumerable<Object>> GetPropuestasAsociadosUnidadesEmpresa(string Id)
{
    try
    {
        var _propuestasAsociadas = await _ctx.dbSetPropuesta
            .AsNoTracking()
            .Include(c => c.Contacto)
            .Where(p => p.ClaveUnidadEmpresa == Id)
            .Select(x => new
            {
                x.PropuestaId,
                x.Titulo,
                x.Fecha,
                x.Contacto.NombreContacto,
                x.Costos,
                x.Estado
            })
            .OrderByDescending(e => e.Fecha)
            .ToListAsync();

        return _propuestasAsociadas;
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task<Propuestas> GetAsginado(string Id)
{
    try
    {
        var _proyecto = await _ctx.dbSetPropuesta
            .Include(e => e.Empresa)
            .Include(c => c.Contacto)
            .Include(u => u.UnidadOrganizacionalEmpresas)
            .AsNoTracking().FirstOrDefaultAsync(p => p.PropuestaId == Id);

        return _proyecto;
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task Update(Propuestas propuesta)
{
    try
    {
        var _propuestaEmpresa = await _ctx.dbSetPropuesta
            .FirstOrDefaultAsync(c => c.PropuestaId == propuesta.PropuestaId);

        if (_propuestaEmpresa != null)
        {
            _ctx.Entry(_propuestaEmpresa).CurrentValues.SetValues(propuesta);
            await _ctx.SaveChangesAsync();
        }
    }
    catch (Exception e)
    {
        throw new Exception(e.Message, e);
    }
}

public async Task Delete(Propuestas propuesta)
{
    try
    {

        var _propuestaEmpresa = await _ctx.dbSetPropuesta
            .FirstOrDefaultAsync(c => c.PropuestaId == propuesta.PropuestaId);

        propuesta.EmpresaId = null;
        propuesta.ContactoId = null;
        propuesta.ClaveUnidadEmpresa = null;


        if (_propuestaEmpresa != null)
        {
            _ctx.Entry(_propuestaEmpresa).CurrentValues.SetValues(propuesta);
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
