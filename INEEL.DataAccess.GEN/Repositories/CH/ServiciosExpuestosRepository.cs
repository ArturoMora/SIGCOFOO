using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class ServiciosExpuestosRepository : IDisposable
    {
        SIGCOCHContext _Context;
        GEN_Context _ctx;

        public ServiciosExpuestosRepository()
        {
            _Context = new SIGCOCHContext();
            _ctx = new GEN_Context();
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _Context.Dispose();
        }

        //	Consulta de publicaciones en revistas arbitradas y foros
        public async Task<IndicadorPublicaciones> GetTotalPublicaiones(IndicadorPublicaciones publicaciones)
        {
            try
            {
                var numeroRevistasPublicadas = await _Context.Publicacion
                    .Where(e => e.FechaPublicacion >= publicaciones.FInicio
                    && e.FechaPublicacion <= publicaciones.FTermino).AsNoTracking().ToListAsync();
                publicaciones.TotalPublicaciones = numeroRevistasPublicadas.Count;
                return publicaciones;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //	Consulta del total de investigadores del INEEL
        public async Task<IndicadorInvestigadores> GetTotalInvestigadores(IndicadorInvestigadores investigadores)
        {
            try
            {
                List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
                var admin = (from unidad in _ctx.dbSetUnidadOrganizacional
                             where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                        p => p.FechaEfectiva <= investigadores.FTermino
                                                        && p.ClaveUnidad == unidad.ClaveUnidad
                                                        ).Max(e => e.FechaEfectiva)
                             select unidad).AsNoTracking().ToList();

                var clavesFinanzas = (from uni in admin
                                      where uni.ClaveUnidad == "90"
                                             || uni.ClaveUnidad == "70"
                                             || uni.ClaveUnidad == "01"
                                             || uni.padre == "90"
                                             || uni.padre == "70"
                                      select uni.ClaveUnidad);
                var BASE = await (from persona in _ctx.dbSetPersonas.Include("Plaza").Include("Categoria") //Investigadores
                                  where persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                              p => p.FechaEfectiva <= investigadores.FTermino
                                                                              && p.ClavePersona == persona.ClavePersona
                                                                              ).Max(e => e.FechaEfectiva)
                                  && persona.Estado == 1
                                  && persona.TipoPersonalId == ("INV")
                                  && persona.CategoriaId != ("JC025")
                                  && persona.CategoriaId != ("JC020")
                                  select persona).Union(//Mandos medios exceptuando areas financieras y administrativas
                                   from mandomedio in _ctx.dbSetPersonas
                                   where
                                     mandomedio.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                   p => p.FechaEfectiva <= investigadores.FTermino
                                                                   && p.ClavePersona == mandomedio.ClavePersona
                                                                   ).Max(e => e.FechaEfectiva)
                                   && mandomedio.Estado == 1
                                   && mandomedio.TipoPersonalId == "MAN"
                                   && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                                   && !clavesFinanzas.Contains(mandomedio.ClaveUnidad)
                                   select mandomedio).AsNoTracking().ToListAsync();
                investigadores.TotalInvestigadoresINEEL = BASE.Count();

                return investigadores;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //	Consulta del total de investigadores en el SNI.
        public async Task<IndicadorInvesSNI> GetTotalInvestigadoresSNI(IndicadorInvesSNI invesSNI)
        {
            try
            {
                InventarioRHRepository invent = new InventarioRHRepository();
                var result = await invent.GetPersonalSNIDatosInstitucional(new ParametrosConsultas
                { Claveunidad = "01", Fecha = invesSNI.FTermino });
                invesSNI.totalInvestigadoresINEEL_SNI = result.Count();
                return invesSNI;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        //	Consulta del total de investigadores con grado de doctor
        public async Task<IndicadorDoctoresINEEL> GetTotalDoctores(IndicadorDoctoresINEEL doctores)
        {
            try
            {
                InventarioRHRepository invent = new InventarioRHRepository();
                ParametrosConsultas param = new ParametrosConsultas();
                param.Fecha = doctores.FTermino;
                var invest = await invent.CatalogoPersonasFechaEfectiva(param);
                var doc = await invent.InvestigadoresGradoAcademico(invest, param, 3);
                doctores.totalDoctoresINEEL = doc.Count();
                return doctores;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }

    public class ParametrosPublicaciones
    {
        public DateTime FInicio { get; set; }
        public DateTime FTermino { get; set; }
    }

    public class IndicadorPublicaciones : ParametrosPublicaciones
    {
        public int TotalPublicaciones { get; set; }
    }

    public class IndicadorInvestigadores : ParametrosPublicaciones
    {
        public int TotalInvestigadoresINEEL { get; set; }
    }

    public class IndicadorInvesSNI : ParametrosPublicaciones
    {
        public int totalInvestigadoresINEEL_SNI { get; set; }
    }

    public class IndicadorDoctoresINEEL : ParametrosPublicaciones
    {
        public int totalDoctoresINEEL { get; set; }
    }
}
