using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.GEN.Models.CR;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_Aliado")]
    public class Aliado
    {
        public Aliado() { }

        [Key]
        public int AliadoId { get; set; }

        [Required]
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        
        [ForeignKey("Contacto")]
        public int? ContactoId { get; set; }
        public Contacto Contacto { get; set; }


        [StringLength(300)]
        public string Descripcion { get; set; }

        [Required]
        public DateTime FechaRegistro { get; set; }

        [StringLength(250)]
        [Required]
        public string Autor { get; set; }

        public Boolean Estado { get; set; }

        public ICollection<Convenio> Convenio { get; set; }
        public ICollection<ActividadAdicional> ActividadAdicional { get; set; }

        [NotMapped]
        public int TipoConvenio { get; set; }

        [NotMapped]
        public string ObjetoConvenio { get; set; }

        [NotMapped]
        public string NoConvenio { get; set; }

        [NotMapped]
        public DateTime FechaInicioConvenio { get; set; }

        [NotMapped]
        public DateTime FechaTerminoConvenio { get; set; }

        [NotMapped]
        public string TipoAccesoConvenio { get; set; }

        [NotMapped]
        public string observacion { get; set; }
        [NotMapped]
        public bool indefinido { get; set; }

        [NotMapped]
        public int AmbitoConvenio { get; set; }

        [NotMapped]
        public string NomFirmaConvenio { get; set; }

        //--------------------------
        [NotMapped]
        public string[] AreasConvenio { get; set; }

        [NotMapped]
        public DateTime[] FechasAreaConvenio { get; set; }

        //-------------------------------------------------
        [NotMapped]
        public string[] AdjuntosRutaConvenio { get; set; }

        [NotMapped]
        public string[] AdjuntosNombreConvenio { get; set; }

        //Atributos para actividad
        [NotMapped]
        public string DescripcionActividad { get; set; }

        [NotMapped]
        public DateTime FechaActividad { get; set; }

        [NotMapped]
        public string[] AreasActividad { get; set; }

        [NotMapped]
        public DateTime[] FechasAreaActividad { get; set; }

        [NotMapped]
        public string[] ClavePersonaActividad { get; set; }

        [NotMapped]
        public string[] RUPersonaActividad { get; set; }

        [NotMapped]
        public DateTime[] FechasPersonaActividad { get; set; }

        [NotMapped]
        public virtual ICollection<Contacto> listaContactos { get; set; }

        [NotMapped]
        public virtual ICollection<ContactosPorAliados> listaContactosRegistrados { get; set; }
    }
}