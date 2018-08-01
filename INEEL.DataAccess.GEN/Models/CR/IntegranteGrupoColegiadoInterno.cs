using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace INEEL.DataAccess.CR.Models { 

    [Table("CR.tab_IntegranteGrupoColegiadoInterno")]
    public class IntegranteGrupoColegiadoInterno
    {

        public IntegranteGrupoColegiadoInterno() { }

        [Key]
        public int IntegranteGrupoColegiadoInternoId { get; set; }

        [ForeignKey("GrupoColegiadoPartInt")]
        public int GrupoColegiadoPartIntId { get; set; }
        public GrupoColegiadoPartInt GrupoColegiadoPartInt { get; set; }

        public string ClaveEmpleado { get; set; }
       
        [StringLength(250)]
        public string Nombre { get; set; }

        [StringLength(50)]
        [Required]
        public string CargoGC { get; set; }

        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

    }
}
