using INEEL.DataAccess.GEN.Models.CP;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class Correo
    {
        //Modulo: Descripcion detallada del modulo: "Capital Humano"
        public string Modulo { get; set; }
        //Empleado: Nombre de la persona que manda el correo( en caso de solicitudes ) o hacia quien va
        public string Empleado { get; set; }
        //Seccion de donde se envia el correo: "Formacion Academica"
        public string Seccion { get; set; }
        //Tipo de Correo: "1,2,3.......00" Define la plantilla del correo
        public string TipoCorreo { get; set; }
        //Clave de la Persona: clave de a quien va el correo, o quien lo manda
        public string ClavePersona { get; set; }
        //Descripcion (1,2,3,4) SE utiliza para añadir informacion al correo, ejemplo:
        //Estimado usuario le recordamos que su "(Descripcion1)" no coincide con el numero de "(Descripcion2)".......
        public string Descripcion1 { get; set; }
        public string Descripcion2 { get; set; }
        public string Descripcion3 { get; set; }
        public string Descripcion4 { get; set; }
        public string Descripcion5 { get; set; }
        public string Descripcion6 { get; set; }
        public string Descripcion7 { get; set; }
        public string Descripcion8 { get; set; }
        public string Descripcion9 { get; set; }
        public string Descripcion10 { get; set; }
        public string Descripcion11 { get; set; }
        public string Parametros { get; set; }
        public string ValoresParametros { get; set; }
        public string tituloON { get; set; }
        public string url { get; set; }
        public string copiaMandosMedios { get; set; }
        //Estado del correo en caso de solicitudes ejemplo: Aceptado/ Rechazado
        public string Estado { get; set; }

        [NotMapped]
        public string Justificacion { get; set; }
        [NotMapped]
        public int SeccionID { get; set; }
        [NotMapped]
        public string UnidadOrganizacionalId { get; set; }

        public UnidadOrganizacional UnidadOrganizacional { get; set; }

        [NotMapped]
        public string NombreProyecto { get; set; }
        public string OC { get; set; }
        /// <summary>
        /// si es diferente de IsNullOrEmpty, susutituirá al subject genérico de envío de correos.
        /// </summary>
        public String Subject { get; set; }

        public Boolean goSend { get; set; }

        [NotMapped]
        public string CorreoTo { get; set; }



        /// <summary>
        /// Este campo lo añadi para CP, representa el ID de una comunidad
        /// </summary>
        [NotMapped]
        public int id { get; set; }


        /// <summary>
        /// Este campo lo añadi para CP, representa el ID de una comunidad
        /// </summary>
        [NotMapped]
        public Agenda agenda { get; set; }


        public string pathToAttachment { get; set; }


        /// <summary>
        /// Este campo lo añadi para agregar a los coautores de cualquier OC
        /// </summary>
        [NotMapped]
        public string coautores { get; set; }


    }
}
