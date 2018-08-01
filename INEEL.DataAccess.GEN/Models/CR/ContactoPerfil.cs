using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ContactosPerfil")]
    public class ContactoPerfil
    {
        public ContactoPerfil() { }

        [Key]
        public int ContactoPerfilId { get; set; }

        [Required]
        [ForeignKey("GradoAcademico")]
        public int GradoAcademicoId { get; set; }
        public GradoAcademico GradoAcademico { get; set; }

        [Required]
        [ForeignKey("Carrera")]
        public int CarreraId { get; set; }
        public Carrera Carrera { get; set; }

        public string Especialidad { get; set; }

        [Required]
        [ForeignKey("Institucion")]
        public int InstitucionID { get; set; }
        public Institucion Institucion { get; set; }

        [Required]
        [ForeignKey("Pais")]
        public int PaisID { get; set; }
        public Pais Pais { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaFinal { get; set; }

        [Required]
        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }
    }
}
