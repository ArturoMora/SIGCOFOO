using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.CR.Models
{
    public class ProyectosClientes
    {
        public int NoProyectos { get; set; }
        public string NombreUnidad { get; set; }
        public string NombreUnidadEmpresa { get; set; }
        public string ClaveUnidad {get;set;}
        public string ClaveUnidadEmpresa {get;set;}
        public string CopiaNombreUnidad {get;set;}
        public int EmpresaId { get; set; }
        public int? IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }

        public string Adjunto64 {get;set;}
    }
}
