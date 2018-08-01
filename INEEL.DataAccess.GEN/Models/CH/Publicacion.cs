using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CH.Models
{
    [Table("CH.tab_Publicacion")]
    public class Publicacion
    {
        [Key]
        public int PublicacionId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

        public int RevistaId { get; set; }
        public Revista Revista { get; set; }

        [MaxLength(300)]
        public string TituloPublicacion { get; set; }

        [MaxLength(150)]
        public string Especialidad { get; set; }

        public int AmbitoId { get; set; }
        public Ambito Ambito { get; set; }

        public int NivelPublicacionId { get; set; }
        public NivelPublicacion NivelPublicacion { get; set; }

        [MaxLength(30)]
        public string Year { get; set; }

        [MaxLength(30)]
        public string Paginas { get; set; }

        public int EstadoPublicacionId { get; set; }
        public EstadoPublicacion EstadoPublicacion { get; set; }

        public DateTime FechaPublicacion { get; set; }

        public string PalabrasClave { get; set; }

        public string Numero { get; set; }

        public string Volumen { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [Required]
        public int EstadoActivoId { get; set; }


        //////Nuevos requerimientos

        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        public string nota { get; set; }

        [NotMapped]
        public Personas persona { get; set; }
    }
}
