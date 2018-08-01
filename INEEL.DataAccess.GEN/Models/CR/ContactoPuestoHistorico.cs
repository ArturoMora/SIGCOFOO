using INEEL.DataAccess.CH.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    [Table("CR.tab_ContactosPuesto")]
    public class ContactoPuestoHistorico
    {
        public ContactoPuestoHistorico() { }

        [Key]
        public int ContactoPuestoHistoricoId { get; set; }

        [Required]
        public string Puesto { get; set; }

        [Required]
        [ForeignKey("Empresa")]
        public int EmpresaId { get; set; }
        public Empresa Empresa { get; set; }

        
        public DateTime? FechaInicio { get; set; }

        
        public DateTime? FechaFinal { get; set; }

        public string ClaveUnidad { get; set; }
        [NotMapped]
        public UnidadOrganizacionalEmpresas Unidad { get; set; }

        [Required]
        [ForeignKey("Contacto")]
        public int ContactoId { get; set; }
        public Contacto Contacto { get; set; }
        [NotMapped]
        public decimal Antiguedad
        {
            get
            {
                TimeSpan dif;

                if (FechaFinal != null)
                {
                    dif = (Convert.ToDateTime(FechaFinal) - Convert.ToDateTime(FechaInicio));
                }
                else {
                    DateTime Hoy = DateTime.Today;
                    dif = Hoy - Convert.ToDateTime(FechaInicio);
                }
                
                decimal ret = decimal.Round(Convert.ToDecimal(dif.TotalDays / 365.25), 2);
                return ret;
            }
            set {
                return;    
            }
        }
    }
}
