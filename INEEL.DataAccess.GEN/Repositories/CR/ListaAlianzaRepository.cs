using INEEL.DataAccess.CR.Models;
using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Util;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ListaAlianzaRepository : IDisposable { public void Dispose(){ _db.Dispose(); _dbGen.Dispose(); }
        GEN_Context _dbGen;
        CR_Context _db;
        DateTime fecha = new DateTime(0001, 01, 01);
        

        public ListaAlianzaRepository()
        {
            _dbGen = new GEN_Context();
            _db = new CR_Context();
            //_dbGen.Database.Log = Escribe.Write;
        }


        /// <summary>
        /// lista de alianzas 
        /// </summary>
        /// <param name="param">tipo convenio, estado convenio, tipo organizacion, ambito</param>
        /// <returns>lista de alianzas /returns>
        public async Task<List<ListaAlianza>> GetAlianzasByConv(ParametrosAliados param)
        {
            List<ListaAlianza> AliadosSelect = new List<ListaAlianza>();
            List<Convenio> LConv = new List<Convenio>();

            LConv = await (from conv in _db.Convenio
                               select conv)
                              .Include(e => e.TipoConvenio)
                              .Include(e => e.AmbitoConv)
                              .Include(e => e.AreaConvenio)
                              .Include("Aliado.Empresa")
                              .AsNoTracking()
                              .ToListAsync();
            int opc=0;

            ////Identifica Parametros
            if (param.TipoOrganizacionId != 0)
            {
                opc = 1;
            }
            else if (param.EstadoConvenio!=null )
            {
                opc = 2;
            }
            else if (param.AmbitoConvId != 0)
            {
                opc = 3;
            }
            else if (param.TipoConvenioId.Count()!=0)
            {
                opc = 4;
            }

            switch (opc)
            {
                case 1: //Dio el tipo de Organización;
                    AliadosSelect = await GetTipoOrganizacion(param.TipoOrganizacionId, param, LConv, AliadosSelect);
                    break;
                case 2: //Dio el estado del convenio;
                    AliadosSelect = await GetEstadoConvenio(param.EstadoConvenio, param, LConv, AliadosSelect);
                    break;
                case 3: //Dio el ambito;
                    AliadosSelect = await GetAmbito(param.AmbitoConvId, param, LConv, AliadosSelect);
                    break;
                case 4: //Dio el tipo de Convenio;
                    AliadosSelect = await GetTipoConvenio(param.TipoConvenioId, param, LConv, AliadosSelect);
                    break;
                default: //No dio nada;

                    AliadosSelect = await GetTipoConvenio(param.TipoConvenioId, param, LConv, AliadosSelect);
                    break;


            }
            AliadosSelect = AliadosSelect.OrderBy(x => x.NombreAliado).ToList();
            return AliadosSelect;
        }

        //Método para reporte de resultados por Alianza
        public async Task<List<ListaAlianza>> GetResAlianzasByConv(ParametrosAliados param)
        {
            List<ListaAlianza> AliadosSelect = new List<ListaAlianza>();
            List<Convenio> LConv = new List<Convenio>();

            LConv = await (from conv in _db.Convenio
                           select conv)
                              .Include(e => e.TipoConvenio)
                              .Include(e => e.AmbitoConv)
                              .Include(e => e.AreaConvenio)
                              .Include("Aliado.Empresa")
                              .AsNoTracking()
                              .ToListAsync();
            int opc = 0;

            ////Identifica Parametros
            if (param.TipoOrganizacionId != 0)
            {
                opc = 1;
            }
            else if (param.EstadoConvenio != null)
            {
                opc = 2;
            }
            else if (param.AmbitoConvId != 0)
            {
                opc = 3;
            }
            else if (param.TipoConvenioId.Count() != 0)
            {
                opc = 4;
            }

            switch (opc)
            {
                case 1: //Dio el tipo de Organización;
                    AliadosSelect = await GetResTipoOrganizacion(param.TipoOrganizacionId, param, LConv, AliadosSelect);
                    break;
                case 2: //Dio el estado del convenio;
                    AliadosSelect = await GetResEstadoConvenio(param.EstadoConvenio, param, LConv, AliadosSelect);
                    break;
                case 3: //Dio el ambito;
                    AliadosSelect = await GetResAmbito(param.AmbitoConvId, param, LConv, AliadosSelect);
                    break;
                case 4: //Dio el tipo de Convenio;
                    AliadosSelect = await GetResTipoConvenio(param.TipoConvenioId, param, LConv, AliadosSelect);
                    break;
                default: //No dio nada;

                   AliadosSelect = await GetResTipoConvenio(param.TipoConvenioId, param, LConv, AliadosSelect);
                    
                    break;


            }

            AliadosSelect= AliadosSelect.OrderBy(x => x.NombreAliado).ToList();
            return AliadosSelect;
        }
        public async Task<List<ListaAlianzaRes>> GetResAlianzasPDF(ParametrosAliados param)
        {
            List<ListaAlianzaRes> AliadosSel = new List<ListaAlianzaRes>();
            AliadosSel = await GetResAliado(param, AliadosSel);
            return AliadosSel;
        }

        public async Task<List<ListaAlianza>> GetTipoOrganizacion(int tipoOrg, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> ConveniosA = new List<Convenio>();
            if (tipoOrg != 0)
            {
                ConveniosA = ListaConv.Where(x => x.Aliado.Empresa.TipoOrganizacionId == tipoOrg).ToList();
            }
            else {
                ConveniosA = ListaConv;
            }

            if (ConveniosA.Count > 0) {
                AliadosS = await GetEstadoConvenio(parametros.EstadoConvenio, parametros, ConveniosA, AliadosS);
            }
           
            return AliadosS;
        }

        public async Task<List<ListaAlianza>> GetEstadoConvenio(string estadoConv, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> Convs = new List<Convenio>();

            if (estadoConv != null)
            {
                if (estadoConv.Equals("Vigente"))
                {
                    List<Convenio> ConveniosA = new List<Convenio>();
                    if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                    {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino >= parametros.FechaInicio
                                                    && x.FechaInicio <= parametros.FechaTermino).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }
                    else {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino > DateTime.Now).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }
                }
                else if (estadoConv.Equals("Vencido"))
                {
                    List<Convenio> ConveniosA = new List<Convenio>();
                    if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                    {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino >= parametros.FechaInicio
                                                    && x.FechaTermino <= parametros.FechaTermino).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }
                    else {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino <= DateTime.Now).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }

                }
            }
            else {
                Convs = ListaConv;
            }

            if (Convs.Count > 0)
            {
                AliadosS = await GetAmbito(parametros.AmbitoConvId, parametros, Convs, AliadosS);
            }

            
            return AliadosS;

        }

        public async Task<List<ListaAlianza>> GetAmbito(int ambito, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> ConveniosA = new List<Convenio>();
            if (ambito != 0)
            {
                ConveniosA = ListaConv.Where(x => x.AmbitoConvId == ambito).ToList();
            }
            else {
                ConveniosA = ListaConv;
            }

            if (ConveniosA.Count > 0)
            {
                AliadosS = await GetTipoConvenio(parametros.TipoConvenioId, parametros, ConveniosA, AliadosS);
            }

            
            return AliadosS;

        }

        public async Task<List<ListaAlianza>> GetTipoConvenio(int[] TipoConvenio, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> Convs = new List<Convenio>();
            var item = 0;

            if (TipoConvenio.Length > 0) {
                for (int i = 0; i < TipoConvenio.Length; i++)
                {
                    List<Convenio> ConveniosA = new List<Convenio>();
                    item = TipoConvenio[i];
                    ConveniosA = ListaConv.Where(x => x.TipoConvenioId == item).ToList();
                    Convs = ConveniosA.Union(Convs).ToList();
                }
            }
            else {
                Convs = ListaConv;
            }
            if (parametros.EstadoConvenio == null)
            {
                if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    Convs = Convs.Where(x => x.FechaTermino >= parametros.FechaInicio
                                                && x.FechaInicio <= parametros.FechaTermino).ToList();
                }
            }


            //Obtiene la lista de areas en el convenio
            var areas = new List<AreaConvenio>();
            areas = await (from auo in _db.AreaConvenio
                            select auo)
                                  .AsNoTracking()
                                  .ToListAsync();

            //Obtiene la lista de uos en las areasConvenio
            List<String> uos1 = new List<string>(areas.Select(x => x.ClaveUnidad.Trim()));
            List<String> uos2= uos1.Distinct().ToList();

            UORepository uo = new UORepository(_dbGen);
            List<UnidadOrganizacional> uos = new List<UnidadOrganizacional>();
            uos = await uo.GetAllByCollectionCR(uos2);

            foreach (Convenio ppc in Convs)
            {
                ListaAlianza obj = new ListaAlianza();
                obj.NombreAliado = ppc.Aliado.Empresa.NombreEmpresa;

                obj.TipoOrganizacion = await (from org in _db.TipoOrganizacion
                                  where org.TipoOrganizacionId == ppc.Aliado.Empresa.TipoOrganizacionId
                                              select org.Nombre).FirstOrDefaultAsync();
                obj.ObjetoConv = ppc.ObjetoConvenio;
                obj.ConvenioId = ppc.NoConvenio;
                obj.FInicioConc = ppc.FechaInicio;
                obj.FTerminoConv = ppc.FechaTermino;
                obj.TipoAccesoConv = ppc.TipoAcceso;
                obj.FirmaConv = ppc.Firma;
                obj.TipoConv= ppc.TipoConvenio.NomTipConv;

                foreach (AreaConvenio ar in ppc.AreaConvenio)
                {
                    var unidadId = ar.ClaveUnidad;
                    ar.UnidadOrganizacional = uos.Find(x => x.ClaveUnidad == unidadId);
                }

                obj.AreaConvenio = ppc.AreaConvenio.ToList();
                if (ppc.AmbitoConv != null)
                {
                    obj.Ambito = ppc.AmbitoConv.Nombre;
                }
                else {
                    obj.Ambito = "Sin Dato";
                }
                
                AliadosS.Add(obj);
            }

            return AliadosS;
        }

        public async Task<List<ListaAlianza>> GetResTipoOrganizacion(int tipoOrg, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> ConveniosA = new List<Convenio>();
            if (tipoOrg != 0)
            {
                ConveniosA = ListaConv.Where(x => x.Aliado.Empresa.TipoOrganizacionId == tipoOrg).ToList();
            }
            else {
                ConveniosA = ListaConv;
            }

            if (ConveniosA.Count > 0)
            {
                AliadosS = await GetResEstadoConvenio(parametros.EstadoConvenio, parametros, ConveniosA, AliadosS);
            }
            else {
                AliadosS = await GetProyectos(parametros, AliadosS);
                AliadosS = await GetPropuestas(parametros, AliadosS);
                AliadosS = await GetActAdic(parametros, AliadosS);
            }

            return AliadosS;
        }

        public async Task<List<ListaAlianza>> GetResEstadoConvenio(string estadoConv, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> Convs = new List<Convenio>();

            if (estadoConv != null)
            {
                if (estadoConv.Equals("Vigente"))
                {
                    List<Convenio> ConveniosA = new List<Convenio>();
                    if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                    {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino >= parametros.FechaInicio
                                                     && x.FechaInicio <= parametros.FechaTermino).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }
                    else {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino >= DateTime.Now).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }


                }
                else if (estadoConv.Equals("Vencido"))
                {
                    List<Convenio> ConveniosA = new List<Convenio>();
                    if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                    {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino >= parametros.FechaInicio
                                                    && x.FechaTermino <= parametros.FechaTermino).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }
                    else {
                        ConveniosA = ListaConv.Where(x => x.FechaTermino <= DateTime.Now).ToList();
                        Convs = ConveniosA.Union(Convs).ToList();
                    }

                }
            }
            else {
                Convs = ListaConv;
            }

            if (Convs.Count > 0)
            {
                AliadosS = await GetResAmbito(parametros.AmbitoConvId, parametros, Convs, AliadosS);
            }
            else {
                AliadosS = await GetProyectos(parametros, AliadosS);
                AliadosS = await GetPropuestas(parametros, AliadosS);
                AliadosS = await GetActAdic(parametros, AliadosS);
            }

            return AliadosS;

        }

        public async Task<List<ListaAlianza>> GetResAmbito(int ambito, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> ConveniosA = new List<Convenio>();
            if (ambito != 0)
            {
                ConveniosA = ListaConv.Where(x => x.AmbitoConvId == ambito).ToList();
            }
            else {
                ConveniosA = ListaConv;
            }

            if (ConveniosA.Count > 0)
            {
                AliadosS = await GetResTipoConvenio(parametros.TipoConvenioId, parametros, ConveniosA, AliadosS);
            }
            else {
                AliadosS = await GetProyectos(parametros, AliadosS);
                AliadosS = await GetPropuestas(parametros, AliadosS);
                AliadosS = await GetActAdic(parametros, AliadosS);
            }


            return AliadosS;

        }
        public async Task<List<ListaAlianza>> GetResTipoConvenio(int[] TipoConvenio, ParametrosAliados parametros, List<Convenio> ListaConv, List<ListaAlianza> AliadosS)
        {
            List<Convenio> Convs = new List<Convenio>();
            var item = 0;

            if (TipoConvenio.Length > 0)
            {
                for (int i = 0; i < TipoConvenio.Length; i++)
                {
                    List<Convenio> ConveniosA = new List<Convenio>();
                    item = TipoConvenio[i];
                    ConveniosA = ListaConv.Where(x => x.TipoConvenioId == item).ToList();
                    Convs = ConveniosA.Union(Convs).ToList();
                }
            }
            else {
                Convs = ListaConv;
            }

            if (parametros.EstadoConvenio==null)
            {
                List<Convenio> ConveniosA = new List<Convenio>();
                if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    ConveniosA = Convs.Where(x => x.FechaTermino >= parametros.FechaInicio
                                                 && x.FechaInicio <= parametros.FechaTermino).ToList();
                    Convs = ConveniosA;
                }
            }

                //Obtiene la lista de areas en el convenio
                var areas = new List<AreaConvenio>();
            areas = await (from auo in _db.AreaConvenio
                           select auo)
                                  .AsNoTracking()
                                  .ToListAsync();

            //Obtiene la lista de uos en las areasConvenio
            List<String> uos1 = new List<string>(areas.Select(x => x.ClaveUnidad.Trim()));
            List<String> uos2 = uos1.Distinct().ToList();

            UORepository uo = new UORepository(_dbGen);
            List<UnidadOrganizacional> uos = new List<UnidadOrganizacional>();
            uos = await uo.GetAllByCollectionCR(uos2);

            foreach (Convenio ppc in Convs)
            {
                ListaAlianza obj = new ListaAlianza();
                obj.NombreAliado = ppc.Aliado.Empresa.NombreEmpresa;

                obj.TipoOrganizacion = await (from org in _db.TipoOrganizacion
                                              where org.TipoOrganizacionId == ppc.Aliado.Empresa.TipoOrganizacionId
                                              select org.Nombre).FirstOrDefaultAsync();
                obj.ObjetoConv = ppc.ObjetoConvenio;
                obj.ConvenioId = ppc.NoConvenio;
                obj.FInicioConc = ppc.FechaInicio;
                obj.FTerminoConv = ppc.FechaTermino;
                obj.TipoAccesoConv = ppc.TipoAcceso;
                obj.FirmaConv = ppc.Firma;
                obj.TipoConv = ppc.TipoConvenio.NomTipConv;

                foreach (AreaConvenio ar in ppc.AreaConvenio)
                {
                    var unidadId = ar.ClaveUnidad;
                    ar.UnidadOrganizacional = uos.Find(x => x.ClaveUnidad == unidadId);
                }

                obj.AreaConvenio = ppc.AreaConvenio.ToList();
                if (ppc.AmbitoConv != null)
                {
                    obj.Ambito = ppc.AmbitoConv.Nombre;
                }
                else {
                    obj.Ambito = "Sin Dato";
                }

                AliadosS.Add(obj);
            }

            AliadosS= await GetProyectos(parametros, AliadosS);
            AliadosS = await GetPropuestas(parametros, AliadosS);
            AliadosS = await GetActAdic(parametros, AliadosS); 
            return AliadosS;
        }

        //Obtiene todas las alianzas por empresa
        public async Task<List<ListaAlianzaRes>> GetResAliado(ParametrosAliados parametros, List<ListaAlianzaRes> AliadosS)
        {
            List<conveniosAliadoRes> ListaConv = new List<conveniosAliadoRes>();
            List<ProyectosAliadoRes> ListaProy = new List<ProyectosAliadoRes>();
            List<PropuestasAliadoRes> ListaProp = new List<PropuestasAliadoRes>();
            List<ActividadesAdicionalAliadoRes> ListaActAdic = new List<ActividadesAdicionalAliadoRes>();
           
            List<EmpresasAliadoRes> empresas = new List<EmpresasAliadoRes>();
            EmpresasAliadoRes emp = new EmpresasAliadoRes();

           //Obtiene los Id´s de las empresas de acuerdo al filtro Tipo Organización
            empresas = await GetEmpresas(parametros.TipoOrganizacionId);
            List<int> empresasIds = new List<int>(empresas.Select(x => x.EmpresaId));
            List<int?> empresasIds2 = new List<int?>(empresas.Select(x => (int?)x.EmpresaId));

            //Obtiene los convenios
            ListaConv = await GetResConveniosEmpresas(parametros, empresasIds);

            //Obtiene los proyectos
            ListaProy = await GetResProyectos(parametros, empresasIds2);

            //Obtiene las propuestas
            ListaProp = await GetResPropuestas(parametros, empresasIds2);

            //Obtiene las actividades Adicionales
            ListaActAdic = await GetResActAdic(parametros, empresasIds2);

            //Crea la lista de resultados por aliado
            List<int?> Ids = new List<int?>();
            List<int?> ListaIds = new List<int?>();

            ListaIds =ListaConv.Select(x=> x.AliadoId).ToList();
            Ids = ListaIds.ToList();

            ListaIds = ListaProy.Select(x => x.AliadoId).ToList();
            Ids = Ids.Union(ListaIds).ToList();

            ListaIds = ListaProp.Select(x => x.AliadoId).ToList();
            Ids = Ids.Union(ListaIds).ToList();

            ListaIds = ListaActAdic.Select(x => x.AliadoId).ToList();
            Ids = Ids.Union(ListaIds).ToList();
            Ids = Ids.Distinct().ToList();

            for (int cont =0; cont < Ids.Count; cont++) {
                emp = empresas.Find(x => x.EmpresaId == Ids[cont]);

                ListaAlianzaRes obj = new ListaAlianzaRes();
                obj.AlianzaId = emp.EmpresaId;
                obj.NombreAliado = emp.NombreEmpresa;
                obj.TipoOrganizacion = emp.TipoOrg;
                obj.conveniosAliadoRes = ListaConv.Where(x => x.AliadoId == emp.EmpresaId).ToList();
                obj.ProyectosAliadoRes= ListaProy.Where(x => x.AliadoId == emp.EmpresaId).ToList();
                obj.PropuestasAliadoRes= ListaProp.Where(x => x.AliadoId == emp.EmpresaId).ToList();
                obj.ActividadesAdicionalAliadoRes = ListaActAdic.Where(x => x.AliadoId == emp.EmpresaId).ToList();
                AliadosS.Add(obj);
            }

            return AliadosS;
        }
        //Regresa los Id´s de las empresas que pertenecen al Tipo de Organización seleccionado
        //En caso de no haber seleccionado ningún tipo regresa todas
        public async Task<List<EmpresasAliadoRes>> GetEmpresas(int TipoOrganizacionId)
        {
            List<EmpresasAliadoRes> empresasRes = new List<EmpresasAliadoRes>();
           
            if (TipoOrganizacionId > 0)
            {
                var empresas = await _db.Empresa
                    .AsNoTracking()
                    .Include(e=> e.TipoOrganizacion)
                    .Where(x => x.TipoOrganizacionId == TipoOrganizacionId)
                   .Select(x => new EmpresasAliadoRes
                   {
                       EmpresaId = x.EmpresaId,
                       NombreEmpresa = x.NombreEmpresa,
                       TipoOrg = x.TipoOrganizacion.Nombre,
                       TipoOrgId = x.TipoOrganizacion.TipoOrganizacionId
                   })
                    .ToListAsync();
                empresasRes.AddRange(empresas);
            }
            else {
                var empresas = await _db.Empresa
                    .AsNoTracking()
                    .Include(e => e.TipoOrganizacion)
                   .Select(x => new EmpresasAliadoRes
                   {
                       EmpresaId = x.EmpresaId,
                       NombreEmpresa = x.NombreEmpresa,
                       TipoOrg = x.TipoOrganizacion.Nombre,
                       TipoOrgId = x.TipoOrganizacion.TipoOrganizacionId
                   })
                    .ToListAsync();
                empresasRes.AddRange(empresas);
            }

            //List<int> empresasIds = new List<int>(empresas.Select(x => x.EmpresaId));
            //var newList = empresasIds.Select(i => (int?)i).ToList();

            return empresasRes;
        }

        public async Task<List<conveniosAliadoRes>> GetResConveniosEmpresas(ParametrosAliados parametros, List<int> empresas)
        {
            List<Convenio> ListaConv1 = new List<Convenio>();
            List<conveniosAliadoRes> ConveniosA = new List<conveniosAliadoRes>();
            List<conveniosAliadoRes> ListaConv = new List<conveniosAliadoRes>();

            //Compara Aliado.TipoOrg (lista previamente filtrada) y tipoConvenio
            if (parametros.TipoConvenioId.Length > 0)
            {
                var L = await _db.Convenio
                           .AsNoTracking()
                           .Include(e => e.TipoConvenio)
                           .Include(e => e.AmbitoConv)
                           .Include("Aliado.Empresa")
                           .Where(x => empresas.Contains(x.Aliado.Empresa.EmpresaId))
                           .Where(x => parametros.TipoConvenioId.Contains(x.TipoConvenioId))
                           .Select(x => new conveniosAliadoRes
                           {
                               ConvenioId = x.ConvenioId,
                               Ambito = x.AmbitoConv.Nombre,
                               TipoConv = x.TipoConvenio.NomTipConv,
                               FInicioConv = x.FechaInicio,
                               FTerminoConv = x.FechaTermino,
                               AliadoId = x.Aliado.EmpresaId
                           })
                           .ToListAsync();
                            ListaConv.AddRange(L);
            }
            else {
                var L = await _db.Convenio
                           .AsNoTracking()
                           .Include(e => e.TipoConvenio)
                           .Include(e => e.AmbitoConv)
                           .Include("Aliado.Empresa")
                           .Where(x => empresas.Contains(x.Aliado.Empresa.EmpresaId))
                           .Select(x => new conveniosAliadoRes
                           {
                               ConvenioId = x.ConvenioId,
                               Ambito = x.AmbitoConv.Nombre,
                               AmbitoId = x.AmbitoConvId,
                               TipoConv = x.TipoConvenio.NomTipConv,
                               FInicioConv = x.FechaInicio,
                               FTerminoConv = x.FechaTermino,
                               AliadoId = x.Aliado.Empresa.EmpresaId
                           })
                           .ToListAsync();
                            ListaConv.AddRange(L);

            }

            //Compara Ambito
            if (parametros.AmbitoConvId != 0)
            {
                ConveniosA = ListaConv.Where(x => x.AmbitoId == parametros.AmbitoConvId).ToList();
                ListaConv = ConveniosA;
            }
            else {
                ConveniosA = ListaConv;

            }

            //Compara Periodo
            if (parametros.EstadoConvenio != null)
            {
                if (parametros.EstadoConvenio.Equals("Vigente"))
                {
                    //List<Convenio> Convs = new List<Convenio>();
                    if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                    {
                        ConveniosA = ListaConv.Where(x => x.FTerminoConv >= parametros.FechaInicio
                                                     && x.FInicioConv <= parametros.FechaTermino).ToList();
                        ListaConv = ConveniosA;
                    }
                    else {
                        ConveniosA = ListaConv.Where(x => x.FTerminoConv >= DateTime.Now).ToList();
                        ListaConv = ConveniosA;
                    }
                }
                else if (parametros.EstadoConvenio.Equals("Vencido"))
                {
                    if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                    {
                        ConveniosA = ListaConv.Where(x => x.FTerminoConv >= parametros.FechaInicio
                                                    && x.FTerminoConv <= parametros.FechaTermino).ToList();
                        ListaConv = ConveniosA;
                    }
                    else {
                        ConveniosA = ListaConv.Where(x => x.FTerminoConv <= DateTime.Now).ToList();
                        ListaConv = ConveniosA;
                    }

                }
            }
            else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
            {
                ConveniosA = ListaConv.Where(x => x.FTerminoConv >= parametros.FechaInicio
                                                && x.FInicioConv <= parametros.FechaTermino).ToList();
                //ListaConv = ConveniosA;
            }
            else {
                ConveniosA = ListaConv;
            }



            return ConveniosA;
        }
        public async Task<List<ProyectosAliadoRes>> GetResProyectos(ParametrosAliados parametros, List<int?> empresas)
        {
            try
            {
                List<ProyectosAliadoRes> Proyects = new List<ProyectosAliadoRes>();

                if (parametros.EstadoConvenio != null)
                {
                    if (parametros.EstadoConvenio.Equals("Vigente"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {
                           var ListaP = await _dbGen.dbSetProyectoGEN
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresas.Contains(x.EmpresaId))
                                .Where(x => x.FechaFin >= parametros.FechaInicio
                                            && x.FechaInicio <= parametros.FechaTermino)
                                .Select(x => new ProyectosAliadoRes
                                {
                                    ProyectoId = x.ProyectoId,
                                    NombreProy = x.Nombre,
                                    FInicioProy = x.FechaInicio,
                                    AliadoId=x.EmpresaId
                                })
                                .ToListAsync();
                                Proyects.AddRange(ListaP);
                        }
                        else
                        {
                            var ListaP = await _dbGen.dbSetProyectoGEN.AsNoTracking()
                           .Include(x => x.Empresa)
                           .Where(x => empresas.Contains(x.EmpresaId))
                           .Where(x => x.FechaFin >= DateTime.Now)
                           .Select(x => new ProyectosAliadoRes
                           {
                               ProyectoId = x.ProyectoId,
                               NombreProy = x.Nombre,
                               FInicioProy = x.FechaInicio,
                               AliadoId = x.EmpresaId
                           })
                                .ToListAsync();
                            Proyects.AddRange(ListaP);
                        }
                    }
                    else if (parametros.EstadoConvenio.Equals("Vencido"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {

                            var ListaP = await _dbGen.dbSetProyectoGEN
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresas.Contains(x.EmpresaId))
                                .Where(x => x.FechaFin >= parametros.FechaInicio
                                                        && x.FechaFin <= parametros.FechaTermino)
                                 .Select(x => new ProyectosAliadoRes
                                 {
                                     ProyectoId = x.ProyectoId,
                                     NombreProy = x.Nombre,
                                     FInicioProy = x.FechaInicio,
                                     AliadoId = x.EmpresaId
                                 })
                                .ToListAsync();
                            Proyects.AddRange(ListaP);
                        }
                        else
                        {
                            var ListaP = await _dbGen.dbSetProyectoGEN.AsNoTracking()
                           .Include(x => x.Empresa)
                           .Where(x => empresas.Contains(x.EmpresaId))
                           .Where(x => x.FechaFin <= DateTime.Now)
                           .Select(x => new ProyectosAliadoRes
                           {
                               ProyectoId = x.ProyectoId,
                               NombreProy = x.Nombre,
                               FInicioProy = x.FechaInicio,
                               AliadoId = x.EmpresaId
                           })
                                .ToListAsync();
                            Proyects.AddRange(ListaP);
                        }
                    }
                }

                else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    var ListaP = await _dbGen.dbSetProyectoGEN.AsNoTracking()
                   .Include(x => x.Empresa)
                   .Where(x => empresas.Contains(x.EmpresaId))
                   .Where(x => x.FechaFin >= parametros.FechaInicio
                                            && x.FechaInicio <= parametros.FechaTermino)
                   .Select(x => new ProyectosAliadoRes
                   {
                       ProyectoId = x.ProyectoId,
                       NombreProy = x.Nombre,
                       FInicioProy = x.FechaInicio,
                       AliadoId = x.EmpresaId
                   })
                                .ToListAsync();
                    Proyects.AddRange(ListaP);
                }
                else {
                    var ListaP = await _dbGen.dbSetProyectoGEN
                        .AsNoTracking()
                        .Include(x => x.Empresa)
                        .Where(x => empresas.Contains(x.EmpresaId))
                        .Select(x => new ProyectosAliadoRes
                        {
                            ProyectoId = x.ProyectoId,
                            NombreProy = x.Nombre,
                            FInicioProy = x.FechaInicio,
                            AliadoId = x.EmpresaId
                        })
                                .ToListAsync();
                    Proyects.AddRange(ListaP);
                }

                return Proyects;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
        public async Task<List<ListaAlianza>> GetProyectos(ParametrosAliados parametros, List<ListaAlianza> AliadosS)
        {
           List<Empresa> empresas = new List<Empresa>();

            if (parametros.TipoOrganizacionId > 0)
            {
                empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(x => x.TipoOrganizacionId == parametros.TipoOrganizacionId)
                    .Where(x => x.Estado == true)
                    .ToListAsync();

            }
            else {
                empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(x => x.Estado == true)
                    .ToListAsync();
            }

            List<int> empresasIds = new List<int>(empresas.Select(x => x.EmpresaId));
            var newList = empresasIds.Select(i => (int?)i).ToList();

            List<Proyecto> proyectosEm = await GetAllProyectsByCollection(newList, parametros);

            //Proyectos
            foreach (Proyecto proy in proyectosEm)
            {
                ListaAlianza obj2 = new ListaAlianza();
                obj2.NombreAliado = proy.Empresa.NombreEmpresa;

                if (proy.Empresa != null ) {
                    if (proy.Empresa.TipoOrganizacionId!=0) {
                        obj2.TipoOrganizacion = await (from org in _db.TipoOrganizacion
                                                       where org.TipoOrganizacionId == proy.Empresa.TipoOrganizacionId
                                                       select org.Nombre).FirstOrDefaultAsync();
                    }
                }
               
                obj2.ProyectoId = proy.ProyectoId;
                obj2.NombreProy = proy.Nombre;
                obj2.FInicioProy = proy.FechaInicio;
                AliadosS.Add(obj2);
            }

            return AliadosS;
        }

        public async Task<List<PropuestasAliadoRes>> GetResPropuestas(ParametrosAliados parametros, List<int?> empresas)
        {
            try
            {
                List<PropuestasAliadoRes> Propuestas = new List<PropuestasAliadoRes>();

                if (parametros.EstadoConvenio != null)
                {
                    if (parametros.EstadoConvenio.Equals("Vigente"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {
                            var ListaProp = await _dbGen.dbSetPropuesta
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresas.Contains(x.EmpresaId))
                                .Where(x => x.Fecha >= parametros.FechaInicio && x.Fecha <= parametros.FechaTermino)
                               .Select(x => new PropuestasAliadoRes
                               {
                                   PropuestaId = x.PropuestaId,
                                   NombreProp = x.Titulo,
                                   FInicioProp = x.Fecha,
                                   AliadoId = x.EmpresaId
                               })
                                .ToListAsync();
                            Propuestas.AddRange(ListaProp);
                        }
                        else
                        {
                            var ListaProp = await _dbGen.dbSetPropuesta.AsNoTracking()
                           .Include(x => x.Empresa)
                           .Where(x => empresas.Contains(x.EmpresaId))
                           .Where(x => x.Fecha >= DateTime.Now)
                           .Select(x => new PropuestasAliadoRes
                           {
                               PropuestaId = x.PropuestaId,
                               NombreProp = x.Titulo,
                               FInicioProp = x.Fecha,
                               AliadoId = x.EmpresaId
                           })
                                .ToListAsync();
                            Propuestas.AddRange(ListaProp);
                        }
                    }
                    else if (parametros.EstadoConvenio.Equals("Vencido"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {

                            var ListaProp = await _dbGen.dbSetPropuesta
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresas.Contains(x.EmpresaId))
                                .Where(x => x.Fecha >= parametros.FechaInicio && x.Fecha <= parametros.FechaTermino)
                                .Select(x => new PropuestasAliadoRes
                                {
                                    PropuestaId = x.PropuestaId,
                                    NombreProp = x.Titulo,
                                    FInicioProp = x.Fecha,
                                    AliadoId = x.EmpresaId
                                })
                                .ToListAsync();
                            Propuestas.AddRange(ListaProp);
                        }
                        else
                        {
                            var ListaProp = await _dbGen.dbSetPropuesta
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresas.Contains(x.EmpresaId))
                                .Where(x => x.Fecha <= DateTime.Now)
                                .Select(x => new PropuestasAliadoRes
                                {
                                    PropuestaId = x.PropuestaId,
                                    NombreProp = x.Titulo,
                                    FInicioProp = x.Fecha,
                                    AliadoId = x.EmpresaId
                                })
                                .ToListAsync();
                            Propuestas.AddRange(ListaProp);
                        }
                    }
                }

                else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    var ListaProp = await _dbGen.dbSetPropuesta.AsNoTracking()
                   .Include(x => x.Empresa)
                   .Where(x => empresas.Contains(x.EmpresaId))
                   .Where(x => x.Fecha >= parametros.FechaInicio && x.Fecha <= parametros.FechaTermino)
                   .Select(x => new PropuestasAliadoRes
                   {
                       PropuestaId = x.PropuestaId,
                       NombreProp = x.Titulo,
                       FInicioProp = x.Fecha,
                       AliadoId = x.EmpresaId
                   })
                                .ToListAsync();
                    Propuestas.AddRange(ListaProp);
                }
                else {
                    var ListaProp = await _dbGen.dbSetPropuesta
                        .AsNoTracking()
                        .Include(x => x.Empresa)
                        .Where(x => empresas.Contains(x.EmpresaId))
                        .Select(x => new PropuestasAliadoRes
                        {
                            PropuestaId = x.PropuestaId,
                            NombreProp = x.Titulo,
                            FInicioProp = x.Fecha,
                            AliadoId = x.EmpresaId
                        })
                                .ToListAsync();
                    Propuestas.AddRange(ListaProp);
                }
                return Propuestas;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<ListaAlianza>> GetPropuestas(ParametrosAliados parametros, List<ListaAlianza> AliadosS)
        {
            List<Empresa> empresas = new List<Empresa>();

            if (parametros.TipoOrganizacionId > 0)
            {
                empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(x => x.TipoOrganizacionId == parametros.TipoOrganizacionId)
                    .Where(x => x.Estado == true)
                    .ToListAsync();

            }
            else {
                empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(x => x.Estado == true)
                    .ToListAsync();
            }

            List<int> empresasIds = new List<int>(empresas.Select(x => x.EmpresaId));
            var newList = empresasIds.Select(i => (int?)i).ToList();

            List<Propuestas> propuestasEm = await GetAllPropuestasByCollection(newList, parametros);

            //Proyectos
            foreach (Propuestas prop in propuestasEm)
            {
                ListaAlianza obj2 = new ListaAlianza();
                obj2.NombreAliado = prop.Empresa.NombreEmpresa;

                if (prop.Empresa != null)
                {
                    if (prop.Empresa.TipoOrganizacionId != 0)
                    {
                        obj2.TipoOrganizacion = await (from org in _db.TipoOrganizacion
                                                       where org.TipoOrganizacionId == prop.Empresa.TipoOrganizacionId
                                                       select org.Nombre).FirstOrDefaultAsync();
                    }
                }

                obj2.PropuestaId = prop.PropuestaId;
                obj2.NombreProp = prop.Titulo;
                obj2.FInicioProp = prop.Fecha;
                AliadosS.Add(obj2);
            }

            return AliadosS;
        }

        public async Task<List<ActividadesAdicionalAliadoRes>> GetResActAdic(ParametrosAliados parametros, List<int?> empresas)
        {
            try {
                List<ActividadesAdicionalAliadoRes> ActAdics = new List<ActividadesAdicionalAliadoRes>();

                if (parametros.EstadoConvenio != null)
                {
                    if (parametros.EstadoConvenio.Equals("Vigente"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {
                            var act = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresas.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= parametros.FechaInicio && x.FechaActividad <= parametros.FechaTermino)
                                .Select(x => new ActividadesAdicionalAliadoRes
                                {
                                    ActividadAdicionalId = x.ActividadAdicionalId,
                                    NombreActAdc = x.Descripcion,
                                    FechaActividad = x.FechaActividad,
                                    AliadoId = x.Aliado.EmpresaId
                                })
                                .ToListAsync();
                            ActAdics.AddRange(act);
                        }
                        else
                        {
                            var act = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresas.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= DateTime.Now)
                                .Select(x => new ActividadesAdicionalAliadoRes
                                {
                                    ActividadAdicionalId = x.ActividadAdicionalId,
                                    NombreActAdc = x.Descripcion,
                                    FechaActividad = x.FechaActividad,
                                    AliadoId = x.Aliado.EmpresaId
                                })
                                .ToListAsync();
                            ActAdics.AddRange(act);
                        }
                    }
                    else if (parametros.EstadoConvenio.Equals("Vencido"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {

                            var act = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresas.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= parametros.FechaInicio && x.FechaActividad <= parametros.FechaTermino)
                                .Select(x => new ActividadesAdicionalAliadoRes
                                {
                                    ActividadAdicionalId = x.ActividadAdicionalId,
                                    NombreActAdc = x.Descripcion,
                                    FechaActividad = x.FechaActividad,
                                    AliadoId = x.Aliado.EmpresaId
                                })
                                .ToListAsync();
                            ActAdics.AddRange(act);
                        }
                        else
                        {
                            var act = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresas.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= DateTime.Now)
                                .Select(x => new ActividadesAdicionalAliadoRes
                                {
                                    ActividadAdicionalId = x.ActividadAdicionalId,
                                    NombreActAdc = x.Descripcion,
                                    FechaActividad = x.FechaActividad,
                                    AliadoId = x.Aliado.EmpresaId
                                })
                                .ToListAsync();
                            ActAdics.AddRange(act);
                        }
                    }
                }

                else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    var act = await _db.ActividadAdicional.AsNoTracking()
                   .Include("Aliado.Empresa")
                   .Where(x => empresas.Contains(x.Aliado.EmpresaId))
                   .Where(x => x.FechaActividad >= parametros.FechaInicio && x.FechaActividad <= parametros.FechaTermino)
                   .Select(x => new ActividadesAdicionalAliadoRes
                   {
                       ActividadAdicionalId = x.ActividadAdicionalId,
                       NombreActAdc = x.Descripcion,
                       FechaActividad = x.FechaActividad,
                       AliadoId = x.Aliado.EmpresaId
                   })
                                .ToListAsync();
                    ActAdics.AddRange(act);
                }
                else {
                    var act = await _db.ActividadAdicional
                        .AsNoTracking()
                        .Include("Aliado.Empresa")
                        .Where(x => empresas.Contains(x.Aliado.EmpresaId))
                        .Select(x => new ActividadesAdicionalAliadoRes
                        {
                            ActividadAdicionalId = x.ActividadAdicionalId,
                            NombreActAdc = x.Descripcion,
                            FechaActividad = x.FechaActividad,
                            AliadoId = x.Aliado.EmpresaId
                        })
                                .ToListAsync();
                    ActAdics.AddRange(act);
                }
                return ActAdics;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }
        public async Task<List<ListaAlianza>> GetActAdic(ParametrosAliados parametros, List<ListaAlianza> AliadosS)
        {
            List<Empresa> empresas = new List<Empresa>();

            if (parametros.TipoOrganizacionId > 0)
            {
                empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(x => x.TipoOrganizacionId == parametros.TipoOrganizacionId)
                    .Where(x => x.Estado == true)
                    .ToListAsync();

            }
            else {
                empresas = await _db.Empresa
                    .AsNoTracking()
                    .Where(x => x.Estado == true)
                    .ToListAsync();
            }

            List<int> empresasIds = new List<int>(empresas.Select(x => x.EmpresaId));
            var newList = empresasIds.Select(i => (int?)i).ToList();

            List<ActividadAdicional> ActAdicsEm = await GetAllActAdicByCollection(newList, parametros);

            //Proyectos
            foreach (ActividadAdicional actAd in ActAdicsEm)
            {
                ListaAlianza obj2 = new ListaAlianza();
                obj2.NombreAliado = actAd.Aliado.Empresa.NombreEmpresa;

                if (actAd.Aliado.Empresa != null)
                {
                    if (actAd.Aliado.Empresa.TipoOrganizacionId != 0)
                    {
                        obj2.TipoOrganizacion = await (from org in _db.TipoOrganizacion
                                                       where org.TipoOrganizacionId == actAd.Aliado.Empresa.TipoOrganizacionId
                                                       select org.Nombre).FirstOrDefaultAsync();
                    }
                }

                obj2.ActividadAdicionalId = actAd.ActividadAdicionalId;
                obj2.NombreActAdc = actAd.Descripcion;
                obj2.FechaActividad = actAd.FechaActividad;
                AliadosS.Add(obj2);
            }

            return AliadosS;
        }

        public async Task<List<Proyecto>> GetAllProyectsByCollection(List<int?> empresasId, ParametrosAliados parametros)
        {
            try
            {
                List<Proyecto> entities = new List<Proyecto>();

                if (parametros.EstadoConvenio!= null)
                {
                    if (parametros.EstadoConvenio.Equals("Vigente"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {
                            entities = await _dbGen.dbSetProyectoGEN
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresasId.Contains(x.EmpresaId))
                                .Where(x => x.FechaFin >= parametros.FechaInicio
                                            && x.FechaInicio <= parametros.FechaTermino)
                                .ToListAsync();
                        }
                        else 
                        {
                            entities = await _dbGen.dbSetProyectoGEN.AsNoTracking()
                           .Include(x => x.Empresa)
                           .Where(x => empresasId.Contains(x.EmpresaId))
                           .Where(x => x.FechaFin >= DateTime.Now)
                           .ToListAsync();
                        }
                    }
                    else if (parametros.EstadoConvenio.Equals("Vencido"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {

                            entities = await _dbGen.dbSetProyectoGEN
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresasId.Contains(x.EmpresaId))
                                .Where(x => x.FechaFin >= parametros.FechaInicio
                                                        && x.FechaFin <= parametros.FechaTermino).ToListAsync();
                        }
                        else
                        {
                            entities = await _dbGen.dbSetProyectoGEN.AsNoTracking()
                           .Include(x => x.Empresa)
                           .Where(x => empresasId.Contains(x.EmpresaId))
                           .Where(x => x.FechaFin <= DateTime.Now)
                           .ToListAsync();
                        }
                    }
                }

                else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    entities = await _dbGen.dbSetProyectoGEN.AsNoTracking()
                   .Include(x => x.Empresa)
                   .Where(x => empresasId.Contains(x.EmpresaId))
                   .Where(x => x.FechaFin >= parametros.FechaInicio
                                            && x.FechaInicio <= parametros.FechaTermino)
                   .ToListAsync();
                }
                else {
                    entities = await _dbGen.dbSetProyectoGEN
                        .AsNoTracking()
                        .Include(x => x.Empresa)
                        .Where(x => empresasId.Contains(x.EmpresaId))
                        .ToListAsync();
                }
            return entities;
        }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<Propuestas>> GetAllPropuestasByCollection(List<int?> empresasId, ParametrosAliados parametros)
        {
            try
            {
                List<Propuestas> entities = new List<Propuestas>();
                
                if (parametros.EstadoConvenio != null)
                {
                    if (parametros.EstadoConvenio.Equals("Vigente"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {
                            entities = await _dbGen.dbSetPropuesta
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresasId.Contains(x.EmpresaId))
                                .Where(x => x.Fecha >= parametros.FechaInicio && x.Fecha <= parametros.FechaTermino)
                                //.Where(x => x.Fecha.Year >= parametros.FechaInicio.Year)
                                .ToListAsync();
                        }
                        else
                        {
                            entities = await _dbGen.dbSetPropuesta.AsNoTracking()
                           .Include(x => x.Empresa)
                           .Where(x => empresasId.Contains(x.EmpresaId))
                           .Where(x => x.Fecha >= DateTime.Now)
                           .ToListAsync();
                        }
                    }
                    else if (parametros.EstadoConvenio.Equals("Vencido"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {

                            entities = await _dbGen.dbSetPropuesta
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresasId.Contains(x.EmpresaId))
                                .Where(x => x.Fecha >= parametros.FechaInicio && x.Fecha <= parametros.FechaTermino).ToListAsync();
                        }
                        else
                        {
                            entities = await _dbGen.dbSetPropuesta
                                .AsNoTracking()
                                .Include(x => x.Empresa)
                                .Where(x => empresasId.Contains(x.EmpresaId))
                                .Where(x => x.Fecha <= DateTime.Now)
                                .ToListAsync();
                        }
                    }
                }

                else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    entities = await _dbGen.dbSetPropuesta.AsNoTracking()
                   .Include(x => x.Empresa)
                   .Where(x => empresasId.Contains(x.EmpresaId))
                   .Where(x => x.Fecha >= parametros.FechaInicio && x.Fecha <= parametros.FechaTermino)
                   .ToListAsync();
                }
                else {
                    entities = await _dbGen.dbSetPropuesta
                        .AsNoTracking()
                        .Include(x => x.Empresa)
                        .Where(x => empresasId.Contains(x.EmpresaId))
                        .ToListAsync();
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<List<ActividadAdicional>> GetAllActAdicByCollection(List<int?> empresasId, ParametrosAliados parametros)
        {
            try
            {
                List<ActividadAdicional> entities = new List<ActividadAdicional>();

                if (parametros.EstadoConvenio != null)
                {
                    if (parametros.EstadoConvenio.Equals("Vigente"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {
                            entities = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresasId.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= parametros.FechaInicio && x.FechaActividad <= parametros.FechaTermino)
                               
                                .ToListAsync();
                        }
                        else
                        {
                            entities = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresasId.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= DateTime.Now)
                                .ToListAsync();
                        }
                    }
                    else if (parametros.EstadoConvenio.Equals("Vencido"))
                    {
                        if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                        {

                            entities = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresasId.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= parametros.FechaInicio && x.FechaActividad <= parametros.FechaTermino).ToListAsync();
                        }
                        else
                        {
                            entities = await _db.ActividadAdicional
                                .AsNoTracking()
                                .Include("Aliado.Empresa")
                                .Where(x => empresasId.Contains(x.Aliado.EmpresaId))
                                .Where(x => x.FechaActividad >= DateTime.Now)
                                .ToListAsync();
                        }
                    }
                }

                else if (parametros.FechaInicio != fecha && parametros.FechaTermino != fecha)
                {
                    entities = await _db.ActividadAdicional.AsNoTracking()
                   .Include("Aliado.Empresa")
                   .Where(x => empresasId.Contains(x.Aliado.EmpresaId))
                   .Where(x => x.FechaActividad >= parametros.FechaInicio && x.FechaActividad <= parametros.FechaTermino)
                   .ToListAsync();
                }
                else {
                    entities = await _db.ActividadAdicional
                        .AsNoTracking()
                        .Include("Aliado.Empresa")
                        .Where(x => empresasId.Contains(x.Aliado.EmpresaId))
                        .ToListAsync();
                }
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }
    }
}
