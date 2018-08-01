using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.CR.Models;
using System.Linq;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ConvenioRepository : IDisposable
    {

        private CR_Context _db;
        public ConvenioRepository()
        {
            _db = new CR_Context();
            // _db.Database.Log = Escribe.Write;
        }
        public async Task<IEnumerable<Convenio>> GetAllByAliado(int id)
        {
            try
            {
                var entities = await _db.Convenio.AsNoTracking()
                    .Include(x => x.TipoConvenio)
                    .Where(x => x.AliadoId == id)
                    .ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Convenio>> GetAll()
        {
            try
            {
                var entities = await _db.Convenio.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetConveniosVigentes()
        {
            try
            {
                DateTime hoy = DateTime.Now;
                var conveniosv = await (from convenio in (from convenioVigente in _db.Convenio.Include(e => e.Aliado.Empresa.TipoOrganizacion)
                                                          where convenioVigente.FechaTermino >= hoy || convenioVigente.Indefinido == true
                                                          select convenioVigente)
                                        group convenio by new { convenio.Aliado.Empresa.TipoOrganizacion } into group1
                                        select new
                                        {
                                            TipoOrganizacion = group1.Key.TipoOrganizacion,
                                            Convenios = from empresaIn in _db.Empresa
                                                        where empresaIn.TipoOrganizacionId == group1.Key.TipoOrganizacion.TipoOrganizacionId
                                                        join aliadoIn in _db.Aliado
                                                        on empresaIn.EmpresaId equals aliadoIn.EmpresaId
                                                        join convenioIn in _db.Convenio
                                                        on aliadoIn.AliadoId equals convenioIn.AliadoId
                                                        where convenioIn.FechaTermino >= hoy || convenioIn.Indefinido == true
                                                        orderby convenioIn.FechaTermino descending
                                                        select new { aliadoId = aliadoIn.AliadoId, nombreEmpresa = empresaIn.NombreEmpresa, fechaTermino = convenioIn.FechaTermino }
                                        }).ToListAsync();



                return conveniosv;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<IEnumerable<Object>> GetConveniosVigentesByEmpresa(int id)
        {
            try
            {
                var convenios = await (from empresa in _db.Empresa
                                       where empresa.EmpresaId == id
                                       join aliado in _db.Aliado on empresa.EmpresaId equals aliado.EmpresaId
                                       join convenio in _db.Convenio on aliado.AliadoId equals convenio.AliadoId
                                       where (convenio.FechaTermino >= DateTime.Today || convenio.Indefinido == true)
                                       select new
                                       {
                                           aliadoId = aliado.AliadoId,
                                           empresaId = empresa.EmpresaId,
                                           convenioId = convenio.ConvenioId,
                                           convenio.ObjetoConvenio,
                                           convenio.NoConvenio,
                                           convenio.FechaInicio,
                                           convenio.FechaTermino
                                       }).AsNoTracking().ToListAsync();

                return convenios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Object>> GetConveniosNoVigentesByEmpresa(int id)
        {
            try
            {
                var convenios = await (from empresa in _db.Empresa
                                       where empresa.EmpresaId == id
                                       join aliado in _db.Aliado on empresa.EmpresaId equals aliado.EmpresaId
                                       join convenio in _db.Convenio on aliado.AliadoId equals convenio.AliadoId
                                       where (convenio.FechaTermino < DateTime.Today)
                                       select new
                                       {
                                           aliadoId = aliado.AliadoId,
                                           empresaId = empresa.EmpresaId,
                                           convenioId = convenio.ConvenioId,
                                           convenio.ObjetoConvenio,
                                           convenio.NoConvenio,
                                           convenio.FechaInicio,
                                           convenio.FechaTermino
                                       }).AsNoTracking().ToListAsync();

                return convenios;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Convenio> Get(int id)
        {
            try
            {
                var entities = await _db.Convenio.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.ConvenioId == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(Convenio model)
        {
            try
            {

                _db.Convenio.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(Convenio model)
        {
            try
            {
                var _model = await _db.Convenio.FirstOrDefaultAsync(e => e.ConvenioId == model.ConvenioId);
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

        public async Task UpdateEstado(Convenio model)
        {
            try
            {
                var _model = await _db.Convenio.FirstOrDefaultAsync(e => e.ConvenioId == model.ConvenioId);
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
                var _model = await _db.Convenio.FirstOrDefaultAsync(e => e.ConvenioId == id);
                if (_model != null)
                {
                    _db.Convenio.Remove(_model);
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

