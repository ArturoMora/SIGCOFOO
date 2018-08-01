using INEEL.DataAccess.MT.Models.ITF.catalogos;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.MT.Models.ITF
{
    [Table("MT.InformeTFgeneral")]
    public class ITFgeneral
    {
        [Key]
        [StringLength(25)]
        [Required]
        public String ITFgeneralId { get; set; }

        [Required]        
        [Column(TypeName = "varchar(MAX)")]
        [MaxLength]        
        public string Resumen { get; set; }

        [ForeignKey("TipoAcceso")]
        public int AccesoTipo { get; set; }
        public TipoAcceso TipoAcceso { get; set; }

        public ICollection<AdjuntoITF> AdjuntoITF { get; set; }
    }
}
