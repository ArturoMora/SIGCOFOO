using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class AptitudesEmpleadoRepository : IDisposable
    {
        private GEN_Context _db;
        public AptitudesEmpleadoRepository()
        {
            _db = new GEN_Context();
        }

        public async Task<IEnumerable<AptitudesINEELIN>> GetAllByEmpleado(String claveEmpleado, String votante)
        {
            try
            {
                //AptitudesINEELIN
                var sqlQuery = "EXEC GEN.ObtenerAptitudesINEELIN @ClaveEmpleado = '" + claveEmpleado + "', @ClaveVisitante = '" + votante + "';";
                var resultados = await _db.Database.SqlQuery<AptitudesINEELIN>
(sqlQuery).ToListAsync();               

                return resultados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetAllByEmpleado(String claveEmpleado)
        {
            try
            {

                var entities = await _db.bdSetAptitudesEmpleado.AsNoTracking()
                    .Include(x => x.AptitudesCat)
                    .Where(x => x.ClaveEmpleado.Equals(claveEmpleado) && x.Estado == true)
                    .Select(x => new { AptitudesEmpleadoId= x.Id, AptitudesCatId = x.AptitudesCatId, name = x.AptitudesCat.Nombre })
                    .ToListAsync();
                var ListAptitudesCatId = entities.Select(x => x.AptitudesCatId.ToString()).ToList();

                var queryCount = await _db.bdSetLikesLinked.AsNoTracking()
    .Where(x => x.Empleado.Equals(claveEmpleado) && x.Tipo == 1 && ListAptitudesCatId.Contains(x.IdExteno))
   .GroupBy(p => p.IdExteno)
   .Select(g => new { IdExteno = g.Key, count = g.Count() }).ToListAsync();
                List<Object> result = new List<Object>();
                foreach (var x in entities)
                {
                    var count = 0;
                    var c = queryCount.Find(e => e.IdExteno.Equals(x.AptitudesCatId.ToString()));
                    if (c != null)
                    {
                        count = c.count;
                    }
                    result.Add(new { AptitudesEmpleadoId = x.AptitudesEmpleadoId , AptitudesCatId = x.AptitudesCatId, name = x.name, cant = count });
                }


                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<IEnumerable<AptitudesEmpleado>> GetAll()
        {
            try
            {
                var entities = await _db.bdSetAptitudesEmpleado.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<Boolean> ExistByAptitudesCatIde(int aptitudesCatId, String claveEmpleado)
        {
            try
            {
                var entities = await _db.bdSetAptitudesEmpleado.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.AptitudesCatId == aptitudesCatId && e.ClaveEmpleado == claveEmpleado);
                if (entities == null)
                {
                    return false;
                }
                else { return true; }
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<AptitudesEmpleado> Get(long id)
        {
            try
            {
                var entities = await _db.bdSetAptitudesEmpleado.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.Id == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        //se regustran a partir de AptitudesModel
        public async Task<List<long>> CreateValid(AptitudesModel model)
        {
            List<long> agregados = new List<long>();
            try
            {
                var existentes = new List<AptitudesCat>();
                var nuevos = new List<AptitudesCat>();
                List<int> idNews = new List<int>();

                if (model != null && model.Aptitudes != null && model.Aptitudes.Count > 0)
                {
                    existentes = model.Aptitudes.FindAll(x => x.Id > 0);
                    nuevos = model.Aptitudes.FindAll(x => x.Id == 0);
                    var nuevoStr = nuevos.Select(x => x.Nombre.Trim()).ToList();
                    string nuevosIN = String.Join("','", nuevoStr.ToArray());
                    var resultados = await _db.Database.SqlQuery<String>
("SELECT DISTINCT Nombre FROM GEN.cat_Aptitudes where Nombre collate  Latin1_General_CI_AI IN ('" + nuevosIN + "')").ToListAsync();

                    var NuevosValid = nuevoStr.Where(x => !resultados.Contains(x.ToString())).ToList();
                    //---- se guradan nuevos elementos en el catalogo de aptitudes:GEN.cat_Aptitudes
                    foreach (var n in NuevosValid)
                    {
                        try
                        {
                            var idNew = await this.CreateNewCat(new AptitudesCat(n));
                            idNews.Add(idNew);
                        }
                        catch (Exception ex)
                        {
                            _db = new GEN_Context();
                        }
                    }

                    //---- se guradan AptitudesEmpleado de aptitudes existentes
                    foreach (var apt in existentes)
                    {
                        AptitudesEmpleado apE = new AptitudesEmpleado();
                        apE.Estado = true;
                        apE.ClaveEmpleado = model.ClaveEmpleado;
                        apE.AptitudesCatId = apt.Id;
                        try
                        {
                            var id = await this.CreateReturn(apE);
                            agregados.Add(id);
                        }
                        catch (Exception exApE)
                        {
                            _db = new GEN_Context();
                        }
                    }
                    //---- se guradan AptitudesEmpleado de aptitudes nuevas
                    foreach (var id in idNews)
                    {
                        AptitudesEmpleado apE = new AptitudesEmpleado();
                        apE.Estado = true;
                        apE.ClaveEmpleado = model.ClaveEmpleado;
                        apE.AptitudesCatId = id;
                        try
                        {
                            var idBd = await this.CreateReturn(apE);
                            agregados.Add(idBd);
                        }
                        catch (Exception exApE)
                        {
                            _db = new GEN_Context();
                        }
                    }
                }
                return agregados;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        private async Task<int> CreateNewCat(AptitudesCat model)
        {
            _db.bdSetAptitudesCat.Add(model);
            await _db.SaveChangesAsync();
            return model.Id;

        }
        public async Task<long> CreateReturn(AptitudesEmpleado model)
        {
            try
            {

                if (!await this.ExistByAptitudesCatIde(model.AptitudesCatId, model.ClaveEmpleado))
                {
                    _db.bdSetAptitudesEmpleado.Add(model);
                    await _db.SaveChangesAsync();
                    return model.Id;
                }
                else
                {
                    var _model = await _db.bdSetAptitudesEmpleado
                        .FirstOrDefaultAsync(e => e.ClaveEmpleado == model.ClaveEmpleado
                                                && e.AptitudesCatId == model.AptitudesCatId);

                    if (_model != null)
                    {
                        _model.Estado = true;
                        await _db.SaveChangesAsync();
                    }
                    await _db.SaveChangesAsync();
                    return _model.Id;
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task Create(AptitudesEmpleado model)
        {
            try
            {

                _db.bdSetAptitudesEmpleado.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AptitudesEmpleado model)
        {
            try
            {
                var _model = await _db.bdSetAptitudesEmpleado.FirstOrDefaultAsync(e => e.Id == model.Id);
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

        public async Task Delete(long id)
        {
            try
            {
                var _model = await _db.bdSetAptitudesEmpleado.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    _db.bdSetAptitudesEmpleado.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task DeleteFromList(List<long> listaidseliminar)
        {
            try
            {
                foreach (long id in listaidseliminar)
                {
                    var _model = await _db.bdSetAptitudesEmpleado.FirstOrDefaultAsync(e => e.Id == id);
                    if (_model != null)
                    {
                        _model.Estado = false;
                        await Update(_model);
                    }
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
