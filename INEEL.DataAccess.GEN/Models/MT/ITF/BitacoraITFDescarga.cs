using INEEL.DataAccess.MT.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.MT.ITF
{
    [Table("MT.BitacoraITFDescarga")]
    public class BitacoraITFDescarga
    {
        [Key]
        public long BitacoraITFDescargaId { get; set; }
        public DateTime FechaMovimiento { get; set; }
        public string ClavePersona { get; set; }
        public string Ip { get; set; }

        [ForeignKey("InformeTecnicoFinal")]
        [Required]
        public String InformeTecnicoFinalId { get; set; }
        public InformeTecnicoFinal InformeTecnicoFinal { get;set;}
    }
}
