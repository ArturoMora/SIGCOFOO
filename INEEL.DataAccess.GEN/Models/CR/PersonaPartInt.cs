using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_PersonaPartInt")]
    public class PersonaPartInt
    {
        public PersonaPartInt() { }

        [Key]
        public int PersonaPartIntId { get; set; }

        //public int Clave { get; set; }

        [StringLength(250)]
        [Required]
        public string Nombre { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        //[StringLength(250)]
        //public string Calle { get; set; }

        //[StringLength(250)]
        //public string Colonia { get; set; }

        //[StringLength(5)]
        //public string CP { get; set; }

        //[ForeignKey("Estados")]
        //public int? EstadoId { get; set; }
        //public Estados Estados { get; set; }

        //[ForeignKey("Municipios")]
        //public int? MunicipioId { get; set; }
        //public Municipios Municipios { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        //[Required]
        //[StringLength(250)]
        //public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [Required]
        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        [Required]
        [ForeignKey("NaturalezaInteraccion")]
        public int NaturalezaInteraccionId { get; set; }
        public NaturalezaInteraccion NaturalezaInteraccion { get; set; }

    }
}