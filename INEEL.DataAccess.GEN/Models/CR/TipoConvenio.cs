using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.cat_TipoConvenio")]
    public class TipoConvenio
    {
        public TipoConvenio() { }

        [Key]
        public int ConvenioId { get; set; }

        [StringLength(250)]
        [Required]
        //[Index(IsUnique = true)]
        public string NomTipConv { get; set; }

        [StringLength(300)]
        [Required]
        public string DescTipConv { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        [Required]
        public Boolean Estado { get; set; }

    }
}
