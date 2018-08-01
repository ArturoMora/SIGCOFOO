
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_BecarioExterno")]
    public class BecarioExterno
    {
        public int BecarioExternoId { get; set; }

        public string Becario_ClavePersona { get; set; }
        public string Becario_Nombre { get; set; }

        public string Asesor_ClavePersona { get; set; }
        public string Asesor_Nombre { get; set; }

        public DateTime ? FechaValidacion { get; set; }

        [Required]
        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        [Required]
        public int EstadoActivoId { get; set; }

        [Required]
        public int TipoBecaId { get; set; }
        public TipoBeca TipoBeca { get; set; }

        //Los que no tienen la palabra requerido es porque en SIGCO2 no tienen datos o es un campo nuevo
        [ForeignKey("Proyecto")]
        [StringLength(10)]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }
                
        public DateTime ? FechaInicio { get; set; }

        public DateTime ? FechaTermino { get; set; }

        public string Titulo { get; set; }

        public ICollection<AdjuntoBecarioExterno> AdjuntoBecarioExterno { get; set; }

        public string Descripcion { get; set; }

        public int ? InstitucionID{ get; set; }
        public Institucion Institucion { get; set; }


    }
}
