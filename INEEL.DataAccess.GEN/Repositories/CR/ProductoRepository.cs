using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ProductoRepository : IDisposable
    {

        private CR_Context _db;
        public ProductoRepository()
        {
            _db = new CR_Context();
        }

        public async Task<IEnumerable<Producto>> GetAll()
        {
            try
            {
                var entities = await _db.Producto.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Producto> Get(int id)
        {
            try
            {
                var entities = await _db.Producto.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ProductoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Producto>> GetProductosModal(int id, String nombre)
        {
            try
            {
                if (id != 0)
                {
                    var entities = await _db.Producto.AsNoTracking()
                    .Where(x => x.ProductoId == id)
                    .Where(x => x.Estado == true)
                    .ToListAsync();
                    return entities;
                }
                else if (!String.IsNullOrEmpty(nombre))
                {
                    nombre = nombre.ToLower();
                    var entities = await _db.Producto.AsNoTracking()
                    .Where(x => String.Concat(x.NomProd).ToLower()
                                .Contains(nombre))
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
        public async Task<Object> GetProductosModalCompetidores()
        {
            try
            {
                var productos = await _db.Producto.AsNoTracking()
                .Select(x=> new{
                    x.ProductoId,
                    x.NomProd,
                    x.DescProd
                }).ToListAsync();

                return productos;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetProductosByEmpresa(int id){
            try{
                var productos = await (from empresa in _db.Empresa where empresa.EmpresaId== id
                                       join competidor in _db.Competidor on empresa.EmpresaId equals competidor.EmpresaId
                                       join productoCompetidor in _db.ProductoPorCompetidor on competidor.CompetidorId equals productoCompetidor.CompetidorId
                                       join producto in _db.Producto on productoCompetidor.ProductoId equals producto.ProductoId
                                       select new{
                                           producto.ProductoId,
                                           producto.NomProd,
                                           producto.DescProd,
                                           producto.FechaRegistro,      
                                           competidor.TipoCompetidor,
                                       }).AsNoTracking().ToListAsync();
                return productos;                                       
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }
        public async Task<Producto> Create(Producto model)
        {
            try
            {
                Producto productoCreado = new Producto();
                _db.Producto.Add(model);
                await _db.SaveChangesAsync();
                productoCreado = model;
                return productoCreado;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Producto model)
        {
            try
            {
                var _model = await _db.Producto.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(Producto model)
        {
            try
            {
                var _model = await _db.Producto.FirstOrDefaultAsync(e => e.ProductoId == model.ProductoId);
                if (_model != null)
                {
                    _model.Estado = model.Estado;

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
                var _model = await _db.Producto.FirstOrDefaultAsync(e => e.ProductoId == id);
                if (_model != null)
                {
                    _db.Producto.Remove(_model);
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
