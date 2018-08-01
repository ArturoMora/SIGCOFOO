using INEEL.DataAccess.CH.Models;
using INEEL.DataAccess.GEN.Models.MT.ITF;
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
    [Table("MT.ITFInsumos")]
    public class Insumos
    {
        [Required]
        public int InsumosId { get; set; }

        [Required]
        [StringLength(100)]
        public string NombreIns { get; set; }

        [Required]
        [StringLength(300)]
        public string DescripcionIns { get; set; }

        [ForeignKey("TipoInsumo")]
        [Required]
        public int TipoIns { get; set; }
        public TipoInsumo TipoInsumo { get; set; }


        public int ArchivoInsId { get; set; }

        [Required]
        [StringLength(150)]
        public string ResponsableIns { get; set; }

        [Required]
        [StringLength(500)]
        public string UbicacionResIns { get; set; }

        [ForeignKey("TipoAcceso")]
        [Required]
        public int TipoAccesoIns { get; set; }
        public TipoAcceso TipoAcceso { get; set; }

        public ICollection<AdjuntoITFInsumo> AdjuntoITFInsumo { get; set; }

        [ForeignKey("InformeTecnicoFinal")]
        public String InformeTecnicoFinalId { get; set; }
        public InformeTecnicoFinal InformeTecnicoFinal { get; set; }


    }
}
