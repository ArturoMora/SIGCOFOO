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
    [Table("CH.tab_Ponencia")]
    public class Ponencia
    {
        [Key]
        public int PonenciaId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        public int EstadoFlujoId { get; set; }
        public EstadoFlujo EstadoFlujo { get; set; }

        public int CongresoId { get; set; }
        public Congreso congreso { get; set; }

        [MaxLength(300)]
        public string TituloPonencia { get; set; }

        [MaxLength(150)]
        public string Especialidad { get; set; }

        public DateTime? FechaInicio { get; set; }

        public int AmbitoId { get; set; }
        public Ambito Ambito { get; set; }

        public int NivelPublicacionId { get; set; }
        public NivelPublicacion NivelPublicacion { get; set; }

        [MaxLength(10)]
        public string year { get; set; }

        [MaxLength(30)]
        public string Paginas { get; set; }

        //[MaxLength(150)]
        //public string LugarCongreso { get; set; }
        public int? PaisID { get; set; }
        public Pais Pais { get; set; }

        public int EstadoPonenciaId { get; set; }
        public EstadoPonencia EstadoPonencia { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        [MaxLength(300)]
        public string PalabrasClave { get; set; }

        [MaxLength(5)]
        public string Numero { get; set; }

        [Required]
        public int EstadoActivoId { get; set; }

        ///Nuevos requerimientos

        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        public string nota { get; set; }

        [NotMapped]
        public int yearAux { get; set; }

    }
}
