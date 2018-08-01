using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace INEEL.DataAccess.GEN.Models.CH
{
    [Table("CH.tab_FamiliaUnidad")]
    public class FamiliaUnidad
    {
        [Key]
        public int FamiliaUnidadId { get; set; }

      
        [ForeignKey("familia")]
        public int? FamiliaPuestosId { get; set; }
        public FamiliasPuestos familia { get; set; }

        [StringLength(4)]
        public string periodo { get; set; }

        public int Estado { get; set; }

        [ForeignKey("tipoarea")]
        public int? TipoAreaId { get; set; }
        public TipoArea tipoarea { get; set; }


        [StringLength(5)]
        public string unidad { get; set; }


        [StringLength(100)]
        public string nomUnidad { get; set; }



    }
}
