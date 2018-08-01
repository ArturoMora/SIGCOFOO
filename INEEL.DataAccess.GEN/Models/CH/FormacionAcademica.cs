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
    [Table("CH.tab_FormacionAcademica")]
    public class FormacionAcademica
    {
        public FormacionAcademica()
        {
            //EstadoFlujo = new EstadoFlujo();
        }

        [Key]
        public int FormacionAcademicaId { get; set; }

        public string ClavePersona { get; set; }

        public DateTime? FechaValidacion { get; set; }

        
        public int EstadoFlujoId { get; set; }
          public EstadoFlujo EstadoFlujo { get; set; }


        public int GradoAcademicoId { get; set; }
        public GradoAcademico GradoAcademico { get; set; }

        public int CarreraId { get; set; }
        public Carrera Carrera { get; set; }

        [StringLength(100)]
        public string Especialidad { get; set; }


        [StringLength(30)]
        public string Cedula { get; set; }

        public int InstitucionID { get; set; }
        public Institucion Institucion { get; set; }

        
        public string PaisID { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaTermino { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

        public Boolean EstaTitulado { get; set; }

        public DateTime? FechaValidacionTitulo { get; set; }


    }
}
