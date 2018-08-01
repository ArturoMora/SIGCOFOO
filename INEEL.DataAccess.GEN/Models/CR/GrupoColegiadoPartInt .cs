using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using INEEL.DataAccess.GEN.Models.GEN;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_GrupoColegiadoPartInt")]
    public class GrupoColegiadoPartInt
    {
        public GrupoColegiadoPartInt() { }

        [Key]
        public int GrupoColegiadoPartIntId { get; set; }

        public int Clave { get; set; }

        [StringLength(250)]
        [Required]
        public string Nombre { get; set; }

        [StringLength(300)]
        public string Descripcion { get; set; }

        [StringLength(250)]
        public string Calle { get; set; }

        [StringLength(250)]
        public string Colonia { get; set; }

        [StringLength(5)]
        public string CP { get; set; }

        [ForeignKey("Estados")]
        public int? EstadoId { get; set; }
        public Estados Estados { get; set; }

        [ForeignKey("Municipios")]
        public int? MunicipioId { get; set; }
        public Municipios Municipios { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [StringLength(250)]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        [Required] //titular
        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }

        [ForeignKey("NaturalezaInteraccion")]
        public int? NaturalezaInteraccionId { get; set; }
        public NaturalezaInteraccion NaturalezaInteraccion { get; set; }

        public ICollection<IntegranteGrupoColegiadoExterno> IntegranteGrupoColegiadoExterno { get; set; }
        public ICollection<IntegranteGrupoColegiadoInterno> IntegranteGrupoColegiadoInterno { get; set; }

        [NotMapped]
        public int[] IntegrantesE;

        [NotMapped]
        public string[] Cargos;
        //Para update
        [NotMapped]
        public int[] IntegrantesN;

        [NotMapped]
        public string[] CargosN;

        [NotMapped]
        public int[] integrantesAntDel;


        [NotMapped]
        public string[] IntegrantesIE;

        [NotMapped]
        public string[] NombresIE;

        [NotMapped]
        public string[] CargosI;
        //Para update
        [NotMapped]
        public string[] IntegrantesIN;

        [NotMapped]
        public string[] CargosIN;

        [NotMapped]
        public string[] integrantesAntDelI;
    }
}