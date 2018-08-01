using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_Convenio")]
    public class Convenio
    {
        public Convenio() { }

        [Key]
        public int ConvenioId { get; set; }

        [ForeignKey("AmbitoConv")]
        public int? AmbitoConvId { get; set; }
        public AmbitoConv AmbitoConv { get; set; }
        
        [Required]
        [ForeignKey("TipoConvenio")]
        public int TipoConvenioId { get; set; }
        public TipoConvenio TipoConvenio { get; set; }

        [Required]
        [ForeignKey("Aliado")]
        public int AliadoId { get; set; }
        public Aliado Aliado { get; set; }

        //[StringLength(300)]
        public string ObjetoConvenio { get; set; }

        //[StringLength(300)]
        public string Observaciones { get; set; }
        
        public Boolean Indefinido { get; set; }

        //[StringLength(20)]
        public string NoConvenio { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        //[Required]
        public DateTime? FechaTermino { get; set; }

        [StringLength(15)]
        public string TipoAcceso { get; set; }

        [StringLength(200)]
        public string Firma { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        public ICollection<AreaConvenio> AreaConvenio { get; set; }
        public ICollection<AdjuntoPorConvenio> AdjuntoPorConvenio { get; set; }

        [NotMapped]
        public string[] AreasConvenio { get; set; }

        [NotMapped]
        public int[] AreasConvenioAntDel { get; set; }

        [NotMapped]
        public DateTime[] FechasAreaConvenio { get; set; }

        [NotMapped]
        public string[] AdjuntosRutaConvenio { get; set; }

        [NotMapped]
        public string[] AdjuntosNombreConvenio { get; set; }

        [NotMapped]
        public int[] adjuntosAntDel { get; set; }
        [NotMapped]
        public int[] adjuntosIdAntDel { get; set; }

        [NotMapped]
        public int EmpresaId { get; set; }

        [NotMapped]
        public DateTime fechaInicioComparacion { get; set; }

        [NotMapped]
        public DateTime fechaFinalComparacion { get; set; }

        [NotMapped]
        public string ClaveUnidad { get; set; }

        [NotMapped]
        public string busquedaFecha { get; set; }


    }
}