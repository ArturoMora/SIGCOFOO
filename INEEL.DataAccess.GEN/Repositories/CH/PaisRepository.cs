using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class PaisRepository : IDisposable { public void Dispose(){ _Context.Dispose();}
        //inicializar contexto
        SIGCOCHContext _Context;
        public PaisRepository()
        {
            _Context = new SIGCOCHContext();
        }
        //Obtener todos los paises
        public async Task<IEnumerable<Pais>> GetAll()
        {
            try
            {
                var paises = await _Context.Paises.Where(e=>e.Estado=="1")
                    .OrderBy(p=>p.Descripcion)
                    .AsNoTracking().ToListAsync();
                return paises;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<Pais>> GetAllAdmin()
        {
            try
            {
                var paises = await _Context.Paises
                     .OrderBy(p => p.Descripcion)
                    .AsNoTracking().ToListAsync();
                return paises;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener todos los paises con estado Activo (1)
        public async Task<IEnumerable<Pais>> GetAllByEstado()
        {
            try
            {
                var paises = await _Context.Paises
                    .OrderBy(p => p.Descripcion)
                    .AsNoTracking()
                    .ToListAsync();
                return paises.Where(e => e.Estado == "1");
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Obtener un solo pais
        public async Task<Pais> GetById(int paisId)
        {
            try
            {
                var pais = await _Context.Paises.AsNoTracking().FirstOrDefaultAsync(e => e.PaisID == paisId);
                return pais;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //Agregar un pais
        public async Task Create(Pais pais)
        {
            try
            {
                _Context.Paises.Add(pais);
                await _Context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar un pais
        public async Task Update(Pais pais)
        {
            try
            {
                var _pais = await _Context.Paises.FirstOrDefaultAsync(e => e.PaisID == pais.PaisID);
                if (_pais != null)
                {
                    //_ctx.Entry(_emp).CurrentValues.SetValues(employee);
                    _pais.FechaEfectiva = pais.FechaEfectiva;
                    _pais.Descripcion = pais.Descripcion;
                    _pais.DescripcionCorta = pais.DescripcionCorta;
                    _pais.Estado = pais.Estado;

                    await _Context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //Actualizar un pais
        public async Task UpdateEstado(Pais pais)
        {
            try
            {
                var _pais = await _Context.Paises.FirstOrDefaultAsync(e => e.PaisID == pais.PaisID);
                if (_pais != null)
                {
                    _pais.Estado = pais.Estado;

                    await _Context.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //eliminar un pais
        public async Task Delete(int paisId)
        {
            try
            {
                var _pais = await _Context.Paises.FirstOrDefaultAsync(p => p.PaisID == paisId);
                if (_pais != null)
                {
                    _Context.Paises.Remove(_pais);
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
