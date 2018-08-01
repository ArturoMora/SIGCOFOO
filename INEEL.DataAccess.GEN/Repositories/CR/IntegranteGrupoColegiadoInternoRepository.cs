using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Data.Entity;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class IntegranteGrupoColegiadoInternoRepository :IDisposable
    {

        private CR_Context _db;
        public IntegranteGrupoColegiadoInternoRepository()
        {
            _db = new CR_Context();
        }


        public async Task<IEnumerable<IntegranteGrupoColegiadoInterno>> GetAll()
        {
            try
            {
                var entities = await _db.IntegranteGrupoColegiadoInterno.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<IntegranteGrupoColegiadoInterno>> GetAllByGrupo(int id)
        {
            try
            {
                var entities = await _db.IntegranteGrupoColegiadoInterno
                    .Where(e => e.GrupoColegiadoPartIntId == id)
                    .AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IntegranteGrupoColegiadoInterno> Get(int id)
        {
            try
            {
                var entities = await _db.IntegranteGrupoColegiadoInterno
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoInternoId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }





        public async Task<IntegranteGrupoColegiadoInterno> Create(IntegranteGrupoColegiadoInterno model)
        {
            try
            {

                var result = _db.IntegranteGrupoColegiadoInterno.Add(model);
                await _db.SaveChangesAsync();
                return (result);

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        

        public async Task Update(IntegranteGrupoColegiadoInterno model)
        {
            try
            {
                var _model = await _db.IntegranteGrupoColegiadoInterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoInternoId == model.IntegranteGrupoColegiadoInternoId);
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

        public async Task UpdateEstado(IntegranteGrupoColegiadoInterno model)
        {
            try
            {
                var _model = await _db.IntegranteGrupoColegiadoInterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoInternoId == model.IntegranteGrupoColegiadoInternoId);
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
                var _model = await _db.IntegranteGrupoColegiadoInterno.FirstOrDefaultAsync(e => e.IntegranteGrupoColegiadoInternoId == id);
                if (_model != null)
                {
                    _db.IntegranteGrupoColegiadoInterno.Remove(_model);
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
                var _model = await _db.IntegranteGrupoColegiadoInterno.FirstOrDefaultAsync(e => e.GrupoColegiadoPartIntId == id);
                if (_model != null)
                {
                    _db.IntegranteGrupoColegiadoInterno.Remove(_model);
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
