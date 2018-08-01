using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CH.Models;
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
    [Table("MT.ITFSatisfaccionCliente")]
    public class SatisCte
    {
        [Required]
        public int SatisCteId { get; set; }

        [Required]
        [ForeignKey("CalificacionCliente")]
        public int CalificacionClienteId { get; set; }
        public CalificacionCliente CalificacionCliente { get; set; }

        [Required]
        [StringLength(500)]
        public string Justificacion { get; set; }

        public long? AdjuntoId { get; set; }
        public Adjunto Adjunto { get; set; }

    }
}