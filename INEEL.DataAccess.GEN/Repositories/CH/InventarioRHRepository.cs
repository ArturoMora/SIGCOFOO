using INEEL.DataAccess.GEN.Models.GEN.CH.Entities;
using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Contexts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Util;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.CH;
using System.Data.Entity.Core.Objects;

namespace INEEL.DataAccess.GEN.Repositories.CH
{
    public class InventarioRHRepository : IDisposable
    {
        GEN_Context _ctx;
        SIGCOCHContext _ctxch;
        EdadPromedioHistoricoRepository _repo;
        public InventarioRHRepository()
        {
            _repo = new EdadPromedioHistoricoRepository();
            _ctx = new GEN_Context();
            _ctxch = new SIGCOCHContext();
            //_ctx.Database.Log = Escribe.Write;
            _ctxch.Database.Log = Escribe.Write; //Logs para consultas de Tapia
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _ctxch.Dispose();
        }

        /// <summary>
        /// obtiene la lista de investigadores para el 
        /// catalagolo de investigadores 
        /// </summary>
        /// <param name="catinves"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CatInvestigadores>> GetByUnidadOrganizacional(CatInvestigadores catinves)
        {
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            try
            {
                if (!(catinves.Claveunidad == null || catinves.Claveunidad == string.Empty))
                {
                    //Obtener a lista de perosnas por clave de unidad
                    var admin = await (from unidad in _ctx.dbSetUnidadOrganizacional
                                       where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                                  p => p.FechaEfectiva <= catinves.Fecha
                                                                  && p.ClaveUnidad == unidad.ClaveUnidad
                                                                  ).Max(e => e.FechaEfectiva)
                                       select unidad).AsNoTracking().ToListAsync();
                    var clavesFinanzas = (from uni in admin
                                          where uni.ClaveUnidad == "90"
                                                 || uni.ClaveUnidad == "70"
                                                 || uni.ClaveUnidad == "01"
                                                 || uni.padre == "90"
                                                 || uni.padre == "70"
                                          select uni.ClaveUnidad).ToList();
                    var asistentes = await (from asistente in _ctxch.Asistente
                                            where asistente.FechaEfectiva == _ctxch.Asistente.Where(
                                                                        p => p.FechaEfectiva <= catinves.Fecha
                                                                         && p.ClaveUnidad == catinves.Claveunidad
                                                                        ).Max(e => e.FechaEfectiva)
                                            //&& asistente.Estado == 1
                                            && asistente.ClaveUnidad == catinves.Claveunidad
                                            select asistente).AsNoTracking().FirstOrDefaultAsync();
                    if (asistentes == null)
                        asistentes = new Asistente();

                    var invest2 = await (from persona in _ctx.dbSetPersonas //Investigadores
                                         where persona.ClaveUnidad == catinves.Claveunidad
                                                         && persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                                     p => p.FechaEfectiva <= catinves.Fecha
                                                                                     && p.ClavePersona == persona.ClavePersona
                                                                                     ).Max(e => e.FechaEfectiva)
                                         && persona.Estado == 1
                                         && persona.TipoPersonalId == ("INV")
                                         && persona.CategoriaId != ("JC025")
                                         && persona.CategoriaId != ("JC020")
                                         select persona).Union(//Mandos medios exceptuando areas financieras y administrativas
                                        from mandomedio in _ctx.dbSetPersonas
                                        where mandomedio.ClaveUnidad == catinves.Claveunidad
                                         && mandomedio.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                        p => p.FechaEfectiva <= catinves.Fecha
                                                                        && p.ClavePersona == mandomedio.ClavePersona
                                                                        ).Max(e => e.FechaEfectiva)
                                        && mandomedio.Estado == 1
                                        && mandomedio.TipoPersonalId == "MAN"
                                        && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                                        && !clavesFinanzas.Contains(mandomedio.ClaveUnidad)
                                        select mandomedio
                                        ).Union( //Asistentes
                                                from asistente in _ctx.dbSetPersonas
                                                where asistente.ClaveUnidad == catinves.Claveunidad
                                                && asistente.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                               p => p.FechaEfectiva <= catinves.Fecha
                                                                               && p.ClavePersona == asistente.ClavePersona
                                                                               ).Max(e => e.FechaEfectiva)
                                               && asistente.Estado == 1
                                               && asistente.ClavePersona == asistentes.ClavePersona
                                                select asistente
                                        )
                                        .AsNoTracking()
                                        .ToListAsync();

                    if (invest2 != null)
                    {
                        foreach (var persona in invest2)
                        {
                            persona.Puesto = "C";
                            if (persona.ClavePersona == asistentes.ClavePersona)
                            {
                                persona.Clasificacion = "@";
                                persona.Puesto = "Asistente";
                            }
                            else if (persona.TipoPersonalId == "MAN")
                            {
                                persona.Clasificacion = persona.CategoriaId == "JC010" ? "***" : "**";
                                persona.Puesto = "A";
                            }
                            var formacion = new List<FormacionAcademica>();
                            var sni = new SNI();
                            var idiomas = new List<Idiomas>();
                            var becaexterna = new BecarioExternoINEEL();
                            var becainterna = new BecarioInterno();
                            var becaAIT = new BecarioExternoINEEL();
                            string becas = "";
                            var nivel = await (from cat in _ctx.dbSetCategoria
                                               where cat.CategoriaId == persona.CategoriaId
                                               select cat.NivelInvestigador).FirstOrDefaultAsync();

                            formacion = await (from f in _ctxch.FormacionAcademica
                                               where f.ClavePersona == persona.ClavePersona && f.EstadoFlujoId == 3
                                               select f)
                                               .Include(e => e.GradoAcademico)
                                            .Include(e => e.Carrera)
                                            .Include(e => e.Institucion.Pais)
                                            .OrderByDescending(e => e.GradoAcademicoId)
                                            .AsNoTracking()
                                            .ToListAsync();
                            idiomas = await (from idioma in _ctxch.Idiomas
                                             where idioma.ClavePersona == persona.ClavePersona && idioma.EstadoFlujoId == 3
                                             select idioma)
                                             .Include(e => e.Idioma)
                                             .AsNoTracking()
                                             .ToListAsync();
                            sni = await (from s in _ctxch.SNI
                                         where s.ClavePersona == persona.ClavePersona
                                         && s.EstadoFlujoId == 3
                                         && s.fechaValidacion <= catinves.Fecha
                                         orderby s.fechaValidacion descending
                                         select s)
                                         .Include(e => e.NivelSNI)
                                         .AsNoTracking()
                                         .FirstOrDefaultAsync();
                            becaexterna = await (from becaext in _ctxch.BecarioExternoINEEL
                                                 where becaext.FechaValidacion <= catinves.Fecha
                                                 && becaext.EstadoFlujoId == 3
                                                 && becaext.TipoBecaId != 4
                                                 && becaext.ClavePersona == persona.ClavePersona
                                                 select becaext)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync();
                            becaAIT = await (from becaext in _ctxch.BecarioExternoINEEL
                                             where becaext.FechaValidacion <= catinves.Fecha
                                             && becaext.EstadoFlujoId == 3
                                             && becaext.TipoBecaId == 4
                                             && becaext.ClavePersona == persona.ClavePersona
                                             select becaext)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync();
                            becainterna = await (from becaint in _ctxch.BecarioInterno
                                                 where becaint.FechaValidacion <= catinves.Fecha
                                                 && becaint.EstadoFlujoId == 3
                                                 && becaint.ClavePersona == persona.ClavePersona
                                                 select becaint)
                                            .AsNoTracking()
                                            .FirstOrDefaultAsync();

                            becas = becaexterna != null ? "EXT" : "";
                            if (becaAIT != null)
                            {
                                becas += becas != "" ? "/ AIT" : " AIT ";
                            }
                            if (becainterna != null)
                            {
                                becas += becas != "" ? "/ INT" : "INT";
                            }

                            catInvestigadores.Add(new CatInvestigadores
                            {
                                Fecha = catinves.Fecha,
                                Persona = persona,
                                Formacion = formacion,
                                Idiomas = idiomas,
                                Becas = becas,
                                sni = sni,
                                Nivel = nivel != null ? nivel.ToString() : ""
                            }
                            );


                        }

                    }

                }
                else
                {
                    catInvestigadores = new List<CatInvestigadores>();
                }
                return catInvestigadores
                    .OrderBy(e => e.Persona.Puesto)
                    .ThenByDescending(e => e.Nivel);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Grafica> GetInvestigadoresHome()
        {
            try
            {
                DateTime fechahoy = DateTime.Now;
                ParametrosConsultas param = new ParametrosConsultas();
                param.Fecha = fechahoy;
                List<DateTime> fechasaconsultar = new List<DateTime>();
                Grafica valoresgrafica = new Grafica();
                List<string> licenciatura = new List<string>();
                List<string> maestria = new List<string>();
                List<string> doctorado = new List<string>();

                //se necesita mostrar la informacion de los ultimos 4 años por eso se emplea el valor directo

                for (int i = 3; i > 0; i--)
                {
                    DateTime fechaagregar = Convert.ToDateTime("31/12/" + fechahoy.AddYears(-i).Year).AddHours(23);
                    fechasaconsultar.Add(fechaagregar);
                }
                fechasaconsultar.Add(fechahoy);

                foreach (var fecha in fechasaconsultar)
                {
                    param.Fecha = fecha;
                    var invest = await CatalogoPersonasFechaEfectiva(param);
                    var lic = await InvestigadoresGradoAcademico(invest, param, 1);
                    licenciatura.Add(lic.Count.ToString());
                    var mae = await InvestigadoresGradoAcademico(invest, param, 2);
                    maestria.Add(mae.Count.ToString());
                    var doc = await InvestigadoresGradoAcademico(invest, param, 3);
                    doctorado.Add(doc.Count.ToString());
                }
                valoresgrafica.Datos.Add(licenciatura);
                valoresgrafica.Datos.Add(maestria);
                valoresgrafica.Datos.Add(doctorado);
                valoresgrafica.Series = new List<string> { "Licenciatura", "Maestría", "Doctorado" };
                valoresgrafica.Etiquetas.AddRange(fechasaconsultar.Select(e => e.Year.ToString()).ToList());

                return valoresgrafica;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<InvestigadoresHome> GetInvestigadoresCache()
        {
            try
            {
                DateTime fechahoy = DateTime.Now;
                var date = fechahoy.ToShortDateString();
                var result = await _ctxch.dbSetInvestigadoresHome.AsNoTracking()
                     .OrderByDescending(e => e.Fecha)
                     .Take(1).ToListAsync();
                if (result != null && result.Count > 0)
                {
                    if (result[0].Fecha.ToShortDateString().Equals(date))
                    {
                        return result[0];
                    }
                }

                return null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task CreateInvestigadoresHome(InvestigadoresHome model)
        {
            try
            {

                _ctxch.dbSetInvestigadoresHome.Add(model);
                await _ctxch.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        int TotalNivel1 = 0; int TotalNivel2 = 0; int TotalNivel3 = 0; int TotalNivel4 = 0;
        int TotalSNICan = 0; int TotalSNIInv = 0;

        public async Task<Object> Getinvestigadoresgerencia(string id)
        {
            try
            {
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                ParametrosConsultas para = new ParametrosConsultas();
                para.Fecha = Convert.ToDateTime(id);
                //para.Claveunidad = "01";
                //////////////////Busqueda de Unidades Organizacionales
                List<UnidadOrganizacional> Unidades = await _ctx.dbSetUnidadOrganizacional
                   .Where(x => x.FechaEfectiva == _ctx.dbSetUnidadOrganizacional
                                                .Where(f => f.FechaEfectiva <= para.Fecha
                                                      && f.ClaveUnidad == x.ClaveUnidad)
                                                .Max(f => f.FechaEfectiva)).AsNoTracking().ToListAsync();
                /////////////////////////////////////////////////////////
                //Lista de claves de las Gerencia de la División p.e. Div. Tecno habilitadoras, con número 20
                List<String> unidadesDivisionID = new List<string>(Unidades.Where(x => x.tipoO == 2 || x.tipoO == 1).Select(x => x.ClaveUnidad));
                //Lista de objetos tipo UnidadOrganizacional de las Gerencia de la División p.e. Div. Tecno habilitadoras, con número 20
                List<UnidadOrganizacional> UnidadesDivision = new List<UnidadOrganizacional>(Unidades.Where(x => x.tipoO == 2 || x.tipoO == 1 && x.Estado == 1));
                //Lista de objetos tipo UnidadOrganizacional de las Gerencias que pertenecen a una División p.e. Gerencia de tecnologías de Info. con número 54
                List<UnidadOrganizacional> UnidadesGerenciales = new List<UnidadOrganizacional>(Unidades.Where(x => x.tipoO == 3 && x.Estado == 1));

                /////////////////Buscar las personas por cada unidad
                List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
                List<String> unidadesID = new List<string>(Unidades.Select(x => x.ClaveUnidad));
                var fullIndividuos = await CatalogoPersonasFechaEfectivaReportesUnidadList(Convert.ToDateTime(id), unidadesID);
                foreach (var item in Unidades)
                {
                    var investigadoresUnidad = fullIndividuos.FindAll(x => x.ClaveUnidad == item.ClaveUnidad);
                    List<String> clavesInvestigadoresUnidad = new List<string>(investigadoresUnidad.Select(x => x.ClavePersona));

                    //OBTENER EL MAX DE FORMACION ACADÉMICA DE CADA EMPLEADO (ORDENADO POR GRADO ACADÉMICO 1=LIC,2=MAE,3=DOC), EXCLUYENDO DATOS DE FORMACIONES ACADÉMICAS 4 Y 5)
                    var formaciones = await _ctxch.FormacionAcademica
                    .Where(x => x.EstadoFlujoId == 3 && clavesInvestigadoresUnidad.Contains(x.ClavePersona) && x.FechaValidacion <= para.Fecha && x.EstaTitulado == true && (x.GradoAcademicoId == 1 || x.GradoAcademicoId == 2 || x.GradoAcademicoId == 3))
                    .OrderByDescending(x => x.GradoAcademicoId)
                    .AsNoTracking().ToListAsync();


                    var sniFull = await _ctxch.SNI
                         .Where(x => x.EstadoFlujoId == 3 && clavesInvestigadoresUnidad.Contains(x.ClavePersona) && (x.fechaTerminoNombramiento >= para.Fecha && x.fechaInicioNombramiento <= para.Fecha))
                         .OrderByDescending(x => x.fechaValidacion)
                         .AsNoTracking().ToListAsync();

                    foreach (var persona in investigadoresUnidad)
                    {
                        var formacion = formaciones.Find(x => x.ClavePersona == persona.ClavePersona);
                        var sni = sniFull.Find(x => x.ClavePersona == persona.ClavePersona);
                        persona.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == persona.ClaveUnidad);
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona,
                            FormacionRepo = formacion,
                            sni = sni
                        }
                            );
                    }
                }
                ////////////////////////////////////////////////////
                /////////////Organizar 
                List<object> resultadoInvestigadoresGerencia = new List<object>();

                var catInvestigadores2 = catInvestigadores.ToList();

                //DEFINICION DE LISTA DE ACUMULADORES PARA TOTALES DEL INEEL
                int TOTALINEEIL = 0;
                int TOTALLICINEEL = 0; int TOTALMAEINEEL = 0; int TOTALDOCINEEL = 0;
                int TOTALNIVEL1INEEL = 0; int TOTALNIVEL2INEEL = 0; int TOTALNIVEL3INEEL = 0; int TOTALNIVEL4INEEL = 0;
                int TOTALCANINEEL = 0; int TOTALINVINEEL = 0;

                int totalDivisiones = 0;
                int contadorDivision = 0;
                totalDivisiones = UnidadesDivision.Count();

                foreach (var unidadDiv in UnidadesDivision)
                {
                    contadorDivision++;

                    var item = catInvestigadores2
                   .Where(x => x.Persona.UnidadOrganizacional.ClaveUnidad.Equals(unidadDiv.ClaveUnidad))
                   .ToList();

                    List<object> gerenciasDivicioon = new List<object>();
                    //DEFINICION DE LISTA DE ACUMULADORES DIVISIONALES
                    int TotalLicDiv = 0; int TotalMaeDiv = 0; int TotalDocDiv = 0;
                    int TotalNivel1Div = 0; int TotalNivel2Div = 0; int TotalNivel3Div = 0; int TotalNivel4Div = 0;
                    int TotalCandDiv = 0; int TotalInvDiv = 0;

                    int lic = item.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 1).Count();
                    int mae = item.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 2).Count();
                    int doc = item.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 3).Count();
                    int total = 0;
                    int nivel1Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("I")).Count();
                    int nivel2Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("II")).Count();
                    int nivel3Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("III")).Count();
                    int nivel4Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("IV")).Count();
                    int invG = item.Where(x => x.sni != null && (x.sni.NivelSNIId == 2 || x.sni.NivelSNIId == 3 || x.sni.NivelSNIId == 4)).Count();
                    int candG = item.Where(x => x.sni != null && x.sni.NivelSNIId == 1).Count();
                    total += item.Count();
                    TOTALINEEIL += item.Count();
                    TotalLicDiv += lic;
                    TotalMaeDiv += mae;
                    TotalDocDiv += doc;
                    TOTALLICINEEL += lic;
                    TOTALMAEINEEL += mae;
                    TOTALDOCINEEL += doc;
                    TotalNivel1Div += nivel1Gere;
                    TotalNivel2Div += nivel2Gere;
                    TotalNivel3Div += nivel3Gere;
                    TotalNivel4Div += nivel4Gere;
                    TotalCandDiv += candG;
                    TotalInvDiv += invG;
                    TOTALNIVEL1INEEL += nivel1Gere;
                    TOTALNIVEL2INEEL += nivel2Gere;
                    TOTALNIVEL3INEEL += nivel3Gere;
                    TOTALNIVEL4INEEL += nivel4Gere;
                    TOTALCANINEEL += candG;
                    TOTALINVINEEL += invG;
                    //////////////////////////////////////////////
                    var gerenciaGrupoDivicion = new
                    {
                        gerenciaNombre = unidadDiv.NombreUnidad,
                        numInv = item.Count(),
                        licenciados = lic,
                        maestros = mae,
                        doctores = doc,
                        nivel1 = nivel1Gere,
                        nivel2 = nivel2Gere,
                        nivel3 = nivel3Gere,
                        nivel4 = nivel4Gere,
                        cand = candG,
                        inv = invG
                    };
                    //agregar si null no agregar, casos DEA y DPGEyC
                    gerenciasDivicioon.Add(gerenciaGrupoDivicion);
                    ///////por gerencias
                    //Listado de gerencias que coincidan con la clave de la división
                    var gerenciasDivision = UnidadesGerenciales.Where(x => x.padre.Equals(unidadDiv.ClaveUnidad) && x.tipoO == 3).ToList();

                    if (gerenciasDivision.Count > 0)
                    {
                        foreach (var gerencia in gerenciasDivision)
                        {

                            var grupo = catInvestigadores2
                            .Where(x => x.Persona.UnidadOrganizacional.ClaveUnidad.Equals(gerencia.ClaveUnidad))
                            .ToList();

                            total += grupo.Count();
                            TOTALINEEIL += grupo.Count();

                            int licgrupo = grupo.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 1).Count();
                            int maegrupo = grupo.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 2).Count();
                            int docgrupo = grupo.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 3).Count();
                            TOTALLICINEEL += licgrupo;
                            TOTALMAEINEEL += maegrupo;
                            TOTALDOCINEEL += docgrupo;
                            int nivel1 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("I")).Count();
                            int nivel2 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("II")).Count();
                            int nivel3 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("III")).Count();
                            int nivel4 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("IV")).Count();
                            int inv = grupo.Where(x => x.sni != null && (x.sni.NivelSNIId == 2 || x.sni.NivelSNIId == 3 || x.sni.NivelSNIId == 4)).Count();
                            int cand = grupo.Where(x => x.sni != null && x.sni.NivelSNIId == 1).Count();
                            TOTALNIVEL1INEEL += nivel1;
                            TOTALNIVEL2INEEL += nivel2;
                            TOTALNIVEL3INEEL += nivel3;
                            TOTALNIVEL4INEEL += nivel4;
                            TOTALCANINEEL += cand;
                            TOTALINVINEEL += inv;
                            TotalLicDiv += licgrupo;
                            TotalMaeDiv += maegrupo;
                            TotalDocDiv += docgrupo;
                            TotalNivel1Div += nivel1;
                            TotalNivel2Div += nivel2;
                            TotalNivel3Div += nivel3;
                            TotalNivel4Div += nivel4;
                            TotalCandDiv += cand;
                            TotalInvDiv += inv;
                            var gerenciaGrupo = new
                            {
                                gerenciaNombre = gerencia.NombreUnidad,
                                numInv = grupo.Count(),
                                licenciados = licgrupo,
                                maestros = maegrupo,
                                doctores = docgrupo,
                                nivel1 = nivel1,
                                nivel2 = nivel2,
                                nivel3 = nivel3,
                                nivel4 = nivel4,
                                cand = cand,
                                inv = inv
                            };
                            gerenciasDivicioon.Add(gerenciaGrupo);
                            ///////////////////////////////////////////////////////////
                        }
                    }

                    ////////////////////Totales
                    var gerenciaGrupoDivicionTotalvACIO = new
                    {
                        gerenciaNombre = "----------",
                        numInv = "----",
                        licenciados = "----",
                        maestros = "----",
                        doctores = "----",
                        nivel1 = "----",
                        nivel2 = "----",
                        nivel3 = "----",
                        nivel4 = "----",
                        cand = "----",
                        inv = "----"
                    };
                    gerenciasDivicioon.Add(gerenciaGrupoDivicionTotalvACIO);
                    var gerenciaGrupoDivicionTotal = new
                    {
                        gerenciaNombre = "TOTAL DE LA DIVISIÓN",
                        numInv = total,
                        licenciados = TotalLicDiv,
                        maestros = TotalMaeDiv,
                        doctores = TotalDocDiv,
                        nivel1 = TotalNivel1Div,
                        nivel2 = TotalNivel2Div,
                        nivel3 = TotalNivel3Div,
                        nivel4 = TotalNivel4Div,
                        cand = TotalCandDiv,
                        inv = TotalInvDiv
                    };
                    gerenciasDivicioon.Add(gerenciaGrupoDivicionTotal);
                    ///////////////////////////

                    if (contadorDivision == totalDivisiones)
                    {
                        //TOTAL DE TOTALES
                        var totalTotales = new
                        {
                            gerenciaNombre = "TOTAL INEEL",
                            numInv = TOTALINEEIL,
                            licenciados = TOTALLICINEEL,
                            maestros = TOTALMAEINEEL,
                            doctores = TOTALDOCINEEL,
                            nivel1 = TOTALNIVEL1INEEL,
                            nivel2 = TOTALNIVEL2INEEL,
                            nivel3 = TOTALNIVEL3INEEL,
                            nivel4 = TOTALNIVEL4INEEL,
                            cand = TOTALCANINEEL,
                            inv = TOTALINVINEEL
                        };
                        gerenciasDivicioon.Add(totalTotales);
                    }


                    var ObjetoResultado = new
                    {
                        divicion = unidadDiv.NombreUnidad,
                        total = total,
                        gerencias = gerenciasDivicioon
                    };
                    resultadoInvestigadoresGerencia.Add(ObjetoResultado);

                }

                return resultadoInvestigadoresGerencia;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> Getinvestigadoresdisciplina(string id)
        {
            try
            {
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                ParametrosConsultas para = new ParametrosConsultas();
                para.Fecha = Convert.ToDateTime(id);
                List<object> Resultado = new List<object>();
                List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
                //List<Campo> Campos = await _ctxch.Campo
                //    .Where(x => x.FechaEfectiva == _ctxch.Campo
                //                                .Where(f => f.FechaEfectiva <= para.Fecha)
                //                                .Max(f => f.FechaEfectiva)).AsNoTracking().ToListAsync();
                List<Campo> Campos = await _ctxch.Campo.Where(x => x.FechaEfectiva <= para.Fecha).AsNoTracking().ToListAsync();
                List<int> CamposId = new List<int>(Campos.Select(x => x.CampoId));

                List<Disciplina> Disciplinas = await _ctxch.Disciplina
                    .Where(x => CamposId.Contains(x.CampoId) &&
                     x.FechaEfectiva <= para.Fecha).AsNoTracking().ToListAsync();
                List<int> DisciplinasId = new List<int>(Disciplinas.Select(x => x.DisciplinaId));

                List<Carrera> Carreras = await _ctxch.Carrera
                    .Where(x => DisciplinasId.Contains(x.DisciplinaId) &&
                     x.FechaEfectiva <= para.Fecha).AsNoTracking().ToListAsync();
                List<int> CarreraId = new List<int>(Carreras.Select(x => x.CarreraId));

                var fullIndividuos = await CatalogoPersonasFechaEfectivaReportes(para);
                List<string> claves = new List<string>(fullIndividuos.Select(x => x.ClavePersona));

                var formaciones = await _ctxch.FormacionAcademica
                         .Where(x => x.EstadoFlujoId == 3 && claves.Contains(x.ClavePersona) && x.FechaValidacion <= para.Fecha && x.EstaTitulado == true && (x.GradoAcademicoId == 1 || x.GradoAcademicoId == 2 || x.GradoAcademicoId == 3))
                         .OrderByDescending(x => x.GradoAcademicoId)
                         .AsNoTracking().ToListAsync();

                foreach (var persona in fullIndividuos)
                {
                    var formacion = formaciones.Find(x => x.ClavePersona == persona.ClavePersona);
                    catInvestigadores.Add(new CatInvestigadores
                    {
                        Persona = persona,
                        FormacionRepo = formacion
                    }
                        );
                }
                foreach (var Campo in Campos)
                {
                    var disciplinasCampo = Disciplinas.Where(x => x.CampoId == Campo.CampoId).ToList();
                    int inv = 0;
                    foreach (var disciplina in disciplinasCampo)
                    {
                        var carreras = Carreras.Where(x => x.DisciplinaId == disciplina.DisciplinaId).ToList();
                        List<int> carrerasIdDisciplina = new List<int>(carreras.Select(x => x.CarreraId));
                        int cantidad = catInvestigadores.Where(x => x.FormacionRepo != null && carrerasIdDisciplina.Contains(x.FormacionRepo.CarreraId)).Count();
                        inv += cantidad;
                        var objeto = new
                        {
                            nombre = disciplina.Descripcion,
                            total = cantidad
                        };
                        Resultado.Add(objeto);
                    }

                    var objetoDisciplina = new
                    {
                        nombre = "DISCIPLINA: " + Campo.Descripcion,
                        total = "TOTAL DISCIPLINA " + inv
                    };
                    Resultado.Add(objetoDisciplina);
                    var vacio = new
                    {
                        nombre = ".",
                        total = ""
                    };
                    Resultado.Add(vacio);
                }
                int opc = catInvestigadores.Where(x => x.FormacionRepo == null).Count();
                if (opc != 0)
                {
                    var nulos = new
                    {
                        nombre = "Sin clasificar",
                        total = opc
                    };
                    Resultado.Add(nulos);
                    var vacionulls = new
                    {
                        nombre = ".",
                        total = ""
                    };
                    Resultado.Add(vacionulls);
                }
                var total = new
                {
                    nombre = "TOTAL INEEL",
                    total = fullIndividuos.Count()
                };
                Resultado.Add(total);
                return Resultado;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> Getcomposicionespescialidades(string id)
        {
            try
            {
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                ParametrosConsultas para = new ParametrosConsultas();
                para.Fecha = Convert.ToDateTime(id);
                List<object> Resultado = new List<object>();
                List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
                List<Campo> Campos = await _ctxch.Campo
                    .Where(x => x.FechaEfectiva == _ctxch.Campo
                                                .Where(f => f.CampoId == x.CampoId && f.FechaEfectiva <= para.Fecha)
                                                .Max(f => f.FechaEfectiva)).AsNoTracking().ToListAsync();
                List<int> CamposId = new List<int>(Campos.Select(x => x.CampoId));

                List<Disciplina> Disciplinas = await _ctxch.Disciplina
                    .Where(x => CamposId.Contains(x.CampoId) &&
                     x.FechaEfectiva <= para.Fecha).AsNoTracking().ToListAsync();
                List<int> DisciplinasId = new List<int>(Disciplinas.Select(x => x.DisciplinaId));

                List<Carrera> Carreras = await _ctxch.Carrera
                    .Where(x => DisciplinasId.Contains(x.DisciplinaId) &&
                     x.FechaEfectiva <= para.Fecha).AsNoTracking().ToListAsync();
                List<int> CarreraId = new List<int>(Carreras.Select(x => x.CarreraId));

                var fullIndividuos = await CatalogoPersonasFechaEfectivaReportes(para);
                List<string> personas = new List<string>(fullIndividuos.Select(x => x.ClavePersona));

                //OBTENER EL MAX DE FORMACION ACADÉMICA DE CADA EMPLEADO(ORDENADO POR GRADO ACADÉMICO 1 = LIC, 2 = MAE, 3 = DOC), EXCLUYENDO DATOS DE FORMACIONES ACADÉMICAS 4 Y 5)
                var formaciones = await _ctxch.FormacionAcademica
                .Where(x => x.EstadoFlujoId == 3 && personas.Contains(x.ClavePersona) && x.FechaValidacion <= para.Fecha && x.EstaTitulado == true && (x.GradoAcademicoId == 1 || x.GradoAcademicoId == 2 || x.GradoAcademicoId == 3))
                .OrderByDescending(x => x.GradoAcademicoId)
                .AsNoTracking().ToListAsync();

                var sniFull = await _ctxch.SNI
                         .Where(x => x.EstadoFlujoId == 3 && personas.Contains(x.ClavePersona) && (x.fechaTerminoNombramiento >= para.Fecha && x.fechaInicioNombramiento <= para.Fecha))
                         .OrderByDescending(x => x.fechaValidacion)
                         .AsNoTracking().ToListAsync();

                foreach (var persona in fullIndividuos)
                {
                    var formacion = formaciones.Find(x => x.ClavePersona == persona.ClavePersona);
                    var sni = sniFull.Find(x => x.ClavePersona == persona.ClavePersona);
                    catInvestigadores.Add(new CatInvestigadores
                    {
                        Persona = persona,
                        FormacionRepo = formacion,
                        Fecha = para.Fecha,
                        sni = sni
                    }
                        );
                }
                int count = 0;
                decimal promexpINEEL = 0;
                int TMAEINNEL = 0; int TDOCINNEL = 0;
                int TCandINNEL = 0; int TInvINNEL = 0; int TotalLic=0;
                int TN1INNEL = 0; int TN2INNEL = 0; int TN3INNEL = 0; int TN4INNEL = 0;
                foreach (var Campo in Campos)
                {
                    var disciplinasCampo = Disciplinas.Where(x => x.CampoId == Campo.CampoId).ToList();
                    int inv = 0;

                    decimal promExp = 0;
                    int TMAE = 0; int TDOC = 0; 
                    int TCand = 0; int TInv = 0; int TLIC=0;
                    int TN1 = 0; int TN2 = 0; int TN3 = 0; int TN4 = 0;
                    foreach (var disciplina in disciplinasCampo)
                    {
                        var carreras = Carreras.Where(x => x.DisciplinaId == disciplina.DisciplinaId).ToList();
                        List<int> carrerasIdDisciplina = new List<int>(carreras.Select(x => x.CarreraId));
                        int cantidad = catInvestigadores.Where(x => x.FormacionRepo != null && carrerasIdDisciplina.Contains(x.FormacionRepo.CarreraId)).Count();
                        var personal = catInvestigadores.Where(x => x.FormacionRepo != null && carrerasIdDisciplina.Contains(x.FormacionRepo.CarreraId)).ToList();
                        decimal experiencia = personal.Sum(x => x.Experiencia);
                        decimal experienciapromedio = 0;
                        if (cantidad != 0)
                        {
                            experienciapromedio = experiencia / cantidad;
                            experienciapromedio = Math.Round(experienciapromedio, 2);
                        }
                        int doc = personal.Where(x => x.FormacionRepo.GradoAcademicoId == 3).Count();
                        int mae = personal.Where(x => x.FormacionRepo.GradoAcademicoId == 2).Count();
                        int lic = personal.Where(x => x.FormacionRepo.GradoAcademicoId == 1).Count();
                        int inves = personal.Where(x => x.sni != null && (x.sni.NivelSNIId == 2 || x.sni.NivelSNIId == 3 || x.sni.NivelSNIId == 4)).Count();
                        int cand = personal.Where(x => x.sni != null && x.sni.NivelSNIId == 1).Count();
                        int nivel1 = personal.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("I")).Count();
                        int nivel2 = personal.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("II")).Count();
                        int nivel3 = personal.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("III")).Count();
                        int nivel4 = personal.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("IV")).Count();
                        TN1 += nivel1;
                        TN2 += nivel2;
                        TN3 += nivel3;
                        TN4 += nivel4;
                        TCand += cand;
                        TInv += inves;
                        TLIC += lic;
                        TMAE += mae;
                        TDOC += doc;
                        inv += cantidad;
                        promExp += experienciapromedio;
                        var objeto = new
                        {
                            nombre = disciplina.Descripcion,
                            espacio = "",
                            total = cantidad,
                            exp = experienciapromedio,
                            doc = doc,
                            mae = mae,
                            lic= lic,
                            can = cand,
                            inv = inves,
                            i = nivel1,
                            ii = nivel2,
                            iii = nivel3,
                            iv = nivel4
                        };
                        Resultado.Add(objeto);
                    }
                    decimal promExperiencia;
                    if (disciplinasCampo.Count() == 0)
                    {
                        promExperiencia = promExp;
                    }
                    else
                    {
                        promExperiencia = promExp / disciplinasCampo.Count();
                    }

                    promExperiencia = Math.Round(promExperiencia, 2);
                    promexpINEEL += promExperiencia;
                    count++;

                    TDOCINNEL += TDOC;
                    TMAEINNEL += TMAE;
                    TotalLic +=TLIC;
                    TCandINNEL += TCand;
                    TInvINNEL += TInv;
                    TN1INNEL += TN1;
                    TN2INNEL += TN2;
                    TN3INNEL += TN3;
                    TN4INNEL += TN4;
                    var objetoDisciplina = new
                    {
                        nombre = "DISCIPLINA: " + Campo.Descripcion,
                        espacio = "TOTAL DISCIPLINA",
                        total = inv,
                        exp = promExperiencia,
                        doc = TDOC,
                        mae = TMAE,
                        lic= TLIC,
                        can = TCand,
                        inv = TInv,
                        i = TN1,
                        ii = TN2,
                        iii = TN3,
                        iv = TN4
                    };
                    Resultado.Add(objetoDisciplina);
                    var vacio = new
                    {
                        nombre = ".",
                        espacio = "",
                        total = "",
                        exp = "",
                        doc = "",
                        mae = "",
                        can = "",
                        inv = ""
                    };
                    Resultado.Add(vacio);
                }
                int opc = catInvestigadores.Where(x => x.FormacionRepo == null).Count();
                if (opc != 0)
                {
                    var nulos = new
                    {
                        nombre = "Sin clasificar",
                        espacio = "",
                        total = opc
                    };
                    Resultado.Add(nulos);
                    var vacionulls = new
                    {
                        nombre = ".",
                        espacio = "",
                        total = ""
                    };
                    Resultado.Add(vacionulls);
                }
                decimal TExpINEEL = promexpINEEL / count;
                TExpINEEL = Math.Round(TExpINEEL, 2);
                var total = new
                {
                    nombre = "",
                    espacio = "TOTAL INEEL",
                    total = fullIndividuos.Count(),
                    exp = TExpINEEL,
                    doc = TDOCINNEL,
                    mae = TMAEINNEL,
                    lic=TotalLic,
                    can = TCandINNEL,
                    inv = TInvINNEL,
                    i = TN1INNEL,
                    ii = TN2INNEL,
                    iii = TN3INNEL,
                    iv = TN4INNEL
                };
                Resultado.Add(total);
                return Resultado;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<object> NivelSNIMethod(ParametrosConsultas para)
        {
            try
            {
                var personas = await investigadores(para);
                ////validar rangos
                var niveles = personas.Where(x => x.Persona.Categoria.NivelInvestigador != null)
                    .GroupBy(x => x.Persona.Categoria.NivelInvestigador)
                         .Select(grupo => new
                         {
                             nivel = grupo.Select(i => i.Persona.Categoria.NivelInvestigador).FirstOrDefault(),
                             cantidad = grupo.Count()
                         });

                int nivel1 = 0; int nivel2 = 0; int nivel3 = 0; int nivel4 = 0;
                foreach (var item in niveles)
                {
                    if (item.nivel.Equals("I")) { nivel1 = item.cantidad; };
                    if (item.nivel.Equals("II")) { nivel2 = item.cantidad; };
                    if (item.nivel.Equals("III")) { nivel3 = item.cantidad; };
                    if (item.nivel.Equals("IV")) { nivel4 = item.cantidad; };
                }

                TotalNivel1 += nivel1;
                TotalNivel2 += nivel2;
                TotalNivel3 += nivel3;
                TotalNivel4 += nivel4;
                var nivelUnidad = new
                {
                    nivel1 = nivel1,
                    nivel2 = nivel2,
                    nivel3 = nivel3,
                    nivel4 = nivel4
                };

                var personalsni = await investigadoresSNI(para);
                var sni = personalsni.GroupBy(x => x.sni.NivelSNIId)
                    .Select(grupo => new
                    {
                        nivel = grupo.Select(i => i.sni.NivelSNIId).FirstOrDefault(),
                        cantidad = grupo.Count()
                    });

                int candidato = 0; int investigador = 0;
                foreach (var item in sni)
                {
                    if (item.nivel == 1) { candidato += item.cantidad; };
                    if (item.nivel != 1 && item.nivel != 0) { investigador += item.cantidad; };
                }
                TotalSNICan += candidato;
                TotalSNIInv += investigador;
                var sniUnidad = new
                {
                    candidato = candidato,
                    investigador = investigador
                };

                var obj = new
                {
                    nivelUnidad = nivelUnidad,
                    sniUnidad = sniUnidad
                };
                return obj;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetPersonaspiramidecategoias(string id)
        {
            try
            {
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                ParametrosConsultas para = new ParametrosConsultas();
                para.Fecha = Convert.ToDateTime(id);
                var personas = await CatalogoPersonasFechaEfectivaReportes(para);
                var aux = from b in personas
                          group b by b.ClavePersona into g
                          select g.First();
                var resultados = aux
                    .GroupBy(x => x.CategoriaId)
                    .Select(grupo => new
                    {
                        nivel = grupo.Select(i => i.Categoria.Descripcion).FirstOrDefault()
                    ,
                        cantidad = grupo.Count(),
                        claves = grupo.Select(x => x.ClavePersona).ToList()
                    });

                var investigadores = resultados.Where(x => x.nivel.Contains("Investigador"));
                List<object> investiglevel = new List<object>();
                List<object> investicount = new List<object>();

                foreach (var item in investigadores)
                {
                    investiglevel.Add(item.nivel);
                    investicount.Add(item.cantidad);
                }
                var extras = resultados.Where(x => !x.nivel.Contains("Investigador"));
                List<object> extralevel = new List<object>();
                List<object> extracount = new List<object>();

                foreach (var item in extras)
                {
                    // IGB - Se reemplaza la cadena SPS por director y la cadena MM por Gerente
                    extralevel.Add(item.nivel.Replace("SPS", "Director").Replace("MM", "Gerente"));
                    extracount.Add(item.cantidad);
                }

                var result = new
                {
                    investigadoresnivel = investiglevel,
                    investigadorescount = investicount,
                    extralevel = extralevel,
                    extracount = extracount
                };
                return result;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Object> GetPersonasGradosSNI(string id)
        {
            try
            {
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                ParametrosConsultas para = new ParametrosConsultas();
                para.Fecha = Convert.ToDateTime(id);
                //para.Claveunidad = "01";
                //////////////////Busqueda de Unidades Organizacionales
                List<UnidadOrganizacional> Unidades = await _ctx.dbSetUnidadOrganizacional
                   .Where(x => x.FechaEfectiva == _ctx.dbSetUnidadOrganizacional
                                                .Where(f => f.FechaEfectiva <= para.Fecha
                                                      && f.ClaveUnidad == x.ClaveUnidad)
                                                .Max(f => f.FechaEfectiva)).AsNoTracking().ToListAsync();
                /////////////////////////////////////////////////////////
                //Lista de claves de las Gerencia de la División p.e. Div. Tecno habilitadoras, con número 20
                List<String> unidadesDivisionID = new List<string>(Unidades.Where(x => x.tipoO == 2 || x.tipoO == 1).Select(x => x.ClaveUnidad));
                //Lista de objetos tipo UnidadOrganizacional de las Gerencia de la División p.e. Div. Tecno habilitadoras, con número 20
                List<UnidadOrganizacional> UnidadesDivision = new List<UnidadOrganizacional>(Unidades.Where(x => x.tipoO == 2 || x.tipoO == 1 && x.Estado == 1));
                //Lista de objetos tipo UnidadOrganizacional de las Gerencias que pertenecen a una División p.e. Gerencia de tecnologías de Info. con número 54
                List<UnidadOrganizacional> UnidadesGerenciales = new List<UnidadOrganizacional>(Unidades.Where(x => x.tipoO == 3 && x.Estado == 1));

                /////////////////Buscar las personas por cada unidad
                List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
                List<String> unidadesID = new List<string>(Unidades.Select(x => x.ClaveUnidad));
                var fullIndividuos = await CatalogoPersonasFechaEfectivaReportesUnidadList(Convert.ToDateTime(id), unidadesID);
                foreach (var item in Unidades)
                {
                    var investigadoresUnidad = fullIndividuos.FindAll(x => x.ClaveUnidad == item.ClaveUnidad);
                    List<String> clavesInvestigadoresUnidad = new List<string>(investigadoresUnidad.Select(x => x.ClavePersona));

                    //OBTENER EL MAX DE FORMACION ACADÉMICA DE CADA EMPLEADO (ORDENADO POR GRADO ACADÉMICO 1=LIC,2=MAE,3=DOC), EXCLUYENDO DATOS DE FORMACIONES ACADÉMICAS 4 Y 5)
                    var formaciones = await _ctxch.FormacionAcademica
                    .Where(x => x.EstadoFlujoId == 3 && clavesInvestigadoresUnidad.Contains(x.ClavePersona) && x.FechaValidacion <= para.Fecha && x.EstaTitulado == true && (x.GradoAcademicoId == 1 || x.GradoAcademicoId == 2 || x.GradoAcademicoId == 3))
                    .OrderByDescending(x => x.GradoAcademicoId)
                    .AsNoTracking().ToListAsync();


                    var sniFull = await _ctxch.SNI
                         .Where(x => x.EstadoFlujoId == 3 && clavesInvestigadoresUnidad.Contains(x.ClavePersona) && (x.fechaTerminoNombramiento >= para.Fecha && x.fechaInicioNombramiento <= para.Fecha))
                         .OrderByDescending(x => x.fechaValidacion)
                         .AsNoTracking().ToListAsync();

                    foreach (var persona in investigadoresUnidad)
                    {
                        var formacion = formaciones.Find(x => x.ClavePersona == persona.ClavePersona);
                        var sni = sniFull.Find(x => x.ClavePersona == persona.ClavePersona);
                        persona.UnidadOrganizacional = Unidades.Find(x => x.ClaveUnidad == persona.ClaveUnidad);
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona,
                            FormacionRepo = formacion,
                            sni = sni
                        }
                            );
                    }
                }
                ////////////////////////////////////////////////////
                /////////////Organizar 
                List<object> resultadoInvestigadoresGradosSNI = new List<object>();

                var catInvestigadores2 = catInvestigadores.ToList();

                //DEFINICION DE LISTA DE ACUMULADORES PARA TOTALES DEL INEEL
                int TOTALINEEIL = 0;
                int TOTALLICINEEL = 0; int TOTALMAEINEEL = 0; int TOTALDOCINEEL = 0;
                int TOTALNIVEL1INEEL = 0; int TOTALNIVEL2INEEL = 0; int TOTALNIVEL3INEEL = 0; int TOTALNIVEL4INEEL = 0;
                int TOTALCANINEEL = 0; int TOTALINVINEEL = 0;

                int totalDivisiones = 0;
                int contadorDivision = 0;
                totalDivisiones = UnidadesDivision.Count();

                foreach (var unidadDiv in UnidadesDivision)
                {
                    contadorDivision++;

                    var item = catInvestigadores2
                   .Where(x => x.Persona.UnidadOrganizacional.ClaveUnidad.Equals(unidadDiv.ClaveUnidad))
                   .ToList();

                    List<object> gerenciasDivicioon = new List<object>();
                    //DEFINICION DE LISTA DE ACUMULADORES DIVISIONALES
                    int TotalLicDiv = 0; int TotalMaeDiv = 0; int TotalDocDiv = 0;
                    int TotalNivel1Div = 0; int TotalNivel2Div = 0; int TotalNivel3Div = 0; int TotalNivel4Div = 0;
                    int TotalCandDiv = 0; int TotalInvDiv = 0;

                    int lic = item.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 1).Count();
                    int mae = item.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 2).Count();
                    int doc = item.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 3).Count();
                    int total = 0;
                    int nivel1Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("I")).Count();
                    int nivel2Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("II")).Count();
                    int nivel3Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("III")).Count();
                    int nivel4Gere = item.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("IV")).Count();
                    int invG = item.Where(x => x.sni != null && (x.sni.NivelSNIId == 2 || x.sni.NivelSNIId == 3 || x.sni.NivelSNIId == 4)).Count();
                    int candG = item.Where(x => x.sni != null && x.sni.NivelSNIId == 1).Count();
                    total += item.Count();
                    TOTALINEEIL += item.Count();
                    TotalLicDiv += lic;
                    TotalMaeDiv += mae;
                    TotalDocDiv += doc;
                    TOTALLICINEEL += lic;
                    TOTALMAEINEEL += mae;
                    TOTALDOCINEEL += doc;
                    TotalNivel1Div += nivel1Gere;
                    TotalNivel2Div += nivel2Gere;
                    TotalNivel3Div += nivel3Gere;
                    TotalNivel4Div += nivel4Gere;
                    TotalCandDiv += candG;
                    TotalInvDiv += invG;
                    TOTALNIVEL1INEEL += nivel1Gere;
                    TOTALNIVEL2INEEL += nivel2Gere;
                    TOTALNIVEL3INEEL += nivel3Gere;
                    TOTALNIVEL4INEEL += nivel4Gere;
                    TOTALCANINEEL += candG;
                    TOTALINVINEEL += invG;
                    //////////////////////////////////////////////
                    var gerenciaGrupoDivicion = new
                    {
                        gerenciaNombre = unidadDiv.NombreUnidad,
                        numInv = item.Count(),
                        licenciados = lic,
                        maestros = mae,
                        doctores = doc,
                        nivel1 = nivel1Gere,
                        nivel2 = nivel2Gere,
                        nivel3 = nivel3Gere,
                        nivel4 = nivel4Gere,
                        cand = candG,
                        inv = invG
                    };
                    //agregar si null no agregar, casos DEA y DPGEyC
                    gerenciasDivicioon.Add(gerenciaGrupoDivicion);
                    ///////por gerencias
                    //Listado de gerencias que coincidan con la clave de la división
                    var gerenciasDivision = UnidadesGerenciales.Where(x => x.padre.Equals(unidadDiv.ClaveUnidad) && x.tipoO == 3).ToList();

                    if (gerenciasDivision.Count > 0)
                    {
                        foreach (var gerencia in gerenciasDivision)
                        {

                            var grupo = catInvestigadores2
                            .Where(x => x.Persona.UnidadOrganizacional.ClaveUnidad.Equals(gerencia.ClaveUnidad))
                            .ToList();

                            total += grupo.Count();
                            TOTALINEEIL += grupo.Count();

                            int licgrupo = grupo.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 1).Count();
                            int maegrupo = grupo.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 2).Count();
                            int docgrupo = grupo.Where(x => x.FormacionRepo != null && x.FormacionRepo.GradoAcademicoId == 3).Count();
                            TOTALLICINEEL += licgrupo;
                            TOTALMAEINEEL += maegrupo;
                            TOTALDOCINEEL += docgrupo;
                            int nivel1 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("I")).Count();
                            int nivel2 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("II")).Count();
                            int nivel3 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("III")).Count();
                            int nivel4 = grupo.Where(x => x.Persona.Categoria.Descripcion.Contains("Investigador") && x.Persona.Categoria.NivelInvestigador.Equals("IV")).Count();
                            int inv = grupo.Where(x => x.sni != null && (x.sni.NivelSNIId == 2 || x.sni.NivelSNIId == 3 || x.sni.NivelSNIId == 4)).Count();
                            int cand = grupo.Where(x => x.sni != null && x.sni.NivelSNIId == 1).Count();
                            TOTALNIVEL1INEEL += nivel1;
                            TOTALNIVEL2INEEL += nivel2;
                            TOTALNIVEL3INEEL += nivel3;
                            TOTALNIVEL4INEEL += nivel4;
                            TOTALCANINEEL += cand;
                            TOTALINVINEEL += inv;
                            TotalLicDiv += licgrupo;
                            TotalMaeDiv += maegrupo;
                            TotalDocDiv += docgrupo;
                            TotalNivel1Div += nivel1;
                            TotalNivel2Div += nivel2;
                            TotalNivel3Div += nivel3;
                            TotalNivel4Div += nivel4;
                            TotalCandDiv += cand;
                            TotalInvDiv += inv;
                            var gerenciaGrupo = new
                            {
                                gerenciaNombre = gerencia.NombreUnidad,
                                numInv = grupo.Count(),
                                licenciados = licgrupo,
                                maestros = maegrupo,
                                doctores = docgrupo,
                                nivel1 = nivel1,
                                nivel2 = nivel2,
                                nivel3 = nivel3,
                                nivel4 = nivel4,
                                cand = cand,
                                inv = inv
                            };
                            gerenciasDivicioon.Add(gerenciaGrupo);
                        }
                    }

                    //////////////////////Totales
                    //var gerenciaGrupoDivicionTotalvACIO = new
                    //{
                    //    gerenciaNombre = "----------",
                    //    numInv = "----",
                    //    licenciados = "----",
                    //    maestros = "----",
                    //    doctores = "----",
                    //    nivel1 = "----",
                    //    nivel2 = "----",
                    //    nivel3 = "----",
                    //    nivel4 = "----",
                    //    cand = "----",
                    //    inv = "----"
                    //};
                    //gerenciasDivicioon.Add(gerenciaGrupoDivicionTotalvACIO);
                    var gerenciaGrupoDivicionTotal = new
                    {
                        gerenciaNombre = "TOTAL DE LA DIVISIÓN",
                        numInv = total,
                        licenciados = TotalLicDiv,
                        maestros = TotalMaeDiv,
                        doctores = TotalDocDiv,
                        nivel1 = TotalNivel1Div,
                        nivel2 = TotalNivel2Div,
                        nivel3 = TotalNivel3Div,
                        nivel4 = TotalNivel4Div,
                        cand = TotalCandDiv,
                        inv = TotalInvDiv
                    };
                    gerenciasDivicioon.Add(gerenciaGrupoDivicionTotal);
                    ///////////////////////////

                    var ObjetoResultado = new
                    {
                        divicion = unidadDiv.NombreUnidad,
                        total = total,
                        numInv = total,
                        licenciados = TotalLicDiv,
                        maestros = TotalMaeDiv,
                        doctores = TotalDocDiv,
                        nivel1 = TotalNivel1Div,
                        nivel2 = TotalNivel2Div,
                        nivel3 = TotalNivel3Div,
                        nivel4 = TotalNivel4Div,
                        cand = TotalCandDiv,
                        inv = TotalInvDiv,
                        totalCanInv = TotalCandDiv + TotalInvDiv
                    };
                    resultadoInvestigadoresGradosSNI.Add(ObjetoResultado);





                    if (contadorDivision == totalDivisiones)
                    {
                        //TOTAL DE TOTALES
                        var totalTotales = new
                        {
                            divicion = "TOTAL INEEL",
                            total = 0,
                            numInv = TOTALINEEIL,
                            licenciados = TOTALLICINEEL,
                            maestros = TOTALMAEINEEL,
                            doctores = TOTALDOCINEEL,
                            nivel1 = "",
                            nivel2 = "",
                            nivel3 = "",
                            nivel4 = "",
                            cand = TOTALCANINEEL,
                            inv = TOTALINVINEEL,
                            totalCanInv = TOTALCANINEEL + TOTALINVINEEL
                        };
                        resultadoInvestigadoresGradosSNI.Add(totalTotales);
                    }


                }

                return resultadoInvestigadoresGradosSNI;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }
        public async Task<IEnumerable<EdadPromedio>> GetPersonasEdadPromedio(string id)
        {
            try
            {
                List<EdadPromedio> Result = new List<EdadPromedio>();


                //Obtener resultados historicos
                var resultHisto = await _repo.GetAll();
                foreach (var item in resultHisto)
                {
                    EdadPromedio aux = new EdadPromedio();
                    aux.label = item.year;
                    aux.y = item.edadpromedio;
                    Result.Add(aux);
                }
                //
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                DateTime Termino;
                for (int i = 2006; i <= anio; i++)
                {
                    if (i == anio)
                    {

                        Termino = Convert.ToDateTime(id);
                    }
                    else
                    {

                        Termino = Convert.ToDateTime("31/12/" + i);
                    }


                    ParametrosConsultas para = new ParametrosConsultas();
                    para.Fecha = Termino;
                    var personas = await CatalogoPersonasFechaEfectiva(para);
                    List<CatInvestigadores> lista = new List<CatInvestigadores>();
                    foreach (var item in personas)
                    {
                        lista.Add(new CatInvestigadores
                        {
                            Persona = item,
                            Fecha = Convert.ToDateTime(Termino)
                        });
                    }
                    decimal edad = lista.Sum(e => e.Edad) / lista.Count;
                    edad = Math.Round(edad, 2);
                    Result.Add(new EdadPromedio
                    {
                        label = i + "",
                        y = edad,
                        indexLabel = "" + edad
                    });


                }
                return Result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<EvolucionPlantillaHistorico>> EvolucionPlantillaHistorico()
        {
            List<EvolucionPlantillaHistorico> evolucionph = new List<EvolucionPlantillaHistorico>();
            evolucionph = await (from historico in _ctxch.EvolucionPlantillaHistorico
                                 select historico).AsNoTracking().ToListAsync();
            return evolucionph;
        }

        public async Task<Object> GetPersonasPerfilCurricular(string id)
        {
            try
            {
                string[] fecha = id.Split('-');
                id = fecha[1] + "/" + fecha[0] + "/" + fecha[2];
                int anio = Convert.ToInt32(fecha[2]);
                ParametrosConsultas para = new ParametrosConsultas();
                para.Fecha = Convert.ToDateTime(id);
                var personas = await CatalogoPersonasFechaEfectivaReportes(para);
                List<CatInvestigadores> lista = new List<CatInvestigadores>();
                List<string> claves = new List<string>();
                List<string> plaza = new List<string>();
                claves = (from person in personas
                          select person.ClavePersona)
                       .ToList();
                foreach (var item in personas)
                {
                    lista.Add(new CatInvestigadores
                    {
                        Persona = item,
                        Fecha = Convert.ToDateTime(id)
                    });
                }
                decimal edad = lista.Sum(e => e.Edad) / lista.Count;
                edad = Math.Round(edad, 2);
                decimal experiencia = lista.Sum(e => e.Experiencia) / lista.Count;
                experiencia = Math.Round(experiencia, 2);
                /////////////
                var investi = personas.Count();
                var becarioin = getVigenteRepo(para);
                var masde40Experiencia = lista.Where(e => e.Experiencia > Convert.ToDecimal(40.0000000001)).Count();
                var de30A40AniosExperiencia = lista.Where(e => e.Experiencia >= Convert.ToDecimal(30.0000000001) && e.Experiencia <= 40).Count();
                var de20A30AniosExperiencia = lista.Where(e => e.Experiencia >= Convert.ToDecimal(20.0000000001) && e.Experiencia <= 30).Count();
                var de10A20AniosExperiencia = lista.Where(e => e.Experiencia >= Convert.ToDecimal(10.0000000001) && e.Experiencia <= 20).Count();
                var menorde10AniosExperiencia = lista.Where(e => e.Experiencia <= 10).Count();
                var edadmasde50 = lista.Where(e => e.Edad > Convert.ToDecimal(50)).Count();
                var edad41A50 = lista.Where(e => e.Edad >= Convert.ToDecimal(41) && e.Edad <= Convert.ToDecimal(50)).Count();
                var edad31A40 = lista.Where(e => e.Edad >= Convert.ToDecimal(31) && e.Edad < Convert.ToDecimal(41)).Count();
                var edad21A30 = lista.Where(e => e.Edad >= Convert.ToDecimal(21) && e.Edad < Convert.ToDecimal(31)).Count();
                var idiomas = getIdiomasRepo(para, claves);
                var plazas = lista.GroupBy(x => x.Persona.plazaTrabajo)
                    .Select(grupo => new
                    {
                        plaza = grupo.Select(i => i.Persona.plazaTrabajo).FirstOrDefault().ToLower()
                    ,
                        cantidad = grupo.Count()
                    });
                var niveles = lista.GroupBy(x => x.Persona.Categoria.NivelInvestigador)
                    .Select(grupo => new
                    {
                        nivel = grupo.Select(i => i.Persona.Categoria.NivelInvestigador).FirstOrDefault()
                    ,
                        cantidad = grupo.Count()
                    });
                var nivelAcademico = await getforRepo(para, claves);
                var obj = new
                {
                    investigadores = investi,
                    becariointerno = becarioin,
                    experienciaprom = experiencia,
                    edadprom = edad,
                    masde40Experiencia = masde40Experiencia,
                    de30A40AniosExperiencia = de30A40AniosExperiencia,
                    de20A30AniosExperiencia = de20A30AniosExperiencia,
                    de10A20AniosExperiencia = de10A20AniosExperiencia,
                    menorde10AniosExperiencia = menorde10AniosExperiencia,
                    edadmasde50 = edadmasde50,
                    edad41A50 = edad41A50,
                    edad31A40 = edad31A40,
                    edad21A30 = edad21A30,
                    idiomas = idiomas,
                    plazas = plazas,
                    niveles = niveles,
                    nivelAcademico = nivelAcademico,
                };
                return obj;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Metodo que devuelve la lista de personal vigente, segun los parametros enviados.
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CatInvestigadores>> GetPersonalVigente(ParametrosConsultas parametros)
        {
            List<CatInvestigadores> investigadores = new List<CatInvestigadores>();
            investigadores = await investigadoresvigente(parametros);

            return investigadores;
        }


        /// <summary>
        /// Metodo que devuelve la lista de personal vigente, segun los parametros enviados.
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CatInvestigadores>> GetPersonalVigentexFecha(ParametrosConsultas parametros)
        {
            List<CatInvestigadores> investigadores = new List<CatInvestigadores>();
            investigadores = await investigadoresvigentesxfecha(parametros);

            return investigadores;
        }

        public async Task<IEnumerable<AnalisisSNI>> GetAnalisisSNI(ParametrosConsultas parametros)
        {
            List<AnalisisSNI> analisissni = new List<AnalisisSNI>();
            analisissni = await investigadoresAnalisis(parametros);

            return analisissni;
        }


        public async Task<IEnumerable<AnalisisSNI>> GetAnalisisSNIxFECHA(ParametrosConsultas parametros)
        {
            List<AnalisisSNI> analisissni = new List<AnalisisSNI>();
            analisissni = await investigadoresAnalisisXFecha(parametros);

            return analisissni;
        }

        public async Task<Grafica> GetEvolucionPlantilla(ParametrosConsultas param)
        {
            try
            {
                List<EdadPromedio> Result = new List<EdadPromedio>();
                List<DateTime> fechasaconsultar = new List<DateTime>();
                List<EvolucionPlantillaHistorico> historico = new List<EvolucionPlantillaHistorico>();
                Grafica valoresgrafica = new Grafica();
                List<string> investigadores = new List<string>();
                List<string> conposgrado = new List<string>();

                //Obtener evolucion plantilla historico eph
                historico = await EvolucionPlantillaHistorico();
                foreach (var item in historico)
                {
                    investigadores.Add(item.TotalInvestigadores.ToString());
                    conposgrado.Add(item.TotalPosgrado.ToString());
                    valoresgrafica.Etiquetas.Add(item.Anio.ToString());
                }

                fechasaconsultar = FechasAnteriores(param.Fecha, historico);


                foreach (var fecha in fechasaconsultar)
                {
                    param.Fecha = fecha;
                    var invest = await CatalogoPersonasFechaEfectiva(param);
                    investigadores.Add(invest.Count.ToString());
                    var pos = await InvestigadoresPosgrado(invest, param);
                    conposgrado.Add(pos.Count.ToString());
                }
                valoresgrafica.Datos.Add(investigadores);
                valoresgrafica.Datos.Add(conposgrado);
                valoresgrafica.Series = new List<string> { "Investigadores", "Con Posgrado" };
                valoresgrafica.Etiquetas.AddRange(fechasaconsultar.Select(e => e.Year.ToString()).ToList());

                return valoresgrafica;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public List<DateTime> FechasAnteriores(DateTime fechaconsulta, List<EvolucionPlantillaHistorico> historico)
        {
            List<DateTime> listafechasaconsultar = new List<DateTime>();
            for (int i = AnioSiguienteAlMaximoHistorico(historico); i < fechaconsulta.Year; i++)
            {
                DateTime fechaagregar = Convert.ToDateTime("31/12/" + i).AddHours(23);
                listafechasaconsultar.Add(fechaagregar);
            }
            listafechasaconsultar.Add(fechaconsulta);
            return listafechasaconsultar;
        }

        public int AnioSiguienteAlMaximoHistorico(List<EvolucionPlantillaHistorico> historico)
        {
            int maximomasuno = 2006;
            if (historico.Count > 0)
            {
                maximomasuno = historico.Max(e => e.Anio + 1);
            }
            if (maximomasuno < 2006)
                maximomasuno = 2006;
            return maximomasuno;
        }

        /// <summary>
        /// Metodo que obtiene el personal de investigadores 
        /// segun el filtro que se envia en la propiedad texto de los parametros
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CatInvestigadores>> GetPersonalEstudios(ParametrosConsultas parametros)
        {

            List<CatInvestigadores> investigadores = new List<CatInvestigadores>();
            investigadores = await InvestigadoresFA(parametros);
            return investigadores;
        }

        /// <summary>
        /// Metodo que devuelve una lista de investigadores con su formacion academica
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<List<CatInvestigadores>> GetInvestigadoresFormacion(ParametrosConsultas parametros)
        {
            List<CatInvestigadores> investigadores = new List<CatInvestigadores>();
            investigadores = await InvestigadoresFA(parametros);
            return investigadores;
        }

        /// <summary>
        /// Metodo que identifica que tipo de consulta de personal se requiere 
        /// institucional y por división 
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<PersonalInvestigacion>> GetPersonalInvestigacion(ParametrosConsultas parametros)
        {
            IEnumerable<PersonalInvestigacion> personalinvlist = new List<PersonalInvestigacion>();
            if (parametros.Claveunidad != "01")
            {
                personalinvlist = await GetPersonalInvestigacionD(parametros);
            }
            else if (parametros.Claveunidad != "" && parametros.Claveunidad == "01")
            {
                personalinvlist = await GetPersonalInvestigacionInstitucional(parametros);
            }
            return personalinvlist;
        }

        /// <summary>
        /// Metodo que identifica que tipo de consulta de personal se requiere para el personal SNI
        /// institucional y por división 
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<PersonalSNI>> GetPersonalSNI(ParametrosConsultas parametros)
        {
            IEnumerable<PersonalSNI> personalinvlist = new List<PersonalSNI>();
            if (parametros.Claveunidad != "01")
            {
                personalinvlist = await GetPersonalSNID(parametros);
            }
            else if (parametros.Claveunidad != "" && parametros.Claveunidad == "01")
            {
                personalinvlist = await GetPersonalSNIInstitucional(parametros);
            }
            return personalinvlist;
        }

        /// <summary>
        /// Metodos que devuelve una lista de personal de investigadores en sni
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CatInvestigadores>> GetPersonalSNIDatos(ParametrosConsultas parametros)
        {
            IEnumerable<CatInvestigadores> personalinvlist = new List<CatInvestigadores>();
            if (parametros.Claveunidad != "01")
            {
                personalinvlist = await GetPersonalSNIDatosD(parametros);
            }
            else if (parametros.Claveunidad != "" && parametros.Claveunidad == "01")
            {
                personalinvlist = await GetPersonalSNIDatosInstitucional(parametros);
            }
            return personalinvlist;
        }

        /// <summary>
        /// Metodo que obtiene los investigadores con SNI por división
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        private async Task<IEnumerable<CatInvestigadores>> GetPersonalSNIDatosD(ParametrosConsultas parametros)
        {
            List<UnidadOrganizacional> entities = await listaUnidadesOrganizacionales(parametros);
            List<CatInvestigadores> investigadores = new List<CatInvestigadores>();
            foreach (var unidad in entities)
            {
                investigadores = await investigadoresSNI(parametros);
                foreach (var item in unidad.Children)
                {
                    parametros.Claveunidad = item.ClaveUnidad;
                    investigadores.AddRange(await investigadoresSNI(parametros));
                }

            }
            return investigadores.Where(e => e.sni.NivelSNIId > 0);
        }

        /// <summary>
        /// Metodo que obtiene la consulta estadistica del personal de investigación en SNI
        /// institucional
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<PersonalSNI>> GetPersonalSNIInstitucional(ParametrosConsultas parametros)
        {
            IEnumerable<PersonalSNI> personalsnilist = new List<PersonalSNI>();

            List<UnidadOrganizacional> entities = await listaUnidadesOrganizacionales(parametros);

            foreach (var unidad in entities)
            {
                foreach (var item in unidad.Children)
                {
                    parametros.Claveunidad = item.ClaveUnidad;
                    personalsnilist = personalsnilist.Concat(await GetPersonalSNID(parametros));
                }
            }
            return personalsnilist;
        }

        /// <summary>
        /// Metodo que obtiene el personal de investigacion con sni institucionalmente
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<CatInvestigadores>> GetPersonalSNIDatosInstitucional(ParametrosConsultas parametros)
        {
            IEnumerable<CatInvestigadores> personalsnilist = new List<CatInvestigadores>();

            List<UnidadOrganizacional> entities = await listaUnidadesOrganizacionales(parametros);

            foreach (var unidad in entities)
            {
                foreach (var item in unidad.Children)
                {
                    parametros.Claveunidad = item.ClaveUnidad;
                    personalsnilist = personalsnilist.Concat(await GetPersonalSNIDatosD(parametros));
                }
            }
            return personalsnilist;
        }


        /// <summary>
        /// Metodo que obtiene la consulta estadistica del personal de investigacion en SNI
        /// division
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<IEnumerable<PersonalSNI>> GetPersonalSNID(ParametrosConsultas parametros)
        {
            List<UnidadOrganizacional> entities = await listaUnidadesOrganizacionales(parametros);
            List<PersonalSNI> personalsnilist = new List<PersonalSNI>();
            foreach (var unidad in entities)
            {
                List<CatInvestigadores> inves = new List<CatInvestigadores>();
                int candidatos, nivel1, nivel2, nivel3 = 0;
                int candidatostotal = 0, nivel1total = 0, nivel2total = 0, nivel3total = 0;

                inves = await investigadoresSNI(parametros);
                candidatos = await CountSNI(inves, 1);
                candidatostotal += candidatos;
                nivel1 = await CountSNI(inves, 2);
                nivel1total += nivel1;
                nivel2 = await CountSNI(inves, 3);
                nivel2total += nivel2;
                nivel3 = await CountSNI(inves, 4);
                nivel3total += nivel3;
                personalsnilist.Add(new PersonalSNI()
                {
                    UnidadOrganizacional = unidad,
                    Candidatos = candidatos,
                    Nivel1 = nivel1,
                    Nivel2 = nivel2,
                    Nivel3 = nivel3
                });

                foreach (var item in unidad.Children)
                {
                    parametros.Claveunidad = item.ClaveUnidad;
                    inves = await investigadoresSNI(parametros);
                    candidatos = await CountSNI(inves, 1);
                    candidatostotal += candidatos;
                    nivel1 = await CountSNI(inves, 2);
                    nivel1total += nivel1;
                    nivel2 = await CountSNI(inves, 3);
                    nivel2total += nivel2;
                    nivel3 = await CountSNI(inves, 4);
                    nivel3total += nivel3;
                    personalsnilist.Add(new PersonalSNI()
                    {
                        UnidadOrganizacional = item,
                        Candidatos = candidatos,
                        Nivel1 = nivel1,
                        Nivel2 = nivel2,
                        Nivel3 = nivel3
                    });
                }
                personalsnilist.Add(new PersonalSNI()
                {
                    UnidadOrganizacional = new UnidadOrganizacional()
                    {
                        NombreUnidad = "TOTAL"
                    },
                    Candidatos = candidatostotal,
                    Nivel1 = nivel1total,
                    Nivel2 = nivel2total,
                    Nivel3 = nivel3total
                });

            }
            return personalsnilist;
        }

        /// <summary>
        /// Metodo que cuenta el numero de investigadores segun el nivel  de SNI que se le envia
        /// </summary>
        /// <param name="inves"></param>
        /// <param name="nivel"></param>
        /// <returns></returns>
        public async Task<int> CountSNI(List<CatInvestigadores> inves, int nivel)
        {
            int count = 0;
            count = (from a in inves
                     where a.sni.NivelSNIId == nivel && a.sni != null
                     select a).Count();
            return count;
        }

        /// <summary>
        /// Metodo que devuelve una lista de unidades organizacionales
        /// segun la fecha y el id enviados en parametros
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<List<UnidadOrganizacional>> listaUnidadesOrganizacionales(ParametrosConsultas parametros)
        {
            List<UnidadOrganizacional> entities = null;
            entities = await _ctx.dbSetUnidadOrganizacional
                                  .Where(x => x.ClaveUnidad.Equals(parametros.Claveunidad)
                                        && x.FechaEfectiva == _ctx.dbSetUnidadOrganizacional
                                                                .Where(f => f.FechaEfectiva <= parametros.Fecha
                                                                && f.ClaveUnidad == x.ClaveUnidad)
                                                                .Max(f => f.FechaEfectiva))
                                  .AsNoTracking().ToListAsync();
            foreach (var item in entities)
            {
                item.Children = await _ctx.dbSetUnidadOrganizacional
                   .Where(x => x.padre == item.ClaveUnidad && x.Estado == 1
                   && x.FechaEfectiva == (_ctx.dbSetUnidadOrganizacional
                                                .Where(f => f.FechaEfectiva <= parametros.Fecha
                                                      && f.ClaveUnidad == x.ClaveUnidad)
                                                .Max(f => f.FechaEfectiva))
                   )
                   .OrderByDescending(e => e.NombreUnidad)
                   .AsNoTracking()
                  .ToListAsync();

            }
            return entities;
        }

        /// <summary>
        /// Metodo que devuelve la unidad organizacional
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        public async Task<UnidadOrganizacional> ObtenerUnidadOrganizacional(ParametrosConsultas parametros)
        {
            UnidadOrganizacional entidad = null;
            entidad = await _ctx.dbSetUnidadOrganizacional
                                      .Where(x => x.ClaveUnidad.Equals(parametros.Claveunidad)
                                            && x.FechaEfectiva == _ctx.dbSetUnidadOrganizacional
                                                                    .Where(f => f.FechaEfectiva <= parametros.Fecha
                                                                    && f.ClaveUnidad == x.ClaveUnidad)
                                                                    .Max(f => f.FechaEfectiva))
                                      .AsNoTracking().FirstOrDefaultAsync();
            return entidad;
        }

        /// <summary>
        /// Consulta estadística del personal de investigación Institucional
        /// </summary>
        /// <param name="parametros"></param>
        /// <returns></returns>
        private async Task<IEnumerable<PersonalInvestigacion>> GetPersonalInvestigacionInstitucional(ParametrosConsultas parametros)
        {
            IEnumerable<PersonalInvestigacion> personalinvlist = new List<PersonalInvestigacion>();
            List<UnidadOrganizacional> entities = null;
            entities = await listaUnidadesOrganizacionales(parametros);

            foreach (var unidad in entities)
            {
                foreach (var item in unidad.Children)
                {
                    parametros.Claveunidad = item.ClaveUnidad;
                    personalinvlist = personalinvlist.Concat(await GetPersonalInvestigacionD(parametros));
                }
            }
            return personalinvlist;
        }

        /// <summary>
        /// Consulta estadística del personal de investigación por división
        /// </summary>
        /// <param name="parammetros">fecha y clave de unidad a consultar</param>
        /// <returns>lista de unidades organizacioneles y sus estadísticas</returns>
        public async Task<IEnumerable<PersonalInvestigacion>> GetPersonalInvestigacionD(ParametrosConsultas parametros)
        {
            List<PersonalInvestigacion> personalinvlist = new List<PersonalInvestigacion>();

            List<UnidadOrganizacional> entities = null;
            entities = await listaUnidadesOrganizacionales(parametros);
            foreach (var unidad in entities)
            {
                List<CatInvestigadores> inves = new List<CatInvestigadores>();

                int InvGteDDTotal = 0;
                int MandoMedioTotal = 0;
                int MandoMedio = 0;
                int InvPosgradoTotal = 0;
                int InvPosgrado = 0;
                int LicenciaturaTotal = 0;
                int Licenciatura = 0;
                int MaestriaTotal = 0;
                int Maestria = 0;
                int DoctoradoTotal = 0;
                int Doctorado = 0;

                inves = await investigadores(parametros);
                InvGteDDTotal += inves.Count();
                MandoMedio = MandosMediosCount(inves);
                MandoMedioTotal += MandoMedio;
                InvPosgrado = PosgradoCount(inves);
                InvPosgradoTotal += InvPosgrado;
                Licenciatura = GradoAcademicoCount(inves, 1);
                LicenciaturaTotal += Licenciatura;
                Maestria = GradoAcademicoCount(inves, 2);
                MaestriaTotal += Maestria;
                Doctorado = GradoAcademicoCount(inves, 3);
                DoctoradoTotal += Doctorado;
                personalinvlist.Add(new PersonalInvestigacion()
                {
                    UnidadOrganizacional = unidad,
                    InvGteDD = inves.Count(),
                    MandoMedio = MandoMedio,
                    InvPosgrado = InvPosgrado,
                    Licenciatura = Licenciatura,
                    Maestria = Maestria,
                    Doctorado = Doctorado
                });
                foreach (var unidadchild in unidad.Children)
                {
                    parametros.Claveunidad = unidadchild.ClaveUnidad;
                    inves = await investigadores(parametros);
                    InvGteDDTotal += inves.Count();
                    MandoMedio = MandosMediosCount(inves);
                    MandoMedioTotal += MandoMedio;
                    InvPosgrado = PosgradoCount(inves);
                    InvPosgradoTotal += InvPosgrado;
                    Licenciatura = GradoAcademicoCount(inves, 1);
                    LicenciaturaTotal += Licenciatura;
                    Maestria = GradoAcademicoCount(inves, 2);
                    MaestriaTotal += Maestria;
                    Doctorado = GradoAcademicoCount(inves, 3);
                    DoctoradoTotal += Doctorado;
                    personalinvlist.Add(new PersonalInvestigacion()
                    {
                        UnidadOrganizacional = unidadchild,
                        InvGteDD = inves.Count(),
                        MandoMedio = MandoMedio,
                        InvPosgrado = InvPosgrado,
                        Licenciatura = Licenciatura,
                        Maestria = Maestria,
                        Doctorado = Doctorado
                    });
                }
                personalinvlist.Add(new PersonalInvestigacion()
                {
                    UnidadOrganizacional = new UnidadOrganizacional()
                    {
                        NombreUnidad = "TOTAL"
                    },
                    InvGteDD = InvGteDDTotal,
                    MandoMedio = MandoMedioTotal,
                    InvPosgrado = InvPosgradoTotal,
                    Licenciatura = LicenciaturaTotal,
                    Maestria = MaestriaTotal,
                    Doctorado = DoctoradoTotal
                });
                break;
            }


            return personalinvlist;
        }

        /// <summary>
        /// Cuenta el numero de mandos medios en la lista de inves
        /// </summary>
        /// <param name="inves">lista de investigadores</param>
        /// <returns></returns>
        public int MandosMediosCount(List<CatInvestigadores> inves)
        {
            int count = 0;
            count = (from a in inves
                     where a.Persona.TipoPersonalId == "MAN"
                     select a).Count();
            return count;
        }

        /// <summary>
        /// Obtiene el numero de investigadores con el grado academico indicado
        /// </summary>
        /// <param name="inves">lista de investigadores por unidad organizacional </param>
        /// <param name="grado">1- licenciatura, 2- Maestria, 3- Doctorado</param>
        /// <returns></returns>
        public int GradoAcademicoCount(List<CatInvestigadores> inves, int grado)
        {
            int count = 0;
            foreach (var item in inves)
            {
                var i = (from a in item.Formacion
                         where a.GradoAcademicoId == grado
                         && a.GradoAcademicoId == (from b in item.Formacion
                                                   where b.ClavePersona == a.ClavePersona
                                                   select b.GradoAcademicoId).Max()
                         select a).Count();
                if (i > 0)
                {
                    count++;
                }
            }
            return count;
        }


        public async Task<List<CatInvestigadores>> InvestigadoresPosgrado(List<Personas> listapersonas, ParametrosConsultas param)
        {
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();

            if (listapersonas != null)
            {
                List<String> personas = new List<string>(listapersonas.Select(x => x.ClavePersona));
                var formacionall = new List<FormacionAcademica>();
                var formacionalla = await (from f in _ctxch.FormacionAcademica
                                           where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && (f.GradoAcademicoId >= 2 && f.GradoAcademicoId <= 3) && f.EstaTitulado == true && f.FechaValidacion <= param.Fecha
                                           group new { f.ClavePersona, f.GradoAcademicoId } by f.ClavePersona into formacion
                                           select formacion).AsNoTracking().ToListAsync();

                foreach (var persona in listapersonas)
                {
                    var formacion = formacionalla.FindAll(x => x.Key == persona.ClavePersona);

                    if (formacion.Count > 0)
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona
                        }
                        );


                }

            }
            return catInvestigadores;
        }

        public async Task<List<CatInvestigadores>> InvestigadoresGradoAcademico(List<Personas> listapersonas, ParametrosConsultas param, int grado)
        {
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();

            if (listapersonas != null)
            {
                List<String> personas = new List<string>(listapersonas.Select(x => x.ClavePersona));
                var formacionall = new List<FormacionAcademica>();
                var formacionalla = await (from f in _ctxch.FormacionAcademica
                                           where personas.Contains(f.ClavePersona)
                                           && f.EstadoFlujoId == 3
                                           //&& f.EstaTitulado == true
                                           && f.GradoAcademicoId == grado
                                           && f.FechaValidacion <= param.Fecha
                                           group new { f.ClavePersona, f.GradoAcademicoId } by f.ClavePersona into formacion
                                           select formacion).AsNoTracking().ToListAsync();

                foreach (var persona in listapersonas)
                {
                    var formacion = formacionalla.FindAll(x => x.Key == persona.ClavePersona);

                    if (formacion.Count > 0)
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona
                        }
                        );


                }

            }
            return catInvestigadores;
        }

        /// <summary>
        /// Obtiene el numero de investigadores con posgrado
        /// </summary>
        /// <returns>int investigadores con posgrado en inves</returns>
        public int PosgradoCount(List<CatInvestigadores> inves)
        {
            int posgrado = 0;
            foreach (var item in inves)
            {
                var i = (from a in item.Formacion
                         where a.GradoAcademicoId > 1
                         select a).Count();
                if (i > 0)
                {
                    posgrado++;
                }
            }
            return posgrado;
        }

        public async Task<List<Personas>> CatalogoPersonasFechaEfectiva(ParametrosConsultas param)
        {
            var BASE = baseCatalogoPersonasFechaEfectiva(param.Fecha);
            return await BASE.ToListAsync();
        }
        public async Task<int> CountCatalogoPersonasFechaActual()
        {
            var BASE = baseCatalogoPersonasFechaEfectiva(DateTime.Now);
            return await BASE.CountAsync();
        }

        private IQueryable<Personas> baseCatalogoPersonasFechaEfectiva(DateTime Fecha)
        {
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            var admin = (from unidad in _ctx.dbSetUnidadOrganizacional
                         where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                    p => p.FechaEfectiva <= Fecha
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
            var BASE = (from persona in _ctx.dbSetPersonas.Include("Plaza").Include("Categoria") //Investigadores
                        where persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                    p => p.FechaEfectiva <= Fecha
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
                                                               p => p.FechaEfectiva <= Fecha
                                                               && p.ClavePersona == mandomedio.ClavePersona
                                                               ).Max(e => e.FechaEfectiva)
                               && mandomedio.Estado == 1
                               && mandomedio.TipoPersonalId == "MAN"
                               && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                               && !clavesFinanzas.Contains(mandomedio.ClaveUnidad)
                               select mandomedio);

            return BASE;
        }

        public async Task<List<Personas>> CatalogoPersonasFechaEfectivaReportes(ParametrosConsultas param)
        {
            List<string> UnidadesTecnicas = new List<string>();
            UnidadesTecnicas.Add("10");
            UnidadesTecnicas.Add("20");
            UnidadesTecnicas.Add("30");
            UnidadesTecnicas.Add("40");
            UnidadesTecnicas.Add("80");
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            var admin = await (from unidad in _ctx.dbSetUnidadOrganizacional
                               where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                          p => p.FechaEfectiva <= param.Fecha
                                                          && p.ClaveUnidad == unidad.ClaveUnidad
                                                          ).Max(e => e.FechaEfectiva)
                               select unidad).AsNoTracking().ToListAsync();
            var clavesFinanzas = (from uni in admin
                                  where uni.ClaveUnidad == "90"
                                         || uni.ClaveUnidad == "70"
                                         || uni.ClaveUnidad == "01"
                                         || uni.padre == "90"
                                         || uni.padre == "70"
                                         || uni.padre == "01"
                                  select uni.ClaveUnidad);
            var clavesFinanzas2 = (from uni in admin
                                   where uni.ClaveUnidad == "90"
                                          || uni.ClaveUnidad == "70"
                                          || uni.ClaveUnidad == "01"
                                          || uni.padre == "90"
                                          || uni.padre == "70"
                                   select uni.ClaveUnidad);

            var invest2 = await (from persona in _ctx.dbSetPersonas.Include("Plaza").Include("Categoria") //Investigadores
                                 where persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                             p => p.FechaEfectiva <= param.Fecha
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
                                                               p => p.FechaEfectiva <= param.Fecha
                                                               && p.ClavePersona == mandomedio.ClavePersona
                                                               ).Max(e => e.FechaEfectiva)
                               && mandomedio.Estado == 1
                               && mandomedio.TipoPersonalId == "MAN"
                               && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                               && (!clavesFinanzas.Contains(mandomedio.ClaveUnidad) && !UnidadesTecnicas.Contains(mandomedio.ClaveUnidad))
                               select mandomedio)
                               .Union(//Mandos medios exceptuando areas financieras y administrativas
                               from mandomedio in _ctx.dbSetPersonas
                               where
                                 mandomedio.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                               p => p.FechaEfectiva <= param.Fecha
                                                               && p.ClavePersona == mandomedio.ClavePersona
                                                               ).Max(e => e.FechaEfectiva)
                               && mandomedio.Estado == 1
                               && mandomedio.TipoPersonalId == "MAN"
                               && (mandomedio.CategoriaId == "JC010")
                               && (!clavesFinanzas2.Contains(mandomedio.ClaveUnidad))
                               select mandomedio)
                               .ToListAsync();

            //&& UnidadesTecnicas.Contains(mandomedio.ClaveUnidad)

            return invest2;
        }
        public async Task<List<Personas>> CatalogoPersonasFechaEfectivaReportesUnidadList(DateTime Fecha, List<String> clavesUnidad)
        {
            //Obtener a lista de perosnas por clave de unidad
            var admin = await (from unidad in _ctx.dbSetUnidadOrganizacional
                               where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                          p => p.FechaEfectiva <= Fecha
                                                          && p.ClaveUnidad == unidad.ClaveUnidad
                                                          ).Max(e => e.FechaEfectiva)
                               //&& unidad.ClaveUnidad== "90"
                               select unidad).AsNoTracking().ToListAsync();
            var clavesFinanzas = (from uni in admin
                                  where uni.ClaveUnidad == "90"
                                         || uni.ClaveUnidad == "70"
                                         || uni.ClaveUnidad == "01"
                                         || uni.padre == "90"
                                         || uni.padre == "70"
                                  select uni.ClaveUnidad).ToList();
            var personas = await (from persona in _ctx.dbSetPersonas //Investigadores
                                  where clavesUnidad.Contains(persona.ClaveUnidad)
                                                  && persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                              p => p.FechaEfectiva <= Fecha
                                                                              && p.ClavePersona == persona.ClavePersona
                                                                              ).Max(e => e.FechaEfectiva)
                                  && persona.Estado == 1
                                  && persona.TipoPersonalId == ("INV")
                                  && persona.CategoriaId != ("JC025")
                                  && persona.CategoriaId != ("JC020")
                                  select persona).Union(//Mandos medios exceptuando areas financieras y administrativas
                               from mandomedio in _ctx.dbSetPersonas
                               where clavesUnidad.Contains(mandomedio.ClaveUnidad)
                                && mandomedio.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                               p => p.FechaEfectiva <= Fecha
                                                               && p.ClavePersona == mandomedio.ClavePersona
                                                               ).Max(e => e.FechaEfectiva)
                               && mandomedio.Estado == 1
                               && mandomedio.TipoPersonalId == "MAN"
                               && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                               && !clavesFinanzas.Contains(mandomedio.ClaveUnidad)
                               && !mandomedio.ClaveUnidad.Equals("17")
                               select mandomedio)
                               .Include(x => x.Categoria)
                               .AsNoTracking().ToListAsync();
            return personas;
        }
        public async Task<List<Personas>> CatalogoPersonasFechaEfectivaReportesUnidad(ParametrosConsultas param)
        {
            //Obtener a lista de perosnas por clave de unidad
            var admin = await (from unidad in _ctx.dbSetUnidadOrganizacional
                               where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                          p => p.FechaEfectiva <= param.Fecha
                                                          && p.ClaveUnidad == unidad.ClaveUnidad
                                                          ).Max(e => e.FechaEfectiva)
                               //&& unidad.ClaveUnidad== "90"
                               select unidad).AsNoTracking().ToListAsync();
            var clavesFinanzas = (from uni in admin
                                  where uni.ClaveUnidad == "90"
                                         || uni.ClaveUnidad == "70"
                                         || uni.ClaveUnidad == "01"
                                         || uni.padre == "90"
                                         || uni.padre == "70"
                                  select uni.ClaveUnidad).ToList();
            var personas = await (from persona in _ctx.dbSetPersonas //Investigadores
                                  where persona.ClaveUnidad == param.Claveunidad
                                                  && persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                              p => p.FechaEfectiva <= param.Fecha
                                                                              && p.ClavePersona == persona.ClavePersona
                                                                              ).Max(e => e.FechaEfectiva)
                                  && persona.Estado == 1
                                  && persona.TipoPersonalId == ("INV")
                                  && persona.CategoriaId != ("JC025")
                                  && persona.CategoriaId != ("JC020")
                                  select persona).Union(//Mandos medios exceptuando areas financieras y administrativas
                               from mandomedio in _ctx.dbSetPersonas
                               where mandomedio.ClaveUnidad == param.Claveunidad
                                && mandomedio.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                               p => p.FechaEfectiva <= param.Fecha
                                                               && p.ClavePersona == mandomedio.ClavePersona
                                                               ).Max(e => e.FechaEfectiva)
                               && mandomedio.Estado == 1
                               && mandomedio.TipoPersonalId == "MAN"
                               && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                               && !clavesFinanzas.Contains(mandomedio.ClaveUnidad)
                               && !mandomedio.ClaveUnidad.Equals("17")
                               select mandomedio)
                               .Include(x => x.Categoria)
                               .AsNoTracking().ToListAsync();
            return personas;
        }

        public async Task<List<Personas>> CatalogoPersonasPorFEClaveunidad(ParametrosConsultas param)
        {
            //Obtener a lista de perosnas por clave de unidad
            var admin = await (from unidad in _ctx.dbSetUnidadOrganizacional
                               where unidad.FechaEfectiva == _ctx.dbSetUnidadOrganizacional.Where(
                                                          p => p.FechaEfectiva <= param.Fecha
                                                          && p.ClaveUnidad == unidad.ClaveUnidad
                                                          ).Max(e => e.FechaEfectiva)
                               //&& unidad.ClaveUnidad== "90"
                               select unidad).AsNoTracking().ToListAsync();
            var clavesFinanzas = (from uni in admin
                                  where uni.ClaveUnidad == "90"
                                         || uni.ClaveUnidad == "70"
                                         || uni.ClaveUnidad == "01"
                                         || uni.padre == "90"
                                         || uni.padre == "70"
                                  select uni.ClaveUnidad).ToList();
            var personas = await (from persona in _ctx.dbSetPersonas //Investigadores
                                  where persona.ClaveUnidad == param.Claveunidad
                                                  && persona.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                                              p => p.FechaEfectiva <= param.Fecha
                                                                              && p.ClavePersona == persona.ClavePersona
                                                                              ).Max(e => e.FechaEfectiva)
                                  && persona.Estado == 1
                                  && persona.TipoPersonalId == ("INV")
                                  && persona.CategoriaId != ("JC025")
                                  && persona.CategoriaId != ("JC020")
                                  select persona).Union(//Mandos medios exceptuando areas financieras y administrativas
                               from mandomedio in _ctx.dbSetPersonas
                               where mandomedio.ClaveUnidad == param.Claveunidad
                                && mandomedio.FechaEfectiva == _ctx.dbSetPersonas.Where(
                                                               p => p.FechaEfectiva <= param.Fecha
                                                               && p.ClavePersona == mandomedio.ClavePersona
                                                               ).Max(e => e.FechaEfectiva)
                               && mandomedio.Estado == 1
                               && mandomedio.TipoPersonalId == "MAN"
                               && (mandomedio.CategoriaId == "JC010" || mandomedio.CategoriaId == "JC015")
                               && !clavesFinanzas.Contains(mandomedio.ClaveUnidad)
                               select mandomedio)
                               .Include(x => x.Categoria)
                               .AsNoTracking().ToListAsync();
            return personas;
        }

        /// <summary>
        /// lista de investigadores y su formacion academica (estadistico)
        /// </summary>
        /// <param name="param">fecha y clave de unidad</param>
        /// <returns>lista de investigadores y su formacion academica (estadistico)</returns>
        public async Task<List<CatInvestigadores>> investigadores(ParametrosConsultas param)
        {
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            if (!(param.Claveunidad == null || param.Claveunidad == string.Empty))
            {
                var invest2 = await CatalogoPersonasPorFEClaveunidad(param);

                if (invest2 != null)
                {
                    List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                    var formacionall = new List<FormacionAcademica>();
                    formacionall = await (from f in _ctxch.FormacionAcademica
                                          where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true && f.FechaValidacion <= param.Fecha
                                          select f)
                                 .AsNoTracking().ToListAsync();

                    foreach (var persona in invest2)
                    {
                        var formacion = formacionall.FindAll(x => x.ClavePersona == persona.ClavePersona);
                        if (persona.TipoPersonalId == "MAN")
                        {
                            persona.Clasificacion = persona.CategoriaId == "JC010" ? "***" : "**";
                        }

                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona,
                            Formacion = formacion,
                        }
                        );


                    }

                }

            }
            else
            {
                catInvestigadores = new List<CatInvestigadores>();
            }
            return catInvestigadores;
        }

        /// <summary>
        /// Metodo que retorna una lista de investigadores
        /// de a cuerdo a los parametros seleccionados como:
        /// tipo de consulta (institucional o por carrera)
        /// o por el grado academico 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<List<CatInvestigadores>> InvestigadoresFA(ParametrosConsultas param)
        {
            param.Fecha = DateTime.Now;
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            var invest2 = await CatalogoPersonasFechaEfectiva(param);
            if (invest2 != null)
            {
                List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                var formacion = new List<FormacionAcademica>();
                if (param.Gradoacademico == 0 && param.TipoConsulta == (int)Consulta.Carrera)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && personas.Contains(f.ClavePersona)
                                       && f.Carrera.Descripcion.Contains(param.texto)
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }
                else if (param.TipoConsulta == (int)Consulta.Carrera && param.Gradoacademico > 0)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && f.Carrera.Descripcion.Contains(param.texto)
                                       && f.GradoAcademicoId == param.Gradoacademico
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }
                else if (param.Gradoacademico == 0 && param.TipoConsulta == (int)Consulta.Institucion)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && f.Institucion.Descripcion.Contains(param.texto)
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }
                if (param.TipoConsulta == (int)Consulta.Institucion && param.Gradoacademico > 0)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && f.Institucion.Descripcion.Contains(param.texto)
                                       && f.GradoAcademicoId == param.Gradoacademico
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }

                foreach (var persona in invest2)
                {
                    var formacionall = formacion.FindAll(x => x.ClavePersona == persona.ClavePersona);
                    if (formacionall.Count > 0)
                    {
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona,
                            Formacion = formacionall,
                        }
                        );
                    }

                }

            }
            return catInvestigadores;
        }

        /// <summary>http://localhost:50391/app/CH/ConsultasIIE/controllers/
        /// Metodo que retorna una lista de investigadores
        /// de a cuerdo a los parametros seleccionados como:
        /// tipo de consulta (institucional o por carrera)
        /// o por el grado academico 
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<List<CatInvestigadores>> InvestigadoresFAXFecha(ParametrosConsultas param)
        {
            
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            var invest2 = await CatalogoPersonasFechaEfectiva(param);
            if (invest2 != null)
            {
                List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                var formacion = new List<FormacionAcademica>();
                if (param.Gradoacademico == 0 && param.TipoConsulta == (int)Consulta.Carrera)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && personas.Contains(f.ClavePersona)
                                       && f.Carrera.Descripcion.Contains(param.texto)
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }
                else if (param.TipoConsulta == (int)Consulta.Carrera && param.Gradoacademico > 0)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && f.Carrera.Descripcion.Contains(param.texto)
                                       && f.GradoAcademicoId == param.Gradoacademico
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }
                else if (param.Gradoacademico == 0 && param.TipoConsulta == (int)Consulta.Institucion)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && f.Institucion.Descripcion.Contains(param.texto)
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }
                if (param.TipoConsulta == (int)Consulta.Institucion && param.Gradoacademico > 0)
                {
                    formacion = await (from f in _ctxch.FormacionAcademica
                                       where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3 && f.EstaTitulado == true
                                       && f.Institucion.Descripcion.Contains(param.texto)
                                       && f.GradoAcademicoId == param.Gradoacademico
                                       select f)
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Institucion)
                                 .AsNoTracking().ToListAsync();
                }

                foreach (var persona in invest2)
                {
                    var formacionall = formacion.FindAll(x => x.ClavePersona == persona.ClavePersona);
                    if (formacionall.Count > 0)
                    {
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Persona = persona,
                            Formacion = formacionall,
                        }
                        );
                    }

                }

            }
            return catInvestigadores;
        }



        /// <summary>
        /// Metodo que devuelve una lista de personal vigente 
        /// segun los parametros enviados
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<List<CatInvestigadores>> investigadoresvigente(ParametrosConsultas param)
        {
            param.Fecha = DateTime.Now;
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            var invest2 = await CatalogoPersonasFechaEfectiva(param);

            if (invest2 != null)
            {
                List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                var formacionall = new List<FormacionAcademica>();
                if (param.Gradoacademico == 0)
                {
                    formacionall = await (from f in _ctxch.FormacionAcademica
                                          where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3
                                          select f)
                                       .Include(e => e.Carrera)
                                       .Include(e => e.Institucion)
                                       .AsNoTracking().ToListAsync();
                }
                if (param.Gradoacademico > 0)
                {
                    formacionall = await (from f in _ctxch.FormacionAcademica
                                          where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3
                                          && f.GradoAcademicoId == param.Gradoacademico
                                          select f)
                                     .Include(e => e.Carrera)
                                     .Include(e => e.Institucion)
                                     .AsNoTracking().ToListAsync();
                }

                foreach (var p in invest2)
                {
                    var formacion = formacionall.FindAll(x => x.ClavePersona == p.ClavePersona);
                    if (param.Gradoacademico > 0)
                    {
                        if (formacion.Count > 0)
                        {
                            catInvestigadores.Add(new CatInvestigadores
                            {
                                Fecha = param.Fecha,
                                Persona = p,
                                Formacion = formacion
                            }
                          );
                        }
                    }
                    else
                    {
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Fecha = param.Fecha,
                            Persona = p,
                            Formacion = formacion
                        }
                      );
                    }

                }
            }
            var consulta = catInvestigadores.Where(e => e.Persona.ClavePersona != null);
            if (param.Rango == 1)
            {
                consulta = consulta.Where(e => e.Edad >= param.EdadMinima && e.Edad <= param.EdadMaxima);
            }
            if (param.Antiguedad > 0)
            {
                consulta = consulta.Where(e => e.ExperienciaIIE >= param.Antiguedad);
            }
            if (param.Sexo > 0)
            {
                string sexo = param.Sexo == (int)Sexo.M ? Sexo.M.ToString() : Sexo.F.ToString();
                consulta = consulta.Where(e => e.Persona.sexo == sexo);
            }


            catInvestigadores = consulta.ToList();
            return catInvestigadores;
        }



        /// <summary>
        /// Metodo que devuelve una lista de personal vigente 
        /// segun los parametros enviados
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public async Task<List<CatInvestigadores>> investigadoresvigentesxfecha(ParametrosConsultas param)
        {
           
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            var invest2 = await CatalogoPersonasFechaEfectiva(param);

            if (invest2 != null)
            {
                List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                var formacionall = new List<FormacionAcademica>();
                if (param.Gradoacademico == 0)
                {
                    formacionall = await (from f in _ctxch.FormacionAcademica
                                          where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3
                                          select f)
                                       .Include(e => e.Carrera)
                                       .Include(e => e.Institucion)
                                       .AsNoTracking().ToListAsync();
                }
                if (param.Gradoacademico > 0)
                {
                    formacionall = await (from f in _ctxch.FormacionAcademica
                                          where personas.Contains(f.ClavePersona) && f.EstadoFlujoId == 3
                                          && f.GradoAcademicoId == param.Gradoacademico
                                          select f)
                                     .Include(e => e.Carrera)
                                     .Include(e => e.Institucion)
                                     .AsNoTracking().ToListAsync();
                }

                foreach (var p in invest2)
                {
                    var formacion = formacionall.FindAll(x => x.ClavePersona == p.ClavePersona);
                    if (param.Gradoacademico > 0)
                    {
                        if (formacion.Count > 0)
                        {
                            catInvestigadores.Add(new CatInvestigadores
                            {
                                Fecha = param.Fecha,
                                Persona = p,
                                Formacion = formacion
                            }
                          );
                        }
                    }
                    else
                    {
                        catInvestigadores.Add(new CatInvestigadores
                        {
                            Fecha = param.Fecha,
                            Persona = p,
                            Formacion = formacion
                        }
                      );
                    }

                }
            }
            var consulta = catInvestigadores.Where(e => e.Persona.ClavePersona != null);
            if (param.Rango == 1)
            {
                consulta = consulta.Where(e => e.Edad >= param.EdadMinima && e.Edad <= param.EdadMaxima);
            }
            if (param.Antiguedad > 0)
            {
                consulta = consulta.Where(e => e.ExperienciaIIE >= param.Antiguedad);
            }
            if (param.Sexo > 0)
            {
                string sexo = param.Sexo == (int)Sexo.M ? Sexo.M.ToString() : Sexo.F.ToString();
                consulta = consulta.Where(e => e.Persona.sexo == sexo);
            }


            catInvestigadores = consulta.ToList();
            return catInvestigadores;
        }


        /// <summary>
        /// lista de investigadores y su nivel de SNI
        /// </summary>
        /// <param name="param">fecha y clave de unidad</param>
        /// <returns>lista de investigadores y su nivel de SNI</returns>
        public async Task<List<CatInvestigadores>> investigadoresSNI(ParametrosConsultas param)
        {
            List<CatInvestigadores> catInvestigadores = new List<CatInvestigadores>();
            if (!(param.Claveunidad == null || param.Claveunidad == string.Empty))
            {
                var invest2 = await CatalogoPersonasPorFEClaveunidad(param);

                if (invest2 != null)
                {
                    List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                    var snis = new List<SNI>();
                    snis = await (from s in _ctxch.SNI.AsNoTracking()
                                  where personas.Contains(s.ClavePersona)
                                  && s.EstadoFlujoId == 3
                                  //Cambio pendiente
                                  && DbFunctions.TruncateTime(s.fechaTerminoNombramiento) >= DbFunctions.TruncateTime(param.Fecha)
                                  //&& s.fechaTerminoNombramiento <= param.Fecha
                                  orderby s.fechaTerminoNombramiento descending
                                  select s)
                                         .Include(e => e.NivelSNI)
                                         .Include(e => e.AreaSNI)
                                         .ToListAsync();

                    var entidad = await _ctx.dbSetUnidadOrganizacional
                                              .Where(x => x.FechaEfectiva == _ctx.dbSetUnidadOrganizacional
                                                                            .Where(f => f.FechaEfectiva <= param.Fecha
                                                                            && f.ClaveUnidad == x.ClaveUnidad)
                                                                            .Max(f => f.FechaEfectiva))
                                              .AsNoTracking().ToListAsync();

                    foreach (var persona in invest2)
                    {
                        var sni = snis.FindAll(x => x.ClavePersona == persona.ClavePersona).FirstOrDefault();

                        /***Cambio pendiente**/
                        if (sni != null)
                        {
                            persona.UnidadOrganizacional = entidad.Where(e => e.ClaveUnidad == param.Claveunidad).FirstOrDefault(); ;

                            catInvestigadores.Add(new CatInvestigadores
                            {
                                Persona = persona,
                                sni = sni == null ? new SNI() : sni,

                            }
                            );
                        }

                        //persona.UnidadOrganizacional = entidad.Where(e => e.ClaveUnidad == param.Claveunidad).FirstOrDefault(); ;

                        //catInvestigadores.Add(new CatInvestigadores
                        //{
                        //    Persona = persona,
                        //    sni = sni == null ? new SNI() : sni,
                        //});



                    }

                }

            }
            else
            {
                catInvestigadores = new List<CatInvestigadores>();
            }
            return catInvestigadores;
        }

        /// <summary>
        /// lista de investigadores y su nivel de SNI
        /// </summary>
        /// <param name="param">fecha y clave de unidad</param>
        /// <returns>lista de investigadores y su nivel de SNI</returns>
        public async Task<List<AnalisisSNI>> investigadoresAnalisis(ParametrosConsultas param)
        {
            param.Fecha = DateTime.Now;
            List<AnalisisSNI> AnalisisList = new List<AnalisisSNI>();
            if (!(param.Claveunidad == null || param.Claveunidad == string.Empty))
            {
                var invest2 = await CatalogoPersonasPorFEClaveunidad(param);

                if (invest2 != null)
                {
                    List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                    var snis = new List<SNI>();
                    snis = await (from s in _ctxch.SNI
                                  where personas.Contains(s.ClavePersona)
                                  && s.EstadoFlujoId == 3
                                  && s.fechaValidacion <= param.Fecha
                                  orderby s.fechaValidacion descending
                                  select s)
                                         .Include(e => e.NivelSNI)
                                         .Include(e => e.AreaSNI)
                                         .AsNoTracking().ToListAsync();

                    foreach (var persona in invest2)
                    {
                        var sni = snis.FindAll(x => x.ClavePersona == persona.ClavePersona).ToList();

                        if (sni.Count > 0)
                            AnalisisList.Add(new AnalisisSNI
                            {
                                Persona = persona,
                                snis = sni == null ? new List<SNI>() : sni
                            }
                            );


                    }

                }

            }
            else
            {
                AnalisisList = new List<AnalisisSNI>();
            }
            return AnalisisList;
        }




        /// <summary>
        /// lista de investigadores y su nivel de SNI
        /// </summary>
        /// <param name="param">fecha y clave de unidad</param>
        /// <returns>lista de investigadores y su nivel de SNI POR FECHA DE VALIDACION</returns>
        public async Task<List<AnalisisSNI>> investigadoresAnalisisXFecha(ParametrosConsultas param)
        {
           
            List<AnalisisSNI> AnalisisList = new List<AnalisisSNI>();
            if (!(param.Claveunidad == null || param.Claveunidad == string.Empty))
            {
                var invest2 = await CatalogoPersonasPorFEClaveunidad(param);

                if (invest2 != null)
                {
                    List<String> personas = new List<string>(invest2.Select(x => x.ClavePersona));
                    var snis = new List<SNI>();
                    snis = await (from s in _ctxch.SNI
                                  where personas.Contains(s.ClavePersona)
                                  && s.EstadoFlujoId == 3
                                  && s.fechaValidacion <= param.Fecha
                                  orderby s.fechaValidacion descending
                                  select s)
                                         .Include(e => e.NivelSNI)
                                         .Include(e => e.AreaSNI)
                                         .AsNoTracking().ToListAsync();

                    foreach (var persona in invest2)
                    {
                        var sni = snis.FindAll(x => x.ClavePersona == persona.ClavePersona).ToList();

                        if (sni.Count > 0)
                            AnalisisList.Add(new AnalisisSNI
                            {
                                Persona = persona,
                                snis = sni == null ? new List<SNI>() : sni
                            }
                            );


                    }

                }

            }
            else
            {
                AnalisisList = new List<AnalisisSNI>();
            }
            return AnalisisList;
        }





        public async Task<object> getIdiomasRepo(ParametrosConsultas para, List<string> claves)
        {
            try
            {
                var result = _ctxch.Idiomas
                    .Where(x => x.EstadoFlujoId == 3
                    && claves.Contains(x.ClavePersona)
                    && x.FechaValidacion < para.Fecha
                    )
                    .Include(x => x.Idioma)
                    .GroupBy(x => x.IdiomaId)
                    .Select(grupo => new
                    {
                        idioma = grupo.Select(i => i.Idioma.Descripcion).FirstOrDefault(),
                        cantidad = grupo.Count()
                    }
                        );
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<object> getforRepo(ParametrosConsultas para, List<string> claves)
        {
            try
            {
                var resultados = await _ctxch.FormacionAcademica
                    .Where(e => e.FechaValidacion <= para.Fecha && e.EstaTitulado == true &&
                    (e.GradoAcademicoId == 1 || e.GradoAcademicoId == 2 || e.GradoAcademicoId == 3) &&
                    claves.Contains(e.ClavePersona))
                    .GroupBy(x => x.ClavePersona)
                    .Select(x => x.OrderByDescending(y => y.GradoAcademicoId).FirstOrDefault())
                    .Include(x => x.GradoAcademico)
                    .AsNoTracking().ToListAsync();

                var totales = resultados
                    .GroupBy(x => x.GradoAcademicoId)
                    .Select(grupo => new
                    {
                        formacion = grupo.Select(e => e.GradoAcademico.Descripcion).FirstOrDefault(),
                        cantidad = grupo.Count(),
                        claves = grupo.Select(e => e.ClavePersona).ToList()
                    }
                    ).ToList();

                //se hace modificacion por investigadores que aun no registran formacion academica 

                if (resultados.Count < claves.Count)
                {
                    var clavesfaltantes = claves.Except(resultados.Select(x => x.ClavePersona));

                    totales.Add(new
                    {
                        formacion = "Sin clasificar",
                        cantidad = claves.Count - resultados.Count,
                        claves = clavesfaltantes.ToList()
                    });
                }

                List<object> objeto = new List<object>();
                int numerosum = 0;
                decimal porcentajesum = 0;
                int sexomsum = 0;
                int sexofsum = 0;
                decimal edadpromediosum = 0;
                decimal experienciapromsum = 0;
                foreach (var item in totales)
                {

                    int contador = Convert.ToInt32(item.cantidad);
                    decimal total = Convert.ToDecimal(claves.Count) / 100;
                    decimal porcent = contador / total;
                    porcent = Math.Round(porcent, 2);
                    List<Personas> personas = new List<Personas>();
                    List<CatInvestigadores> lista = new List<CatInvestigadores>();
                    personas = await _ctx.dbSetPersonas
                            .Where(x => item.claves.Contains(x.ClavePersona))
                            .GroupBy(x => x.ClavePersona)
                    .Select(x => x.OrderByDescending(y => y.FechaEfectiva).FirstOrDefault())
                    .AsNoTracking().ToListAsync();
                    foreach (var item3 in personas)
                    {
                        lista.Add(new CatInvestigadores
                        {
                            Persona = item3,
                            Fecha = Convert.ToDateTime(para.Fecha)
                        });
                    }
                    decimal experiencia = 0;
                    try
                    {
                        experiencia = lista.Sum(e => e.Experiencia) / lista.Count;
                    }
                    catch (Exception eDivCero) { }

                    experiencia = Math.Round(experiencia, 2);
                    var sexos = personas.OrderByDescending(x => x.sexo).GroupBy(x => x.sexo)
                        .Select(grupo => new
                        {
                            sexo = grupo.Select(i => i.sexo).FirstOrDefault(),
                            cantidad = grupo.Count()
                        });
                    var masculino = sexos.Where(e => e.sexo.Equals("M")).Select(r => r).FirstOrDefault();
                    var femenino = sexos.Where(e => e.sexo.Equals("F")).Select(r => r).FirstOrDefault();
                    var cantSexoMasculino = 0;
                    var cantSexoFemenino = 0;
                    //problems
                    if (masculino != null)
                    {
                        sexomsum = sexomsum + masculino.cantidad;
                        cantSexoMasculino = masculino.cantidad;
                    }

                    if (femenino != null)
                    {
                        sexofsum = sexofsum + femenino.cantidad;
                        cantSexoFemenino = femenino.cantidad;
                    }
                    decimal edad = 0;
                    try
                    {
                        edad = lista.Sum(e => e.Edad) / lista.Count;
                    }
                    catch (Exception eEdad) { }

                    edad = Math.Round(edad, 2);
                    numerosum = numerosum + item.cantidad;
                    porcentajesum = porcentajesum + porcent;
                    edadpromediosum = edadpromediosum + lista.Sum(e => e.Edad);
                    experienciapromsum = experienciapromsum + lista.Sum(e => e.Experiencia);

                    var obj = new
                    {
                        formacion = item.formacion,
                        cantidad = item.cantidad,
                        porcentaje = porcent,
                        sexom = cantSexoMasculino,
                        sexof = cantSexoFemenino,
                        edad = edad,
                        experiencia = experiencia
                    };
                    objeto.Add(obj);
                }
                edadpromediosum = edadpromediosum / claves.Count();
                edadpromediosum = Math.Round(edadpromediosum, 2);
                experienciapromsum = experienciapromsum / claves.Count();
                experienciapromsum = Math.Round(experienciapromsum, 2);
                var resultadoSUM = new
                {
                    formacion = "TOTAL",
                    cantidad = numerosum,
                    porcentaje = porcentajesum,
                    sexom = sexomsum,
                    sexof = sexofsum,
                    edad = edadpromediosum,
                    experiencia = experienciapromsum
                };
                objeto.Add(resultadoSUM);
                return objeto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public int getVigenteRepo(ParametrosConsultas para)
        {
            try
            {
                DateTime historico = Convert.ToDateTime("01/01/1900");
                var result = _ctxch.BecarioInterno
                    .Where(x => x.FechaInicioBeca <= para.Fecha
                    && (x.FechaTerminoBeca == null || x.FechaTerminoBeca >= para.Fecha || x.FechaTerminoBeca == historico)
                    && (x.fechaTerminoExt == null || x.fechaTerminoExt >= para.Fecha || x.fechaTerminoExt == historico)
                    )
                    .Count();
                return result;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
