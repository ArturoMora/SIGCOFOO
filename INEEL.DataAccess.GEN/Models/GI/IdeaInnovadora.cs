
using INEEL.DataAccess.GEN.Models.CP;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace INEEL.DataAccess.GEN.Models.GI
{
    [Table("GI.tab_IdeaInnovadora")]
    public class IdeaInnovadora
    {
        [Key]
        public int IdeaInnovadoraId { get; set; }





        //Relacion con AutoresIdeasInnovadorasId
        public string NombreIdea { get; set; }
        public string PalabrasClave { get; set; }
        public string Problema { get; set; }
        public string Limitaciones { get; set; }
        public string RazonesInexistncia { get; set; }
        public string RelevanciaNuevaSolucion { get; set; }
        public string PartesInteresadasBeneficiadas { get; set; }
        public string Capacidades { get; set; }
        public string DescripcionDesarrollo { get; set; }
        public string BarrerasTecnologicas { get; set; }
        public string CapacidadServicio { get; set; }
        public string OfertaValor { get; set; }
        public string ProtegerDesarrolloTecnologico { get; set; }
        public string ClietesPotenciales { get; set; }
        public string DedicacionClientesP { get; set; }
        public string BeneficiosCliente { get; set; }

        public int? ComunidadPracticaId { get; set; }
        public Comunidad Comunidad { get; set; }

        public long? AdjuntoId { get; set; }

        public Adjunto Adjunto { get; set; }

        //public string P_Adjunto { get; set; }

        public DateTime? FechaRegistro { get; set; }




        public string ClavePersona { get; set; }
        public DateTime? FechaValidacion { get; set; }
        //public string P_EstadoFlujo { get; set; }
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }
        [ForeignKey("TipoAccesoGI")]
        public int TipoAcceso { get; set; }
        public TipoAccesoGI TipoAccesoGI { get; set; }
        public float? Calificacion { get; set; }

        [NotMapped]
        public string proponenteNombre { get; set; }
        [NotMapped]
        public string ClaveProponentePrincipal { get; set; }
        [NotMapped]
        public Boolean AccesoPublico { get; set; }
        [NotMapped]
        public string busqueda { get; set; }
        [NotMapped]
        public string busquedaFecha { get; set; }
        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }
        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }
    }
}
