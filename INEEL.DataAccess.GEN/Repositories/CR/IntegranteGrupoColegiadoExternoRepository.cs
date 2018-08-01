using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class IntegranteGrupoColegiadoExternoRepository : IDisposable
    {

        private CR_Context _db;
        public IntegranteGrupoColegiadoExternoRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<IntegranteGrupoColegiadoExterno>> GetAll()
        {
            try
            {
                var entities = await _db.IntegranteGrupoColegiadoExterno.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IntegranteGrupoColegiadoExterno> Get(int id)
        {
            try
            {
                var entities = await _db.IntegranteGrupoColegiadoExterno
                    .AsNoTracking()
                    .Include("Contacto.Empresa")
                    .FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoExternoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


      

        public async Task<IntegranteGrupoColegiadoExterno> Create(IntegranteGrupoColegiadoExterno model)
        {
            try
            {

                var result = _db.IntegranteGrupoColegiadoExterno.Add(model);
                await _db.SaveChangesAsync();
                return (result);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(IntegranteGrupoColegiadoExterno model)
        {
            try
            {
                var _model = await _db.IntegranteGrupoColegiadoExterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoExternoId == model.IntegranteGrupoColegiadoExternoId);
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

        public async Task UpdateEstado(IntegranteGrupoColegiadoExterno model)
        {
            try
            {
                var _model = await _db.IntegranteGrupoColegiadoExterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoExternoId == model.IntegranteGrupoColegiadoExternoId);
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
                var _model = await _db.IntegranteGrupoColegiadoExterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoExternoId == id);
                if (_model != null)
                {
                    _db.IntegranteGrupoColegiadoExterno.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task DeleteIntegrantesGrupo(int id)
        {
            try
            {
                var _model = await _db.IntegranteGrupoColegiadoExterno.FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == id);
                if (_model != null)
                {
                    _db.IntegranteGrupoColegiadoExterno.Remove(_model);
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
            _db.Dispose();
        }
    }
}

