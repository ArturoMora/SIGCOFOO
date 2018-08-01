﻿using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CH;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ClasificaCategoriasTecnicasRepository : IDisposable
    {
        private SIGCOCHContext _db;
        public ClasificaCategoriasTecnicasRepository()
        {
            _db = new SIGCOCHContext();
        }

        public async Task<IEnumerable<RelacionCategoriasTecnicas>> GetAll()
        {
            try
            {
                var entities = await _db.categoriasTecnicas.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<RelacionCategoriasTecnicas> Get(int id)
        {
            try
            {
                var entities = await _db.categoriasTecnicas.AsNoTracking()
                   .FirstOrDefaultAsync(e => e.Id== id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        
        public async Task<IEnumerable<RelacionCategoriasTecnicas>> GetByPeriodo(int id)
        {
            try
            {
                var entities = await _db.categoriasTecnicas
                     .Include(e => e.area)
                     .Include(e => e.niveltecnica)
                     .Where(e => e.periodoId == id)
                     .OrderByDescending(e => e.categoriaEmpleado)
                     .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<RelacionCategoriasTecnicas>> GetByTipo(BusquedaNivel parametros)
        {
            try
            {
                var entities = await _db.categoriasTecnicas
                     .Include(e => e.area)
                     .Include(e => e.niveltecnica)
                     .Where(e => e.periodoId == parametros.periodoId && e.areaId == parametros.areaId)
                     .OrderByDescending(e => e.categoriaEmpleado)
                     .AsNoTracking().ToListAsync();
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Categoria>> GetCategoriasEmpleados()
        {
            try
            {
                CategoriasRepository categorias = new CategoriasRepository();
                IEnumerable<Categoria> listaCategorias = await categorias.GetAll();
                return listaCategorias;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(RelacionCategoriasTecnicas model)
        {
            try
            {
                _db.categoriasTecnicas.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(RelacionCategoriasTecnicas model)
        {
            try
            {
                var _model = await _db.categoriasTecnicas.FirstOrDefaultAsync(e => e.Id == model.Id);
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

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.categoriasTecnicas.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.categoriasTecnicas.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task UpdateEstado(RelacionCategoriasTecnicas obj)
        {
            try
            {
                var _obj = await _db.categoriasTecnicas.FirstOrDefaultAsync(e => e.Id == obj.Id);
                if (_obj != null)
                {
                    _obj.Estado = obj.Estado;
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
