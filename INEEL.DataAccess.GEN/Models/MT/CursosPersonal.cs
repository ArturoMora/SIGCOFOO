using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace INEEL.DataAccess.MT.Models
{
    [Table("MT.CursosPersonal")]
    public class CursosPersonal
    {
        public int CursosPersonalId { get; set; }

        [ForeignKey("Proyecto")]
        [StringLength(10)]
        [Required]
        public string ProyectoId { get; set; }
        public Proyecto Proyecto { get; set; }

        [Required]
        [StringLength(300)]
        public string Titulo { get; set; }

        public ICollection<AutoresCursosPersonal> AutoresCursosPersonal { get; set; }

        [Required]
        public DateTime FechaCurso { get; set; }

        [ForeignKey("TipoCurso")]
        [Required]
        public int TipoCursoId { get; set; }
        public TipoCurso TipoCurso { get; set; }

        [Required]
        [StringLength(500)]
        public string Descripcion { get; set; }

        public ICollection<AdjuntoCursosPersonal> AdjuntoCursosPersonal { get; set; }

        [Required]
        public int EstadoActivoId { get; set; }

        public DateTime? FechaValidacion { get; set; }


        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }

    }
}

