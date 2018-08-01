using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.PI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.PI.Models
{
    public class BusquedaParams
    {
        //Esta clase se utiliza para realizar la proyeccion de consultas en LINQ
        //En lugar de devolver un objeto anonimo (no siempre se puede en las consultas) se devuelve un objeto de este tipo
        public int DerechosAutorId { get; set; }

        public int propiedadIndustrialId { get; set; }

        public Boolean EspropiedadInstituto { get; set; }

        public string TitularPropiedadPatrimonial { get; set; }
        
        public string Titulo { get; set; }

        public string Sintesis { get; set; }

        public int RamaId { get; set; }
        public virtual Rama Rama { get; set; }

        public int Esderivada { get; set; }

        public int DerechosAutorPadre { get; set; }

        public Boolean RelacionMedianteProyecto { get; set; }

        public string NumeroProyecto { get; set; }

        public string  Proyecto { get; set; }

        public string ClaveUnidad { get; set; }

        public string tipoPropiedadIndustrial { get; set; }

        public string estadoDelProceso { get; set; }
        public string expediente { get; set; }

        public DateTime? fechaExpedicion2 { get; set; }

        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        public string UnidadPadre { get; set; }

        public DateTime FechaExpedicion { get; set; }

        public DateTime? FechaSolicitud { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public DateTime? fechaPresentacion { get; set; }

        public DateTime? fechaVencimiento { get; set; }

        public DateTime? fechaProximoPago { get; set; }
        
        public int numeroTitulo { get; set; }

        /// <summary>
        /// Número de registro
        /// </summary>
        public string Certificado { get; set; }

        public string Observaciones { get; set; }

        public string ConsecutivoInterno { get; set; }

        public int EstadoFlujoId { get; set; }
        public virtual EstadoFlujo EstadoFlujo { get; set; }

        public long? AdjuntoId { get; set; }
        public virtual Adjunto Adjunto { get; set; }

        public virtual ICollection<AutoresDA> Autores { get; set; }

        public virtual ICollection<AutoresPI> inventores { get; set; }

        public string ClavePersona { get; set; }

        public string nombrePersona { get; set; }

        public DateTime fechaInicioComparacion { get; set; }
        public DateTime fechaFinalComparacion { get; set; }
        public string ramita { get; set; }
        public DateTime? fechaInicioTramite { get; set; }
        public Boolean licenciado { get; set; }
    }
}
