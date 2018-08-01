using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_SegmentoMercado")]
    public class SegmentoMercado
    {
        public SegmentoMercado() { }

        [Key]
        public int SegmentoMercadoId { get; set; }

        [StringLength(250)]
        [Required]
        //[Index(IsUnique = true)]
        public string NomSegMerc { get; set; }

        [StringLength(300)]
        public string DesSegMerc { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

      
    }
}
