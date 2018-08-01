using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_LineaDesarrolloTecnologico")]
    public class LineaDesarrolloTecnologico
    {
            
        public LineaDesarrolloTecnologico() { }

        [Key]
        public int LineaDesarrolloTecnologicoId { get; set; }

        [StringLength(250)]
        [Required]
        //[Index(IsUnique = true)]
        public string NomLinDesTec { get; set; }

        [StringLength(600)]
        public string DesLinDesTec { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

       
    }
}
