using INEEL.DataAccess.CR.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.CR
{
    public class ListaAlianza
    {
        public string NombreAliado { get; set; }
        public string TipoOrganizacion { get; set; }
        public string ConvenioId { get; set; }
        public string ObjetoConv { get; set; }
        public string TipoConv { get; set; }
        public string Ambito { get; set; }
        public DateTime FInicioConc { get; set; }
        public DateTime? FTerminoConv { get; set; }
        public string TipoAccesoConv { get; set; }
        public List<AreaConvenio> AreaConvenio { get; set; }
        public string FirmaConv { get; set; }

        public string ProyectoId { get; set; }
        public string NombreProy { get; set; }
        public DateTime FInicioProy { get; set; }

        public string PropuestaId { get; set; }
        public string NombreProp { get; set; }
        public DateTime FInicioProp { get; set; }

        public int ActividadAdicionalId { get; set; }
        public string NombreActAdc { get; set; }
        public DateTime FechaActividad { get; set; }
    }

    public class ParametrosAliados
    {
        public int[] TipoConvenioId { get; set; }
        public string EstadoConvenio { get; set; }
        public int TipoOrganizacionId { get; set; }
        public int AmbitoConvId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaTermino { get; set; }
    }

    public class ListaAlianzaRes
    {
        public int AlianzaId { get; set; }
        public string NombreAliado { get; set; }
        public string TipoOrganizacion { get; set; }
        public List<conveniosAliadoRes> conveniosAliadoRes { get; set; }
        public List<ProyectosAliadoRes> ProyectosAliadoRes { get; set; }
        public List<PropuestasAliadoRes> PropuestasAliadoRes { get; set; }
        public List<ActividadesAdicionalAliadoRes> ActividadesAdicionalAliadoRes { get; set; }
    }

    public class conveniosAliadoRes {
        public int ConvenioId { get; set; }
        public int? AmbitoId { get; set; }
        public string Ambito { get; set; }
        public string TipoConv { get; set; }
        public DateTime FInicioConv { get; set; }
        public DateTime? FTerminoConv { get; set; }
        public int? AliadoId { get; set; }
    }

    public class ProyectosAliadoRes
    {
        public string ProyectoId { get; set; }
        public string NombreProy { get; set; }
        public DateTime FInicioProy { get; set; }
        public int? AliadoId { get; set; }
    }

    public class PropuestasAliadoRes
    {
        public string PropuestaId { get; set; }
        public string NombreProp { get; set; }
        public DateTime FInicioProp { get; set; }
        public int? AliadoId { get; set; }
    }
    public class ActividadesAdicionalAliadoRes
    {
        public int ActividadAdicionalId { get; set; }
        public string NombreActAdc { get; set; }
        public DateTime FechaActividad { get; set; }
        public int? AliadoId { get; set; }
    }

    public class EmpresasAliadoRes
    {
        public int EmpresaId { get; set; }
        public string NombreEmpresa { get; set; }
        public string TipoOrg { get; set; }
        public int? TipoOrgId { get; set; }

    }
}
